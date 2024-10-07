// import { toBase64String } from '@angular/compiler/src/output/source_map';
import { AfterViewInit, Component, ElementRef, HostListener, Input, LOCALE_ID, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { TabService } from './services/tab.service';
import { Tab } from './services/tabs-mod';
import { ViewEncapsulation} from '@angular/core';  
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms'
import { isEmpty, map } from 'rxjs/operators';
import { AlertifyService } from './services/alert';
import { HttpClient } from '@angular/common/http';
import { Inject } from '@angular/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter'; 
import { FormControl } from '@angular/forms'; 
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import config from 'devextreme/core/config';
import * as trMessage from  "devextreme/localization/messages/tr.json";
import { locale, loadMessages } from "devextreme/localization";  
import $ from 'jquery';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NotifyService } from './services/notify';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { Title } from '@angular/platform-browser';
import { CofirmsrcService } from './utils/confirm-dialog/cofirmsrc.service';
import moment from 'moment';
import { LoadingComponent } from './loading/loading.component';
import { GenelApi, EkranMesaj, MenuExapand, IlceModel, SehirModel, UlkeModel } from './services/GenelSrc';
import { KullaniciModel, KullaniciSrcService, FilterMod, KullaniciYetki, KulSirketYetki, User } from './services/KullaniciSrc';
import { StokAramaComponent } from './views/Stok/stok-arama/stok-arama.component';
import { SiparisAktarmaComponent } from './views/Siparis/siparis-aktarma/siparis-aktarma.component';
import { KullaniciComponent } from './views/Yonetim/kullanici/kullanici.component';
import { GrupYetkiComponent } from './views/Yonetim/grup-yetki/grup-yetki.component';
import { KullaniciPozisyonComponent } from './views/Yonetim/kullanici-pozisyon/kullanici-pozisyon.component';
import { KullaniciDepartmanComponent } from './views/Yonetim/kullanici-departman/kullanici-departman.component';
import { IrsaliyeAktarmaComponent } from './views/Siparis/irsaliye-aktarma/irsaliye-aktarma.component';
import { OzelSiparisComponent } from './views/Siparis/ozel-siparis/ozel-siparis.component';
import { OnayKategoriDetayComponent } from './views/Onay/onay-kategori-detay/onay-kategori-detay.component';
import { OnayKategoriComponent } from './views/Onay/onay-kategori/onay-kategori.component';
import { OnayKuralComponent } from './views/Onay/onay-kural/onay-kural.component';
import { OnayTanimComponent } from './views/Onay/onay-tanim/onay-tanim.component';
import { TalepComponent } from './views/SatinAlma/talep/talep.component';
import { TransferComponent } from './views/SatinAlma/transfer/transfer.component';
import { BekleyenOnayComponent } from './views/Onay/bekleyen-onay/bekleyen-onay.component';
import { OnayGecmisComponent } from './views/Onay/onay-gecmis/onay-gecmis.component';
import { FireYonetimComponent } from './views/Stok/fire-yonetim/fire-yonetim.component';
import { FireTipTanimComponent } from './views/Yonetim/fire-tip-tanim/fire-tip-tanim.component';
import { SayimYonetimComponent } from './views/Stok/sayim-yonetim/sayim-yonetim.component';
import { TalepKontrolListesiComponent } from './views/SatinAlma/talep-kontrol-listesi/talep-kontrol-listesi.component';
import { SiparisTeslimAlComponent } from './views/SatinAlma/siparis-teslim-al/siparis-teslim-al.component';
import { DepoTransferOnayComponent } from './views/SatinAlma/depo-transfer-onay/depo-transfer-onay.component';
import { SistemParametreComponent } from './views/Yonetim/sistem-parametre/sistem-parametre.component';
import { SozlesmeListesiComponent } from './views/Test/sozlesme-listesi/sozlesme-listesi.component';
import { FireTipMuhasebeTanimComponent } from './views/Yonetim/fire-tip-muhasebe-tanim/fire-tip-muhasebe-tanim.component';
import { KaliteIsemriComponent } from './views/Kalite/kalite-isemri/kalite-isemri.component';
import { KaliteGirisStokComponent } from './views/Kalite/kalite-giris/kalite-giris-stok/kalite-giris-stok.component';

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD-MM-yyyy',
  },
  display: {
    dateInput: 'DD-MM-yyyy',
    monthYearLabel: 'DD-MM-yyyy', 
    monthYearA11yLabel: 'DD-MM-yyyy',
  },
};
 
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers:[
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS}  
  ], 
  host: {
    '(document:click)': 'onClick($event)',
  }, 
})


export class AppComponent implements OnInit,AfterViewInit {
  @HostListener("window:onbeforeunload",["$event"])  

  @HostListener('mouseenter', ['$event']) onEnter( e: MouseEvent ) {
    this.IdleRefresh(e);
  }

  @HostListener('mouseleave', ['$event']) onLeave ( e: MouseEvent ) {
    this.IdleRefresh(e);
  } 

  @HostListener('mouseover')
  mouseover() {
    this.IdleRefresh(1);
  }

  @HostListener('mouseout')
  mouseout() {
    this.IdleRefresh(1);
  } 

  clearsessionStorage(event:any){
      sessionStorage.clear();
  }

  @BlockUI() blockUI!: NgBlockUI;
  user: User = new User("","","","","",0,"");
  @ViewChild('bildirimmodal') bildirimModSrc: any;
  @ViewChild('kilitmod') kilitmodSrc: any;
  @ViewChild('loginpagemod') loginpagemod: any;

  public userLogin: boolean = false;
  tarih=new Date(); 
  secilimenu:string=""; 
  activeLink:number=0;
  kulltoken:string="";    
  interval: any;  
  allMode: string="";
  checkBoxesMode: string="";
  loguser:KullaniciModel; 
  isWaiting: boolean = false; 
  dogrulandi:boolean = false; 
  Reuser: User = new User("","","","","",0,"");
  GuncelSifre:string="";
  YeniSifre:string="";
  YeniSifreTekrar:string="";
  perm:KullaniciYetki[]=[]; 
  menuEx:MenuExapand[]=[];
  secilisube:KulSirketYetki;
  mainsirket:string="";
  kilitAktif:boolean=false;
  kilitsure:number = 0;

  public tabs : Array<Tab> = [];
  public selectedTab: number=1; 
  public sessionStorage = sessionStorage;
 
  constructor(
    @Inject('semUrl') private semUrl:string,
    private http:HttpClient,
    private tabService: TabService,
    private alertify:NotifyService , 
    private _eref: ElementRef,
    private kullsrc:KullaniciSrcService,
    private modalService: NgbModal,
    private confirm: CofirmsrcService,
    private genelsrv:GenelApi, 
    private titleService:Title,
    ) { 
      config({ defaultCurrency: 'TRY' });
      loadMessages(trMessage);
      locale(navigator.language);
      this.allMode = 'allPages';
      this.checkBoxesMode = 'always';  
      this.loguser=new KullaniciModel();
      this.secilisube=new KulSirketYetki();

      for(var i = 1; i <= 50; i++){
        this.menuEx.push({Sira:i,Exapnd:false});
      } 
    }  

  ngAfterViewInit(): void {
  }  

  ngOnDestroy(): void { 
    clearInterval(this.interval); 
  } 

  async IdleRefresh(e:any){  
    if(!this.userLogin){
      return;
    }
    if(this.kilitAktif){
      return;
    } 
    this.kilitsure=0;
   }

  tabChanged(event:any) {    
    sessionStorage.setItem("AktifTab",event+"");
    $(window).resize(); 
  }  

  addNewTab(tabid:number=0) {    
    this.activeLink=tabid;

    if(tabid>0){
    let tabacikmi = this.tabService.tabs.filter((item)=> item.tabid==tabid)[0];
      if(tabacikmi!=null && tabacikmi.tabid>0){
        this.tabService.selectTab(tabacikmi);
        return;
      }
    } 
    if(tabid==1)this.tabService.addTab(new Tab(StokAramaComponent, "Stok Arama", { parent: "AppComponent",yetki:this.perm?.filter(p=>p.YetkiKodu=="YT0001")[0]},tabid));
    else if(tabid==3)this.tabService.addTab(new Tab(KullaniciComponent, "Kullanıcı Listesi", { parent: "AppComponent",yetki:this.perm?.filter(p=>p.YetkiKodu=="YT0007")[0]},tabid));
    else if(tabid==4)this.tabService.addTab(new Tab(GrupYetkiComponent, "Grup Yetki Tanımları", { parent: "AppComponent",yetki:this.perm?.filter(p=>p.YetkiKodu=="YT0008")[0]},tabid));
    else if(tabid==5)this.tabService.addTab(new Tab(KullaniciDepartmanComponent, "Departman Tanım", { parent: "AppComponent",yetki:this.perm?.filter(p=>p.YetkiKodu=="YT0010")[0]},tabid));
    else if(tabid==6)this.tabService.addTab(new Tab(KullaniciPozisyonComponent, "Pozisyon Tanım", { parent: "AppComponent",yetki:this.perm?.filter(p=>p.YetkiKodu=="YT0011")[0]},tabid));
    else if(tabid==7)this.tabService.addTab(new Tab(OzelSiparisComponent, "Özel Sipariş", { parent: "AppComponent",yetki:this.perm?.filter(p=>p.YetkiKodu=="YT0012")[0]},tabid));
    else if(tabid==8)this.tabService.addTab(new Tab(OnayKategoriComponent, "Onay Kategori Tanım", { parent: "AppComponent",yetki:this.perm?.filter(p=>p.YetkiKodu=="YT0014")[0]},tabid));
    else if(tabid==9)this.tabService.addTab(new Tab(OnayKategoriDetayComponent, "Onay Kategori Detay Tanım", { parent: "AppComponent",yetki:this.perm?.filter(p=>p.YetkiKodu=="YT0015")[0]},tabid));
    else if(tabid==10)this.tabService.addTab(new Tab(OnayKuralComponent, "Onay Kural Tanım", { parent: "AppComponent",yetki:this.perm?.filter(p=>p.YetkiKodu=="YT0016")[0]},tabid));
    else if(tabid==11)this.tabService.addTab(new Tab(OnayTanimComponent, "Onay Süreç Tanım", { parent: "AppComponent",yetki:this.perm?.filter(p=>p.YetkiKodu=="YT0017")[0]},tabid));
    else if(tabid==12)this.tabService.addTab(new Tab(TalepComponent, "Satın Alma Talep", { parent: "AppComponent",yetki:this.perm?.filter(p=>p.YetkiKodu=="YT0018")[0]},tabid));
    else if(tabid==13)this.tabService.addTab(new Tab(TransferComponent, "Mağazalar Arası Transfer", { parent: "AppComponent",yetki:this.perm?.filter(p=>p.YetkiKodu=="YT0019")[0]},tabid));
    else if(tabid==14)this.tabService.addTab(new Tab(BekleyenOnayComponent, "Bekleyen Onaylar", { parent: "AppComponent",yetki:this.perm?.filter(p=>p.YetkiKodu=="YT0020")[0]},tabid));
    else if(tabid==15)this.tabService.addTab(new Tab(OnayGecmisComponent, "Onay Geçmiş", { parent: "AppComponent",yetki:this.perm?.filter(p=>p.YetkiKodu=="YT0021")[0]},tabid));
    else if(tabid==16)this.tabService.addTab(new Tab(FireYonetimComponent, "Fire Yönetimi", { parent: "AppComponent",yetki:this.perm?.filter(p=>p.YetkiKodu=="YT0026")[0]},tabid));
    else if(tabid==17)this.tabService.addTab(new Tab(FireTipTanimComponent, "Fire Tip Tanım", { parent: "AppComponent",yetki:this.perm?.filter(p=>p.YetkiKodu=="YT0027")[0]},tabid));
    else if(tabid==18)this.tabService.addTab(new Tab(SayimYonetimComponent, "Sayım Yönetimi", { parent: "AppComponent",yetki:this.perm?.filter(p=>p.YetkiKodu=="YT0028")[0]},tabid));
    else if(tabid==19)this.tabService.addTab(new Tab(TalepKontrolListesiComponent, "Talep Kontrol Listesi", { parent: "AppComponent",yetki:this.perm?.filter(p=>p.YetkiKodu=="YT0030")[0]},tabid));
    else if(tabid==20)this.tabService.addTab(new Tab(SiparisTeslimAlComponent, "Sipariş Teslim Listesi", { parent: "AppComponent",yetki:this.perm?.filter(p=>p.YetkiKodu=="YT0031")[0]},tabid));
    else if(tabid==21)this.tabService.addTab(new Tab(DepoTransferOnayComponent, "Depo Transfer Onay", { parent: "AppComponent",yetki:this.perm?.filter(p=>p.YetkiKodu=="YT0034")[0]},tabid));
    else if(tabid==22)this.tabService.addTab(new Tab(SistemParametreComponent, "Sistem Parametreleri", { parent: "AppComponent",yetki:this.perm?.filter(p=>p.YetkiKodu=="YT0009")[0]},tabid));
    else if(tabid==23)this.tabService.addTab(new Tab(SozlesmeListesiComponent, "Sözleşme Listesi", { parent: "AppComponent",yetki:this.perm?.filter(p=>p.YetkiKodu=="YT0035")[0]},tabid));
    else if(tabid==24)this.tabService.addTab(new Tab(FireTipMuhasebeTanimComponent, "Fire Tip Muhasebe Tanım", { parent: "AppComponent",yetki:this.perm?.filter(p=>p.YetkiKodu=="YT0037")[0]},tabid));
    else if(tabid==25)this.tabService.addTab(new Tab(KaliteGirisStokComponent, "Kalite Stok Girisleri", { parent: "AppComponent",yetki:this.perm?.filter(p=>p.YetkiKodu=="YT0042")[0]},tabid));
    else if(tabid==26)this.tabService.addTab(new Tab(KaliteGirisStokComponent, "Ölçü birimleri", { parent: "AppComponent",yetki:this.perm?.filter(p=>p.YetkiKodu=="YT0043")[0]},tabid));
    else if(tabid==27)this.tabService.addTab(new Tab(KaliteGirisStokComponent, "Araç - Ekipman Tanımları", { parent: "AppComponent",yetki:this.perm?.filter(p=>p.YetkiKodu=="YT0044")[0]},tabid));
    else if(tabid==28)this.tabService.addTab(new Tab(KaliteGirisStokComponent, "Test Grupları", { parent: "AppComponent",yetki:this.perm?.filter(p=>p.YetkiKodu=="YT0045")[0]},tabid));
    else if(tabid==29)this.tabService.addTab(new Tab(KaliteGirisStokComponent, "Test Tanımları", { parent: "AppComponent",yetki:this.perm?.filter(p=>p.YetkiKodu=="YT0046")[0]},tabid));
    else if(tabid==30)this.tabService.addTab(new Tab(KaliteGirisStokComponent, "Araç - Test Eşleştirme", { parent: "AppComponent",yetki:this.perm?.filter(p=>p.YetkiKodu=="YT0047")[0]},tabid));
    else if(tabid==31)this.tabService.addTab(new Tab(KaliteGirisStokComponent, "Örneklem Tanımları", { parent: "AppComponent",yetki:this.perm?.filter(p=>p.YetkiKodu=="YT0048")[0]},tabid));
    else if(tabid==32)this.tabService.addTab(new Tab(KaliteGirisStokComponent, "Liste Tanımları", { parent: "AppComponent",yetki:this.perm?.filter(p=>p.YetkiKodu=="YT0049")[0]},tabid));
    else if(tabid==33)this.tabService.addTab(new Tab(KaliteIsemriComponent, "Kalite İşEmirleri", { parent: "AppComponent",yetki:this.perm?.filter(p=>p.YetkiKodu=="YT0050")[0]},tabid));
    else if(tabid==34)this.tabService.addTab(new Tab(KaliteIsemriComponent, "Kalite SatınAlma", { parent: "AppComponent",yetki:this.perm?.filter(p=>p.YetkiKodu=="YT0051")[0]},tabid));

    sessionStorage.setItem("AktifTab",tabid+"");
  }

  removeTab(index: number): void {
    this.tabService.removeTab(index);
  }  

  mainMenuShow(mm:string){
    if(this.perm.filter(item => item.Goruntule==true && item.Modul==mm).length>0){ 
      return true;
    }
    else return false;
  }

  submainMenuShow(mm:string){ 
    if(this.perm.filter(item => item.Goruntule==true && item.Bolum==mm).length>0){
      return true;
    }
    else return false;
  }

  childMenuShow(mm:string){
    if(this.perm.filter(item => item.Goruntule==true && item.YetkiKodu==mm).length>0){
      return true;
    }
    else return false;
  } 

   filter!:FilterMod; 

  async ngOnInit() {  
    this.kulltoken = sessionStorage?.getItem("Token")??"";
    if(this.kulltoken=="" || this.kulltoken==null){ 
      this.userLogin=false;
    }
    else {
      this.userLogin=true;  
      let date=new Date;  
      this.filter = new FilterMod(date,date); 
      this.loguser = JSON.parse(sessionStorage.getItem('data')??"") as KullaniciModel;

      if(this.loguser.Id>0) {
        this.DataLoad();
      }  

      this.tabService.tabSub.subscribe(tabs => {
        this.tabs = tabs;
        this.selectedTab = tabs.findIndex(tab => tab.active);
      });
  
      window.addEventListener("keyup", this.disableF5); 
      window.addEventListener("keydown", this.disableF5);  
    }
  }

  async DataLoad() {
    await this.GetKullaniciYetki(this.loguser.Id);
    await this.GetSehirler();
    await this.GetUlkeList();
    await this.GetIlceList(); 

    this.kullsrc.kullToken = this.kulltoken;
    this.kullsrc.kullUserId = this.loguser.Id;

    sessionStorage.setItem("AktifTab","0");
  }

  async GetKullaniciYetki(id:number) {
    this.blockUI.start("Yetki Okunuyor...");
    (await this.kullsrc.GetKullaniciYetki(id,0,"","H")).subscribe((data)=>{   
      this.blockUI.stop(); 
      if(!data.Success){
        this.alertify.warning(data.Message);
        return;
      }
      this.kullsrc.userperm=data.List;   
      this.perm =data.List; 
      sessionStorage.setItem("AktifTab","0");
  })  
  }

  async GetSehirler() {
    this.kullsrc.sehirlist=[];
    this.blockUI.start(EkranMesaj.Listele);
    (await this.genelsrv.GetSehirList("")).subscribe(
      data =>{
        this.blockUI.stop();  
        if(!data.Success){
          this.alertify.warning(data.Message);
          return;
        }
        let sehir =data.List;           

        const ilsec = new SehirModel();
        ilsec.Code= "00";
        ilsec.Name ="Seçiniz";
           
        this.kullsrc.sehirlist.push(ilsec); 
        sehir.forEach((item: SehirModel)=>{
          this.kullsrc.sehirlist.push(item);
        })   
     }
   ) 
  }

  async GetUlkeList() {
    this.kullsrc.ulkelist=[];

    this.blockUI.start(EkranMesaj.Listele);
    (await this.genelsrv.GetUlkeList("")).subscribe(
      data =>{
        this.blockUI.stop();  
        if(!data.Success){
          this.alertify.warning(data.Message);
          return;
        }
        let ulke =data.List;   

        const ilsec = new UlkeModel();
        ilsec.Code= "00";
        ilsec.Name ="Seçiniz";
           
        this.kullsrc.ulkelist.push(ilsec); 
        ulke.forEach((item: UlkeModel)=>{
          this.kullsrc.ulkelist.push(item);
        })   
     }
   ) 
  }

  async GetIlceList() {
    this.blockUI.start(EkranMesaj.Listele);
    (await this.genelsrv.GetIlceList("")).subscribe(
      data =>{
        this.blockUI.stop(); 
        if(!data.Success){
          this.alertify.warning(data.Message);
          return;
        }
        let ilce =data.List; 
        this.kullsrc.ilcelist=[];

        const ilcesec = new IlceModel();
        ilcesec.Id= 0;
        ilcesec.IlId ="0";
        ilcesec.IlceAdi ="Seçiniz";
           
        this.kullsrc.ilcelist.push(ilcesec); 
        ilce.forEach((item: IlceModel)=>{
          this.kullsrc.ilcelist.push(item);
        })    
     }
   ) 
  } 

  satirSec(e:any){} 

   disableF5(e:any) { 
    if ((e.which || e.keyCode) == 116) e.preventDefault();   
    }

  cikisyap(){
    this.blockUI.start("Çıkış Yapılıyor...");
  
    setTimeout(() =>{
      sessionStorage.clear();
      window.location.reload();
      this.blockUI.stop(); 
    },1000); 
  }  

  menugoster(menu:string){   
    if(menu==this.secilimenu)this.secilimenu="";
    else this.secilimenu=menu;
  }
  
  onClick(event:any) { 
    if (event.clientX>350) // or some similar check
    this.secilimenu="";
    this.kilitsure=0;
  }
    
  getCSSClasses(link:number) {
    let cssClasses;
    if(this.activeLink==link) {  
       cssClasses = {
         'mainrightsem': true,
         'menuaktif': true,
         'baslikmenu': true,
       }	
    } else {  
       cssClasses = {
        'mainrightsem': true,
        'menuaktif': false,
        'baslikmenu': true,
       }	
    }
    return cssClasses;
  }	

  getCSSClassesSub(link:number) {
    let cssClasses;
    if(this.activeLink==link) {  
       cssClasses = {
         'mainrightsem': true,
         'submenuaktif': true, 
         'baslikmenu': true,
       }	
    } else {  
       cssClasses = {
        'mainrightsem': true,
        'submenuaktif': false, 
        'baslikmenu': false,
       }	
    }
    return cssClasses;
  }	 
   
GetQCode(){
  if(this.Reuser.Tckn==null || this.Reuser.Tckn==""){
    this.alertify.warning("Tckn Bilgisi Zorunludur!");
  }
  else if(this.Reuser.Tckn.length!=11){ 
    this.alertify.warning("Tckn Bilgisi Eksik Girildi!");
  }
  else { 
    this.isWaiting=true;
    this.http.post<any>(this.semUrl+"/Login/LoginUserV1", this.Reuser)
    .subscribe(async res => {
      this.isWaiting=false;

      if(res.Success==false){
        this.alertify.warning(res.Message);
      }
      else{ 
      this.dogrulandi=true;  
      }
     }, error =>{
      this.userLogin=false
      this.alertify.warning(error);
    });  
  }
}

DtsLogin(){
  if(!this.dogrulandi){
    this.alertify.warning("Sms Doğrulaması Yapılmadan İşleme Devam Edilemez!");
    return;
  }
  else if(this.Reuser.Tckn==null || this.Reuser.Tckn==""){
    this.alertify.warning("Tckn Bilgisi Zorunludur!");
    return;
  }
  else if(this.Reuser.Tckn.length!=11){ 
    this.alertify.warning("Tckn Bilgisi Eksik Girildi!");
    return;
  } 
  else if(this.Reuser.DogulamaKod==null || this.Reuser.DogulamaKod==""){
    this.alertify.warning("Doğrulama Kodu Giriniz!");
    return;
  }
  else if(this.Reuser.DogulamaKod.length!=6){ 
    this.alertify.warning("Doğrulama Kodu Eksik Girildi!");
    return;
  } 
  else {
    this.isWaiting=true;
    this.http.post<any>(this.semUrl+"/Login/LoginUserV2", this.Reuser)
    .subscribe(async res => {
      this.isWaiting=false;

      if(res.Success==false){
        this.alertify.warning(res.Message);
      }
      else{  
        this.userLogin=true; 
        sessionStorage.setItem("Token",res.Token);
        sessionStorage.setItem("EmpId",res.Model.empID); 
        sessionStorage.setItem("Ad",res.Model.KullanilanAd); 
        sessionStorage.setItem("Email",res.Model.email);
        sessionStorage.setItem("DefaultSirket",res.Model.DefaultSirket);
        sessionStorage.setItem("SorumluBirim",res.Model.SorumluBirim); 
        sessionStorage.setItem("SirketBirim",res.Model.SirketBirim);
        sessionStorage.setItem("AktifTab","0");
        sessionStorage.setItem("WebTitle",res.Model.WebTitle);
        sessionStorage.setItem("Logo",res.Model.Logo);
        sessionStorage.setItem("BackLogo",res.Model.BackLogo);
        sessionStorage.setItem("DarkMod",res.Model.DarkMod);

        this.kullsrc.token = res.Token;
        this.isWaiting=false;
        this.dogrulandi=false;   

        //takip bilgisi kapatılıyor
        document.getElementById("ReLoginId")?.click();

        window.location.reload();
      }
     }, error =>{
      this.userLogin=false
      this.alertify.warning(error);
    });  
  }
}

reLog(){
  this.userLogin=false;
  this.dogrulandi=false;
  this.Reuser=new User("","","","","",0,"");
}

BasTarihChg(e:any){
  this.filter.Baslangic=moment(e._d).format("yyyy-MM-DD"); 
}

BitTarihChg(e:any){
  this.filter.Bitis=moment(e._d).format("yyyy-MM-DD"); 
} 

filterMod(content:any){
  this.modalService.open(content, {  size: 'lg',windowClass: 'modalcss30', backdrop: 'static' }); 
}

sifreDegistirModal(content:any){
  this.GuncelSifre="";
  this.YeniSifre="";
  this.YeniSifreTekrar="";
  this.modalService.open(content, {  size: 'lg',windowClass: 'modalcss40', backdrop: 'static' });
}

sifreDegistir(){
  if(this.GuncelSifre=="" || this.GuncelSifre==undefined){
    this.alertify.warning("Güncel Şifre Bilgisi Zorunludur...");
    return;
  }
  if(this.YeniSifre=="" || this.YeniSifre==undefined){
    this.alertify.warning("Yeni Şifre Bilgisi Zorunludur...");
    return;
  }
  if(this.YeniSifreTekrar=="" || this.YeniSifreTekrar==undefined){
    this.alertify.warning("Yeni Şifre Tekrar Bilgisi Zorunludur...");
    return;
  }
  if(this.YeniSifre.length < 6){
    this.alertify.warning("Şifreniz En Az 6 Hane Olmalıdır, Harf ve Rakam Kullanınız...");
    return;
  }

  if(this.YeniSifre!=this.YeniSifreTekrar){
    this.alertify.warning("Yeni Şifre ve Yeni Şifre Tekrar Eşleşmiyor, Kontrol Ediniz...");
    return;
  }

  if(this.YeniSifre==this.GuncelSifre){
    this.alertify.warning("Yeni Şifre Güncel Şifrenizle Aynı Olamaz, Kontrol Ediniz...");
    return;
  }

  this.confirm.confirm('Şifre Güncelle',"B2B Şifreniz Güncellenecek, Devam Edilsin mi?")
  .then(async (confirmed:any) => 
  {
    if(confirmed.sonuc==true){   
      
      
      this.blockUI.start(EkranMesaj.Kaydet);
      var sonuc = await this.kullsrc.KullaniciSifreGuncelle(btoa(this.GuncelSifre),btoa(this.YeniSifre),btoa(this.YeniSifreTekrar));
      if(sonuc.Success){
        this.alertify.success("Şifreniz Başarıyla Güncellendi"); 
        this.modalService.dismissAll();
      } 
      else this.alertify.warning(sonuc.Message);
      this.blockUI.stop();  
      }
      else this.modalService.dismissAll();
    })
    .catch(() => { 
    });  
}

sirketyetkilist:KulSirketYetki[]=[];
  async subeDegistirMod(content:any){    
    this.blockUI.start("Şirket Yetkisi Okunuyor...");
    (await this.kullsrc.GetSirketYetki()).subscribe((data)=>{   
      this.blockUI.stop(); 
      if(data.Success){
        this.sirketyetkilist = data.List;
        this.modalService.open(content, {  size: 'lg',windowClass: 'modalcss40', backdrop: 'static' }); 
      }
      else{
        this.alertify.warning(data.Message);
      }  
    })  
  }

  async subeDegistir(){
    if(this.secilisube!=null && this.secilisube.dbName!=""){
      this.mainsirket = this.secilisube.dbName; 

      this.confirm.confirm('Şirket Değiştir',"Seçili Şirkete Geçiş Yapılacak, Devam Edilsin mi?")
      .then(async (confirmed:any) => 
      {
        if(confirmed.sonuc==true){ 
          var proc = await this.kullsrc.KullaniciGirisBilgiGuncelle(this.secilisube.dbName);
          if(proc.Success==true){  
            sessionStorage.setItem("AktifSirket",this.secilisube.dbName);  
            this.modalService.dismissAll();

            this.loguser.AktifSirket=this.secilisube.dbName;
            sessionStorage.setItem("data",JSON.stringify(this.loguser));
            location.reload();
           }
          else{
            this.alertify.warning(proc.Message);
          }
        }        
      })
      .catch(() => { 
      }); 
    }
  }

  subeDegistirChg(e:any){
    let secim = e?.selectedRowsData[0] ?? null;
    if(secim!=null){
      this.secilisube = secim;
    } 
  }
  
 
}  


