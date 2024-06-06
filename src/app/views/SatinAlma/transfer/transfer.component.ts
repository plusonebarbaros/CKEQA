import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DxDataGridComponent } from 'devextreme-angular';
import moment from 'moment';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subject, ReplaySubject, takeUntil } from 'rxjs';
import { EkranMesaj, GenelApi, StokGrupModel } from 'src/app/services/GenelSrc';
import { KullaniciYetki, FilterMod, ConDepoYetki, KullaniciSrcService } from 'src/app/services/KullaniciSrc';
import { NotifyService } from 'src/app/services/notify';
import { ConnOlcuBirim, SabitservService } from 'src/app/services/SabitSrc';
import { ConnTalepIhtDurum, Items, ItemsFile, TalepsrcService } from 'src/app/services/SatinAlmaSrc';
import { DepoTransferModel } from 'src/app/services/SiparisSrc';
import { TabService } from 'src/app/services/tab.service';
import { Tab } from 'src/app/services/tabs-mod';
import { CofirmsrcService } from 'src/app/utils/confirm-dialog/cofirmsrc.service';
import { TalepDetayComponent } from '../talep-detay/talep-detay.component';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers:[
    {provide:DatePipe},
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } }
  ]
})
export class TransferComponent implements OnInit {
  @ViewChild('gridDepoTransfer', { static: false }) grid!: DxDataGridComponent;
  @BlockUI() blockUI!: NgBlockUI;
  taleplist: DepoTransferModel[]=[]; 
  selectedItemKeys: any[] = [];
  silgoster:boolean=false;
  allMode: string="";
  checkBoxesMode: string="";
  secilidata:DepoTransferModel[]=[];
  @Input() data:any;     
  yetki:KullaniciYetki; 
  filter!:FilterMod; 
  evrekyuklegoster:boolean=false;
  secilikalem:DepoTransferModel;
  onayid:number=0;
  kalemlist:Items[]=[]; 
  kalemsecimlist:DepoTransferModel[]=[]; 
  olcubirimlist: ConnOlcuBirim[]=[];  
  talepihtdurumlist: ConnTalepIhtDurum[]=[]; 
  stokgruplist: StokGrupModel[]=[]; 
  depolist: ConDepoYetki[]=[]; 
  kalemkeyword:string=""; 
  MagazaKod:string=""; 
  TalepAciklama:string=""; 
  TalepTarih:any; 

  protected _onDestroy = new Subject<void>();

  public formDepo: FormControl = new FormControl();
  public filterDepo: ReplaySubject<ConDepoYetki[]> = new ReplaySubject<ConDepoYetki[]>(1);

  constructor(
    private tabService: TabService,
    private talepsrc:TalepsrcService,
    private alertify:NotifyService,
    private confirmationDialogService: CofirmsrcService,
    private modalService: NgbModal,
    private genelsrv:GenelApi,
    private kullanicisrc:KullaniciSrcService,
    private sabitsrc:SabitservService
    ) {  
      this.allMode = 'allPages';
      this.checkBoxesMode = 'always';
      this.yetki=new  KullaniciYetki(); 
      this.secilikalem=new  DepoTransferModel(); 
    }

  ngOnInit() {
    this.yetki = this.data?.yetki;
    let date=new Date;  
    let baslangic=new Date(date.getUTCFullYear(),date.getUTCMonth(),1); 
    this.filter = new FilterMod(baslangic,date);  

    this.GetKullaniciDepoYetki();
    this.GetStokOlcuBirim();
    this.GetTalepIhtiyacDurum();

    //this.TalepListele();    
    this.formDepo.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {this.filterDepoList();});  

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
      this.depolist=data.List;  
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

  async TalepListele()  {
    this.blockUI.start(EkranMesaj.Listele);
      (await this.talepsrc.getTalepList(0,"A",this.filter.Baslangic,this.filter.Bitis,false)).subscribe(
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
        this.TalepListele();
    } 
    else{
      this.alertify.warning(sonuc.Message);
      this.TalepListele();
    } 
    this.blockUI.stop(); 
}

tekraronaygoster:boolean=false;
silgosterChanged(e:any){
  let silinecekler  = this.grid.instance.getSelectedRowsData();
  this.selectedItemKeys = e.selectedRowKeys;
  this.tekraronaygoster=false;

  if (silinecekler!=null && silinecekler.length==1){
    this.silgoster=true;
    this.evrekyuklegoster=true;
    this.secilikalem = silinecekler[0] as DepoTransferModel;
    this.secilidata = silinecekler; 

    if(this.secilikalem.DurumId===3){
      this.tekraronaygoster=true;
    }
  }
  else if (silinecekler!=null && silinecekler.length>1){
    this.silgoster=true;
    this.evrekyuklegoster=false;
    this.secilikalem =new DepoTransferModel();
    this.secilidata = silinecekler; 
  }
  else {
    this.silgoster=false;
    this.evrekyuklegoster=false;
    this.secilikalem =new DepoTransferModel();
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

onaytakip(content:any,data:DepoTransferModel){
  if(data.OnayId<=0){
    this.alertify.warning("Onay Bilgisi Okunamadı!");
    return;
  }
  
  this.onayid=data.OnayId;
  this.modalService.open(content, {  size: 'lg',windowClass: 'modalcss45', backdrop: 'static' });   
}  


listeyeekle(){
  let devam=true;
  if(this.kalemlist==null || this.kalemlist.length<=0){
    this.alertify.warning("Kalem Listesi Boş Olamaz!");
    devam=false;
    return;
  }

  this.kalemlist.forEach(item=> { item.Miktar = parseFloat( (item.Miktar??0).toString().replace(",","."))});

  if(this.kalemlist.filter(item=> item.Miktar>0 ).length<=0){
    this.alertify.warning("Miktar Girilen Satır Bulunamadı!");
    devam=false;
    return;
  }

  var list = this.kalemlist.filter(item=> item.Miktar>0);

  list.forEach(item=> {
   if(item.DepoKodu=="" || item.DepoKodu==null){
    this.alertify.warning("Miktar Girilen Satırlarda Depo Seçimi Zorunludur! => " + item.ItemName );
    devam=false;
    return;
   }
   if(item.BirimId<=0){
    this.alertify.warning("Miktar Girilen Satırlarda Depo Seçimi Zorunludur! => " + item.ItemName );
    devam=false;
    return;
   }
   if(item.BirimTutar<=0 || item.BirimTutar==undefined || item.BirimTutar==null){
    this.alertify.warning("Tahmini Tutar Sıfırdan Büyük Olmalıdır! => " + item.ItemName );
    devam=false;
    return;
   }
   if(item.Aciklama=="" || item.Aciklama==null || item.Aciklama==undefined){
    this.alertify.warning("Açıklama Alanı Zorunludur! => " + item.ItemName );
    devam=false;
    return;
   }
  });     

  if(devam){
    list.forEach(item=> {  
      let td=new DepoTransferModel();
      td.Miktar=item.Miktar; 
      td.StokKodu=item.ItemCode;
      td.StokAdi=item.ItemName;
      td.DepoKodu=item.DepoKodu; 
      td.Aciklama=item.Aciklama;
      td.SatirGuid = this.genelsrv.GuidGenerator();
      td.BelgeBase64=item.BelgeBase64;     
      td.BelgeAdi=item.BelgeAdi;     
      td.BelgeUzanti=item.BelgeUzanti;   
      td.Birim=item.Birim;   
      td.BirimId=item.BirimId; 
      td.Files=item.Files;  
      td.Base64List=item.Base64List;  
      this.kalemsecimlist.push(td);
    }); 
    this.kaydet(false); 
  }
}

async kaydet(tumu:boolean){
  if(this.kalemsecimlist.length<=0){
    this.alertify.warning("Malzeme Eklenmeden Kayıt İşlemi Yapılamaz!");
    return;
  } 

  //  this.blockUI.start("Kayıt Başladı...");
  //     var sonuc = await this.talepsrc.SatinAlmaTalepOlustur(this.talepmaster,this.kalemsecimlist,this.talepmaster.Id>0?IslemTipi.Guncelle:IslemTipi.Ekle);
  //    if(sonuc.Success==true){
  //       this.alertify.success("Talep Oluşturuldu!") ;
  //       this.kalemsecimlist=[];
       

  //       this.TalepListele();
  //       this.kalemlist.forEach((x)=>{ 
  //         x.Miktar = 0; 
  //       })    
  //    } 
  //    else{
  //     this.kalemsecimlist=[];
  //     this.alertify.warning(sonuc.Message);
  //    } 
  //    this.blockUI.stop(); 
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

onCellPreparedKalem (e:any) {
  if (e.rowType == "data") {
     if(e.column.dataField === "Miktar") e.cellElement.classList.add("datagiriscolor");
     if(e.column.dataField === "BirimId") e.cellElement.classList.add("datagiriscolor");
     if(e.column.dataField === "BirimTutar") e.cellElement.classList.add("datagiriscolor");
     if(e.column.dataField === "DepoKodu") e.cellElement.classList.add("datagiriscolor");
     if(e.column.dataField === "Aciklama") e.cellElement.classList.add("datagiriscolor");
  }
}

kalemEklemod(content:any){  
    this.kalemlist=[];
    this.kalemkeyword=""; 
    this.TalepAciklama="";
    this.TalepTarih = moment(new Date).format("yyyy-MM-DD"); 
    this.modalService.open(content, {  size: 'lg',windowClass: 'modalcss75', backdrop: 'static' }); 
}  

async kalemAra(ev:any){ 
  if(this.kalemkeyword==""){
    this.alertify.warning("Aramak İstediğiniz Ürünü Kısaca Yazın...");
    return;
  }

  if (ev.keyCode === 13 && this.kalemkeyword!="") {
    this.blockUI.start(EkranMesaj.Listele);
    var sonuc = await this.genelsrv.GetTransferStokList("", 50, this.kalemkeyword?.toLocaleUpperCase('tr')??"",this.MagazaKod);
    this.blockUI.stop(); 
    if(sonuc.Success){
      this.kalemlist=sonuc.List;
    }
    else{
      this.alertify.warning(sonuc.Message);
    }   
  }
}

async kalemAraDef(){
  this.blockUI.start(EkranMesaj.Listele);
  var sonuc = await this.genelsrv.GetTransferStokList("", 50, this.kalemkeyword?.toLocaleUpperCase('tr')??"",this.MagazaKod);
  this.blockUI.stop(); 
  if(sonuc.Success){
    this.kalemlist=sonuc.List;
  }
  else{
    this.alertify.warning(sonuc.Message);
  }   
}

aramaTemizle(){
  this.kalemkeyword="";
  this.kalemlist=[];
}

defGrup(event: any) {
  this.MagazaKod = "";
  event.stopPropagation();
}



}
