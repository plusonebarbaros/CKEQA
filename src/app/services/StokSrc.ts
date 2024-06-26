import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import moment from 'moment';
import { map } from 'rxjs/operators';
import { IslemTipi, Result, ReturnValues, ReturnValuesList } from './GenelSrc';
import { KullaniciSrcService } from './KullaniciSrc';
import { ItemsFile } from './SatinAlmaSrc';

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

async  FireTuketim(Satir:FireYonetimModel[],Aciklama:string,Tip:IslemTipi):Promise<ReturnValues>  {
  const headers = new HttpHeaders(
    {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Headers': 'Content-Type',
   }
  ); 

    let options = { headers: headers };

    const body =  JSON.stringify({ 
      "Satir":  Satir,
      "Tip":  Tip,
      "Aciklama":  Aciklama,
      "Token":this.kullsrc.token
    });
 
    var result = await this.http.post<any>(this.semUrl+"/Stok/FireTuketim", body,options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
 } 

 async GetFireList(Id:number,baslangic:Date,bitis:Date)
  { 
       let url=this.semUrl+"/Stok/GetFireList?Id=" + Id +"&Token="+ this.kullsrc.token +"&Baslangic="+moment(baslangic).format("yyyy-MM-DD")+"&Bitis="+moment(bitis).format("yyyy-MM-DD"); 
        return await this.http.get<Result<FireYonetimModel[]>>(url).pipe( map((res:any)=> res));
  }

  async  DepoSayim(Data:SayimModel | undefined,List:SayimModel[],Aciklama:string,Tip:IslemTipi):Promise<ReturnValues>  {
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
     }); 
      let options = { headers: headers };
  
      const body =  JSON.stringify({ 
        "Data":  Data,
        "List":  List,
        "Tip":  Tip,
        "Aciklama":  Aciklama,
        "Token":this.kullsrc.token
      });
   
    var result = await this.http.post<any>(this.semUrl+"/Stok/DepoSayim", body,options).toPromise();
  
    var sonuc = JSON.parse(JSON.stringify(result))['Model'];
    return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
   } 

   async GetDepoSayim(Id:number,baslangic:Date,bitis:Date)
   { 
        let url=this.semUrl+"/Stok/GetDepoSayim?Id=" + Id +"&Token="+ this.kullsrc.token +"&Baslangic="+moment(baslangic).format("yyyy-MM-DD")+"&Bitis="+moment(bitis).format("yyyy-MM-DD"); 
         return await this.http.get<Result<SayimModel[]>>(url).pipe( map((res:any)=> res));
   }

}

export  class SayimTipModel {
  Id: number=1;
  Tip: string="";  
}

export  class SayimModel {
  Id: number=0;
  SayimTarih: any;  
  OnayId: number=0;
  DepoKodu: string="";  
  DepoAdi: string="";  
  Aciklama: string="";  
  DurumId: number=0;
  Durum: string="";
  SayimTipId: number=0;
  SayimTip: string="";  
  semkey: string=""; 
  validkey: string=""; 
  ErpSirket: string="";
  EkleyenId:number=0; 
  Ekleyen:string="";
  GuncelleyenId:number=0;
  Guncelleyen:string="";
  EkTarih:any; 
  GuncelTarih:any;  
}

export  class FireYonetimModel {
  Id: number=0;
  Tarih: any;  
  StokKodu: string="";  
  StokAdi: string="";    
  Miktar: number=0;
  OnayId: number=0;
  DepoKodu: string="";  
  DepoAdi: string="";  
  Aciklama: string="";  
  DurumId: number=0;
  Durum: string="";
  FireTipId: number=0;
  FireTip: string="";  
  SapBelgeId: number=0;
  semkey: string=""; 
  validkey: string=""; 
  Base64List:ItemsFile[]=[];
  ErpSirket: string="";
  EkleyenId:number=0; 
  Ekleyen:string="";
  GuncelleyenId:number=0;
  Guncelleyen:string="";
  EkTarih:any; 
  GuncelTarih:any;  
  BelgeBase64:string="";
  Files:number=0;
  BelgeAdi:string="";
  BelgeUzanti:string="";
  BirimId:number=0;
  Birim:string="";
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