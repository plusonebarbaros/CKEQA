import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { isEmpty, map } from 'rxjs/operators';
import moment from 'moment';
import { KullaniciModel, KullaniciSrcService } from './KullaniciSrc';
import { NotifyService } from './notify';

@Injectable({ providedIn: 'root' })
export class GenelApi {
  [x: string]: any;   

 constructor(
   @Inject('semUrl') private semUrl:string,
   private http: HttpClient,
   private kullsrc:KullaniciSrcService,
   private alertify:NotifyService,
   ) { }

  async GetDashRapor()
  { 
    let url=this.semUrl+"/Rapor/GetDashRapor?Token="+ this.kullsrc.token; 
   return await this.http.get<Result<DashModel>>(url).pipe( map((res:any)=> res));
  }

} 

export  class DashAylikSatisModel { 
  A1_OCAK: number=0;
  A2_SUBAT: number=0;
  A3_MART: number=0;  
  A4_NISAN: number=0;  
  A5_MAYIS: number=0;  
  A6_HAZIRAN: number=0;  
  A7_TEMMUZ: number=0;  
  A8_AGUSTOS: number=0;  
  A9_EYLUL: number=0;  
  A10_EKIM: number=0;  
  A11_KASIM: number=0;  
  A12_ARALIK: number=0;  
} 

export  class DashModel { 
  Data: DashRaporOzetModel;
  AylikSatis: DashAylikSatisModel;
  AylikIAde: DashAylikSatisModel;
  Rapor: DashRaporModel[]=[];
}  

export  class DashRaporOzetModel { 
  GUNLUKSATIS: number=0;
  HAFTALIKSATIS: number=0;
  AYLIKSATIS: number=0;  
  YILLIKSATIS: number=0;  
  BRUTCIRO: number=0;  
  NETSATIS: number=0;  
}  

export  class DashRaporModel {
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
    semkey: string="";  
 } 
export  class CariHareketModel {
  JournalEntry: number=0;
  DocType: string="";  
  DocTypeName: string="";  
  DocNo: string="";  
  DocStatus: string="";  
  CustomerBalance: number=0;
  Debit: number=0;
  Credit: number=0;
  FCDebit: number=0;
  FCCredit: number=0;
  FCCurrency: number=0;
  Bakiye: number=0;
  CardCode: string="";  
  CardName: string="";  
  DocDate: any;  
  DueDate: any;  
  Comments: string="";  
  FaturaNo: string="";  
  FaturaTip: string=""; 
  B2BSiparisId: number=0; 
  VergiNo: string=""; 
  BakiyeKumule: number=0; 
 } 
export class SapBankaModel { 
  AbsEntry: number=0;
  BankCode: string="";
  BankName: string="";
  IBAN: string="";
  B2BOutlet: string="";
  PosReturnUrl: string="";
  PosUrlRedirect: string="";
  PosUrl: string="";
  MerchantReturnUrl: string="";
}
export class CariAdres { 
  CardCode: string="";
  AdresTip: string="";
  Adres: string="";
  Ilce: string="";
  Plaka: string=""; 
  Sehir:string="";
  UlkeKodu:string="";
  Ulke:string="";
  VergiNo:string="";
  VergiDairesi:string="";
  TcknNo:string="";
  Telefon1:string="";
  Telefon2:string="";
  Mail:string="";
  PostaKodu:string="";
  ZipCode:string="";
  AdresTanimTip:string="";
} 
export class RaporTasarim {    
  ID:number=0;       
  BASLIK:string="";      
}
export class MailGonderimModel {     
  Musteri:string=""; 
  Satici:string=""; 
}
export class StokGrupModel{
  ItmsGrpCod:number=0; 
  ItmsGrpNam:string="";  
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

export class Result<T> 
{
  KeyAccept:boolean=false;
  empId:number=0;
  List!: [T];
  Model!: T;
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

 export enum SistemEkran{
  Genel = 0,  
}


export enum BelgeYukleBirim{
  Genel = 1,  
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
  VeriIndir="Veriler indiriliyor, Lütfen Bekleyiniz...",
  SiparisIptal="Sipariş Iptal ediliyor, Lütfen Bekleyiniz...",
  SiparisIptalGeriAl="Siparişler Geri alınıyor, Lütfen Bekleyiniz...",
}

export  class MenuExapand { 
    constructor(sira:number,exp:boolean) {
      this.Sira=sira;
      this.Exapnd=exp;
    }
    Sira:number=0;
    Exapnd:boolean=false;
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
  
   export class DatepickerFormatsExample {
  
    flightSchedule = {
      date: new Date()
    }
  }