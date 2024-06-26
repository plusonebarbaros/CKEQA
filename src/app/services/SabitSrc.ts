import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { map } from 'rxjs/operators'; 
import moment from 'moment'; 
import { KullaniciSrcService, OnayHesapModel } from './KullaniciSrc';
import { IslemTipi, Result, ReturnValues } from './GenelSrc';

@Injectable({
  providedIn: 'root'
})
export class SabitservService { 

  constructor(
    @Inject('semUrl') private semUrl:string,
    private http: HttpClient,
    private kullsrc:KullaniciSrcService
  ) { }
 
 async StokOlcuBirimEkle(post:ConnOlcuBirim,tip:IslemTipi):Promise<ReturnValues>  {
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
 
   var result = await this.http.post<any>(this.semUrl+"/Tanim/StokOlcuBirimEkle", body, options).toPromise();
 
   var sonuc = JSON.parse(JSON.stringify(result))['Model'];
   return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
 }
 
 async GetStokOlcuBirim(Id:number)
 { 
    let url=this.semUrl+"/Tanim/GetStokOlcuBirim?Id="+Id+"&Token="+ this.kullsrc.token; 
    return await this.http.get<Result<ConnOlcuBirim>>(url).pipe( map((res:any)=> res));
 } 

 async GetConnBelgeTip()
 { 
      let url=this.semUrl+"/Login/GetConnBelgeTip?Token="+this.kullsrc.token; 
         return await this.http.get<Result<ConnBelgeTip>>(url).pipe( map((res:any)=> res));
 }

 async GetKullaniciMenuList()
{ 
 let url=this.semUrl+"/Login/GetKullaniciMenuList?Token="+ this.kullsrc.token;
  return this.http.get<Result<KullaniciTalepKatModel>>(url).pipe(map((res: any) => res));
}

async GetKullaniciTalepKat1()
{ 
     let url=this.semUrl+"/Genel/GetKullaniciTalepKat1?Token="+this.kullsrc.token; 
        return await this.http.get<Result<KullaniciTalepKat1Model>>(url).pipe( map((res:any)=> res));
}

async GetKullaniciTalepKat2(kat1:string)
{ 
     let url=this.semUrl+"/Genel/GetKullaniciTalepKat2?Kat1="+kat1+"&Token="+this.kullsrc.token; 
        return await this.http.get<Result<KullaniciTalepKat1Model>>(url).pipe( map((res:any)=> res));
}

async GetKullaniciTalepKat3(kat1:string,kat2:string)
{ 
     let url=this.semUrl+"/Genel/GetKullaniciTalepKat3?Kat1="+kat1+"&Kat2="+kat2+"&Token="+this.kullsrc.token; 
        return await this.http.get<Result<KullaniciTalepKat1Model>>(url).pipe( map((res:any)=> res));
}

async KullaniciTalepEkle(post:KullaniciTalepModel,tip:IslemTipi):Promise<ReturnValues>  {
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

  var result = await this.http.post<any>(this.semUrl+"/Genel/KullaniciTalepEkle", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}

async KullaniciTalepSira(list:KullaniciTalepModel[],OncelikId:number):Promise<ReturnValues>  {
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
    "Token":this.kullsrc.token, 
    "OncelikId":OncelikId, 
  });

  var result = await this.http.post<any>(this.semUrl+"/Genel/KullaniciTalepSira", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}

async GetKullaniciTalep(id:number,durumid:Number)
{ 
     let url=this.semUrl+"/Genel/GetKullaniciTalep?Docentry="+id+"&DurumId="+durumid+"&Token="+this.kullsrc.token; 
        return await this.http.get<Result<KullaniciTalepModel>>(url).pipe( map((res:any)=> res));
}

async GetKullaniciTalepOzet()
{ 
     let url=this.semUrl+"/Genel/GetKullaniciTalepOzet?Token="+this.kullsrc.token; 
        return await this.http.get<Result<KullaniciTalepOzetModel>>(url).pipe( map((res:any)=> res));
}

async KullaniciTalepOnay(post:KullaniciTalepModel,aciklama:string,durumid:number):Promise<ReturnValues>  {
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
    "Aciklama":aciklama, 
    "Durum":durumid, 
  });

  var result = await this.http.post<any>(this.semUrl+"/Genel/KullaniciTalepOnay", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}
async GetSistemTalepMesaj(talepid:number)
{
 let url=this.semUrl+"/Genel/GetSistemTalepMesaj?TalepId="+ talepid+"&Token="+ this.kullsrc.token;
 return await this.http.get<Result<KullaniciTalepMesajModel[]>>(url).pipe( map((res:any)=> res));
}

async KullPozisyonEkle(post:ConnKulPozisyonModel,tip:IslemTipi):Promise<ReturnValues>  {
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

  var result = await this.http.post<any>(this.semUrl+"/Tanim/KullPozisyonEkle", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}

async GetKullPozisyon(Id:number)
{ 
   let url=this.semUrl+"/Tanim/GetKullPozisyon?Id="+Id+"&Token="+ this.kullsrc.token; 
   return await this.http.get<Result<ConnKulPozisyonModel>>(url).pipe( map((res:any)=> res));
} 

async KullDepartmanEkle(post:ConnKulDepartmanModel,tip:IslemTipi):Promise<ReturnValues>  {
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

  var result = await this.http.post<any>(this.semUrl+"/Tanim/KullDepartmanEkle", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}

async GetKullDepartman(Id:number)
{ 
   let url=this.semUrl+"/Tanim/GetKullDepartman?Id="+Id+"&Token="+ this.kullsrc.token; 
   return await this.http.get<Result<ConnKulDepartmanModel>>(url).pipe( map((res:any)=> res));
} 

async FireTipTanimEkle(post:ConnFireTipTanimModel,tip:IslemTipi):Promise<ReturnValues>  {
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

  var result = await this.http.post<any>(this.semUrl+"/Tanim/FireTipTanimEkle", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}

async GetFireTipTanim(Id:number)
{ 
   let url=this.semUrl+"/Tanim/GetFireTipTanim?Id="+Id+"&Token="+ this.kullsrc.token; 
   return await this.http.get<Result<ConnFireTipTanimModel>>(url).pipe( map((res:any)=> res));
} 



}

export class ConnFireTipTanimModel {    
  Id:number=0;   
  Tanim:string="";
  HesapKodu:string="";
  HesapAdi:string="";
  
  EkleyenId:number=0; 
  Ekleyen:string="";
  GuncelleyenId:number=0;
  Guncelleyen:string="";
  EkTarih:Date=new Date();
  GuncelTarih:Date=new Date(); 
  Aktif:boolean=false;
}

export class ConnKulDepartmanModel {    
  Id:number=0;   
  Tanim:string="";
  
  EkleyenId:number=0; 
  Ekleyen:string="";
  GuncelleyenId:number=0;
  Guncelleyen:string="";
  EkTarih:Date=new Date();
  GuncelTarih:Date=new Date(); 
  Aktif:boolean=false;
}

export class ConnKulPozisyonModel {    
  Id:number=0;   
  Tanim:string="";

  EkleyenId:number=0; 
  Ekleyen:string="";
  GuncelleyenId:number=0;
  Guncelleyen:string="";
  EkTarih:Date=new Date();
  GuncelTarih:Date=new Date(); 
  Aktif:boolean=false;
}

export class KullaniciTalepOzetModel{
  Toplam: number = 0;
  Acik: number = 0;
  Kapali: number = 0;
  AcikOran: number = 0;
  KapaliOran: number = 0;
  Ilk: string=""; 
  Son: string=""; 
}

export class KullaniciTalepMesajModel{
  Id: number = 0;
  TalepId: number = 0;
  Mesaj: string="";
  EkleyenId: number = 0;
  Ekleyen: string=""; 
  EkTarih:any;
}
export class KullaniciTalepModel {    
  Id:number=0;    
  semkey:string="";      
  TalepTarih:any;        
  BelgeEklendi:number=0     
  ModulId:number=0     
  AnaModul:string="";         
  AltModul:string="";         
  Modul:string="";          
  OnemDuzeyId:number=0   
  OnemDuzey:string="";  
  IsketId:number=0   
  Isket:string="";  
  DurumId:number=0   
  Durum:string="";  
  TalepAciklama:string="";  
  OnaylayanId:number=0    
  Onaylayan:string="";   
  OnayTarih:any;    
  OnayAciklama:string="";   
  EkleyenId:number=0; 
  Ekleyen:string="";
  GuncelleyenId:number=0;
  Guncelleyen:string="";
  EkTarih:Date=new Date();
  GuncelTarih:Date=new Date(); 
  SorumluBirim:number=0; 
  SorumluBirimStr:string="";
  OncelikId:number=0;
  BirimId:number=0;
}
export class KullaniciTalepKat1Model {    
  Id:number=0;        
  Kod:string="";         
  Adi:string="";   
}
export class KullaniciTalepKatModel {    
  Id:number=0;        
  AnaModul:string="";         
  AltModul:string="";         
  Modul:string="";          
  YetkiKodu:string="";          
  TabId:number=0; 
  EkleyenId:number=0; 
  Ekleyen:string="";
  GuncelleyenId:number=0;
  Guncelleyen:string="";
  EkTarih:Date=new Date();
  GuncelTarih:Date=new Date(); 
}
export class ConnOlcuBirim {    
  Id:number=0;   
  Adi:string="";
  Aciklama:string="";

  EkleyenId:number=0; 
  Ekleyen:string="";
  GuncelleyenId:number=0;
  Guncelleyen:string="";
  EkTarih:Date=new Date();
  GuncelTarih:Date=new Date(); 
  Aktif:boolean=false;
}

export class ConnBelgeTip {    
  Id:number=0;   
  Tanim:string="";
}