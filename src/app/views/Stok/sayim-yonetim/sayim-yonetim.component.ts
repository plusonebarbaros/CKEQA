import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DxDataGridComponent } from 'devextreme-angular';
import moment from 'moment';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subject, ReplaySubject, takeUntil } from 'rxjs';
import { StokGrupModel, GenelApi, EkranMesaj, IslemTipi } from 'src/app/services/GenelSrc';
import { KullaniciYetki, FilterMod, ConDepoYetki, KullaniciModel, KullaniciSrcService } from 'src/app/services/KullaniciSrc';
import { NotifyService } from 'src/app/services/notify';
import { ConnOlcuBirim, ConnFireTipTanimModel, SabitservService } from 'src/app/services/SabitSrc';
import { Items, ConnTalepIhtDurum, TalepsrcService, ItemsFile } from 'src/app/services/SatinAlmaSrc';
import { SiparisService } from 'src/app/services/SiparisSrc';
import { SayimModel, SayimTipModel, StokService } from 'src/app/services/StokSrc';
import { TabService } from 'src/app/services/tab.service';
import { Tab } from 'src/app/services/tabs-mod';
import { CofirmsrcService } from 'src/app/utils/confirm-dialog/cofirmsrc.service';
import { TalepDetayComponent } from '../../SatinAlma/talep-detay/talep-detay.component';

@Component({
  selector: 'app-sayim-yonetim',
  templateUrl: './sayim-yonetim.component.html',
  styleUrls: ['./sayim-yonetim.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers:[
    {provide:DatePipe},
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } }
  ]
})
export class SayimYonetimComponent implements OnInit {
  @ViewChild('gridSayimYonetim', { static: false }) grid!: DxDataGridComponent;
  @BlockUI() blockUI!: NgBlockUI;
  taleplist: SayimModel[]=[]; 
  selectedItemKeys: any[] = [];
  silgoster:boolean=false;
  teslimgoster:boolean=false;
  transfergoster:boolean=false;
  retgoster:boolean=false;
  allMode: string="";
  checkBoxesMode: string="";
  secilidata:SayimModel[]=[];
  @Input() data:any;     
  yetki:KullaniciYetki; 
  filter!:FilterMod; 
  evrekyuklegoster:boolean=false;
  secilikalem:SayimModel;
  onayid:number=0;
  kalemlist:Items[]=[]; 
  kalemsecimlist:SayimModel[]=[]; 
  olcubirimlist: ConnOlcuBirim[]=[];  
  talepihtdurumlist: ConnTalepIhtDurum[]=[]; 
  stokgruplist: StokGrupModel[]=[]; 
  depolist: ConDepoYetki[]=[]; 
  kalemkeyword:string=""; 
  TalepAciklama:string=""; 
  TalepTarih:any; 
  loguser:KullaniciModel;  
  onayaciklama:string="";
  firetiplist: ConnFireTipTanimModel[]=[];    
  FireTipiId:number=0;
  sayimtiplist:SayimTipModel[]=[];
  
  protected _onDestroy = new Subject<void>();

  public formDepo: FormControl = new FormControl();
  public filterDepo: ReplaySubject<ConDepoYetki[]> = new ReplaySubject<ConDepoYetki[]>(1);

  public formFire: FormControl = new FormControl();
  public filterFire: ReplaySubject<SayimTipModel[]> = new ReplaySubject<SayimTipModel[]>(1);

  constructor(
    private tabService: TabService,
    private talepsrc:TalepsrcService,
    private alertify:NotifyService,
    private confirm: CofirmsrcService,
    private modalService: NgbModal,
    private genelsrv:GenelApi,
    private kullanicisrc:KullaniciSrcService,
    private sabitsrc:SabitservService,
    private siparissrc:SiparisService,
    private stoksrc:StokService
    ) {  
      this.allMode = 'allPages';
      this.checkBoxesMode = 'always';
      this.yetki=new  KullaniciYetki(); 
      this.secilikalem=new  SayimModel(); 
    }

  ngOnInit() {
    this.yetki = this.data?.yetki;
    let date=new Date;  
    let baslangic=new Date(date.getUTCFullYear(),date.getUTCMonth(),1); 
    this.filter = new FilterMod(baslangic,date);  
    this.loguser = JSON.parse(sessionStorage.getItem('data')??"") as KullaniciModel;

    var tip1 = new SayimTipModel();
    tip1.Id=1;
    tip1.Tip="Tüm Malzemeler";
    var tip2 = new SayimTipModel();
    tip2.Id=2;
    tip2.Tip="Stok Hareket Olanlar";
    this.sayimtiplist.push(tip1);
    this.sayimtiplist.push(tip2);
    this.filterFire.next(this.sayimtiplist.slice());
    
    this.GetKullaniciDepoYetki();
    this.GetStokOlcuBirim();
    this.GetTalepIhtiyacDurum();
    this.GetFireTipTanim();

    this.GetDepoSayim();    
    this.formDepo.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {this.filterDepoList();});
    this.formFire.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {this.filterFireList();});
  }

  async GetFireTipTanim()  {
    this.blockUI.start(EkranMesaj.Listele);
      (await this.sabitsrc.GetFireTipTanim(0)).subscribe(
        data=>{
          this.blockUI.stop(); 
          if(!data.Success){
            this.alertify.warning(data.Message);
            return;
          }
          this.firetiplist=data.List;
          this.filterFire.next(this.sayimtiplist.slice());
        }
      )         
  }

  protected filterFireList() {
    if (!this.sayimtiplist) {
      return;
    } 
    let search = this.formFire.value+"";
    if (!search) {
      this.filterFire.next(this.sayimtiplist.slice());
      return;
    } else {
      search = search.toUpperCase();
    } 
    this.filterFire.next(
      this.sayimtiplist.filter(item => (item?.Tip??"").toUpperCase().indexOf(search) > -1)
    );
  }
  
  protected filterDepoList() {
    if (!this.depolist) {
      return;
    } 
    let search = this.formDepo.value+"";
    if (!search) {
      this.filterDepo.next(this.depolist.slice());
      return;
    } else {
      search = search.toUpperCase();
    } 
    this.filterDepo.next(
      this.depolist.filter(item => (item?.DepoAdi??"").toUpperCase().indexOf(search) > -1)
    );
  }

  async GetStokOlcuBirim()  {
    this.blockUI.start(EkranMesaj.Listele);
      (await this.sabitsrc.GetStokOlcuBirim(0)).subscribe(
        data=>{
          this.blockUI.stop(); 
          if(!data.Success){
            this.alertify.warning(data.Message);
            return;
          }
          this.olcubirimlist=(data.List as ConnOlcuBirim[]).filter((x)=>x.Aktif);
        }
      )         
  }    
  
  async GetKullaniciDepoYetki() {
    this.blockUI.start("Depo Yetki Okunuyor...");
    (await this.kullanicisrc.GetKullaniciDepoYetki(0)).subscribe((data)=>{  
      this.blockUI.stop();  
      if(!data.Success){
        this.alertify.warning(data.Message);
        return;
      }
      this.depolist=(data.List as ConDepoYetki[]).filter((x)=> x.DepoKodu!=this.loguser.CalistigiSubeKod);  
      this.filterDepo.next(this.depolist.slice());
   })  
  }

  async GetTalepIhtiyacDurum() {
    this.blockUI.start("Depo Yetki Okunuyor...");
    (await this.talepsrc.GetTalepIhtiyacDurum()).subscribe((data)=>{  
      this.blockUI.stop();  
      if(!data.Success){
        this.alertify.warning(data.Message);
        return;
      }
      this.talepihtdurumlist=data.List;  
   })  
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
  this.tabService.addTab(new Tab(TalepDetayComponent, "Talep Detay - "+ talep.Id , { parent: "AppComponent", _talepid:talep.Id,yetki:this.yetki },0));
}

  yeniEkle(){  
    this.tabService.addTab(new Tab(TalepDetayComponent, "Yeni Talep", { parent: "AppComponent",_talepid:0,yetki:this.yetki },0));
  }

  async GetDepoSayim()  {
    this.blockUI.start(EkranMesaj.Listele);
      (await this.stoksrc.GetDepoSayim(0,this.filter.Baslangic,this.filter.Bitis)).subscribe(
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

  overrideOnValueChanged(e:any) {
    if (e.column.dataField  === 'Miktar' || e.column.dataField  === 'DepoKodu' || e.column.dataField  === 'BirimTutar' || e.column.dataField  === 'TalepDurumId' || e.column.dataField  === 'Aciklama') {
      var talepno = e.data.TalepNo;  
      var onayno = e.data.OnayId;  
      var talepdurum  =e.data.TalepDurum; 
      if(talepdurum==undefined || talepdurum=="Talep" || talepdurum=="İşlem Yapılmadı"|| talepdurum=="" || talepdurum=="Islem Yapılmadı"){
        if (talepno > 0 && onayno>0) {  
            e.cancel = true;  
            this.alertify.warning("Talep Oluşan Satırlarda Değişiklik Yapılamaz!");
        } 
      }
      else {
          e.cancel = true;  
          this.alertify.warning("Talep Durumu Değişen Satırda İşlem Yapılamaz!");
      } 
    }
}

  async CellDegisti(e:any){ 
    e.data.ToplamTutar  = e.data.BirimTutar * e.data.Miktar;  
    this.blockUI.start("Kayıt Başladı...");
    var sonuc = await this.talepsrc.TalepSatirGuncelle(e.data);
    if(sonuc.Success==true){  
        this.GetDepoSayim();
    } 
    else{
      this.alertify.warning(sonuc.Message);
      this.GetDepoSayim();
    } 
    this.blockUI.stop(); 
}

tekraronaygoster:boolean=false;
silgosterChanged(e:any){
  let silinecekler  = this.grid.instance.getSelectedRowsData();
  this.selectedItemKeys = e.selectedRowKeys;
  this.tekraronaygoster=false;
  this.transfergoster=false;
  this.teslimgoster=false;
  this.retgoster=false;
  this.evrekyuklegoster=false;
  this.silgoster=false;

  if (silinecekler!=null && silinecekler.length==1){
    this.silgoster=true;
    this.evrekyuklegoster=true;
    this.secilikalem = silinecekler[0] as SayimModel;
    this.secilidata = silinecekler;
  }
  else if (silinecekler!=null && silinecekler.length>1){
    this.silgoster=true;
    this.secilikalem =new SayimModel();
    this.secilidata = silinecekler; 
  }
  else {
    this.secilikalem =new SayimModel();
    this.secilidata=[];
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

onaytakip(content:any,data:SayimModel){
  if(data.OnayId<=0){
    this.alertify.warning("Onay Bilgisi Okunamadı!");
    return;
  }
  
  this.onayid=data.OnayId;
  this.modalService.open(content, {  size: 'lg',windowClass: 'modalcss45', backdrop: 'static' });   
}  

async kaydet(){
  if(this.kalemsecimlist.length<=0){
    this.alertify.warning("Malzeme Eklenmeden Kayıt İşlemi Yapılamaz!");
    return;
  } 

   this.blockUI.start("Kayıt Başladı...");
      var sonuc = await this.stoksrc.DepoSayim(undefined,this.kalemsecimlist,this.TalepAciklama,IslemTipi.Ekle);
     if(sonuc.Success==true){
        this.alertify.success("İşlem Tamamlandı!") ;
        this.kalemsecimlist=[];       
        this.modalService.dismissAll();
        this.GetDepoSayim();
        this.kalemlist.forEach((x)=>{ 
          x.Miktar = 0; 
        })    
     } 
     else{
      this.kalemsecimlist=[];
      this.alertify.warning(sonuc.Message);
     } 
     this.blockUI.stop(); 
}

uploadFile(kalem:Items,fileList:any) { 
  kalem.Files = fileList.target.files.length; 
  kalem.Base64List= [];

  if(fileList==null || fileList.length<=0){
    this.alertify.warning("Dosya Seçilmedi!");
    return;
  }  
  for (let i = 0; i < fileList.target.files.length; i++) { 
    setTimeout(() => {
      var data=new ItemsFile(); 
      data.BelgeAdi=fileList.target.files[i].name;
      data.BelgeUzanti=fileList.target.files[i].type;
      data.BelgeBase64="";

      const reader = new FileReader();
      reader.readAsDataURL(fileList.target.files[i]);
      reader.onload = () => {
          data.BelgeBase64 = reader.result?.toString()??"";   
          kalem.Base64List.push(data); 
      }; 
    }, 500);
  }    
}   

belgeYukleModal(content:any){
  if(this.secilikalem==null || this.secilikalem.Id<=0){
    this.alertify.success("Seçim Yapılmadı!");
    return;
  }
  this.modalService.open(content, {  size: 'lg',windowClass: 'belgeyuklemodal', backdrop: 'static' });
}

sayimmodOpen(content:any){  
    this.secilikalem=new SayimModel();
    this.secilikalem.Id=0;
    this.secilikalem.DepoKodu=this.loguser.CalistigiSirketKod;
    this.TalepTarih = moment(new Date).format("yyyy-MM-DD"); 
    this.modalService.open(content, {  size: 'lg',windowClass: 'modalcss35', backdrop: 'static' }); 
}  

defFire(event: any) {
  this.FireTipiId = 0;
  event.stopPropagation();
}

defDepo(event: any) {
  this.secilikalem.DepoKodu = "";
  event.stopPropagation();
}

}
