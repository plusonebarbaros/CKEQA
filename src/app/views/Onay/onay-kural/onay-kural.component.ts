import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DxDataGridComponent } from 'devextreme-angular';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { IslemTipi, EkranMesaj } from 'src/app/services/GenelSrc';
import { KullaniciSrcService, KullaniciYetki } from 'src/app/services/KullaniciSrc';
import { NotifyService } from 'src/app/services/notify';
import { DtsOnayKuralModel, DtsOnayKategoriModel, OnaySurevSrcService } from 'src/app/services/OnaySrc';
import { CofirmsrcService } from 'src/app/utils/confirm-dialog/cofirmsrc.service';

@Component({
  selector: 'app-onay-kural',
  templateUrl: './onay-kural.component.html',
  styleUrls: ['./onay-kural.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers:[
    {provide:DatePipe},
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } } 
  ]
})
export class OnayKuralComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  @ViewChild('gridCrmDurumTanim', { static: false }) gridCrmDurumTanim!: DxDataGridComponent;
  @Input() data:any;     
  yetki:KullaniciYetki;
  datalist: DtsOnayKuralModel[]=[];    
  silgoster:boolean=false;  
  secilidata:DtsOnayKuralModel; 
  isReadOnly: boolean=false;  
  kategorilist: DtsOnayKategoriModel[]=[];   
  
  constructor( 
    private onaysrc:OnaySurevSrcService,
    private modalService: NgbModal,
    private alertify:NotifyService ,
    private confirmationDialogService: CofirmsrcService,
    private kulsrc:KullaniciSrcService,
    ) 
    {  
      this.secilidata=new  DtsOnayKuralModel();
      this.yetki = this.kulsrc.userperm.filter((x)=>x.YetkiKodu=="YT0016")[0];
    } 

  ngOnInit() {    
    this.DataListele(); 
  }  
  
  async kaydet(){  
    if(this.secilidata.KuralTanim=="" || this.secilidata.KuralTanim==null){
      this.alertify.warning("Kategori Alanı Zorunludur!") 
      return;
    } 
    if(this.secilidata.Tablo=="" || this.secilidata.Tablo==null){
      this.alertify.warning("Tablo Alanı Zorunludur!") 
      return;
    }  
    if(this.secilidata.Alan=="" || this.secilidata.Alan==null){
      this.alertify.warning("Alan Alanı Zorunludur!") 
      return;
    }  

      this.blockUI.start("Kayıt Başladı...");
      var sonuc = await this.onaysrc.OnayKuralEkle(this.secilidata,this.secilidata.Id > 0 ? IslemTipi.Guncelle : IslemTipi.Ekle);
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
      (await this.onaysrc.GetOnayKural(0)).subscribe(
        data=>{ 
          this.datalist=data.List;
          this.blockUI.stop(); 
        }
      )    
  }  

  yeniEkle(content:any){  
    this.isReadOnly=false; 
    this.secilidata=new  DtsOnayKuralModel(); 
    this.modalService.open(content, {  size: 'lg',windowClass: 'modalcss40', backdrop: 'static' }); 
  } 

  silgosterChanged(e:any){ 
    let silinecekler  = this.gridCrmDurumTanim.instance.getSelectedRowsData()[0]; 
 
    if (silinecekler!=null){ 
      this.silgoster=true;  
      this.secilidata = silinecekler; 

    }
    else {
      this.silgoster=false; 
    }
  }
  
  santralDetay(content:any,data:any){
    if(!this.yetki.Guncelle){
      this.alertify.warning("Güncelleme Yetkiniz Bulunmamaktadır!");
      return;
    }
    this.isReadOnly=true;
    this.secilidata = data ;
    this.modalService.open(content, {  size: 'lg',windowClass: 'modalcss40', backdrop: 'static' }); 
  }

  async dataSil(){    
      if(this.secilidata==null || this.secilidata.Id<=0){
        this.alertify.warning("Seçim Yapılmadı!") 
        return;
      } 

      this.confirmationDialogService.confirm('Kayıt Sil', this.secilidata.Kategori+ ' Satırı Silinecek, Devam Edilsin mi?')
      .then(async (confirmed:any) => 
      {
        if(confirmed.sonuc==true)  {
          this.blockUI.start(EkranMesaj.Kaydet);
          var sonuc = await this.onaysrc.OnayKuralEkle(this.secilidata,IslemTipi.Sil);
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
}
