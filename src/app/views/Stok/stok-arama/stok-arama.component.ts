import { DatePipe } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DxDataGridComponent } from 'devextreme-angular';
import moment from 'moment';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subject, ReplaySubject } from 'rxjs';
import { EkranMesaj } from 'src/app/services/GenelSrc';
import { FilterMod, KullaniciYetki, KullaniciModel, KullaniciSrcService } from 'src/app/services/KullaniciSrc';
import { NotifyService } from 'src/app/services/notify';
import { StokHareketModel, StokHataModel, StokModel, StokService } from 'src/app/services/StokSrc';
import { CofirmsrcService } from 'src/app/utils/confirm-dialog/cofirmsrc.service';

@Component({
  selector: 'app-stok-arama',
  templateUrl: './stok-arama.component.html',
  styleUrls: ['./stok-arama.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers:[
    {provide:DatePipe},
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } }
  ]
})
export class StokAramaComponent implements OnInit {
  @ViewChild('gridStokList', { static: false }) grid!: DxDataGridComponent;
  @ViewChild('gridStokHareket', { static: false }) gridStokHareket!: DxDataGridComponent;
  @ViewChild('gridStokHatalar', { static: false }) gridStokHatalar!: DxDataGridComponent;
  @ViewChild("arakeyw") arakeyw: ElementRef | undefined;
  @BlockUI() blockUI!: NgBlockUI;
  datalist: StokModel[]=[]; 
  hareketlist: StokHareketModel[]=[]; 
  hatalist: StokHataModel[]=[]; 
  duzenlegoster:boolean=false;
  hareketgoster:boolean=false;
  allMode: string="";
  checkBoxesMode: string="";
  secilidata:StokModel;
  filter!:FilterMod; 
  @Input() data:any;     
  yetki:KullaniciYetki;
  kalemkeyword:string=""; 
  loguser:KullaniciModel;  
  stokharyetki:KullaniciYetki; 
  stokduzenlemeyetki:KullaniciYetki; 
  stokhatayetki:KullaniciYetki; 

  protected _onDestroy = new Subject<void>();

  constructor(
    private stoksrc:StokService,
    private alertify:NotifyService,
    private confirmationDialogService: CofirmsrcService,
    private modalService: NgbModal,
    private kullsrc:KullaniciSrcService
    ) {  
      this.allMode = 'allPages';
      this.checkBoxesMode = 'always';
      this.yetki=new KullaniciYetki(); 
      this.secilidata=new StokModel(); 
      this.stokharyetki=new KullaniciYetki(); 
      this.stokduzenlemeyetki=new KullaniciYetki(); 
      this.stokhatayetki=new KullaniciYetki(); 
    }

  ngOnInit() {
    this.yetki = this.data?.yetki;  
    this.loguser = JSON.parse(sessionStorage.getItem('data')??"") as KullaniciModel;
    this.stokharyetki = this.kullsrc.userperm.filter((x)=>x.YetkiKodu=="YT0003")[0];   
    this.stokduzenlemeyetki = this.kullsrc.userperm.filter((x)=>x.YetkiKodu=="YT0004")[0];   
    this.stokhatayetki = this.kullsrc.userperm.filter((x)=>x.YetkiKodu=="YT0005")[0];   
  }
  
  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();   
 }

  cariDblClick(e:any) {
    if(e.rowType === "data" && e.column.dataField === "DocEntry") {  
   }
  } 
 
  async GetStokList()  {
    this.blockUI.start(EkranMesaj.Listele);
    var sonuc = await this.stoksrc.GetStokList(this.kalemkeyword??""); 
    this.blockUI.stop();  
    if(sonuc.Success){
      this.datalist=sonuc.List;  
    }else{
      this.alertify.warning(sonuc.Message);
      return;
    }    
  } 

  async kalemAra(ev:any){ 
    if(this.kalemkeyword==""){
      this.alertify.warning("Aramak İstediğiniz Stok Bilgisini Kısaca Yazın...");
      return;
    }

    if (ev.keyCode === 13 && this.kalemkeyword!="") { 
      this.GetStokList(); 
    }
  } 

  aramaTemizle(){
    this.dataTemizle();
    this.datalist=[]; 
    this.arakeyw?.nativeElement.focus();
    this.kalemkeyword="";
  }

  dataChg(e:any){
    this.dataTemizle();
    if (e!=null){ 
      this.duzenlegoster=true;  
      this.hareketgoster=true;
      this.secilidata = e.data;
    }
  }

  async teslimAl(){   
  }

  async dataTemizle(){
    this.duzenlegoster=false; 
    this.hareketgoster=false; 
    this.secilidata =new StokModel();
  }

  stokDetay(content:any,data:StokModel){
    if(this.data==null || this.data.STOK_KODU==""){
      this.alertify.warning("Seçim Yapılmadı!") 
      return;
    }
    this.secilidata = data;
    this.modalService.open(content, {  size: 'lg',windowClass: 'modalcss45', backdrop: 'static' , keyboard:false}); 
  }

  async stokHareket(content:any,data:StokModel){
    this.hareketlist=[];
    if(this.data==null || this.data.STOK_KODU==""){
      this.alertify.warning("Seçim Yapılmadı!") 
      return;
    }
    this.secilidata = data;
    this.blockUI.start(EkranMesaj.Listele);
    var sonuc = await this.stoksrc.GetStokHareket(data.STOK_KODU); 
    this.blockUI.stop();  
    if(sonuc.Success){
      this.hareketlist=sonuc.List;  
      if(this.hareketlist==null || this.hareketlist.length<=0){
        this.alertify.warning("Stok Hareket Bilgisi Bulunamadı!");
        return;
      }
      else{
        this.modalService.open(content, {  size: 'lg',windowClass: 'modalcss65', backdrop: 'static' , keyboard:false}); 
      }
    }else{
      this.alertify.warning(sonuc.Message);
      return;
    }   
  }

  async stokGuncelle(){    
    if(this.secilidata==null || this.secilidata.STOK_KODU=="" || this.secilidata.STOK_KODU==null){
      this.alertify.warning("Seçim Yapılmadı!") 
      return;
    } 

    this.confirmationDialogService.confirm('Güncelle', this.secilidata.STOK_KODU + ' Kodlu Stok Bilgisi Güncellenecek, Devam Edilsin mi?')
    .then(async (confirmed:any) => 
    {
      if(confirmed.sonuc==true)  {
        this.blockUI.start(EkranMesaj.Kaydet);
        var sonuc = await this.stoksrc.StokDuzenle(this.secilidata);
        if(sonuc.Success==true){
            this.alertify.success(EkranMesaj.KayitTamamlandi) 
            this.modalService.dismissAll();
            this.blockUI.stop(); 
            this.GetStokList(); 
        } else{
            this.blockUI.stop(); 
            this.alertify.warning(sonuc.Message);
        } 
      }
    })
    .catch(() => {

    });
  }  

  async stokHatalar(content:any){
    this.hatalist=[];
    this.blockUI.start(EkranMesaj.Listele);
    var sonuc = await this.stoksrc.GetStokHatalar(); 
    this.blockUI.stop();  
    if(sonuc.Success){
      this.hatalist=sonuc.List;  
      if(this.hatalist==null || this.hatalist.length<=0){
        this.alertify.warning("Hatalı Stok Bilgisi Bulunamadı!");
        return;
      }
      else{
        this.modalService.open(content, {  size: 'lg',windowClass: 'modalcss65', backdrop: 'static' , keyboard:false}); 
      }
    }else{
      this.alertify.warning(sonuc.Message);
      return;
    }   
  }
  

}
