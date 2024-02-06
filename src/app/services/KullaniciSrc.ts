import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import moment from 'moment';
import { Observable, of, throwError } from 'rxjs';
import { catchError, isEmpty, map } from 'rxjs/operators'; 
import { SehirModel, IlceModel, Result, ReturnValuesList, ReturnValues, StokGrupModel, IslemTipi } from './GenelSrc';

@Injectable({
  providedIn: 'root'
})
export class KullaniciSrcService {
  token = sessionStorage.getItem("Token");
  sirketlist:SirketYetki[]=[];
  tumdepolist: DepoYetki[]=[];
  sehirlist: SehirModel[]=[];    
  ilcelist: IlceModel[]=[];    
  userperm:KullaniciYetki[]=[];
  aktifsirket:string="";
  kullUserId:number=0;
  kullToken:string="";
  aktifsirketadi:string="";
  SistemKilitSure:number=0; 
  loguser:KullaniciModel;
  kulref:KullaniciRef;
  
  constructor( @Inject('semUrl') private semUrl:string,
    private http: HttpClient) {   
      this.kulref=new KullaniciRef();
  } 

  yetkivarmi(yetkikdu:string):boolean {
    return this.userperm.filter((x)=>x.YetkiKodu==yetkikdu)[0]?.Goruntule ?? false;
   }
   

  async GetKullaniciList(empid:number,secimmi:number,webdurum:number=0,keyword:string):Promise<ReturnValuesList<KullaniciModel>>  {
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
     }
    );
  
      let options = { headers: headers };
  
      const body =  JSON.stringify({
        "EmpId":  empid,    
        "Secimmi":  secimmi,       
        "WebDurum":  webdurum,     
        "KeyWord":  keyword,    
        "Token":this.token
      });
  
    var result = await this.http.post<any>(this.semUrl+"/Login/GetKullaniciList", body, options).toPromise();
  
    var sonuc = JSON.parse(JSON.stringify(result)); 
    return new ReturnValuesList( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["List"]);
  }  
  async  KullaniciEkle(kull:KullaniciModel,tip:IslemTipi,Yetki:KullaniciYetki[]):Promise<ReturnValues>  {
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
     }
    ); 

      let options = { headers: headers };

      const body =  JSON.stringify({ 
        "Kull":  kull, 
        "Tip":  tip, 
        "Yetki":  Yetki, 
        "Sirket":  kull.Sirket, 
        "Token":this.token
      });
   
      var result = await this.http.post<any>(this.semUrl+"/Login/KullaniciEkle", body,options).toPromise();

    var sonuc = JSON.parse(JSON.stringify(result))['Model'];
    return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
  }
  async GetDepoYetki(empid:number,subeid:number,yetki:number)
  { 
   let url=this.semUrl+"/Login/GetDepoYetki?EmpId="+empid+"&SubeId="+subeid+"&Yetki="+yetki+"&Token="+ this.token
    return this.http.get<Result<DepoYetki[]>>(url).pipe(map((res: any) => res));
  }
  async GetKullaniciYetki(empid:number,grupid:number,yetkikodu:string="",birimkisit:string,token:string)
  { 
    if(token=="") token=this.token?.toString()??"";
   let url=this.semUrl+"/Login/GetKullaniciYetki?EmpId="+empid+"&GrupId="+ grupid+"&YetkiKodu="+ yetkikodu+"&Token="+ token+"&BirimKisit="+ birimkisit;
    return this.http.get<Result<KullaniciYetki[]>>(url).pipe(map((res: any) => res));
  }
  async YetkiGrupEkle(post:YetkiGrup,tip:IslemTipi):Promise<ReturnValues>  {
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
      "Token":this.token, 
      "Tip":tip, 
    });
  
    var result = await this.http.post<any>(this.semUrl+"/Login/YetkiGrupEkle", body, options).toPromise();
  
    var sonuc = JSON.parse(JSON.stringify(result))['Model'];
    return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
  }  
  async GetYetkiGrup(code:number)
  { 
       let url=this.semUrl+"/Login/GetYetkiGrup?Code="+code+"&Token="+this.token; 
          return await this.http.get<Result<YetkiGrup>>(url).pipe( map((res:any)=> res));
  }
  async GrupYetkiOlustur(post:YetkiGrup,yetki:KullaniciYetki[],tip:IslemTipi):Promise<ReturnValues>  {
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
      "Yetki":  yetki,  
      "Token":this.token, 
      "Tip":tip, 
    });
  
    var result = await this.http.post<any>(this.semUrl+"/Login/GrupYetkiOlustur", body, options).toPromise();
  
    var sonuc = JSON.parse(JSON.stringify(result))['Model'];
    return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
  }
  async GetKullaniciAramaList(arama:string)
  { 
       let url=this.semUrl+"/Login/GetKullaniciAramaList?Arama="+arama+"&Token="+ this.token;
        return await this.http.get<Result<KullaniciModel[]>>(url).pipe( map((res:any)=> res));
  }
  async KullaniciGirisBilgiGuncelle(dbName:string):Promise<ReturnValues>  {
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
     }
    ); 
  
    let options = { headers: headers };
    
    const body =  JSON.stringify({ 
      "dbName":  dbName,     
      "Token":this.token
    });
  
    var result = await this.http.post<any>(this.semUrl+"/Login/KullaniciGirisBilgiGuncelle", body, options).toPromise();
  
    var sonuc = JSON.parse(JSON.stringify(result))['Model'];
    return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
  }
  async  KullaniciSil(kull:KullaniciModel):Promise<ReturnValues>  {
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
     }
    ); 

      let options = { headers: headers };

      const body =  JSON.stringify({ 
        "Kull":  kull, 
        "Token":this.token
      });
   
      var result = await this.http.post<any>(this.semUrl+"/Login/KullaniciSil", body,options).toPromise();

    var sonuc = JSON.parse(JSON.stringify(result))['Model'];
    return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
  }  
  async KullaniciAyarGuncelle(vekilid:number,izintarih:any,izindurum:number):Promise<ReturnValues>  {
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
     }
    ); 
  
    let options = { headers: headers };
    
    const body =  JSON.stringify({  
      "VekilEmpId":  vekilid,    
      "IzinBitisTarih":  izintarih,   
      "IzinDurum":izindurum, 
      "Token":this.token
    });
  
    var result = await this.http.post<any>(this.semUrl+"/Login/KullaniciAyarGuncelle", body, options).toPromise();
  
    var sonuc = JSON.parse(JSON.stringify(result))['Model'];
    return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
  }
  async GetSirketList()
  { 
  let url=this.semUrl+"/Login/GetSirketList?Token="+ this.token;
    return this.http.get<Result<SapSirket>>(url).pipe(map((res: any) => res));
  } 
  async GetOnaySurecDigerList(empid:number)
  { 
       let url=this.semUrl+"/Login/GetOnaySurecDigerList?EmpId="+empid+"&Token="+ this.token; 
        return await this.http.get<Result<OnayHesapModel[]>>(url).pipe( map((res:any)=> res));
  } 
  async GetOnaySurecKullaniciList(empid:number)
  { 
       let url=this.semUrl+"/Login/GetOnaySurecKullaniciList?EmpId="+empid+"&Token="+ this.token; 
        return await this.http.get<Result<OnayHesapModel[]>>(url).pipe( map((res:any)=> res));
  } 
  async GetDepartman()
  { 
   let url=this.semUrl+"/Login/GetDepartman?Token="+ this.token
    return this.http.get<Result<OnayHesapModel[]>>(url).pipe(map((res: any) => res));
  } 
  async GetPozisyon()
  { 
   let url=this.semUrl+"/Login/GetPozisyon?Token="+ this.token
    return this.http.get<Result<OnayHesapModel[]>>(url).pipe(map((res: any) => res));
  }
  async GetKullaniciDetay(EmpId:number)
  { 
       let url=this.semUrl+"/Login/GetKullaniciDetay?EmpId="+EmpId+"&Token="+ this.token; 
        return await this.http.get<Result<OnayHesapModel[]>>(url).pipe( map((res:any)=> res));
  }
  async KullaniciDepoYetkiEkle(Kull:KullaniciModel,List:DepoModel[],Yetki:DepoYetkiModel[],SapSirket:string,Tip:IslemTipi):Promise<ReturnValues>  {
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
     }
    ); 
  
    let options = { headers: headers };
    
    const body =  JSON.stringify({  
      "Kull":  Kull,    
      "List":  List,   
      "Yetki":  Yetki,   
      "Tip":  Tip,   
      "SapSirket":SapSirket, 
      "Token":this.token
    });
  
    var result = await this.http.post<any>(this.semUrl+"/Login/KullaniciDepoYetkiEkle", body, options).toPromise();
  
    var sonuc = JSON.parse(JSON.stringify(result))['Model'];
    return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
  }
  async GetKullaniciDepoYetki(EmpId:number)
  { 
       let url=this.semUrl+"/Login/GetKullaniciDepoYetki?EmpId="+EmpId+"&Token="+ this.token; 
        return await this.http.get<Result<ConDepoYetki[]>>(url).pipe( map((res:any)=> res)); 
  }
  async KullaniciMuhatapYetkiEkle(Kull:KullaniciModel,List:MuhatapModel[],SapSirket:string):Promise<ReturnValues>  {
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
     }
    ); 
  
    let options = { headers: headers };
    
    const body =  JSON.stringify({  
      "Kull":  Kull,    
      "List":  List,   
      "SapSirket":SapSirket, 
      "Token":this.token
    });
  
    var result = await this.http.post<any>(this.semUrl+"/Login/KullaniciMuhatapYetkiEkle", body, options).toPromise();
  
    var sonuc = JSON.parse(JSON.stringify(result))['Model'];
    return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
  }
  async KullaniciKategoriYetkiEkle(Kull:KullaniciModel,List:StokGrupModel[],Yetki:KategoriYetkiModel[],SapSirket:string,Tip:IslemTipi):Promise<ReturnValues>  {
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
     }
    ); 
  
    let options = { headers: headers };
    
    const body =  JSON.stringify({  
      "Kull":  Kull,    
      "List":  List,   
      "Yetki":  Yetki,   
      "Tip":  Tip,   
      "SapSirket":SapSirket, 
      "Token":this.token
    });
  
    var result = await this.http.post<any>(this.semUrl+"/Login/KullaniciKategoriYetkiEkle", body, options).toPromise();
  
    var sonuc = JSON.parse(JSON.stringify(result))['Model'];
    return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
  }
  async GetKullaniciMuhatapYetki(EmpId:number)
  { 
       let url=this.semUrl+"/Login/GetKullaniciMuhatapYetki?EmpId="+EmpId+"&Token="+ this.token; 
        return await this.http.get<Result<MuhatapYetkiModel[]>>(url).pipe( map((res:any)=> res));
  }
  async GetKullaniciKategoriYetki(EmpId:number)
  { 
       let url=this.semUrl+"/Login/GetKullaniciKategoriYetki?EmpId="+EmpId+"&Token="+ this.token; 
        return await this.http.get<Result<KategoriYetkiModel[]>>(url).pipe( map((res:any)=> res)); 
  }
  async GetDepoList(SapSirket:string)
  { 
       let url=this.semUrl+"/Login/GetDepoList?SapSirket="+SapSirket+"&Token="+ this.token; 
        return await this.http.get<Result<DepoModel[]>>(url).pipe( map((res:any)=> res));
  }
  async GetMuhatapList(SapSirket:string,blockRun:any)
  { 
       let url=this.semUrl+"/Login/GetMuhatapList?SapSirket="+SapSirket+"&Token="+ this.token; 
        return await this.http.get<Result<MuhatapModel[]>>(url).pipe( map((res:any)=> res),         
        catchError(err => {
            blockRun.stop();
            return of([]);
        }));
  }
  async GetSirketYetki()
  { 
  let url=this.semUrl+"/Login/GetSirketYetki?Token="+ this.token;
    return this.http.get<Result<KulSirketYetki>>(url).pipe(map((res: any) => res));
  } 
  async GrupDepoYetkiEkle(Grup:YetkiGrup,List:DepoModel[],Yetki:DepoYetkiModel[],SapSirket:string,Tip:IslemTipi):Promise<ReturnValues>  {
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
     }
    ); 
  
    let options = { headers: headers };
    
    const body =  JSON.stringify({  
      "Grup":  Grup,    
      "List":  List,   
      "Yetki":  Yetki,   
      "SapSirket":SapSirket, 
      "Tip":Tip, 
      "Token":this.token
    });
  
    var result = await this.http.post<any>(this.semUrl+"/Login/GrupDepoYetkiEkle", body, options).toPromise();
  
    var sonuc = JSON.parse(JSON.stringify(result))['Model'];
    return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
  }
  async GetGrupDepoYetki(GrupId:number)
  { 
       let url=this.semUrl+"/Login/GetGrupDepoYetki?GrupId="+GrupId+"&Token="+ this.token; 
        return await this.http.get<Result<DepoYetkiModel[]>>(url).pipe( map((res:any)=> res));
  }
  async GrupKategoriYetkiEkle(Grup:YetkiGrup,List:StokGrupModel[],Yetki:KategoriYetkiModel[],SapSirket:string,Tip:IslemTipi):Promise<ReturnValues>  {
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
     }
    ); 
  
    let options = { headers: headers };
    
    const body =  JSON.stringify({  
      "Grup":  Grup,    
      "List":  List,   
      "Yetki":  Yetki,   
      "SapSirket":SapSirket, 
      "Tip":Tip, 
      "Token":this.token
    });
  
    var result = await this.http.post<any>(this.semUrl+"/Login/GrupKategoriYetkiEkle", body, options).toPromise();
  
    var sonuc = JSON.parse(JSON.stringify(result))['Model'];
    return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
  }
  async GetGrupKategoriYetki(GrupId:number)
  { 
       let url=this.semUrl+"/Login/GetGrupKategoriYetki?GrupId="+GrupId+"&Token="+ this.token; 
        return await this.http.get<Result<KategoriYetkiModel[]>>(url).pipe( map((res:any)=> res));
  }
  async  KullaniciSifreGonder(List:KullaniciModel[]):Promise<ReturnValues>  {
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
     }
    ); 

      let options = { headers: headers };

      const body =  JSON.stringify({ 
        "List":  List, 
        "Token":this.token
      });
   
      var result = await this.http.post<any>(this.semUrl+"/Login/KullaniciSifreGonder", body,options).toPromise();

    var sonuc = JSON.parse(JSON.stringify(result))['Model'];
    return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
  }  
  async KullaniciSifreGuncelle(GuncelSifre:string,YeniSifre:string,YeniSifreTekrar:string):Promise<ReturnValues>  {
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
     }
    ); 
  
    let options = { headers: headers };
    
    const body =  JSON.stringify({  
      "GuncelSifre":  GuncelSifre,    
      "YeniSifre":  YeniSifre,   
      "YeniSifreTekrar":YeniSifreTekrar, 
      "Token":this.token
    });
  
    var result = await this.http.post<any>(this.semUrl+"/Login/KullaniciSifreGuncelle", body, options).toPromise();
  
    var sonuc = JSON.parse(JSON.stringify(result))['Model'];
    return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
  }
  async  TopluSifreSifirla(List:KullaniciModel[],MailGonder:boolean):Promise<ReturnValues>  {
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
     }
    ); 

      let options = { headers: headers };

      const body =  JSON.stringify({ 
        "List":  List, 
        "MailGonder":  MailGonder, 
        "Token":this.token
      });
   
      var result = await this.http.post<any>(this.semUrl+"/Login/TopluSifreSifirla", body,options).toPromise();

    var sonuc = JSON.parse(JSON.stringify(result))['Model'];
    return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
  }  
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
 
export class KullaniciRef {
  Yeni: boolean=false;
  Data: KullaniciModel;
}
export class KategoriYetkiModel{ 
  Id:number=0; 
  EmpId:number=0; 
  GrupId:number=0; 
  SapSirket:string="";   
  Kategori:string="";     
  KategoriAdi:string="";     
  YetkiTipi:number=0; 
}
export class KulSirketYetki{    
  dbName:string="";     
  cmpName:string="";     
}
export class ConDepoYetki{ 
  DepoKodu:string="";     
  DepoAdi:string="";     
}
export class DepoYetkiModel{ 
  Id:number=0; 
  EmpId:number=0; 
  GrupId:number=0; 
  SapSirket:string="";   
  DepoKodu:string="";     
  DepoAdi:string="";  
  YetkiTipi:number=0;    
}
export class MuhatapYetkiModel {
  Id:number=0; 
  EmpId:number=0; 
  SapSirket:string="";   
  MuhatapKodu:string="";     
  MuhatapAdi:string="";   
}
export class MuhatapModel{ 
  dbName:string="";   
  cmpName:string="";     
}
export class DepoModel{ 
  dbName:string="";   
  cmpName:string="";     
}
export class SapSirket{ 
  dbName:string="";   
  cmpName:string="";     
}
export  class MolaTipModel { 
  DocEntry: number=0;   
  SorumluBirimId: number=0;  
  Adi: string="";  
} 

export class NtxSantralKuyrukModel{
  SatirGuid:string="";   
  EmpId:number=0; 
  Adi:string="";   
  KuyrukAdi:string="";   
  Durum:number=0;  
  DurumStr:string="";   
  Parametre:string="";   
  Parametre2:string="";   
  ApiKey:string="";  
  Secim:boolean=false; 
}

export class NtxSantralDisHatModel{
  rulesId:string="";  
  rulesname:string="";   
  tenant:string="";
}

export class NtxSantralDahiliModel{
  dahilino:string="";  
  dahiliadi:string="";  
  dahilipass:string="";  
  dahilisube:string="";  
  username:string="";  
  Kullanimda:number=0;  
  EmpId:number=0;  
  KullaniciAdi:string="";   
}


export class NtxSantralSubeModel{
  tenant_code:string="";  
  tenant_title:string="";  
  tenant_apikey:string="";  
}

export  class UlkeDialModel { 
  name: string="";   
  dial: string="";  
  code: string="";  
  mask: string="";   
} 

export class SantralAramaNoModel{ 
  Kod:string="";
  Numara:string="";
  Adi:string="";
}


export class SirketBirim{
  DocEntry: number = 0; 
  Birim:string="";
  Devir:string="";
}

export class TcknModel
{
  EkipId:number=0; 
  Tckn:string="";  
  Adi:string="";  
  Soyadi:string="";  
  DogumTarih:Date=new Date();   
  TcknDogrula:number=0;
}

export class TcknCheck
{
  EkipId:number=0; 
  Adi:string="";  
  Soyadi:string="";  
  Tckn:string="";  
  DogumTarih:Date=new Date(); 
  TcknDogrula:number=0; 
}

export class BankaYetki {   
  Code:number=0;  
  EmpId:number=0;  
  Banka:string="";  
  BankaHesap:string="";  
  KebirHesap:string="";  
  Sube:number=0;  
  SubeAdi:string="";  
  ParaBirim:string="";  
  Aktif:boolean=false;
  Ekleyen:number=0; 
  EkleyenAd:string="";
  Guncelleyen:number=0;
  GuncelleyenAd:string="";
  Kayit:Date=new Date();
  Guncelleme:Date=new Date();
  Goruntule:boolean=false;
  Ekle:boolean=false;
  Sil:boolean=false;
  Guncelle:boolean=false;
  Export:boolean=false;
}

export class KasaYetki {   
  Code:number=0;  
  EmpId:number=0;  
  KasaKodu:string="";  
  KasaAdi:string="";  
  Bolge:number=0;  
  BolgeStr:string="";  
  Aktif:boolean=false;
  Ekleyen:number=0; 
  EkleyenAd:string="";
  Guncelleyen:number=0;
  GuncelleyenAd:string="";
  Kayit:Date=new Date();
  Guncelleme:Date=new Date();
  Goruntule:boolean=false;
  Ekle:boolean=false;
  Sil:boolean=false;
  Guncelle:boolean=false;
  Export:boolean=false;
  KasaTipi:string="";
}

export class YetkiGrup {   
  Id:number=0;  
  GrupAdi:string="";  
  Aktif:boolean=false;
  EkleyenId:number=0; 
  Ekleyen:string="";
  GuncelleyenId:number=0;
  Guncelleyen:string="";
  Kayit:Date=new Date();
  Guncelleme:Date=new Date();
}

export  class KullaniciYetki { 
  Id:number=0;
  YetkiKodu: string="";  
  Bolum:string="";
  Modul: string="";  
  Yetki: string="";  
  AramaKey: string="";  
  Goruntule:boolean=false;
  Ekle:boolean=false;
  Sil:boolean=false;
  Guncelle:boolean=false;
  Export:boolean=false;
} 

export  class DepoYetki { 
  DepoKodu: string="";  
  DepoAdi: string="";  
  Sube:string=""; 
  AnaDepo:string=""; 
  SubeId:number=0; 
  Yetki:number=0;
} 
export  class AcenteYetki {
  Code: number=0;
  Adi: string="";  
  CalismaSekliStr: string="";  
  BolgeStr:string=""; 
  Parametre:string=""; 
  Yetki:number=0;
  ManuelSozlesme:number=0;
  SatistaGoster:boolean=false;
 } 

export  class SirketYetki {
  Id: number=0;
  Adi: string="";  
  Yetki:number=0;
  Tipi:number=0;
  VergiNo: string="";  
  MusteriKodu: string="";  
  SaticiKodu: string="";  
  SubeHesap393: string="";  
  ElektraHotelId: string="";   
} 

export class KullaniciModel {
  Id: number=0;
  Admin:boolean=false; 
  AdSoyad: string="";
  KullaniciAdi: string="";
  Sifre: string="";
  Email: string="";  
  Aktif: boolean=false;  
  Telefon: string="";
  GrupYetkiId:number=0;
  GrupYetki:string="";  
  KullaniciYetki:KullaniciYetki[]=[];
  DefaultSirket:number=0;
  Sirket: string[]=[]; 
  AktifSirket:string="";
  KullaniciIzinli:number=0;
  IzinBitisTarih:any;
  YoneticiId:number=0;
  Yonetici:string="";
  PozisyonId:number=0;
  Pozisyon:string="";
  DepartmanId:number=0;
  Departman:string="";
  VekilEmpId:number=0;
  VekilKullanici:string="";
  KullaniciTipId:number=0;
  KullaniciTip:string="";
  FirmaKodu:string="";
  FirmaAdi:string="";
  TeslimatAdresKodu:string="";
  MalzemeGoruntulemeYetki:number=0;
  MalzemeSablonId:number=0;
  MalzemeSablon:string="";
  SiparisKilit: boolean=false;  
  TeslimatTipId:number=0;
  TeslimatTip:string="";
  TeslimatGun: number[]=[];   
  TeslimAdresDogru:number=0;
  SevkAdresTanimli:number=0;
  SevkGunTanimli:string="";
 }

 export  class OnayHesapModel {
  Id: number=0;
  Name: string="";  
  Ek1: string="";  
  Ek2: string="";  
  Ek3: number=0;
  Secili:boolean=false;
  IkId:number=0;
  MuhasebeKod: string="";  
  MuhasebeAdi: string="";  
  constructor(_id:number,_name:string) {
   this.Id =_id;
   this.Name=_name; 
  }
 } 

 export  class Departman {
  Id: number=0;
  Adi: string="";   
 }
 
 export  class SantralYetkiliModel {
  cus_id: string=""; 
  description: string="";   
 }

 export  class SantralGrupModel {
  cp_group: string="";   
  description: string="";   
 }

 export  class SanralNumaraModel {
  idx: number=0;  
  did: string="";   
  dclid: string="";   
  description: string="";   
 }

 export class FiltreAramaModel {
  constructor(id:number,alan:string,dbalan:string,deger:string) {
    this.Id=id;
    this.DbAlan=dbalan;
    this.Alan=alan;
    this.Deger=deger;
  }
  Id: number=0;
  DbAlan: string="";
  Alan: string="";
  Deger: string="";
 }

export class FilterMod {
  constructor(bastarih:any,bittarih:any) { 
    this.Baslangic=moment(bastarih).format("yyyy-MM-DD");
    this.Bitis=moment(bittarih).format("yyyy-MM-DD");
  }
  Baslangic:any;
  Bitis:any;
}

export class GrafikData {
  name:string="";
  value:number=0;
}