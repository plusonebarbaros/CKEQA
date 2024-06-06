import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DxDataGridComponent } from 'devextreme-angular';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import { GenelApi, IslemTipi } from 'src/app/services/GenelSrc';
import { KullaniciYetki, SapSirket, YetkiGrup, KullaniciSrcService } from 'src/app/services/KullaniciSrc';
import { NotifyService } from 'src/app/services/notify';
import { CofirmsrcService } from 'src/app/utils/confirm-dialog/cofirmsrc.service';

@Component({
  selector: 'app-grup-yetki-detay',
  templateUrl: './grup-yetki-detay.component.html',
  styleUrls: ['./grup-yetki-detay.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers:[
    {provide:DatePipe},
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } } 
  ]
})
export class GrupYetkiDetayComponent implements OnInit {
  @ViewChild('secyetki', { static: false }) secyetki!: DxDataGridComponent;
  @ViewChild('multiSelect', { static: true }) multiSelect!: MatSelect;

  yetki:KullaniciYetki;  
  @Input() placeholderLabel = 'Ara...';
  @BlockUI() blockUI!: NgBlockUI;
  @Input() data:any; 
  yetkilist:  KullaniciYetki[]=[];   
  allMode: string="";
  checkBoxesMode: string="";
  sirketlist: SapSirket[]=[]; 
  SapSirket:string=""; 
  secilidata:YetkiGrup; 
  grupyetkilist: YetkiGrup[]=[];
 
  protected _onDestroy = new Subject<void>();

  constructor( 
    private modalService: NgbModal,
    private alertify:NotifyService ,
    private confirm: CofirmsrcService,    
    private kullanicisrc:KullaniciSrcService,
    private genelsrv:GenelApi,
  ) { 
    this.allMode = 'allPages';
    this.checkBoxesMode = 'always';
    this.secilidata=new YetkiGrup(); 
    this.yetki=this.kullanicisrc.userperm.filter((x)=>x.YetkiKodu=="YT0008")[0];
  }

  ngOnDestroy(): void {
     this._onDestroy.next();
     this._onDestroy.complete();
  } 

  async ngOnInit(): Promise<void> { 
    var grupyetki =this.data._data;
    this.yetki = this.data?.yetki; 

    if(grupyetki!=null && grupyetki.Id>0){
      this.secilidata=grupyetki;
      await this.GetKullaniciYetki();
    }     
  } 

  async GetKullaniciYetki() {
    this.yetkilist=[];
    this.blockUI.start("Yetki Okunuyor...");
    (await this.kullanicisrc.GetKullaniciYetki(0,this.secilidata.Id,"","H")).subscribe((data)=>{   
      this.blockUI.stop(); 
      if(!data.Success){
        this.alertify.warning(data.Message);
        return;
      }
      this.yetkilist=data.List;  
   })  
  } 

  secilitab:string="";
  tabDegisti(e:any){
    this.secilitab=e.tab.textLabel;
  }
  
  tumunuSec(e:number){
    if(this.yetkilist==null || this.yetkilist.length<=0){
      return;
    }

    if(e==1){
      this.confirm.confirm('Bilgilendirme', 'Görüntüle Yetkilerinin Tümü Değiştirilecek, Devam Edilsin mi?')
      .then(async (confirmed:any) => 
      {
        if(confirmed.sonuc==true)  {
          let durum = this.yetkilist[0].Goruntule;
          this.yetkilist.forEach(item=>{
            item.Goruntule=!durum;
          })
        }
      })
      .catch(() => {  
      });     
    }
    else if(e==2){
      this.confirm.confirm('Bilgilendirme', 'Ekle Yetkilerinin Tümü Değiştirilecek, Devam Edilsin mi?')
      .then(async (confirmed:any) => 
      {
        if(confirmed.sonuc==true)  {
          let durum = this.yetkilist[0].Ekle;
          this.yetkilist.forEach(item=>{
            item.Ekle=!durum;
          })
        }
      })
      .catch(() => {  
      });     
    }
    else if(e==3){
      this.confirm.confirm('Bilgilendirme', 'Güncelle Yetkilerinin Tümü Değiştirilecek, Devam Edilsin mi?')
      .then(async (confirmed:any) => 
      {
        if(confirmed.sonuc==true)  {
          let durum = this.yetkilist[0].Guncelle;
          this.yetkilist.forEach(item=>{
            item.Guncelle=!durum;
          })
        }
      })
      .catch(() => {  
      });     
    }
    else if(e==4){
      this.confirm.confirm('Bilgilendirme', 'Sil Yetkilerinin Tümü Değiştirilecek, Devam Edilsin mi?')
      .then(async (confirmed:any) => 
      {
        if(confirmed.sonuc==true)  {
          let durum = this.yetkilist[0].Sil;
          this.yetkilist.forEach(item=>{
            item.Sil=!durum;
          })
        }
      })
      .catch(() => {  
      });     
    }
    else if(e==5){
      this.confirm.confirm('Bilgilendirme', 'Export Yetkilerinin Tümü Değiştirilecek, Devam Edilsin mi?')
      .then(async (confirmed:any) => 
      {
        if(confirmed.sonuc==true)  {
          let durum = this.yetkilist[0].Export;
          this.yetkilist.forEach(item=>{
            item.Export=!durum;
          })
        }
      })
      .catch(() => {
        });     
    }
  } 

  async yetkikaydet(){
    this.blockUI.start("Kayıt Başladı..."); 
    var sonuc = await this.kullanicisrc.GrupYetkiOlustur(this.secilidata,this.yetkilist,IslemTipi.Guncelle);
    if(sonuc.Success==true){       
      this.alertify.success("Kayıt Tamamlandı!"); 
      } else{
    this.alertify.warning(sonuc.Message);
    }
      this.blockUI.stop(); 
  }  
}
