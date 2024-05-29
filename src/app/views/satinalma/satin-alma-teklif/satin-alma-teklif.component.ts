import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DxDataGridComponent } from 'devextreme-angular';
import moment from 'moment';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { GenelApi, EkranMesaj } from 'src/app/services/GenelSrc';
import { FilterMod, KullaniciYetki } from 'src/app/services/KullaniciSrc';
import { NotifyService } from 'src/app/services/notify';
import { ConnTeklifMas, TalepsrcService } from 'src/app/services/SatinAlmaSrc';
import { TabService } from 'src/app/services/tab.service';
import { Tab } from 'src/app/services/tabs-mod';
import { CofirmsrcService } from 'src/app/utils/confirm-dialog/cofirmsrc.service';
import { SatinAlmaTalepDetayComponent } from '../satin-alma-talep-detay/satin-alma-talep-detay.component';
import { SatinAlmaTeklifDetayComponent } from '../satin-alma-teklif-detay/satin-alma-teklif-detay.component';

@Component({
  selector: 'app-satin-alma-teklif',
  templateUrl: './satin-alma-teklif.component.html',
  styleUrls: ['./satin-alma-teklif.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers:[
    {provide:DatePipe},
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } }
  ]
})
export class SatinAlmaTeklifComponent implements OnInit {
  @ViewChild('gridTeklifList', { static: false }) grid!: DxDataGridComponent;
  @BlockUI() blockUI!: NgBlockUI;
  tekliflist: ConnTeklifMas[]=[]; 
  selectedItemKeys: any[] = [];
  silgoster:boolean=false;
  filter!:FilterMod; 
  secilidata!:ConnTeklifMas;
  allMode: string="";
  checkBoxesMode: string="";
  @Input() data:any;     
  yetki:KullaniciYetki; 
  onayid:number=0;
  
  constructor(
    private tabService: TabService,
    private talepsrc:TalepsrcService,
    private alertify:NotifyService,
    private confirmationDialogService: CofirmsrcService,
    private modalService: NgbModal,
    private genelsrc:GenelApi,
    ) {   
      this.allMode = 'allPages';
      this.checkBoxesMode = 'always';
      this.yetki=new  KullaniciYetki();
    }

  ngOnInit() {
    this.yetki = this.data?.yetki; 
    let date=new Date; 
    let baslangic=new Date(date.getUTCFullYear(),date.getUTCMonth(),1); 
    this.filter = new FilterMod(baslangic,date); 
    this.TeklifListele();  
  }

  cariDblClick(e:any) {
    if(e.rowType === "data" && e.column.dataField === "DocEntry") {
  
   }
  }

  teklifDetay(teklif:ConnTeklifMas){ 
    this.tabService.addTab(new Tab(SatinAlmaTeklifDetayComponent, "Teklif Detay - "+ teklif.Id , { parent: "AppComponent", _teklif:teklif,yetki:this.yetki },0));
  }
 
  async TeklifListele()  {
    this.blockUI.start(EkranMesaj.Listele);
      (await this.talepsrc.GetTeklifList(0,this.filter.Baslangic,this.filter.Bitis)).subscribe(
        data=>{
          this.blockUI.stop(); 
          if(!data.Success){
            this.alertify.warning(data.Message);
            return;
          }
          this.tekliflist=data.List;
        }
      )     
  }


  silgosterChanged(e:any){ 
    let silinecekler  = this.grid.instance.getSelectedRowsData(); 
    this.selectedItemKeys = e.selectedRowKeys;
  
    if (silinecekler!=null && silinecekler.length>0){ 
      this.silgoster=true;  
      this.secilidata = silinecekler[0]; 
  
    }
    else {
      this.silgoster=false; 
    }
  }

  async kayitsil(){   
    let silinecekler  = this.grid.instance.getSelectedRowsData(); 
 
    if(silinecekler==null || silinecekler.length<=0){
      this.alertify.warning("Seçim Yapılmadı!") 
      return;
    } 
  
    this.confirmationDialogService.confirm('Sil','Seçili Satırlar Silinecek, Devam Edilsin mi?')
    .then(async (confirmed:any) => 
    {
      if(confirmed.sonuc==true)  {
        this.blockUI.start(EkranMesaj.Kaydet);
        var sonuc = await this.talepsrc.TeklifSil(silinecekler);
          if(sonuc.Success==true){
            this.alertify.success(EkranMesaj.KayitTamamlandi);   
          } else{
          this.alertify.warning(sonuc.Message);
          }
          this.blockUI.stop(); 
          this.TeklifListele(); 
      }
    })
    .catch(() => { 
    });  
  }  

  Aciklama:string="";
  teklifIptalMod(content:any){   
    let list  = this.grid.instance.getSelectedRowsData() as ConnTeklifMas[]; 
 
    if(list==null || list.length<=0){
      this.alertify.warning("Seçim Yapılmadı!") 
      return;
    } 
    else{
      this.Aciklama=""; 
      this.modalService.open(content, {  size: 'lg',windowClass: 'modalcss40', backdrop: 'static' });  
    }    
  } 

  async teklifIptal(){   
    if(this.Aciklama==""){
      this.alertify.warning("Açıklama Alanı Zorunludur!");  
      return;
    } 

    let list  = this.grid.instance.getSelectedRowsData() as ConnTeklifMas[]; 
 
    if(list==null || list.length<=0){
      this.alertify.warning("Seçim Yapılmadı!") 
      return;
    } 
    else{
      this.confirmationDialogService.confirm('Teklif İptal','Teklif İptal Edilecek, Devam Edilsin mi?')
    .then(async (confirmed:any) => 
    {
      if(confirmed.sonuc==true)  { 
        this.blockUI.start(EkranMesaj.Kaydet);
        var sonuc = await this.talepsrc.TeklifIptal(list[0],this.Aciklama);
          if(sonuc.Success==true){
            this.alertify.success(EkranMesaj.KayitTamamlandi);  
            this.modalService.dismissAll();
            this.TeklifListele();  
          } else{
          this.alertify.warning(sonuc.Message);
          }
          this.blockUI.stop();  
      }
    })
    .catch(() => {
    });
    }   
  }

  onaytakip(content:any,data:ConnTeklifMas){
    if(data.OnayId<=0){
      this.alertify.warning("Onay Bilgisi Okunamadı!");
      return;
    }
    
    this.onayid=data.OnayId;
    this.modalService.open(content, {  size: 'lg',windowClass: 'onaytakipmodal', backdrop: 'static' });   
  } 

  BasTarihChg(e:any){
    this.filter.Baslangic=moment(e._d).format("yyyy-MM-DD"); 
  }

  BitTarihChg(e:any){
    this.filter.Bitis=moment(e._d).format("yyyy-MM-DD"); 
  } 

  talepDetay(talep:ConnTeklifMas){ 
    var yetki = new KullaniciYetki;
    yetki.Export = true;
    yetki.Ekle=false;
    yetki.Guncelle=false;
    yetki.Sil=false;
   this.tabService.addTab(new Tab(SatinAlmaTalepDetayComponent, "Talep Detay - "+ talep.TalepId , { parent: "AppComponent", _talepid:talep.TalepId,yetki:yetki,Kontrol:true },0));
 }
}
