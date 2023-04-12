import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject } from '@angular/core';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Result, ReturnValues, ReturnValuesList } from '../Genel/genelsrv';
import { isEmpty, map } from 'rxjs/operators';
import { data } from 'jquery';
import moment from 'moment'; 
import { IslemTipi } from '../Onay/onay-surev-src.service';
import { KullaniciSrcService } from '../kullanici/kullanici-src.service';

@Injectable({
  providedIn: 'root'
})
export class TalepsrcService {
  private modals: any[] = []; 
  empid = sessionStorage.getItem("EmpId");

  constructor(
      @Inject('semUrl') private semUrl:string,
      private http: HttpClient,
      private kullsrc:KullaniciSrcService
      ) { }

    async  talepEkle(baslik:TalepMaster,satir:TalepDetail[]):Promise<ReturnValues>  {
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
        "Token":this.kullsrc.token
      });
   
      var result = await this.http.post<any>(this.semUrl+"/SatinAlma/YeniTalep", body,options).toPromise();

    var sonuc = JSON.parse(JSON.stringify(result))['Model'];
    return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
   } 
   
  async getTalepList(docentry:number,durum:string,baslangic:Date,bitis:Date,Kontrol:boolean)
  { 
       let url=this.semUrl+"/SatinAlma/GetTalepList?DocEntry="+docentry+"&Durum="+durum+"&Token="+ this.kullsrc.token+"&Kontrol="+ Kontrol+"&Baslangic="+moment(baslangic).format("yyyy-MM-DD")+"&Bitis="+moment(bitis).format("yyyy-MM-DD"); 
        return await this.http.get<Result<TalepMaster[]>>(url).pipe( map((res:any)=> res));
  }

  async getTalepDetayList(docentry:number)
  { 
       let url=this.semUrl+"/SatinAlma/GetTalepDetayList?DocEntry="+docentry+"&Token="+ this.kullsrc.token; 
        return await this.http.get<Result<TalepDetail[]>>(url).pipe( map((res:any)=> res));
  }

  async GetOnayBekleyenTalepDetayList()
  { 
       let url=this.semUrl+"/SatinAlma/GetOnayBekleyenTalepDetayList?EmpId="+this.empid+"&Token="+ this.kullsrc.token; 
       return await this.http.get<Result<TalepDetail[]>>(url).pipe( map((res:any)=> res));
  } 

  async getTransferList(docentry:number,Kontrol:boolean,durum:string)
  { 
       let url=this.semUrl+"/SatinAlma/GetTransferList?DocEntry="+docentry+"&Kontrol="+Kontrol+"&Durum="+durum+"&Token="+ this.kullsrc.token; 
        return await this.http.get<Result<TalepMaster[]>>(url).pipe( map((res:any)=> res));
  }

  async getTransferDetayList(docentry:number)
  { 
       let url=this.semUrl+"/SatinAlma/GetTransferDetayList?DocEntry="+docentry+"&Token="+ this.kullsrc.token; 
        return await this.http.get<Result<TalepDetail[]>>(url).pipe( map((res:any)=> res));
  }

  async  transferEkle(baslik:TalepMaster,satir:TalepDetail[]):Promise<ReturnValues>  {
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
        "Token":this.kullsrc.token
      });
   
      var result = await this.http.post<any>(this.semUrl+"/SatinAlma/YeniTransfer", body,options).toPromise();

    var sonuc = JSON.parse(JSON.stringify(result))['Model'];
    return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
   } 

   async GetOnayBekleyenTransferDetayList()
  { 
       let url=this.semUrl+"/SatinAlma/GetOnayBekleyenTransferDetayList?EmpId="+this.empid+"&Token="+ this.kullsrc.token; 
       return await this.http.get<Result<TalepDetail[]>>(url).pipe( map((res:any)=> res));
  } 

  async getBekleyenTransferler(durum:string)
  { 
       let url=this.semUrl+"/SatinAlma/GetBekleyenTransferler?Durum="+durum+"&Token="+ this.kullsrc.token; 
        return await this.http.get<Result<TalepDetail[]>>(url).pipe( map((res:any)=> res));
  }

  async  transferIslem(satir:TalepDetail[],durum:boolean,bolum:string,aciklama:string):Promise<ReturnValues>  {
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
     }
    ); 

      let options = { headers: headers };

      const body =  JSON.stringify({ 
        "Satir":  satir,
        "Durum":  durum,
        "Bolum":  bolum,
        "Aciklama":  aciklama,
        "Token":this.kullsrc.token
      });
   
      var result = await this.http.post<any>(this.semUrl+"/SatinAlma/TransferBekleyenIslem", body,options).toPromise();

    var sonuc = JSON.parse(JSON.stringify(result))['Model'];
    return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
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
        "Token":this.kullsrc.token
      });
   
      var result = await this.http.post<any>(this.semUrl+"/SatinAlma/TalepKalemSil", body,options).toPromise();

    var sonuc = JSON.parse(JSON.stringify(result))['Model'];
    return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
   } 

   async  TransferKalemSil(baslik:TalepMaster,satir:TalepDetail[]):Promise<ReturnValues>  {
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
        "Token":this.kullsrc.token
      });
   
      var result = await this.http.post<any>(this.semUrl+"/SatinAlma/TransferKalemSil", body,options).toPromise();

    var sonuc = JSON.parse(JSON.stringify(result))['Model'];
    return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
   }
   
   async  TransferSil(baslik:TalepMaster[]):Promise<ReturnValues>  {
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
        "Token":this.kullsrc.token
      });
   
      var result = await this.http.post<any>(this.semUrl+"/SatinAlma/TransferSil", body,options).toPromise();

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
        "Token":this.kullsrc.token
      });
   
      var result = await this.http.post<any>(this.semUrl+"/SatinAlma/TalepSil", body,options).toPromise();

    var sonuc = JSON.parse(JSON.stringify(result))['Model'];
    return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
   }

   async  TeklifSil(baslik:Teklif[]):Promise<ReturnValues>  {
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
        "Token":this.kullsrc.token
      });
   
      var result = await this.http.post<any>(this.semUrl+"/SatinAlma/TeklifSil", body,options).toPromise();

    var sonuc = JSON.parse(JSON.stringify(result))['Model'];
    return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
   }

   async GetTeklifHazirlikList(baslangic:Date,bitis:Date)
  { 
       let url=this.semUrl+"/SatinAlma/GetTeklifHazirlikList?Baslangic="+moment(baslangic).format("yyyy-MM-DD")+"&Bitis="+moment(bitis).format("yyyy-MM-DD")+"&Token="+ this.kullsrc.token; 
        return await this.http.get<Result<TalepDetail>>(url).pipe( map((res:any)=> res));
  }

  async  TeklifHazirlik(baslik:Teklif,firma:TeklifFirma[],kalem:TalepDetail[]):Promise<ReturnValues>  {
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
        "Token":this.kullsrc.token
      });
   
      var result = await this.http.post<any>(this.semUrl+"/SatinAlma/TeklifHazirlik", body,options).toPromise();

    var sonuc = JSON.parse(JSON.stringify(result))['Model'];
    return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
   }

   async GetTeklifList(id:number,baslangic:Date,bitis:Date)
  { 
       let url=this.semUrl+"/SatinAlma/GetTeklifList?DocEntry="+id+"&Baslangic="+moment(baslangic).format("yyyy-MM-DD")+"&Bitis="+moment(bitis).format("yyyy-MM-DD")+"&Token="+ this.kullsrc.token; 
        return await this.http.get<Result<TalepDetail>>(url).pipe( map((res:any)=> res));
  }

  async GetTeklifKalemList(docentry:number)
  { 
       let url=this.semUrl+"/SatinAlma/GetTeklifKalemList?DocEntry="+docentry+"&Token="+ this.kullsrc.token; 
        return await this.http.get<Result<TeklifDetail>>(url).pipe( map((res:any)=> res));
  }

  async GetTeklifFirmaList(docentry:number)
  { 
       let url=this.semUrl+"/SatinAlma/GetTeklifFirmaList?DocEntry="+docentry+"&Token="+ this.kullsrc.token; 
        return await this.http.get<Result<TeklifFirma>>(url).pipe( map((res:any)=> res));
  }

  async GetTeklifKarsilastirmaList(docentry:number)
  { 
       let url=this.semUrl+"/SatinAlma/GetTeklifKarsilastirmaList?DocEntry="+docentry+"&Token="+ this.kullsrc.token; 
        return await this.http.get<Result<TeklifKarsilastirma>>(url).pipe( map((res:any)=> res));
  }

  async  TeklifGuncelle(baslik:Teklif,firma:TeklifFirma[],kalem:TeklifDetail[]):Promise<ReturnValues>  {
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
        "Token":this.kullsrc.token
      });
   
      var result = await this.http.post<any>(this.semUrl+"/SatinAlma/TeklifGuncelle", body,options).toPromise();

    var sonuc = JSON.parse(JSON.stringify(result))['Model'];
    return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
   }

   async  TeklifTamamla(baslik:Teklif,firma:TeklifFirma[],kalem:TeklifDetail[]):Promise<ReturnValues>  {
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
        "Token":this.kullsrc.token
      });
   
      var result = await this.http.post<any>(this.semUrl+"/SatinAlma/TeklifTamamla", body,options).toPromise();

    var sonuc = JSON.parse(JSON.stringify(result))['Model'];
    return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
   }  

   async GetOnayBekleyenTeklifList()
   { 
        let url=this.semUrl+"/SatinAlma/GetOnayBekleyenTeklifList?Token="+ this.kullsrc.token; 
        return await this.http.get<Result<Teklif>>(url).pipe( map((res:any)=> res));
   } 
 
   async  OnayliTeklifSiparisOlustur(baslik:Teklif,firma:TeklifFirma[],kalem:TeklifDetail[]):Promise<ReturnValues>  {
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
        "Token":this.kullsrc.token
      });
   
      var result = await this.http.post<any>(this.semUrl+"/SatinAlma/OnayliTeklifSiparisOlustur", body,options).toPromise();

    var sonuc = JSON.parse(JSON.stringify(result))['Model'];
    return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
   }  

   async GetTalepKontrolList(durum:string="B",baslangic:Date,bitis:Date):Promise<ReturnValuesList<TalepDetail>>  {
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
     }
    ); 
  
      let options = { headers: headers };
  
      const body =  JSON.stringify({ 
        "Durum":  durum,    
        "Baslangic":  moment(baslangic).format("yyyy-MM-DD"),    
        "Bitis":  moment(bitis).format("yyyy-MM-DD"),     
        "Token":this.kullsrc.token, 
      });
  
    var result = await this.http.post<any>(this.semUrl+"/SatinAlma/GetTalepKontrolList", body, options).toPromise();
  
    var sonuc = JSON.parse(JSON.stringify(result)); 
  
    return new ReturnValuesList( sonuc.Model["Id"], sonuc.Model["Success"], sonuc.Model["Message"] ?? "", sonuc.Model["Token"] ?? "",sonuc.Model["List"]);
  } 

  async GetTransferKontrolList(durum:string="B",baslangic:Date,bitis:Date):Promise<ReturnValuesList<TalepDetail>>  {
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
     }
    ); 
  
      let options = { headers: headers };
  
      const body =  JSON.stringify({ 
        "Durum":  durum,    
        "Baslangic":  moment(baslangic).format("yyyy-MM-DD"),    
        "Bitis":  moment(bitis).format("yyyy-MM-DD"),     
        "Token":this.kullsrc.token, 
      });
  
    var result = await this.http.post<any>(this.semUrl+"/SatinAlma/GetTransferKontrolList", body, options).toPromise();
  
    var sonuc = JSON.parse(JSON.stringify(result)); 
  
    return new ReturnValuesList( sonuc.Model["Id"], sonuc.Model["Success"], sonuc.Model["Message"] ?? "", sonuc.Model["Token"] ?? "",sonuc.Model["List"]);
  } 

  async TalepFormYazdir(data:TalepMaster,transfer:boolean):Promise<ReturnValues>  {
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
     }
    ); 
  
      let options = { headers: headers };
  
      const body =  JSON.stringify({ 
        "Baslik":  data,    
        "Transfer":  transfer,    
        "Token":this.kullsrc.token, 
      });
  
    var result = await this.http.post<any>(this.semUrl+"/SatinAlma/TalepFormYazdir", body, options).toPromise();
  
    var sonuc = JSON.parse(JSON.stringify(result))['Model'];
    return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
} 

  async TransferFormYazdir(data:TalepMaster):Promise<ReturnValues>  {
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
    }
    ); 

      let options = { headers: headers };

      const body =  JSON.stringify({ 
        "Baslik":  data,    
        "Token":this.kullsrc.token, 
      });

    var result = await this.http.post<any>(this.semUrl+"/SatinAlma/TransferFormYazdir", body, options).toPromise();

    var sonuc = JSON.parse(JSON.stringify(result))['Model'];
    return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
  } 

  async GetAcikSiparisList(id:number,baslangic:Date,bitis:Date)
  { 
       let url=this.semUrl+"/SatinAlma/GetAcikSiparisList?DocEntry="+id+"&Baslangic="+moment(baslangic).format("yyyy-MM-DD")+"&Bitis="+moment(bitis).format("yyyy-MM-DD")+"&Token="+ this.kullsrc.token; 
        return await this.http.get<Result<AcikSiparisKalem>>(url).pipe( map((res:any)=> res));
  }

  async  AcikSiparisKalemKapat(baslik:AcikSiparisKalem[]):Promise<ReturnValues>  {
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
     }
    ); 

      let options = { headers: headers };

      const body =  JSON.stringify({ 
        "Kalem":  baslik, 
        "Token":this.kullsrc.token
      });
   
      var result = await this.http.post<any>(this.semUrl+"/SatinAlma/AcikSiparisKalemKapat", body,options).toPromise();

    var sonuc = JSON.parse(JSON.stringify(result))['Model'];
    return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
   }

   async GetTeklifKontrolList(id:number,baslangic:Date,bitis:Date)
  { 
       let url=this.semUrl+"/SatinAlma/GetTeklifKontrolList?DocEntry="+id+"&Baslangic="+moment(baslangic).format("yyyy-MM-DD")+"&Bitis="+moment(bitis).format("yyyy-MM-DD")+"&Token="+ this.kullsrc.token; 
        return await this.http.get<Result<TeklifDetail>>(url).pipe( map((res:any)=> res));
  }

  async  UretimTeklifEkle(data:UretimTeklifModel,list:UretimTeklifModel[]=[],islemtip:IslemTipi):Promise<ReturnValues>  {
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
     }
    ); 

      let options = { headers: headers };

      const body =  JSON.stringify({ 
        "Data":  data, 
        "List":  list, 
        "Tip":  islemtip, 
        "Token":this.kullsrc.token
      });
   
      var result = await this.http.post<any>(this.semUrl+"/SatinAlma/UretimTeklifEkle", body,options).toPromise();

    var sonuc = JSON.parse(JSON.stringify(result))['Model'];
    return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
   }

   async GetUretimTeklif(id:number,baslangic:Date,bitis:Date)
  { 
       let url=this.semUrl+"/SatinAlma/GetUretimTeklif?DocEntry="+id+"&Baslangic="+moment(baslangic).format("yyyy-MM-DD")+"&Bitis="+moment(bitis).format("yyyy-MM-DD")+"&Token="+ this.kullsrc.token; 
        return await this.http.get<Result<UretimTeklifModel>>(url).pipe( map((res:any)=> res));
  }

  async  UretimTeklifDetayEkle(data:UretimTeklifDetayModel,list:UretimTeklifDetayModel[]=[],islemtip:IslemTipi):Promise<ReturnValues>  {
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
     }
    ); 

      let options = { headers: headers };

      const body =  JSON.stringify({ 
        "Data":  data, 
        "List":  list, 
        "Tip":  islemtip, 
        "Token":this.kullsrc.token
      });
   
      var result = await this.http.post<any>(this.semUrl+"/SatinAlma/UretimTeklifDetayEkle", body,options).toPromise();

    var sonuc = JSON.parse(JSON.stringify(result))['Model'];
    return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
   }

   async GetUretimTeklifDetay(id:number,masterid:number)
  { 
       let url=this.semUrl+"/SatinAlma/GetUretimTeklifDetay?DocEntry="+id+"&MasterId="+masterid+"&Token="+ this.kullsrc.token; 
        return await this.http.get<Result<UretimTeklifDetayModel>>(url).pipe( map((res:any)=> res));
  }


}


export class UretimTeklifDetayModel {    
  DocEntry:number=0;
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
  DocEntry:number=0;
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
  DocEntry:number=0;
  LineNum:number=0;
  vtIndex:number=0;
  FirmaKodu: string="";
  FirmaAdi: string="";
  UrunKodu: string="";
  UrunAdi: string="";
  DepoKodu: String="";
  DepoAdi: String="";
  Miktar: number=0;
  AcikMiktar: number=0;
  DepoStok: number=0;
  Birim:string="" 
  Fiyat:number=0; 
  Toplam:number=0; 
  ParaBirimi:String="";
  Aciklama: string="";
  EkleyenId:number=0; 
  Ekleyen:string="";
  SatirGuid:string="";
} 
export class TeklifDetail {    
    DocEntry:number=0;
    LineId:number=0;
    vtIndex:number=0;
    StokKodu: string="";
    StokAdi: string="";
    Aciklama: string="";
    DepoKodu: String="";
    DepoAdi: String="";
    SubeId: number=0;
    Birim:string="" 
    TeklifMiktar:number=0;
    TalepMiktar:number=0;
    SiparisMiktar:number=0;
    AcikMiktar:number=0;
    TeslimAlinanMiktar:number=0;
    TalepNo:number=0; 
    Durum:String="Y";
    DurumStr:String="";
    SatirGuid:string="";
    Ekleyen:number=0; 
    EkleyenAd:string="";
    Guncelleyen:number=0;
    GuncelleyenAd:string="";
    Kayit:Date=new Date();
    Guncelleme:Date=new Date();
    TeklifHazirlikNo:number=0; 
    TeklifHazirlikGuid:string="";
    Firma1Kodu:string="";
    Firma1Adi:string="";
    Firma1Tutar:number=0;
    Firma1Toplam:number=0;
    Firma1ParaBirimi:string=""; 
    Firma2Kodu:string="";
    Firma2Adi:string="";
    Firma2Tutar:number=0;
    Firma2Toplam:number=0;
    Firma2ParaBirimi:string=""; 
    Firma3Kodu:string="";
    Firma3Adi:string="";
    Firma3Tutar:number=0;
    Firma3Toplam:number=0;
    Firma3ParaBirimi:string=""; 
    SiparisNo:number=0;
    SiparisSatirNo:number=0;
    TeklifNo:number=0;
    TeklifSatirNo:number=0;
    TercihFirmKodu:string=""; 
    TercihFirmAdi:string=""; 
    Firma1Secildi:boolean=false;
    Firma2Secildi:boolean=false;
    Firma3Secildi:boolean=false;
    OnaylananFirma:string=""; 
    OnaylananFirmaAdi:string=""; 
    SonAlisFiyat:number=0;
    OrtalamaAlisFiyat:number=0;
    SonAlisMiktar:number=0;
    TeklifTarih:any; 
    TeklifHazirlayan:string="";
    TalepEden:string="";
  }  

export class TeklifFirma {
  DocEntry:number=0;
  LineId:number=0;
  vtIndex:number=0;
  CardCode:string="";
  CardName:string="";
  Currency:string="";
  Toplam:number=0;  
  SiparisToplam:number=0;
  VadeGun:number=0;
  Aciklama:string="";
  CalismaSekliId:number=0;
  CalismaSekli:string="";
}

export class TeklifKarsilastirma {    
    DocEntry:number=0;
    LineId:number=0;
    vtIndex:number=0;
    DepoKodu: String="";
    DepoAdi: String="";
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
export class Teklif{
  DocEntry:number=0;
  Tarih: Date=new Date(); 
  Aciklama: String="";   
  SubeId: number=0;
  SubeAdi:String="";
  Durum:String="";
  DurumStr:String=""; 
  OnayDurum:String="";
  Ekleyen:number=0; 
  EkleyenAd:String="";
  Guncelleyen:number=0;
  GuncelleyenAd:string="";
  Kayit:Date=new Date();
  Guncelleme:Date=new Date();
  OnayId:number=0;
  Firma1Kodu:string="";
  Firma2Kodu:string="";
  Firma3Kodu:string="";
  Firma1Adi:string="";
  Firma2Adi:string="";
  Firma3Adi:string="";
  Firma1ParaBirimi:string="";
  Firma2ParaBirimi:string="";
  Firma3ParaBirimi:string="";
  GorevlendirilenEmpId:number=0; 
  GorevlendirilenKisi:String="";
}

export class TalepMaster { 
  constructor(_docentry:number,_tarih:Date,_talepeden:String,_aciklama:String,_depo:string,_durum:String,_durumstr:String) {
    this.DocEntry=_docentry;
    this.Tarih=_tarih;
    this.EkleyenAd=_talepeden;
    this.Aciklama=_aciklama;
    this.Depo=_depo;
    this.Durum=_durum;
    this.DurumStr=_durumstr;
   };
  
  DocEntry:number=0;
  Tarih: Date=new Date(); 
  Aciklama: String="";
  Depo: string  ="";
  KarsiDepo: String="";
  DepoAdi: String="";
  Sube: number=0;
  Durum:String="";
  DurumStr:String=""; 
  OnayDurum:String="";
  Ekleyen:number=0; 
  EkleyenAd:String="";
  Guncelleyen:number=0;
  GuncelleyenAd:string="";
  Kayit:Date=new Date();
  Guncelleme:Date=new Date();
  validkey:String="";
  AlimYapildi:string="";
  TalepTuru:string="";
  TalepTuruStr:string="";
  FirmaKodu:string="";
  FirmaAdi:string="";
}  

export class TalepDetail {
constructor(lineid:number,miktar:number,sube:number,depo:String,durum:String,birim:string) {
  this.LineId=lineid;
  this.Miktar=miktar;
  this.Sube=sube;
  this.DepoKodu=depo;
  this.DepoAdi=depo;
  this.Durum=durum;
  this.Birim=birim;
}
 
  DocEntry:number=0;
  LineId:number=0;
  vtIndex:number=0;
  OnayId:number=0;
  StokKodu: string="";
  StokAdi: string="";
  Aciklama: string="";
  DepoKodu: String="";
  DepoAdi: String="";
  Sube: number=0;
  SubeAdi: string="";
  Birim:string="" 
  Miktar: number=0;
  KaynakDepoStok:number=0;
  OnaylananMiktar:number=0;
  TransferMiktar:number=0; 
  DepoStok:number=0;  
  TalepNo:number=0; 
  TalepMiktar:number=0;
  Bakiye:number=0;
  Durum:String="Y";
  DurumStr:String="";
  SatirGuid:string="";
  Duzeltme:boolean=true;
  Yeni:boolean=false;
  KarsiDepo:string="";
  KarsiDepoAdi:string=""; 
  Ekleyen:number=0; 
  EkleyenAd:string="";
  Guncelleyen:number=0;
  GuncelleyenAd:string="";
  Kayit:Date=new Date();
  Guncelleme:Date=new Date();
  TeklifHazirlikNo:number=0; 
  TeklifHazirlikGuid:string="";
  TeklifMiktar:number=0;
  TransferDepoKodu:string="";
  TransferDepoAdi:string="";
  BirimTutar:number=0;
  ToplamTutar:number=0;
  KdvOran:number=0;
  validkey:String="";
  AlimYapildi:string="";
  TalepTuru:string="";
  TalepTuruStr:string="";
  FirmaKodu:string="";
  FirmaAdi:string="";
  Onaylayacak:string="";
  Kalan:number=0;
  OnayAciklama:string="";
  SiparisFirmaAdi:string="";
  SonAlisFiyat:number=0;
    OrtalamaAlisFiyat:number=0;
    SonAlisMiktar:number=0;
}  
