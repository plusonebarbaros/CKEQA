import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { IslemTipi, Result, ReturnValues, ReturnValuesList } from './GenelSrc';
import { KullaniciSrcService } from './KullaniciSrc';

@Injectable({
  providedIn: 'root'
})
export class SiparisService { 

  constructor(
    @Inject('semUrl') private semUrl:string,
    private http: HttpClient,
    private kullsrc:KullaniciSrcService
  ) { }


 async SiparisStokKontrol(formdata:FormData):Promise<ReturnValuesList<SiparisAktarimModel>>  {
  const headers = new HttpHeaders(); 
  let options = { headers: headers }; 

  formdata.append('token', this.kullsrc.token+"" );

  var result = await this.http.post<any>(this.semUrl+"/Siparis/SiparisKontrol", formdata,options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result));
  return new ReturnValuesList( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["List"]);
} 

async SiparisOlustur(List:SiparisAktarimModel[],CariKodu:string,SipTipId:number,SipTurId:number,SiparisTarih:any,SiparisNo:string,PlasiyerKod:string,DepoKodu:number,IthalatTip:number):Promise<ReturnValues>  {
  const headers = new HttpHeaders(
    {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Headers': 'Content-Type'}); 

  let options = { headers: headers };    
  const body =  JSON.stringify({ 
    "List":  List,  
    "CariKodu":  CariKodu,  
    "SipTipId":  SipTipId,   
    "SipTurId":  SipTurId,   
    "SiparisTarih":  SiparisTarih,   
    "SiparisNo":  SiparisNo,   
    "PlasiyerKod":  PlasiyerKod,   
    "DepoKodu":  DepoKodu,   
    "IthalatTip":  IthalatTip,   
    "Token":this.kullsrc.token
  });

  var result = await this.http.post<any>(this.semUrl+"/Siparis/SiparisOlustur", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result));
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}

async GetPlasiyerList():Promise<ReturnValuesList<PlasiyerModel>>  {
  const headers = new HttpHeaders(
    {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Headers': 'Content-Type' }); 

   let options = { headers: headers }; 
   const body =  JSON.stringify({ 
     "Token":this.kullsrc.token, 
   });

 var result = await this.http.post<any>(this.semUrl+"/Siparis/GetPlasiyerList", body, options).toPromise(); 
 var sonuc = JSON.parse(JSON.stringify(result));  
 return new ReturnValuesList( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["List"]);
}

async GetSonBelgeNo(SiparisTip:number)
{ 
  let url=this.semUrl+"/Siparis/GetSonBelgeNo?Token="+ this.kullsrc.token + "&SiparisTip="+ SiparisTip; 
  return await this.http.get<Result<string>>(url).pipe( map((res:any)=> res));
}

async GetDepoList():Promise<ReturnValuesList<NtsDepoModel>>  {
  const headers = new HttpHeaders(
    {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Headers': 'Content-Type' }); 

   let options = { headers: headers }; 
   const body =  JSON.stringify({ 
     "Token":this.kullsrc.token, 
   });

 var result = await this.http.post<any>(this.semUrl+"/Siparis/GetDepoList", body, options).toPromise(); 
 var sonuc = JSON.parse(JSON.stringify(result));  
 return new ReturnValuesList( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["List"]);
}

async GetIhracatTeslimTipList():Promise<ReturnValuesList<IhracatTasimaTip>>  {
  const headers = new HttpHeaders(
    {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Headers': 'Content-Type' }); 

   let options = { headers: headers }; 
   const body =  JSON.stringify({ 
     "Token":this.kullsrc.token, 
   });

 var result = await this.http.post<any>(this.semUrl+"/Siparis/GetIhracatTeslimTipList", body, options).toPromise(); 
 var sonuc = JSON.parse(JSON.stringify(result));  
 return new ReturnValuesList( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["List"]);
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

  var result = await this.http.post<any>(this.semUrl+"/Siparis/CariList", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result)); 

  return new ReturnValuesList( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["List"]);
}

async SaticiSipKontrol(formdata:FormData):Promise<ReturnValuesList<SaticiSipKontrolModel>>  {
  const headers = new HttpHeaders(); 
  let options = { headers: headers }; 

  formdata.append('token', this.kullsrc.token+"" );

  var result = await this.http.post<any>(this.semUrl+"/Siparis/SaticiSipKontrol", formdata,options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result));
  return new ReturnValuesList( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["List"]);
} 

async IrsaliyeOlustur(List:SaticiSipKontrolModel[],CariKodu:string,SiparisTarih:any,SiparisNo:string,PlasiyerKod:string,DepoKodu:number,IthalatTip:number,SipTurId:number):Promise<ReturnValues>  {
  const headers = new HttpHeaders(
    {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Headers': 'Content-Type'}); 

  let options = { headers: headers };    
  const body =  JSON.stringify({ 
    "List":  List,  
    "CariKodu":  CariKodu,    
    "SiparisTarih":  SiparisTarih,   
    "SiparisNo":  SiparisNo,
    "PlasiyerKod":  PlasiyerKod,   
    "DepoKodu":  DepoKodu,   
    "IthalatTip":  IthalatTip,   
    "SipTurId":  SipTurId,
    "Token":this.kullsrc.token
  });

  var result = await this.http.post<any>(this.semUrl+"/Siparis/IrsaliyeOlustur", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result));
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}


}

export  class SaticiSipKontrolModel {
  SIPARIS_NO: string="";  
  STOK_KODU: string="";  
  STOK_ADI: string="";  
  MIKTAR: number=0;
  SIP_FIYAT: number=0;
  FAT_FIYAT: number=0;
  semkey: string="";  
  FARKLI: boolean=false;  
  KUTU_NO: string="";  
  TOPLAM_SIP: number=0;
  TOPLAM_FAT: number=0;
  StokKartNetsisteVar:boolean=false;
  DOVIZTIP: number=0;
  SIPKONT: number=0;
} 

export  class IhracatTasimaTip {
  Id: number=0;
  Code: string="";  
  Name: string="";  
  ErpId: number=0;
}  

export  class NtsDepoModel {
  DEPO_KODU: number=0;
  DEPO_ISMI: string="";  
} 

export  class PlasiyerModel {
  PLASIYER_KODU: string="";  
  PLASIYER_ADI: string="";  
} 

export  class SiparisAktarimModel {
  STOK_KODU: string="";  
  STOK_ADI: string="";  
  MIKTAR: number=0;
  FIYAT: number=0;
  TOPLAM: number=0;
  DOVIZTIP: number=0;
  SIPARISNO: string="";  
  semkey: string="";  
  StokKartNetsisteVar:boolean=false;
} 

export class Customer { 
  CARI_KOD: string="";
  CARI_ISIM: string="";
  CARI_TIP: string="";  
} 

