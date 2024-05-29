import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { DxDataGridComponent } from 'devextreme-angular';
import moment from 'moment';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { EkranMesaj } from 'src/app/services/GenelSrc';
import { KullaniciYetki, FilterMod } from 'src/app/services/KullaniciSrc';
import { NotifyService } from 'src/app/services/notify';
import { TalepMaster, TalepsrcService } from 'src/app/services/SatinAlmaSrc';
import { TabService } from 'src/app/services/tab.service';
import { Tab } from 'src/app/services/tabs-mod';
import { CofirmsrcService } from 'src/app/utils/confirm-dialog/cofirmsrc.service';
import { SatinAlmaTalepDetayComponent } from '../satin-alma-talep-detay/satin-alma-talep-detay.component';

@Component({
  selector: 'app-satin-alma-talep',
  templateUrl: './satin-alma-talep.component.html',
  styleUrls: ['./satin-alma-talep.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers:[
    {provide:DatePipe},
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } }
  ]
})
export class SatinAlmaTalepComponent implements OnInit {
  @ViewChild('gridTalepMaster', { static: false }) grid!: DxDataGridComponent;
  @BlockUI() blockUI!: NgBlockUI;
  taleplist: TalepMaster[]=[]; 
  selectedItemKeys: any[] = [];
  silgoster:boolean=false;
  allMode: string="";
  checkBoxesMode: string="";
  secilidata:TalepMaster[]=[];
  @Input() data:any;     
  yetki:KullaniciYetki; 
  filter!:FilterMod; 
  
  constructor(
    private tabService: TabService,
    private talepsrc:TalepsrcService,
    private alertify:NotifyService,
    private confirmationDialogService: CofirmsrcService
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

    this.TalepListele();    
  }

  BasTarihChg(e:any){
    this.filter.Baslangic=moment(e._d).format("yyyy-MM-DD"); 
  }

  BitTarihChg(e:any){
    this.filter.Bitis=moment(e._d).format("yyyy-MM-DD"); 
  } 

  cariDblClick(e:any) {
    if(e.rowType === "data" && e.column.dataField === "Id") {
  
   }
}   

talepDetay(talep:any){ 
  this.tabService.addTab(new Tab(SatinAlmaTalepDetayComponent, "Talep Detay - "+ talep.Id , { parent: "AppComponent", _talepid:talep.Id,yetki:this.yetki },0));
}

  yeniEkle(){  
    this.tabService.addTab(new Tab(SatinAlmaTalepDetayComponent, "Yeni Talep", { parent: "AppComponent",_talepid:0,yetki:this.yetki },0));
  }

  async TalepListele()  {
    this.blockUI.start(EkranMesaj.Listele);
      (await this.talepsrc.getTalepList(0,"",this.filter.Baslangic,this.filter.Bitis,false)).subscribe(
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
  
    if (silinecekler!=null && silinecekler.length>0){ 
      this.silgoster=true;  
      this.secilidata = silinecekler; 
  
    }
    else {
      this.silgoster=false; 
    }
  }
  
  async kayitsil(){    
    // if(this.secilidata==null || this.secilidata.length<=0){
    //   this.alertify.warning("Seçim Yapılmadı!") 
    //   return;
    // } 
  
    // this.confirmationDialogService.confirm('Sil','Seçili Satırlar Silinecek, Devam Edilsin mi?')
    // .then(async (confirmed:any) => 
    // {
    //   if(confirmed.sonuc==true)  {
    //     this.blockUI.start(EkranMesaj.Kaydet);
    //     var sonuc = await this.talepsrc.TalepSil(this.secilidata);
    //       if(sonuc.Success==true){
    //         this.alertify.success(EkranMesaj.KayitTamamlandi);   
    //       } else{
    //       this.alertify.warning(sonuc.Message);
    //       }
    //       this.blockUI.stop(); 
    //       this.TalepListele(); 
    //   }
    // })
    // .catch(() => { 
    // }); 
} 
}
