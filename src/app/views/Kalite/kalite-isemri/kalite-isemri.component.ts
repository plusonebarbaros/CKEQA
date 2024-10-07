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
import { KaliteGirisSatinalmaComponent } from '../kalite-giris/kalite-giris-satinalma/kalite-giris-satinalma.component';

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
  seciliTipler: string[] = [];
  yetkiStok:KullaniciYetki;
  yetkiSatinAlma:KullaniciYetki;
  filter!:FilterMod; 
  startdate:any;
  enddate:any;
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
      // this.seciliTipler = '';
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth(); 

      this.startdate = new Date(year, month, 1);
      this.enddate = new Date(year, month + 1, 0);

      this.yetkiStok=this.kullanicisrc.userperm.filter((x)=>x.YetkiKodu=="YT0042")[0];
      this.yetkiSatinAlma=this.kullanicisrc.userperm.filter((x)=>x.YetkiKodu=="YT0051")[0];
      this.filterTipList.push({ Kod: 'URT', Aciklama: 'Üretim' });
      this.filterTipList.push({ Kod: 'STA', Aciklama: 'SatinAlma' });
      this.filterTipList.push({ Kod: 'SEV', Aciklama: 'Sevkiyat' });
      this.filterTipList.push({ Kod: 'STK', Aciklama: 'Stok' });
      this.filterTipList.push({ Kod: 'IAD', Aciklama: 'İade' }); 
      this.seciliTipler = this.filterTipList.map(tip => tip.Kod);

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



  IsEmriDetay(Data:any){  
    console.log(Data);

    if (Data.Tur=="STK"){
      this.tabService.addTab(new Tab(KaliteGirisStokComponent, "Kalite Stok Girisleri - " + Data.DocEntry + " ( " + Data.Durum + " ) " , { EmirNo :Data.DocEntry ,  data:this.emirlist,  parent: "AppComponent",yetki:this.yetkiStok},25));
    }
    else if (Data.Tur=="STA"){
      this.tabService.addTab(new Tab(KaliteGirisSatinalmaComponent, "SatınAlma - " + Data.DocEntry  + " ( " + Data.Durum + " ) ", { EmirNo :Data.DocEntry ,  data:this.emirlist,  parent: "AppComponent",yetki:this.yetkiSatinAlma},34));
    } 
    else if (Data.Tur=="URT"){
      this.tabService.addTab(new Tab(KaliteGirisSatinalmaComponent, "SatınAlma - " + Data.DocEntry  + " ( " + Data.Durum + " ) ", { EmirNo :Data.DocEntry ,  data:this.emirlist,  parent: "AppComponent",yetki:this.yetkiSatinAlma},34));
    }
  }


  
}
export class filterTip{
 
  Kod:string="";   
  Aciklama:string=""; 
}
 