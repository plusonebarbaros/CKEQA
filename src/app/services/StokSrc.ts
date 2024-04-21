import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { IslemTipi, Result, ReturnValues, ReturnValuesList } from './GenelSrc';
import { KullaniciSrcService } from './KullaniciSrc';

@Injectable({
  providedIn: 'root'
})
export class StokService { 

  constructor(
    @Inject('semUrl') private semUrl:string,
    private http: HttpClient,
    private kullsrc:KullaniciSrcService
  ) { }

  async GetStokList(KeyWord:string):Promise<ReturnValuesList<StokModel>>  {
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type' }); 
 
     let options = { headers: headers }; 
     const body =  JSON.stringify({ 
       "KeyWord":KeyWord, 
       "Token":this.kullsrc.token, 
     });
 
   var result = await this.http.post<any>(this.semUrl+"/Stok/GetStokList", body, options).toPromise(); 
   var sonuc = JSON.parse(JSON.stringify(result));  
   return new ReturnValuesList( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["List"]);
 }

 async StokDuzenle(Data:StokModel):Promise<ReturnValues>  {
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type'}); 
  
    let options = { headers: headers };    
    const body =  JSON.stringify({ 
      "Data":  Data,  
      "Token":this.kullsrc.token
    });
  
    var result = await this.http.post<any>(this.semUrl+"/Stok/StokDuzenle", body, options).toPromise();
  
    var sonuc = JSON.parse(JSON.stringify(result));
    return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
  }

  async GetStokHareket(STOK_KODU:string):Promise<ReturnValuesList<StokHareketModel>>  {
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type' }); 
 
     let options = { headers: headers }; 
     const body =  JSON.stringify({ 
       "STOK_KODU":STOK_KODU, 
       "Token":this.kullsrc.token, 
     });
 
   var result = await this.http.post<any>(this.semUrl+"/Stok/GetStokHareket", body, options).toPromise(); 
   var sonuc = JSON.parse(JSON.stringify(result));  
   return new ReturnValuesList( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["List"]);
 }

 async GetStokHatalar():Promise<ReturnValuesList<StokHataModel>>  {
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type' }); 
 
     let options = { headers: headers }; 
     const body =  JSON.stringify({ 
       "Token":this.kullsrc.token, 
     });
 
   var result = await this.http.post<any>(this.semUrl+"/Stok/GetStokHatalar", body, options).toPromise(); 
   var sonuc = JSON.parse(JSON.stringify(result));  
   return new ReturnValuesList( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["List"]);
 }

 async StokRafKontrol(formdata:FormData):Promise<ReturnValuesList<StokRafModel>>  {
  const headers = new HttpHeaders(); 
  let options = { headers: headers }; 

  formdata.append('token', this.kullsrc.token+"" );

  var result = await this.http.post<any>(this.semUrl+"/Stok/StokRafKontrol", formdata,options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result));
  return new ReturnValuesList( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["List"]);
} 

async GetHucreBakiye(STOK_KODU:string):Promise<ReturnValuesList<HucreBakiyeModel>>  {
  const headers = new HttpHeaders(
    {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Headers': 'Content-Type' }); 

   let options = { headers: headers }; 
   const body =  JSON.stringify({ 
     "STOK_KODU":STOK_KODU, 
     "Token":this.kullsrc.token, 
   });

 var result = await this.http.post<any>(this.semUrl+"/Stok/GetHucreBakiye", body, options).toPromise(); 
 var sonuc = JSON.parse(JSON.stringify(result));  
 return new ReturnValuesList( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["List"]);
}



}


export  class HucreBakiyeModel {
  DEPO_KODU: number=0;
  DEPO_ISMI: string="";  
  STOK_KODU: string="";  
  STOK_ADI: string="";  
  HUCREKODU: string="";  
  BAKIYE: number=0;
  SERI_TAKIBI: string="";  
  semkey: string="";  
} 


export  class StokRafModel {
  STOK_KODU: string="";  
  STOK_ADI: string="";  
  RAF: string="";  
  semkey: string="";  
  MIKTAR: number=0;
  BAKIYE: number=0;
  FIYAT: number=0;
} 

export  class StokHataModel {
    STOK_KODU: string="";  
    STOK_ADI: string="";  
    URETICI_KODU: string="";  
    BARKOD1: string="";  
    BARKOD2: string="";  
    BARKOD3: string="";  
    semkey: string="";  
 } 

export  class StokHareketModel {
    TUR: string="";  
    STHAR_TARIH: any; 
    FISNO: string="";  
    KOD_4: string="";  
    CARKOD: string="";  
    CARI_ISIM: string="";  
    STOK_KODU: string="";  
    STOK_aDI: string="";  
    MIKTAR: number=0;
    FIYAT: number=0;
    TUTAR: number=0;
    STHAR_DOVFIAT: number=0;
    semkey: string="";  
    STHAR_GCKOD: string="";  
 } 

export class StokModel {    
    SUBE_KODU:number=0; 
    STOK_KODU:string=""; 
    STOK_ADI:string=""; 
    GRUP_KODU:string=""; 
    KOD_1:string=""; 
    KOD_2:string=""; 
    KOD_3:string=""; 
    KOD_4:string=""; 
    KOD_5:string=""; 
    PAY_1:number=0; 
    PAYDA_1:number=0; 
    BARKOD1:string=""; 
    BARKOD2:string=""; 
    BARKOD3:string=""; 
    URETICI_KODU:string=""; 
    INGILIZCE_ADI:string=""; 
    MENSEI:string=""; 
    KDV_ORANI:number=0; 
    RAF:string=""; 
    DEPOSTOK_1:number=0; 
    DEPOSTOK_5:number=0; 
    DEPOSTOK_51:number=0; 
    FIYAT1:number=0; 
} 