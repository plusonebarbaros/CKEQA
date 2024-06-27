import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DxDataGridComponent } from 'devextreme-angular';
import moment from 'moment';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subject, ReplaySubject, takeUntil } from 'rxjs';
import { StokGrupModel, GenelApi, EkranMesaj, IslemTipi, SehirModel, IlceModel } from 'src/app/services/GenelSrc';
import { KullaniciYetki, ConDepoYetki, KullaniciModel, KullaniciSrcService } from 'src/app/services/KullaniciSrc';
import { NotifyService } from 'src/app/services/notify';
import { ConnOlcuBirim, SabitservService } from 'src/app/services/SabitSrc';
import { Items, Customer, ConnTalepIhtDurum, TalepsrcService, TalepMaster, ItemsFile } from 'src/app/services/SatinAlmaSrc';
import { OzelSiparisMaster, OzelSiparisKalem, SiparisService } from 'src/app/services/SiparisSrc';
import { CofirmsrcService } from 'src/app/utils/confirm-dialog/cofirmsrc.service';

@Component({
  selector: 'app-ozel-siparis-detay',
  templateUrl: './ozel-siparis-detay.component.html',
  styleUrls: ['./ozel-siparis-detay.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers:[
    {provide:DatePipe},
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } }
  ]
})
export class OzelSiparisDetayComponent implements OnInit {
  @ViewChild('gridTalepDetay', { static: false }) gridTalepDetay!: DxDataGridComponent;
  @BlockUI() blockUI!: NgBlockUI;
  @Input() data:any;  
  yetki:KullaniciYetki; 
  sipyetki:KullaniciYetki; 
  teslimyetki:KullaniciYetki; 
  lookupDataSource = {};
  date:any; 
  master: OzelSiparisMaster;
  talepdetay:OzelSiparisKalem[]=[]; 
  kalemsecimlist:OzelSiparisKalem[]=[]; 
  public userBranch:  any;
  public depolist: ConDepoYetki[]=[]; 
  kalemlist:Items[]=[]; 
  kalemkeyword:string=""; 
  silgoster:boolean=false;
  evrekyuklegoster:boolean=false;
  secilidata:OzelSiparisKalem[]=[];
  allMode: string="";
  checkBoxesMode: string="";
  selectedItemKeys: any[] = [];
  pdfdata!:any;  
  firmalist:Customer[]=[];
  secilifirma:Customer;
  firmakalemkeyword:string=""; 
  onayid:number=0;
  talepid:number=0;
  Kontrol:boolean=false;
  stokgruplist: StokGrupModel[]=[]; 
  secilikalem:OzelSiparisKalem;
  loguser:KullaniciModel;  
  olcubirimlist: ConnOlcuBirim[]=[];  
  talepihtdurumlist: ConnTalepIhtDurum[]=[]; 
  sehirlist: SehirModel[]=[];  
  ilcelist: IlceModel[]=[];   
  teslimilcelist: IlceModel[]=[];   
  musteribilgi:OzelSiparisMaster;
  
  protected _onDestroy = new Subject<void>();

  public formStokGrup: FormControl = new FormControl();
  public filterStokGrup: ReplaySubject<StokGrupModel[]> = new ReplaySubject<StokGrupModel[]>(1);
  
  public formSehir: FormControl = new FormControl();
  public filterSehir: ReplaySubject<SehirModel[]> = new ReplaySubject<SehirModel[]>(1);

  public formilce: FormControl = new FormControl();
  public filterilcer: ReplaySubject<IlceModel[]> = new ReplaySubject<IlceModel[]>(1);

  public formilceTeslim: FormControl = new FormControl();
  public filterilcerTeslim: ReplaySubject<IlceModel[]> = new ReplaySubject<IlceModel[]>(1);


  public formSube: FormControl = new FormControl();
  public filterSube: ReplaySubject<ConDepoYetki[]> = new ReplaySubject<ConDepoYetki[]>(1);


  constructor(
    public datepipe: DatePipe,
    private genelsrv:GenelApi,
    private alertify:NotifyService,
    private talepsrc:TalepsrcService,
    private siparissrc:SiparisService,
    private kullanicisrc:KullaniciSrcService,
    private modalService: NgbModal,
    private confirmationDialogService: CofirmsrcService,
    private sanitizer: DomSanitizer,
    private sabitsrc:SabitservService
    ) {       
    this.kalemkeyword="";
    this.allMode = 'allPages';
    this.checkBoxesMode = 'always';
    this.secilifirma=new Customer();
    this.master = new OzelSiparisMaster();
    this.musteribilgi = new OzelSiparisMaster();
    this.yetki = this.kullanicisrc.userperm.filter((x)=>x.YetkiKodu=="YT0012")[0];
    this.sipyetki  = this.kullanicisrc.userperm.filter((x)=>x.YetkiKodu=="YT0024")[0];
    this.teslimyetki = this.kullanicisrc.userperm.filter((x)=>x.YetkiKodu=="YT0025")[0];
   }   

   async TalepDetayGetir() {
    this.blockUI.start(EkranMesaj.Listele);
       (await this.siparissrc.GetOzelSiparisDetay(this.master.Id)).subscribe(
        data=>{
          this.blockUI.stop(); 
          if(!data.Success){
            this.alertify.warning(data.Message);
            return;
          } 
          this.talepdetay=data.List; 
        }
      )
   } 

  ngOnInit() {
    this.loguser = JSON.parse(sessionStorage.getItem('data')??"") as KullaniciModel;
    const now = new Date();

     this.Kontrol = this.data?.Kontrol ?? false;  
     let talepeden = this.loguser.AdSoyad;
     this.talepid =this.data._talepid;
     
      this.GetKullaniciDepoYetki();
      this.GetStokGrup();
      this.GetStokOlcuBirim();

      this.formStokGrup.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {this.filterStokGrupList();});  

      if(this.kullanicisrc.sehirlist!=null && this.kullanicisrc.sehirlist.length>0){
        this.sehirlist  = this.kullanicisrc.sehirlist;
        this.filterSehir.next(this.sehirlist.slice());
      } 
      this.formSehir.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {this.filterSehirList();});  
      this.formilce.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {this.filterIlceList();});  
      this.formilceTeslim.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {this.filterIlceTeslimList();});  
      this.formSube.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {this.filterSubeList();});  


    if(this.talepid!=null && this.talepid>0){ 
      this.GetOzelSiparisList(); 
    }else  { 
      this.master=new OzelSiparisMaster();
      this.master.DurumId=0;
      this.master.ErpSirket = this.loguser.AktifSirket;
      this.master.Tarih=moment(new Date()).format("yyyy-MM-DD");
      this.master.TeslimTarih=moment(new Date()).format("yyyy-MM-DD");
      this.master.Ekleyen=talepeden; 
      this.master.SehirKod="34"; 
      this.master.TeslimSehirKod="34"; 
      this.master.TeslimSaati = (now.getHours())+":00";
      this.master.TeslimatSubeId = this.loguser.CalistigiSubeKod;
      this.GetSehirListele(this.master.SehirKod,true);
      this.GetTeslimSehirListele(this.master.TeslimSehirKod,true);
    }
  }

  protected filterSubeList() {
    if (!this.depolist) {
      return;
    } 
    let search = this.formSube.value+"";
    if (!search) {
      this.filterSube.next(this.depolist.slice());
      return;
    } else {
      search = search.toUpperCase();
    } 
    this.filterSube.next(
      this.depolist.filter(item => item?.DepoAdi.toUpperCase().indexOf(search) > -1)
    );
  } 

  protected filterSehirList() {
    if (!this.sehirlist) {
      return;
    } 
    let search = this.formSehir.value+"";
    if (!search) {
      this.filterSehir.next(this.sehirlist.slice());
      return;
    } else {
      search = search.toUpperCase();
    } 
    this.filterSehir.next(
      this.sehirlist.filter(item => (item?.Name??"").toUpperCase().indexOf(search) > -1)
    );
  } 

  protected filterIlceList() {
    if (!this.ilcelist) {
      return;
    } 
    let search = this.formilce.value+"";
    if (!search) {
      this.filterilcer.next(this.ilcelist.slice());
      return;
    } else {
      search = search.toUpperCase();
    } 
    this.filterilcer.next(
      this.ilcelist.filter(item => item?.IlceAdi.toUpperCase().indexOf(search) > -1)
    );
  } 

  protected filterIlceTeslimList() {
    if (!this.teslimilcelist) {
      return;
    } 
    let search = this.formilceTeslim.value+"";
    if (!search) {
      this.filterilcerTeslim.next(this.teslimilcelist.slice());
      return;
    } else {
      search = search.toUpperCase();
    } 
    this.filterilcerTeslim.next(
      this.teslimilcelist.filter(item => item?.IlceAdi.toUpperCase().indexOf(search) > -1)
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

  ngOnDestroy(): void {
     this._onDestroy.next();
      this._onDestroy.complete();
  }

  protected filterStokGrupList() {
    if (!this.stokgruplist) {
      return;
    } 
    let search = this.formStokGrup.value+"";
    if (!search) {
      this.filterStokGrup.next(this.stokgruplist.slice());
      return;
    } else {
      search = search.toUpperCase();
    } 
    this.filterStokGrup.next(
      this.stokgruplist.filter(item => (item?.ItmsGrpNam??"").toUpperCase().indexOf(search) > -1)
    );
  } 

  StokGrupId:number=0;
  async GetStokGrup() {
    this.blockUI.start("Depo Yetki Okunuyor...");
    (await this.genelsrv.GetStokGrup("",true)).subscribe((data)=>{  
      this.blockUI.stop();  
      if(!data.Success){
        this.alertify.warning(data.Message);
        return;
      }
      this.stokgruplist=data.List;  
      this.filterStokGrup.next(this.stokgruplist.slice());
   })  
  }
  
  defGrup(event: any) {
    this.StokGrupId = 0;
    event.stopPropagation();
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
      this.filterSube.next(this.depolist.slice());
   })  
  }

  async GetOzelSiparisList()  {
    this.blockUI.start(EkranMesaj.Listele);
      (await this.siparissrc.GetOzelSiparisList(this.talepid,"A",new Date(),new Date(),this.Kontrol)).subscribe(
        data=>{
          this.blockUI.stop(); 
          if(!data.Success){
            this.alertify.warning(data.Message);
            return;
          }
          if(data.List==null || data.List.length<=0){
            this.alertify.warning("Talep Detayı Bulunamadı!");
            return;
          }
          
          this.master=data.List[0];    
          this.TalepDetayGetir();

          this.GetSehirListele(this.master.SehirKod,this.master.SehirKod==""?true:false);
          this.GetTeslimSehirListele(this.master.TeslimSehirKod,this.master.TeslimSehirKod==""?true:false);
    
        }
      )     
  } 
   
  async kaydet(tumu:boolean){
    if(this.master.MusteriAdi=="" || this.master.MusteriAdi==null){
      this.alertify.warning("Müşteri Adı Alanı Zorunludur");
      return;
    }
    if(this.master.Gsm=="" || this.master.Gsm==null){
      this.alertify.warning("Müşteri Cep Telefon Alanı Zorunludur");
      return;
    }
    if(this.master.Adres=="" || this.master.Adres==null){
      this.alertify.warning("Müşteri Adres Alanı Zorunludur");
      return;
    }
    if(this.master.SehirKod=="" || this.master.SehirKod==null){
      this.alertify.warning("Müşteri Şehir Alanı Zorunludur");
      return;
    }
    if(this.master.IlceKod<=0){
      this.alertify.warning("Müşteri İlçe Alanı Zorunludur!");
      return;
    } 
    if(this.master.TeslimatSubeId=="" || this.master.TeslimatSubeId==null){
      this.alertify.warning("Teslimat Şube Seçimi Zorunludur");
      return;
    }
    if(this.master.TeslimatKisi=="" || this.master.TeslimatKisi==null){
      this.alertify.warning("Teslimat Kişi Alanı Zorunludur");
      return;
    }
    if(this.master.TeslimatGsm=="" || this.master.TeslimatGsm==null){
      this.alertify.warning("Teslimat Cep Telefon Alanı Zorunludur");
      return;
    }
    if(this.master.TeslimTarih=="" || this.master.TeslimTarih==null){
      this.alertify.warning("Teslimat Tarih Alanı Zorunludur");
      return;
    }
    if(this.master.TeslimatAdres=="" || this.master.TeslimatAdres==null){
      this.alertify.warning("Teslimat Adres Alanı Zorunludur");
      return;
    }
    if(this.master.TeslimSehirKod=="" || this.master.TeslimSehirKod==null){
      this.alertify.warning("Teslimat Şehir Alanı Zorunludur");
      return;
    }
    if(this.master.TeslimIlceKod<=0){
      this.alertify.warning("Teslimat İlçe Alanı Zorunludur!");
      return;
    } 
    if(this.master.FaturaKesilecekmi){
      if(this.master.Tckn=="" && this.master.VergiNo==""){
        this.alertify.warning("Fatura Kesilecek Parametresi Seçili İse Tc Kimlik Numarası veya Vergi Numarası Girişi Zorunludur!");
        return;
      } 
    }
     
    if(this.talepdetay.length<=0){
      this.alertify.warning("Malzeme Eklenmeden Kayıt İşlemi Yapılamaz!");
      return;
    }  
     this.blockUI.start("Kayıt Başladı...");
        var sonuc = await this.siparissrc.OzelSiparisOluttur(this.master,this.talepdetay,this.master.Id>0?IslemTipi.Guncelle:IslemTipi.Ekle);
       if(sonuc.Success==true){
          this.alertify.success("Talep Oluşturuldu!") ;
          this.kalemsecimlist=[];

          if(this.master.Id<=0){
            this.master.Id=sonuc.Id;
            this.master.validkey=sonuc.ValidKey;
            this.master.DurumId=1;
          } 

          this.TalepDetayGetir();
          this.aramaTemizle();   
          this.kalemlist.forEach((x)=>{ 
            x.Miktar = 0; 
          })
          this.StokGrupId=0;     
       } 
       else{
        this.kalemsecimlist=[];
        this.alertify.warning(sonuc.Message);
       } 
       this.blockUI.stop(); 
  }

  kalemEklemod(content:any){  
    this.kalemlist=[];
    this.kalemkeyword=""; 
    this.StokGrupId=0;
    this.modalService.open(content, {  size: 'lg',windowClass: 'modalcss75', backdrop: 'static' }); 
  }  
  
  async kalemAra(ev:any){ 
    if(this.kalemkeyword==""){
      this.alertify.warning("Aramak İstediğiniz Ürünü Kısaca Yazın...");
      return;
    }

    if (ev.keyCode === 13 && this.kalemkeyword!="") {
      this.blockUI.start(EkranMesaj.Listele);
      var sonuc = await this.genelsrv.GetStokList("", 50, this.kalemkeyword?.toLocaleUpperCase('tr')??"","",this.StokGrupId);
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
    var sonuc = await this.genelsrv.GetStokList("", 50, this.kalemkeyword?.toLocaleUpperCase('tr')??"","",this.StokGrupId);
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
      this.alertify.warning("Miktar Girilen Satırlarda Şube Seçimi Zorunludur! => " + item.ItemName );
      devam=false;
      return;
     }
     if(item.BirimId<=0){
      this.alertify.warning("Miktar Girilen Satırlarda Birim Seçimi Zorunludur! => " + item.ItemName );
      devam=false;
      return;
     }     
    });     

    if(devam){
      list.forEach(item=> {  
        let td=new OzelSiparisKalem();
        td.Id=0;
        td.Miktar=item.Miktar; 
        td.UrunKodu=item.ItemCode;
        td.UrunAdi=item.ItemName;
        td.DepoKodu=item.DepoKodu; 
        td.DepoStok=0; 
        td.Aciklama=item.Aciklama;
        td.SatirGuid = this.genelsrv.GuidGenerator();
        td.SapSirketId=this.master.ErpSirket;    
        td.Fiyat=item.BirimTutar;     
        td.ToplamTutar=item.ToplamTutar;     
        td.IskontoOran=item.IskontoOran;     
        td.BelgeBase64=item.BelgeBase64;     
        td.BelgeAdi=item.BelgeAdi;     
        td.BelgeUzanti=item.BelgeUzanti;   
        td.Birim=item.Birim;   
        td.BirimId=item.BirimId; 
        td.Files=item.Files;  
        td.Base64List=item.Base64List;  
        td.TalepDurumId=item.TalepDurumId;  
        this.talepdetay.push(td);
      }); 
      // this.kaydet(false); 
      this.modalService.dismissAll();
    }
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
    var sonuc = await this.siparissrc.OzelSiparisSatirGuncelle(e.data);
    if(sonuc.Success==true){  
        this.TalepDetayGetir();
    } 
    else{
      this.alertify.warning(sonuc.Message);
      this.TalepDetayGetir();
    } 
    this.blockUI.stop(); 
}

tekraronaygoster:boolean=false;
silgosterChanged(e:any){
  let silinecekler  = this.gridTalepDetay.instance.getSelectedRowsData();
  this.selectedItemKeys = e.selectedRowKeys;
  this.tekraronaygoster=false;

  if (silinecekler!=null && silinecekler.length==1){
    this.silgoster=true;
    this.evrekyuklegoster=true;
    this.secilikalem = silinecekler[0] as OzelSiparisKalem;
    this.secilidata = silinecekler; 

    if(this.secilikalem.DurumId===3){
      this.tekraronaygoster=true;
    }
  }
  else if (silinecekler!=null && silinecekler.length>1){
    this.silgoster=true;
    this.evrekyuklegoster=false;
    this.secilikalem =new OzelSiparisKalem();
    this.secilidata = silinecekler; 
  }
  else {
    this.silgoster=false;
    this.evrekyuklegoster=false;
    this.secilikalem =new OzelSiparisKalem();
    this.secilidata=[];
   }
}
 
firmaSec(content:any){
  this.firmalist=[];
  this.secilifirma=new Customer();     
  this.modalService.open(content, {  size: 'lg',windowClass: 'modalcss55', backdrop: 'static' }); 
} 

firmaSecimYap(){ 
  // this.master.FirmaKodu=this.secilifirma.FirmaKodu;   
  // this.master.FirmaAdi=this.secilifirma.FirmaAdi;    

  document.getElementById("finhspkapat")?.click();  
}

onFirmaChg(e:any){
  let secim = e?.selectedRowsData[0] ?? null;
  if(secim!=null){
    this.secilifirma = secim;
  } 
}

firmaTemizle(){
  // this.master.FirmaKodu="";  
  // this.master.FirmaAdi="";  
  }

 async firmaAra(ev:any){ 
    if(this.firmakalemkeyword==""){
      this.alertify.warning("Aramak İstediğiniz Firmayı Kısaca Yazın...");
      return;
    }

    if (ev.keyCode === 13 && this.firmakalemkeyword!="") {  
      this.blockUI.start(EkranMesaj.Listele);
      var sonuc = await this.genelsrv.CariList(this.firmakalemkeyword??"", 50, "S","");
      this.blockUI.stop(); 
      if(sonuc.Success){
        this.firmalist=sonuc.List;  
      }
      else{
        this.alertify.warning(sonuc.Message);
      } 
    }
 }

 firmaAramaTemizle(){
    this.firmakalemkeyword="";
    this.firmalist=[];
 }

  onaytakip(content:any,data:OzelSiparisKalem){
    if(data.OnayId<=0){
      this.alertify.warning("Onay Bilgisi Okunamadı!");
      return;
    }
    
    this.onayid=data.OnayId;
    this.modalService.open(content, {  size: 'lg',windowClass: 'modalcss45', backdrop: 'static' });   
  }  

  async formYazdir(content:any){
    var devam=true;
    if(this.master==null || this.master.Id<=0){
      this.alertify.warning("Seçim Yapılmadı!");
      devam=false;
      return;
    }  

    if (devam){
      this.blockUI.start(EkranMesaj.Listele); 
      var sonuc = await this.siparissrc.OzelSiparisFormYazdir(this.master,2);
        if(sonuc.Success==true){ 
          this.pdfdata = this.sanitizer.bypassSecurityTrustResourceUrl('data:application/pdf;base64,' + sonuc.Message);
         this.modalService.open(content, {  size: 'lg',windowClass: 'modalcss40', backdrop: 'static' });  
        } else{
        this.alertify.warning(sonuc.Message);
        }      
      this.blockUI.stop(); 
    } 
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

  async kayitsil(){    
    if(this.secilidata==null || this.secilidata.length<=0){
      this.alertify.warning("Seçim Yapılmadı!") 
      return;
    } 
  
    this.confirmationDialogService.confirm('Sil','Seçili Satırlar Silinecek, Devam Edilsin mi?')
    .then(async (confirmed:any) => 
    {
      if(confirmed.sonuc==true)  {
        this.blockUI.start(EkranMesaj.Kaydet);
        var sonuc = await this.siparissrc.OzelSiparisOluttur(this.master,this.secilidata,IslemTipi.KalemSil);
        if(sonuc.Success==true){
            this.alertify.success(EkranMesaj.KayitTamamlandi);  
            this.TalepDetayGetir();  
          } else{
            this.alertify.warning(sonuc.Message);
          }
          this.blockUI.stop();  
      }
    })
    .catch(() => { 
    }); 
  }

  tarihceDetay(content:any,data:OzelSiparisKalem){
    this.secilikalem=data;
    this.modalService.open(content, {  size: 'lg',windowClass: 'modalcss45', backdrop: 'static' });   
  }  

  onCellPreparedKalem (e:any) {
    if (e.rowType == "data") {
       if(e.column.dataField === "Miktar") e.cellElement.classList.add("datagiriscolor");
       if(e.column.dataField === "BirimTutar") e.cellElement.classList.add("datagiriscolor");
       if(e.column.dataField === "IskontoOran") e.cellElement.classList.add("datagiriscolor");
       if(e.column.dataField === "Aciklama") e.cellElement.classList.add("datagiriscolor");
       if(e.column.dataField === "ToplamTutar") e.cellElement.classList.add("datagiriscolor");
       if(e.column.dataField === "Birim") e.cellElement.classList.add("datagiriscolor");
    }
  }

  onSehirChg(e:any){
    this.GetSehirListele(e.value,true);
  } 

  GetSehirListele(e:any,reset:boolean){
    this.ilcelist=[];
    if(reset)this.master.IlceKod=0;
    this.ilcelist = this.kullanicisrc.ilcelist.filter((x)=>x.IlId==e);
    this.filterilcer.next(this.ilcelist.slice());
  }

  GetTeslimSehirListele(e:any,reset:boolean){
    this.teslimilcelist=[];
    if(reset)this.master.IlceKod=0;
    this.teslimilcelist = this.kullanicisrc.ilcelist.filter((x)=>x.IlId==e);
    this.filterilcerTeslim.next(this.teslimilcelist.slice());
  }

  onSehirTeslimChg(e:any){
    this.teslimilcelist=[];
    this.teslimilcelist = this.kullanicisrc.ilcelist.filter((x)=>x.IlId==e.value);
    this.filterilcerTeslim.next(this.teslimilcelist.slice());
  } 

  async siparisolustur(){    
    if(this.master.Id <= 0){
      this.alertify.warning("Seçim Yapılmadı!") 
      return;
    } 
    if(this.master.SapSiparisNo > 0){
      this.alertify.warning("Sipariş Oluşan Taleplerde İşlem Yapılamaz!") 
      return;
    } 
  
    this.confirmationDialogService.confirm('Sipariş','SAP Siparişi Oluşturulacak, Devam Edilsin mi?')
    .then(async (confirmed:any) => 
    {
      if(confirmed.sonuc==true)  {
        this.blockUI.start(EkranMesaj.Kaydet);
        var sonuc = await this.siparissrc.OzelSiparisOlustur(this.master.Id);
        if(sonuc.Success==true){
            this.alertify.success(EkranMesaj.KayitTamamlandi); 
            this.master.SapSiparisNo=sonuc.Id;
            this.master.DurumId=2;
            this.TalepDetayGetir();
          } else{
            this.alertify.warning(sonuc.Message);
          }
          this.blockUI.stop();  
      }
    })
    .catch(() => { 
    }); 
  }

  async teslimEt(){    
    if(this.master.Id <= 0){
      this.alertify.warning("Seçim Yapılmadı!") 
      return;
    } 
    if(this.master.SapSiparisNo <= 0){
      this.alertify.warning("Sipariş Oluşan Taleplerde İşlem Yapılabilir!") 
      return;
    } 
  
    this.confirmationDialogService.confirm('Sipariş','Sipariş Teslim Edildi Olarak Güncellenecek, Devam Edilsin mi?')
    .then(async (confirmed:any) => 
    {
      if(confirmed.sonuc==true)  {
        this.blockUI.start(EkranMesaj.Kaydet);
        var sonuc = await this.siparissrc.OzelSiparisTeslim(this.master.Id);
        if(sonuc.Success==true){
            this.alertify.success("İşlem Tamamlandı"); 
            this.master.DurumId=3;
            this.TalepDetayGetir();
          } else{
            this.alertify.warning(sonuc.Message);
          }
          this.blockUI.stop();  
      }
    })
    .catch(() => { 
    }); 
  }


  musteriSorgula(tip:string){
    if(tip=="Tckn"){
      if(this.master.Tckn.length==11){
        this.GetOzelSiparisFirst(tip,this.master.Tckn);
      }
      else this.alertify.warning("Tckn 11 Karakter Olmalıdır!"); 
    }
    if(tip=="Vkn"){
      if(this.master.VergiNo.length==10){
        this.GetOzelSiparisFirst(tip,this.master.VergiNo);
      }
      else this.alertify.warning("Vergi No 10 Karakter Olmalıdır!"); 
    }
    if(tip=="Gsm"){
      if(this.master.Gsm.length==10){
        this.GetOzelSiparisFirst(tip,this.master.Gsm);
      }
      else this.alertify.warning("Cep Telefon 10 Karakter Olmalıdır!"); 
    }
  }

  async GetOzelSiparisFirst(f1:string,f2:string)  {
    this.blockUI.start(EkranMesaj.Listele);
      (await this.siparissrc.GetOzelSiparisFirst(f1,f2)).subscribe(
        data=>{
          this.blockUI.stop();
          if(!data.Success){
            this.alertify.warning(data.Message);
            return;
          }

          if(data.List==null || data.List.length<=0){
            this.alertify.warning("Girilen Bilgilere Göre Kayıt Bulunadı!"); 
            return;
          }
          else {
            this.musteribilgi=data.List[0] as OzelSiparisMaster;
            this.master.MusteriAdi = this.musteribilgi.MusteriAdi;
            this.master.SiparisVerenKisi = this.musteribilgi.SiparisVerenKisi;
            this.master.Gsm = this.musteribilgi.Gsm;
            this.master.Telefon1 = this.musteribilgi.Telefon1;
            this.master.Email = this.musteribilgi.Email;
            this.master.VergiDairesi = this.musteribilgi.VergiDairesi;
            this.master.VergiNo = this.musteribilgi.VergiNo;
            this.master.Tckn = this.musteribilgi.Tckn;
            this.master.Adres = this.musteribilgi.Adres;
            this.master.SehirKod = this.musteribilgi.SehirKod;            
            
            this.ilcelist=[];
            this.ilcelist = this.kullanicisrc.ilcelist.filter((x)=>x.IlId==this.master.SehirKod);
            this.filterilcer.next(this.ilcelist.slice());

            this.master.IlceKod = this.musteribilgi.IlceKod;
          }
        }
      )
  }

  musteriTemizle(tip:string){
    if(tip=="Tckn")this.master.Tckn="";
    if(tip=="Vkn")this.master.VergiNo="";
    if(tip=="Gsm")this.master.Gsm="";
  }

  async KalemBilgiDegisti(e:any){ 
    if(e==null || e.data ==null){
      e.data.ToplamTutar=0;
      e.data.GenelToplam=0;
      return;
    }
    else{
      if(e.data.IskontoOran<0 || e.data.IskontoOran>100){
        this.alertify.warning("İskonto Oranı 0 ile 100 Arasında Olmalıdır!"); 
        e.data.IskontoOran=0;
      }

      if(e.data.BirimTutar>0 && e.data.Miktar>0){
        e.data.ToplamTutar  = e.data.BirimTutar * e.data.Miktar;
        if(e.data.IskontoOran>0){
          e.data.ToplamTutar -= (e.data.ToplamTutar * (e.data.IskontoOran/100));
        }

        e.data.Iskonto =  (e.data.BirimTutar * e.data.Miktar) - e.data.ToplamTutar;
        e.data.GenelToplam = e.data.ToplamTutar;
      } 
      else {
        e.data.ToplamTutar=0;
        e.data.GenelToplam=0;
      }
    }    
}

}
