import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import moment from 'moment';
import { Observable, of, throwError } from 'rxjs';
import { catchError, isEmpty, map } from 'rxjs/operators'; 
import { SehirModel, IlceModel, Result, ReturnValuesList, ReturnValues, StokGrupModel, IslemTipi, UlkeModel } from './GenelSrc';

@Injectable({
    providedIn: 'root'
  })

  export class KaliteSrcService {
    token = sessionStorage.getItem("Token");  
    stokrehber:StokRehberModel[];
    
    constructor( @Inject('semUrl') private semUrl:string,
      private http: HttpClient) {   
        
    } 
    async GetStokRehberAramaList(arama:string)
    { 
         let url=this.semUrl+"/Kalite/GetKaliteStokRehber?Arama="+arama+"&Token="+ this.token;
          return await this.http.get<Result<StokRehberModel[]>>(url).pipe( map((res:any)=> res));
    }

    async GetSeriRehberAramaList(arama:string, stokkodu :string)
    { 
         let url=this.semUrl+"/Kalite/GetKaliteSeriRehber?Arama="+arama+"&StokKodu="+stokkodu+"&Token="+ this.token;
          return await this.http.get<Result<SeriRehberModel[]>>(url).pipe( map((res:any)=> res));
    }


    async GetReceteStokRehberAramaList(arama:string)
    { 
         let url=this.semUrl+"/Recete/GetReceteStokRehber?Arama="+arama+"&Token="+ this.token;
          return await this.http.get<Result<StokRehberModel[]>>(url).pipe( map((res:any)=> res));
    }

    async GetReceteSeriRehberAramaList(arama:string, stokkodu :string)
    { 
         let url=this.semUrl+"/Recete/GetReceteStokLotRehber?Arama="+arama+"&StokKodu="+stokkodu+"&Token="+ this.token;
          return await this.http.get<Result<SeriRehberModel[]>>(url).pipe( map((res:any)=> res));
    }


    async GetKaliteSenaryoList(filter:SenaryoArama):Promise<ReturnValuesList<Senaryo>> 
    { 
      const headers = new HttpHeaders(
        {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Headers': 'Content-Type',
       }
      );
    
        let options = { headers: headers };
    
        const body =  JSON.stringify({      
          "StokKodu":  filter.StokKodu,     
          "Miktar":  filter.Miktar,    
          "Bolum":  filter.Bolum,    
          "Token":this.token
        });
   
      var result = await this.http.post<any>(this.semUrl+"/Kalite/GetKaliteSenaryo", body, options).toPromise();
     
     
      var sonuc = JSON.parse(JSON.stringify(result)); 
      return new ReturnValuesList( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["List"]);
       
    }

    async SetKaliteSonucKaydet(sonuclar:any):Promise<ReturnValuesList<SonucListeSTK>> 
    { 
      const headers = new HttpHeaders(
        {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Headers': 'Content-Type',
       }
      );
    
        let options = { headers: headers };
    
        const body =  JSON.stringify({      
          "sonuclar":  sonuclar 
        }); 
      var result = await this.http.post<any>(this.semUrl+"/Kalite/SetKaliteSonucKaydet", body, options).toPromise();
     
     
      var sonuc = JSON.parse(JSON.stringify(result)); 
      return new ReturnValuesList( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["List"]);
       
    }
    
    async SetKaliteSonucKapat(EmirNo:any):Promise<ReturnValuesList<SonucListeSTK>> 
    { 
      const headers = new HttpHeaders(
        {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Headers': 'Content-Type',
       }
      );
    
        let options = { headers: headers };
    
        const body =  JSON.stringify({      
          "EmirNo":  EmirNo ,
          "Token": this.token
        });
    
      var result = await this.http.post<any>(this.semUrl+"/Kalite/SetKaliteSonucKapat", body, options).toPromise();
     
     
      var sonuc = JSON.parse(JSON.stringify(result)); 
      return new ReturnValuesList( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["List"]);
       
    }

    async SetKaliteDurumDegistir(durum:any):Promise<ReturnValuesList<ReturnValues>> 
    { 
      const headers = new HttpHeaders(
        {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Headers': 'Content-Type',
       }
      );
    
        let options = { headers: headers };
    
        const body =  JSON.stringify({      
          "EmirNo":  durum.EmirNo ,
          "Durum":  durum.Durum ,
          "Token": this.token
        });
    
      var result = await this.http.post<any>(this.semUrl+"/Kalite/SetKaliteDurumDegistir", body, options).toPromise();
      var sonuc = JSON.parse(JSON.stringify(result)); 
      return new ReturnValuesList( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["List"]);
       
    }


    async GetKaliteSonucListe(KaliteID:number):Promise<ReturnValuesList<SonucListeSTK>> 
    { 
      const headers = new HttpHeaders(
        {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Headers': 'Content-Type',
       }
      );
    
        let options = { headers: headers };
    
        const body =  JSON.stringify({      
          "KaliteID":  KaliteID,     
          "Token":this.token
        });
   
      var result = await this.http.post<any>(this.semUrl+"/Kalite/GetKaliteSonucListe", body, options).toPromise();
     
     
      var sonuc = JSON.parse(JSON.stringify(result)); 
      return new ReturnValuesList( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["List"]);
       
    }

    async GetKaliteEmirList(filter:EmirArama):Promise<ReturnValuesList<EmirList>> 
    { 
      const headers = new HttpHeaders(
        {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Headers': 'Content-Type',
       }
      );
    
        let options = { headers: headers };
    
        const body =  JSON.stringify({      
          "Baslangic":  filter.Baslangic,     
          "Bitis":  filter.Bitis,    
          "Tip":  filter.Tip.toString(),    
          "Token":this.token
        });
      
      var result = await this.http.post<any>(this.semUrl+"/KaliteEmir/GetKaliteEmirList", body, options).toPromise();
     
     
      var sonuc = JSON.parse(JSON.stringify(result)); 
      return new ReturnValuesList( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["List"]);
       
    }

    async GetKaliteListe(filter:ListeArama):Promise<ReturnValuesList<Liste>> 
    { 
      const headers = new HttpHeaders(
        {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Headers': 'Content-Type',
       }
      );
    
        let options = { headers: headers };
    
        const body =  JSON.stringify({      
          "SenaryoSatirId":  filter.SenaryoSatirId,     
          "DocEntry":  filter.DocEntry,    
          "Token":this.token
        });
    
      var result = await this.http.post<any>(this.semUrl+"/Kalite/GetKaliteListe", body, options).toPromise();
     
     
      var sonuc = JSON.parse(JSON.stringify(result)); 
      return new ReturnValuesList( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["List"]);
       
    }

    async GetReceteListesi(filter:ReceteListArama):Promise<ReturnValuesList<ReceteList>> 
    { 
      const headers = new HttpHeaders(
        {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Headers': 'Content-Type',
       }
      );
    
        let options = { headers: headers };
    
        const body =  JSON.stringify({      
          "ItemCode":  filter.ItemCode,     
          "Token":this.token,
          "Lot":filter.Lot
        }); 
      var result = await this.http.post<any>(this.semUrl+"/Recete/GetReceteListesi", body, options).toPromise();
     
     
      var sonuc = JSON.parse(JSON.stringify(result)); 
      return new ReturnValuesList( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["List"]);
       
    }

    async SetReceteListesi(data:any):Promise<ReturnValuesList<ReturnValues>> 
    { 
      const headers = new HttpHeaders(
        {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Headers': 'Content-Type',
       }
      );
    
        let options = { headers: headers };
    
        const body =  JSON.stringify({      
          "Token": this.token,
          "data":data
        });
      
      console.log("data",data);
      console.log("body",body);
      var result = await this.http.post<any>(this.semUrl+"/Recete/SetReceteListesi", body, options).toPromise();
     
     
      var sonuc = JSON.parse(JSON.stringify(result)); 
      return new ReturnValuesList( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["List"]);
       
    }

  }





    export class StokRehberModel{
        DocEntry:number=0;
        ItemCode:string="";   
        ItemName:string="";  
        ItmsGrpCod:string="";   
        ItmsGrpNam:string="";  
    }
    export class SeriRehberModel{
      AbsEntry :number=0;
      DistNumber:string="";   
      LotNumber:string="";  
      MnfSerial:string="";  
    } 
    export class SenaryoArama{
      Token:string="";   
      StokKodu:string="";   
      Miktar:number=0; 
      Bolum :string="";
    }
    export class Senaryo{
    
    ID :number=0;
    SonucDocEntry :number=0;
    DocEntry :number=0;
    TekrarNo :number=0;
    SenaryoSatirId	:number=0;
    OrneklemSatirId	:number=0;
    Kod			:string="";  	
    Tanim			:string="";  
    BaslikAciklama	:string="";  
    EslesmeKodu		:string="";  
    Bolum			:string="";  
    Kriter			:string="";  
    Kalem			:string="";  
    MuhatapKodu		:string="";  
    MuhatapAdi		:string="";  
    KalemGrubu		:string="";  
    TestKodu		:string="";  
    TestAdi			:string="";  
    TestGrubu		:string="";  
    AracKodu		:string="";  
    AracAdi			:string="";  
    SatirAciklama	:string="";  
    DegerTipi		:string="";  
    DegerTipiAciklamasi		:string="";  
    Ondalik			:number=0;
    Operator		:string="";  
    Deger1			:number=0;
    Deger2		:number=0;
    Deger		:number=0;
    ToleransTipi	:string="";  
    MinTolerans		:number=0;
    MaxTolerans		:number=0;
    ListeKodu		:string="";  
    ListeTanimi		:string="";  
    Zorunlu			  :boolean=false;
    OrneklemTipi	:string="";  
    TekrarSayisi	:number=0;
    Ek				:string="";  
    Metin				:string="";  
    Liste				:string="";   
    TestYontemi		:string="";  
    RefBaslangic	:number=0;
    RefBitis	:number=0;	
    MiktarYuzde		:string="";  
    OrneklemBaslangic:number=0;
    OrneklemBitis:number=0;
 
    }
    export class ListeArama{
      Token:string="";   
      DocEntry:any;
      SenaryoSatirId:any=""; 
    }
    export class Liste{
      Kod:number=0;
      Tanim:string="";   
      Aciklama1:string="";  
      Aciklama2:string="";  
    }
    export class EmirArama{
      Token:string="";   
      Baslangic:Date;
      Bitis:Date;
      Tip :any="";
    }
    export class DurumPost{
      Token:string="";   
      Durum:string="";
      EmirNo:string="";
    }

    export class EmirList{
      Token:string="";   
      Baslangic:Date;
      DocEntry:number=0
      DocNum:string="";  
      Tur:string="";  
      TurAciklama:string="";  
      ObjeTipi:string="";  
      BelgeNo:string="";  
      SenaryoNo:string="";  
      Tarih:Date;
      IslemiYapan :string="";  
      TestSayisi:number=0
      TamTestSayisi:number=0
      Durum :string="";   
      Atanan :string="";  
      StokKodu :string="";  
      StokAdi :string="";  
      LotSeriTipi :string="";  
      LotSeriNo :string="";  
      MuhatapAdi :string="";  
      OnayDurum :string="";  
      TahBaslangic:Date;
      TahBitis:Date;
    }
    export class SonucListeSTK{
      
      SonucDocEntry:number=0;
      ID:number=0;
      AddUpd:string="";
      Token:string="";
      KaliteID:number=0;
      Kullanici:string="";
      BaslamaTarihi:Date;
      StokKodu:string="";
      StokAdi:string="";
      LotSeri:string="";
      Miktar:number=0 ;
      SenaryoAdi:number=0;
      SenaryoSatirId:number=0;
      TekrarNo:number=0;
      DocEntry:number=0;
      AracKodu:string="";
      AracAdi:string="";
      TestAdi:string="";
      DegerTipi:string="";
      DegerTipiAciklamasi:string="";
      Ondalik:number=0;
      Operator:string="";
      Deger1:number=0;
      Deger2:number=0;
      Deger:number=0;
      Liste:string="";
      ListeKodu:string="";
      Metin:string="";
      Zorunlu:string="";
      TestYontemi:string="";
      
    }


    export class ReceteListArama{
      Token:string="";   
      ItemCode :string="";
      Lot :string="";
    }

    export class ReceteList{
      ID:number=0;
      Secim:boolean;
      StokAdi:string="";   
      ReceteUrunKodu:string="";   
      ReceteUrunAdi :string="";
    }

    export class ReceteListPost{
      Token:string="";   
      StokKodu :string="";
      Lot :string="";
      ReceteKodu :string="";
      Kullanici :string="";
      Secim:boolean;
    }