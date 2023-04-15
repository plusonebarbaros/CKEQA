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
import { AcenteModel, EkranMesaj, GenelApi, IlceModel, KullaniciBildirimDetayModel, KullaniciBildirimModel, SehirModel, SorumluBirim, UlkeModel } from './services/Genel/genelsrv';
import { KullaniciYetki, SirketYetki, NtxSantralKuyrukModel, KullaniciModel, KullaniciSrcService, MolaTipModel, FilterMod } from './services/kullanici/kullanici-src.service';
import { SabitservService } from './services/sabitsrc/sabitserv.service';
import { AnketYonetimService, AnlikDataModel } from './services/anket/anket-yonetim.service';


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

  adsoyad = '';
  public userLogin: boolean = false;
  tarih=new Date(); 
  secilimenu:string=""; 
  activeLink:number=0;
  kulluserid:number=0;
  kulltoken:string="";    
  interval: any;  
  allMode: string="";
  checkBoxesMode: string="";
  secilenuser:KullaniciModel;

  isWaiting: boolean = false; 
  dogrulandi:boolean = false; 
  Reuser: User = new User("","","","","",0,"");
  public sessionStorage = sessionStorage;
 

  constructor(
    @Inject('semUrl') private semUrl:string,
    private http:HttpClient,
    private tabService: TabService,
    private alertify:NotifyService , 
    private _eref: ElementRef,
    private kullsrc:KullaniciSrcService,
    private modalService: NgbModal,
    private confirmationDialogService: CofirmsrcService,
    private genelsrv:GenelApi, 
    private titleService:Title,
    private sabitsrc:SabitservService, 
    private anketsrc:AnketYonetimService, 
    ) { 
      config({ defaultCurrency: 'TRY' });
      loadMessages(trMessage);
      locale(navigator.language);
      this.allMode = 'allPages';
      this.checkBoxesMode = 'always';  
      this.secilenuser=new KullaniciModel();
    }  

  ngAfterViewInit(): void {
  }  

  ngOnDestroy(): void { 
    clearInterval(this.interval); 
  } 

  async ekranYenile(){ 
    this.interval =  setInterval(async ()=>{ 
      await this.DataLoad();
     },60000 * 1);
   } 

  filter!:FilterMod; 
  anlikdata:AnlikDataModel[]=[]; 
  async GetAnlikData() { 
    this.anlikdata=[];

    this.blockUI.start(EkranMesaj.Listele);
    (await this.anketsrc.GetAnlikData(this.filter.Baslangic,this.filter.Bitis)).subscribe(
      data =>{
        this.blockUI.stop();  
        if(!data.Success){
          this.alertify.warning(data.Message);
          return;
        } 
        this.anlikdata=data.List as AnlikDataModel[]; 
        this.modalService.dismissAll();
     }
   ) 
  }

  anlikdatakonaklama:AnlikDataModel[]=[]; 
  async GetAnlikDataKonaklama() { 
    this.anlikdatakonaklama=[];

    this.blockUI.start(EkranMesaj.Listele);
    (await this.anketsrc.GetAnlikDataKonaklama(this.filter.Baslangic,this.filter.Bitis)).subscribe(
      data =>{
        this.blockUI.stop();  
        if(!data.Success){
          this.alertify.warning(data.Message);
          return;
        } 
        this.anlikdatakonaklama=data.List as AnlikDataModel[];  
        this.modalService.dismissAll();
     }
   ) 
  }
 
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
    else this.userLogin=true; 

    let date=new Date;  
    this.filter = new FilterMod(date,date); 

    this.kullsrc.SistemKilitSure = parseInt(sessionStorage.getItem("SistemKilitSure")??"0");  
    this.adsoyad = (sessionStorage.getItem("Ad")?.toString()) ??"";
 
    this.kulluserid =  parseInt(sessionStorage.getItem("EmpId")+"");
    this.kulltoken = sessionStorage.getItem("Token")+"";

    if(this.kulluserid>0) { 
      this.DataLoad();
      this.ekranYenile();
    }

 
    window.addEventListener("keyup", this.disableF5); 
    window.addEventListener("keydown", this.disableF5);   
   }
 
   

  satirSec(e:any){ 
   
 } 

  async DataLoad() { 
      await this.GetAnlikData();
      await this.GetAnlikDataKonaklama();
 
      this.kullsrc.kullToken = this.kulltoken;
      this.kullsrc.kullUserId = this.kulluserid;
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

        this.adsoyad = res.Model.KullanilanAd;
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


//p1 0=line 1=inhouse 2=tapu
GetData(p1:any,p2:any){
  if(this.anlikdata==null || this.anlikdata.length<=0){
    return 0;
  }

  if(p1!=4 && this.anlikdata.filter((x)=>x.Parametre==p1).length<=0){
    return 0;
  }

 if(p2=="UPSAYI") return this.anlikdata.filter((x)=>x.Parametre==p1).reduce((acc, val) => acc += val.Up, 0);
 else if(p2=="DEALSAYI") return this.anlikdata.filter((x)=>x.Parametre==p1).reduce((acc, val) => acc += val.Satis, 0);
 else if(p2=="TOPVOLUME") return this.anlikdata.filter((x)=>x.Parametre==p1).reduce((acc, val) => acc += val.Volume, 0);
 else if(p2=="TOPNAKIT") return this.anlikdata.filter((x)=>x.Parametre==p1).reduce((acc, val) => acc += val.Nakit, 0);
 else if(p2=="TOPCC") return this.anlikdata.filter((x)=>x.Parametre==p1).reduce((acc, val) => acc += val.KrediKarti, 0);
 else if(p2=="TOPBANKA") return this.anlikdata.filter((x)=>x.Parametre==p1).reduce((acc, val) => acc += val.Banka, 0);
 else if(p2=="TOPPESINAT") return this.anlikdata.filter((x)=>x.Parametre==p1).reduce((acc, val) => acc += val.Toplam, 0);

 else if(p2=="UPBASIVOL") return this.anlikdata.filter((x)=>x.Parametre==p1).reduce((acc, val) => acc += val.Volume, 0) / this.anlikdata.filter((x)=>x.Parametre==p1).reduce((acc, val) => acc += val.Up, 0);
 else if(p2=="UPBASIMONEYIN") return this.anlikdata.filter((x)=>x.Parametre==p1).reduce((acc, val) => acc += val.Toplam, 0) / this.anlikdata.filter((x)=>x.Parametre==p1).reduce((acc, val) => acc += val.Up, 0);
 else if(p2=="DEALBASIVOL") return this.anlikdata.filter((x)=>x.Parametre==p1).reduce((acc, val) => acc += val.Volume, 0) / this.anlikdata.filter((x)=>x.Parametre==p1).reduce((acc, val) => acc += val.Satis, 0);
 else if(p2=="DEALBASIMONEYIN") return this.anlikdata.filter((x)=>x.Parametre==p1).reduce((acc, val) => acc += val.Toplam, 0) / this.anlikdata.filter((x)=>x.Parametre==p1).reduce((acc, val) => acc += val.Satis, 0);

 else if(p2=="DEALKAPAMA") return this.anlikdata.filter((x)=>x.Parametre==p1).reduce((acc, val) => acc += val.Satis, 0) / this.anlikdata.filter((x)=>x.Parametre==p1).reduce((acc, val) => acc += val.Up, 0);
 else if(p2=="VOLMONKAPAMA") return this.anlikdata.filter((x)=>x.Parametre==p1).reduce((acc, val) => acc += val.Toplam, 0) / this.anlikdata.filter((x)=>x.Parametre==p1).reduce((acc, val) => acc += val.Volume, 0);

 else if(p2=="OZUPBASIVOL") return this.anlikdata.reduce((acc, val) => acc += val.Volume, 0) / this.anlikdata.reduce((acc, val) => acc += val.Up, 0);
 else if(p2=="OZUPBASIMON") return this.anlikdata.reduce((acc, val) => acc += val.Toplam, 0) / this.anlikdata.reduce((acc, val) => acc += val.Up, 0);
 else if(p2=="OZDEALBASVOL") return this.anlikdata.reduce((acc, val) => acc += val.Volume, 0) / this.anlikdata.reduce((acc, val) => acc += val.Satis, 0);
 else if(p2=="OZDEALBASMON") return this.anlikdata.reduce((acc, val) => acc += val.Toplam, 0) / this.anlikdata.reduce((acc, val) => acc += val.Satis, 0);


 else return 0;
}
 
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


