import { HttpClient } from '@angular/common/http';
import { ElementRef, EventEmitter, Inject, Output, ViewChild } from '@angular/core';
import { Injectable } from '@angular/core';
import * as JsSIP from 'jssip/lib/JsSIP' 
import { RTCSession } from 'jssip/lib/RTCSession';
import { Subject, timer } from 'rxjs';
import { AlertifyService } from '../alert';
import { FinansService } from '../finanssrc';
import { KullaniciModel, KullaniciSrcService } from '../kullanici/kullanici-src.service';
import { NotifyService } from '../notify';

@Injectable({
  providedIn: 'root'
})
export class SantralService { 
  empid = sessionStorage.getItem("EmpId");
  public sipUA!:JsSIP.UA;
  kullanici:KullaniciModel;
  aramadurum:string=""; 

  callInprogress = false;  
  sipStatus: string="";
  sounds: any; 
  completeSession: any; 
  callStatus: CallStatus = new CallStatus;
  isReady: boolean = false; 
  timer: number = 0;
  session: any;
  public interval:number=0; 
  incomingCallAudio:any;
  remoteAudio:any;
  busyAudio:any;
  callid:string="";
  xdid:string=""; 

  private _gelenCagri: Subject<boolean> = new Subject<boolean>();    // çağrı geldiğinde tetikle
  public gelenCagri = this._gelenCagri.asObservable(); 

  private _gidenCagri: Subject<CallStatus> = new Subject<CallStatus>();    // çağrı başlatıldığında
  public gidenCagri = this._gidenCagri.asObservable(); 

  constructor( 
      @Inject('semUrl') private semUrl:string,
      private http: HttpClient,
      private kullanicisrc: KullaniciSrcService,
      private alertify:NotifyService,
      private finanssrc:FinansService
      ) 
      {   
        this.kullanici = new  KullaniciModel; 
        this.sounds = {
          incoming: '../../../assets/sounds/incoming.mp3',
          outgoing: '../../../assets/sounds/outgoing.mp3',
          dmtf: '../../../assets/sounds/dmtf.mp3',
          busy: '../../../assets/sounds/busy.mp3',
        }   
        
        this.incomingCallAudio = new window.Audio(this.sounds.incoming);
        this.incomingCallAudio.loop = true;
        
        this.remoteAudio =  new window.Audio(this.sounds.outgoing);  
        this.remoteAudio.loop = true;

        this.busyAudio =  new window.Audio(this.sounds.busy); 
        this.busyAudio.loop = true;
  }
 
  async santralBaglanti(dahili:string,sifre:string){   
      try{ 

        const empidchck= this.empid??"0";
        if(empidchck=="0"){  
          sessionStorage.setItem("Santral","0"); 
          sessionStorage.setItem("Dahili",""); 
          sessionStorage.setItem("DahiliSube",""); 
          sessionStorage.setItem("DahiliUserName",""); 
          sessionStorage.setItem("MolaDurum","0"); 
        }
        else  
        {
              let sonuc=false; 
              var data = await this.kullanicisrc.getKullaniciList(parseInt(this.empid??"0"),0,0,0,0,"",true);       
              let kull =data.List; 

              if(kull==null){
                sessionStorage.setItem("Santral","0"); 
                return;
              }
              this.kullanici=kull[0];   

              sessionStorage.setItem("SantralKuyrukDurum",this.kullanici.SantralKuyrukDurum+""); 
              sessionStorage.setItem("SantralDahili",this.kullanici.SantralDahili+""); 
              sessionStorage.setItem("MolaDurum",this.kullanici.MolaDurum+"");

              if(!this.kullanici.SantralAktif){
                sessionStorage.setItem("Santral","0"); 
                return;
              }

              if(dahili!="") this.kullanici.SantralDahili = dahili;
              if(sifre!="") this.kullanici.SantralDahiliPass = sifre;
  
              if(this.kullanici.SantralAktif){ 
                var socket = new JsSIP.WebSocketInterface(this.kullanici.SantralYol1);
                
                var configuration2 = {
                sockets  : [ socket ],
                uri      : this.kullanici.SantralYol2.replace("{dahilino}",this.kullanici.SantralDahili),
                password : this.kullanici.SantralDahiliPass,
                session_timers: false, 
                authorization_user: this.kullanici.SantralDahili,
                display_name: "("+this.kullanici.SantralDahili+")-"+this.kullanici.AdSoyad,
                username: this.kullanici.SantralDahili,
                contact_uri: this.kullanici.SantralYol2.replace("{dahilino}",this.kullanici.SantralDahili),
                user_agent: "SAP",
                register_expires: 86400
                };
                
                sessionStorage.setItem("Dahili",this.kullanici.SantralDahili+""); 
                sessionStorage.setItem("DahiliSube",this.kullanici.SantralDahiliSube+""); 
                sessionStorage.setItem("DahiliUserName",this.kullanici.SantralDahiliUserName+""); 
                sessionStorage.setItem("LogAKey",this.kullanici.SantralDahiliSubeKey+""); 

                this.sipUA = new JsSIP.UA(configuration2);   
                
                this.sipUA.on('connecting', _e =>{ 
                  this.sipStatus = "Santral Durumu: Bağlanıyor.";
                  sessionStorage.setItem("Santral","1");
                }); 
                this.sipUA.on('connected', _e =>{ 
                  this.sipStatus = "Santral Durumu: Bağlandı.";
                  sessionStorage.setItem("Santral","1");
                });
                this.sipUA.on('disconnected', _e =>{ 
                  this.sipStatus = "Santral Durumu: Sonlandı.";
                  sessionStorage.setItem("Santral","0");
                });
                this.sipUA.on('registered', e =>{
                  this.isReady = true;
                  this.sipStatus = "Santral Durumu: Bağlandı.";
                  sessionStorage.setItem("Santral","1");
                });
                this.sipUA.on('unregistered', e =>{ 
                  this.sipStatus = "Santral Durumu: Sonlandı.";
                  sessionStorage.setItem("Santral","0");
                });
                this.sipUA.on('registrationFailed', e =>{ 
                  this.sipStatus = "Santral Durumu: Sonlandı.";
                  sessionStorage.setItem("Santral","0");
                });    
                this.sipUA.on('newRTCSession', (data: any) => {    
                  this.session = data.session;  
                  // this.remoteAudio.play();  

                  this.session.on('newInfo', (e:any) =>{
                    
                  });
                  this.session.on('newDTMF', (e:any) =>{
                    
                  });
                  this.session.on('sending', (e:any) =>{
                    
                  });
                  this.session.on('getusermediafailed', (e:any) =>{
                  
                  });
                  this.session.on('icecandidate', (e:any) =>{
                    
                  });
                  this.session.on('refer', (e:any) =>{
                    
                  });
                  this.session.on('reinvite', (e:any) =>{
                  
                  });
                  this.session.on('terminate', (e:any) =>{
                    this.callStatus.OutcomingStatus=false;
                    this._gidenCagri.next(this.callStatus);
                    this._gelenCagri.next(false);  
                    this.alertify.warning("Görüşme Sonlandı!");
                  });
                  this.session.on('ended', (e:any) =>{
                    this.callStatus.OutcomingStatus=false;
                    this._gidenCagri.next(this.callStatus);
                    this._gelenCagri.next(false);  
                    this.alertify.warning("Görüşme Sonlandı!");
                    //this.SessionHungupCall();
                  });
                  this.session.on('failed', (e:any) =>{  
                    this.callStatus.OutcomingStatus=false;
                    this._gidenCagri.next(this.callStatus);
                    this._gelenCagri.next(false);   
                    this.alertify.warning("Görüşme Sonlandı! Durum: " +this.GetCallError(e.cause));
                    //this.SessionHungupCall();
                  });
                  this.session.on('accepted', (e:any) =>{   
                    this.remoteAudio.pause();  
                    this.callStatus.OutcomingStatus=true;
                    this._gidenCagri.next(this.callStatus); 
                    this.alertify.success("Arama Kabul Edildi")
                  });
                  this.session.on('confirmed', (e:any) =>{     
                    this.remoteAudio.pause();
                    this.callStatus.OutcomingStatus=true; 
                    this.callStatus.IncomingStatus=true;
                    this._gidenCagri.next(this.callStatus);
                    this.alertify.success("Arama Cevaplandı!");
                  });
                  this.session.on('addstream', (e:any) =>{  
                    this.callStatus.OutcomingStatus=true; 
                    this._gidenCagri.next(this.callStatus);
                    //this.incomingCallAudio.pause();
                  });  
                  this.session.on('peerconnection', (e:any) =>{   
                      e.peerconnection.addEventListener('addstream', (e:any) => {                   
                      this.remoteAudio.srcObject = e.stream; 
                      this.remoteAudio.play();  
                    }); 
                    this.alertify.success("Görüşme Başladı!")
                  }); 

                  if (this.session.direction == "incoming") {
                  try{ 
                    sessionStorage.setItem("GelenAramaAktif","0");
                    sessionStorage.setItem("DisHatAdi","")
                    sessionStorage.setItem("DisHatAdi","")
                    sessionStorage.setItem("DisHatAdi",this.session._remote_identity._display_name); 
                    this.alertify.success("Gelen Arama!")

                    sessionStorage.setItem("callid",this.session._request.getHeader("X-Voipmonitor-Custom1"))
                    this.callid=this.session._request.getHeader("X-Voipmonitor-Custom1");  

                    this.callStatus.InComingPhone=this.session._remote_identity._uri._user;
                    this.callStatus.IncomingStatus=true;
                    this._gelenCagri.next(true);                
                    this.incomingCallAudio.play();  
                     
                    this.session.on('peerconnection', (e:any)=> {
                      e.peerconnection.addEventListener('addstream', (a:any)=> {
                        var audio = document.createElement('audio');
                        audio.srcObject = a.stream;
                        audio.play();   
                        this.alertify.success("Gelen Arama Başladı!"); 
                      });
                    }); 

                  }catch(e:any){
                      this.alertify.warning(e.message);
                    } 
                  }
                  else if (this.session.direction == "outgoing") {
                    // this.remoteAudio.play();  
                    sessionStorage.setItem("callid",this.session._request.getHeader("Call-ID"))
                    this.callid=this.session._request.getHeader("Call-ID");  

                    this.callStatus.OutcomingStatus=true; 
                    this._gidenCagri.next(this.callStatus);  
                  } 
                });  
                this.sipUA.start();
              }
              else  
              {
                sessionStorage.setItem("Santral","0"); 
                sessionStorage.setItem("Dahili",""); 
                sessionStorage.setItem("DahiliSube",""); 
                sessionStorage.setItem("DahiliUserName",""); 
                sessionStorage.setItem("LogAKey","");  
              }
        }  
      }
      catch(e:any)
      { 
        sessionStorage.setItem("Santral","0");
      }
  }  
 
 dial(telno:string,hat:string) { 
  var eventHandlers = {
    'progress': (_e:any)=> { 
      this.aramadurum  = "Giden Arama Durumu: Başladı."; 
    },
    'failed': (e:any)=> {   
      this.remoteAudio.pause();
      this.busyAudio.play(); 
       
      if (e.cause == JsSIP.C.causes.BUSY) {
        this.alertify.warning("Giden Arama Durumu: Sonlandı: Meşgul"); 
        this.callStatus.OutcomingStatus=false;
        this._gidenCagri.next(this.callStatus);   
      }    
      else if (e.cause == 'Unavailable') {
        this.alertify.warning("Giden Arama Durumu: Sonlandı: Açmadı"); 
        this.callStatus.OutcomingStatus=false;
        this._gidenCagri.next(this.callStatus);  
      } 
      else if (e.cause == 'Terminated') { 
        this.alertify.warning("Giden Arama Durumu: Sonlandı"); 
          this.callStatus.OutcomingStatus=true;
          this._gidenCagri.next(this.callStatus);  
      }
      else if (e.cause == 'User Denied Media Access') {
        this.alertify.warning("Giden Arama Durumu: Sonlandı: Mikrofon Hatası");  
        this.callStatus.OutcomingStatus=false;
       this._gidenCagri.next(this.callStatus);   
      }
      else if (e.cause != 'Canceled') {
        this.alertify.warning("Giden Arama Durumu: Sonlandı: "+e.cause);  
        this.callStatus.OutcomingStatus=false;
        this._gidenCagri.next(this.callStatus);   
      }
      else {
        this.aramadurum  = "";
      }
      
      setTimeout(() => {
        this.busyAudio.pause();  
      }, 3000);

    },
    'ended': (e:any)=> { 
      if (e.cause == 'Terminated') {
        this.alertify.success("Giden Arama Durumu: Sonlandı: Başarılı"); 
        this.callStatus.OutcomingStatus=false;
        this._gidenCagri.next(this.callStatus);   
      } else {
        
        this.alertify.success("Giden Arama Durumu: Sonlandı: "+e.cause); 
        this.callStatus.OutcomingStatus=false;
        this._gidenCagri.next(this.callStatus);   
      }
    },
    'confirmed': (_e:any)=> { 
      this.remoteAudio.pause();
      
      this.callStatus.OutcomingStatus=true;
      this._gidenCagri.next(this.callStatus);
      this.aramadurum  = "Giden Arama Durumu: Cevapladı.";
    }
  };

  var options = {
    'eventHandlers'    : eventHandlers,
    'mediaConstraints' : { 'audio': true, 'video': false }
  }; 

  let hatek =  hat=="1" ?"0":hat=="2"?"90":hat=="3"?"80":"0"; 

  this.session = null;

  if(this.kullanici.SantralDahili=="" || this.kullanici.SantralDahili=="-1"){
    // this.session = this.sipUA.call('sip:'+hatek+telno+'@'+this.kullanici.SantralSunucuYol, options); 
    this.session = this.sipUA.call('sip:'+hatek+telno+'@karaderilisantral.nitelix.com', options); 
  } 
  else if(this.kullanici.SantralDahili!=""){  
      var hatsıfır  = telno.length==10 ? "0":"";
      var yol = "sip:"+(hat+hatsıfır+telno)+"@karaderilisantral.nitelix.com";
      this.session = this.sipUA.call(yol, options);  
  } 

  this.session.connection.addEventListener('addstream', (e:any) => {  
    var audio = document.createElement('audio');
    audio.srcObject = e.stream;
    audio.play();   
    this.alertify.success("Giden Arama Başladı!");
  });
} 

dialIcHat(telno:string) { 
  var eventHandlers = {
    'progress': (_e:any)=> { 
      this.aramadurum  = "Giden Arama Durumu: Başladı."; 
    },
    'failed': (e:any)=> {   
      this.remoteAudio.pause();
      this.busyAudio.play(); 
       
      if (e.cause == JsSIP.C.causes.BUSY) {
        this.alertify.warning("Giden Arama Durumu: Sonlandı: Meşgul"); 
        this.callStatus.OutcomingStatus=false;
        this._gidenCagri.next(this.callStatus);   
      }    
      else if (e.cause == 'Unavailable') {
        this.alertify.warning("Giden Arama Durumu: Sonlandı: Açmadı"); 
        this.callStatus.OutcomingStatus=false;
        this._gidenCagri.next(this.callStatus);  
      } 
      else if (e.cause == 'Terminated') { 
        this.alertify.warning("Giden Arama Durumu: Sonlandı"); 
          this.callStatus.OutcomingStatus=true;
          this._gidenCagri.next(this.callStatus);  
      }
      else if (e.cause == 'User Denied Media Access') {
        this.alertify.warning("Giden Arama Durumu: Sonlandı: Mikrofon Hatası");  
        this.callStatus.OutcomingStatus=false;
       this._gidenCagri.next(this.callStatus);   
      }
      else if (e.cause != 'Canceled') {
        this.alertify.warning("Giden Arama Durumu: Sonlandı: "+e.cause);  
        this.callStatus.OutcomingStatus=false;
        this._gidenCagri.next(this.callStatus);   
      }
      else {
        this.aramadurum  = "";
      }
      
      setTimeout(() => {
        this.busyAudio.pause();  
      }, 3000);

    },
    'ended': (e:any)=> { 
      if (e.cause == 'Terminated') {
        this.alertify.success("Giden Arama Durumu: Sonlandı: Başarılı"); 
        this.callStatus.OutcomingStatus=false;
        this._gidenCagri.next(this.callStatus);   
      } else {
        
        this.alertify.success("Giden Arama Durumu: Sonlandı: "+e.cause); 
        this.callStatus.OutcomingStatus=false;
        this._gidenCagri.next(this.callStatus);   
      }
    },
    'confirmed': (_e:any)=> { 
      this.remoteAudio.pause();
      
      this.callStatus.OutcomingStatus=true;
      this._gidenCagri.next(this.callStatus);
      this.aramadurum  = "Giden Arama Durumu: Cevapladı.";
    }
  };

  var options = {
    'eventHandlers'    : eventHandlers,
    'mediaConstraints' : { 'audio': true, 'video': false }
  }; 

  this.session = null;

  if(this.kullanici.SantralDahili=="" || this.kullanici.SantralDahili=="-1"){
    this.session = this.sipUA.call('sip:'+telno+'@karaderilisantral.nitelix.com', options); 
    // this.session = this.sipUA.call('sip:'+telno+'@'+this.kullanici.SantralSunucuYol, options); 
  } 
  else if(this.kullanici.SantralDahili!=""){  
    var yol = "sip:"+telno+"@karaderilisantral.nitelix.com";
    this.session = this.sipUA.call(yol, options); 
    // this.session = this.sipUA.call(this.kullanici.SantralAramaYol.replace("{phone}",(telno)), options); 
  } 

  this.session.connection.addEventListener('addstream', (e:any) => {  
    var audio = document.createElement('audio');
    audio.srcObject = e.stream;
    audio.play();   
    this.alertify.success("Giden Arama Başladı!");
  });
} 


  // async DisHatAdiEkle(){
  // var santral = sessionStorage.getItem("SantralAdi")?.toString()??"";

  // (await this.finanssrc.GetSantralAdi(santral,this.session._request.getHeader("X-DID"))).subscribe(
  //   data=>{
  //     if(data.Success){
  //       sessionStorage.setItem("DisHatAdi",data.Model);
  //     }
  //     }
  //   ) 
  // }

sanalposyonlendir() {
  this.finanssrc.SanalPosExecute(this.kullanici.SantralSunucuYol,this.callid); 
}

ntxsanalposyonlendir(tutar:number,sozlesmeno:string,terminalid:string) {
  this.finanssrc.NtxSanalPosExecute(tutar,sozlesmeno,terminalid); 
}

dialDisHat(telno:string,hat:string) { 
  var eventHandlers = {
    'progress': (_e:any)=> { 
      this.aramadurum  = "Giden Arama Durumu: Başladı."; 
    },
    'failed': (e:any)=> {   
      this.remoteAudio.pause();
      this.busyAudio.play(); 

      if (e.cause == JsSIP.C.causes.BUSY) {
        this.alertify.warning("Giden Arama Durumu: Sonlandı: Meşgul"); 
        this.callStatus.OutcomingStatus=false;
        this._gidenCagri.next(this.callStatus);   
      }    
      else if (e.cause == 'Unavailable') {
        this.alertify.warning("Giden Arama Durumu: Sonlandı: Açmadı"); 
        this.callStatus.OutcomingStatus=false;
        this._gidenCagri.next(this.callStatus);  
      } 
      else if (e.cause == 'Terminated') { 
        this.alertify.warning("Giden Arama Durumu: Sonlandı"); 
          this.callStatus.OutcomingStatus=true;
          this._gidenCagri.next(this.callStatus);  
      }
      else if (e.cause == 'User Denied Media Access') {
        this.alertify.warning("Giden Arama Durumu: Sonlandı: Mikrofon Hatası");  
        this.callStatus.OutcomingStatus=false;
       this._gidenCagri.next(this.callStatus);   
      }
      else if (e.cause != 'Canceled') {
        this.alertify.warning("Giden Arama Durumu: Sonlandı: "+e.cause);  
        this.callStatus.OutcomingStatus=false;
        this._gidenCagri.next(this.callStatus);   
      }
      else {
        this.aramadurum  = "";
      }
      
      setTimeout(() => {
        this.busyAudio.pause();  
      }, 3000);

    },
    'ended': (e:any)=> { 
      if (e.cause == 'Terminated') {
        this.alertify.success("Giden Arama Durumu: Sonlandı: Başarılı"); 
        this.callStatus.OutcomingStatus=false;
        this._gidenCagri.next(this.callStatus);   
      } else {
        
        this.alertify.success("Giden Arama Durumu: Sonlandı: "+e.cause); 
        this.callStatus.OutcomingStatus=false;
        this._gidenCagri.next(this.callStatus);   
      }
    },
    'confirmed': (_e:any)=> { 
      this.remoteAudio.pause();
      
      this.callStatus.OutcomingStatus=true;
      this._gidenCagri.next(this.callStatus);
      this.aramadurum  = "Giden Arama Durumu: Cevapladı.";
    }
  };

  var options = {
    'eventHandlers'    : eventHandlers,
    'mediaConstraints' : { 'audio': true, 'video': false }
  }; 

  if(hat=="-")hat="";

   var hatsıfır  = telno.length==10 ? "0":"";
   this.session = this.sipUA.call('sip:'+hat+hatsıfır+telno+'@karaderilisantral.nitelix.com', options); 
  
  this.session.connection.addEventListener('addstream', (e:any) => { 
    var audio = document.createElement('audio');
    audio.srcObject = e.stream;
    audio.play();   
    this.alertify.success("Giden Arama Başladı!");
  });  
} 

 callTerminated() {
    this.callStatus.resetCallStatus();

    this.callStatus.currentStatus = 'CALL ENDED';

    setTimeout(() => {
        this.callStatus.currentStatus = '';
    }, 1000);

    //this.stopSound().outgoing.pause(); 
 }

 onMute() {
    if (this.isMuted()) {
        this.session.unmute();
        return;
    }
    this.session.mute()
 }

getAramaDurum():string{
  return this.aramadurum;
}

stopSound(): CallSounds {
    Object.keys(this.sounds).map((value) => (this.sounds[value].pause()));
    return this.sounds;
}

isInProgress(): boolean {
    return this.session.isInProgress();
}

isEstablished(): boolean {
    if (!this.session) return false;
    return this.session.isEstablished();
}

isEnded(): boolean {
    return this.session.isEnded();
}

isReadyToReOffer(): boolean {
    return this.session.isReadyToReOffer();
}

isMuted(): any {
    if (!this.session) return false;
    return this.session.isMuted().audio;
}

isOnHold(): any {
    if (!this.session) return true;
    return this.session.isOnHold();
}

startCallTimer() {
    // this.interval = setInterval(() => {
    //     this.timer += 1000;
    // }, 1000)
}

stopCallTimer() {
    clearInterval(this.interval);
}

stopcall(){
  this.session.terminate();
}

mutecall(){
  if(this.session.isMuted().audio){
    this.session.unmute({audio: true});
  }else{
    this.session.mute({audio: true});   
  }  
}

public SessionAnswerCall(){
  this.session.answer({
    mediaConstraints: {audio: true, video: false}
  });
  this.incomingCallAudio.pause(); 
}

public SessionHungupCall(){ 
  if(this.session!=null) this.session.terminate(); 
  this.incomingCallAudio.pause();
}

SessionMuteCall(){
  if(this.session.isMuted().audio){
    this.session.unmute({audio: true});
  }else{
    this.session.mute({audio: false});   
  }  
}

CagriTransfer(tone:string,dahili:string,santralno:string){
 try{
  this.session.sendDTMF(tone);

  if(dahili!=""){
    setTimeout(() => {
      this.session.sendDTMF(dahili+'#');
    }, 1000);
  }
  else if(santralno!=""){
    setTimeout(() => {
      this.session.sendDTMF(santralno+'#');
    }, 1000);
  }
 }
 catch(e:any){ 
 }
}

GetCallError(e:string){ 
  if(e=="User Denied Media Access")return "Bağlı Mikrofon Yok";
  else if(e=="Busy")return "Meşgul";
  else if(e=="Unavailable")return "Açmadı";
  else if(e=="Terminated")return "Kapattı";
  else if(e=="Canceled")return "Arama İptal Edildi";
  else return e; 
} 

}

interface CallSounds {
  [key: string]: HTMLAudioElement;
}

class CallStatus { 
  dailing: boolean=false;
  connecting: boolean=false;
  inProgress: boolean=false;
  onHold: boolean=false;
  onMute: boolean=false;
  currentStatus: string="";
  isReadyToCall: boolean=false;
  InComingPhone:string="";
  IncomingStatus:boolean=false;
  OutcomingStatus:boolean=false;

  resetCallStatus = (): CallStatus => {
      this.dailing = false;
      this.connecting = false;
      this.inProgress = false;
      this.onHold = false;
      this.onMute = false; 
      return this;
  }

  isCalling(): boolean {
      return this.dailing || this.inProgress;
  }  
}
