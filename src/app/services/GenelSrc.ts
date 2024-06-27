import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { isEmpty, map } from 'rxjs/operators';
import moment from 'moment';
import { KullaniciModel, KullaniciSrcService } from './KullaniciSrc';
import { Customer, Items, MapSiparisIptal, SatisSiparis, ConnTeklifFirma } from './SatinAlmaSrc';
import { NotifyService } from './notify';



@Injectable({ providedIn: 'root' })
export class GenelApi {
  [x: string]: any;   

 constructor(
   @Inject('semUrl') private semUrl:string,
   private http: HttpClient,
   private kullsrc:KullaniciSrcService,
   private alertify:NotifyService,
   ) { }
  
  async getWhsList(subeid:number,tumdepo:number)
 { 
  let url=this.semUrl+"/login/GetWhsList?Token="+ this.kullsrc.token+"&Sube="+subeid+"&TumDepo="+tumdepo;
   return await this.http.get<Result<WhsModel[]>>(url).pipe(map((res: any) => res)); ;
  } 
 
  async CariList(Arama:string,KacSatir:number,Tip:string,CariKod:string):Promise<ReturnValuesList<Customer>>  {
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
     }
    ); 
  
      let options = { headers: headers };
  
      const body =  JSON.stringify({ 
        "Arama":  Arama,    
        "KacSatir":  KacSatir,    
        "Tip":  Tip,     
        "CariKod":  CariKod,    
        "Token":this.kullsrc.token, 
      });
  
    var result = await this.http.post<any>(this.semUrl+"/Cari/CariList", body, options).toPromise();
  
    var sonuc = JSON.parse(JSON.stringify(result)); 
  
    return new ReturnValuesList( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["List"]);
  }
 
   
  async GetStokList(itemcode:string,kacsatir:number,keyword:string,taleptur:string,GrupKodu:number):Promise<ReturnValuesList<Items>>  {
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
     }
    ); 
  
      let options = { headers: headers };
  
      const body =  JSON.stringify({ 
        "ItemCode":  itemcode,    
        "KacSatir":  kacsatir,    
        "KeyWord":  keyword,    
        "TalepTur":  taleptur,    
        "GrupKodu":  GrupKodu,    
        "Token":this.kullsrc.token, 
      });
  
    var result = await this.http.post<any>(this.semUrl+"/Stok/GetStokList", body, options).toPromise();
  
    var sonuc = JSON.parse(JSON.stringify(result)); 
  
    return new ReturnValuesList( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["List"]);
  }

  async GetTransferStokList(itemcode:string,kacsatir:number,keyword:string,DepoKodu:string):Promise<ReturnValuesList<Items>>  {
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
     }
    ); 
  
      let options = { headers: headers };
  
      const body =  JSON.stringify({ 
        "ItemCode":  itemcode,    
        "KacSatir":  kacsatir,    
        "KeyWord":  keyword,    
        "DepoKodu":  DepoKodu,     
        "Token":this.kullsrc.token, 
      });
  
    var result = await this.http.post<any>(this.semUrl+"/Stok/GetTransferStokList", body, options).toPromise();
  
    var sonuc = JSON.parse(JSON.stringify(result)); 
  
    return new ReturnValuesList( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["List"]);
  }

  async GetStokGrup(SapSirket:string,ListelemTip:boolean)
  { 
    let url=this.semUrl+"/Stok/GetStokGrup?Token="+ this.kullsrc.token+"&SapSirket="+ SapSirket+"&ListelemTip="+ ListelemTip; 
   return await this.http.get<Result<StokGrupModel[]>>(url).pipe( map((res:any)=> res));
  }

 async GetSehirList(sehirid:string)
 { 
   let url=this.semUrl+"/Tanim/GetSehirList?Code="+sehirid+"&Token="+ this.kullsrc.token; 
  return await this.http.get<Result<SehirModel[]>>(url).pipe( map((res:any)=> res));
 }

 async GetUlkeList(sehirid:string)
 { 
   let url=this.semUrl+"/Tanim/GetUlkeList?Code="+sehirid+"&Token="+ this.kullsrc.token; 
  return await this.http.get<Result<UlkeModel[]>>(url).pipe( map((res:any)=> res));
 }

 async GetIlceList(sehirid:string)
 { 
   let url=this.semUrl+"/Tanim/GetIlceList?SehirId="+sehirid+"&Token="+ this.kullsrc.token; 
  return await this.http.get<Result<IlceModel[]>>(url).pipe( map((res:any)=> res));
 } 
   
  async GetKur(CurrCode:string)
  { 
      let url=this.semUrl+"/Muhasebe/GetKur?CurrCode="+CurrCode+"&Token="+this.kullsrc.token; 
          return await this.http.get<Result<number>>(url).pipe( map((res:any)=> res));
  }

  async BelgeYukle(formdata:FormData):Promise<ReturnValues>  {
    const headers = new HttpHeaders(); 
    let options = { headers: headers }; 

    formdata.append('token', this.kullsrc.token+"" );

    var result = await this.http.post<any>(this.semUrl+"/Genel/BelgeYukle", formdata,options).toPromise();

    var sonuc = JSON.parse(JSON.stringify(result));
    return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
 } 
 

 async BelgeList(ekranid:number,kayitid:number,semkey:string,sozlesmeid:number=0,tiplist:number[]=[]):Promise<ReturnValuesList<BelgeModel>>  {
  const headers = new HttpHeaders(
    {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Headers': 'Content-Type',
   }
  ); 

    let options = { headers: headers };

    const body =  JSON.stringify({ 
      "EkranId":  ekranid,   
      "KayitId":  kayitid,   
      "SemKey":  semkey,   
      "SozlesmeId":  sozlesmeid,   
      "TipList":  tiplist,   
      "Token":this.kullsrc.token,  
    });

  var result = await this.http.post<any>(this.semUrl+"/Genel/BelgeList", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result)); 

  return new ReturnValuesList( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["List"]);
} 


 async BelgeSil(belge:BelgeModel):Promise<ReturnValues>  {
    const headers = new HttpHeaders(
    {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Access-Control-Allow-Headers': 'Content-Type',
    }
    ); 
    
    let options = { headers: headers };
    
    const body =  JSON.stringify({ 
  "Data":  belge,   
  "Token":this.kullsrc.token, 
    });
   
  var result = await this.http.post<any>(this.semUrl+"/Genel/BelgeSil", body, options).toPromise();
   
  var sonuc = JSON.parse(JSON.stringify(result));
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
  }

async CariKartOlustur(post:Customer,tip:IslemTipi):Promise<ReturnValues>  {
  const headers = new HttpHeaders(
    {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Headers': 'Content-Type',
   }
  ); 

  let options = { headers: headers };
  
  const body =  JSON.stringify({ 
    "Data":  post,       
    "Token":this.kullsrc.token, 
    "Tip":tip, 
  });

  var result = await this.http.post<any>(this.semUrl+"/Cari/CariKartOlustur", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}

async CariKartOnay(post:Customer,tip:IslemTipi,onay:boolean,aciklama:string):Promise<ReturnValues>  {
  const headers = new HttpHeaders(
    {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Headers': 'Content-Type',
   }
  ); 

  let options = { headers: headers };
  
  const body =  JSON.stringify({ 
    "Data":  post,       
    "Onay":  onay,       
    "Aciklama":  aciklama,       
    "Token":this.kullsrc.token, 
    "Tip":tip, 
  });

  var result = await this.http.post<any>(this.semUrl+"/Cari/CariKartOnay", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}

async GetCariVarMi(VN:string,ct:string)
{ 
     let url=this.semUrl+"/Cari/GetCariVarMi?VN="+VN+"&CardType="+ct+"&Token="+this.kullsrc.token; 
     return await this.http.get<Result<number>>(url).pipe( map((res:any)=> res));
}

GetTeklifCariList() { 
  let url=this.semUrl+"/Cari/GetTeklifCariList?Token="+ this.kullsrc.token; 

    return this.http.get<Result<ConnTeklifFirma>>(url).pipe( map((res:any)=> res));   
  } 

 async GetLogList<T>(EkranId:number,KayitId:number,KayitGuid:string,Model:string):Promise<ReturnValuesList<T>>  {
  const headers = new HttpHeaders(
    {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Headers': 'Content-Type',
   }
  ); 

  let options = { headers: headers };
  
  const body =  JSON.stringify({ 
    "KayitGuid":  KayitGuid,  
    "KayitId":KayitId, 
    "EkranId":EkranId, 
    "Model":Model, 
    "Token":this.kullsrc.token, 
  });

  var result = await this.http.post<any>(this.semUrl+"/Tanim/GetLogList", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result));
  return new ReturnValuesList( sonuc.Model["Id"], sonuc.Model["Success"], sonuc.Model["Message"] ?? "", sonuc.Model["Token"] ?? "",sonuc.Model["List"]);

}
 

 async OnayAsamaTakipVer(takipid:number)
 { 
   let url=this.semUrl+"/Onay/OnayAsamaTakipVer?TakipId="+takipid+"&Token="+ this.kullsrc.token; 
  return await this.http.get<Result<OnayAsamaTakip[]>>(url).pipe( map((res:any)=> res));
 }


async IkServiceRestart():Promise<ReturnValues>  {
  const headers = new HttpHeaders(
    {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Headers': 'Content-Type',
   }
  ); 

  let options = { headers: headers };
  
  const body =  JSON.stringify({  
    "Token":this.kullsrc.token 
  });

  var result = await this.http.post<any>(this.semUrl+"/Tanim/IkServiceRestart", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}
async KullaniciBildirimEkle(post:KullaniciBildirimModel,tip:IslemTipi):Promise<ReturnValues>  {
  const headers = new HttpHeaders(
    {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Headers': 'Content-Type',
   }
  ); 

  let options = { headers: headers };
  
  const body =  JSON.stringify({ 
    "Data":  post,  
    "Token":this.kullsrc.token, 
    "Tip":tip, 
  });

  var result = await this.http.post<any>(this.semUrl+"/Tanim/KullaniciBildirimEkle", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}
async GetKullaniciBildirim(id:number,baslangic:Date | undefined,bitis:Date |undefined,tumu:boolean)
{ 
     let url=this.semUrl+"/Tanim/GetKullaniciBildirim?Docentry="+id+"&Baslangic="+moment(baslangic).format("yyyy-MM-DD")+"&Bitis="+moment(bitis).format("yyyy-MM-DD")+"&Tumu="+tumu+"&Token="+this.kullsrc.token; 
     return await this.http.get<Result<KullaniciBildirimModel>>(url).pipe( map((res:any)=> res));
}

async KullaniciBildirimDetayEkle(post:KullaniciBildirimDetayModel):Promise<ReturnValues>  {
  const headers = new HttpHeaders(
    {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Headers': 'Content-Type',
   }
  ); 

  let options = { headers: headers };
  
  const body =  JSON.stringify({ 
    "Data":  post,  
    "Token":this.kullsrc.token 
  });

  var result = await this.http.post<any>(this.semUrl+"/Tanim/KullaniciBildirimDetayEkle", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}
async GetKullaniciBildirimDetay(id:number,LoginCheck:boolean)
{ 
     let url=this.semUrl+"/Tanim/GetKullaniciBildirimDetay?Token="+this.kullsrc.token+"&LoginCheck="+LoginCheck; 
     return await this.http.get<Result<KullaniciBildirimModel>>(url).pipe( map((res:any)=> res));
}

    async GetSistemLogList()
    { 
    let url=this.semUrl+"/Tanim/GetSistemLogList?Token="+ this.kullsrc.token;
      return this.http.get<Result<SistemLog>>(url).pipe(map((res: any) => res));
    } 

    GuidGenerator() {
      return 'xxxxxxxx-xxxx-xxxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
        v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16).toString();
      });
    }

    async FormMailGonder(B64:string,To:string,Bcc:string,Cc:string,Baslik:string,Aciklama:string,):Promise<ReturnValues>  {
      const headers = new HttpHeaders(
        {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Headers': 'Content-Type',
       }
      ); 
    
      let options = { headers: headers };
      
      const body =  JSON.stringify({ 
        "B64":  B64,   
        "To":To, 
        "Bcc":Bcc, 
        "Cc":Cc, 
        "Baslik":Baslik, 
        "Aciklama":Aciklama,  
        "Token":this.kullsrc.token, 
      });
    
      var result = await this.http.post<any>(this.semUrl+"/Rapor/FormMailGonder", body, options).toPromise();
    
      var sonuc = JSON.parse(JSON.stringify(result))['Model'];
      return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
    }

    async GetMailBilgi(FirmaKodu:string)
    { 
    let url=this.semUrl+"/Rapor/GetMailBilgi?FirmaKodu="+FirmaKodu+"&Token="+this.kullsrc.token; 
        return await this.http.get<Result<MailGonderimModel>>(url).pipe( map((res:any)=> res));
    }   
  
    async KullPozisyonEkle(post:ConnKulPozisyonModel,tip:IslemTipi):Promise<ReturnValues>  {
      const headers = new HttpHeaders(
        {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Headers': 'Content-Type',
       }
      ); 
    
      let options = { headers: headers };
      
      const body =  JSON.stringify({ 
        "Data":  post,  
        "Token":this.kullsrc.token, 
        "Tip":tip, 
      });
    
      var result = await this.http.post<any>(this.semUrl+"/Tanim/KullPozisyonEkle", body, options).toPromise();
    
      var sonuc = JSON.parse(JSON.stringify(result))['Model'];
      return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
    }

    async GetKullPozisyon(Id:number)
    { 
      let url=this.semUrl+"/Tanim/GetKullPozisyon?Id="+Id+"&Token="+ this.kullsrc.token; 
      return await this.http.get<Result<ConnKulPozisyonModel>>(url).pipe( map((res:any)=> res));
    } 

    async KullDepartmanEkle(post:ConnKulDepartmanModel,tip:IslemTipi):Promise<ReturnValues>  {
      const headers = new HttpHeaders(
        {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Headers': 'Content-Type',
       }
      ); 
    
      let options = { headers: headers };
      
      const body =  JSON.stringify({ 
        "Data":  post,  
        "Token":this.kullsrc.token, 
        "Tip":tip, 
      });
    
      var result = await this.http.post<any>(this.semUrl+"/Tanim/KullDepartmanEkle", body, options).toPromise();
    
      var sonuc = JSON.parse(JSON.stringify(result))['Model'];
      return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
    }
    
    async GetKullDepartman(Id:number)
    { 
       let url=this.semUrl+"/Tanim/GetKullDepartman?Id="+Id+"&Token="+ this.kullsrc.token; 
       return await this.http.get<Result<ConnKulDepartmanModel>>(url).pipe( map((res:any)=> res));
    } 


} 

export class ConnKulDepartmanModel {    
  Id:number=0;   
  Tanim:string="";
  
  EkleyenId:number=0; 
  Ekleyen:string="";
  GuncelleyenId:number=0;
  Guncelleyen:string="";
  EkTarih:Date=new Date();
  GuncelTarih:Date=new Date(); 
  Aktif:boolean=false;
}

export enum IslemTipi{
  Ekle = 1,
  Guncelle = 2,
  Sil = 3,
  Eslestirme = 4,
  AktiviteSil = 5,
  FirmaSil = 6,
  BaslikSil = 7,
  KalemSil = 8,
  BelgeSil = 9,
  KalemEkle = 10,
  Iptal = 11,
}

export class ConnKulPozisyonModel {    
  Id:number=0;   
  Tanim:string="";

  EkleyenId:number=0; 
  Ekleyen:string="";
  GuncelleyenId:number=0;
  Guncelleyen:string="";
  EkTarih:Date=new Date();
  GuncelTarih:Date=new Date(); 
  Aktif:boolean=false;
}

export class RaporTasarim {    
  ID:number=0;       
  BASLIK:string="";      
}
export class MailGonderimModel {     
  Musteri:string=""; 
  Satici:string=""; 
}
export class StokGrupModel{
  ItmsGrpCod:number=0; 
  ItmsGrpNam:string="";  
}
export class SistemLog{
  Id:number=0; 
  LogBilgi:string=""; 
  YetkiKodu:string=""; 
  IslemAdi:string="";  
  EmpId:number=0;  
  IslemYapan:string="";  
  IslemTarihi:any;  
}
export class KullaniciBildirimDetayModel{
  DocEntry:number=0;        
  BilgiId:number=0;        
}
export class KullaniciBildirimModel{
  DocEntry:number=0;    
  Tarih:any;  
  Bilgi:string="";  
  SayfaYenile:boolean=false;   
  OturumKapat:boolean=false;   
  TumBirimler:boolean=false;
  BirimId:number=0;   
  Birim:string="";
  Aktif:boolean=false;   
  Ekleyen:number=0; 
  EkleyenAd:string="";
  Guncelleyen:number=0;
  GuncelleyenAd:string="";
  Kayit:Date=new Date();
  Guncelleme:Date=new Date(); 
  BildirimTipId:number=0;
  BildirimEmpId:number=0;  
}
export class OnayAsamaTakip { 
  DocEntry:number=0;
  AsamaId:number=0;
  YetkiId:number=0;
  OnayDurum: string="";  
  Tarih!: Date;  
  OnayTarih!: Date;  
  IslemiYapan:number=0;
  BelgeId:number=0; 
  Anahtar: string=""; 
  Tip: string=""; 
  Sira:number=0; 
  MailGonderildi: string=""; 
  MailGonderimTarih!: Date;  
  Email: string="";
  AdSoyad: string="";
  Onaylayan: string="";
  Bolum:number=0; 
  TalepEden:string="";
  RetAciklama:string="";
}
export class ParaBirim { 
  CurrCode: string="";  
  CurrName: string="";  
 }
export class BelgeModel { 
  Id:number=0;
  EkranId:number=0;
  KayitId:number=0;
  SemKey: string="";  
  BelgeBlob:any;
  BelgeAdi: string="";  
  KayitYapan: string="";  
  SatirGuid: string="";  
  KayitTarih: Date = new Date();  
  Base64Data:string="";
  Indir:boolean=false;
 }
export class Result<T> 
{
  KeyAccept:boolean=false;
  empId:number=0;
  List!: [T];
  Model!: T;
}
export  class MuhasebeHesapModel { 
  Code: number=0;
  AcctCode: string=""; 
  AcctName: string=""; 
  CalismaSekli:string="";
}
export  class WhsModel {
 Id: number=0;
 Name: string="";  
 
 constructor(_id:number,_name:string) {
  this.Id =_id;
  this.Name=_name; 
 }
}  
export  class ReturnValues {
  Id: number=0;
  Success: boolean=false;  
  Message: string="";  
  Token: string="";  
  ValidKey: string="";  

  constructor(_id:number,_succ:boolean,_msg:string,_token:string,_validkey:string) {
 this.Id =_id;
 this.Success=_succ;
 this.Message=_msg;
 this.Token=_token; 
 this.ValidKey=_validkey; 
   }
 }   

 export  class ReturnValuesList<T> {
  Id: number=0;
  Success: boolean=false;  
  Message: string="";  
  Token: string="";
  List!: [T];
  JsonData:string="";

  constructor(_id:number,_succ:boolean,_msg:string,_token:string, data:[T],jsondata:string="") {
 this.Id =_id;
 this.Success=_succ;
 this.Message=_msg;
 this.Token=_token; 
 this.List=data;
 this.JsonData=jsondata;
   }
 }  
 export  class UlkeModel {
  Code: string="";  
  Name: string="";  
 } 

 export  class SehirModel {
  Code: string="";  
  Name: string="";  
 } 

 export  class IlceModel {
  Id: number=0;
  IlId: string="";  
  IlceAdi: string="";  
 } 

 export  class MeslekModel {
  Code: number=0; 
  MeslekAdi: string="";  
 }  
 export enum SistemEkran{
  Genel = 0,
  FinansYonetim = 1,
  IsAvansi = 2, 
  FinansTalep=3,
  Cari=4,
  Ev=5,
  Tahakkuk=6,
  MusteriSicilKarti=7,
  TahsilatEkran=8,
  SenetCash=9,
  SatinAlmaTalep=10,
  TransferTalep=11,
  SozlesmeKick=12,
  BilinmeyenSenetTahsilat=13,
  CrmEkran=14,
  BuEkran=15,
  Fuekran=16,
  Opc=17,
  Conf=18,
  ReConf=19,
  Acente=20,
}

export enum BelgeYukleBirim{
  Sozlesme = 1,  
  Ev = 2,  
  IsAvans = 3,  
  SatinAlma = 4,  
  Tahakkuk = 5,  
  EvHakedis = 6,  
  SozlesmeTalep = 7,  
  SenetTahsilat = 8,  
  Finans = 9,  
  EvHesap = 10,  
  SimKart = 11, 
  BilinmeyenSenet=12, 
  OdemeIade=13, 
  KullaniciTalep=14, 
  CekGiris=15, 
  OnKayit=16, 
  KKGiris=17, 
  SmsGonderim=18, 
  AracZimmet=19, 
  DemirbasZimmet=20, 
}

export enum EkranMesaj
{
  Listele="Veri Listesi Getiriliyor, Lütfen Bekleyiniz...",
  Kaydet="Kayıt İşlemi Başladı, Lütfen Bekleyiniz...",
  Guncelle="Güncelleme İşlemi Başladı, Lütfen Bekleyiniz..",
  Sil="Silme İşlemi Başladı, Lütfen Bekleyiniz...",
  YetkiHata="İşlem Yetkiniz Bulunmamaktadır, Lütfen Yöneticinizle Görünüşünüz",
  KayitTamamlandi="Kayıt İşlemi Tamamlandı",
  SilmeTamamlandi="Silme İşlemi Tamamlandı",
  GuncellemeTamamlandi="Güncelleme İşlemi Tamamlandı",
  RaporHazirlandı="Rapor Hazırlandı",
  VeriIndir="Veriler indiriliyor, Lütfen Bekleyiniz...",
  SiparisIptal="Sipariş Iptal ediliyor, Lütfen Bekleyiniz...",
  SiparisIptalGeriAl="Siparişler Geri alınıyor, Lütfen Bekleyiniz...",
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
    Kullanici: string=""; 
    Sifre: string=""; 
    AndroidId: string=""; 
    Board: string=""; 
    CihazId: string=""; 
    Device: number = 0; 
    UserKey:string=""; 
    CepTel:string="";
  
    constructor(_Kullanici:string,_pass:string,_andr:string,_board:string,_cihazid:string,_devize:number,_userkey:string) {
     this.Kullanici =_Kullanici;
     this.Sifre=_pass;
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

