import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DxDataGridComponent } from 'devextreme-angular';
import moment from 'moment';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subject, ReplaySubject } from 'rxjs';
import { GenelApi, EkranMesaj } from 'src/app/services/GenelSrc';
import { FilterMod, KullaniciYetki, KullaniciModel } from 'src/app/services/KullaniciSrc';
import { NotifyService } from 'src/app/services/notify';
import { TalepDetail, ConnTeklifMas, ConnTeklifFirma, Customer, TalepsrcService } from 'src/app/services/SatinAlmaSrc';
import { TabService } from 'src/app/services/tab.service';
import { CofirmsrcService } from 'src/app/utils/confirm-dialog/cofirmsrc.service';
import { SatinAlmaTeklifDetayComponent } from '../satin-alma-teklif-detay/satin-alma-teklif-detay.component';

@Component({
  selector: 'app-satin-alma-teklif-hazirlik',
  templateUrl: './satin-alma-teklif-hazirlik.component.html',
  styleUrls: ['./satin-alma-teklif-hazirlik.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers:[
    {provide:DatePipe},
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } }
  ]
})
export class SatinAlmaTeklifHazirlikComponent implements OnInit {
  @ViewChild('gridTeklifHazirlik', { static: false }) grid!: DxDataGridComponent;
  @BlockUI() blockUI!: NgBlockUI;
  taleplist: TalepDetail[]=[]; 
  selectedItemKeys: any[] = [];
  silgoster:boolean=false;
  allMode: string="";
  checkBoxesMode: string="";
  secilidata:TalepDetail[]=[];
  filter!:FilterMod; 
  teklifhazirliklist:TalepDetail[]=[];   
  teklif:ConnTeklifMas;
  @Input() data:any;     
  yetki:KullaniciYetki;
  totalrows:number=0;  
  secilifirmalist:ConnTeklifFirma[]=[];
  firmalist:Customer[]=[];
  secilifirma:Customer;
  kalemkeyword:string=""; 
  loguser:KullaniciModel;  
  
  protected _onDestroy = new Subject<void>();

  public formFirma: FormControl = new FormControl();
  public filterFirma: ReplaySubject<ConnTeklifFirma[]> = new ReplaySubject<ConnTeklifFirma[]>(1);

  constructor(
    private tabService: TabService,
    private talepsrc:TalepsrcService,
    private alertify:NotifyService,
    private confirmationDialogService: CofirmsrcService,
    private modalService: NgbModal,
    private genelsrc:GenelApi, 
    ) {  
      this.teklif=new ConnTeklifMas(); 
      this.allMode = 'allPages';
      this.checkBoxesMode = 'always';
      this.yetki=new  KullaniciYetki(); 
      this.secilifirma=new Customer();  
    }

  ngOnInit() {
    this.yetki = this.data?.yetki;  
    this.loguser = JSON.parse(sessionStorage.getItem('data')??"") as KullaniciModel;
    let date=new Date; 
    let baslangic=new Date(date.getUTCFullYear(),date.getUTCMonth(),1); 
    this.filter = new FilterMod(baslangic,date); 
    this.TalepListele();  
  }

  
  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();   
 }

  cariDblClick(e:any) {
    if(e.rowType === "data" && e.column.dataField === "DocEntry") {
  
   }
  } 
 
  async TalepListele()  {
    this.blockUI.start(EkranMesaj.Listele);
      (await this.talepsrc.GetTeklifHazirlik(this.filter.Baslangic,this.filter.Bitis)).subscribe(
        data=>{
          this.blockUI.stop(); 
          if(!data.Success){
            this.alertify.warning(data.Message);
            return;
          }
          this.taleplist=data.List;
        }
      )     
  }

  silgosterChanged(e:any){
    let silinecekler  = this.grid.instance.getSelectedRowsData();
    this.selectedItemKeys = e.selectedRowKeys;
    this.secilikalem =new TalepDetail();
    this.silgoster=false;
    this.evrekyuklegoster=false;

    if (silinecekler!=null && silinecekler.length==1){
      this.silgoster=true;
      this.evrekyuklegoster=true;
      this.secilikalem = silinecekler[0];
      this.secilidata = silinecekler; 
    }
    else if (silinecekler!=null && silinecekler.length>1){
      this.silgoster=true;
      this.secilidata = silinecekler; 
    }
  }

  async teklifHazirla(){
    if(this.teklif.Firma1Kodu==""){
      this.alertify.warning("Teklif Çalışması İçin En Az 1 Firma Seçilmelidir!");
      return;
    }

    if(this.teklif.Firma1Kodu!="" && this.teklif.Firma2Kodu!="" && this.teklif.Firma1Kodu==this.teklif.Firma2Kodu ){
      this.alertify.warning("Aynı Firmalar Seçilemez!");
      return;
    }

    if(this.teklif.Firma3Kodu!="" && this.teklif.Firma1Kodu!="" && this.teklif.Firma1Kodu==this.teklif.Firma3Kodu){
      this.alertify.warning("Aynı Firmalar Seçilemez!");
      return;
    }

    if(this.teklif.Firma2Kodu!="" && this.teklif.Firma3Kodu!="" && this.teklif.Firma2Kodu==this.teklif.Firma3Kodu){
      this.alertify.warning("Aynı Firmalar Seçilemez!");
      return;
    } 

    if(this.teklifhazirliklist.length<=0){
      this.alertify.warning("Teklif Alınacak Malzemeler Seçilmedi!");
      return;
    }
    else{     
      this.confirmationDialogService.confirm('Teklif', 'Seçili Kalemler İçin Teklif Formu Hazırlanacak, Devam Edilsin mi?')
      .then(async (confirmed:any) => 
      {
        if(confirmed.sonuc==true)  {
          this.blockUI.start("Kayıt Başladı...");
          var sonuc = await this.talepsrc.TeklifHazirlik(this.teklif,this.teklifhazirliklist);
          if(sonuc.Success==true){
            this.alertify.success("Teklif Hazırlık Tamamlandı!");        
            this.modalService.dismissAll();
            this.teklif.Id=sonuc.Id;
           

     
            this.TalepListele();
          } else{
          this.alertify.warning(sonuc.Message);
          }
          this.blockUI.stop(); 
        }
      })
      .catch((err) => {
        this.alertify.warning("Hata Oluştu! "+err);
      });
    }
    
  }

  teklifModal(content:any){
    if(this.secilidata==null || this.secilidata.length<=0){
      this.alertify.warning("Seçim Yapılmadı!") 
      return;
    }
    this.teklifhazirliklist=[];
    this.firmalist=[];

    var ttl:number[]=[];
    this.secilidata.forEach(el => {
      if(ttl.filter((x)=>x==el.TalepId).length<=0){
        ttl.push(el.TalepId);
      }
    })

    if(ttl.length>1){
      this.alertify.warning("Talep Birleştirilemez!");
      return;
    } 

    this.secilidata.forEach(item=> { 
      item.TeklifMiktar=item.Miktar;
      item.TahminiTutar=item.BirimTutar;
      this.teklifhazirliklist.push(item);
      this.teklif=new ConnTeklifMas();
      this.teklif.DurumId=0;
      this.teklif.Tarih=new Date;
      this.teklif.SapSirketId = this.loguser.AktifSirket;
      this.teklif.OnayId=0;
    }); 
    this.modalService.open(content, {  size: 'lg',windowClass: 'modalcss80', backdrop: 'static' , keyboard:false}); 
  }

  BasTarihChg(e:any){
    this.filter.Baslangic=moment(e._d).format("yyyy-MM-DD"); 
  }

  BitTarihChg(e:any){
    this.filter.Bitis=moment(e._d).format("yyyy-MM-DD"); 
  } 

  firmasecim:number=0;
  firmaSec(content:any,firma:number){
    this.firmasecim=firma; 
    this.secilifirma=new Customer();     
    this.modalService.open(content, {  size: 'lg',windowClass: 'modalcss60', backdrop: 'static'}); 
  }

  async kalemAra(ev:any){ 
    if(this.kalemkeyword==""){
      this.alertify.warning("Aramak İstediğiniz Firmayı Kısaca Yazın...");
      return;
    }

    if (ev.keyCode === 13 && this.kalemkeyword!="") { 
      this.blockUI.start(EkranMesaj.Listele);
      var data = await this.genelsrc.CariList(this.kalemkeyword??"",50,"S","");
      this.blockUI.stop(); 
      if(!data.Success){
        this.alertify.warning(data.Message);
        return;
      }
      this.firmalist=data.List;     
    }
  }  

  firmaSecimYap(){ 
    if(this.firmasecim==1){
      this.teklif.Firma1Kodu=this.secilifirma.FirmaKodu;   
      this.teklif.Firma1Adi=this.secilifirma.FirmaAdi;    
    } 
    else if(this.firmasecim==2){
      this.teklif.Firma2Kodu=this.secilifirma.FirmaKodu;   
      this.teklif.Firma2Adi=this.secilifirma.FirmaAdi;    
    } 
    else if(this.firmasecim==3){
      this.teklif.Firma3Kodu=this.secilifirma.FirmaKodu;   
      this.teklif.Firma3Adi=this.secilifirma.FirmaAdi;    
    }  
    else if(this.firmasecim==4){
      this.teklif.Firma4Kodu=this.secilifirma.FirmaKodu;   
      this.teklif.Firma4Adi=this.secilifirma.FirmaAdi;    
    }  
    else if(this.firmasecim==5){
      this.teklif.Firma5Kodu=this.secilifirma.FirmaKodu;   
      this.teklif.Firma5Adi=this.secilifirma.FirmaAdi;    
    }  

    document.getElementById("tklmodkapatid")?.click();  
  }

  onFirmaChg(e:any){
    let secim = e?.selectedRowsData[0] ?? null;
    if(secim!=null){
      this.secilifirma = secim;
    } 
  }

  firmaTemizle(firma:number){
    if(firma==1){
      this.teklif.Firma1Kodu="";   
      this.teklif.Firma1Adi="";  
    } 
    else if(firma==2){
      this.teklif.Firma2Kodu="";   
      this.teklif.Firma2Adi="";  
    } 
    else if(firma==3){
      this.teklif.Firma3Kodu="";   
      this.teklif.Firma3Adi="";  
    } 
    else if(firma==4){
      this.teklif.Firma4Kodu="";   
      this.teklif.Firma4Adi="";  
    } 
    else if(firma==5){
      this.teklif.Firma5Kodu="";   
      this.teklif.Firma5Adi="";  
    } 
  }

  aramaTemizle(){
    this.kalemkeyword="";
    this.firmalist=[];
  }

  evrekyuklegoster:boolean=false;
  secilikalem:TalepDetail;
  belgeYukleModal(content:any){
    if(this.secilikalem==null || this.secilikalem.Id<=0){
      this.alertify.success("Seçim Yapılmadı!");
      return;
    }
    this.modalService.open(content, {  size: 'lg',windowClass: 'belgeyuklemodal', backdrop: 'static' });
  }

  tarihceDetay(content:any,data:TalepDetail){
    this.secilikalem=data;
    this.modalService.open(content, {  size: 'lg',windowClass: 'modalcss45', backdrop: 'static' });   
  }  

  Aciklama:string="";
  talepIptalMod(content:any){   
    if(this.secilidata==null || this.secilidata.length<=0){
      this.alertify.warning("Seçim Yapılmadı!") 
      return;
    }
    this.Aciklama=""; 
    this.modalService.open(content, {  size: 'lg',windowClass: 'modalcss40', backdrop: 'static' });  
  } 
  
  async talepIptal(){   
    if(this.secilidata==null || this.secilidata.length<=0){
      this.alertify.warning("Seçim Yapılmadı!") 
      return;
    }
    if(this.Aciklama==""){
      this.alertify.warning("Açıklama Alanı Zorunludur!");  
      return;
    } 

    this.confirmationDialogService.confirm('İptal','Seçili Kalemler İptal Edilecek, Geri Alma İşlemi Yapılamaz, Devam Edilsin mi?')
    .then(async (confirmed:any) => 
    {
      if(confirmed.sonuc==true)  {
        this.blockUI.start(EkranMesaj.Kaydet);
        var sonuc = await this.talepsrc.TeklifHazirlikIptal(this.secilidata,this.Aciklama);
          if(sonuc.Success==true){
            this.alertify.success(EkranMesaj.KayitTamamlandi);  
          } else{
          this.alertify.warning(sonuc.Message);
          }
          this.blockUI.stop();  

          this.modalService.dismissAll();
          this.TalepListele();  
      }
    })
    .catch(() => {
    }); 
  }

}
