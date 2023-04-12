import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { isEmpty, map } from 'rxjs/operators'; 
import { IslemTipi } from '../Onay/onay-surev-src.service'; 
import { CariHesapModel } from '../sabitsrc/sabitserv.service';
import { TeklifFirma } from '../talep/talepsrc.service';
import { KullaniciModel, KullaniciSrcService, NtxSantralDisHatModel } from '../kullanici/kullanici-src.service';
import moment from 'moment';

@Injectable({ providedIn: 'root' })
export class GenelApi {
  [x: string]: any;  

 constructor(
   @Inject('semUrl') private semUrl:string,
   private http: HttpClient,
   private kullsrc:KullaniciSrcService
   ) { }
  
  async getWhsList(subeid:number,tumdepo:number)
 { 
  let url=this.semUrl+"/login/GetWhsList?Token="+ this.kullsrc.token+"&Sube="+subeid+"&TumDepo="+tumdepo;
   return await this.http.get<Result<WhsModel[]>>(url).pipe(map((res: any) => res)); ;
  }  
  

  async GetFiyatliStokList(itemcode:string,kacsatir:number,keyword:string,taleptur:string):Promise<ReturnValuesList<Items>>  {
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
        "Token":this.kullsrc.token, 
      });
  
    var result = await this.http.post<any>(this.semUrl+"/Stok/GetFiyatliStokList", body, options).toPromise();
  
    var sonuc = JSON.parse(JSON.stringify(result)); 
  
    return new ReturnValuesList( sonuc.Model["Id"], sonuc.Model["Success"], sonuc.Model["Message"] ?? "", sonuc.Model["Token"] ?? "",sonuc.Model["List"]);
  }
 
  async GetTransferStokList(itemcode:string,depokodu:string,kacsatir:number,keyword:string,subeid:number):Promise<ReturnValuesList<Items>>  {
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
        "DepoKodu":  depokodu,    
        "KacSatir":  kacsatir,    
        "KeyWord":  keyword,    
        "SubeId":  subeid,    
        "Token":this.kullsrc.token, 
      });
  
    var result = await this.http.post<any>(this.semUrl+"/Stok/GetTransferStokList", body, options).toPromise();
  
    var sonuc = JSON.parse(JSON.stringify(result)); 
  
    return new ReturnValuesList( sonuc.Model["Id"], sonuc.Model["Success"], sonuc.Model["Message"] ?? "", sonuc.Model["Token"] ?? "",sonuc.Model["List"]);
  } 

  async  santralEkle(tip:IslemTipi,baslik:SantralModel):Promise<ReturnValues>  {
   const headers = new HttpHeaders(
  {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Access-Control-Allow-Headers': 'Content-Type',
 }
   ); 
 
  let options = { headers: headers };
 
  const body =  JSON.stringify({ 
  "Santral":  baslik,
  "Tip":  tip,
  "Token":this.kullsrc.token
  });
  
  var result = await this.http.post<any>(this.semUrl+"/Tanim/SantralEkle", body,options).toPromise();
 
   var sonuc = JSON.parse(JSON.stringify(result))['Model'];
   return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
  } 
  
 async GetSantralList(santralid:number)
 { 
   let url=this.semUrl+"/Tanim/GetSantralList?Docentry="+santralid+"&Token="+ this.kullsrc.token; 
  return await this.http.get<Result<SantralModel[]>>(url).pipe( map((res:any)=> res));
 }

 async  TesisEkle(tip:IslemTipi,baslik:TesisModel):Promise<ReturnValues>  {
   const headers = new HttpHeaders(
  {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Access-Control-Allow-Headers': 'Content-Type',
 }
   ); 
 
  let options = { headers: headers };
 
  const body =  JSON.stringify({ 
  "Data":  baslik,
  "Tip":  tip,
  "Token":this.kullsrc.token
  });
  
  var result = await this.http.post<any>(this.semUrl+"/Tanim/TesisEkle", body,options).toPromise();
 
   var sonuc = JSON.parse(JSON.stringify(result))['Model'];
   return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
  } 
  
 async GetTesisList(tesisid:number)
 { 
   let url=this.semUrl+"/Tanim/GetTesisList?Docentry="+tesisid+"&Token="+ this.kullsrc.token; 
  return await this.http.get<Result<TesisModel[]>>(url).pipe( map((res:any)=> res));
 }

 async  CrmParametreEkle(tip:IslemTipi,baslik:CrmParametreModel):Promise<ReturnValues>  {
   const headers = new HttpHeaders(
  {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Access-Control-Allow-Headers': 'Content-Type',
 }
   ); 
 
  let options = { headers: headers };
 
  const body =  JSON.stringify({ 
  "Data":  baslik,
  "Tip":  tip,
  "Token":this.kullsrc.token
  });
  
  var result = await this.http.post<any>(this.semUrl+"/Tanim/CrmParametreEkle", body,options).toPromise();
 
   var sonuc = JSON.parse(JSON.stringify(result))['Model'];
   return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
  } 
  
 async GetCrmParametreList(tesisid:number)
 { 
   let url=this.semUrl+"/Tanim/GetCrmParametreList?Docentry="+tesisid+"&Token="+ this.kullsrc.token; 
  return await this.http.get<Result<CrmParametreModel[]>>(url).pipe( map((res:any)=> res));
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
 
 async GetMeslekList(meslekid:number,Arama:string)
 { 
   let url=this.semUrl+"/Tanim/GetMeslekList?MeslekId="+meslekid+"&Arama="+ Arama+"&Token="+ this.kullsrc.token; 
  return await this.http.get<Result<MeslekModel[]>>(url).pipe( map((res:any)=> res));
 }

 async UyeMeslekEkle(post:MeslekModel,tip:IslemTipi):Promise<ReturnValues>  {
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

  var result = await this.http.post<any>(this.semUrl+"/Tanim/UyeMeslekEkle", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}

 async  GuzergahEkle(tip:IslemTipi,baslik:GuzergahModel):Promise<ReturnValues>  {
   const headers = new HttpHeaders(
  {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Access-Control-Allow-Headers': 'Content-Type',
 }
   ); 
 
  let options = { headers: headers };
 
  const body =  JSON.stringify({ 
  "Guzergah":  baslik,
  "Tip":  tip,
  "Token":this.kullsrc.token
  });
  
  var result = await this.http.post<any>(this.semUrl+"/Tanim/GuzergahEkle", body,options).toPromise();
 
   var sonuc = JSON.parse(JSON.stringify(result))['Model'];
   return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
  } 

  async GetGuzergahList(id:number)
 { 
   let url=this.semUrl+"/Tanim/GetGuzergahList?Id="+id+"&Token="+ this.kullsrc.token; 
  return await this.http.get<Result<GuzergahModel[]>>(url).pipe( map((res:any)=> res));
 }

 async  AileGelisBilgiEkle(tip:IslemTipi,baslik:AileGelisModel):Promise<ReturnValues>  {
   const headers = new HttpHeaders(
  {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Access-Control-Allow-Headers': 'Content-Type',
 }
   ); 
 
  let options = { headers: headers };
 
  const body =  JSON.stringify({ 
  "Data":  baslik,
  "Tip":  tip,
  "Token":this.kullsrc.token
  });
  
  var result = await this.http.post<any>(this.semUrl+"/Tanim/AileGelisBilgiEkle", body,options).toPromise();
 
   var sonuc = JSON.parse(JSON.stringify(result))['Model'];
   return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
  } 

  async GetAileGelisBilgiList(id:number)
 { 
   let url=this.semUrl+"/Tanim/GetAileGelisBilgiList?Docentry="+id+"&Token="+ this.kullsrc.token; 
  return await this.http.get<Result<AileGelisModel[]>>(url).pipe( map((res:any)=> res));
 }

 async GetServisFirmalar(grup:number)
 { 
   let url=this.semUrl+"/Tanim/GetServisFirmalar?GrupKod="+grup+"&Token="+ this.kullsrc.token; 
  return await this.http.get<Result<Customer[]>>(url).pipe( map((res:any)=> res));
 }

 async  OtobusPlakaEkle(tip:IslemTipi,baslik:PlakaModel):Promise<ReturnValues>  {
   const headers = new HttpHeaders(
  {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Access-Control-Allow-Headers': 'Content-Type',
 }
   ); 
 
  let options = { headers: headers };
 
  const body =  JSON.stringify({ 
  "Data":  baslik,
  "Tip":  tip,
  "Token":this.kullsrc.token
  });
  
  var result = await this.http.post<any>(this.semUrl+"/Tanim/OtobusPlakaEkle", body,options).toPromise();
 
   var sonuc = JSON.parse(JSON.stringify(result))['Model'];
   return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
  } 

 async GetOtobusPlakaList(id:number,firmakodu:string)
 { 
   let url=this.semUrl+"/Tanim/GetOtobusPlakaList?Docentry="+id+"&Firmakodu="+firmakodu+"&Token="+ this.kullsrc.token; 
  return await this.http.get<Result<PlakaModel[]>>(url).pipe( map((res:any)=> res));
 }

 async  OtobusFiyatEkle(tip:IslemTipi,baslik:OtobusFiyatModel):Promise<ReturnValues>  {
   const headers = new HttpHeaders(
  {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Access-Control-Allow-Headers': 'Content-Type',
 }
   ); 
 
  let options = { headers: headers };
 
  const body =  JSON.stringify({ 
  "Data":  baslik,
  "Tip":  tip,
  "Token":this.kullsrc.token
  });
  
  var result = await this.http.post<any>(this.semUrl+"/Tanim/OtobusFiyatEkle", body,options).toPromise();
 
   var sonuc = JSON.parse(JSON.stringify(result))['Model'];
   return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
  } 

 async GetOtobusFiyatList(id:number,firmakodu:string,guzergah:number,yil:number,kapasite:number)
 { 
   let url=this.semUrl+"/Tanim/GetOtobusFiyatList?Docentry="+id+"&Firmakodu="+firmakodu+"&Token="+ this.kullsrc.token+"&Guzergah="+ guzergah+"&Yil="+ yil+"&Kapasite="+ kapasite; 
  return await this.http.get<Result<OtobusFiyatModel[]>>(url).pipe( map((res:any)=> res));
 }

 async  OtobusServisEkle(tip:IslemTipi,baslik:OtobusServisModel):Promise<ReturnValues>  {
   const headers = new HttpHeaders(
  {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Access-Control-Allow-Headers': 'Content-Type',
 }
   ); 
 
  let options = { headers: headers };
 
  const body =  JSON.stringify({ 
  "Data":  baslik,
  "Tip":  tip,
  "Token":this.kullsrc.token
  });
  
  var result = await this.http.post<any>(this.semUrl+"/Tanim/OtobusServisEkle", body,options).toPromise();
 
   var sonuc = JSON.parse(JSON.stringify(result))['Model'];
   return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
  } 

 async GetOtobusServisList(id:number)
 { 
   let url=this.semUrl+"/Tanim/GetOtobusServisList?Docentry="+id+"&Token="+ this.kullsrc.token; 
  return await this.http.get<Result<OtobusServisModel[]>>(url).pipe( map((res:any)=> res));
 }

 async KasaEkle(kasa:HesapModel,islem:number):Promise<ReturnValues>  {
   const headers = new HttpHeaders(
  {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Access-Control-Allow-Headers': 'Content-Type',
 }
   ); 
 
  let options = { headers: headers };
 
  const body =  JSON.stringify({ 
  "Data":  kasa,  
  "Tip":  islem,  
  "Token":this.kullsrc.token, 
  });
 
   var result = await this.http.post<any>(this.semUrl+"/Muhasebe/KasaEkle", body, options).toPromise();
 
   var sonuc = JSON.parse(JSON.stringify(result))['Model'];
   return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
   }
   
   async GetKasaList(id:number,yetki:number,empid:number=0,kasatip:number=0)
   { 
   let url=this.semUrl+"/Muhasebe/GetKasaList?Docentry="+ id +"&Token="+ this.kullsrc.token+"&Yetki="+ yetki+"&KasaTip="+ kasatip+"&EmpId="+ empid; 
  return await this.http.get<Result<HesapModel[]>>(url).pipe( map((res:any)=> res));
   } 

   async GetKasaMuhHesapList(kod:string,arama:string,kisit:boolean,giderhesap:boolean=false,subeid:number=0)
   { 
   let url=this.semUrl+"/Muhasebe/GetKasaMuhHesapList?Kod="+ kod +"&Arama="+ arama+"&HesapKisit="+ kisit +"&GiderHesap="+giderhesap+"&SubeId="+subeid+"&Token="+ this.kullsrc.token; 
 return await this.http.get<Result<MuhasebeHesapModel[]>>(url).pipe( map((res:any)=> res));
   }  

   async AcenteEkle(acente:AcenteModel,islem:number):Promise<ReturnValues>  {
  const headers = new HttpHeaders(
  {
 'Content-Type': 'application/json',
 'Accept': 'application/json',
 'Access-Control-Allow-Headers': 'Content-Type',
   }
  ); 
   
  let options = { headers: headers };
   
  const body =  JSON.stringify({ 
 "Data":  acente,  
 "Tip":  islem,  
 "Token":this.kullsrc.token, 
  });
   
  var result = await this.http.post<any>(this.semUrl+"/Tanim/AcenteEkle", body, options).toPromise();
   
  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
  }
  
  async GetAcenteList(id:number,tip:string)
  { 
  let url=this.semUrl+"/Tanim/GetAcenteList?Docentry="+ id +"&Token="+ this.kullsrc.token+"&AcenteTip="+tip; 
   return await this.http.get<Result<AcenteModel[]>>(url).pipe( map((res:any)=> res));
  } 
  
  async GetParaBirimList(pb:string)
  { 
      let url=this.semUrl+"/Muhasebe/GetParaBirimList?CurrCode="+pb+"&Token="+this.kullsrc.token; 
          return await this.http.get<Result<ParaBirim>>(url).pipe( map((res:any)=> res));
  }

  // async GetPosMuhHesapList(Kod:string)
  // { 
  //     let url=this.semUrl+"/Muhasebe/GetPosMuhHesapList?Kod="+Kod+"&Token="+this.kullsrc.token; 
  //         return await this.http.get<Result<HesapModel>>(url).pipe( map((res:any)=> res));
  // }

  async GetBankaMuhHesapList(Kod:string,yetki:number,subeid:number,kisit:boolean=false)
  { 
      let url=this.semUrl+"/Muhasebe/GetBankaMuhHesapList?Kod="+Kod+"&Token="+this.kullsrc.token+"&Yetki="+yetki+"&SubeId="+subeid+"&Kisit="+kisit; 
          return await this.http.get<Result<HesapModel>>(url).pipe( map((res:any)=> res));
  }

  async GetSanalPosBankaList()
  { 
      let url=this.semUrl+"/Finans/GetSanalPosBankaList?Token="+this.kullsrc.token; 
          return await this.http.get<Result<HesapModel>>(url).pipe( map((res:any)=> res));
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

    var result = await this.http.post<any>(this.semUrl+"/Tanim/BelgeYukle", formdata,options).toPromise();

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

  var result = await this.http.post<any>(this.semUrl+"/Tanim/BelgeList", body, options).toPromise();

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
   
  var result = await this.http.post<any>(this.semUrl+"/Tanim/BelgeSil", body, options).toPromise();
   
  var sonuc = JSON.parse(JSON.stringify(result));
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
  }

  async GetCariArama(arama:string)
{ 
     let url=this.semUrl+"/Cari/GetCariArama?Arama="+arama+"&Token="+this.kullsrc.token; 
        return await this.http.get<Result<Customer>>(url).pipe( map((res:any)=> res));
}

async GetCariAramaV2(Arama:string):Promise<ReturnValuesList<Customer>>  {
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
      "Token":this.kullsrc.token,
    });

  var result = await this.http.post<any>(this.semUrl+"/Cari/GetCariAramaV2", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result));

  return new ReturnValuesList( sonuc.Model["Id"], sonuc.Model["Success"], sonuc.Model["Message"] ?? "", sonuc.Model["Token"] ?? "",sonuc.Model["List"]);
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

async GetCariOdemeYontemList()
{ 
     let url=this.semUrl+"/Cari/GetCariOdemeYontemList?Token="+this.kullsrc.token; 
        return await this.http.get<Result<CariOdemeYontem>>(url).pipe( map((res:any)=> res));
}

async GetCariVarMi(VN:string,ct:string)
{ 
     let url=this.semUrl+"/Cari/GetCariVarMi?VN="+VN+"&CardType="+ct+"&Token="+this.kullsrc.token; 
     return await this.http.get<Result<number>>(url).pipe( map((res:any)=> res));
}

GetTeklifCariList() { 
  let url=this.semUrl+"/Cari/GetTeklifCariList?Token="+ this.kullsrc.token; 

    return this.http.get<Result<TeklifFirma>>(url).pipe( map((res:any)=> res));   
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

 async SistemBilgiTanim(post:SistemModel,tip:IslemTipi):Promise<ReturnValues>  {
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

  var result = await this.http.post<any>(this.semUrl+"/Tanim/SistemBilgiTanim", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}
async GetSistemBilgiTanim(id:number)
{ 
     let url=this.semUrl+"/Tanim/GetSistemBilgiTanim?Docentry="+id+"&Token="+this.kullsrc.token; 
     return await this.http.get<Result<SistemModel>>(url).pipe( map((res:any)=> res));
}

async FuParametreTanim(post:FuParametreModel,tip:IslemTipi):Promise<ReturnValues>  {
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

  var result = await this.http.post<any>(this.semUrl+"/Tanim/FuParametreTanim", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}
async GetFuParametreTanim(id:number)
{ 
     let url=this.semUrl+"/Tanim/GetFuParametreTanim?Docentry="+id+"&Token="+this.kullsrc.token; 
     return await this.http.get<Result<FuParametreModel>>(url).pipe( map((res:any)=> res));
}

async SatisPrimParametreTanim(post:SatisPrimParametreModel,tip:IslemTipi):Promise<ReturnValues>  {
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

  var result = await this.http.post<any>(this.semUrl+"/Tanim/SatisPrimParametreTanim", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}
async GetSatisPrimParametre(id:number)
{ 
     let url=this.semUrl+"/Tanim/GetSatisPrimParametre?Docentry="+id+"&Token="+this.kullsrc.token; 
     return await this.http.get<Result<SatisPrimParametreModel>>(url).pipe( map((res:any)=> res));
}

async SatisPrimGrupTanim(post:SatisPrimGrupModel,tip:IslemTipi):Promise<ReturnValues>  {
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

  var result = await this.http.post<any>(this.semUrl+"/Tanim/SatisPrimGrupTanim", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}
async GetSatisPrimGrup(id:number)
{ 
     let url=this.semUrl+"/Tanim/GetSatisPrimGrup?Docentry="+id+"&Token="+this.kullsrc.token; 
     return await this.http.get<Result<SatisPrimGrupModel>>(url).pipe( map((res:any)=> res));
}

async SatisPrimFirstToTanim(post:SatisPrimFirstToModel,tip:IslemTipi):Promise<ReturnValues>  {
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

  var result = await this.http.post<any>(this.semUrl+"/Tanim/SatisPrimFirstToTanim", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}
async GetSatisPrimFirstTo(id:number)
{ 
     let url=this.semUrl+"/Tanim/GetSatisPrimFirstTo?Docentry="+id+"&Token="+this.kullsrc.token; 
     return await this.http.get<Result<SatisPrimFirstToModel>>(url).pipe( map((res:any)=> res));
}

async SatisPrimBasicParametreTanim(post:SatisPrimBasicParametreModel,tip:IslemTipi):Promise<ReturnValues>  {
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

  var result = await this.http.post<any>(this.semUrl+"/Tanim/SatisPrimBasicParametreTanim", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}
async GetSatisPrimBasicParametre(id:number)
{ 
     let url=this.semUrl+"/Tanim/GetSatisPrimBasicParametre?Docentry="+id+"&Token="+this.kullsrc.token; 
     return await this.http.get<Result<SatisPrimBasicParametreModel>>(url).pipe( map((res:any)=> res));
}

async SatisPrimHesapla(post:SatisPrimHesaplaModel,tip:IslemTipi,iptaltip:number):Promise<ReturnValues>  {
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
    "IptalTip":iptaltip, 
  });

  var result = await this.http.post<any>(this.semUrl+"/Tanim/SatisPrimHesapla", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}
async GetSatisPrimHesap(id:number)
{ 
     let url=this.semUrl+"/Tanim/GetSatisPrimHesap?Docentry="+id+"&Token="+this.kullsrc.token; 
     return await this.http.get<Result<SatisPrimHesaplaModel>>(url).pipe( map((res:any)=> res));
}

async GetSatisPrimOzet(id:number)
{ 
     let url=this.semUrl+"/Tanim/GetSatisPrimOzet?HesaplamaId="+id+"&Token="+this.kullsrc.token; 
     return await this.http.get<Result<PrimOzetModel>>(url).pipe( map((res:any)=> res));
}

async GetSatisPrimLMOzet(id:number)
{ 
     let url=this.semUrl+"/Tanim/GetSatisPrimLMOzet?HesaplamaId="+id+"&Token="+this.kullsrc.token; 
     return await this.http.get<Result<SATISPRIMLM_OZET>>(url).pipe( map((res:any)=> res));
} 

async PrimOzetGuncelle(post:PrimOzetModel):Promise<ReturnValues>  {
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

  var result = await this.http.post<any>(this.semUrl+"/Tanim/PrimOzetGuncelle", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}

async LMPrimOzetGuncelle(post:SATISPRIMLM_OZET):Promise<ReturnValues>  {
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

  var result = await this.http.post<any>(this.semUrl+"/Tanim/LMPrimOzetGuncelle", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}

async GetSatisPriDetay(id:number)
{ 
     let url=this.semUrl+"/Tanim/GetSatisPriDetay?HesaplamaId="+id+"&Token="+this.kullsrc.token; 
     return await this.http.get<Result<VW_SNT_SATISPRIM>>(url).pipe( map((res:any)=> res));
}

async TahsilatPrimGrupTanim(post:TahsilatPrimGrupModel,tip:IslemTipi):Promise<ReturnValues>  {
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

  var result = await this.http.post<any>(this.semUrl+"/Tanim/TahsilatPrimGrupTanim", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}
async GetTahsilatPrimGrup(id:number)
{ 
     let url=this.semUrl+"/Tanim/GetTahsilatPrimGrup?Docentry="+id+"&Token="+this.kullsrc.token; 
     return await this.http.get<Result<TahsilatPrimGrupModel>>(url).pipe( map((res:any)=> res));
}

async TahsilatSpiffPrimGrupTanim(post:TahsilatSpiffPrimGrupModel,tip:IslemTipi):Promise<ReturnValues>  {
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

  var result = await this.http.post<any>(this.semUrl+"/Tanim/TahsilatSpiffPrimGrupTanim", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}
async GetTahsilatSpiffPrimGrup(id:number)
{ 
     let url=this.semUrl+"/Tanim/GetTahsilatSpiffPrimGrup?Docentry="+id+"&Token="+this.kullsrc.token; 
     return await this.http.get<Result<TahsilatSpiffPrimGrupModel>>(url).pipe( map((res:any)=> res));
}

async GetTahsilatSpiffPrimGrupDistinct(id:number)
{ 
     let url=this.semUrl+"/Tanim/GetTahsilatSpiffPrimGrupDistinct?Docentry="+id+"&Token="+this.kullsrc.token; 
     return await this.http.get<Result<TahsilatSpiffPrimGrupModel>>(url).pipe( map((res:any)=> res));
}

async GetTahsilatPrimOzet(id:number)
{ 
     let url=this.semUrl+"/Tanim/GetTahsilatPrimOzet?HesaplamaId="+id+"&Token="+this.kullsrc.token; 
     return await this.http.get<Result<PrimTahsilatOzetModel>>(url).pipe( map((res:any)=> res));
}

async GetTahsilatPrimDetay(id:number)
{ 
     let url=this.semUrl+"/Tanim/GetTahsilatPrimDetay?HesaplamaId="+id+"&Token="+this.kullsrc.token; 
     return await this.http.get<Result<VW_SNT_SATISPRIM>>(url).pipe( map((res:any)=> res));
}

async GetCrmPrimOzet(id:number)
{ 
     let url=this.semUrl+"/Tanim/GetCrmPrimOzet?HesaplamaId="+id+"&Token="+this.kullsrc.token; 
     return await this.http.get<Result<PrimCrmOzetModel>>(url).pipe( map((res:any)=> res));
}

async PrimParametreEkle(post:PrimParametreModel,tip:IslemTipi):Promise<ReturnValues>  {
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

  var result = await this.http.post<any>(this.semUrl+"/Tanim/PrimParametreEkle", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}
async GetPrimParametre(id:number)
{ 
     let url=this.semUrl+"/Tanim/GetPrimParametre?Docentry="+id+"&Token="+this.kullsrc.token; 
     return await this.http.get<Result<PrimParametreModel>>(url).pipe( map((res:any)=> res));
}

async CrmPrimParametreTanim(post:CrmPrimParametreModel,tip:IslemTipi):Promise<ReturnValues>  {
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

  var result = await this.http.post<any>(this.semUrl+"/Tanim/CrmPrimParametreTanim", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}
async GetCrmPrimParametre(id:number)
{ 
     let url=this.semUrl+"/Tanim/GetCrmPrimParametre?Docentry="+id+"&Token="+this.kullsrc.token; 
     return await this.http.get<Result<CrmPrimParametreModel>>(url).pipe( map((res:any)=> res));
}

async CrmPrimParametreDetayTanim(post:CrmPrimParametreDetayModel,tip:IslemTipi):Promise<ReturnValues>  {
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

  var result = await this.http.post<any>(this.semUrl+"/Tanim/CrmPrimParametreDetayTanim", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}
async GetCrmPrimParametreDetay(id:number,primid:number)
{ 
     let url=this.semUrl+"/Tanim/GetCrmPrimParametreDetay?Docentry="+id+"&PrimId="+primid+"&Token="+this.kullsrc.token; 
     return await this.http.get<Result<CrmPrimParametreDetayModel>>(url).pipe( map((res:any)=> res));
}

async FuPrimSpiffEkle(post:FuPrimSpiffModel,tip:IslemTipi):Promise<ReturnValues>  {
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

  var result = await this.http.post<any>(this.semUrl+"/Tanim/FuPrimSpiffEkle", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}
async GetFuPrimSpiff(id:number)
{ 
     let url=this.semUrl+"/Tanim/GetFuPrimSpiff?Docentry="+id+"&Token="+this.kullsrc.token; 
     return await this.http.get<Result<FuPrimSpiffModel>>(url).pipe( map((res:any)=> res));
}

async PdksKartTanim(post:PdksKartModel,tip:IslemTipi):Promise<ReturnValues>  {
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

  var result = await this.http.post<any>(this.semUrl+"/Tanim/PdksKartTanim", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}
async GetPdksKartTanim(id:number)
{ 
     let url=this.semUrl+"/Tanim/GetPdksKartTanim?Docentry="+id+"&Token="+this.kullsrc.token; 
     return await this.http.get<Result<PdksKartModel>>(url).pipe( map((res:any)=> res));
}

async PdksGrupTanim(post:PdksGrupModel,tip:IslemTipi):Promise<ReturnValues>  {
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

  var result = await this.http.post<any>(this.semUrl+"/Tanim/PdksGrupTanim", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}
async GetPdksGrupTanim(id:number)
{ 
     let url=this.semUrl+"/Tanim/GetPdksGrupTanim?Docentry="+id+"&Token="+this.kullsrc.token; 
     return await this.http.get<Result<PdksGrupModel>>(url).pipe( map((res:any)=> res));
}

async BuSpiffGrupTanim(post:BuSpiffGrupModel,tip:IslemTipi):Promise<ReturnValues>  {
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

  var result = await this.http.post<any>(this.semUrl+"/Tanim/BuSpiffGrupTanim", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}

async GetBuSpiffGrupTanim(id:number)
{ 
     let url=this.semUrl+"/Tanim/GetBuSpiffGrupTanim?Docentry="+id+"&Token="+this.kullsrc.token; 
     return await this.http.get<Result<BuSpiffGrupModel>>(url).pipe( map((res:any)=> res));
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

async GetFuPrimOzet(id:number)
{ 
     let url=this.semUrl+"/Tanim/GetFuPrimOzet?HesaplamaId="+id+"&Token="+this.kullsrc.token; 
     return await this.http.get<Result<FuPrimOzet>>(url).pipe( map((res:any)=> res));
}

async GetFuPrimDetay(id:number)
{ 
     let url=this.semUrl+"/Tanim/GetFuPrimDetay?HesaplamaId="+id+"&Token="+this.kullsrc.token; 
     return await this.http.get<Result<FuPrimDetay>>(url).pipe( map((res:any)=> res));
}

async GetPdks2Grup(id:number)
{ 
     let url=this.semUrl+"/Tanim/GetPdks2Grup?Docentry="+id+"&Token="+this.kullsrc.token; 
     return await this.http.get<Result<PdksGrup2>>(url).pipe( map((res:any)=> res));
}

async PdksKartAktarim(formdata:FormData):Promise<ReturnValues>  {
  const headers = new HttpHeaders(); 
  let options = { headers: headers }; 

  formdata.append('token', this.kullsrc.token+"" );

  var result = await this.http.post<any>(this.semUrl+"/Tanim/PdksKartAktarim", formdata,options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result));
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

async GetKuralHesapList()
   { 
   let url=this.semUrl+"/Muhasebe/GetKuralHesapList?Token="+ this.kullsrc.token; 
 return await this.http.get<Result<HesapModel[]>>(url).pipe( map((res:any)=> res));
   } 

   async GetKrediKartPoslar(poskodu:number,tumu:boolean)
   { 
   let url=this.semUrl+"/Muhasebe/GetKrediKartPoslar?PosKodu="+poskodu+"&Tumu="+tumu+"&Token="+ this.kullsrc.token; 
 return await this.http.get<Result<KrediKartPosModel[]>>(url).pipe( map((res:any)=> res));
   } 

   async GetAnketFirmaList(arama:string)
  { 
       let url=this.semUrl+"/Cari/GetAnketFirmaList?Arama="+arama+"&Token="+ this.kullsrc.token;
        return await this.http.get<Result<KullaniciModel[]>>(url).pipe( map((res:any)=> res));
  }

  async GetHesapList(Arama:string,Tip:string):Promise<ReturnValuesList<HesapModel>>  {
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
        "Tip":  Tip, 
        "Token":this.kullsrc.token,
      });
  
    var result = await this.http.post<any>(this.semUrl+"/Muhasebe/GetHesapList", body, options).toPromise();
  
    var sonuc = JSON.parse(JSON.stringify(result));
  
    return new ReturnValuesList( sonuc.Model["Id"], sonuc.Model["Success"], sonuc.Model["Message"] ?? "", sonuc.Model["Token"] ?? "",sonuc.Model["List"]);
  }

  async GetHesapBakList(Arama:string,Tip:string):Promise<ReturnValuesList<HesapModel>>  {
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
        "Tip":  Tip, 
        "Token":this.kullsrc.token,
      });
  
    var result = await this.http.post<any>(this.semUrl+"/Muhasebe/GetHesapBakList", body, options).toPromise();
  
    var sonuc = JSON.parse(JSON.stringify(result));
  
    return new ReturnValuesList( sonuc.Model["Id"], sonuc.Model["Success"], sonuc.Model["Message"] ?? "", sonuc.Model["Token"] ?? "",sonuc.Model["List"]);
  }

  async IsEmriEkle(post:DtsEmirler,tip:IslemTipi):Promise<ReturnValues>  {
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
  
    var result = await this.http.post<any>(this.semUrl+"/Tanim/IsEmriEkle", body, options).toPromise();
  
    var sonuc = JSON.parse(JSON.stringify(result))['Model'];
    return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
    }
  
    async GetIsEmri(id:number)
    { 
        let url=this.semUrl+"/Tanim/GetIsEmri?DocEntry="+id+"&Token="+ this.kullsrc.token; 
            return await this.http.get<Result<DtsEmirler>>(url).pipe( map((res:any)=> res));
    }


    async LMPrimParametreTanim(post:LMPrimParametreModel,tip:IslemTipi):Promise<ReturnValues>  {
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
    
      var result = await this.http.post<any>(this.semUrl+"/Tanim/LMPrimParametreTanim", body, options).toPromise();
    
      var sonuc = JSON.parse(JSON.stringify(result))['Model'];
      return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
    }
    async GetLMPrimParametre(id:number)
    { 
         let url=this.semUrl+"/Tanim/GetLMPrimParametre?Docentry="+id+"&Token="+this.kullsrc.token; 
         return await this.http.get<Result<LMPrimParametreModel>>(url).pipe( map((res:any)=> res));
    }
    
    async LMPrimParametreDetayTanim(post:LMPrimParametreDetayModel,tip:IslemTipi):Promise<ReturnValues>  {
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
    
      var result = await this.http.post<any>(this.semUrl+"/Tanim/LMPrimParametreDetayTanim", body, options).toPromise();
    
      var sonuc = JSON.parse(JSON.stringify(result))['Model'];
      return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
    }
    async GetLMPrimParametreDetay(id:number,primid:number)
    { 
         let url=this.semUrl+"/Tanim/GetLMPrimParametreDetay?Docentry="+id+"&PrimId="+primid+"&Token="+this.kullsrc.token; 
         return await this.http.get<Result<LMPrimParametreDetayModel>>(url).pipe( map((res:any)=> res));
    }
  
    async OpcConfPrimParametreTanim(post:OpcConfPrimParametreModel,tip:IslemTipi):Promise<ReturnValues>  {
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
    
      var result = await this.http.post<any>(this.semUrl+"/Tanim/OpcConfPrimParametreTanim", body, options).toPromise();
    
      var sonuc = JSON.parse(JSON.stringify(result))['Model'];
      return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
    }
    async GetOpcConfPrimParametre(id:number)
    { 
         let url=this.semUrl+"/Tanim/GetOpcConfPrimParametre?Docentry="+id+"&Token="+this.kullsrc.token; 
         return await this.http.get<Result<OpcConfPrimParametreModel>>(url).pipe( map((res:any)=> res));
    }

    async PdksCihazTanim(post:PdksCihazModel,tip:IslemTipi):Promise<ReturnValues>  {
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
    
      var result = await this.http.post<any>(this.semUrl+"/Tanim/PdksCihazTanim", body, options).toPromise();
    
      var sonuc = JSON.parse(JSON.stringify(result))['Model'];
      return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
    }
    async GetPdksCihazTanim(id:number)
    { 
         let url=this.semUrl+"/Tanim/GetPdksCihazTanim?Docentry="+id+"&Token="+this.kullsrc.token; 
         return await this.http.get<Result<PdksCihazModel>>(url).pipe( map((res:any)=> res));
    }
    async PdksGirisCiks(baslangic:any,bitis:any,EkipId:number)
    { 
         let url=this.semUrl+"/Tanim/PdksGirisCiks?Baslangic="+moment(baslangic).format("yyyy-MM-DD")+"&Bitis="+moment(bitis).format("yyyy-MM-DD")+"&EkipId="+EkipId+"&Token="+this.kullsrc.token; 
         return await this.http.get<Result<PdksGirisCikisModel>>(url).pipe( map((res:any)=> res));
    }
    async PdksGirisCiksDetay(id:number)
    { 
         let url=this.semUrl+"/Tanim/PdksGirisCiksDetay?Id="+id+"&Token="+this.kullsrc.token; 
         return await this.http.get<Result<PdksGirisCikisDetayModel>>(url).pipe( map((res:any)=> res));
    }

    async GetpcPrimHaftaOzet(id:number)
    { 
        let url=this.semUrl+"/Tanim/GetpcPrimHaftaOzet?HesaplamaId="+id+"&Token="+this.kullsrc.token; 
        return await this.http.get<Result<PrimOpcHaftaOzetModel>>(url).pipe( map((res:any)=> res));
    }
    async GetpcPrimHaftaDetay(id:number)
    { 
        let url=this.semUrl+"/Tanim/GetpcPrimHaftaDetay?HesaplamaId="+id+"&Token="+this.kullsrc.token; 
        return await this.http.get<Result<PRIMOPCCONF_V1>>(url).pipe( map((res:any)=> res));
    }
    
    async OpcConfAylikPrimParametreTanim(post:OpcConfPrimAylikParametreModel,tip:IslemTipi):Promise<ReturnValues>  {
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
    
      var result = await this.http.post<any>(this.semUrl+"/Tanim/OpcConfAylikPrimParametreTanim", body, options).toPromise();
    
      var sonuc = JSON.parse(JSON.stringify(result))['Model'];
      return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
    }
    async GetOpcConfAyklikPrimParametre(id:number)
    { 
         let url=this.semUrl+"/Tanim/GetOpcConfAyklikPrimParametre?Docentry="+id+"&Token="+this.kullsrc.token; 
         return await this.http.get<Result<OpcConfPrimAylikParametreModel>>(url).pipe( map((res:any)=> res));
    }

    async OpcConfAylikPrimDetayTanim(post:OpcConfPrimAylikDetayModel,tip:IslemTipi):Promise<ReturnValues>  {
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
    
      var result = await this.http.post<any>(this.semUrl+"/Tanim/OpcConfAylikPrimDetayTanim", body, options).toPromise();
    
      var sonuc = JSON.parse(JSON.stringify(result))['Model'];
      return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
    }
    async GetOpcConfAylikPrimDetayTanim(id:number,tanimid:number)
    { 
         let url=this.semUrl+"/Tanim/GetOpcConfAylikPrimDetayTanim?Docentry="+id+"&PrimTanimId="+tanimid+"&Token="+this.kullsrc.token; 
         return await this.http.get<Result<OpcConfPrimAylikDetayModel>>(url).pipe( map((res:any)=> res));
    }

    async GetpcPrimAyOzet(id:number)
    { 
        let url=this.semUrl+"/Tanim/GetpcPrimAyOzet?HesaplamaId="+id+"&Token="+this.kullsrc.token; 
        return await this.http.get<Result<PRIM_OPCCONF_AYLIK_V10>>(url).pipe( map((res:any)=> res));
    }
    async GetpcPrimAyDetay1(id:number)
    { 
        let url=this.semUrl+"/Tanim/GetpcPrimAyDetay1?HesaplamaId="+id+"&Token="+this.kullsrc.token; 
        return await this.http.get<Result<PRIM_OPCCONF_AYLIK_V1>>(url).pipe( map((res:any)=> res));
    }
    async GetpcPrimAyDetay2(id:number)
    { 
        let url=this.semUrl+"/Tanim/GetpcPrimAyDetay2?HesaplamaId="+id+"&Token="+this.kullsrc.token; 
        return await this.http.get<Result<PRIM_OPCCONF_AYLIK_V2>>(url).pipe( map((res:any)=> res));
    }
    async OpcAyPrimOzetGuncelle(post:PRIM_OPCCONF_AYLIK_V10):Promise<ReturnValues>  {
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
    
      var result = await this.http.post<any>(this.semUrl+"/Tanim/OpcAyPrimOzetGuncelle", body, options).toPromise();
    
      var sonuc = JSON.parse(JSON.stringify(result))['Model'];
      return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
    }

    async GetSistemDash()
    { 
    let url=this.semUrl+"/Tanim/GetSistemDash?Token="+ this.kullsrc.token;
      return this.http.get<Result<Sistem_Dasboard>>(url).pipe(map((res: any) => res));
    } 
    async GetSistemKullaici()
    { 
    let url=this.semUrl+"/Tanim/GetSistemKullaici?Token="+ this.kullsrc.token;
      return this.http.get<Result<X_SISTEM_KULLANICI>>(url).pipe(map((res: any) => res));
    } 
    async GetSistemSantralDahili()
    { 
    let url=this.semUrl+"/Tanim/GetSistemSantralDahili?Token="+ this.kullsrc.token;
      return this.http.get<Result<NtxSantralDisHatModel>>(url).pipe(map((res: any) => res));
    } 
    async GetSistemSantralDahiliList()
    { 
    let url=this.semUrl+"/Tanim/GetSistemSantralDahiliList?Token="+ this.kullsrc.token;
      return this.http.get<Result<X_SISTEM_DAHILI>>(url).pipe(map((res: any) => res));
    } 
    async GetSistemLogList()
    { 
    let url=this.semUrl+"/Tanim/GetSistemLogList?Token="+ this.kullsrc.token;
      return this.http.get<Result<SistemLog>>(url).pipe(map((res: any) => res));
    } 
} 

export class Sistem_Dasboard{
  Id:number=0; 
  Cpu:number=0; 
  Memory:number=0; 
  DiskFree:number=0; 
  AcikTalep:number=0; 
  Kullanici:number=0; 
  Dahili:number=0; 
  SonYenilenme:any;  
}
export class X_SISTEM_KULLANICI{
  EmpId:number=0; 
  Adi:string=""; 
  SorumluBirim:string="";  
  Sirket:string="";  
  Departman:string="";  
  Pozisyon:string="";  
  Durum:string="";  
  Oturum:number=0; 
  SonOturumTarih:any;   
}
export class X_SISTEM_DAHILI{
  Id:number=0; 
  Departman:string=""; 
  Durum:string="";  
  DahiliNo:string="";  
  DahiliAdi:string="";  
  DurumAciklama:string="";  
  IpAdress:string="";  
  BaglantıCihaz:string="";  
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

export class PRIM_OPCCONF_AYLIK_V2{
  Id:number=0;
  HesaplamaId:number=0; 
  DocEntry:number=0; 
  Tarih:any;
  Ekip:string=""; 
  Adi:string="";
  BolgeId:number=0;
  Bolge:string="";
  GelisDurumId:number=0;
  GelisDurum:string="";
  UpSayi:number=0;
  DealSayisi:number=0;
  UpKimdenId:number=0;
  UpKimden:string="";

  OpcTc:string="";
  OpcId:number=0;
  Opc:string="";
  OpcSupervisorId:number=0;
  OpcSupervisor:string="";
  OpcManagerId:number=0;
  OpcManager:string="";
  OpcManagerTc:string="";

  ConfId:number=0;
  Conf:string="";
  ConfTc:string="";
  ConfSupervisorId:number=0;
  ConfSupervisor:string="";
  ConfManagerId:number=0;  
  ConfManager:string="";
  ConfManagerTc:string="";

  Durum:string="";
  Money:number=0;
  SozlesmeNo:string="";
  SatisTuruId:number=0;
  SatisTuru:string="";
}
export class PRIM_OPCCONF_AYLIK_V1 {
  Id:number=0;
  HesaplamaId:number=0; 
  DocEntry:number=0; 
  SozlesmeNo:string=""; 
  Adi:string="";
  SatisTarih:any;
  Bolge:string="";
  BolgeId:number=0;
  ParaBirim:string="";
  SozlesmeTutar:number=0;
  Tutar:number=0;
  KickTutar:number=0;
  Pesinat:number=0;
  EskiOdenen:number=0;
  YeniOdenen:number=0;
  Durum:string="";
  SirketAcente:string="";
  Manager:string="";
  ManagerId:number=0;  
  PrimDurumX:string="";
  Ekip:number=0;
  Acente:string="";
  TapuDurum:number=0;
  SatisDurumu:string="";

  KickIslemId:number=0;
  SozlesmeDurumId:number=0;
  TutarDoviz:number=0;
  SozlesmeTutarDoviz:number=0;

  OpcId:number=0;
  Opc:string="";
  OpcSupervisorId:number=0;
  OpcSupervisor:string="";
  OpcManagerId:number=0;
  OpcManager:string="";
  ConfId:number=0;
  Conf:string="";
  ConfSupervisorId:number=0;
  ConfSupervisor:string="";
  ConfManagerId:number=0;  
  ConfManager:string="";
  UpKimdenId:number=0;  
  UpKimden:string="";

  ToplamOdenen:number=0;
  EskiYuzde:number=0;
  YeniYuzde:number=0;
  AyIcıYuzde:number=0;
  PrimDurum:string="";
}
export class PRIM_OPCCONF_AYLIK_V10{
  Id:number=0;
  HesaplamaId:number=0; 
  Active:string=""; 
  Tckn:string="";  
  EmpId:number=0; 
  AdSoyad:string="";
  OdemeDurum:boolean=false;
  Hakedis:number=0;
  Butce:number=0;

  DepartmanStr:string="";  
  PozisyonStr:string="";  
  Manager:string="";  
  SorumluBirimId:number=0;
  SorumluBirim:string="";   
}

export class OpcConfPrimAylikDetayModel{
  DocEntry:number=0;    
  PrimTanimId:number=0;  
  EmpId:number=0;  
  AdSoyad:string=""; 
  Yuzde:number=0;  
  Aciklama:string="";    
  EkleyenId:number=0; 
  Ekleyen:string="";
  GuncelleyenId:number=0;
  Guncelleyen:string="";
  Kayit:Date=new Date();
  Guncelleme:Date=new Date(); 
  Aktif:boolean=false;
}
export class OpcConfPrimAylikParametreModel{
  DocEntry:number=0;    
  BirimId:number=0;  
  Birim:string="";
  HesaplamaTipId:number=0;  
  HesaplamaTip:string="";
  BolgeId:number=0;  
  Bolge:string="";  
  EkipId:number=0;  
  Ekip:string="";
  ManagerId:number=0;  
  Manager:string="";
  OpcManagerId:number=0;  
  OpcManager:string="";
  ConfManagerId:number=0;  
  ConfManager:string="";
  BasTarih:any; 
  BitTarih:any;
  Kota1Tutar:number=0; 
  Kota1Oran:number=0; 
  Kota1Hakedis:number=0; 
  Kota2Tutar:number=0; 
  Kota2Oran:number=0; 
  Kota2Hakedis:number=0; 
  UpKotaSayi:number=0; 
  DealTutar:number=0; 
  DealButce:number=0; 
  QUpTutar:number=0; 
  QDealTutar:number=0; 
  QManagerTutar:number=0; 
  Aciklama:string="";    
  EkleyenId:number=0; 
  Ekleyen:string="";
  GuncelleyenId:number=0;
  Guncelleyen:string="";
  Kayit:Date=new Date();
  Guncelleme:Date=new Date(); 
  Aktif:boolean=false;
}
export class PRIMOPCCONF_V1{
  Id:number=0;
  HesaplamaId:number=0; 
  DocEntry:number=0; 
  Tarih:any;
  Ekip:string=""; 
  Adi:string="";
  BolgeId:number=0;
  Bolge:string="";
  GelisDurumId:number=0;
  GelisDurum:string="";
  UpSayi:number=0;
  DealSayisi:number=0;
  UpKimdenId:number=0;
  UpKimden:string="";
  OpcTc:string="";
  OpcId:number=0;
  Opc:string="";
  OpcSupervisorId:number=0;
  OpcSupervisor:string="";
  OpcManagerTc:string="";
  OpcManagerId:number=0;
  OpcManager:string="";
  ConfTc:string="";
  ConfId:number=0;
  Conf:string="";
  ConfSupervisorId:number=0;
  ConfSupervisor:string="";
  ConfManagerTc:string="";
  ConfManagerId:number=0;  
  ConfManager:string="";
  Durum:string="";
  Money:number=0; 
  SozlesmeNo:string="";
  SatisTuruId:number=0; 
  SatisTuru:string="";
}
export class PrimOpcHaftaOzetModel{
  Id:number=0;
  HesaplamaId:number=0; 
  DocEntry:number=0; 
  EmpId:number=0;
  AdSoyad:string=""; 
  GelisDurumId:string=""; 
  GelisDurum:string="";
  Durum:string="";
  BolgeId:number=0;
  Bolge:string="";
  PrimTipId:number=0;
  BirimId:number=0;
  Tutar:number=0;
  Aciklama:string="";
  PrimSayi:number=0;
  Prim:number=0;
  OzelTutar:number=0;  
  Toplam:number=0;
  PersonelAktifmi:string="";
  Tckn:string="";
  Odenecek:boolean=true;
  Birim:string="";
}

export class PdksGirisCikisDetayModel{
  Id:number=0;      
  EmpId:number=0;      
  AdSoyad:string="";  
  Tarih:any;   
  CihazId:number=0; 
  OfisAdi:string="";  
  CihazAdi:string="";  
  GirisTipId:number=0; 
  GirisTipi:string="";  
  GirilenBilgi:string="";   
  Aciklama:string="";   
}
export class PdksGirisCikisModel{
  Id:number=0;      
  EmpId:number=0;      
  AdSoyad:string="";  
  GirisTarih:any;  
  CikisTarih:any;  
  GirisCihazId:number=0; 
  GirisOfis:string="";  
  GirisCihaz:string="";  
  CikisCihazId:number=0; 
  CikisOfis:string="";  
  CikisCihaz:string=""; 
  Pozisyon:number=0; 
  PozisyonStr:string=""; 
  Departman:number=0; 
  DepartmanStr:string="";   
  Aktif:string="";   
  Yonetici:string="";   
  Tckn:string="";   
  Ekip:string="";  
  SorumluBirim:number=0; 
  SorumluBirimStr:string="";  
  CalismaDakika:number=0; 
  CalismaSure:string="";  
}
export class PdksCihazModel{
  DocEntry:number=0;      
  CihazAdi:string="";  
  OfisAdi:string="";  
  IpAdres:string="";  
  Port:number=0; 
  TcknGiris:number=0; 
  KartGiris:number=0;  
  OzelKodGiris:number=0; 
  KapiTetik:number=0; 
  CihazId:number=0; 
  TimeOut:number=0; 
  ProType:number=0; 
  PassWord:number=0; 
  Lisans:number=0;  
  Aciklama:string="";  
  EkleyenId:number=0; 
  Ekleyen:string="";
  GuncelleyenId:number=0;
  Guncelleyen:string="";
  Kayit:Date=new Date();
  Guncelleme:Date=new Date(); 
  Aktif:boolean=false; 
}
export class OpcConfPrimParametreModel{
  DocEntry:number=0;    
  EmpId:number=0; 
  AdSoyad:string="";     
  GelisDurumId:number=0;  
  GelisDurum:string="";    
  Durum:string="";    
  BolgeId:number=0;  
  Bolge:string="";  
  PrimTipId:number=0;  
  PrimTip:string="";
  BirimId:number=0;  
  Birim:string="";
  Aciklama:string="";   
  Tutar:number=0;    
  OzelTutar:number=0;    

  EkleyenId:number=0; 
  Ekleyen:string="";
  GuncelleyenId:number=0;
  Guncelleyen:string="";
  Kayit:Date=new Date();
  Guncelleme:Date=new Date(); 
  Aktif:boolean=false;
}
export class SATISPRIMLM_OZET{
  Id:number=0;
  HesaplamaId:number=0; 
  EmpId:number=0;
  AdSoyad:string=""; 
  Tckn:string=""; 
  EkipId:number=0;
  Ekip:string="";
  PrimTutar:number=0;
  PrimTapuTutar:number=0; 
  Toplam:number=0; 
  PersonelAktif:string="";  
  Odenecek:boolean=false;
}
export class LMPrimParametreDetayModel{
  DocEntry:number=0;    
  PrimMasterId:number=0;    
  EmpId:number=0;    
  AdSoyad:string=""; 
  PrimOran:number=0;     

  EkleyenId:number=0; 
  Ekleyen:string="";
  GuncelleyenId:number=0;
  Guncelleyen:string="";
  Kayit:Date=new Date();
  Guncelleme:Date=new Date(); 
  Aktif:boolean=false;
}
export class LMPrimParametreModel{
  DocEntry:number=0;   
  SorumluId:number=0;  
  Sorumlu:string="";  
  EkipId:number=0; 
  Ekip:string="";     
  LMId:number=0;  
  LM:string="";    
  LM2Id:number=0;  
  LM2:string="";  
  Aciklama:string="";  
  BasTarih:any;    
  BitTarih:any;    
  BolgeId:number=0;    
  Bolge:string="";

  EkleyenId:number=0; 
  Ekleyen:string="";
  GuncelleyenId:number=0;
  Guncelleyen:string="";
  Kayit:Date=new Date();
  Guncelleme:Date=new Date(); 
  Aktif:boolean=false;
}
export class DtsEmirler{
  Id:number=0;        
  CalisacakMetod:string="";       
  BasTarih:any;       
  BitTarih:any;       
  ToplamKayit:number=0;      
  AktarilanKayit:number=0;      
  Durum:number=0;      
  EmpId:number=0;      
  Ekleyen:string="";  
  EkTarih:any;     
}
export class KrediKartPosModel{
  KartNo:number=0;        
  KartAdi:string="";       
  HesapKodu:string="";       
  HesapAdi:string="";  
  SapSube:number=0;      
  SubeAdi:string="";    
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
export class PdksGrup2{
  DocEntry:number=0;     
  Adi:string="";    
}
export class FuPrimDetay{
  Id:number=0;
  DocEntry:number=0;
  Tckn:string="";
  ArayanId:number=0;
  Arayan:string="";
  Manager:string="";
  Aciklama:string="";
  SozlesmeId:number=0;
  TapuDurum:number=0;
  SozlesmeNo:string="";
  UyeAdi:string="";
  PrimOran:number=0;   
  DosyaBasi:number=0;
  FuDurumId:number=0;
  FuDurum:string="";
  DonemId:number=0;
  AltDonemId:number=0;
  AltDonem:string="";
  OrtakId:number=0;
  SozlesmeDurumId:number=0; 
  CrmTahsilatTutar:number=0; 
  SozlesmeDurum:string="";
  BirimId:number=0; 
  FuPrimKontrol:number=0; 
  FuPrimKontrolEdenId:number=0; 
  FuPrimKontrolEden:string="";
  OrtakSayi:number=0; 
  Matrah:number=0; 
  MatrahDosyaBasi:number=0; 
  Prim:number=0; 
}
export class FuPrimOzet{
  Id:number=0;
  HesaplamaId:number=0;
  DonemId:number=0;
  AltDonemId:number=0;
  Tckn:string="";
  ArayanId:number=0;
  Arayan:string="";
  Manager:string=""; 
  Matrah:number=0;
  Prim:number=0;
  SpiffHesaplanan:number=0;
  SpiffHakedis:number=0;
  Toplam:number=0;
  PrimOran:number=0; 
  Odenecek:number=0; 
  PersonelDurum:string="";
  GorevBirim:string="";
}
export class BuSpiffGrupModel{
  DocEntry:number=0;    
  Adi:string="";  
  Oran:number=0;   
  Aciklama:string="";  
  Ekleyen:number=0; 
  EkleyenAd:string="";
  Guncelleyen:number=0;
  GuncelleyenAd:string="";
  Kayit:Date=new Date();
  Guncelleme:Date=new Date();  
}
export class PdksGrupModel{
  DocEntry:number=0;    
  GrupId:number=0;    
  GrupAdi:string="";  
  Adi:string="";  
  YemekSaat:string="";  
  Aciklama:string="";  
  Ekleyen:number=0; 
  EkleyenAd:string="";
  Guncelleyen:number=0;
  GuncelleyenAd:string="";
  Kayit:Date=new Date();
  Guncelleme:Date=new Date();  
}
export class PdksKartModel{
  DocEntry:number=0;    
  KartNo:string="";  
  Ekleyen:number=0;  
  EkleyenAd:string="";
  Guncelleyen:number=0;
  GuncelleyenAd:string="";
  Kayit:Date=new Date();
  Guncelleme:Date=new Date();  
}
export class FuPrimSpiffModel{
  DocEntry:number=0;    
  Adi:string=""; 
  Aciklama:string=""; 
  Kota:number=0;    
  Prim:number=0;     
  Ekleyen:number=0; 
  EkleyenAd:string="";
  Guncelleyen:number=0;
  GuncelleyenAd:string="";
  Kayit:Date=new Date();
  Guncelleme:Date=new Date();  
}
export class PrimCrmOzetModel{
  Id:number=0;
  HesaplamaId:number=0;
  V1BaglantiId:number=0;
  PersonelId:number=0;
  Personel:string="";
  Kadro:string="";
  Gorev:string="";
  Tckn:string="";
  Durum:string="";
 
  Tahsilat:number=0;
  RezervasyonSayi:number=0;
  GorusmeSayi:number=0;
  GorusmePrim:number=0;
  RaporlamaPrim:number=0;
  EtudPrim:number=0;
  YardimlasmaPrim:number=0;
  CrmPrim:number=0; 
  BaiPrim:number=0;
  ToplamPrim:number=0;
  Odenecek:number=0; 
  RezervasyonPrim:number=0; 
  PerformansToplam:number=0; 
  PerformansPrim:number=0; 
}
export class CrmPrimParametreDetayModel{
  DocEntry:number=0;    
  CrmYetkiId:number=0;    
  MinOran:number=0;    
  MaxOran:number=0;    
  PrimPersonelOran:number=0;    
  PrimManagerOran:number=0;    
  PrimSupervisorOran:number=0;     
  Aciklama:string=""; 
  Ekleyen:number=0; 
  EkleyenAd:string="";
  Guncelleyen:number=0;
  GuncelleyenAd:string="";
  Kayit:Date=new Date();
  Guncelleme:Date=new Date(); 
  Aktif:boolean=false;
}
export class CrmPrimParametreModel{
  DocEntry:number=0;    
  Yil:number=0;    
  Ay:number=0;    
  PersonelTip:number=0;  
  PersonelTipStr:string="";  
  PrimTip:number=0;    
  PrimTipStr:string="";
  BireyselTutar:number=0;    
  Barem1Tutar:number=0;    
  Barem1Oran:number=0;    
  Barem2Tutar:number=0;    
  Barem2Oran:number=0;    
  Barem3Tutar:number=0;    
  Barem3Oran:number=0;    
  Barem4Tutar:number=0;    
  Barem4Oran:number=0;    
  Barem5Tutar:number=0;    
  Barem5Oran:number=0;  
  Barem6Tutar:number=0;    
  Barem6Oran:number=0;    
  GorusmeOran:number=0;    
  RezezevasyonOran:number=0;    
  PerformansOran:number=0;    
  Aciklama:string=""; 
  Ekleyen:number=0; 
  EkleyenAd:string="";
  Guncelleyen:number=0;
  GuncelleyenAd:string="";
  Kayit:Date=new Date();
  Guncelleme:Date=new Date(); 
  Aktif:boolean=false;
}

export class PrimParametreModel{
  DocEntry:number=0;    
  Yetki:string=""; 
  YetkiMasterId:number=0;  
  YetkiMaster:string=""; 
  Ekleyen:number=0; 
  EkleyenAd:string="";
  Guncelleyen:number=0;
  GuncelleyenAd:string="";
  Kayit:Date=new Date();
  Guncelleme:Date=new Date(); 
}

export class PrimTahsilatOzetModel{
  Id:number=0;
  HesaplamaId:number=0;
  PersonelId:number=0;
  Personel:string="";
  PersonelAktifmi:string="";
  Tckn:string="";
  IhtarSureDisinda:number=0;
  IhtarSureIcinde:number=0;
  TeminataVerilenSenet:number=0;
  CashTahsilat:number=0;
  Tahsilat:number=0;
  ToplamTahsilat:number=0;
  UyeSayisi:number=0;
  UyeBasiTahsilat:number=0;
  SpiffGrupId:string="";
  PrimGrupId:number=0;
  AsgariPrimKota:number=0;
  Barem1:number=0;
  Barem2:number=0;
  Barem3:number=0;
  Barem4:number=0;
  Barem5:number=0;
  Barem6:number=0;
  CezaUygulanacakmi:number=0;
  CezaDurum:number=0;
  IhtarSureIcindeHakedis:number=0;
  IhtarSureDisindaHakedis:number=0;
  TeminatHakedis:number=0;
  CashHakedis:number=0;
  TahsilatHakedis:number=0;
  GenelHakedis:number=0;
  Hakedis:number=0;
  Barem:number=0; 
  SpiffHakedis:number=0;
  SpiffHakedisKesilen:number=0;  
  SpiffHakedisSon:number=0;  
  Odenecek:boolean=false;  
  PersonelDurum:string="";
  PrimToplam:number=0;
  PrimGenelHakedis:number=0;
  PrimGrupKodu:string="";
}

export class TahsilatSpiffPrimGrupModel{
  DocEntry:number=0;
  Kod:string="";
  Grup:string="";
  GrupTuruStr:string="";
  Aciklama:string="";
  GrupTuru:string="";
  UyeSayisi:number=0;
  Barem:number=0; 
  BaremStr:string="";
  MinTutar:number=0; 
  MaxTutar:number=0;   

  EkleyenId:number=0; 
  EkleyenAd:string="";
  GuncelleyenId:number=0;
  GuncelleyenAd:string="";
  Kayit:any;
  Guncelleme:any; 
}

export class TahsilatPrimGrupModel{
  DocEntry:number=0;
  Kod:string="";
  Grup:string="";
  Aciklama:string="";
  GrupTuru:string="";
  GrupTuruStr:string="";
  CashOran:number=0;
  SenetOran:number=0; 
  IhtarIcindeOran:number=0; 
  IhtarDisindaOran:number=0;
  TeminatOran:number=0;
  GenelOran:number=0;   
  ManagerOran:number=0;   
  Barem1Oran:number=0;   
  Barem2Oran:number=0;   
  Barem3Oran:number=0;   
  Barem4Oran:number=0;   
  Barem5Oran:number=0;   
  Barem6Oran:number=0;   
  CezaUygulanacakmi:number=0;   
  CezaUygulanacakmiStr:string="";

  EkleyenId:number=0; 
  EkleyenAd:string="";
  GuncelleyenId:number=0;
  GuncelleyenAd:string="";
  Kayit:any;
  Guncelleme:any; 
}
 
export class VW_SNT_SATISPRIM{
  To1YHakedis:any;
  To2Hakedis:any;
  To2YHakedis:any;
  Rep1YHakedis:any;
  Rep2Hakedis:any;
  Rep2YHakedis:any;
  RepHakedis:any;
  ToHakedis:any;
  Id:any;
  HesaplamaId:any;
  PrimGrubu:any;
  RepPay:any;
  RepPayYuzde1:any;
  ToPay:any;
  Yuzde7Hakedis:any;
  Yuzde5Hakedis:any;
  Bu3YuzdeHakedis:any;
  Bu2YuzdeHakedis:any;
  DocEntry:any;
  SozlesmeNo:any;
  Adi:any;
  SatisTarih:any;
  Bolge:any;
  ParaBirim:any;
  SozlesmeTutar:any;
  Tutar:any;
  KickTutar:any;
  Pesinat:any;
  EskiOdenen:any;
  YeniOdenen:any;
  Durum:any;
  DurumOran:any;
  DurumDepartman:any;
  Cash:any;
  CashTarih:any;
  Kick:any;
  KickTarih:any;
  SirketAcente:any;
  Yuzde5Kontrol:any;
  Manager:any;
  ManagerId:any;
  LmaId:any;
  Lma:any;
  LmaPrim:any;
  Lma2Id:any;
  Lma2:any;
  Lma2Prim:any;
  PrimDurumX:any;
  Rep1Id:any;
  Rep1:any;
  Rep1Prim:any;
  Rep1YId:any;
  Rep1Y:any;
  Rep1YPrim:any;
  Rep2Id:any;
  Rep2:any;
  Rep2Prim:any;
  Rep2YId:any;
  Rep2Y:any;
  Rep2YPrim:any;
  Rep3Id:any;
  Rep3:any;
  Rep3Prim:any;
  Rep3YId:any;
  Rep3Y:any;
  Rep3YPrim:any;
  To1Id:any;
  To1:any;
  To1Prim:any;
  To1YId:any;
  To1Y:any;
  To1YPrim:any;
  To2Id:any;
  To2:any;
  To2Prim:any;
  To2YId:any;
  To2Y:any;
  To2YPrim:any;
  To3Id:any;
  To3:any;
  To3Prim:any;
  To3YId:any;
  To3Y:any;
  To3YPrim:any;
  BuYuzde3Id:any;
  BuYuzde3:any;
  BuYuzde3Prim:any;
  BuYuzde2Id:any;
  BuYuzde2:any;
  BuYuzde2Prim:any;
  BuHak:any;
  Ekip:any;
  Acente:any;
  TapuDurum:any;
  SatisDurumu:any;
  KickIslemId:any;
  ToplamOdenen:any;
  EskiYuzde:any;
  YeniYuzde:any;
  AyIcıYuzde:any;
  YeniOdenenYuzde5:any;
  PrimDurum:any;
  To1Hakedis:any;
  Rep1Hakedis:any;
  SatisTipi:number=0;
  BuSpiffOran:number=0;
  BuSpiffHakedis:number=0;
  
}
export class PrimOzetModel{
  Id:number=0;
  HesaplamaId:number=0; 
  PersonelId:number=0;
  Personel:string=""; 
  Ekip:string="";
  REPPAY:number=0;
  TOPAY:number=0;
  ŞİRKET:number=0;
  ACENTE:number=0;
  INHOUSE:number=0;
  TAPU:number=0;
  AVANS:number=0;  
  KESILEN:number=0; 
  BASIC:number=0; 
  YUZDE5TO:number=0; 
  EKODEME:number=0; 
  TOPLAM:number=0; 
  TAHAKKUKID:number=0; 
  PersonelDurum:string="";
  Tckn:string="";
  Odenecek:boolean=false;
  RESMI:number=0
  BES:number=0
  ICRA:number=0
  CARIALACAK:number=0
  BuSpiffHakedis:number=0

  UpdateUser:number=0; 
  EkleyenAd:string=""; 
  UpdateDate:Date=new Date(); 
}
export class SatisPrimHesaplaModel{
  DocEntry:number=0;
  BasTarih:any;
  BitTarih:any;
  OnayDurum:number=0;
  OnayDurumStr:string="";
  HesaplamaTip:number=0;
  HesaplamaTipStr:string="";
  HesaplamaBirimId:number=0;
  HesaplamaBirim:string="";
  IslemDurum:number=0;
  IslemDurumStr:string="";
  ToplamTutar:number=0;  
  HesaplamaBaslangic:string="";
  HesaplamaBitis:string="";
  Aciklama:string="";

  Ekleyen:number=0; 
  EkleyenAd:string="";
  Guncelleyen:number=0;
  GuncelleyenAd:string="";
  Kayit:Date=new Date();
  Guncelleme:Date=new Date(); 
  BaslamaTarih:any; 
  BitisTarih:any; 
  HesaplamaDakika:number=0; 
}

export class SatisPrimBasicParametreModel{
  DocEntry:number=0; 
  EkipId:number=0;
  Ekip:string="";
  BasDealSayi:number=0;  
  BitDealSayi:number=0;  
  Tutar:number=0;  
  
  Ekleyen:number=0; 
  EkleyenAd:string="";
  Guncelleyen:number=0;
  GuncelleyenAd:string="";
  Kayit:Date=new Date();
  Guncelleme:Date=new Date();
  Aktif: boolean=false;
}

export class SatisPrimFirstToModel{
  DocEntry:number=0;
  BasTarih:any;
  BitTarih:any;
  EmpId:number=0;
  KullaniciAdi:string="";
  Oran:number=0;  
  
  Ekleyen:number=0; 
  EkleyenAd:string="";
  Guncelleyen:number=0;
  GuncelleyenAd:string="";
  Kayit:Date=new Date();
  Guncelleme:Date=new Date();
  Aktif: boolean=false;
}

export class SatisPrimGrupModel{
  DocEntry:number=0; 
  GrupAdi:string="";
  Aciklama:string=""; 
  BasTarih:any;
  BitTarih:any;

  Ekleyen:number=0; 
  EkleyenAd:string="";
  Guncelleyen:number=0;
  GuncelleyenAd:string="";
  Kayit:Date=new Date();
  Guncelleme:Date=new Date();
  Aktif: boolean=false;
}

export class SatisPrimParametreModel{
  DocEntry:number=0;
  BasTarih:any;
  BitTarih:any;
  EkipId:number=0;
  Ekip:string="";
  OdemeOran:number=0; 
  HakedisOran:number=0; 
  PrimGrupId:number=0; 
  PrimGrup:string="";

  Ekleyen:number=0; 
  EkleyenAd:string="";
  Guncelleyen:number=0;
  GuncelleyenAd:string="";
  Kayit:Date=new Date();
  Guncelleme:Date=new Date();
  Aktif: boolean=false;
}

export class FuParametreModel{
  DocEntry:number=0;
  Adi:string="";
  Aciklama:string="";
  Oran:number=0;
  TapuOran:number=0; 
  Dosya:number=0; 
  TutarZorunlu:number=0; 
  
  Ekleyen:number=0; 
  EkleyenAd:string="";
  Guncelleyen:number=0;
  GuncelleyenAd:string="";
  Kayit:Date=new Date();
  Guncelleme:Date=new Date();
  Aktif: boolean=false;
}

export class SistemModel{
  Code:number=0;
  SenetCashKontrolGun:number=0;
  SozlesmeBuAtamaGun:number=0;
  KickIadeMuhKod:string="";
  TahsilatBilinmeyenMuhKod:string="";
  SenetTahsilatHesapId:number=0;
  SenetTahsilatUpgradeHesapId:number=0;
  KickIadeTalepHesapId:number=0;
  TahsilatBilinmeyenHesapId:number=0;
  FesihOran:number=0;
  UyeAidatTahakkukHesapId:number=0;
  SozlesmePesinatHesabi:number=0;
  SozlesmePesinatUpgradeHesabi:number=0;
  TapuHarcHesapId:number=0;
  TapuHarcMasrafHesapId:number=0;
  TapuHarcMasrafKarsiHesapId:number=0;
  AidatTahsilatYeniHesapId:number=0;
  AidatTahsilatUpgradeHesapId:number=0;
  SenetKapamaHesapId:number=0;
  SenetKapamaKarsiHesapId:number=0;
  KickIadeAktarimHesapId:number=0;
  LineSpiffYuzde5HesapId:number=0;
  LineSpiffYuzde5BankaHesapId:number=0;
  AidatOdemeKapamaHesapId:number=0;
  IsAvansTransferCariHesapId:number=0;
  IsAvansTransferCariIadeHesapId:number=0;
  IsAvansTransferKasaHesapId:number=0;
  IsAvansTransferBankaHesapId:number=0;
  TahsilatPrimSpiffMaxOran:number=0;
  IsletmeKasaVirmanHesapId:number=0;
  TahsilatPrimSpiffManager:number=0;
  KasaVirmanHesapId:number=0;
  SatisSirketi:number=0;
  FuPrimSpiffManager:number=0;
  SistemKilitSure:number=0;
  DonemDegisimBilgi:string="";
  RezervasyonYemekHesapId:number=0;
  SantralYol1:string="";
  SantralYol2:string="";
  SantralAramaYol:string="";
  SantralDirekAktar:string="";
  SantralGorusAktar:string="";
  SantralCagriCekme:string="";
  SantralDinle:string="";
  SantralFisilda:string="";
  VipTutar:number=0;
  OnayKoduGonderimTipi:number=0;
  TalepSmsTelefon:string="";
  IkTumVerileriAktar:string="";

  Ekleyen:number=0; 
  EkleyenAd:string="";
  Guncelleyen:number=0;
  GuncelleyenAd:string="";
  Kayit:Date=new Date();
  Guncelleme:Date=new Date();
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

export class CariOdemeYontem { 
  OdemeKod: number=0; 
  OdemeAdi: string="";  
 }

export class Result<T> 
{
  KeyAccept:boolean=false;
  empId:number=0;
  List!: [T];
  Model!: T;
}

export  class AcenteModel {
  Code: number=0;
  Adi: string=""; 
  CalismaSekli: number=0; 
  CalismaSekliStr: string=""; 
  Bolge:string="";
  BolgeId:number=0; 
  Tesis:string="";
  TesisId:number=0; 
  Parametre:string=""; 
  GuncelleyenAd:string="";
  Sorumlu:number=0;
  SorumluStr:string="";
  LineSpiffSorumlu:number=0;
  LineSpiffSorumluStr:string="";
  SatistaGosterme:number=0;
  ManuelSozlesme:number=0;
  EkleyenAd: string=""; 
  Kayit: Date=new Date(); 
  Guncelleme: Date=new Date(); 
  Aktif: boolean=false; 
 } 
export  class MuhasebeHesapModel { 
  Code: number=0;
  AcctCode: string=""; 
  AcctName: string=""; 
  CalismaSekli:string="";
}
export  class HesapModel {
  Code: number=0;
  semkey:string="";
  HesapKodu: string=""; 
  HesapAdi: string=""; 
  KasaAdi: string=""; 
  Plaka: string=""; 
  Bolge:number=0;
  BolgeStr:string="";
  Acente:number=0;
  AcenteStr:string="";
  CalismaSekli:string="";
  FinManagerId:number=0;
  FinManager:string="";
  AnaYetkili:number=0;
  AnaYetkiliStr:string="";
  AnaYetkiliMail:string="";
  EkBilgi:string="";
  EkBilgi1:string="";
  EkBilgi2:string="";
  EkBilgi3:string="";
  EkBilgi4:string="";
  Tutar:number=0;
  Donem:number=0;
  AltDonem:number=0;
  KasaTip:number=1;
  KasaTipStr:string="";
  SubeHesapKodu:string="";
  GuncelleyenAd:string="";
  EkleyenAd: string=""; 
  Kayit: Date=new Date(); 
  Guncelleme: Date=new Date(); 
  Aktif: boolean=false  
  SubeId:number=0;
  Sube:string="";
  Boyut1:string="";
  Boyut2:string="";
  Tip:string="";
  BalansRaporGoster:boolean=false  
  Bakiye:number=0;
 } 
export  class OtobusServisModel {
  Code: number=0;
  FirmaKodu: string=""; 
  FirmaAdi: string=""; 
  Plaka: string=""; 
  PlakaId: number=0;
  Kapasite:number=0;
  KapasiteStr:string="";
  Fiyat:number=0;
  GuncelleyenAd:string="";
  EkleyenAd: string=""; 
  Kayit: Date=new Date(); 
  Guncelleme: Date=new Date(); 
  Aktif: boolean=false  
 } 
export  class OtobusFiyatModel {
  Code: number=0;
  FirmaKodu: string=""; 
  FirmaAdi: string=""; 
  Guzergah:number=0;
  Kapasite:number=0;
  Bolge:string="";
  KalkisYeri:string="";
  VarisYeri:string="";
  KapasiteStr:string="";
  Yil:number=0;
  Fiyat:number=0;
  GuncelleyenAd:string="";
  EkleyenAd: string=""; 
  Kayit: Date=new Date(); 
  Guncelleme: Date=new Date(); 
  Aktif: boolean=false  
  OtobusFiyatId:number=0;
 } 
export  class PlakaModel {
  Code: number=0;
  FirmaKodu: string=""; 
  FirmaAdi: string=""; 
  Plaka: string=""; 
  Kapasite:number=0;
  KapasiteStr:string="";
  DolulukOran:number=0;
  KapasiteSayi:number=0;
  Kaptan:string="";
  Telefon:string="";
  GuncelleyenAd:string="";
  EkleyenAd: string=""; 
  Kayit: Date=new Date(); 
  Guncelleme: Date=new Date(); 
  Aktif: boolean=false  
 } 
export  class AileGelisModel {
  Code: number=0;
  Adi: string="";   
  Parametre: string="";  
}
export  class GuzergahModel {
  Code: number=0;
  Bolge: string="";   
  KalkisYeri: string="";   
  VarisYeri: string="";   
  Gun: string="";   
  Wave: string="";   
  KalkisSaati: string="";   
  Tarife: string=""; 
  GunStr: string=""; 
  WaveStr: string=""; 
  TarifeStr: string=""; 
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

 export  class SantralModel {
  Code: number=0;
  SantralKodu: string=""; 
  SantralAdi: string=""; 
  Parametre: string=""; 
  Ekleyen: string=""; 
  EkTarih: Date=new Date(); 
  Aktif: boolean=false  
 } 

 export  class TesisModel {
  Code: number=0;
  TesisAdi: string=""; 
  SmsGosterim: boolean=false;

  Fiyat_2_1: number=0;
  Fiyat_4_1: number=0;
  Fiyat_6_1: number=0;
  Fiyat_6_1_P: number=0;
  Fiyat_8_1: number=0;
  Fiyat_1_H: number=0;
  Fiyat_2_H: number=0;
  RCIKodu: string=""; 
  KullaniciAdi: string=""; 
  Sifre: string=""; 
  CompanyCode: string=""; 
 } 

 export  class CrmParametreModel {
  Code: number=0;
  ParametreAdi: string=""; 
  EkranId: number=0;
  Ekran:string="";
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
  Code: number=0;
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

export enum SorumluBirim {
  Bu = 1,
  Tahsilat = 2,
  Fu = 3, 
  Crm=4,
  Hukuk=5, 
  Rezervasyon=6, 
  KıymetliEvrak=7, 
  Admin=8, 
  Muhasebe=9, 
  Denetim=10, 
  Bilgiİşlem=11, 
  SatınAlma=12, 
  Depo=13, 
  Tapu=14, 
  OpcConf=15, 
  Diğer=16, 
  Yönetim=17, 
  Finans=18, 
  İnsanKaynakları=19, 
  KurumsalPazarlama=20, 
  İnşaat=21,  
  SatisEkibi = 22,
  SatisResepsiyon = 23,
  Fenomen = 24,
  YabanciUye = 25,
  Vefat = 26,
  SorunluUye = 27,
  Havuz = 28,
  KullanimiBiten = 29,
  Egitim = 30,
  RCI = 31, 
  ReConf = 32, 
  TeleAnket = 33, 
  Aysar = 34, 
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
}
 
export class Items {
  DocEntry: number=0;
  ItemCode: string="";
  ItemName: string="";
  ItmsGrpCod: number=0;
  SalUnitMsr: string="";
  ItmsGrpNam: string="";
  Bakiye: number=0;
  DepoKodu:string="";
  Miktar:number=0;
  Aciklama:string="";
  StokDepo:string="";
  StokDepoAdi:string="";
  StokSube:number=0;  
  StokSubeAdi:string="";
  semkey:string="";
  BirimTutar:number=0;
  ToplamTutar:number=0;
  StokFiyat1:number=0;
  OrtFiyat:number=0;
  SonFiyat:number=0;
} 

export class Customer { 
  Code: number=0;
  FirmaKodu: string="";
  FirmaAdi: string="";
  Adres: string="";
  Tel1: string="";
  CariTip: string="";
  HesapTuru:number=0;
  HesapTuruStr:string="";
  ParaBirim:string="";
  VergiD:string="";
  VergiN:string="";
  Fax:string="";
  Iban:string="";
  Mail:string="";
  CHMutYetkili:string="";
  CHMutYetkiliTel:string="";
  CHMutYetkiliMail:string="";
  BABSMutYetkili:string="";
  BABSMutYetkiliTel:string="";
  BABSMutYetkiliMail:string="";
  Onaylayan:number=0;
  OnaylayanAd:string="";
  OnayTarih!:Date;
  OdemeYontemId:number=-1;
  OdemeYontem:string="";
  OnayDurumId:number=0;
  OnayDurum:string="";
  RetAciklama:string="";
  WebAdres:string="";
  GuncelleyenAd:string="";
  EkleyenAd: string=""; 
  Kayit: Date=new Date(); 
  Guncelleme: Date=new Date(); 
} 
 