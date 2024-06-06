import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DxDataGridComponent } from 'devextreme-angular';
import moment from 'moment';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { EkranMesaj } from 'src/app/services/GenelSrc';
import { FilterMod, KullaniciYetki, KullaniciSrcService } from 'src/app/services/KullaniciSrc';
import { NotifyService } from 'src/app/services/notify';
import { OnayGecmis, OnaySurevSrcService } from 'src/app/services/OnaySrc';
import { TalepsrcService } from 'src/app/services/SatinAlmaSrc';
import { TabService } from 'src/app/services/tab.service';
import { Tab } from 'src/app/services/tabs-mod';
import { TalepDetayComponent } from '../../SatinAlma/talep-detay/talep-detay.component';

@Component({
  selector: 'app-onay-gecmis',
  templateUrl: './onay-gecmis.component.html',
  styleUrls: ['./onay-gecmis.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers:[
    {provide:DatePipe},
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } }
  ]
})
export class OnayGecmisComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  @ViewChild('gridOnayGecmis', { static: false }) gridOnayGecmis!: DxDataGridComponent;
  DurumTip:number=0;
  datalist: OnayGecmis[]=[];  
  filter!:FilterMod; 
  allMode: string="";
  checkBoxesMode: string="";
  siparismodgoster:boolean=false;
  secilidata: OnayGecmis[]=[];   
  @Input() data:any;     
  yetki:KullaniciYetki; 

  constructor(
    private onaysrc:OnaySurevSrcService,
    private kullanicisrc:KullaniciSrcService,
    private modalService: NgbModal,
    private alertify:NotifyService,
    private tabService: TabService,  
    private talepsrc:TalepsrcService,

  ) { 
    this.allMode = 'allPages';
    this.checkBoxesMode = 'always';
    this.yetki = this.kullanicisrc.userperm?.filter(p=>p.YetkiKodu=="YT0021")[0]; 
  }

  ngOnInit(): void {
    let date=new Date;  
    this.filter = new FilterMod(date,date);  

  } 

  async OnKayitListele()  {
    this.blockUI.start(EkranMesaj.Listele);
      (await this.onaysrc.GetOnayGecmis(this.filter.Baslangic,this.filter.Bitis)).subscribe(
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
   
  BasTarihChg(e:any){
    this.filter.Baslangic=moment(e._d).format("yyyy-MM-DD"); 
  }

  BitTarihChg(e:any){
    this.filter.Bitis=moment(e._d).format("yyyy-MM-DD"); 
  } 

  async talepDetay(data:OnayGecmis){ 
    if(data.OnayBolum=="Satın Alma Talep Onay"){
      this.tabService.addTab(new Tab(TalepDetayComponent, "Talep Detay - "+ data.Belgeno , { parent: "AppComponent", _talepid:data.Belgeno,yetki:this.yetki },0));
    }
    else if(data.OnayBolum=="Satın Alma Teklif"){
      (await this.talepsrc.GetTeklifList(parseInt(data.Belgeno.toString()),undefined,undefined)).subscribe(
        data=>{
          this.blockUI.stop(); 
          if(!data.Success){
            this.alertify.warning(data.Message);
            return;
          }
          var teklif = data.List[0];
         // this.tabService.addTab(new Tab(SatinAlmaTeklifDetayComponent, "Teklif Detay - "+ teklif.Id , { parent: "AppComponent", _teklif:teklif,yetki:this.yetki },0));

        }
      )     
    }
  }
}
