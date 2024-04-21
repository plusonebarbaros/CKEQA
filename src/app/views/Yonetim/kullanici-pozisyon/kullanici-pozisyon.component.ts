import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DxDataGridComponent } from 'devextreme-angular';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ConnKulPozisyonModel, IslemTipi, EkranMesaj, GenelApi } from 'src/app/services/GenelSrc';
import { KullaniciYetki } from 'src/app/services/KullaniciSrc';
import { NotifyService } from 'src/app/services/notify';
import { CofirmsrcService } from 'src/app/utils/confirm-dialog/cofirmsrc.service';

@Component({
  selector: 'app-kullanici-pozisyon',
  templateUrl: './kullanici-pozisyon.component.html',
  styleUrls: ['./kullanici-pozisyon.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers:[
    {provide:DatePipe},
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } } 
  ]
})
export class KullaniciPozisyonComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  @ViewChild('gridPozisyonList', { static: false }) grid!: DxDataGridComponent;
  @Input() data:any;     
  yetki:KullaniciYetki;
  datalist: ConnKulPozisyonModel[]=[];    
  silgoster:boolean=false;  
  secilidata:ConnKulPozisyonModel; 
  isReadOnly: boolean=false;      
  
  constructor(  
    private modalService: NgbModal,
    private alertify:NotifyService ,
    private confirmationDialogService: CofirmsrcService,  
    private sabitsrc:GenelApi,
    ) 
    {  
      this.secilidata=new  ConnKulPozisyonModel();  
      this.yetki=new  KullaniciYetki();
    }  

  ngOnInit() { 
    this.yetki = this.data?.yetki;    
    this.DataListele();    
  } 
 
  async kaydet(){   
      if(this.secilidata.Tanim == ""){
        this.alertify.warning("Tanim Alanı Zorunludur!") 
        return;
      }  
  
      this.blockUI.start("Kayıt Başladı...");
      var sonuc = await this.sabitsrc.KullPozisyonEkle(this.secilidata,this.secilidata.Id>0?IslemTipi.Guncelle:IslemTipi.Ekle);
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
      (await this.sabitsrc.GetKullPozisyon(0)).subscribe(
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
    this.secilidata=new  ConnKulPozisyonModel();
    this.secilidata.Aktif=true; 
    this.modalService.open(content, {  size: 'lg',windowClass: 'modalcss40', backdrop: 'static' }); 
  } 

  silgosterChanged(e:any){ 
    let silinecekler  = this.grid.instance.getSelectedRowsData()[0]; 
 
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
        var sonuc = await this.sabitsrc.KullPozisyonEkle(this.secilidata,IslemTipi.Sil);
          if(sonuc.Success==true){
            this.alertify.success(EkranMesaj.KayitTamamlandi) 
          } else{
          this.alertify.warning(sonuc.Message);
          }
        
        this.DataListele();
        this.blockUI.stop(); 
      }
    })
    .catch(() => { }); 
  }  
}
