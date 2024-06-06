import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DxDataGridComponent } from 'devextreme-angular';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { GenelApi, IslemTipi, EkranMesaj } from 'src/app/services/GenelSrc';
import { KullaniciYetki, YetkiGrup, KullaniciSrcService } from 'src/app/services/KullaniciSrc';
import { NotifyService } from 'src/app/services/notify';
import { TabService } from 'src/app/services/tab.service';
import { Tab } from 'src/app/services/tabs-mod';
import { CofirmsrcService } from 'src/app/utils/confirm-dialog/cofirmsrc.service';
import { GrupYetkiDetayComponent } from '../grup-yetki-detay/grup-yetki-detay.component';

@Component({
  selector: 'app-grup-yetki',
  templateUrl: './grup-yetki.component.html',
  styleUrls: ['./grup-yetki.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers:[
    {provide:DatePipe},
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } } 
  ]
})
export class GrupYetkiComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  @ViewChild('gridYetkiGrup', { static: false }) secgrup!: DxDataGridComponent;
  @ViewChild('gridGrupYetkiDetay', { static: false }) secyetki!: DxDataGridComponent;
  @Input() data:any;     
  yetki:KullaniciYetki;
  datalist: YetkiGrup[]=[];    
  silgoster:boolean=false;  
  kaydetgoster:boolean=false;  
  secilidata:YetkiGrup; 
  isReadOnly: boolean=false;      
  yetkilist:  KullaniciYetki[]=[]; 
  SapSirket:string=""; 
  allMode: string="";
  checkBoxesMode: string="";  

  constructor(  
    private genelsrv:GenelApi,
    private modalService: NgbModal,
    private alertify:NotifyService ,
    private confirmationDialogService: CofirmsrcService, 
    private kullanicisrc:KullaniciSrcService,
    private tabService: TabService, 
    ) 
    {  
      this.allMode = 'allPages';
      this.checkBoxesMode = 'always';
      this.secilidata=new YetkiGrup();  
      this.yetki=this.kullanicisrc.userperm.filter((x)=>x.YetkiKodu=="YT0008")[0];
    }   

  ngOnInit() {    
    this.yetki = this.data?.yetki;  
    this.DataListele();    
  }   
 
  async kaydet(){   
      if(this.secilidata.GrupAdi == ""){
        this.alertify.warning("Grup Adı Alanı Zorunludur!") 
        return;
      } 
  
      this.blockUI.start("Kayıt Başladı...");
      var sonuc = await this.kullanicisrc.YetkiGrupEkle(this.secilidata,this.secilidata.Id>0?IslemTipi.Guncelle:IslemTipi.Ekle);
      if(sonuc.Success==true){
        this.alertify.success("Kayıt Tamamlandı!");
        this.modalService.dismissAll();
        this.DataListele();
        } else{
      this.alertify.warning(sonuc.Message);
      }
        this.blockUI.stop(); 
  }  

  async DataListele()  {
    this.blockUI.start(EkranMesaj.Listele);
      (await this.kullanicisrc.GetYetkiGrup(0)).subscribe(
        data=>{
          this.blockUI.stop(); 
          if(!data.Success){
            this.alertify.warning(data.Message);
            return;
          }
          this.datalist=data.List;
        }
      )         
  }    

  yeniEkle(content:any){  
    this.isReadOnly=false; 
    this.secilidata=new YetkiGrup();
    this.secilidata.Aktif=true; 
    this.modalService.open(content, {  size: 'lg',windowClass: 'modalcss40', backdrop: 'static' }); 
  } 

  silgosterChanged(e:any){ 
    let silinecekler  = this.secgrup.instance.getSelectedRowsData()[0];  
    if (silinecekler!=null){ 
      this.silgoster=true;  
      this.secilidata = silinecekler; 

    }
    else {
      this.silgoster=false; 
    }
  }
  
  kayitdetay(content:any,data:any){
    if(!this.yetki.Guncelle){
      this.alertify.warning("Güncelleme Yetkiniz Bulunmamaktadır!");
      return;
    }
    this.isReadOnly=true;
    this.secilidata = data ; 
    this.modalService.open(content, {  size: 'lg',windowClass: 'modalcss40', backdrop: 'static' }); 
  }

  async kayitsil(){    
    if(this.secilidata==null || this.secilidata.Id<=0){
      this.alertify.warning("Seçim Yapılmadı!") 
      return;
    } 

    this.confirmationDialogService.confirm('Sil', this.secilidata.Id + ' Nolu Satır Silinecek, Devam Edilsin mi?')
    .then(async (confirmed:any) => 
    {
      if(confirmed.sonuc==true)  {
        this.blockUI.start(EkranMesaj.Kaydet);
        var sonuc = await this.kullanicisrc.YetkiGrupEkle(this.secilidata,IslemTipi.Sil);
          if(sonuc.Success==true){
            this.alertify.success(EkranMesaj.KayitTamamlandi) 
          } else{
          this.alertify.warning(sonuc.Message);
          }
        
        this.DataListele();
        this.blockUI.stop(); 
      }
    })
    .catch(() => {

    });
  }  

  yetkidetay(data:YetkiGrup){ 
    this.tabService.addTab(new Tab(GrupYetkiDetayComponent, "Yetki Detay - "+ data.GrupAdi , { parent: "AppComponent", _data:data,yetki:this.yetki },0));
  }

}
