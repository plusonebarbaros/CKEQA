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
import { StokGrupModel, GenelApi, EkranMesaj, IslemTipi } from 'src/app/services/GenelSrc';
import { KullaniciYetki, ConDepoYetki, KullaniciModel, KullaniciSrcService } from 'src/app/services/KullaniciSrc';
import { NotifyService } from 'src/app/services/notify';
import { ConnOlcuBirim, SabitservService } from 'src/app/services/SabitSrc';
import { TalepMaster, TalepDetail, Items, Customer, ConnTalepIhtDurum, TalepsrcService, ItemsFile } from 'src/app/services/SatinAlmaSrc';
import { CofirmsrcService } from 'src/app/utils/confirm-dialog/cofirmsrc.service';

@Component({
  selector: 'app-talep-detay',
  templateUrl: './talep-detay.component.html',
  styleUrls: ['./talep-detay.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers:[
    {provide:DatePipe},
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } }
  ]
})
export class TalepDetayComponent implements OnInit {
  @ViewChild('gridTalepDetay', { static: false }) grid!: DxDataGridComponent;
  @BlockUI() blockUI!: NgBlockUI;
  @Input() data:any;  
  yetki:KullaniciYetki; 
  lookupDataSource = {};
  date:any; 
  talepmaster: TalepMaster;
  talepdetay:TalepDetail[]=[]; 
  kalemsecimlist:TalepDetail[]=[]; 
  public userBranch:  any;
  public depolist: ConDepoYetki[]=[]; 
  kalemlist:Items[]=[]; 
  kalemkeyword:string=""; 
  silgoster:boolean=false;
  evrekyuklegoster:boolean=false;
  secilidata:TalepDetail[]=[];
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
  secilikalem:TalepDetail;
  loguser:KullaniciModel;  
  olcubirimlist: ConnOlcuBirim[]=[];  
  talepihtdurumlist: ConnTalepIhtDurum[]=[]; 

  protected _onDestroy = new Subject<void>();

  public formStokGrup: FormControl = new FormControl();
  public filterStokGrup: ReplaySubject<StokGrupModel[]> = new ReplaySubject<StokGrupModel[]>(1);


  constructor(
    public datepipe: DatePipe,
    private genelsrv:GenelApi,
    private alertify:NotifyService,
    private talepsrc:TalepsrcService,
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
    this.talepmaster = new TalepMaster();
   }   

   async TalepDetayGetir() {
    this.blockUI.start(EkranMesaj.Listele);
       (await this.talepsrc.getTalepDetayList(this.talepmaster.Id)).subscribe(
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

     this.yetki = this.data?.yetki; 
     this.Kontrol = this.data?.Kontrol ?? false;  
     let talepeden = this.loguser.AdSoyad;
     this.talepid =this.data._talepid;
     
      this.GetKullaniciDepoYetki();
      this.GetStokGrup();
      this.GetStokOlcuBirim();
      this.GetTalepIhtiyacDurum();

      this.formStokGrup.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {this.filterStokGrupList();});  

    if(this.talepid!=null && this.talepid>0){ 
      this.TalepListele(); 
    }else  { 
      this.talepmaster=new TalepMaster();
      this.talepmaster.AlimYapildi="H";
      this.talepmaster.TalepTuru="T"; 
      this.talepmaster.SapSirketId = this.loguser.AktifSirket;
      this.talepmaster.Tarih=moment(new Date()).format("yyyy-MM-DD");
      this.talepmaster.Ekleyen=talepeden; 
    }
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

  async TalepListele()  {
    this.blockUI.start(EkranMesaj.Listele);
      (await this.talepsrc.getTalepList(this.talepid,"A",new Date(),new Date(),this.Kontrol)).subscribe(
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
          
          this.talepmaster=data.List[0];    
          this.TalepDetayGetir();
        }
      )     
  } 
   
  async kaydet(tumu:boolean){
    if(this.kalemsecimlist.length<=0){
      this.alertify.warning("Malzeme Eklenmeden Kayıt İşlemi Yapılamaz!");
      return;
    } 

    if(this.talepmaster.AlimYapildi=="E" && this.talepmaster.FirmaKodu==""){
      this.alertify.warning("Alım Yapıldı İşlemlerinde Firma Seçimi Zorunludur!");
      return;
    } 
     this.blockUI.start("Kayıt Başladı...");
        var sonuc = await this.talepsrc.SatinAlmaTalepOlustur(this.talepmaster,this.kalemsecimlist,this.talepmaster.Id>0?IslemTipi.Guncelle:IslemTipi.Ekle);
       if(sonuc.Success==true){
          this.alertify.success("Talep Oluşturuldu!") ;
          this.kalemsecimlist=[];

          if(this.talepmaster.Id<=0){
            this.talepmaster.Id=sonuc.Id;
            this.talepmaster.validkey=sonuc.ValidKey;
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
    // if(this.talepmaster.Aciklama==""|| this.talepmaster.Aciklama==undefined){
    //   this.alertify.warning("Talep Nedeni Alanı Zorunludur!");
    //   return;
    // }
    
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
      var sonuc = await this.genelsrv.GetStokList("", 50, this.kalemkeyword?.toLocaleUpperCase('tr')??"",this.talepmaster.TalepTuru,this.StokGrupId);
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
    var sonuc = await this.genelsrv.GetStokList("", 50, this.kalemkeyword?.toLocaleUpperCase('tr')??"",this.talepmaster.TalepTuru,this.StokGrupId);
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
    });     

    if(devam){
      list.forEach(item=> {  
        let td=new TalepDetail();
        td.Miktar=item.Miktar; 
        td.StokKodu=item.ItemCode;
        td.StokAdi=item.ItemName;
        td.DepoKodu=item.DepoKodu; 
        td.DepoStok=0; 
        td.Aciklama=item.Aciklama;
        td.SatirGuid = this.genelsrv.GuidGenerator();
        td.SapSirketId=this.talepmaster.SapSirketId;    
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
  let silinecekler  = this.grid.instance.getSelectedRowsData();
  this.selectedItemKeys = e.selectedRowKeys;
  this.tekraronaygoster=false;

  if (silinecekler!=null && silinecekler.length==1){
    this.silgoster=true;
    this.evrekyuklegoster=true;
    this.secilikalem = silinecekler[0] as TalepDetail;
    this.secilidata = silinecekler; 

    if(this.secilikalem.DurumId===3){
      this.tekraronaygoster=true;
    }
  }
  else if (silinecekler!=null && silinecekler.length>1){
    this.silgoster=true;
    this.evrekyuklegoster=false;
    this.secilikalem =new TalepDetail();
    this.secilidata = silinecekler; 
  }
  else {
    this.silgoster=false;
    this.evrekyuklegoster=false;
    this.secilikalem =new TalepDetail();
    this.secilidata=[];
   }
}
 
firmaSec(content:any){
  this.firmalist=[];
  this.secilifirma=new Customer();     
  this.modalService.open(content, {  size: 'lg',windowClass: 'modalcss55', backdrop: 'static' }); 
} 

firmaSecimYap(){ 
  this.talepmaster.FirmaKodu=this.secilifirma.FirmaKodu;   
  this.talepmaster.FirmaAdi=this.secilifirma.FirmaAdi;    

  document.getElementById("finhspkapat")?.click();  
}

onFirmaChg(e:any){
  let secim = e?.selectedRowsData[0] ?? null;
  if(secim!=null){
    this.secilifirma = secim;
  } 
}

firmaTemizle(){
  this.talepmaster.FirmaKodu="";  
  this.talepmaster.FirmaAdi="";  
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

  onaytakip(content:any,data:TalepDetail){
    if(data.OnayId<=0){
      this.alertify.warning("Onay Bilgisi Okunamadı!");
      return;
    }
    
    this.onayid=data.OnayId;
    this.modalService.open(content, {  size: 'lg',windowClass: 'modalcss45', backdrop: 'static' });   
  }  

  async formYazdir(content:any){
    var devam=true;
    if(this.talepmaster==null || this.talepmaster.Id<=0){
      this.alertify.warning("Seçim Yapılmadı!");
      devam=false;
      return;
    }  

    if (devam){
      this.blockUI.start(EkranMesaj.Listele); 
      var sonuc = await this.talepsrc.TalepFormYazdir(this.talepmaster,2);
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
        var sonuc = await this.talepsrc.SatinAlmaTalepOlustur(this.talepmaster,this.secilidata,IslemTipi.KalemSil);
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

  tarihceDetay(content:any,data:TalepDetail){
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

}
