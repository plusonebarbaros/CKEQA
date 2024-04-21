import { DatePipe } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DxDataGridComponent } from 'devextreme-angular';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { GenelApi, EkranMesaj } from 'src/app/services/GenelSrc';
import { KullaniciModel, KullaniciYetki, KullaniciSrcService } from 'src/app/services/KullaniciSrc';
import { NotifyService } from 'src/app/services/notify';
import { TabService } from 'src/app/services/tab.service';
import { Tab } from 'src/app/services/tabs-mod';
import { CofirmsrcService } from 'src/app/utils/confirm-dialog/cofirmsrc.service';
import { KullaniciDetayComponent } from '../kullanici-detay/kullanici-detay.component';

@Component({
  selector: 'app-kullanici',
  templateUrl: './kullanici.component.html',
  styleUrls: ['./kullanici.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers:[
    {provide:DatePipe},
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } }
  ]
})
export class KullaniciComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  @Input() data:any;
  @ViewChild('dataGridRef2', { static: false }) dataGridRef2!: DxDataGridComponent;
  kullanicilist: KullaniciModel[]=[];  
  seciliuser: KullaniciModel;  
  yetki:KullaniciYetki;
  totalrows:number=0;
  WebDurum:number=1;
  @ViewChild("arakeyw") arakeyw: ElementRef | undefined;
  kalemkeyword:string=""; 

  constructor(
    public datepipe: DatePipe,
    private alertify:NotifyService , 
    private kullanicisrc:KullaniciSrcService,
    private modalService: NgbModal,
    private confirmationDialogService: CofirmsrcService,
    private genlsrv: GenelApi,
    private tabService: TabService, 
    ) {
    this.seciliuser = new KullaniciModel; 
    this.yetki=this.kullanicisrc.userperm.filter((x)=>x.YetkiKodu=="YT0006")[0];  
    }

  ngOnInit(): void { 
    this.KullaniciList(0,0); 
  }

  onSelectionChanged (e:any) {   
    if(e==null)return;
    this.seciliuser = e.selectedRowsData[0]; 
  } 
 
  async KullaniciList(empid:number,webdurum:number)  {
    this.blockUI.start(EkranMesaj.Listele);
    var sonuc = await this.kullanicisrc.GetKullaniciList(empid??0,0,webdurum,this.kalemkeyword); 
    this.blockUI.stop();  
    this.kullanicilist=sonuc.List;  
  } 

  kullaniciDetay(kullanici:KullaniciModel){ 
    this.tabService.addTab(new Tab(KullaniciDetayComponent, "Kullanıcı Detay - "+ kullanici.AdSoyad , { parent: "AppComponent", _kullanici:kullanici,yetki:this.yetki },0));
  }

  yeniEkle(){
    let setdef=new KullaniciModel();
    setdef.Id=0; 
    this.tabService.addTab(new Tab(KullaniciDetayComponent, "Yeni Kullanıcı Ekle", { parent: "AppComponent", _kullanici:setdef,yetki:this.yetki },0)); 
  }

  onContentReady(e:any) {  
    this.totalrows = e.component.totalCount();   
  }  

  async kalemAra(ev:any){ 
    if(this.kalemkeyword==""){
      this.alertify.warning("Aramak İstediğiniz Üye Bilgisini Kısaca Yazın...");
      return;
    }

    if (ev.keyCode === 13 && this.kalemkeyword!="") { 
      this.KullaniciList(0,3); 
    }
  } 

  aramaTemizle(){
    this.kullanicilist=[]; 
    this.arakeyw?.nativeElement.focus();
    this.kalemkeyword="";
  }
  
  persSil(){
    if(this.seciliuser==null){
      this.alertify.warning("Personel Seçimi Yapılmadı...");
      return;
    }
    if(this.seciliuser.Id<=0){
      this.alertify.warning("Personel Seçimi Yapılmadı...");
      return;
    }

    this.confirmationDialogService.confirm('Bilgilendirme', this.seciliuser.AdSoyad +' SAP Veri Tabanından Silinecek, İşlem Geri Alınamaz, Devam Edilsin mi?')
    .then(async (confirmed:any) => 
    {
      if(confirmed.sonuc==true)  { 
        this.blockUI.start("İşlem Başladı...");
        var sonuc = await this.kullanicisrc.KullaniciSil(this.seciliuser); 
        if(sonuc.Success==true){      
          if(this.seciliuser.Id<=0)this.seciliuser.Id=sonuc.Id; 
          this.alertify.success("İşlem Tamamlandı!");
          this.modalService.dismissAll();
          this.KullaniciList(0,3);
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
