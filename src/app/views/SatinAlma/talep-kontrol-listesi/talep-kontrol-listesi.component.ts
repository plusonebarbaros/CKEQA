import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DxDataGridComponent } from 'devextreme-angular';
import moment from 'moment';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subject } from 'rxjs';
import { EkranMesaj } from 'src/app/services/GenelSrc';
import { FilterMod, KullaniciYetki, KullaniciModel } from 'src/app/services/KullaniciSrc';
import { NotifyService } from 'src/app/services/notify';
import { TalepDetail, ConnTeklifMas, ConnTeklifFirma, TalepsrcService } from 'src/app/services/SatinAlmaSrc';

@Component({
  selector: 'app-talep-kontrol-listesi',
  templateUrl: './talep-kontrol-listesi.component.html',
  styleUrls: ['./talep-kontrol-listesi.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers:[
    {provide:DatePipe},
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } }
  ]
})
export class TalepKontrolListesiComponent implements OnInit {
  @ViewChild('gridTalepKontrolList', { static: false }) grid!: DxDataGridComponent;
  @BlockUI() blockUI!: NgBlockUI;
  taleplist: TalepDetail[]=[]; 
  teslimalgoster:boolean=false;
  allMode: string="";
  checkBoxesMode: string="";
  secilidata:TalepDetail[]=[];
  filter!:FilterMod; 
  teklif:ConnTeklifMas;
  @Input() data:any;     
  yetki:KullaniciYetki;
  kalemkeyword:string=""; 
  loguser:KullaniciModel;
  TeslimDurumId:number=2;
  MuhKontrolId:number=2;
  SatKontrolId:number=2;  
  protected _onDestroy = new Subject<void>();

  constructor(
    private talepsrc:TalepsrcService,
    private alertify:NotifyService,
    private modalService: NgbModal,
    ) {  
      this.teklif=new ConnTeklifMas(); 
      this.allMode = 'allPages';
      this.checkBoxesMode = 'always';
      this.yetki=new  KullaniciYetki(); 
    }

  ngOnInit() {
    this.yetki = this.data?.yetki;  
    this.loguser = JSON.parse(sessionStorage.getItem('data')??"") as KullaniciModel;
    let date=new Date; 
    let baslangic=new Date(date.getUTCFullYear(),date.getUTCMonth(),1); 
    this.filter = new FilterMod(baslangic,date); 
    this.GetTalepKontrolList();  
  }

  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();   
 }
 
  async GetTalepKontrolList()  {
    this.blockUI.start(EkranMesaj.Listele);
      (await this.talepsrc.GetTalepKontrolList(this.filter.Baslangic,this.filter.Bitis,this.TeslimDurumId,this.MuhKontrolId,this.SatKontrolId)).subscribe(
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
    this.teslimalgoster=false; 
    this.evrekyuklegoster=false; 
    let list  = this.grid.instance.getSelectedRowsData() as TalepDetail[]; 
    this.secilikalem =new TalepDetail();

    if (list.length==1){ 
      this.teslimalgoster=true;  
      this.evrekyuklegoster=true;
      this.secilidata = list;  
      this.secilikalem = list[0];
    }
    if (list.length>1){ 
      this.teslimalgoster=true;  
      this.evrekyuklegoster=false;
      this.secilidata = list;  
    } 
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

  BasTarihChg(e:any){
    this.filter.Baslangic=moment(e._d).format("yyyy-MM-DD"); 
  }

  BitTarihChg(e:any){
    this.filter.Bitis=moment(e._d).format("yyyy-MM-DD"); 
  } 

  onayid:number=0;
  onaytakip(content:any,data:TalepDetail){
    if(data.OnayId<=0){
      this.alertify.warning("Onay Bilgisi Okunamadı!");
      return;
    }
    
    this.onayid=data.OnayId;
    this.modalService.open(content, {  size: 'lg',windowClass: 'modalcss45', backdrop: 'static' });   
  }  

}
