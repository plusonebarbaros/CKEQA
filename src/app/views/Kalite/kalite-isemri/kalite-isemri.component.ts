import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DxDataGridComponent } from 'devextreme-angular';
import moment from 'moment';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { EkranMesaj, GenelApi } from 'src/app/services/GenelSrc';
import { FilterMod, KullaniciSrcService, KullaniciYetki } from 'src/app/services/KullaniciSrc';
import {  EmirArama, EmirList, KaliteSrcService } from 'src/app/services/kaliteSrc';
import { NotifyService } from 'src/app/services/notify';

import { KaliteGirisStokComponent } from '../kalite-giris/kalite-giris-stok/kalite-giris-stok.component';
import { TabService } from 'src/app/services/tab.service';
import { Tab } from 'src/app/services/tabs-mod';

@Component({
  selector: 'app-kalite-isemri',
  templateUrl: './kalite-isemri.component.html',
  styleUrls: ['./kalite-isemri.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers:[
    {provide:DatePipe},
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } }
  ]
})
export class KaliteIsemriComponent implements OnInit {
  @ViewChild('gridKaliteIsEmri', { static: false }) gridKaliteIsEmri!: DxDataGridComponent;
  @BlockUI() blockUI!: NgBlockUI;
  @Input() data:any;   
  

  emirArama : EmirArama; 
  emirlist:EmirList[]=[];  
  filterTipList : filterTip[]=[];
  seciliTipler:string="";
  yetki:KullaniciYetki;
  filter!:FilterMod; 
 
  public formIsEmri : FormControl = new FormControl();
  
  constructor(
    
    private genelsrv:GenelApi,
    private alertify:NotifyService,
    private kalitesrc:KaliteSrcService,
    private modalService: NgbModal,
    private kullanicisrc:KullaniciSrcService,
    public datepipe: DatePipe,   
    private tabService: TabService

    ) 
    {       
      this.emirArama = new EmirArama();  
      this.seciliTipler = '';

      this.yetki=this.kullanicisrc.userperm.filter((x)=>x.YetkiKodu=="YT0042")[0];
      this.filterTipList.push({ Kod: 'URT', Aciklama: 'Üretim' });
      this.filterTipList.push({ Kod: 'STA', Aciklama: 'SatinAlma' });
      this.filterTipList.push({ Kod: 'SEV', Aciklama: 'Sevkiyat' });
      this.filterTipList.push({ Kod: 'STK', Aciklama: 'Stok' });
      this.filterTipList.push({ Kod: 'IAD', Aciklama: 'İade' }); 
     
   }   

  ngOnInit(): void {
    let bitis=new Date;  
    let baslangic=new Date(bitis.getUTCFullYear(),bitis.getUTCMonth(),1); 
    this.filter = new FilterMod(baslangic,bitis);  
  
  }

  BasTarihChg(e:any){
    this.filter.Baslangic=moment(e._d).format("yyyy-MM-DD"); 
  }

  BitTarihChg(e:any){
    this.filter.Bitis=moment(e._d).format("yyyy-MM-DD"); 
  } 

  async EmirListesiGetir(){
    
    this.blockUI.start(EkranMesaj.Listele);
    
    this.emirArama.Baslangic=this.filter.Baslangic;
    this.emirArama.Bitis=this.filter.Bitis; 
    this.emirArama.Tip=this.seciliTipler

    var sonuc  =  await this.kalitesrc.GetKaliteEmirList(this.emirArama); 
    if ( sonuc.List.length < 1) 
    {
      this.alertify.warning("Seçmiş olduğunuz kriterler ile Kalite İşEmri bulunamamıştır");
      this.blockUI.stop();    
      return;
    }
    this.emirlist =  sonuc.List;  
    this.blockUI.stop();    

  }



  IsEmriDetay(EmirNo:any){  
    this.tabService.addTab(new Tab(KaliteGirisStokComponent, "Kalite Stok Girisleri - " + EmirNo , { EmirNo :EmirNo ,  data:this.emirlist,  parent: "AppComponent",yetki:true},25));
  }


  
}
export class filterTip{
 
  Kod:string="";   
  Aciklama:string=""; 
}