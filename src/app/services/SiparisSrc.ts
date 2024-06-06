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
 
async GetDepoList()
{ 
  let url=this.semUrl+"/Login/GetDepoList?Token="+ this.kullsrc.token; 
  return await this.http.get<Result<DepoModel>>(url).pipe( map((res:any)=> res));
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

async  OzelSiparisOluttur(baslik:OzelSiparisMaster,satir:OzelSiparisKalem[],Tip:IslemTipi):Promise<ReturnValues>  {
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
      "Token":this.kullsrc.token
    });
 
    var result = await this.http.post<any>(this.semUrl+"/SatinAlma/OzelSiparisOluttur", body,options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
 } 
 async OzelSiparisFormYazdir(Talep:OzelSiparisMaster,raporid:number):Promise<ReturnValues>  {
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
      "Token":this.kullsrc.token,
    });

  var result = await this.http.post<any>(this.semUrl+"/SatinAlma/TalepFormYazdir", body, options).toPromise();

    var sonuc = JSON.parse(JSON.stringify(result))['Model'];
    return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
  }

  async  OzelSiparisSatirGuncelle(Kalem:OzelSiparisKalem):Promise<ReturnValues>  {
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
     }
    ); 

      let options = { headers: headers };

      const body =  JSON.stringify({ 
        "Kalem": Kalem,
        "Token": this.kullsrc.token
      });
   
      var result = await this.http.post<any>(this.semUrl+"/SatinAlma/OzelSiparisSatirGuncelle", body,options).toPromise();

    var sonuc = JSON.parse(JSON.stringify(result))['Model'];
    return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
   }

async GetOzelSiparisDetay(Id:number)
  { 
       let url=this.semUrl+"/SatinAlma/GetOzelSiparisDetay?Id="+Id+"&Token="+ this.kullsrc.token; 
        return await this.http.get<Result<OzelSiparisKalem[]>>(url).pipe( map((res:any)=> res));
  }

  async GetOzelSiparisList(Id:number,durum:string="",baslangic:Date,bitis:Date,Kontrol:boolean)
  { 
       let url=this.semUrl+"/SatinAlma/GetOzelSiparisList?Id="+Id+"&Durum="+durum+"&Token="+ this.kullsrc.token+"&Kontrol="+ Kontrol+"&Baslangic="+moment(baslangic).format("yyyy-MM-DD")+"&Bitis="+moment(bitis).format("yyyy-MM-DD"); 
        return await this.http.get<Result<OzelSiparisMaster[]>>(url).pipe( map((res:any)=> res));
  }

}

export  class DepoTransferModel {
  Id: number=0;
  Tarih: any;  
  TalepTarih: any;  
  StokKodu: string="";  
  StokAdi: string="";    
  Miktar: number=0;
  OnayId: number=0;
  DepoKodu: string="";  
  DepoAdi: string="";  
  Aciklama: string="";  
  SatirGuid: string="";  
  SapTalepNo: number=0;
  SapTeklifNo: number=0;
  SapSiparisNo: number=0;
  SapSiparisSatirNo: number=0;
  StokNakliId: number=0;
  DurumId: number=0;
  Durum: string="";
  KarsiDepoOnaylayanId: number=0;
  KarsiDepoOnaylayan: string=""; 
  KarsiDepoOnayTarih: any;
  KarsiDepoOnayMiktar: number=0;
  KarsiDepoAciklama: string="";  
  TeslimAlTarih: any;
  TeslimAlanId: number=0;
  TeslimAlan: string="";
  TeslimAlMiktar: number=0;
  Aktif: boolean=false;  
  ErpSirket: string="";
  EkleyenId:number=0; 
  Ekleyen:string="";
  GuncelleyenId:number=0;
  Guncelleyen:string="";
  EkTarih:any; 
  GuncelTarih:any;  
  validkey:string="";
  BelgeBase64:string="";
  Files:number=0;
  Base64List:ItemsFile[]=[];
  BelgeAdi:string="";
  BelgeUzanti:string="";
  BirimId:number=0;
  Birim:string="";
} 


export class OzelSiparisKalem {  
  Id:number=0;
  TalepId:number=0;
  OnayId:number=0;
  UrunKodu: string="";
  UrunAdi: string="";
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
}  
export  class OzelSiparisMaster {
  Id: number=0;
  Tarih: any;  
  SiparisTarih: any;  
  TeslimTarih: any;  
  TeslimSaati: any;  
  UrunKodu: string="";  
  UrunAdi: string="";  
  Birim: string="";  
  Aciklama: string="";  
  PastaUstuYazi: string="";  
  MusteriAdi: string="";  
  Telefon1: string="";
  Telefon2: string=""; 
  Gsm: string="";
  VergiDairesi: string="";  
  VergiNo: string="";
  Tckn: string="";
  IndirimOran: number=0;
  Adres: string="";  
  Email: string="";  
  SehirKod: string=""; 
  Sehir: string=""; 
  IlceKod: number=0;
  Ilce: string="";
  Ulke: string="";
  SiparisVerenKisi: string="";
  SiparisVerenTelefon: string="";
  TeslimatKisi: string="";
  TeslimatTarih: any;
  TeslimatSubeId: string="";
  TeslimatTel: string="";
  TeslimatGsm: string="";
  TeslimatAdres: string="";
  FaturaNotu: string="";
  Tutar: number=0;
  Iskonto: number=0;
  EKUcret: number=0;
  GenelToplam: number=0;
  Kapora: number=0;
  Aktif: boolean=false;  
  ErpSirket: string="";
  EkleyenId:number=0; 
  Ekleyen:string="";
  GuncelleyenId:number=0;
  Guncelleyen:string="";
  EkTarih:any; 
  GuncelTarih:any;  
  validkey:string="";
  DurumId:number=0;
  Durum:string="";
  TeslimSehirKod: string=""; 
  TeslimSehir: string=""; 
  TeslimIlceKod: number=0;
  TeslimIlce: string="";
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

export  class DepoModel {
  WhsCode: string="";  
  WhsName: string="";  
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

