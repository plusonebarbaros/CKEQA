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
import { GenelApi, EkranMesaj, DashModel, DashRaporModel, DashRaporOzetModel } from './services/GenelSrc';
import { KullaniciModel, KullaniciSrcService, FilterMod } from './services/KullaniciSrc';

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
})


export class AppComponent implements OnInit,AfterViewInit {
  @HostListener("window:onbeforeunload",["$event"])  

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
  Data: DashRaporOzetModel;
  Rapor: DashRaporModel[]=[];
  AylikSatis:SatisGrafikDataModel[]=[];
  AylikIade:SatisGrafikDataModel[]=[];
  GuncelSifre:string="";
  YeniSifre:string="";
  YeniSifreTekrar:string="";
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
      this.Data=new DashRaporOzetModel();
    }  

  ngAfterViewInit(): void {
  }  

  ngOnDestroy(): void { 
    clearInterval(this.interval); 
  } 

  async ekranYenile(){ 
    this.interval =  setInterval(async ()=>{ 
      await this.DataLoad(false);
     },60000 * 15);
   } 

   filter!:FilterMod; 
  async GetDashRapor(ilk:boolean) { 
    if(ilk)  this.blockUI.start(EkranMesaj.Listele);
    (await this.genelsrv.GetDashRapor()).subscribe(
      data =>{
        if(ilk)this.blockUI.stop();  
        if(!data.Success){
          this.alertify.warning(data.Message);
          return;
        } 
        var datares = data.Model as DashModel; 
        if(datares!=null){
          this.Data = datares.Data;

          if(datares.AylikSatis!=null){
            this.AylikSatis.push(new SatisGrafikDataModel("Ocak",datares.AylikSatis.A1_OCAK));
            this.AylikSatis.push(new SatisGrafikDataModel("Şubat",datares.AylikSatis.A2_SUBAT));
            this.AylikSatis.push(new SatisGrafikDataModel("Mart",datares.AylikSatis.A3_MART));
            this.AylikSatis.push(new SatisGrafikDataModel("Nisan",datares.AylikSatis.A4_NISAN));
            this.AylikSatis.push(new SatisGrafikDataModel("Mayıs",datares.AylikSatis.A5_MAYIS));
            this.AylikSatis.push(new SatisGrafikDataModel("Haziran",datares.AylikSatis.A6_HAZIRAN));
            this.AylikSatis.push(new SatisGrafikDataModel("Temmuz",datares.AylikSatis.A7_TEMMUZ));
            this.AylikSatis.push(new SatisGrafikDataModel("Ağustos",datares.AylikSatis.A8_AGUSTOS));
            this.AylikSatis.push(new SatisGrafikDataModel("Eylül",datares.AylikSatis.A9_EYLUL));
            this.AylikSatis.push(new SatisGrafikDataModel("Ekim",datares.AylikSatis.A10_EKIM));
            this.AylikSatis.push(new SatisGrafikDataModel("Kasım",datares.AylikSatis.A11_KASIM));
            this.AylikSatis.push(new SatisGrafikDataModel("Aralık",datares.AylikSatis.A12_ARALIK));
          }

          if(datares.AylikIAde!=null){
            this.AylikIade.push(new SatisGrafikDataModel("Ocak",datares.AylikIAde.A1_OCAK));
            this.AylikIade.push(new SatisGrafikDataModel("Şubat",datares.AylikIAde.A2_SUBAT));
            this.AylikIade.push(new SatisGrafikDataModel("Mart",datares.AylikIAde.A3_MART));
            this.AylikIade.push(new SatisGrafikDataModel("Nisan",datares.AylikIAde.A4_NISAN));
            this.AylikIade.push(new SatisGrafikDataModel("Mayıs",datares.AylikIAde.A5_MAYIS));
            this.AylikIade.push(new SatisGrafikDataModel("Haziran",datares.AylikIAde.A6_HAZIRAN));
            this.AylikIade.push(new SatisGrafikDataModel("Temmuz",datares.AylikIAde.A7_TEMMUZ));
            this.AylikIade.push(new SatisGrafikDataModel("Ağustos",datares.AylikIAde.A8_AGUSTOS));
            this.AylikIade.push(new SatisGrafikDataModel("Eylül",datares.AylikIAde.A9_EYLUL));
            this.AylikIade.push(new SatisGrafikDataModel("Ekim",datares.AylikIAde.A10_EKIM));
            this.AylikIade.push(new SatisGrafikDataModel("Kasım",datares.AylikIAde.A11_KASIM));
            this.AylikIade.push(new SatisGrafikDataModel("Aralık",datares.AylikIAde.A12_ARALIK));
          }

        }
        this.modalService.dismissAll();
     }
   ) 
  } 

  customizeTooltip = (info: any) => ({
    html: `<div><div class='tooltip-header'>${
      info.argumentText}</div>`
                + '<div class=\'tooltip-body\'><div class=\'series-name\'>'
                + `<span class='top-series-name'>${info.points[0].seriesName}</span>`
                + ': </div><div class=\'value-text\'>'
                + `<span class='top-series-value'>${parseInt(info.points[0].valueText)} TL </span>` 
                + '% </div></div></div>',
  });

    customizeLabelText = (info: any) => `${info.valueText}%`; 
 
   delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  Dahili:String="";
  SantralAdi:String=""; 
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
  
      if(this.loguser!=null && this.loguser.Id>0) { 
        this.DataLoad(true);
        this.ekranYenile();
      } 
      window.addEventListener("keyup", this.disableF5); 
      window.addEventListener("keydown", this.disableF5);  
    }
  } 

  satirSec(e:any){} 

  async DataLoad(ilk:boolean) { 
    await this.GetDashRapor(ilk); 
  }

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
  
 
} 

export class SatisGrafikDataModel {
  constructor(_Ay:string,_Tutar:number) {
    this.Ay=_Ay;
    this.Tutar=_Tutar;
  }
  Ay: string;
  Tutar: number=0;
}

export  class MenuExapand { 
  constructor(sira:number,exp:boolean) {
    this.Sira=sira;
    this.Exapnd=exp;
  }
  Sira:number=0;
  Exapnd:boolean=false;
}

export  class User {
  Email: string="";
  Tckn: string="";
  DogulamaKod: string="";
  Password: string=""; 
  AndroidId: string=""; 
  Board: string=""; 
  CihazId: string=""; 
  Device: number = 0; 
  UserKey:string=""; 
  CepTel:string="";

  constructor(_email:string,_pass:string,_andr:string,_board:string,_cihazid:string,_devize:number,_userkey:string) {
   this.Email =_email;
   this.Password=_pass;
   this.Device=_devize;
   this.AndroidId=_andr;
   this.Board=_board;
   this.CihazId=_cihazid;
   this.UserKey=_userkey;
  }
 } 

 export class DatepickerFormatsExample {

  flightSchedule = {
    date: new Date()
  }
}


