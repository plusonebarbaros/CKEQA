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
import { ConnOzelSiparis, OzelSiparisKalem, SiparisService } from 'src/app/services/SiparisSrc';
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
  lookupDataSource = {};
  date:any; 
  master: ConnOzelSiparis;
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
  
  protected _onDestroy = new Subject<void>();

  public formStokGrup: FormControl = new FormControl();
  public filterStokGrup: ReplaySubject<StokGrupModel[]> = new ReplaySubject<StokGrupModel[]>(1);
  
  public formSehir: FormControl = new FormControl();
  public filterSehir: ReplaySubject<SehirModel[]> = new ReplaySubject<SehirModel[]>(1);

  public formilce: FormControl = new FormControl();
  public filterilcer: ReplaySubject<IlceModel[]> = new ReplaySubject<IlceModel[]>(1);


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
    this.yetki=new  KullaniciYetki();
    this.secilifirma=new Customer();
    this.master = new ConnOzelSiparis();
   }   

   async TalepDetayGetir() {
    this.blockUI.start(EkranMesaj.Listele);
       (await this.talepsrc.getTalepDetayList(this.master.Id)).subscribe(
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

     this.yetki = this.data?.yetki; 
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


    if(this.talepid!=null && this.talepid>0){ 
      this.TalepListele(); 
      this.GetSehirListele(this.master.SehirKod,this.master.SehirKod!=""?true:false);
    }else  { 
      this.master=new ConnOzelSiparis();
      this.master.ErpSirket = this.loguser.AktifSirket;
      this.master.Tarih=moment(new Date()).format("yyyy-MM-DD");
      this.master.Ekleyen=talepeden; 
      this.master.SehirKod="34"; 
      this.master.TeslimSehirKod="34"; 
      this.master.TeslimSaati = (now.getHours())+":00";
      this.GetSehirListele(this.master.SehirKod,true);
    }
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
   })  
  }

  async TalepListele()  {
    this.blockUI.start(EkranMesaj.Listele);
      (await this.talepsrc.getTalepList(this.talepid,"",new Date(),new Date(),this.Kontrol)).subscribe(
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
        }
      )     
  } 
   
  async kaydet(tumu:boolean){
    if(this.kalemsecimlist.length<=0){
      this.alertify.warning("Malzeme Eklenmeden Kayıt İşlemi Yapılamaz!");
      return;
    }  
     this.blockUI.start("Kayıt Başladı...");
        var sonuc = await this.siparissrc.OzelSiparisOluttur(this.master,this.kalemsecimlist,this.master.Id>0?IslemTipi.Guncelle:IslemTipi.Ekle);
       if(sonuc.Success==true){
          this.alertify.success("Talep Oluşturuldu!") ;
          this.kalemsecimlist=[];

          if(this.master.Id<=0){
            this.master.Id=sonuc.Id;
            this.master.validkey=sonuc.ValidKey;
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
        let td=new OzelSiparisKalem();
        td.Miktar=item.Miktar; 
        td.StokKodu=item.ItemCode;
        td.StokAdi=item.ItemName;
        td.DepoKodu=item.DepoKodu; 
        td.DepoStok=0; 
        td.Aciklama=item.Aciklama;
        td.SatirGuid = this.genelsrv.GuidGenerator();
        td.SapSirketId=this.master.ErpSirket;    
        td.BirimTutar=item.BirimTutar;     
        td.ToplamTutar=item.BirimTutar * item.Miktar;     
        td.BelgeBase64=item.BelgeBase64;     
        td.BelgeAdi=item.BelgeAdi;     
        td.BelgeUzanti=item.BelgeUzanti;   
        td.Birim=item.Birim;   
        td.BirimId=item.BirimId; 
        td.Files=item.Files;  
        td.Base64List=item.Base64List;  
        td.TalepDurumId=item.TalepDurumId;  
        this.kalemsecimlist.push(td);
      }); 
      this.kaydet(false); 
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
    var sonuc = await this.talepsrc.TalepSatirGuncelle(e.data);
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

  TekrarOnayAciklama:string="";
  tekraronayMod(content:any){
    this.TekrarOnayAciklama="";
    this.modalService.open(content, {  size: 'lg',windowClass: 'modalcss40', backdrop: 'static' });  
  }

  tekraronay(){
    if(this.secilikalem==null || this.secilikalem.Id<=0){
      this.alertify.warning("Listeden Seçim Yapınız!") 
      return;
    }
    if(this.TekrarOnayAciklama==null || this.TekrarOnayAciklama==""){
      this.alertify.warning("Açıklama Alanı Zorunludur!") 
      return;
    } 
  
    this.confirmationDialogService.confirm('Tekrar Onay','Seçili Kalem Tekrar Onaya Gönderilecek, Devam Edilsin mi?')
    .then(async (confirmed:any) => 
    {
      if(confirmed.sonuc==true)  {
        this.blockUI.start(EkranMesaj.Kaydet);
        var sonuc = await this.talepsrc.SatinAlmaTalepTekrarOnay(this.secilikalem,this.TekrarOnayAciklama);
        if(sonuc.Success==true){
            this.alertify.success(EkranMesaj.KayitTamamlandi);  
            this.modalService.dismissAll();
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
       if(e.column.dataField === "BirimId") e.cellElement.classList.add("datagiriscolor");
       if(e.column.dataField === "BirimTutar") e.cellElement.classList.add("datagiriscolor");
       if(e.column.dataField === "DepoKodu") e.cellElement.classList.add("datagiriscolor");
       if(e.column.dataField === "Aciklama") e.cellElement.classList.add("datagiriscolor");
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

}
