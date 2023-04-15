import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import moment from 'moment';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { User } from 'src/app/app.component';  
import { KullaniciSrcService } from 'src/app/services/kullanici/kullanici-src.service';
import { NotifyService } from 'src/app/services/notify';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI; 
  @ViewChild("logtckn") inputtckn: ElementRef | undefined;
  @ViewChild("logkod") inputkod: ElementRef | undefined;

  user: User = new User("","","","","",0,"");
  public userLogin: boolean = false;
  adsoyad = '';
  isWaiting: boolean = false; 
  dogrulandi:boolean = false; 

  constructor(
    @Inject('semUrl') private semUrl:string,
    private http:HttpClient,
    private alertify:NotifyService,
    private kullsrc:KullaniciSrcService
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.inputtckn?.nativeElement.focus();
    }, 100);

    // this.titleService.setTitle("Dts Connect");
  }

  ngAfterViewInit() {
    
  }

  crmLogin(ss:User){
    if(ss.Email==null || ss.Email==""){
      this.alertify.warning("Email Adresi Zorunludur!");
    }
    else  if(ss.Password==null || ss.Password==""){
      this.alertify.warning("Şifre Zorunludur!");
    }
    else  
    { 
      this.ApiuserLogin(ss);
    }
  }

  ApiuserLogin(us:User) { 
    this.user.UserKey= btoa(us.Email+":"+us.Password)
    this.user.Email=us.Email;

    this.isWaiting=true;
    this.http.post<any>(this.semUrl+"/Login/LoginUser", this.user)
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
      sessionStorage.setItem("SorumluBirim",res.Model.SorumluBirim);
      sessionStorage.setItem("SirketBirim",res.Model.SirketBirim);
      sessionStorage.setItem("DefaultSirket",res.Model.DefaultSirket);
      sessionStorage.setItem("AktifTab","0");
      sessionStorage.setItem("WebTitle",res.Model.WebTitle);
      sessionStorage.setItem("Logo",res.Model.Logo);
      sessionStorage.setItem("BackLogo",res.Model.BackLogo);
      sessionStorage.setItem("DarkMod",res.Model.DarkMod);
      sessionStorage.setItem("SistemKilitSure",res.Model.SistemKilitSure);
      sessionStorage.setItem("LoginDate",moment(new Date()).format("yyyy-MM-DD HH:mm"));
      sessionStorage.setItem("MolaDurum",res.Model.MolaDurum+"");
      sessionStorage.setItem("CepTel",res.Model.CepTel+"");
      sessionStorage.setItem("SantralNumara",res.Model.SantralNumara+"");
      sessionStorage.setItem("SantralDahiliKod",res.Model.SantralDahiliKod+"");
      this.adsoyad = res.Model.KullanilanAd; 

      document.getElementById("openModalButton")?.click(); 
      window.location.reload();
      }
     }, error =>{
      this.userLogin=false
      this.alertify.warning(error);
    });  
  } 

  GetQCode(){
    if(this.user.Tckn==null || this.user.Tckn==""){
      this.alertify.warning("Tckn Bilgisi Zorunludur!");
    }
    else if(this.user.Tckn.length!=11){ 
      this.alertify.warning("Tckn Bilgisi Eksik Girildi!");
    }
    else { 
      this.isWaiting=true;
      this.http.post<any>(this.semUrl+"/Login/LoginUserV3", this.user)
      .subscribe(async res => {
        this.isWaiting=false;
  
        if(res.Success==false){
          this.alertify.warning(res.Message);
        }
        else{ 
        this.dogrulandi=true; 
        setTimeout(() => {
          this.inputkod?.nativeElement.focus();
        }, 100);
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
    else if(this.user.Tckn==null || this.user.Tckn==""){
      this.alertify.warning("Tckn Bilgisi Zorunludur!");
      return;
    }
    else if(this.user.Tckn.length!=11){ 
      this.alertify.warning("Tckn Bilgisi Eksik Girildi!");
      return;
    } 
    else if(this.user.DogulamaKod==null || this.user.DogulamaKod==""){
      this.alertify.warning("Doğrulama Kodu Giriniz!");
      return;
    }
    else if(this.user.DogulamaKod.length!=6){ 
      this.alertify.warning("Doğrulama Kodu Eksik Girildi!");
      return;
    } 
    else {
      this.isWaiting=true;
      this.http.post<any>(this.semUrl+"/Login/LoginUserV4", this.user)
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
          sessionStorage.setItem("SistemKilitSure",res.Model.SistemKilitSure);
          sessionStorage.setItem("LoginDate",moment(new Date()).format("yyyy-MM-DD HH:mm"));
          sessionStorage.setItem("MolaDurum",res.Model.MolaDurum+"");
          sessionStorage.setItem("CepTel",res.Model.CepTel+"");
          sessionStorage.setItem("SantralNumara",res.Model.SantralNumara+"");
          sessionStorage.setItem("SantralDahiliKod",res.Model.SantralDahiliKod+"");

          this.adsoyad = res.Model.KullanilanAd;   
          document.getElementById("openModalButton")?.click(); 
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
    this.user=new User("","","","","",0,"");
  }

}
