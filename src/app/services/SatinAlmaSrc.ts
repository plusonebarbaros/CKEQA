import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject } from '@angular/core';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { delay } from 'rxjs/operators'; 
import { isEmpty, map } from 'rxjs/operators';
import { data } from 'jquery';
import moment from 'moment'; 
import { IslemTipi, ReturnValues, Result } from './GenelSrc';
import { KullaniciSrcService } from './KullaniciSrc';

@Injectable({
  providedIn: 'root'
})
export class TalepsrcService {
  private modals: any[] = []; 
  token = sessionStorage.getItem("Token");

  constructor(
      @Inject('semUrl') private semUrl:string,
      private http: HttpClient,
      private kullsrc:KullaniciSrcService
      ) { }

    async  SatinAlmaTalepOlustur(baslik:TalepMaster,satir:TalepDetail[],Tip:IslemTipi):Promise<ReturnValues>  {
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
     }
    ); 

      let options = { headers: headers };

      const body =  JSON.stringify({ 
        "Baslik":  baslik,
        "Satir":  satir,
        "Tip":  Tip,
        "Token":this.token
      });
   
      var result = await this.http.post<any>(this.semUrl+"/SatinAlma/SatinAlmaTalepOlustur", body,options).toPromise();

    var sonuc = JSON.parse(JSON.stringify(result))['Model'];
    return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
   } 

   async  SatinAlmaTalepTekrarOnay(Kalem:TalepDetail,Aciklama:string):Promise<ReturnValues>  {
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
     }
    ); 

      let options = { headers: headers };

      const body =  JSON.stringify({ 
        "Kalem":  Kalem,
        "Aciklama":  Aciklama,
        "Token":this.token
      });
   
      var result = await this.http.post<any>(this.semUrl+"/SatinAlma/SatinAlmaTalepTekrarOnay", body,options).toPromise();

    var sonuc = JSON.parse(JSON.stringify(result))['Model'];
    return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
   } 
   
  async getTalepList(Id:number,durum:string,baslangic:Date,bitis:Date,Kontrol:boolean)
  { 
       let url=this.semUrl+"/SatinAlma/GetTalepList?Id="+Id+"&Durum="+durum+"&Token="+ this.token+"&Kontrol="+ Kontrol+"&Baslangic="+moment(baslangic).format("yyyy-MM-DD")+"&Bitis="+moment(bitis).format("yyyy-MM-DD"); 
        return await this.http.get<Result<TalepMaster[]>>(url).pipe( map((res:any)=> res));
  }

  async getTalepDetayList(Id:number)
  { 
       let url=this.semUrl+"/SatinAlma/GetTalepDetayList?Id="+Id+"&Token="+ this.token; 
        return await this.http.get<Result<TalepDetail[]>>(url).pipe( map((res:any)=> res));
  }

  async GetTeklifHazirlik(baslangic:Date,bitis:Date)
  { 
       let url=this.semUrl+"/SatinAlma/GetTeklifHazirlik?Token="+ this.token; 
        return await this.http.get<Result<TalepDetail[]>>(url).pipe( map((res:any)=> res));
  }
   
   async  TalepKalemSil(baslik:TalepMaster,satir:TalepDetail[]):Promise<ReturnValues>  {
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
     }
    ); 

      let options = { headers: headers };

      const body =  JSON.stringify({ 
        "Baslik":  baslik,
        "Satir":  satir,
        "Token":this.token
      });
   
      var result = await this.http.post<any>(this.semUrl+"/SatinAlma/TalepKalemSil", body,options).toPromise();

    var sonuc = JSON.parse(JSON.stringify(result))['Model'];
    return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
   } 

   async  TalepSil(baslik:TalepMaster[]):Promise<ReturnValues>  {
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
     }
    ); 

      let options = { headers: headers };

      const body =  JSON.stringify({ 
        "Baslik":  baslik, 
        "Token":this.token
      });
   
      var result = await this.http.post<any>(this.semUrl+"/SatinAlma/TalepSil", body,options).toPromise();

    var sonuc = JSON.parse(JSON.stringify(result))['Model'];
    return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
   }

   async  TeklifSil(baslik:ConnTeklifMas[]):Promise<ReturnValues>  {
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
     }
    ); 

      let options = { headers: headers };

      const body =  JSON.stringify({ 
        "Baslik":  baslik, 
        "Token":this.token
      });
   
      var result = await this.http.post<any>(this.semUrl+"/SatinAlma/TeklifSil", body,options).toPromise();

    var sonuc = JSON.parse(JSON.stringify(result))['Model'];
    return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
   }

   async GetTeklifHazirlikList(baslangic:Date,bitis:Date)
  { 
       let url=this.semUrl+"/SatinAlma/GetTeklifHazirlikList?Baslangic="+moment(baslangic).format("yyyy-MM-DD")+"&Bitis="+moment(bitis).format("yyyy-MM-DD")+"&Token="+ this.token; 
        return await this.http.get<Result<TalepDetail>>(url).pipe( map((res:any)=> res));
  }

  async  TeklifHazirlik(baslik:ConnTeklifMas,kalem:TalepDetail[]):Promise<ReturnValues>  {
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
     }
    ); 

      let options = { headers: headers };

      const body =  JSON.stringify({ 
        "Baslik":  baslik, 
        "Kalem":  kalem,  
        "Token":this.token
      });
   
      var result = await this.http.post<any>(this.semUrl+"/SatinAlma/TeklifHazirlik", body,options).toPromise();

    var sonuc = JSON.parse(JSON.stringify(result))['Model'];
    return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
   }

   async GetTeklifList(id:number,baslangic:Date | undefined,bitis:Date | undefined)
  { 
       let url=this.semUrl+"/SatinAlma/GetTeklifList?Id="+id+"&Baslangic="+moment(baslangic).format("yyyy-MM-DD")+"&Bitis="+moment(bitis).format("yyyy-MM-DD")+"&Token="+ this.token; 
        return await this.http.get<Result<ConnTeklifMas>>(url).pipe( map((res:any)=> res));
  }

  async GetTeklifKalemList(Id:number)
  { 
       let url=this.semUrl+"/SatinAlma/GetTeklifKalemList?Id="+Id+"&Token="+ this.token; 
        return await this.http.get<Result<ConnTeklifKalem>>(url).pipe( map((res:any)=> res));
  }

  async GetTeklifFirmaList(Id:number)
  { 
       let url=this.semUrl+"/SatinAlma/GetTeklifFirmaList?Id="+Id+"&Token="+ this.token; 
        return await this.http.get<Result<ConnTeklifFirma>>(url).pipe( map((res:any)=> res));
  }

  async GetTeklifLogList(Id:number)
  { 
       let url=this.semUrl+"/SatinAlma/GetTeklifLogList?Id="+Id+"&Token="+ this.token; 
        return await this.http.get<Result<TeklifLog>>(url).pipe( map((res:any)=> res));
  }

  async GetTeklifKarsilastirmaList(Id:number)
  { 
       let url=this.semUrl+"/SatinAlma/GetTeklifKarsilastirmaList?Id="+Id+"&Token="+ this.token; 
        return await this.http.get<Result<TeklifKarsilastirma>>(url).pipe( map((res:any)=> res));
  }

  async  TeklifGuncelle(baslik:ConnTeklifMas,firma:ConnTeklifFirma[],kalem:ConnTeklifKalem[],Onay:boolean):Promise<ReturnValues>  {
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
     }
    ); 

      let options = { headers: headers };

      const body =  JSON.stringify({ 
        "Baslik":  baslik, 
        "Kalem":  kalem, 
        "Firma":  firma, 
        "Onay":  Onay, 
        "Token":this.token
      });
   
      var result = await this.http.post<any>(this.semUrl+"/SatinAlma/TeklifGuncelle", body,options).toPromise();

    var sonuc = JSON.parse(JSON.stringify(result))['Model'];
    return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
   }

   async  TeklifTamamla(baslik:ConnTeklifMas,firma:ConnTeklifFirma[],kalem:ConnTeklifKalem[],Aciklama:string):Promise<ReturnValues>  {
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
     }
    ); 

      let options = { headers: headers };

      const body =  JSON.stringify({ 
        "Baslik":  baslik, 
        "Kalem":  kalem, 
        "Firma":  firma, 
        "Token":this.token,
        "Aciklama": Aciklama
      });
   
      var result = await this.http.post<any>(this.semUrl+"/SatinAlma/TeklifTamamla", body,options).toPromise();

    var sonuc = JSON.parse(JSON.stringify(result))['Model'];
    return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
   }  

   async  TeklifGeriCek(baslik:ConnTeklifMas,firma:ConnTeklifFirma[],kalem:ConnTeklifKalem[],Aciklama:string):Promise<ReturnValues>  {
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
     }
    ); 

      let options = { headers: headers };

      const body =  JSON.stringify({ 
        "Baslik":  baslik, 
        "Kalem":  kalem, 
        "Firma":  firma, 
        "Aciklama":  Aciklama, 
        "Token":this.token
      });
   
      var result = await this.http.post<any>(this.semUrl+"/SatinAlma/TeklifGeriCek", body,options).toPromise();

    var sonuc = JSON.parse(JSON.stringify(result))['Model'];
    return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
   } 

   async GetOnayBekleyenTeklifList()
   { 
        let url=this.semUrl+"/SatinAlma/GetOnayBekleyenTeklifList?Token="+ this.token; 
        return await this.http.get<Result<ConnTeklifMas>>(url).pipe( map((res:any)=> res));
   } 
 
   async  OnayliTeklifSiparisOlustur(baslik:ConnTeklifMas,firma:ConnTeklifFirma[],kalem:ConnTeklifKalem[]):Promise<ReturnValues>  {
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
     }
    ); 

      let options = { headers: headers };

      const body =  JSON.stringify({ 
        "Baslik":  baslik, 
        "Kalem":  kalem, 
        "Firma":  firma, 
        "Token":this.token
      });
   
      var result = await this.http.post<any>(this.semUrl+"/SatinAlma/OnayliTeklifSiparisOlustur", body,options).toPromise();

    var sonuc = JSON.parse(JSON.stringify(result))['Model'];
    return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
   }  

  async GetAcikSiparisList(id:number,baslangic:Date,bitis:Date)
  { 
       let url=this.semUrl+"/SatinAlma/GetAcikSiparisList?Id="+id+"&Baslangic="+moment(baslangic).format("yyyy-MM-DD")+"&Bitis="+moment(bitis).format("yyyy-MM-DD")+"&Token="+ this.token; 
        return await this.http.get<Result<AcikSiparisKalem>>(url).pipe( map((res:any)=> res));
  }

  async GetSiparisTeslimList(Baslangic:any,Bitis:any,TeslimDurumId:number)
  { 
       let url=this.semUrl+"/SatinAlma/GetSiparisTeslimList?Baslangic="+ moment(Baslangic).format("yyyy-MM-DD")+"&Bitis="+ moment(Bitis).format("yyyy-MM-DD")+"&TeslimDurumId="+ TeslimDurumId+"&Token="+ this.token; 
        return await this.http.get<Result<TalepDetail[]>>(url).pipe( map((res:any)=> res));
  }

  async  SiparisTeslimAl(List:TalepDetail[]):Promise<ReturnValues>  {
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
   
      var result = await this.http.post<any>(this.semUrl+"/SatinAlma/SiparisTeslimAl", body,options).toPromise();

    var sonuc = JSON.parse(JSON.stringify(result))['Model'];
    return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
   }

   async GetTalepKalemTarihce(SatirGuid:string)
  { 
       let url=this.semUrl+"/SatinAlma/GetTalepKalemTarihce?Token="+ this.token+"&SatirGuid="+ SatirGuid; 
        return await this.http.get<Result<TalepDetail[]>>(url).pipe( map((res:any)=> res));
  }

  async GetSiparisMuhsebeKontList(Baslangic:any,Bitis:any,MuhKontrolId:number)
  { 
       let url=this.semUrl+"/SatinAlma/GetSiparisMuhsebeKontList?Baslangic="+ moment(Baslangic).format("yyyy-MM-DD")+"&Bitis="+ moment(Bitis).format("yyyy-MM-DD")+"&MuhKontrolId="+ MuhKontrolId+"&Token="+ this.token; 
        return await this.http.get<Result<TalepDetail[]>>(url).pipe( map((res:any)=> res));
  }

  async  SiparisMuhasebeKont(List:TalepDetail[]):Promise<ReturnValues>  {
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
   
      var result = await this.http.post<any>(this.semUrl+"/SatinAlma/SiparisMuhasebeKont", body,options).toPromise();

    var sonuc = JSON.parse(JSON.stringify(result))['Model'];
    return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
   }

   async GetSiparisSatinalmaKontList(Baslangic:any,Bitis:any,SatKontrolId:number)
  { 
       let url=this.semUrl+"/SatinAlma/GetSiparisSatinalmaKontList?Baslangic="+ moment(Baslangic).format("yyyy-MM-DD")+"&Bitis="+ moment(Bitis).format("yyyy-MM-DD")+"&SatKontrolId="+ SatKontrolId+"&Token="+ this.token; 
        return await this.http.get<Result<TalepDetail[]>>(url).pipe( map((res:any)=> res));
  }

  async  SiparisSatinalmaKont(List:TalepDetail[],DurumId:number,Aciklama:string):Promise<ReturnValues>  {
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
        "DurumId":  DurumId, 
        "Aciklama":  Aciklama, 
        "Token":this.token
      });
   
      var result = await this.http.post<any>(this.semUrl+"/SatinAlma/SiparisSatinalmaKont", body,options).toPromise();

    var sonuc = JSON.parse(JSON.stringify(result))['Model'];
    return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
   }

   async GetDuranVarlikKontrolList(Baslangic:any,Bitis:any,SatKontrolId:number)
   { 
        let url=this.semUrl+"/SatinAlma/GetDuranVarlikKontrolList?Baslangic="+ moment(Baslangic).format("yyyy-MM-DD")+"&Bitis="+ moment(Bitis).format("yyyy-MM-DD")+"&SatKontrolId="+ SatKontrolId+"&Token="+ this.token; 
         return await this.http.get<Result<TalepDetail[]>>(url).pipe( map((res:any)=> res));
   }
 
   async  DuranVarlikIslem(List:TalepDetail[],Data:CON_DURANVARLIK_LIST,DurumId:number):Promise<ReturnValues>  {
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
         "DurumId":  DurumId, 
         "Data":  Data, 
         "Token":this.token
       });
    
       var result = await this.http.post<any>(this.semUrl+"/SatinAlma/DuranVarlikIslem", body,options).toPromise();
 
     var sonuc = JSON.parse(JSON.stringify(result))['Model'];
     return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
    }

    async GetDuranVarlikList(Keyword:string,Tumu:boolean)
    { 
         let url=this.semUrl+"/SatinAlma/GetDuranVarlikList?Keyword="+ Keyword+"&Tumu="+ Tumu+"&Token="+ this.token;
          return await this.http.get<Result<CON_DURANVARLIK_LIST>>(url).pipe( map((res:any)=> res));
    }

   async TeklifFormYazdir(Teklif:ConnTeklifMas,raporid:number,FirmaSira:number,SiparisId:number):Promise<ReturnValues>  {
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
     }
    );
  
      let options = { headers: headers };
  
      const body =  JSON.stringify({
        "Teklif":  Teklif,
        "RaporId":  raporid,
        "FirmaSira":  FirmaSira,
        "SiparisId":  SiparisId,
        "Token":this.token,
      });
  
    var result = await this.http.post<any>(this.semUrl+"/SatinAlma/TeklifFormYazdir", body, options).toPromise();
  
    var sonuc = JSON.parse(JSON.stringify(result))['Model'];
    return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
  }

  async GetTalepIhtiyacDurum()
  { 
       let url=this.semUrl+"/SatinAlma/GetTalepIhtiyacDurum?Token="+ this.token; 
        return await this.http.get<Result<ConnTalepIhtDurum[]>>(url).pipe( map((res:any)=> res));
  }

  async TeklifHazirlikIptal(kalem:TalepDetail[],Aciklama:string):Promise<ReturnValues>  {
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
     }
    ); 

      let options = { headers: headers };

      const body =  JSON.stringify({ 
        "Kalem":  kalem,  
        "Aciklama":  Aciklama,  
        "Token":this.token
      });
   
      var result = await this.http.post<any>(this.semUrl+"/SatinAlma/TeklifHazirlikIptal", body,options).toPromise();

    var sonuc = JSON.parse(JSON.stringify(result))['Model'];
    return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
   }

   async  TalepSatirGuncelle(Kalem:TalepDetail):Promise<ReturnValues>  {
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
     }
    ); 

      let options = { headers: headers };

      const body =  JSON.stringify({ 
        "Kalem":  Kalem,
        "Token":this.token
      });
   
      var result = await this.http.post<any>(this.semUrl+"/SatinAlma/TalepSatirGuncelle", body,options).toPromise();

    var sonuc = JSON.parse(JSON.stringify(result))['Model'];
    return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
   }

   async  TeklifFirmaSatirGuncelle(Baslik:ConnTeklifMas,Firma:ConnTeklifFirma):Promise<ReturnValues>  {
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
     }
    ); 

      let options = { headers: headers };

      const body =  JSON.stringify({ 
        "Baslik":  Baslik,
        "Firma":  Firma,
        "Token":this.token
      });
   
      var result = await this.http.post<any>(this.semUrl+"/SatinAlma/TeklifFirmaSatirGuncelle", body,options).toPromise();

    var sonuc = JSON.parse(JSON.stringify(result))['Model'];
    return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
   }

   async TalepFormYazdir(Talep:TalepMaster,raporid:number):Promise<ReturnValues>  {
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
     }
    );
  
      let options = { headers: headers };
  
      const body =  JSON.stringify({
        "Talep":  Talep,
        "RaporId":  raporid,
        "Token":this.token,
      });
  
    var result = await this.http.post<any>(this.semUrl+"/SatinAlma/TalepFormYazdir", body, options).toPromise();
  
    var sonuc = JSON.parse(JSON.stringify(result))['Model'];
    return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
  }

  async GetTalepKontrolList(Baslangic:any,Bitis:any,TeslimDurumId:number,MuhKontrolId:number,SatKontrolId:number)
  { 
       let url=this.semUrl+"/SatinAlma/GetTalepKontrolList?Baslangic="+ moment(Baslangic).format("yyyy-MM-DD")+"&Bitis="+ moment(Bitis).format("yyyy-MM-DD")+"&TeslimDurumId="+ TeslimDurumId+"&MuhKontrolId="+ MuhKontrolId+"&SatKontrolId="+ SatKontrolId+"&Token="+ this.token;
        return await this.http.get<Result<TalepDetail[]>>(url).pipe( map((res:any)=> res));
  }

  async  TeklifMailGonder(baslik:ConnTeklifMas,firma:ConnTeklifFirma[],kalem:ConnTeklifKalem[]):Promise<ReturnValues>  {
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
     }
    ); 

      let options = { headers: headers };

      const body =  JSON.stringify({ 
        "Baslik":  baslik, 
        "Kalem":  kalem, 
        "Firma":  firma, 
        "Token":this.token
      });
   
      var result = await this.http.post<any>(this.semUrl+"/SatinAlma/TeklifMailGonder", body,options).toPromise();

    var sonuc = JSON.parse(JSON.stringify(result))['Model'];
    return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
   } 

   async GetDashBoardStats()
  { 
       let url=this.semUrl+"/SatinAlma/GetDashBoardStats?Token="+ this.token;
        return await this.http.get<Result<TalepDashStatsModel>>(url).pipe( map((res:any)=> res));
  }

  async  TeklifIptal(baslik:ConnTeklifMas,Aciklama:string):Promise<ReturnValues>  {
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
     }
    ); 

      let options = { headers: headers };

      const body =  JSON.stringify({ 
        "Baslik":  baslik, 
        "Aciklama":  Aciklama, 
        "Token":this.token
      });
   
      var result = await this.http.post<any>(this.semUrl+"/SatinAlma/TeklifIptal", body,options).toPromise();

    var sonuc = JSON.parse(JSON.stringify(result))['Model'];
    return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
   }  

}

export class CON_DURANVARLIK_LIST {
  ItemCode:string="";
  ItemName:string="";
  BuyUnitMsr:string="";
  CapDate:any;
  Miktar:number=0;
  Fiyat:number=0;
}

export class TalepDashStatsModel {
  TeslimBekleyen:number=0; 
  MuhasebeKontrol:number=0; 
  SatinAlmaKontrol:number=0; 
  TeklifHazirlik:number=0; 
  ToplamTalep:number=0; 
  OnayBekleyenTalep:number=0; 
  ToplamTeklif:number=0; 
  OnayBekleyenTeklif:number=0; 
  SiparisTeklif:number=0; 
  BekleyenOnay:number=0; 
}

export class ConnTalepIhtDurum {
  Id:number=0; 
  Adi:string="";
  Aktif:boolean=false;
  Sira:number=0;
}

export class TalepTarihceModel {
  Id:number=0;
  Tarih:any;
  Aciklama:string="";
  IslemYapan:string="";
}

export class TeklifLog {
  Id:number=0;
  TeklifId:number=0;
  Aciklama:string="";
  EkleyenId:number=0; 
  Ekleyen:string="";
  EkTarih:any;
}

export class UretimTeklifDetayModel {    
  Id:number=0;
  MasterId:number=0; 
  StokKodu: string="";
  StokAdi: string="";
  Adet:number=0;
  TeklifFiyat:number=0;
  OrtFiyat:number=0;
  SonFiyat:number=0;
  ToplamTeklifFiyat:number=0;
  ToplamOrtFiyat:number=0;
  ToplamSonFiyat:number=0;
  ParaBirim: string="";
  Aciklama: string="";
  EkleyenId:number=0; 
  Ekleyen:string="";
  GuncelleyenId:number=0; 
  Guncelleyen:string="";  
} 
export class UretimTeklifModel {    
  Id:number=0;
  Tarih:any;
  DurumId:number=0;
  Durum: string="";
  FirmaKodu: string="";
  FirmaAdi: string="";
  Aciklama: string="";
  EkleyenId:number=0; 
  Ekleyen:string="";
  GuncelleyenId:number=0; 
  Guncelleyen:string="";  
} 
export class AcikSiparisKalem {    
  Id:number=0;
  LineNum:number=0;
  vtIndex:number=0;
  FirmaKodu: string="";
  FirmaAdi: string="";
  UrunKodu: string="";
  UrunAdi: string="";
  DepoKodu: string="";
  DepoAdi: string="";
  Miktar: number=0;
  AcikMiktar: number=0;
  DepoStok: number=0;
  Birim:string="" 
  Fiyat:number=0; 
  Toplam:number=0; 
  ParaBirimi:string="";
  Aciklama: string="";
  EkleyenId:number=0; 
  Ekleyen:string="";
  SatirGuid:string="";
} 
export class ConnTeklifKalem {    
    Id:number=0;
    TeklifId:number=0;
    TalepId:number=0;
    TalepNo:number=0;
    StokKodu: string="";
    StokAdi: string="";
    TalepMiktar:number=0;
    TeklifMiktar:number=0;
    DepoKodu: string="";
    DepoAdi: string="";
    TalepAciklama: string="";
    TeklifAciklama: string="";
    Firma1Kodu:string="";
    Firma1Adi:string="";
    Firma1IlkFiyat:number=0;
    Firma1RevFiyat:number=0;
    Firma1SonFiyat:number=0;
    Firma1Toplam:number=0;
    Firma1RevToplam:number=0;
    Firma1SonFiyatToplam:number=0;
    Firma1SonFiyatToplamTRY:number=0;
    Firma1ParaBirimi:string=""; 
    Firma2Kodu:string="";
    Firma2Adi:string="";
    Firma2IlkFiyat:number=0;
    Firma2RevFiyat:number=0;
    Firma2SonFiyat:number=0;
    Firma2Toplam:number=0;
    Firma2RevToplam:number=0;
    Firma2SonFiyatToplam:number=0;
    Firma2SonFiyatToplamTRY:number=0;
    Firma2ParaBirimi:string=""; 
    Firma3Kodu:string="";
    Firma3Adi:string="";
    Firma3IlkFiyat:number=0;
    Firma3RevFiyat:number=0;
    Firma3SonFiyat:number=0;
    Firma3Toplam:number=0;
    Firma3RevToplam:number=0;
    Firma3SonFiyatToplam:number=0;
    Firma3SonFiyatToplamTRY:number=0;
    Firma3ParaBirimi:string=""; 
    Firma4Kodu:string="";
    Firma4Adi:string="";
    Firma4IlkFiyat:number=0;
    Firma4RevFiyat:number=0;
    Firma4SonFiyat:number=0;
    Firma4Toplam:number=0;
    Firma4RevToplam:number=0;
    Firma4SonFiyatToplam:number=0;
    Firma4SonFiyatToplamTRY:number=0;
    Firma4ParaBirimi:string=""; 
    Firma5Kodu:string="";
    Firma5Adi:string="";
    Firma5IlkFiyat:number=0;
    Firma5RevFiyat:number=0;
    Firma5SonFiyat:number=0;
    Firma5Toplam:number=0;
    Firma5RevToplam:number=0;
    Firma5SonFiyatToplam:number=0;
    Firma5SonFiyatToplamTRY:number=0;
    Firma5ParaBirimi:string=""; 
    SapTeklifNo:number=0;
    SapSiparisNo:number=0;
    Firma1Secildi:boolean=false;
    Firma2Secildi:boolean=false;
    Firma3Secildi:boolean=false;
    Firma4Secildi:boolean=false;
    Firma5Secildi:boolean=false;
    Firma1SecildiSat:boolean=false;
    Firma2SecildiSat:boolean=false;
    Firma3SecildiSat:boolean=false;
    Firma4SecildiSat:boolean=false;
    Firma5SecildiSat:boolean=false;

    OnaylananFirmaKodu:string=""; 
    OnaylananFirmaAdi:string=""; 
    OnaylayanId:number=0;
    Onaylayan:string="";
    OnayTarih: any;
    validkey:string="";
    semkey:string="";
    Aktif:boolean=true;
    EkleyenId:number=0; 
    Ekleyen:string="";
    GuncelleyenId:number=0;
    Guncelleyen:string="";
    EkTarih:any;
    GuncelTarih:any;
    AcikMiktar:number=0;
    TeslimAlinanMiktar:number=0;
    DurumId:number=0;
    Durum:string="";    
    SatirGuid:string="";  
    TahminiTutar:number=0;  
    BirimId:number=0;
    Birim:string="" 
    TalepDurumId:number=0;
    TalepIhtDurum:string="";

    FirmaTercihYapildi:boolean=false;
    Firma1Kur:number=0;
    Firma2Kur:number=0;
    Firma3Kur:number=0;
    Firma4Kur:number=0;
    Firma5Kur:number=0;
  }  

export class ConnTeklifFirma {
  Id:number=0;
  TeklifId:number=0;
  FirmaKodu:string="";
  FirmaAdi:string="";
  ParaBirim:string="";
  Email:string="";
  Toplam:number=0;  
  RevToplam:number=0;  
  SonFiyatToplam:number=0;  
  SonFiyatToplamTRY:number=0;  
  RevOran:number=0;  
  SiparisToplam:number=0;
  SiparisToplamTRY:number=0;
  VadeGun:number=0;
  Aciklama:string="";
  CalismaSekliId:number=0;
  CalismaSekli:string="";
  EkleyenId:number=0; 
  Ekleyen:string="";
  GuncelleyenId:number=0;
  Guncelleyen:string="";
  EkTarih:any;
  GuncelTarih:any;
  KurTarih:any;
  Kur:number=0;
}

export class TeklifKarsilastirma {    
    Id:number=0;
    LineId:number=0;
    vtIndex:number=0;
    DepoKodu: string="";
    DepoAdi: string="";
    Aciklama: string="";
    StokKodu: string="";
    StokAdi: string="";
    TeklifMiktar:number=0;
    Birim:string="" 
    CardCode:string="";
    CardName:string="";
    ParaBirimi:string="";
    Tutar: number=0;
    Toplam: number=0;
    SatirGuid:string="";
    KalemGuid:string="";    
    SiparisNo:number=0; 
    SiparisSatirNo:number=0;
    
  }  
export class ConnTeklifMas{
  Id:number=0;
  TalepId:number=0;
  Tarih: Date=new Date(); 
  Aciklama: string="";   
  SapSirketId:string="";
  DurumId:number=0;
  Durum:string=""; 
  OnayDurum:string="";
  EkleyenId:number=0; 
  Ekleyen:string="";
  GuncelleyenId:number=0;
  Guncelleyen:string="";
  EkTarih:any;
  GuncelTarih:any;
  OnayId:number=0;
  Firma1Kodu:string="";
  Firma2Kodu:string="";
  Firma3Kodu:string="";
  Firma4Kodu:string="";
  Firma5Kodu:string="";
  Firma1Adi:string="";
  Firma2Adi:string="";
  Firma3Adi:string="";
  Firma4Adi:string="";
  Firma5Adi:string="";
  Firma1ParaBirimi:string="";
  Firma2ParaBirimi:string="";
  Firma3ParaBirimi:string="";
  Firma4ParaBirimi:string="";
  Firma5ParaBirimi:string="";
  semkey:string="";
  validkey:string="";
  Aktif:boolean=true; 
  FirmaSira:number=0;
}

export class TalepMaster {  
  Id:number=0;
  Tarih: any; 
  Aciklama: string="";
  SapSirket: string="";
  SapSirketId: string="";
  Durum:string="";
  DurumStr:string=""; 
  DurumId:number=0; 
  OnayDurum:string="";
  EkleyenId:number=0; 
  Ekleyen:string="";
  GuncelleyenId:number=0;
  Guncelleyen:string="";
  EkTarih:any; 
  GuncelTarih:any; 
  validkey:string="";
  AlimYapildi:string="";
  TalepTuru:string="";
  TalepTuruStr:string="";
  FirmaKodu:string="";
  FirmaAdi:string="";
  Aktif:boolean=false;
}  

export class TalepDetail {  
  Id:number=0;
  TalepId:number=0;
  OnayId:number=0;
  StokKodu: string="";
  StokAdi: string="";
  Aciklama: string="";
  DepoKodu: string="";
  DepoAdi: string=""; 
  SapSirketId: string="";
  SapSirket: string="";
  BirimId:number=0;
  Birim:string="" 
  Miktar: number=0;
  KaynakDepoStok:number=0;
  TalepMiktar:number=0;
  OnaylananMiktar:number=0;
  DepoStok:number=0;  
  TalepNo:number=0; 
  Bakiye:number=0;
  Durum:String="Y";
  TalepDurum:string="";
  DurumStr:string="";
  SatirGuid:string="";
  EkleyenId:number=0; 
  Ekleyen:string="";
  GuncelleyenId:number=0;
  Guncelleyen:string="";
  EkTarih:any; 
  GuncelTarih:any;  
  TeklifHazirlikNo:number=0; 
  TeklifHazirlikGuid:string="";
  TeklifMiktar:number=0;
  TahminiTutar:number=0;
  BirimTutar:number=0;
  ToplamTutar:number=0;
  KdvOran:string="";
  validkey:string="";
  AlimYapildi:string="";
  TalepTuru:string="";
  TalepTuruStr:string="";
  FirmaKodu:string="";
  FirmaAdi:string="";
  Onaylayacak:string="";
  Kalan:number=0;
  OnayAciklama:string="";
  SonAlisFiyat:number=0;
  OrtalamaAlisFiyat:number=0;
  SonAlisMiktar:number=0;
  BelgeBase64:string="";
  BelgeAdi:string="";
  BelgeUzanti:string="";
  Aktif:boolean=false;
  TeslimMiktar:number=0;
  KalanMiktar:number=0;
  BelgeNo:string="";
  BelgeTarih:any; 
  GirisMiktar:number=0;
  DurumId:number=0;
  Departman:string="";
  Pozisyon:string="";
  Files:number=0;
  Base64List:ItemsFile[]=[];
  SiparisTarih:any;
  SiparisNo:number=0;
  SiparisFirmaKodu:string="";
  SiparisFirmaAdi:string="";
  SatinAlmaKontrolAciklama:string="";
  TalepDurumId:number=0;
  TalepIhtDurum:string="";

  MuhKonrtol:number=0;
  MuhKontrolEdenId:number=0;
  MuhKontrolEden:string="";
  MuhKontrolTarih:any; 

  SatinAlmaKontrol:number=0;
  SatinAlmaKontrolEdenId:number=0;
  SatinAlmaKontrolEden:string="";
  SatinAlmaKontrolTarih:any; 

  DuranVarlikDurumId:number=0;
  DuranVarlikIslemTarih:any; 
  DuranVarlikIslemYapanId:number=0;
  DuranVarlikIslemYapan:string="";
  DuranVarlikSiparisId:number=0;
  DuranVarlikUrunKodu:string="";
  DuranVarlikUrunAdi:string="";

  TransferMiktar:number=0;
  GrupAdi:string="";
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

  
export class SatisSiparis { 
      ID:number=0;
      Source: string=""; 
      Snrf: string=""; 
      DocumentDate: Date=new Date(); 
      DocumentTime: string=""; 
      SenderMailboxId: string=""; 
      ReceiverMailboxId: string=""; 
      OrderType: string=""; 
      OrderNumber: string=""; 
      OrderDate: Date=new Date(); 
      DeliveryDate: Date=new Date(); 
      FreeTextField: string=""; 
      GLNBuyer: string=""; 
      GLNShipTo: string=""; 
      GLNInvoicee: string=""; 
      GLNSupplier: string=""; 
      SupplierCode: string=""; 
      Currency: string=""; 
      OlusturmaTarihi: Date=new Date(); 
      Olusturan: string=""; 
      TransferEdildi:number=0;
      Kapali:number=0;
      AktarimTarihi: Date=new Date(); 
      Aktaran: string=""; 
      KalemID:number=0;
      SiparisID: string=""; 
      DetailNumber: string=""; 
      ItemEanBarcode: string=""; 
      ItemSenderCode: string=""; 
      ItemReceiverCode: string=""; 
      ItemDescription: string=""; 
      ItemGrossWeight: string=""; 
      ItemNetWeight: string=""; 
      ItemOrderedQuantity:number=0;
      CustomQuantity:number=0;
      ItemOrderedQuantityUom: string=""; 
      QuantityPerPack: string=""; 
      ItemGrossPrice:number=0;
      ItemNetPrice:number=0;
      SAPPrice:number=0;
      SAPQuantity:number=0;		 			  
      Silindi:number=0;		 			
      
      Marka: string=""; 
      SatirToplami: number=0; 
      LineTotalKDV: number=0; 
      StokBakiye: number=0; 
      Durum: string=""; 
      
    AdresTanim: string=""; 
    SalesVatPrcnt: number=0; 
    Renklendirme: number=0; 
}  

export class mIptalSiparis { 
  ID:number=0;
  Source: string=""; 
  Snrf: string=""; 
  DocumentDate: Date=new Date(); 
  OrderNumber: string=""; 
  OrderDate: Date=new Date(); 
  DeliveryDate: Date=new Date(); 
  SAPCardCode: string=""; 
  SAPCardName: string=""; 
} 
export class MapSiparisIptal { 
  ID:number=0;
  Iptal: number=0; 
  Token: string=""; 
}

export class ItemsFile { 
  BelgeBase64:string="";
  BelgeAdi:string="";
  BelgeUzanti:string="";
  } 
 
  export class Items {    
    DocEntry: number=0;
    ItemCode: string="";
    ItemName: string="";
    ItmsGrpCod: number=0;
    ItmsGrpNam: string="";
    Bakiye: number=0;
    DepoKodu:string="";
    DepoAdi:string="";
    Miktar:number=0;
    Aciklama:string="";
    StokDepo:string="";
    StokDepoAdi:string="";
    StokSube:number=0;  
    StokSubeAdi:string="";
    semkey:string="";
    BirimTutar:number=0;
    IskontoOran:number=0; 
    ToplamTutar:number=0; 
    StokFiyat1:number=0;
    OrtFiyat:number=0;
    SonFiyat:number=0;
    BelgeBase64:string="";
    BelgeAdi:string="";
    BelgeUzanti:string="";
    BirimId:number=0;
    Birim:string="";
    Files:number=0;
    TalepDurumId:number=1; 
    Base64List:ItemsFile[]=[];
    SeriLot:string="";
    } 
   