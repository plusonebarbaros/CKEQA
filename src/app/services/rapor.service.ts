import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Result, ReturnValues, ReturnValuesList } from './Genel/genelsrv';
import { KullaniciSrcService } from './kullanici/kullanici-src.service';
import { IslemTipi } from './Onay/onay-surev-src.service';

@Injectable({
  providedIn: 'root'
})
export class RaporService { 

  constructor(
    @Inject('semUrl') private semUrl:string,
    private http: HttpClient,
    private kullsrc:KullaniciSrcService
  ) { }

  async RaporMasterEkle(post:RaporMasterModel,parametre:RaporPivotParameModel[],tip:IslemTipi):Promise<ReturnValues>  {
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
      "Parametre":  parametre,  
      "Token":this.kullsrc.token, 
      "Tip":tip, 
    });
  
    var result = await this.http.post<any>(this.semUrl+"/Rapor/RaporMasterEkle", body, options).toPromise();
  
    var sonuc = JSON.parse(JSON.stringify(result))['Model'];
    return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
  }
   

  async GetRaporMaster(id:number)
  { 
  let url=this.semUrl+"/Rapor/GetRaporMaster?Docentry="+id+"&Token="+this.kullsrc.token; 
      return await this.http.get<Result<RaporMasterModel>>(url).pipe( map((res:any)=> res));
  } 

  async RaporParametreEkle(post:RaporParametreModel,tip:IslemTipi):Promise<ReturnValues>  {
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
  
    var result = await this.http.post<any>(this.semUrl+"/Rapor/RaporParametreEkle", body, options).toPromise();
  
    var sonuc = JSON.parse(JSON.stringify(result))['Model'];
    return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
  }   

  async GetRaporParametre(id:number,raporid:number)
  { 
  let url=this.semUrl+"/Rapor/GetRaporParametre?Docentry="+id+"&RaporId="+raporid+"&Token="+this.kullsrc.token; 
      return await this.http.get<Result<RaporParametreModel>>(url).pipe( map((res:any)=> res));
  }
  
  async RaporCalistir(raporid:number,parametre:RaporParametreModel[],yetkikodu:string)  {
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
     }
    ); 
  
    let options = { headers: headers };
    
    const body =  JSON.stringify({ 
      "RaporId":  raporid,   
      "Parametre":  parametre,   
      "YetkiKodu":  yetkikodu,   
      "Token":this.kullsrc.token
    });
  
    var result = await this.http.post<any>(this.semUrl+"/Rapor/RaporCalistir", body, options).toPromise();
  
    var sonuc = JSON.parse(JSON.stringify(result));
    return sonuc;
  }

  async ParametreSqlQry(parametre:number)  {
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
     }
    ); 
  
    let options = { headers: headers };
    
    const body =  JSON.stringify({  
      "Parametre":  parametre,   
      "Token":this.kullsrc.token
    });
  
    var result = await this.http.post<any>(this.semUrl+"/Rapor/ParametreSqlQry", body, options).toPromise();
  
    var sonuc = JSON.parse(JSON.stringify(result));
    return sonuc;
  }

  async RaporPivotParamsEkle(post:RaporPivotParameModel,tip:IslemTipi):Promise<ReturnValues>  {
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
  
    var result = await this.http.post<any>(this.semUrl+"/Rapor/RaporPivotParamsEkle", body, options).toPromise();
  
    var sonuc = JSON.parse(JSON.stringify(result))['Model'];
    return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
  }   

  async GetRaporPivotParams(id:number,raporid:number)
  { 
  let url=this.semUrl+"/Rapor/GetRaporPivotParams?Docentry="+id+"&RaporId="+raporid+"&Token="+this.kullsrc.token; 
      return await this.http.get<Result<RaporPivotParameModel>>(url).pipe( map((res:any)=> res));
  }

  async GetRaporPivotParamsV2(id:number,raporid:number)
  { 
  let url=this.semUrl+"/Rapor/GetRaporPivotParamsV2?Docentry="+id+"&RaporId="+raporid+"&Token="+this.kullsrc.token; 
      return await this.http.get<Result<RaporPivotDxClass>>(url).pipe( map((res:any)=> res));
  }

}

export class RaporPivotDxClass {    
  caption:string=""; 
  width:number=0; 
  dataType:string=""; 
  dataField:string=""; 
  summaryType:string=""; 
  format:string=""; 
  area:string=""; 
  sortBySummaryField:string=""; 
  alignment:string=""; 
  summaryDisplayMode:string=""; 
}
export class RaporPivotParameModel {    
  DocEntry:number=0;     
  RaporId:number=0;     
  PivotAlan:string=""; 
  AlanAdi:string=""; 
  DegerTipi:string=""; 
  Ekleyen:number=0; 
  EkleyenAd:string="";
  Guncelleyen:number=0;
  GuncelleyenAd:string="";
  Kayit:Date=new Date();
  Guncelleme:Date=new Date();  
}
export class RaporParametreModel {    
  DocEntry:number=0;     
  RaporId:number=0;     
  Parametre:string=""; 
  DegerTipId:number=0;   
  DegerTip:string=""; 
  DegerSorgu:string="";     
  SorguKisit:string="";     
  SorguKisitEsitlik:string="";     
  SorguKisitEsitlikStr:string="";     
  Sira:number=0;  
  Zorunlu:number=0;  
  VarsaliyanDegerAtansin:number=0;  
  Aktif:boolean=false;
  Ekleyen:number=0; 
  EkleyenAd:string="";
  Guncelleyen:number=0;
  GuncelleyenAd:string="";
  Kayit:Date=new Date();
  Guncelleme:Date=new Date(); 
  Deger:string="";
}
export class RaporMasterModel {    
  DocEntry:number=0;     
  Baslik:string=""; 
  YetkiKodu:string="";     
  Aciklama:string="";     
  SorguIlk:string="";     
  Sorgu:string="";     
  SorguSon:string="";     
  TestKisit:string="";    
  RaporTipiId:number=0;  
  RaporTip:string=""; 
  BelgeGoruntulemeTip:number=0;  
  GrafikRaporId:number=0;  
  Aktif:boolean=false;
  Ekleyen:number=0; 
  EkleyenAd:string="";
  Guncelleyen:number=0;
  GuncelleyenAd:string="";
  Kayit:Date=new Date();
  Guncelleme:Date=new Date(); 
}