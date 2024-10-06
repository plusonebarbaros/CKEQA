import { HttpClient } from "@angular/common/http";
import { Component, OnInit, ViewChild, ElementRef, Inject } from "@angular/core";
import { Router } from "@angular/router";
import moment from "moment";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { KullaniciSrcService, User } from "src/app/services/KullaniciSrc";
import { NotifyService } from "src/app/services/notify";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI; 
  @ViewChild("inputusername") inputusername: ElementRef | undefined;
  @ViewChild("inputsifre") inputsifre: ElementRef | undefined;

  user: User = new User("","","","","",0,"");
  public userLogin: boolean = false;
  adsoyad = '';
  isWaiting: boolean = false; 
  dogrulandi:boolean = false; 

  constructor(
    @Inject('semUrl') private semUrl:string,
    private http:HttpClient,
    private alertify:NotifyService,
    private kullsrc:KullaniciSrcService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.inputusername?.nativeElement.focus();
      console.log(this.semUrl);
    }, 100);
  }

  ngAfterViewInit() { 
  }


  B2BLogin(){
    if(this.user.Kullanici==null || this.user.Kullanici==""){
      this.alertify.warning("Kullanıcı Adı Alanı Zorunludur!");
      return;
    } 
    else if(this.user.Sifre==null || this.user.Sifre==""){
      this.alertify.warning("Şifre Alanı Zorunludur!");
      return;
    } 
    else {
      this.isWaiting=true;
      this.user.UserKey= btoa(this.user.Kullanici+":"+this.user.Sifre) 

      var usern = new User("","","","","",0,"");
      usern.UserKey = btoa(this.user.Kullanici+":"+this.user.Sifre) ;
      usern.Device=this.user.Device; 
      
      this.http.post<any>(this.semUrl+"/Login/LoginB2B", usern)
      .subscribe(async res => {
        this.isWaiting=false;
  
        if(res.Success==false){
          this.alertify.warning(res.Message);
        }
        else{   
          this.userLogin=true;           
          sessionStorage.setItem("Token",res.Token);
          sessionStorage.setItem("LoginDate",moment(new Date()).format("yyyy-MM-DD HH:mm")); 
          sessionStorage.setItem("data",JSON.stringify(res.Model));
          sessionStorage.setItem("Period","0");
          this.router.navigateByUrl("ana-sayfa"); 
          window.location.reload();     
        }
       }, error =>{
        this.isWaiting=false;
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
