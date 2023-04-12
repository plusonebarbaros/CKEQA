import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject } from '@angular/core';
import { Injectable } from '@angular/core';
import { Result, ReturnValues } from '../Genel/genelsrv';
import { TalepMaster, TalepDetail, Teklif, TeklifDetail, TeklifFirma } from '../talep/talepsrc.service';
import { Observable } from 'rxjs';
import { delay } from 'rxjs/operators';
import { isEmpty, map } from 'rxjs/operators';
import { data } from 'jquery';
import moment from 'moment';
import { KickModel } from '../anket/anket-yonetim.service';
import { KullaniciModel, KullaniciSrcService } from '../kullanici/kullanici-src.service';

@Injectable({
  providedIn: 'root'
})
export class OnaySurevSrcService { 

  constructor( 
    @Inject('semUrl') private semUrl:string,
    private http: HttpClient,
    private kullsrc:KullaniciSrcService
    ) { 
      
    }

    async  asamaEkle(baslik:OnaySurec,satir:OnaySurecDetay[],tip:IslemTipi):Promise<ReturnValues>  {
      const headers = new HttpHeaders(
        {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Headers': 'Content-Type',
       }
      ); 
  
        let options = { headers: headers };
  
        const body =  JSON.stringify({ 
          "Asama":  baslik,
          "Satir":  satir,
          "Tip":tip,
          "Token":this.kullsrc.token
        });
     
        var result = await this.http.post<any>(this.semUrl+"/Onay/AsamaEkle", body,options).toPromise();
  
      var sonuc = JSON.parse(JSON.stringify(result))['Model'];
      return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
     } 
     
    async getAsamaList(asamaid:number,subeid:number)
    { 
         let url=this.semUrl+"/Onay/OnayAsamalariniVer?AsamaId="+asamaid+"&SubeId="+ subeid+"&Token="+ this.kullsrc.token; 
          return await this.http.get<Result<OnaySurec[]>>(url).pipe( map((res:any)=> res));
    }
  
    async getAsamaDetayList(asamaid:number,bolum:number)
    { 
         let url=this.semUrl+"/Onay/OnayAsamaDetayVer?AsamaId="+asamaid+"&Bolum="+bolum+"&Token="+ this.kullsrc.token; 
          return await this.http.get<Result<OnaySurecDetay[]>>(url).pipe( map((res:any)=> res)); ;
    }

    async onaylav1(Onay:OnaylaModel,OnayDurum:boolean,Bolum:string,RetAciklama:string):Promise<ReturnValues>  {
      const headers = new HttpHeaders(
        {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Headers': 'Content-Type',
       }
      );   
        let options = { headers: headers };
  
        const body =  JSON.stringify({ 
          "OnayBolum":  Onay,
          "OnayDurum":  OnayDurum,
          "RetAciklama":  RetAciklama,
          "Bolum":Bolum,
          "Token":this.kullsrc.token
        }); 
     
        var result = await this.http.post<any>(this.semUrl+"/Onay/Onayla", body,options).toPromise();
  
      var sonuc = JSON.parse(JSON.stringify(result))['Model'];
      return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
     } 

     async OnayMalzemeDegistir(data:DtsOnaySurecMasterModel,Bolum:string,stokkodu:string):Promise<ReturnValues>  {
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
          "Bolum":Bolum,
          "StokKodu":  stokkodu, 
          "Token":this.kullsrc.token
        }); 
     
        var result = await this.http.post<any>(this.semUrl+"/Onay/OnayMalzemeDegistir", body,options).toPromise();
  
      var sonuc = JSON.parse(JSON.stringify(result))['Model'];
      return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
     }
     
     async OnayAciklama(list:DtsOnaySurecMasterModel[],aciklama:string):Promise<ReturnValues>{
      const headers = new HttpHeaders(
        {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Headers': 'Content-Type',
       }
      );   
        let options = { headers: headers };
  
        const body =  JSON.stringify({ 
          "List":  list,
          "Aciklama":aciklama, 
          "Token":this.kullsrc.token
        }); 
     
        var result = await this.http.post<any>(this.semUrl+"/Onay/OnayAciklama", body,options).toPromise();
  
      var sonuc = JSON.parse(JSON.stringify(result))['Model'];
      return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
     }

     async GetOnayGecmis(baslangic:Date,bitis:Date)
      { 
       let url=this.semUrl+"/Onay/GetOnayGecmis?Baslangic="+ moment(baslangic).format("yyyy-MM-DD")+"&Bitis="+ moment(bitis).format("yyyy-MM-DD")+"&Token="+ this.kullsrc.token; 
       return await this.http.get<Result<OnayGecmis[]>>(url).pipe( map((res:any)=> res));
      } 


    //yeni süreç
    async OnayKategoriMasterEkle(post:DtsOnayKategoriModel,tip:IslemTipi):Promise<ReturnValues>  {
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
    
      var result = await this.http.post<any>(this.semUrl+"/Onay/OnayKategoriMasterEkle", body, options).toPromise();
    
      var sonuc = JSON.parse(JSON.stringify(result))['Model'];
      return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
    }
    async GetOnayKategoriMaster(id:number)
    { 
         let url=this.semUrl+"/Onay/GetOnayKategoriMaster?Docentry="+id+"&Token="+this.kullsrc.token; 
            return await this.http.get<Result<DtsOnayKategoriModel>>(url).pipe( map((res:any)=> res));
    }

    async OnayKategoriEkle(post:DtsOnayKategoriModel,tip:IslemTipi):Promise<ReturnValues>  {
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
    
      var result = await this.http.post<any>(this.semUrl+"/Onay/OnayKategoriEkle", body, options).toPromise();
    
      var sonuc = JSON.parse(JSON.stringify(result))['Model'];
      return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
    }
    async GetOnayKategori(id:number)
    { 
         let url=this.semUrl+"/Onay/GetOnayKategori?Docentry="+id+"&Token="+this.kullsrc.token; 
            return await this.http.get<Result<DtsOnayKategoriModel>>(url).pipe( map((res:any)=> res));
    }

    async OnayKuralEkle(post:DtsOnayKuralModel,tip:IslemTipi):Promise<ReturnValues>  {
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
    
      var result = await this.http.post<any>(this.semUrl+"/Onay/OnayKuralEkle", body, options).toPromise();
    
      var sonuc = JSON.parse(JSON.stringify(result))['Model'];
      return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
    }
    async GetOnayKural(id:number)
    { 
         let url=this.semUrl+"/Onay/GetOnayKural?Docentry="+id+"&Token="+this.kullsrc.token; 
            return await this.http.get<Result<DtsOnayKuralModel>>(url).pipe( map((res:any)=> res));
    }

    async OnayTanimEkle(post:DtsOnayTanimModel,tip:IslemTipi):Promise<ReturnValues>  {
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
    
      var result = await this.http.post<any>(this.semUrl+"/Onay/OnayTanimEkle", body, options).toPromise();
    
      var sonuc = JSON.parse(JSON.stringify(result))['Model'];
      return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
    }
    async GetOnayTanim(id:number,OnayAnaKategoriKod:string,OnayKategoriKod:string,AlimYapildi:string)
    { 
         let url=this.semUrl+"/Onay/GetOnayTanim?Docentry="+id+"&OnayAnaKategoriKod="+OnayAnaKategoriKod+"&OnayKategoriKod="+OnayKategoriKod+"&AlimYapildi="+AlimYapildi+"&Token="+this.kullsrc.token; 
            return await this.http.get<Result<DtsOnayTanimModel>>(url).pipe( map((res:any)=> res));
    }

    async OnayTanimDetayEkle(post:DtsOnayTanimDetayModel,tip:IslemTipi):Promise<ReturnValues>  {
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
    
      var result = await this.http.post<any>(this.semUrl+"/Onay/OnayTanimDetayEkle", body, options).toPromise();
    
      var sonuc = JSON.parse(JSON.stringify(result))['Model'];
      return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
    }
    async GetOnayTanimDetay(id:number,SurecId:number,Bolum:number)
    { 
         let url=this.semUrl+"/Onay/GetOnayTanimDetay?Docentry="+id+"&SurecId="+SurecId+"&Bolum="+Bolum+"&Token="+this.kullsrc.token; 
            return await this.http.get<Result<DtsOnayTanimDetayModel>>(url).pipe( map((res:any)=> res));
    }

    async OnayCiftKuralEkle(post:DtsOnayCiftKuralModel|undefined,list:DtsOnayCiftKuralModel[]=[],tip:IslemTipi):Promise<ReturnValues>  {
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
        "List":  list,  
        "Token":this.kullsrc.token, 
        "Tip":tip, 
      });
    
      var result = await this.http.post<any>(this.semUrl+"/Onay/OnayCiftKuralEkle", body, options).toPromise();
    
      var sonuc = JSON.parse(JSON.stringify(result))['Model'];
      return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
    }
    async GetOnayCiftKural(id:number,OnayTanimId:number,OnaySatirId:number,semkey:string)
    { 
         let url=this.semUrl+"/Onay/GetOnayCiftKural?Docentry="+id+"&OnayTanimId="+OnayTanimId+"&OnaySatirId="+OnaySatirId+"&semkey="+semkey+"&Token="+this.kullsrc.token; 
            return await this.http.get<Result<DtsOnayCiftKuralModel>>(url).pipe( map((res:any)=> res));
    }

    async OnaySurecKuralEkle(post:DtsOnaySurecKuralModel,tip:IslemTipi):Promise<ReturnValues>  {
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
    
      var result = await this.http.post<any>(this.semUrl+"/Onay/OnaySurecKuralEkle", body, options).toPromise();
    
      var sonuc = JSON.parse(JSON.stringify(result))['Model'];
      return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
    }
    async GetOnaySurecKural(id:number,OnayTanimId:number,AnaKategoriId:number)
    { 
         let url=this.semUrl+"/Onay/GetOnaySurecKural?Docentry="+id+"&OnayTanimId="+OnayTanimId+"&AnaKategoriId="+AnaKategoriId+"&Token="+this.kullsrc.token; 
            return await this.http.get<Result<DtsOnaySurecKuralModel>>(url).pipe( map((res:any)=> res));
    }

    async GetOnayBekleyenList()
    { 
      let url=this.semUrl+"/Onay/GetOnayBekleyenList?Token="+this.kullsrc.token; 
      return await this.http.get<Result<DtsOnaySurecMasterModel>>(url).pipe( map((res:any)=> res));
    }

    async OnaylaV2(List:DtsOnaySurecMasterModel[],OnayDurum:boolean,RetAciklama:string):Promise<ReturnValues>  {
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
        "Token":this.kullsrc.token, 
        "OnayDurum":OnayDurum, 
        "RetAciklama":RetAciklama, 
      });
    
      var result = await this.http.post<any>(this.semUrl+"/Onay/OnaylaV2", body, options).toPromise();
    
      var sonuc = JSON.parse(JSON.stringify(result))['Model'];
      return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
    }

    async GetOnayAsamaTakipUstBilgiDetay(OnayTanimId:number)
    { 
      let url=this.semUrl+"/Onay/GetOnayAsamaTakipUstBilgiDetay?OnayTanimId="+OnayTanimId+"&Token="+this.kullsrc.token; 
      return await this.http.get<Result<DtsOnaySurecDetayModel>>(url).pipe( map((res:any)=> res));
    }

    async OnayYonlendir(list:DtsOnaySurecMasterModel[],kull:KullaniciModel):Promise<ReturnValues>  {
      const headers = new HttpHeaders(
        {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Headers': 'Content-Type',
       }
      );   
        let options = { headers: headers };
  
        const body =  JSON.stringify({ 
          "List":  list,
          "Kullanici":kull, 
          "Token":this.kullsrc.token
        }); 
     
        var result = await this.http.post<any>(this.semUrl+"/Onay/OnayYonlendir", body,options).toPromise();
  
      var sonuc = JSON.parse(JSON.stringify(result))['Model'];
      return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
     }
}

export class DtsOnaySurecDetayModel{
  DocEntry:number=0;
  OnayTanimId:number=0;
  OnaySurecId:number=0;
  EmpId:number=0;
  Onaylayacak:string="";
  DurumId:number=0;
  OnaylayanId:number=0;
  Onaylayan:string="";
  OnayTarih:any;
  OnaySaat:any;
  MailGonderildi:string="";
  MailGondTarih:any;
  MailGondSaat:any;
  Sira:number=0;
  Bolum:number=0;
  CitfOnay:number=0;
  RetAciklama:string=""; 
  CiftOnayGuid:string=""; 
  CiftOnayZorunlu:string=""; 
  EkleyenId: number = 0;
  Ekleyen: string = '';
  GuncelleyenId: number = 0;
  Guncelleyen: string = '';
  Kayit: any;
  Guncelleme: any;
}

export class DtsOnaySurecMasterModel{
  Ekran:number=0;
  DocEntry:number=0;
  EkTarih:any;
  OnayTanimId:number=0;
  EkranId:number=0;
  BelgeTipi:number=0;
  BelgeId:number=0;
  BelgeSatirId:number=0;
  UrunKodu:string="";
  UrunAdi:string="";
  FirmaKodu:string="";
  FirmaAdi:string="";
  FirmaKodu2:string="";
  FirmaAdi2:string="";
  FirmaKodu3:string="";
  FirmaAdi3:string="";
  SatirGuid:string="";
  Aciklama:string="";
  RevizeAciklama:string="";
  RetAciklama:string="";
  DurumId:number=0;
  OnaySiralimi:number=0;
  EkleyenId:number=0;
  Ekleyen: string = ''; 
  Proje:string=""; 
  AktiviteKodu:string=""; 
  Miktar: number = 0;
  Miktar2: number = 0;
  Miktar3: number = 0;
  Miktar4: number = 0;
  Miktar5: number = 0;
  DepoKodu: string = ""; 
  DepoAdi: string = ""; 
  Sira:number = 0;
  ToplamOnay: number = 0;
  CitfOnay: number = 0;
  CiftOnayGuid: string = ""; 
  CiftOnayZorunlu: string = ""; 
  OnaylayacakId: number = 0;
  Onaylayacak: string = ""; 
  Fiyat1: number = 0;
  Fiyat2: number = 0;
  Fiyat3: number = 0;
  Fiyat4: number = 0;
  Fiyat5: number = 0;
  Fiyat6: number = 0;
  Fiyat7: number = 0;
  Fiyat8: number = 0;
  Fiyat9: number = 0;
  Fiyat10: number = 0;
  Bilgi1: string = ""; 
  Bilgi2: string = ""; 
  Bilgi3: string = ""; 
  Bilgi4: string = ""; 
  Bilgi5: string = ""; 
  Bilgi6: string = ""; 
  Bilgi7: string = ""; 
  Bilgi8: string = ""; 
  Bilgi9: string = ""; 
  Bilgi10: string = ""; 
  Secim1: boolean=false; 
  Secim2: boolean=false; 
  Secim3: boolean=false; 
  GuncelleyenId: number = 0;
  Guncelleyen: string = ""; 
  GuncelTarih: any; 
  SecimZorunlu: number = 0;
  AnaKategoriId: number = 0;
  KategoriId: number = 0;
  AnaKategori: string = ""; 
  AnaKategoriKod: string = ""; 
  Kategori: string = ""; 
  KategoriKod: string = ""; 
  Tanim: string = ""; 
  GerekliOnay: number = 0;
  GerekliRet: number = 0;
  Aktif: number = 0;
  OtomatikOnaySure: number = 0;
  TutarKontrol: boolean=false; 
  BelgeVarmi: number = 0;
  Tarih1:any;
  Tarih2:any;
  Teklif!:TeklifOnay;
}

export class DtsOnaySurecKuralModel{
  DocEntry:number=0;
  KuralTanim:string="";
  OnayTanimId:number=0;
  KuralId:number=0;
  Deger:string="";
  Tablo:string="";
  Alan:string="";
  Parametre:string="";
  CalisacakKural:boolean=false;
  SiraPuan:number=0;
  KuralStr:string=""; 
  EkleyenId: number = 0;
  Ekleyen: string = '';
  GuncelleyenId: number = 0;
  Guncelleyen: string = '';
  Kayit: Date = new Date();
  Guncelleme: Date = new Date();
}

export class DtsOnayCiftKuralModel{
  DocEntry:number=0;
  semkey:string="";
  OnayTanimId:number=0;
  OnaySatirId:number=0;
  Sira:number=0;
  Kural:number=0;
  KuralStr:string=""; 
  EkleyenId: number = 0;
  Ekleyen: string = '';
  GuncelleyenId: number = 0;
  Guncelleyen: string = '';
  Kayit: Date = new Date();
  Guncelleme: Date = new Date();
}

export class DtsOnayTanimDetayModel{
  DocEntry:number=0;
  OnayTanimId:number=0;
  YetkiId:number=0;
  Tip:string="";
  TipStr:string="";
  Sira:number=0;
  Birim:string="";
  Anahtar:string="";
  AltLimit:number=0;
  AltOperator:string="";
  UstLimit:number=0;
  UstOperator:string="";
  Bolum:number=0;
  OtomatikOnaySure:number=0; 
  MailAdres:string="";
  MailAdresUzanti:string="";
  AdSoyad:string="";
  Email:string="";
  DirektorHaric:boolean=false; 
  Lokasyon:string="";
  Ekle:boolean=false; 
  CitfOnay:number=0; 
  CiftOnayVarmi:number=0; 
  CiftOnaySemkey:string="";
  CiftOnayKural:number=0; 
  KullaniciLokasyon:string="";
  EkleyenId: number = 0;
  Ekleyen: string = '';
  GuncelleyenId: number = 0;
  Guncelleyen: string = '';
  Kayit: Date = new Date();
  Guncelleme: Date = new Date();
}

export class DtsOnayTanimModel{
  DocEntry:number=0;
  AnaKategoriId:number=0;
  KategoriId:number=0;
  AnaKategoriKod:string="";
  AnaKategori:string="";
  KategoriKod:string="";
  Kategori:string="";
  Tanim:string="";
  GerekliOnay:number=0;
  GerekliRet:number=0;
  OnaySiralimi:number=0;
  Aktif:number=0;
  OtomatikOnaySure:number=0; 
  TutarKontrol:boolean=false;
  KuralVarmi:boolean=false; 

  EkleyenId: number = 0;
  Ekleyen: string = '';
  GuncelleyenId: number = 0;
  Guncelleyen: string = '';
  Kayit: Date = new Date();
  Guncelleme: Date = new Date();
}

export class DtsOnayKuralModel{
  DocEntry:number=0;
  KuralTanim:string="";
  KategoriId:number=0;
  Kategori:string="";
  OnayDetayId:number=0;
  Tablo:string="";
  Alan:string="";
  Parametre:string="";

  EkleyenId: number = 0;
  Ekleyen: string = '';
  GuncelleyenId: number = 0;
  Guncelleyen: string = '';
  Kayit: Date = new Date();
  Guncelleme: Date = new Date();
}

export class DtsOnayKategoriModel{
  DocEntry:number=0;
  KategoriKod:string="";
  Kategori:string="";

  AnaKategoriId:number=0;
  AnaKategoriKod:string="";
  AnaKategori:string="";
  AlimYapildi:string="";

  EkleyenId: number = 0;
  Ekleyen: string = '';
  GuncelleyenId: number = 0;
  Guncelleyen: string = '';
  Kayit: Date = new Date();
  Guncelleme: Date = new Date();
}

export class OnayGecmis
{ 
  Id:number=0;
  Onaycode:number=0;
  AsamaId:number=0;
  OnayBolum:String="";
  Islem:String="";
  Aciklama:String="";
  Belgeno:String="";
  EmpId:number=0;
  Olusturan:String="";
  Onaydurum:String="";
  Tarih:Date=new Date;
  TalepEden:String=""; 
  Firma:String="";
  StokKodu:String="";
}
export class OnaySurec
{ 
  DocEntry:number=0;
  Ad:String="";
  GerekliOnay:number=0;
  GerekliRet:number=0;
  Kategori:number=0;
  Ekleyen:String="";
  Tarih:Date=new Date;
  OnaySiralimi:String="";
  OtomatikOnaySure:number=0;
  SubeId:number=0;
  Tip:String="";
  Aktif:String="";
} 
export class OnaySurecDetay
{
  DocEntry:number=0;
  LineId:number=0;
  vtIndex:number=0;
  YetkiId:number=0;
  Tip:string="";
  Sira:number=0;
  AsamaId:number=0;
  BirimAdi:string="";
  Anahtar:string="";
  BrutTutar:number=0;
  ToplamTutar:number=0;
  Bolum:number=0; 
  AdSoyad:string="";
  BirimAdiStr:string="";
  AnahtarStr:string="";
  KullaniciId:number=0;
  KullaniciBirim:string="";
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

export class OnaylaModel
{ 
  Talep:TalepDetail[]=[];
  Transfer:TalepDetail[]=[]; 
  Kick:KickModel[]=[]; 
  Teklif!:TeklifOnay; 
}

export class TeklifOnay
{ 
  Firma:TeklifFirma[]=[];
  Kalem:TeklifDetail[]=[]; 
  Baslik!:Teklif;  
}