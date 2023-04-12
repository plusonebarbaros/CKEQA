import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Result, ReturnValues } from '../Genel/genelsrv';
import { KullaniciSrcService, OnayHesapModel } from '../kullanici/kullanici-src.service';
import { IslemTipi } from '../Onay/onay-surev-src.service';
import moment from 'moment';
import { BankaEkstreModel } from '../finanssrc';

@Injectable({
  providedIn: 'root'
})
export class SabitservService { 

  constructor(
    @Inject('semUrl') private semUrl:string,
    private http: HttpClient,
    private kullsrc:KullaniciSrcService
  ) { }

async AcenteCalismaSekliEkle(sabit:Sabit,tip:IslemTipi):Promise<ReturnValues>  {
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
     }
    ); 
  
      let options = { headers: headers };
  
      const body =  JSON.stringify({ 
        "Data":  sabit,  
        "Token":this.kullsrc.token, 
        "Tip":tip, 
      });
  
    var result = await this.http.post<any>(this.semUrl+"/Tanim/AcenteCalismaSekliEkle", body, options).toPromise();
  
    var sonuc = JSON.parse(JSON.stringify(result))['Model'];
    return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}
    
async GetAcenteCalismaSekliList(id:number)
    { 
         let url=this.semUrl+"/Tanim/GetAcenteCalismaSekliList?Docentry="+id+"&Token="+this.kullsrc.token; 
          return await this.http.get<Sabit[]>(url).pipe( map((res:any)=> res['Model']));
}

async OtobusSeyahtaTipEkle(sabit:Sabit,tip:IslemTipi):Promise<ReturnValues>  {
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
     }
    ); 
  
      let options = { headers: headers };
  
      const body =  JSON.stringify({ 
        "Data":  sabit,  
        "Token":this.kullsrc.token, 
        "Tip":tip, 
      });
  
    var result = await this.http.post<any>(this.semUrl+"/Tanim/OtobusSeyahtaTipEkle", body, options).toPromise();
  
    var sonuc = JSON.parse(JSON.stringify(result))['Model'];
    return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}
    
async GetOtobusSeyahatTipList(id:number)
    { 
         let url=this.semUrl+"/Tanim/GetOtobusSeyahatTipList?Docentry="+id+"&Token="+this.kullsrc.token; 
          return await this.http.get<Sabit[]>(url).pipe( map((res:any)=> res['Model']));
} 

async RespSatisCommentsEkle(sabit:Sabit,tip:IslemTipi):Promise<ReturnValues>  {
      const headers = new HttpHeaders(
        {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Headers': 'Content-Type',
       }
      ); 
    
        let options = { headers: headers };
    
        const body =  JSON.stringify({ 
          "Data":  sabit,  
          "Token":this.kullsrc.token, 
          "Tip":tip, 
        });
    
      var result = await this.http.post<any>(this.semUrl+"/Tanim/RespSatisCommentsEkle", body, options).toPromise();
    
      var sonuc = JSON.parse(JSON.stringify(result))['Model'];
      return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}
      
async GetRespSatisCommentsList(id:number)
      { 
           let url=this.semUrl+"/Tanim/GetRespSatisCommentsList?Docentry="+id+"&Token="+this.kullsrc.token; 
            return await this.http.get<Sabit[]>(url).pipe( map((res:any)=> res['Model']));
}      
      
async RespSatisWaweEkle(sabit:Sabit,tip:IslemTipi):Promise<ReturnValues>  {
        const headers = new HttpHeaders(
          {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Headers': 'Content-Type',
         }
        ); 
      
          let options = { headers: headers };
      
          const body =  JSON.stringify({ 
            "Data":  sabit,  
            "Token":this.kullsrc.token, 
            "Tip":tip, 
          });
      
        var result = await this.http.post<any>(this.semUrl+"/Tanim/RespSatisWaweEkle", body, options).toPromise();
      
        var sonuc = JSON.parse(JSON.stringify(result))['Model'];
        return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}
        
async GetRespSatisWaweList(id:number)
        { 
             let url=this.semUrl+"/Tanim/GetRespSatisWaweList?Docentry="+id+"&Token="+this.kullsrc.token; 
              return await this.http.get<Sabit[]>(url).pipe( map((res:any)=> res['Model']));
}   

async RespSeyahatTuruEkle(sabit:Sabit,tip:IslemTipi):Promise<ReturnValues>  {
          const headers = new HttpHeaders(
            {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Access-Control-Allow-Headers': 'Content-Type',
           }
          ); 
        
            let options = { headers: headers };
        
            const body =  JSON.stringify({ 
              "Data":  sabit,  
              "Token":this.kullsrc.token, 
              "Tip":tip, 
            });
        
          var result = await this.http.post<any>(this.semUrl+"/Tanim/RespSeyahatTuruEkle", body, options).toPromise();
        
          var sonuc = JSON.parse(JSON.stringify(result))['Model'];
          return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}

async GetRespSeyahatTuruList(id:number)
          { 
               let url=this.semUrl+"/Tanim/GetRespSeyahatTuruList?Docentry="+id+"&Token="+this.kullsrc.token; 
                return await this.http.get<Sabit[]>(url).pipe( map((res:any)=> res['Model']));
}   
          
async RespUpTuruEkle(sabit:Sabit,tip:IslemTipi):Promise<ReturnValues>  {
            const headers = new HttpHeaders(
              {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Access-Control-Allow-Headers': 'Content-Type',
             }
            ); 
          
              let options = { headers: headers };
          
              const body =  JSON.stringify({ 
                "Data":  sabit,  
                "Token":this.kullsrc.token, 
                "Tip":tip, 
              });
          
var result = await this.http.post<any>(this.semUrl+"/Tanim/RespUpTuruEkle", body, options).toPromise();

var sonuc = JSON.parse(JSON.stringify(result))['Model'];
return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}

async GetRespUpTuruList(id:number)
{ 
     let url=this.semUrl+"/Tanim/GetRespUpTuruList?Docentry="+id+"&Token="+this.kullsrc.token; 
      return await this.http.get<Sabit[]>(url).pipe( map((res:any)=> res['Model']));
}     
async OtelBolgeEkle(sabit:Sabit,tip:IslemTipi):Promise<ReturnValues>  {
  const headers = new HttpHeaders(
    {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Headers': 'Content-Type',
   }
  ); 

    let options = { headers: headers };

    const body =  JSON.stringify({ 
      "Data":  sabit,  
      "Token":this.kullsrc.token, 
      "Tip":tip, 
    });

  var result = await this.http.post<any>(this.semUrl+"/Tanim/OtelBolgeEkle", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}

async GetOtelBolgelist(id:number)
  { 
       let url=this.semUrl+"/Tanim/GetOtelBolgelist?Docentry="+id+"&Token="+this.kullsrc.token; 
        return await this.http.get<Sabit[]>(url).pipe( map((res:any)=> res['Model']));
}

async SatisBolgeEkle(sabit:Sabit,tip:IslemTipi):Promise<ReturnValues>  {
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
     }
    ); 
  
      let options = { headers: headers };
  
      const body =  JSON.stringify({ 
        "Data":  sabit,  
        "Token":this.kullsrc.token, 
        "Tip":tip, 
      });
  
    var result = await this.http.post<any>(this.semUrl+"/Tanim/SatisBolgeEkle", body, options).toPromise();
  
    var sonuc = JSON.parse(JSON.stringify(result))['Model'];
    return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}

async GetSatisBolgelist(id:number)
    { 
         let url=this.semUrl+"/Tanim/GetSatisBolgelist?Docentry="+id+"&Token="+this.kullsrc.token; 
          return await this.http.get<Sabit[]>(url).pipe( map((res:any)=> res['Model']));
} 

async UyeDonemFiyatEkle(post:UyeDonemFiyat,tip:IslemTipi):Promise<ReturnValues>  {
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

  var result = await this.http.post<any>(this.semUrl+"/Tanim/UyeDonemFiyatEkle", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}

async GetUyeDonemFiyatList(id:number,donemid:number,ebatid:number,hafta:number)
{ 
     let url=this.semUrl+"/Tanim/GetUyeDonemFiyatList?Docentry="+id+"&DonemId="+donemid+"&EbatId="+ebatid +"&Hafta="+hafta+"&Token="+this.kullsrc.token;  
        return await this.http.get<Result<UyeDonemFiyat>>(url).pipe( map((res:any)=> res));
} 

async UyeHaftaEkle(post:UyeHafta,tip:IslemTipi):Promise<ReturnValues>  {
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

  var result = await this.http.post<any>(this.semUrl+"/Tanim/UyeHaftaEkle", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}

async GetUyeHaftaList(id:number,donemid:number,haftasayi:number)
{ 
     let url=this.semUrl+"/Tanim/GetUyeHaftaList?Docentry="+id+"&DonemId="+donemid+"&HaftaSayi="+haftasayi+"&Token="+this.kullsrc.token; 
        return await this.http.get<Result<UyeHafta>>(url).pipe( map((res:any)=> res));
} 

async UyeSozlesmeParametreEkle(post:UyeSozlParams,tip:IslemTipi):Promise<ReturnValues>  {
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

  var result = await this.http.post<any>(this.semUrl+"/Tanim/UyeSozlesmeParametreEkle", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}

async GetUyeSozlesmeParametreList(id:number)
{ 
     let url=this.semUrl+"/Tanim/GetUyeSozlesmeParametreList?Docentry="+id+"&Token="+this.kullsrc.token; 
        return await this.http.get<Result<UyeSozlParams>>(url).pipe( map((res:any)=> res));
} 

async UyeEbatEkle(post:UyeEbat,tip:IslemTipi):Promise<ReturnValues>  {
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

  var result = await this.http.post<any>(this.semUrl+"/Tanim/UyeEbatEkle", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}

async GetUyeEbatList(id:number)
{ 
     let url=this.semUrl+"/Tanim/GetUyeEbatList?Docentry="+id+"&Token="+this.kullsrc.token; 
        return await this.http.get<Result<UyeEbat>>(url).pipe( map((res:any)=> res));
}

async UyeDonemEkle(post:UyeDonem,tip:IslemTipi):Promise<ReturnValues>  {
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

  var result = await this.http.post<any>(this.semUrl+"/Tanim/UyeDonemEkle", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}

async GetUyeDonemList(id:number)
{ 
     let url=this.semUrl+"/Tanim/GetUyeDonemList?Docentry="+id+"&Token="+this.kullsrc.token; 
        return await this.http.get<Result<UyeDonem>>(url).pipe( map((res:any)=> res));
}

async UyeDurumEkle(post:UyeDurum,tip:IslemTipi):Promise<ReturnValues>  {
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

  var result = await this.http.post<any>(this.semUrl+"/Tanim/UyeDurumEkle", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}

async GetUyeDurumList(id:number,tip:string)
{ 
     let url=this.semUrl+"/Tanim/GetUyeDurumList?Docentry="+id+"&Tip="+tip+"&Token="+this.kullsrc.token; 
        return await this.http.get<Result<UyeDurum>>(url).pipe( map((res:any)=> res));
}

async UyeBagimsizBolumEkle(post:UyeBagimsizBolum,tip:IslemTipi):Promise<ReturnValues>  {
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

  var result = await this.http.post<any>(this.semUrl+"/Tanim/UyeBagimsizBolumEkle", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}

async GetUyeBagimsizBolumList(id:number,parselid:number)
{ 
     let url=this.semUrl+"/Tanim/GetUyeBagimsizBolumList?Docentry="+id+"&ParselId="+parselid+"&Token="+this.kullsrc.token; 
        return await this.http.get<Result<UyeBagimsizBolum>>(url).pipe( map((res:any)=> res));
}

async UyeHisseEkle(post:UyeHisse,tip:IslemTipi):Promise<ReturnValues>  {
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

  var result = await this.http.post<any>(this.semUrl+"/Tanim/UyeHisseEkle", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}

async GetUyeHisseList(id:number)
{ 
     let url=this.semUrl+"/Tanim/GetUyeHisseList?Docentry="+id+"&Token="+this.kullsrc.token; 
        return await this.http.get<Result<UyeHisse>>(url).pipe( map((res:any)=> res));
}

async UyeParselEkle(post:UyeParsel,tip:IslemTipi):Promise<ReturnValues>  {
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

  var result = await this.http.post<any>(this.semUrl+"/Tanim/UyeParselEkle", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}

async GetUyeParselList(id:number)
{ 
     let url=this.semUrl+"/Tanim/GetUyeParselList?Docentry="+id+"&Token="+this.kullsrc.token; 
        return await this.http.get<Result<UyeParsel>>(url).pipe( map((res:any)=> res));
}

async UyeDaireTipEkle(post:UyeDaireTip,tip:IslemTipi):Promise<ReturnValues>  {
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

  var result = await this.http.post<any>(this.semUrl+"/Tanim/UyeDaireTipEkle", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}

async GetUyeDaireTipList(id:number)
{ 
     let url=this.semUrl+"/Tanim/GetUyeDaireTipList?Docentry="+id+"&Token="+this.kullsrc.token; 
        return await this.http.get<Result<UyeDaireTip>>(url).pipe( map((res:any)=> res));
}

async UyeSatisTuruEkle(post:UyeSozlesmeSatisTuruTip,tip:IslemTipi):Promise<ReturnValues>  {
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

  var result = await this.http.post<any>(this.semUrl+"/Tanim/UyeSatisTuruEkle", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}

async GetUyeSatisTuruList(id:number)
{ 
     let url=this.semUrl+"/Tanim/GetUyeSatisTuruList?Docentry="+id+"&Token="+this.kullsrc.token; 
        return await this.http.get<Result<UyeSozlesmeSatisTuruTip>>(url).pipe( map((res:any)=> res));
}

async UyeSozlTaahhutEkle(post:UyeSozlTaahhut,tip:IslemTipi):Promise<ReturnValues>  {
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

  var result = await this.http.post<any>(this.semUrl+"/Tanim/UyeSozlTaahhutEkle", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}

async GetUyeSozlTaahhutList(id:number)
{ 
     let url=this.semUrl+"/Tanim/GetUyeSozlTaahhutList?Docentry="+id+"&Token="+this.kullsrc.token; 
        return await this.http.get<Result<UyeSozlTaahhut>>(url).pipe( map((res:any)=> res));
}

async UyeSozlOzelDurumEkle(post:UyeSozlOzelDurum,tip:IslemTipi):Promise<ReturnValues>  {
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

  var result = await this.http.post<any>(this.semUrl+"/Tanim/UyeSozlOzelDurumEkle", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}

async GetUyeSozlOzelDurumList(id:number)
{ 
     let url=this.semUrl+"/Tanim/GetUyeSozlOzelDurumList?Docentry="+id+"&Token="+this.kullsrc.token; 
        return await this.http.get<Result<UyeSozlOzelDurum>>(url).pipe( map((res:any)=> res));
}

async UyeOdemeTuruEkle(post:UyeOdemeTuru,tip:IslemTipi):Promise<ReturnValues>  {
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

  var result = await this.http.post<any>(this.semUrl+"/Tanim/UyeOdemeTuruEkle", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}

async GetUyeOdemeTuruList(id:number)
{ 
     let url=this.semUrl+"/Tanim/GetUyeOdemeTuruList?Docentry="+id+"&Token="+this.kullsrc.token; 
        return await this.http.get<Result<UyeOdemeTuru>>(url).pipe( map((res:any)=> res));
}

async UyeRaporDonemEkle(post:UyeRaporDonem,tip:IslemTipi):Promise<ReturnValues>  {
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

  var result = await this.http.post<any>(this.semUrl+"/Tanim/UyeRaporDonemEkle", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}

async GetUyeRaporDonemList(id:number)
{ 
     let url=this.semUrl+"/Tanim/GetUyeRaporDonemList?Docentry="+id+"&Token="+this.kullsrc.token; 
        return await this.http.get<Result<UyeRaporDonem>>(url).pipe( map((res:any)=> res));
}

async UyeRaporAltDonemEkle(post:UyeRaporAltDonem,tip:IslemTipi):Promise<ReturnValues>  {
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

  var result = await this.http.post<any>(this.semUrl+"/Tanim/UyeRaporAltDonemEkle", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}

async GetUyeRaporAltDonemList(id:number)
{ 
     let url=this.semUrl+"/Tanim/GetUyeRaporAltDonemList?Docentry="+id+"&Token="+this.kullsrc.token; 
        return await this.http.get<Result<UyeRaporAltDonem>>(url).pipe( map((res:any)=> res));
}

async IkFirmaEkle(post:IkFirmaModel,tip:IslemTipi):Promise<ReturnValues>  {
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

  var result = await this.http.post<any>(this.semUrl+"/Tanim/IkFirmaEkle", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}

async PozisyonMuhKodGuncelle(post:OnayHesapModel,tip:IslemTipi):Promise<ReturnValues>  {
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

  var result = await this.http.post<any>(this.semUrl+"/Login/PozisyonMuhKodGuncelle", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}

async GetIkFirmaList(id:number,sirketid:number)
{ 
     let url=this.semUrl+"/Tanim/GetIkFirmaList?Docentry="+id+"&SapSirketId="+sirketid+"&Token="+this.kullsrc.token; 
        return await this.http.get<Result<IkFirmaModel>>(url).pipe( map((res:any)=> res));
}

async FinHaftaSayiEkle(post:FinHaftaSayiModel,tip:IslemTipi):Promise<ReturnValues>  {
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

  var result = await this.http.post<any>(this.semUrl+"/Tanim/FinHaftaSayiEkle", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}

async GetFinHaftaSayiList(id:number)
{ 
     let url=this.semUrl+"/Tanim/GetFinHaftaSayiList?Docentry="+id+"&Token="+this.kullsrc.token; 
        return await this.http.get<Result<FinHaftaSayiModel>>(url).pipe( map((res:any)=> res));
}

async FinHaftaEkle(post:FinHaftaModel,tip:IslemTipi):Promise<ReturnValues>  {
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

  var result = await this.http.post<any>(this.semUrl+"/Tanim/FinHaftaEkle", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}

async GetFinHaftaList(id:number,yil:number,haftakisit:boolean)
{ 
     let url=this.semUrl+"/Tanim/GetFinHaftaList?Docentry="+id+"&Yil="+yil+"&Token="+this.kullsrc.token+"&HaftaKisit="+haftakisit; 
        return await this.http.get<Result<FinHaftaModel>>(url).pipe( map((res:any)=> res));
}

async FinDepartmanEkle(post:FinDepartmanModel,tip:IslemTipi):Promise<ReturnValues>  {
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

  var result = await this.http.post<any>(this.semUrl+"/Tanim/FinDepartmanEkle", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}

async GetFinDepartmanList(id:number)
{ 
     let url=this.semUrl+"/Tanim/GetFinDepartmanList?Docentry="+id+"&Token="+this.kullsrc.token; 
        return await this.http.get<Result<FinDepartmanModel>>(url).pipe( map((res:any)=> res));
}

async FinOdemeTurEkle(post:FinOdemeTuruModel,tip:IslemTipi):Promise<ReturnValues>  {
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

  var result = await this.http.post<any>(this.semUrl+"/Tanim/FinOdemeTurEkle", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}

async GetFinOdemeTuruList(id:number,birim:string)
{ 
     let url=this.semUrl+"/Tanim/GetFinOdemeTuruList?Docentry="+id+"&Birim="+birim+"&Token="+this.kullsrc.token; 
        return await this.http.get<Result<FinOdemeTuruModel>>(url).pipe( map((res:any)=> res));
}

async FinManagerEkle(post:FinManagerModel,tip:IslemTipi):Promise<ReturnValues>  {
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

  var result = await this.http.post<any>(this.semUrl+"/Tanim/FinManagerEkle", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}

async GetFinManagerList(id:number)
{ 
     let url=this.semUrl+"/Tanim/GetFinManagerList?Docentry="+id+"&Token="+this.kullsrc.token; 
        return await this.http.get<Result<FinManagerModel>>(url).pipe( map((res:any)=> res));
}

async HesapPlanEkle(post:HesapPlan,tip:IslemTipi):Promise<ReturnValues>  {
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

  var result = await this.http.post<any>(this.semUrl+"/Muhasebe/HesapPlanEkle", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}

async GetHesapPlanList(id:number,birim:string,altsurec:string,surec:string,goruntule:number)
{ 
     let url=this.semUrl+"/Muhasebe/GetHesapPlanList?Docentry="+id+"&Birim="+birim+"&AltSurec="+altsurec+"&Surec="+surec+"&Goruntule="+goruntule+"&Token="+this.kullsrc.token; 
        return await this.http.get<Result<HesapPlan>>(url).pipe( map((res:any)=> res));
}

async GetBankaList(kod:string)
{ 
     let url=this.semUrl+"/Muhasebe/GetBankaList?Kod="+kod+"&Token="+this.kullsrc.token; 
        return await this.http.get<Result<BankaModel>>(url).pipe( map((res:any)=> res));
}

async GetFinSurecList(id:number)
{ 
     let url=this.semUrl+"/Tanim/GetFinSurecList?Docentry="+id+"&Token="+this.kullsrc.token; 
        return await this.http.get<Result<Sabit>>(url).pipe( map((res:any)=> res));
}

async GetFinParametreList(id:number)
{ 
     let url=this.semUrl+"/Tanim/GetFinParametreList?Docentry="+id+"&Token="+this.kullsrc.token; 
        return await this.http.get<Result<Sabit>>(url).pipe( map((res:any)=> res));
}

async SurecEvEkle(post:SurecEvModel,tip:IslemTipi):Promise<ReturnValues>  {
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

  var result = await this.http.post<any>(this.semUrl+"/Tanim/SurecEvEkle", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}

async GetSurecEvList(id:number,departman:number,bolge:string,cins:number)
{ 
     let url=this.semUrl+"/Tanim/GetSurecEvList?Docentry="+id+"&Departman="+departman+"&Bolge="+bolge+"&Cins="+cins+"&Token="+this.kullsrc.token; 
        return await this.http.get<Result<SurecEvModel>>(url).pipe( map((res:any)=> res));
}

async SurecEvKonaklayanEkle(post:SurecEvKonaklayanModel,tip:IslemTipi):Promise<ReturnValues>  {
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

  var result = await this.http.post<any>(this.semUrl+"/Tanim/SurecEvKonaklayanEkle", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}

async GetSurecEvKonaklayanList(id:number,evid:number)
{ 
     let url=this.semUrl+"/Tanim/GetSurecEvKonaklayanList?Docentry="+id+"&EvId="+evid+"&Token="+this.kullsrc.token; 
        return await this.http.get<Result<SurecEvKonaklayanModel>>(url).pipe( map((res:any)=> res));
}

async SurecEvFaturaEkle(post:SurecEvFaturaModel,tip:IslemTipi):Promise<ReturnValues>  {
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

  var result = await this.http.post<any>(this.semUrl+"/Tanim/SurecEvFaturaEkle", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}

async GetSurecEvFaturaList(id:number,evid:number)
{ 
     let url=this.semUrl+"/Tanim/GetSurecEvFaturaList?Docentry="+id+"&EvId="+evid+"&Token="+this.kullsrc.token; 
        return await this.http.get<Result<SurecEvFaturaModel>>(url).pipe( map((res:any)=> res));
}

async SurecEvDemirbasEkle(post:SurecEvDemirbasModel,tip:IslemTipi):Promise<ReturnValues>  {
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

  var result = await this.http.post<any>(this.semUrl+"/Tanim/SurecEvDemirbasEkle", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}

async GetSurecEvDemirbasList(id:number,evid:number)
{ 
     let url=this.semUrl+"/Tanim/GetSurecEvDemirbasList?Docentry="+id+"&EvId="+evid+"&Token="+this.kullsrc.token; 
        return await this.http.get<Result<SurecEvDemirbasModel>>(url).pipe( map((res:any)=> res));
}

async SurecEvOrtakEkle(post:SurecEvOrtakModel,tip:IslemTipi):Promise<ReturnValues>  {
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

  var result = await this.http.post<any>(this.semUrl+"/Tanim/SurecEvOrtakEkle", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}

async GetSurecEvOrtakList(id:number,evid:number)
{ 
     let url=this.semUrl+"/Tanim/GetSurecEvOrtakList?Docentry="+id+"&EvId="+evid+"&Token="+this.kullsrc.token; 
        return await this.http.get<Result<SurecEvOrtakModel>>(url).pipe( map((res:any)=> res));
}

async DemirbasKatEkle(post:DemirbasKatModel,tip:IslemTipi):Promise<ReturnValues>  {
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

  var result = await this.http.post<any>(this.semUrl+"/Tanim/DemirbasKatEkle", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}

async GetDemirbasKatList(id:number)
{ 
     let url=this.semUrl+"/Tanim/GetDemirbasKatList?Docentry="+id+"&Token="+this.kullsrc.token; 
        return await this.http.get<Result<DemirbasKatModel>>(url).pipe( map((res:any)=> res));
}

async SimKartEkle(post:SimKartModel,tip:IslemTipi):Promise<ReturnValues>  {
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

  var result = await this.http.post<any>(this.semUrl+"/Tanim/SimKartEkle", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}

async GetSimKartList(id:number,sirketid:number)
{ 
     let url=this.semUrl+"/Tanim/GetSimKartList?Docentry="+id+"&SirketId="+sirketid+"&Token="+this.kullsrc.token; 
        return await this.http.get<Result<SimKartModel>>(url).pipe( map((res:any)=> res));
}

async SimKartKullaniciEkle(post:SimKartKullaniciModel,tip:IslemTipi):Promise<ReturnValues>  {
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

  var result = await this.http.post<any>(this.semUrl+"/Tanim/SimKartKullaniciEkle", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}

async GetSimKartKullaniciList(id:number,simkartid:number)
{ 
     let url=this.semUrl+"/Tanim/GetSimKartKullaniciList?Docentry="+id+"&SimKartId="+simkartid+"&Token="+this.kullsrc.token; 
        return await this.http.get<Result<SimKartKullaniciModel>>(url).pipe( map((res:any)=> res));
}

async GetEvMuhHesapList(kod:string)
{ 
     let url=this.semUrl+"/Muhasebe/GetEvMuhHesapList?Kod="+kod+"&Token="+this.kullsrc.token; 
        return await this.http.get<Result<CariHesapModel>>(url).pipe( map((res:any)=> res));
}

async FinTaahhukParametreEkle(post:FinTaahhukParametreModel,tip:IslemTipi):Promise<ReturnValues>  {
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

  var result = await this.http.post<any>(this.semUrl+"/Tanim/FinTaahhukParametreEkle", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}
async GetFinTaahhukParametreList(id:number)
{ 
     let url=this.semUrl+"/Tanim/GetFinTaahhukParametreList?Docentry="+id+"&Token="+this.kullsrc.token; 
        return await this.http.get<Result<FinTaahhukParametreModel>>(url).pipe( map((res:any)=> res));
}

async GetBoyutList(subeid:number,hesapkodu:string)
{ 
     let url=this.semUrl+"/Muhasebe/GetBoyutList?SubeId="+subeid+"&HesapKod="+hesapkodu+"&Token="+this.kullsrc.token; 
        return await this.http.get<Result<BoyutModel>>(url).pipe( map((res:any)=> res));
}

async GetBoyut1List(subeid:number)
{ 
     let url=this.semUrl+"/Muhasebe/GetBoyut1List?SubeId="+subeid+"&Token="+this.kullsrc.token; 
        return await this.http.get<Result<BoyutModel>>(url).pipe( map((res:any)=> res));
}

async GetBoyut2List(subeid:number,boyut1:string)
{ 
     let url=this.semUrl+"/Muhasebe/GetBoyut2List?SubeId="+subeid+"&Boyut1="+boyut1+"&Token="+this.kullsrc.token; 
        return await this.http.get<Result<BoyutModel>>(url).pipe( map((res:any)=> res));
}

async GetBoyut3List(subeid:number,boyut1:string,boyut2:string)
{ 
     let url=this.semUrl+"/Muhasebe/GetBoyut3List?SubeId="+subeid+"&Boyut1="+boyut1+"&Boyut2="+boyut2+"&Token="+this.kullsrc.token; 
        return await this.http.get<Result<BoyutModel>>(url).pipe( map((res:any)=> res));
}

async UyeAidatTanimEkle(post:UyeAidatTanimFiyat,tip:IslemTipi):Promise<ReturnValues>  {
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

  var result = await this.http.post<any>(this.semUrl+"/Tanim/UyeAidatTanimEkle", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}

async GetUyeAidatTamimList(id:number,donemid:number,ebatid:number,hafta:number,yil:number,tesisid:number)
{ 
     let url=this.semUrl+"/Tanim/GetUyeAidatTamimList?Docentry="+id+"&DonemId="+donemid+"&EbatId="+ebatid +"&Hafta="+hafta+"&Yil="+yil+"&TesisId="+tesisid+"&Token="+this.kullsrc.token;  
        return await this.http.get<Result<UyeAidatTanimFiyat>>(url).pipe( map((res:any)=> res));
}

async UyeKargoFirmaTanim(post:UyeKargoFirmaTanim,tip:IslemTipi):Promise<ReturnValues>  {
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

  var result = await this.http.post<any>(this.semUrl+"/Tanim/UyeKargoFirmaTanim", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}

async GetKargoFirmaTanimList(id:number)
{ 
     let url=this.semUrl+"/Tanim/GetKargoFirmaTanimList?Docentry="+id+"&Token="+this.kullsrc.token;  
        return await this.http.get<Result<UyeKargoFirmaTanim>>(url).pipe( map((res:any)=> res));
}

async UyeAidatTaahhukTanimEkle(post:UyeAidatTaahhukModel,tip:IslemTipi):Promise<ReturnValues>  {
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

  var result = await this.http.post<any>(this.semUrl+"/Tanim/UyeAidatTaahhukTanimEkle", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}
async GetUyeAidatTaahhukTanimList(id:number)
{ 
     let url=this.semUrl+"/Tanim/GetUyeAidatTaahhukTanimList?Docentry="+id+"&Token="+this.kullsrc.token; 
        return await this.http.get<Result<UyeAidatTaahhukModel>>(url).pipe( map((res:any)=> res));
}

async SmsBilgiTanim(post:SmsBilgiModel,tip:IslemTipi):Promise<ReturnValues>  {
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

  var result = await this.http.post<any>(this.semUrl+"/Tanim/SmsBilgiTanim", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}

async GetSmsBilgi(id:number,birim:number,tumu:boolean,DurumId:number)
{ 
     let url=this.semUrl+"/Tanim/GetSmsBilgi?Docentry="+id+"&SorumluBirim="+birim+"&Tumu="+tumu+"&DurumId="+DurumId+"&Token="+this.kullsrc.token; 
        return await this.http.get<Result<SmsBilgiModel>>(url).pipe( map((res:any)=> res));
}

async SmsBilgiOnay(post:SmsBilgiModel,tip:IslemTipi,onay:boolean):Promise<ReturnValues>  {
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
    "Token":this.kullsrc.token, 
    "Tip":tip, 
  });

  var result = await this.http.post<any>(this.semUrl+"/Tanim/SmsBilgiOnay", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}

async CrmKonuTanim(post:CrmKonuTanimModel,tip:IslemTipi):Promise<ReturnValues>  {
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

  var result = await this.http.post<any>(this.semUrl+"/Tanim/CrmKonuTanim", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}
async GetCrmKonuTanim(id:number)
{ 
     let url=this.semUrl+"/Tanim/GetCrmKonuTanim?Docentry="+id+"&Token="+this.kullsrc.token; 
        return await this.http.get<Result<CrmKonuTanimModel>>(url).pipe( map((res:any)=> res));
}

async CrmDurumTanim(post:CrmDurumTanimModel,tip:IslemTipi):Promise<ReturnValues>  {
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

  var result = await this.http.post<any>(this.semUrl+"/Tanim/CrmDurumTanim", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}
async GetCrmDurumTanim(id:number)
{ 
     let url=this.semUrl+"/Tanim/GetCrmDurumTanim?Docentry="+id+"&Token="+this.kullsrc.token; 
        return await this.http.get<Result<CrmDurumTanimModel>>(url).pipe( map((res:any)=> res));
}

async CrmBaiTanim(post:CrmBaiTanimModel,tip:IslemTipi):Promise<ReturnValues>  {
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

  var result = await this.http.post<any>(this.semUrl+"/Tanim/CrmBaiTanim", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}
async GetCrmBaiTanim(id:number,konuid:number)
{ 
     let url=this.semUrl+"/Tanim/GetCrmBaiTanim?Docentry="+id+"&KonuId="+konuid+"&Token="+this.kullsrc.token; 
        return await this.http.get<Result<CrmBaiTanimModel>>(url).pipe( map((res:any)=> res));
}

async GetRaporFormList(id:number)
{ 
     let url=this.semUrl+"/Tanim/GetRaporFormList?RaporId="+id+"&Token="+this.kullsrc.token; 
        return await this.http.get<Result<RaporTasarim>>(url).pipe( map((res:any)=> res));
}

async SimkartZimmetForm(hesap:SimKartKullaniciModel):Promise<ReturnValues>  {
  const headers = new HttpHeaders(
    {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Headers': 'Content-Type',
   }
  ); 

    let options = { headers: headers };

    const body =  JSON.stringify({ 
      "Data":  hesap,    
      "Token":this.kullsrc.token, 
    });

  var result = await this.http.post<any>(this.semUrl+"/Tanim/SimkartZimmetForm", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
} 

async SimkartZimmetIAdeForm(hesap:SimKartKullaniciModel):Promise<ReturnValues>  {
  const headers = new HttpHeaders(
    {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Headers': 'Content-Type',
   }
  ); 

    let options = { headers: headers };

    const body =  JSON.stringify({ 
      "Data":  hesap,    
      "Token":this.kullsrc.token, 
    });

  var result = await this.http.post<any>(this.semUrl+"/Tanim/SimkartZimmetIAdeForm", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
} 

async MatbuEvrakFormYazdir(hesap:MatbuFormModel):Promise<ReturnValues>  {
  const headers = new HttpHeaders(
    {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Headers': 'Content-Type',
   }
  ); 

    let options = { headers: headers };

    const body =  JSON.stringify({ 
      "Data":  hesap,    
      "Token":this.kullsrc.token, 
    });

  var result = await this.http.post<any>(this.semUrl+"/Tanim/MatbuEvrakFormYazdir", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}

async GetBankaHesapList(sapsubeid:number,bankakodu:string)
{ 
     let url=this.semUrl+"/Muhasebe/GetBankaHesapList?SubeId="+sapsubeid+"&BankaKodu="+bankakodu+"&Token="+this.kullsrc.token; 
        return await this.http.get<Result<SNT_KRD_BANKA_HESAPLAR>>(url).pipe( map((res:any)=> res));
}

async FinHareketKategoriTanim(post:FinHareketKategoriModel,tip:IslemTipi):Promise<ReturnValues>  {
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

  var result = await this.http.post<any>(this.semUrl+"/Tanim/FinHareketKategoriTanim", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}
async GetFinHareketKategoriTanim(id:number)
{ 
     let url=this.semUrl+"/Tanim/GetFinHareketKategoriTanim?Docentry="+id+"&Token="+this.kullsrc.token; 
        return await this.http.get<Result<FinHareketKategoriModel>>(url).pipe( map((res:any)=> res));
}

async KullaniciTalepKatEkle(post:KullaniciTalepKatModel,tip:IslemTipi):Promise<ReturnValues>  {
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

  var result = await this.http.post<any>(this.semUrl+"/Tanim/KullaniciTalepKatEkle", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}
async GetKullaniciTalepKat(id:number)
{ 
     let url=this.semUrl+"/Tanim/GetKullaniciTalepKat?Docentry="+id+"&Token="+this.kullsrc.token; 
        return await this.http.get<Result<KullaniciTalepKatModel>>(url).pipe( map((res:any)=> res));
}

async GetKullaniciTalepKat1()
{ 
     let url=this.semUrl+"/Tanim/GetKullaniciTalepKat1?Token="+this.kullsrc.token; 
        return await this.http.get<Result<KullaniciTalepKat1Model>>(url).pipe( map((res:any)=> res));
}

async GetKullaniciTalepKat2(kat1:string)
{ 
     let url=this.semUrl+"/Tanim/GetKullaniciTalepKat2?Kat1="+kat1+"&Token="+this.kullsrc.token; 
        return await this.http.get<Result<KullaniciTalepKat1Model>>(url).pipe( map((res:any)=> res));
}

async GetKullaniciTalepKat3(kat1:string,kat2:string)
{ 
     let url=this.semUrl+"/Tanim/GetKullaniciTalepKat3?Kat1="+kat1+"&Kat2="+kat2+"&Token="+this.kullsrc.token; 
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

  var result = await this.http.post<any>(this.semUrl+"/Tanim/KullaniciTalepEkle", body, options).toPromise();

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

  var result = await this.http.post<any>(this.semUrl+"/Tanim/KullaniciTalepSira", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}

async GetKullaniciTalep(id:number,durumid:Number)
{ 
     let url=this.semUrl+"/Tanim/GetKullaniciTalep?Docentry="+id+"&DurumId="+durumid+"&Token="+this.kullsrc.token; 
        return await this.http.get<Result<KullaniciTalepModel>>(url).pipe( map((res:any)=> res));
}

async GetKullaniciTalepOzet()
{ 
     let url=this.semUrl+"/Tanim/GetKullaniciTalepOzet?Token="+this.kullsrc.token; 
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

  var result = await this.http.post<any>(this.semUrl+"/Tanim/KullaniciTalepOnay", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}

async EtsPosSatisEkle(post:ElkPosSatis,tip:IslemTipi):Promise<ReturnValues>  {
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

  var result = await this.http.post<any>(this.semUrl+"/Tanim/EtsPosSatisEkle", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}

async GetEtsPosSatis(baslangic:Date,bitis:Date)
{ 
     let url=this.semUrl+"/Tanim/GetEtsPosSatis?Baslangic="+moment(baslangic).format("yyyy-MM-DD")+"&Bitis="+moment(bitis).format("yyyy-MM-DD")+"&Token="+ this.kullsrc.token; 
        return await this.http.get<Result<ElkPosSatis>>(url).pipe( map((res:any)=> res));
}

async GetEtsDepartmanList()
{ 
     let url=this.semUrl+"/Tanim/GetEtsDepartmanList?Token="+ this.kullsrc.token; 
        return await this.http.get<Result<SapEtsDepartman>>(url).pipe( map((res:any)=> res));
}

async OfisTanimEkle(post:OfisTanimModel,tip:IslemTipi):Promise<ReturnValues>  {
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

  var result = await this.http.post<any>(this.semUrl+"/Tanim/OfisTanimEkle", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}

async GetOfisTanim(id:number)
{ 
     let url=this.semUrl+"/Tanim/GetOfisTanim?DocEntry="+id+"&Token="+ this.kullsrc.token; 
        return await this.http.get<Result<OfisTanimModel>>(url).pipe( map((res:any)=> res));
}

async GenelLogEkle(Log:string,YetkiKodu:string,DocEntry:number,EkranId:number,SozlesmeNo:string):Promise<ReturnValues>  {
  const headers = new HttpHeaders(
    {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Headers': 'Content-Type',
   }
  ); 

  let options = { headers: headers };
  
  const body =  JSON.stringify({ 
    "Log":  Log,  
    "YetkiKodu":YetkiKodu, 
    "DocEntry":DocEntry, 
    "EkranId":EkranId, 
    "SozlesmeNo":SozlesmeNo, 
    "Token":this.kullsrc.token, 
  });

  var result = await this.http.post<any>(this.semUrl+"/Tanim/GenelLogEkle", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}

async TakipLogEkle(Aciklama:string,semkey:string):Promise<ReturnValues>  {
  const headers = new HttpHeaders(
    {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Headers': 'Content-Type',
   }
  ); 

  let options = { headers: headers };
  
  const body =  JSON.stringify({ 
    "Aciklama":  Aciklama,  
    "semkey":semkey,  
    "Token":this.kullsrc.token, 
  });

  var result = await this.http.post<any>(this.semUrl+"/Tanim/TakipLogEkle", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}

async AracMarkaTanim(post:AracMarkaModel,tip:IslemTipi):Promise<ReturnValues>  {
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

  var result = await this.http.post<any>(this.semUrl+"/Tanim/AracMarkaTanim", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}

async GetAracMarkaTanim(id:number)
{ 
     let url=this.semUrl+"/Tanim/GetAracMarkaTanim?DocEntry="+id+"&Token="+ this.kullsrc.token; 
        return await this.http.get<Result<AracMarkaModel>>(url).pipe( map((res:any)=> res));
}

async AracModelTanim(post:AracModelData,tip:IslemTipi):Promise<ReturnValues>  {
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

  var result = await this.http.post<any>(this.semUrl+"/Tanim/AracModelTanim", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}

async GetAracModelTanim(id:number,MarkaId:number)
{ 
     let url=this.semUrl+"/Tanim/GetAracModelTanim?DocEntry="+id+"&MarkaId="+MarkaId+"&Token="+ this.kullsrc.token; 
        return await this.http.get<Result<AracModelData>>(url).pipe( map((res:any)=> res));
}

async SapTabloTanim(post:SapTabloModel,tip:IslemTipi):Promise<ReturnValues>  {
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

  var result = await this.http.post<any>(this.semUrl+"/Tanim/SapTabloTanim", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
  }

  async GetSapTabloTanim(id:number)
  { 
      let url=this.semUrl+"/Tanim/GetSapTabloTanim?DocEntry="+id+"&Token="+ this.kullsrc.token; 
          return await this.http.get<Result<SapTabloModel>>(url).pipe( map((res:any)=> res));
  }

  async AracTanim(post:AracTanimModel,tip:IslemTipi):Promise<ReturnValues>  {
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
  
    var result = await this.http.post<any>(this.semUrl+"/Tanim/AracTanim", body, options).toPromise();
  
    var sonuc = JSON.parse(JSON.stringify(result))['Model'];
    return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
    }
  
    async GetAracTanim(id:number)
    { 
        let url=this.semUrl+"/Tanim/GetAracTanim?DocEntry="+id+"&Token="+ this.kullsrc.token; 
            return await this.http.get<Result<AracTanimModel>>(url).pipe( map((res:any)=> res));
    }

    async AracZimmet(post:AracZimmetModel,tip:IslemTipi):Promise<ReturnValues>  {
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
    
      var result = await this.http.post<any>(this.semUrl+"/Tanim/AracZimmet", body, options).toPromise();
    
      var sonuc = JSON.parse(JSON.stringify(result))['Model'];
      return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
      }
    
      async GetAracZimmet(id:number,aracid:number)
      { 
          let url=this.semUrl+"/Tanim/GetAracZimmet?DocEntry="+id+"&AracTanimId="+ aracid +"&Token="+ this.kullsrc.token; 
              return await this.http.get<Result<AracZimmetModel>>(url).pipe( map((res:any)=> res));
      }

    async FinansOdemeTip(post:FinanOdemeTipModel,tip:IslemTipi):Promise<ReturnValues>  {
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
    
      var result = await this.http.post<any>(this.semUrl+"/Tanim/FinansOdemeTip", body, options).toPromise();
    
      var sonuc = JSON.parse(JSON.stringify(result))['Model'];
      return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
      }
    
      async GetFinansOdemeTip(id:number)
      { 
          let url=this.semUrl+"/Tanim/GetFinansOdemeTip?DocEntry="+id+"&Token="+ this.kullsrc.token; 
              return await this.http.get<Result<FinanOdemeTipModel>>(url).pipe( map((res:any)=> res));
      }


      async MolaTipEkle(post:MolaTipModel,tip:IslemTipi):Promise<ReturnValues>  {
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
      
        var result = await this.http.post<any>(this.semUrl+"/Tanim/MolaTipEkle", body, options).toPromise();
      
        var sonuc = JSON.parse(JSON.stringify(result))['Model'];
        return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
        }
      
        async GetMolaTip(id:number,tumu:boolean)
        { 
            let url=this.semUrl+"/Tanim/GetMolaTip?DocEntry="+id+"&Tumu="+ tumu+"&Token="+ this.kullsrc.token; 
                return await this.http.get<Result<MolaTipModel>>(url).pipe( map((res:any)=> res));
        }

        async GetSistemTalepMesaj(talepid:number)
        {
         let url=this.semUrl+"/Tanim/GetSistemTalepMesaj?TalepId="+ talepid+"&Token="+ this.kullsrc.token;
         return await this.http.get<Result<KullaniciTalepMesajModel[]>>(url).pipe( map((res:any)=> res));
        }
  
        async AracZimmetForm(hesap:AracZimmetModel):Promise<ReturnValues>  {
          const headers = new HttpHeaders(
            {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Access-Control-Allow-Headers': 'Content-Type',
           }
          ); 
        
            let options = { headers: headers };
        
            const body =  JSON.stringify({ 
              "Data":  hesap,    
              "Token":this.kullsrc.token, 
            });
        
          var result = await this.http.post<any>(this.semUrl+"/Tanim/AracZimmetForm", body, options).toPromise();
        
          var sonuc = JSON.parse(JSON.stringify(result))['Model'];
          return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
        } 
        
        async AracZimmetIAdeForm(hesap:AracZimmetModel):Promise<ReturnValues>  {
          const headers = new HttpHeaders(
            {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Access-Control-Allow-Headers': 'Content-Type',
           }
          ); 
        
            let options = { headers: headers };
        
            const body =  JSON.stringify({ 
              "Data":  hesap,    
              "Token":this.kullsrc.token, 
            });
        
          var result = await this.http.post<any>(this.semUrl+"/Tanim/AracZimmetIAdeForm", body, options).toPromise();
        
          var sonuc = JSON.parse(JSON.stringify(result))['Model'];
          return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
        } 

        async AracGiderTipTanim(post:AracGiderTipModel,tip:IslemTipi):Promise<ReturnValues>  {
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
        
          var result = await this.http.post<any>(this.semUrl+"/Tanim/AracGiderTipTanim", body, options).toPromise();
        
          var sonuc = JSON.parse(JSON.stringify(result))['Model'];
          return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
        }
        
        async GetAracGiderTipTanim(id:number)
        { 
             let url=this.semUrl+"/Tanim/GetAracGiderTipTanim?DocEntry="+id+"&Token="+ this.kullsrc.token; 
                return await this.http.get<Result<AracGiderTipModel>>(url).pipe( map((res:any)=> res));
        }

        async AracGiderElke(post:AracGiderModel,tip:IslemTipi):Promise<ReturnValues>  {
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
        
          var result = await this.http.post<any>(this.semUrl+"/Tanim/AracGiderElke", body, options).toPromise();
        
          var sonuc = JSON.parse(JSON.stringify(result))['Model'];
          return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
        }
        
        async GetAracGider(id:number,aracid:number)
        { 
             let url=this.semUrl+"/Tanim/GetAracGider?DocEntry="+id+"&AracId="+ aracid+"&Token="+ this.kullsrc.token; 
                return await this.http.get<Result<AracGiderModel>>(url).pipe( map((res:any)=> res));
        }

        async AracSigortaElke(post:AracSigortaModel,tip:IslemTipi):Promise<ReturnValues>  {
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
        
          var result = await this.http.post<any>(this.semUrl+"/Tanim/AracSigortaElke", body, options).toPromise();
        
          var sonuc = JSON.parse(JSON.stringify(result))['Model'];
          return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
        }
        
        async GetAracSigorta(id:number,aracid:number)
        { 
             let url=this.semUrl+"/Tanim/GetAracSigorta?DocEntry="+id+"&AracId="+ aracid+"&Token="+ this.kullsrc.token; 
                return await this.http.get<Result<AracSigortaModel>>(url).pipe( map((res:any)=> res));
        }

        async TasinmazTipTanim(post:TasinmazTipModel,tip:IslemTipi):Promise<ReturnValues>  {
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
        
          var result = await this.http.post<any>(this.semUrl+"/Tanim/TasinmazTipTanim", body, options).toPromise();
        
          var sonuc = JSON.parse(JSON.stringify(result))['Model'];
          return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
        }
        
        async GetTasinmazTipTanim(id:number)
        { 
             let url=this.semUrl+"/Tanim/GetTasinmazTipTanim?DocEntry="+id+"&Token="+ this.kullsrc.token; 
                return await this.http.get<Result<TasinmazTipModel>>(url).pipe( map((res:any)=> res));
        }

        async PoliceTipTanim(post:PoliceTipModel,tip:IslemTipi):Promise<ReturnValues>  {
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
        
          var result = await this.http.post<any>(this.semUrl+"/Tanim/PoliceTipTanim", body, options).toPromise();
        
          var sonuc = JSON.parse(JSON.stringify(result))['Model'];
          return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
        }
        
        async GetPoliceTipTanim(id:number)
        { 
             let url=this.semUrl+"/Tanim/GetPoliceTipTanim?DocEntry="+id+"&Token="+ this.kullsrc.token; 
                return await this.http.get<Result<PoliceTipModel>>(url).pipe( map((res:any)=> res));
        } 

        async TasinmazTanim(post:TasinmazModel,tip:IslemTipi):Promise<ReturnValues>  {
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
        
          var result = await this.http.post<any>(this.semUrl+"/Tanim/TasinmazTanim", body, options).toPromise();
        
          var sonuc = JSON.parse(JSON.stringify(result))['Model'];
          return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
        }
        
        async GetTasinmazTanim(id:number)
        { 
             let url=this.semUrl+"/Tanim/GetTasinmazTanim?DocEntry="+id+"&Token="+ this.kullsrc.token; 
                return await this.http.get<Result<TasinmazModel>>(url).pipe( map((res:any)=> res));
        }

        async TasinmazSigortaTanim(post:TasinmazSigortaModel,tip:IslemTipi):Promise<ReturnValues>  {
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
        
          var result = await this.http.post<any>(this.semUrl+"/Tanim/TasinmazSigortaTanim", body, options).toPromise();
        
          var sonuc = JSON.parse(JSON.stringify(result))['Model'];
          return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
        }
        
        async GetTasinmazSigortaTanim(id:number,tasinmazid:number)
        { 
             let url=this.semUrl+"/Tanim/GetTasinmazSigortaTanim?DocEntry="+id+"&TasinmazId="+ tasinmazid+"&Token="+ this.kullsrc.token; 
                return await this.http.get<Result<TasinmazSigortaModel>>(url).pipe( map((res:any)=> res));
        }

        async SatisDaireBlokTanim(post:SatisSabitModel,tip:IslemTipi):Promise<ReturnValues>  {
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
        
          var result = await this.http.post<any>(this.semUrl+"/Tanim/SatisDaireBlokTanim", body, options).toPromise();
        
          var sonuc = JSON.parse(JSON.stringify(result))['Model'];
          return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
        }
        
        async GetSatisDaireBlokTanim(id:number)
        { 
             let url=this.semUrl+"/Tanim/GetSatisDaireBlokTanim?DocEntry="+id+"&Token="+ this.kullsrc.token; 
                return await this.http.get<Result<SatisSabitModel>>(url).pipe( map((res:any)=> res));
        } 

        async SatisDaireKatTanim(post:SatisSabitModel,tip:IslemTipi):Promise<ReturnValues>  {
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
        
          var result = await this.http.post<any>(this.semUrl+"/Tanim/SatisDaireKatTanim", body, options).toPromise();
        
          var sonuc = JSON.parse(JSON.stringify(result))['Model'];
          return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
        }
        
        async GetSatisDaireKatTanim(id:number)
        { 
             let url=this.semUrl+"/Tanim/GetSatisDaireKatTanim?DocEntry="+id+"&Token="+ this.kullsrc.token; 
                return await this.http.get<Result<SatisSabitModel>>(url).pipe( map((res:any)=> res));
        } 

        async SatisDaireKatTipTanim(post:SatisSabitModel,tip:IslemTipi):Promise<ReturnValues>  {
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
        
          var result = await this.http.post<any>(this.semUrl+"/Tanim/SatisDaireKatTipTanim", body, options).toPromise();
        
          var sonuc = JSON.parse(JSON.stringify(result))['Model'];
          return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
        }
        
        async GetSatisDaireKatTipTanim(id:number)
        { 
             let url=this.semUrl+"/Tanim/GetSatisDaireKatTipTanim?DocEntry="+id+"&Token="+ this.kullsrc.token; 
                return await this.http.get<Result<SatisSabitModel>>(url).pipe( map((res:any)=> res));
        } 

        async SatisDaireOdaTipTanim(post:SatisSabitModel,tip:IslemTipi):Promise<ReturnValues>  {
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
        
          var result = await this.http.post<any>(this.semUrl+"/Tanim/SatisDaireOdaTipTanim", body, options).toPromise();
        
          var sonuc = JSON.parse(JSON.stringify(result))['Model'];
          return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
        }
        
        async GetSatisDaireOdaTipTanim(id:number)
        { 
             let url=this.semUrl+"/Tanim/GetSatisDaireOdaTipTanim?DocEntry="+id+"&Token="+ this.kullsrc.token; 
                return await this.http.get<Result<SatisSabitModel>>(url).pipe( map((res:any)=> res));
        } 

        async SatisDaireCepheTanim(post:SatisSabitModel,tip:IslemTipi):Promise<ReturnValues>  {
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
        
          var result = await this.http.post<any>(this.semUrl+"/Tanim/SatisDaireCepheTanim", body, options).toPromise();
        
          var sonuc = JSON.parse(JSON.stringify(result))['Model'];
          return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
        }
        
        async GetSatisDaireCepheTanim(id:number)
        { 
             let url=this.semUrl+"/Tanim/GetSatisDaireCepheTanim?DocEntry="+id+"&Token="+ this.kullsrc.token; 
                return await this.http.get<Result<SatisSabitModel>>(url).pipe( map((res:any)=> res));
        } 

        async SatisDaireTanim(post:SatisDaireModel,tip:IslemTipi):Promise<ReturnValues>  {
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
        
          var result = await this.http.post<any>(this.semUrl+"/Tanim/SatisDaireTanim", body, options).toPromise();
        
          var sonuc = JSON.parse(JSON.stringify(result))['Model'];
          return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
        }
        
        async GetSatisDaireTanim(id:number)
        { 
             let url=this.semUrl+"/Tanim/GetSatisDaireTanim?DocEntry="+id+"&Token="+ this.kullsrc.token; 
                return await this.http.get<Result<SatisDaireModel>>(url).pipe( map((res:any)=> res));
        } 

        async AracYakitDataYukle(formdata:FormData):Promise<ReturnValues>  {
          const headers = new HttpHeaders();
          let options = { headers: headers };
    
          formdata.append('token', this.kullsrc.token+"" );
    
          var result = await this.http.post<any>(this.semUrl+"/Tanim/AracYakitDataYukle", formdata,options).toPromise();
    
          var sonuc = JSON.parse(JSON.stringify(result));
          return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
       }
    

        async AracYakitDataAktarim(post:AracYakitDataModel,tip:IslemTipi):Promise<ReturnValues>  {
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
        
          var result = await this.http.post<any>(this.semUrl+"/Tanim/AracYakitDataAktarim", body, options).toPromise();
        
          var sonuc = JSON.parse(JSON.stringify(result))['Model'];
          return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
        }
        
        async GetAracYakitDataAktarim(id:number,aracid:number,durumid:number,baslangic:Date,bitis:Date)
        { 
             let url=this.semUrl+"/Tanim/GetAracYakitDataAktarim?DocEntry="+id+"&AracId="+ aracid+"&DurumId="+ durumid+"&Baslangic="+moment(baslangic).format("yyyy-MM-DD")+"&Bitis="+moment(bitis).format("yyyy-MM-DD")+"&Token="+ this.kullsrc.token; 
                return await this.http.get<Result<AracYakitDataModel>>(url).pipe( map((res:any)=> res));
        }

        async AracYakitDataGiderEslestir():Promise<ReturnValues>  {
          const headers = new HttpHeaders(
            {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Access-Control-Allow-Headers': 'Content-Type',
           }
          ); 
        
          let options = { headers: headers };
          
          const body =  JSON.stringify({  
            "Token":this.kullsrc.token,  
          });
        
          var result = await this.http.post<any>(this.semUrl+"/Tanim/AracYakitDataGiderEslestir", body, options).toPromise();
        
          var sonuc = JSON.parse(JSON.stringify(result))['Model'];
          return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
        }

        async MailYonetimTanim(post:MailYonetimModel,tip:IslemTipi):Promise<ReturnValues>  {
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
        
          var result = await this.http.post<any>(this.semUrl+"/Tanim/MailYonetimTanim", body, options).toPromise();
        
          var sonuc = JSON.parse(JSON.stringify(result))['Model'];
          return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
        }
        
        async GetMailYonetim(id:number)
        { 
             let url=this.semUrl+"/Tanim/GetMailYonetim?DocEntry="+id+"&Token="+ this.kullsrc.token; 
                return await this.http.get<Result<MailYonetimModel>>(url).pipe( map((res:any)=> res));
        } 

        async MailYonetimTanimDetay(post:MailYonetimDetayModel | undefined,list:MailYonetimDetayModel[]=[],tip:IslemTipi):Promise<ReturnValues>  {
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
        
          var result = await this.http.post<any>(this.semUrl+"/Tanim/MailYonetimTanimDetay", body, options).toPromise();
        
          var sonuc = JSON.parse(JSON.stringify(result))['Model'];
          return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
        }
        
        async GetMailYonetimDetay(id:number)
        { 
             let url=this.semUrl+"/Tanim/GetMailYonetimDetay?DocEntry="+id+"&Token="+ this.kullsrc.token; 
                return await this.http.get<Result<MailYonetimDetayModel>>(url).pipe( map((res:any)=> res));
        } 

        async MailmSablonTanim(post:MailSablonModel,tip:IslemTipi):Promise<ReturnValues>  {
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
        
          var result = await this.http.post<any>(this.semUrl+"/Tanim/MailmSablonTanim", body, options).toPromise();
        
          var sonuc = JSON.parse(JSON.stringify(result))['Model'];
          return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
        }
        
        async GetMailmSablonTanim(id:number)
        { 
             let url=this.semUrl+"/Tanim/GetMailmSablonTanim?DocEntry="+id+"&Token="+ this.kullsrc.token; 
                return await this.http.get<Result<MailSablonModel>>(url).pipe( map((res:any)=> res));
        } 

        async SatisPrimLMGuncelle(hesaplamaid:number):Promise<ReturnValues>  {
          const headers = new HttpHeaders(
            {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Access-Control-Allow-Headers': 'Content-Type',
           }
          ); 
        
          let options = { headers: headers };
          
          const body =  JSON.stringify({ 
            "HesaplamaId":  hesaplamaid,  
            "Token":this.kullsrc.token 
          });
        
          var result = await this.http.post<any>(this.semUrl+"/Tanim/SatisPrimLMGuncelle", body, options).toPromise();
        
          var sonuc = JSON.parse(JSON.stringify(result))['Model'];
          return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
        }

        async FinBalansTipEkle(post:FinBalansTipModel,tip:IslemTipi):Promise<ReturnValues>  {
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
        
          var result = await this.http.post<any>(this.semUrl+"/Tanim/FinBalansTipEkle", body, options).toPromise();
        
          var sonuc = JSON.parse(JSON.stringify(result))['Model'];
          return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
        }
        async GetBalansTipList(id:number)
        { 
             let url=this.semUrl+"/Tanim/GetBalansTipList?Docentry="+id+"&Token="+this.kullsrc.token; 
                return await this.http.get<Result<FinBalansTipModel>>(url).pipe( map((res:any)=> res));
        }

        async FinBalansDetayTipEkle(post:FinBalansTipDetayModel,tip:IslemTipi):Promise<ReturnValues>  {
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
        
          var result = await this.http.post<any>(this.semUrl+"/Tanim/FinBalansDetayTipEkle", body, options).toPromise();
        
          var sonuc = JSON.parse(JSON.stringify(result))['Model'];
          return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
        }
        async GetBalansDetayTipList(id:number,balanstipid:number)
        { 
             let url=this.semUrl+"/Tanim/GetBalansDetayTipList?Docentry="+id+"&BalansTipId="+balanstipid+"&Token="+this.kullsrc.token; 
                return await this.http.get<Result<FinBalansTipDetayModel>>(url).pipe( map((res:any)=> res));
        }

        async FinBalansKuralEkle(post:FinBalansKuralModel,tip:IslemTipi,TumSatirlar:boolean,Ekstre:BankaEkstreModel | undefined):Promise<ReturnValues>  {
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
            "TumSatirlar":  TumSatirlar,  
            "Ekstre":  Ekstre,  
            "Token":this.kullsrc.token, 
            "Tip":tip, 
          });
        
          var result = await this.http.post<any>(this.semUrl+"/Tanim/FinBalansKuralEkle", body, options).toPromise();
        
          var sonuc = JSON.parse(JSON.stringify(result))['Model'];
          return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
        }
        async GetBalansKuralList(id:number)
        { 
             let url=this.semUrl+"/Tanim/GetBalansKuralList?Docentry="+id+"&Token="+this.kullsrc.token; 
                return await this.http.get<Result<FinBalansKuralModel>>(url).pipe( map((res:any)=> res));
        }

        async DemirbasMarkaTanim(post:AracMarkaModel,tip:IslemTipi):Promise<ReturnValues>  {
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
        
          var result = await this.http.post<any>(this.semUrl+"/Tanim/DemirbasMarkaTanim", body, options).toPromise();
        
          var sonuc = JSON.parse(JSON.stringify(result))['Model'];
          return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
        }
        
        async GetDemirbasMarkaTanim(id:number)
        { 
             let url=this.semUrl+"/Tanim/GetDemirbasMarkaTanim?DocEntry="+id+"&Token="+ this.kullsrc.token; 
                return await this.http.get<Result<AracMarkaModel>>(url).pipe( map((res:any)=> res));
        }
        
        async DemirbasModelTanim(post:AracModelData,tip:IslemTipi):Promise<ReturnValues>  {
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
        
          var result = await this.http.post<any>(this.semUrl+"/Tanim/DemirbasModelTanim", body, options).toPromise();
        
          var sonuc = JSON.parse(JSON.stringify(result))['Model'];
          return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
        }
        
        async GetDemirbasModelTanim(id:number,MarkaId:number)
        { 
             let url=this.semUrl+"/Tanim/GetDemirbasModelTanim?DocEntry="+id+"&MarkaId="+MarkaId+"&Token="+ this.kullsrc.token; 
                return await this.http.get<Result<AracModelData>>(url).pipe( map((res:any)=> res));
        }

        async DemirbasOfisTanim(post:DemirbasOfisData,tip:IslemTipi):Promise<ReturnValues>  {
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
        
          var result = await this.http.post<any>(this.semUrl+"/Tanim/DemirbasOfisTanim", body, options).toPromise();
        
          var sonuc = JSON.parse(JSON.stringify(result))['Model'];
          return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
        }
        
        async GetDemirbasOfisTanim(id:number)
        { 
             let url=this.semUrl+"/Tanim/GetDemirbasOfisTanim?DocEntry="+id+"&Token="+ this.kullsrc.token; 
                return await this.http.get<Result<DemirbasOfisData>>(url).pipe( map((res:any)=> res));
        }

        async DemirbasTanim(post:DemibasData,tip:IslemTipi):Promise<ReturnValues>  {
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
        
          var result = await this.http.post<any>(this.semUrl+"/Tanim/DemirbasTanim", body, options).toPromise();
        
          var sonuc = JSON.parse(JSON.stringify(result))['Model'];
          return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
        }
        
        async GetDemirbasTanim(id:number,sirketid:number,ofisid:number,aramakey:string)
        { 
             let url=this.semUrl+"/Tanim/GetDemirbasTanim?DocEntry="+id+"&SirketId="+ sirketid+"&OfisId="+ ofisid+"&AramaKey="+ aramakey+"&Token="+ this.kullsrc.token; 
                return await this.http.get<Result<DemibasData>>(url).pipe( map((res:any)=> res));
        }

        async DemirbasZimmet(post:DemirbasZimmetModel,tip:IslemTipi):Promise<ReturnValues>  {
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
        
          var result = await this.http.post<any>(this.semUrl+"/Tanim/DemirbasZimmet", body, options).toPromise();
        
          var sonuc = JSON.parse(JSON.stringify(result))['Model'];
          return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
          }
        
          async GetDemirbasZimmet(id:number,aracid:number)
          { 
              let url=this.semUrl+"/Tanim/GetDemirbasZimmet?DocEntry="+id+"&AracTanimId="+ aracid +"&Token="+ this.kullsrc.token; 
                  return await this.http.get<Result<DemirbasZimmetModel>>(url).pipe( map((res:any)=> res));
          }

          async DemirbasZimmetForm(hesap:DemirbasZimmetModel):Promise<ReturnValues>  {
            const headers = new HttpHeaders(
              {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Access-Control-Allow-Headers': 'Content-Type',
             }
            ); 
          
              let options = { headers: headers };
          
              const body =  JSON.stringify({ 
                "Data":  hesap,    
                "Token":this.kullsrc.token, 
              });
          
            var result = await this.http.post<any>(this.semUrl+"/Tanim/DemirbasZimmetForm", body, options).toPromise();
          
            var sonuc = JSON.parse(JSON.stringify(result))['Model'];
            return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
          } 
          
          async DemirbasZimmetIAdeForm(hesap:DemirbasZimmetModel):Promise<ReturnValues>  {
            const headers = new HttpHeaders(
              {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Access-Control-Allow-Headers': 'Content-Type',
             }
            ); 
          
              let options = { headers: headers };
          
              const body =  JSON.stringify({ 
                "Data":  hesap,    
                "Token":this.kullsrc.token, 
              });
          
            var result = await this.http.post<any>(this.semUrl+"/Tanim/DemirbasZimmetIAdeForm", body, options).toPromise();
          
            var sonuc = JSON.parse(JSON.stringify(result))['Model'];
            return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
          } 

          async ITSozlesmeTipTanim(post:ITSozlesmeTipModel,tip:IslemTipi):Promise<ReturnValues>  {
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
          
            var result = await this.http.post<any>(this.semUrl+"/Tanim/ITSozlesmeTipTanim", body, options).toPromise();
          
            var sonuc = JSON.parse(JSON.stringify(result))['Model'];
            return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
          }
          
          async GetITSozlesmeTipTanim(id:number)
          { 
               let url=this.semUrl+"/Tanim/GetITSozlesmeTipTanim?DocEntry="+id+"&Token="+ this.kullsrc.token; 
                  return await this.http.get<Result<ITSozlesmeTipModel>>(url).pipe( map((res:any)=> res));
          }

          async ITSozlesmeTanim(post:ITSozlesmeModel,tip:IslemTipi):Promise<ReturnValues>  {
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
          
            var result = await this.http.post<any>(this.semUrl+"/Tanim/ITSozlesmeTanim", body, options).toPromise();
          
            var sonuc = JSON.parse(JSON.stringify(result))['Model'];
            return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
          }
          
          async GetITSozlesmeTanim(id:number)
          { 
               let url=this.semUrl+"/Tanim/GetITSozlesmeTanim?DocEntry="+id+"&Token="+ this.kullsrc.token; 
                  return await this.http.get<Result<ITSozlesmeModel>>(url).pipe( map((res:any)=> res));
          }
          async OtelOdaTipTanim(post:ITSozlesmeTipModel,tip:IslemTipi):Promise<ReturnValues>  {
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
          
            var result = await this.http.post<any>(this.semUrl+"/Tanim/OtelOdaTipTanim", body, options).toPromise();
          
            var sonuc = JSON.parse(JSON.stringify(result))['Model'];
            return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
          }
          
          async GetOtelOdaTipTanim(id:number)
          { 
               let url=this.semUrl+"/Tanim/GetOtelOdaTipTanim?DocEntry="+id+"&Token="+ this.kullsrc.token; 
                  return await this.http.get<Result<ITSozlesmeTipModel>>(url).pipe( map((res:any)=> res));
          }
          async UyeKampanyaTanim(post:UyeKampanyaModel,tip:IslemTipi):Promise<ReturnValues>  {
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
          
            var result = await this.http.post<any>(this.semUrl+"/Tanim/UyeKampanyaTanim", body, options).toPromise();
          
            var sonuc = JSON.parse(JSON.stringify(result))['Model'];
            return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
          }
          
          async GetUyeKampanyaTanim(id:number)
          { 
               let url=this.semUrl+"/Tanim/GetUyeKampanyaTanim?DocEntry="+id+"&Token="+ this.kullsrc.token; 
                  return await this.http.get<Result<UyeKampanyaModel>>(url).pipe( map((res:any)=> res));
          }
  
}

export class UyeKampanyaModel {    
  DocEntry:number=0;        
  Tanim:string="";               
  Detay:string="";               
  KodBaslangic:string="";    
  
  Aktif: boolean = false;
  EkleyenId: number = 0;
  Ekleyen: string = '';
  GuncelleyenId: number = 0;
  Guncelleyen: string = '';
  Kayit: Date = new Date();
  Guncelleme: Date = new Date(); 
}

export class ITSozlesmeModel {    
  DocEntry:number=0;        
  SozlesmeTipId:number=0;        
  SozlesmeTip:string="";               
  FirmaKodu:string="";               
  FirmaAdi:string="";    
  BasTarih: any;
  BitTarih: any;
  Tutar: number = 0;
  Aciklama:string="";    
  OnayId: number = 0;
  SirketId:number=0;
  Sirket:string="";   
  OnayDurum:string="";  

  EkleyenId: number = 0;
  Ekleyen: string = '';
  GuncelleyenId: number = 0;
  Guncelleyen: string = '';
  Kayit: Date = new Date();
  Guncelleme: Date = new Date(); 
}

export class ITSozlesmeTipModel {    
  DocEntry:number=0;        
  Tanim:string="";               
  EkleyenId: number = 0;
  Ekleyen: string = '';
  GuncelleyenId: number = 0;
  Guncelleyen: string = '';
  Kayit: Date = new Date();
  Guncelleme: Date = new Date(); 
}

export class DemirbasZimmetModel {    
  DocEntry:number=0;        
  DemirbasId:number=0;        
  MarkaId:number=0;        
  Marka:string="";    
  ModelId:number=0;        
  Model:string="";              
  BarkodNo:string="";               
  SeriNo:string="";
  OzelNot:string="";
  DurumId:number=0;        
  Durum:string="";  
  DemKategoriId:number=0;        
  DemKategori:string="";    
  FirmaKodu:string="";    
  FirmaAdi:string="";    
  SatAlimTarih:any;
  SatAlimTutar: number = 0;
  DemOfisId:number=0;        
  DemOfis:string="";  
  EkleyenId: number = 0;
  Aktif: boolean = false;
  Ekleyen: string = '';
  GuncelleyenId: number = 0;
  Guncelleyen: string = '';
  Kayit: any;
  Guncelleme: any; 

  EmpId:number=0;        
  ZimmetSahibi:string="";   
  Aciklama:string=""; 
  ZimmetBasTarih: any; 
  ZimmetBitTarih: any; 
  OnayId:number=0;    
  CezaFharId:number=0; 
}
export class DemibasData {    
  DocEntry:number=0;        
  MarkaId:number=0;        
  Marka:string="";    
  ModelId:number=0;        
  Model:string="";              
  BarkodNo:string="";               
  SeriNo:string="";
  OzelNot:string="";
  DurumId:number=0;        
  Durum:string="";  
  DemKategoriId:number=0;        
  DemKategori:string="";    
  FirmaKodu:string="";    
  FirmaAdi:string="";    
  SatAlimTarih:any;
  SatAlimTutar: number = 0;
  DemOfisId:number=0;        
  DemOfis:string="";  
  AktifZimmetId: number = 0;
  AktifZimmet:string="";  
  ZimmetSahibi:string="";  
  ZimmetBasTarih: any; 

  EkleyenId: number = 0;
  Ekleyen: string = '';
  GuncelleyenId: number = 0;
  Guncelleyen: string = '';
  Kayit: Date = new Date();
  Guncelleme: Date = new Date(); 
}
export class DemirbasOfisData {    
  DocEntry:number=0;        
  SirketId:number=0;        
  Sirket:string="";               
  Tanim:string="";               
  Aciklama:string="";               
  EkleyenId: number = 0;
  Ekleyen: string = '';
  GuncelleyenId: number = 0;
  Guncelleyen: string = '';
  Kayit: Date = new Date();
  Guncelleme: Date = new Date(); 
}
export class FinBalansTipDetayModel {    
  DocEntry:number=0;     
  Tanim:string="";   
  BalansTipId:number=0;     
  BalansTip:string=""; 
  Aktif:boolean=false;
  Ekleyen:number=0; 
  EkleyenAd:string="";
  Guncelleyen:number=0;
  GuncelleyenAd:string="";
  Kayit:Date=new Date();
  Guncelleme:Date=new Date(); 
}

export class FinBalansKuralModel {    
  DocEntry:number=0;     
  BankaId:number=0;     
  Banka:string="";   
  BalansTipId:number=0;     
  BalansTip:string="";  
  BalansDetayTipId:number=0;     
  BalansDetayTip:string=""; 
  Aciklama:string="";  
  Basliyor:string="";  
  Icerir:string="";  
  BorcAlacak:string="";  
  Aktif:boolean=false;
  Ekleyen:number=0; 
  EkleyenAd:string="";
  Guncelleyen:number=0;
  GuncelleyenAd:string="";
  Kayit:Date=new Date();
  Guncelleme:Date=new Date();  
}

export class FinBalansTipModel {    
  DocEntry:number=0;     
  Tanim:string="";   
  ManuelKayitEklenebilir:boolean=false;
  Aktif:boolean=false;
  Ekleyen:number=0; 
  EkleyenAd:string="";
  Guncelleyen:number=0;
  GuncelleyenAd:string="";
  Kayit:Date=new Date();
  Guncelleme:Date=new Date(); 
}
export class MailSablonModel {    
  DocEntry:number=0;        
  Baslik:string="";   
  Sablon:string="";   
  Aciklama:string="";   

  EkleyenId: number = 0;
  Ekleyen: string = '';
  GuncelleyenId: number = 0;
  Guncelleyen: string = '';
  Kayit: Date = new Date();
  Guncelleme: Date = new Date(); 
  Aktif:boolean=false; 
}
export class MailYonetimDetayModel {    
  DocEntry:number=0;        
  Baslik:string="";   
  Aciklama:string="";   
  SorumluBirimId:number=0;    
  SorumluBirim:string="";   
  MailTanimId: number = 0;
  MailTanim:string="";   
  EmpId: number = 0;
  AdSoyad:string="";   
  Email:string="";   
  Departman:string="";   
  Pozisyon:string="";   
  Yonetici:string="";   

  EkleyenId: number = 0;
  Ekleyen: string = '';
  GuncelleyenId: number = 0;
  Guncelleyen: string = '';
  Kayit: Date = new Date();
  Guncelleme: Date = new Date(); 
  Aktif:boolean=false; 
}

export class MailYonetimModel {    
  DocEntry:number=0;        
  Baslik:string="";   
  Aciklama:string="";   
  SorumluBirimId:number=0;    
  SorumluBirim:string=""; 
  SablonId:number=0;    
  Sablon:string="";  
  EkleyenId: number = 0;
  Ekleyen: string = '';
  GuncelleyenId: number = 0;
  Guncelleyen: string = '';
  Kayit: Date = new Date();
  Guncelleme: Date = new Date(); 
  Aktif:boolean=false; 
}

export class AracYakitDataModel {    
  DocEntry:number=0;        
  BelgeAdi:string="";   
  AkarimGuid:string="";   
  Plaka:string="";   
  Tarih:string="";     
  TarihCevrim:any;           
  YakitTipi:string="";  
  BirimFiyat:number=0;    
  Litre:number=0;    
  ToplamTutar:number=0;    
  Km:number=0;    
  Fisno:string="";                
  BayiAdi:string="";               
  ErpKodu:string="";               
  AktarimId: number = 0;      
  EkleyenId: number = 0;
  Ekleyen: string = '';
  GuncelleyenId: number = 0;
  Guncelleyen: string = '';
  Kayit: Date = new Date();
  Guncelleme: Date = new Date(); 
  Aktif:boolean=false; 
}

export class SatisDaireModel {    
  DocEntry:number=0;        
  SirketId: number = 0;
  Sirket: string = '';   
  TesisId: number = 0;
  Tesis: string = '';
  BlokId: number = 0;
  Blok: string = '';
  KatId: number = 0;
  Kat: string = '';
  KatTipiId: number = 0;
  KatTipi: string = '';
  BolumNo: string = '';
  OdaNo: string = '';
  IsyeriNo: string = '';
  TapuDaireTipId: number = 0;
  TapuDaireTip: string = '';
  TapuBlokId: number = 0;
  TapuBlok: string = '';
  TapuKatId: number = 0;
  TapuKat: string = '';
  TapuKatTipiId: number = 0;
  TapuKatTipi: string = '';
  BrutM2: number = 0;
  NetM2: number = 0;
  OdaTipId: number = 0;
  OdaTip: string = '';
  CepheId: number = 0;
  Cephe:string = '';
  FiyatM2: number = 0;
  ToplamFiyat: number = 0;
  ParaBirim: string = '';
  KdvDurumId: number = 0;
  SatisSekliId: number = 0;

  EkleyenId: number = 0;
  Ekleyen: string = '';   
  GuncelleyenId: number = 0;
  Guncelleyen: string = '';
  Kayit: Date = new Date();
  Guncelleme: Date = new Date();
  Aktif:boolean=true; 

  SatisId: number = 0;
  Adi: string = '';   
  SozlesmeNo: string = '';   
} 

export class SatisSabitModel {    
  DocEntry:number=0;        
  Tanim:string="";               
  Aciklama:string="";     
  EkleyenId: number = 0;
  Ekleyen: string = '';          
  TesisId: number = 0;
  Tesis: string = '';
  GuncelleyenId: number = 0;
  Guncelleyen: string = '';
  Kayit: Date = new Date();
  Guncelleme: Date = new Date();
  Aktif:boolean=true; 
} 

export class TasinmazSigortaModel {    
  DocEntry:number=0;        
  TasinmazId:number=0;        
  Tasinmaz:string=""; 
  PoliceTipId:number=0;        
  PoliceTip:string="";  
  BasTarih:any;             
  BitTarih:any;             
  SigortaFirmaKod:string="";  
  SigortaFirmaAdi:string="";  
  PoliceNo:string="";  
  AcenteKodu:string="";  
  SehirId:string="";  
  Sehir:string="";  
  PrimTutar: number = 0;
  Aciklama:string="";          
  EkleyenId: number = 0;
  Ekleyen: string = '';
  GuncelleyenId: number = 0;
  Guncelleyen: string = '';
  Kayit: Date = new Date();
  Guncelleme: Date = new Date(); 
  Aktif:boolean=false; 
}

export class TasinmazModel {    
  DocEntry:number=0;        
  Tanim:string="";                
  Adres:string="";  
  SirketId: number = 0;
  Tarih:any;  
  Aciklama:string="";   
  TasinmazTipId:number=0;        
  TasinmazTip:string="";                  
  EkleyenId: number = 0;
  Ekleyen: string = '';
  GuncelleyenId: number = 0;
  Guncelleyen: string = '';
  Kayit: Date = new Date();
  Guncelleme: Date = new Date(); 
  Aktif:boolean=false; 
}

export class PoliceTipModel {    
  DocEntry:number=0;        
  Tanim:string="";               
  EkleyenId: number = 0;
  Ekleyen: string = '';
  GuncelleyenId: number = 0;
  Guncelleyen: string = '';
  Kayit: Date = new Date();
  Guncelleme: Date = new Date(); 
}

export class TasinmazTipModel {    
  DocEntry:number=0;        
  Tanim:string="";               
  EkleyenId: number = 0;
  Ekleyen: string = '';
  GuncelleyenId: number = 0;
  Guncelleyen: string = '';
  Kayit: Date = new Date();
  Guncelleme: Date = new Date(); 
}

export class AracSigortaModel {    
  DocEntry:number=0;        
  TrafikSonTarih:any; 
  TrafikSirketKod:string="";                
  TrafikSirketAdi:string="";  
  KaskoSonTarih:any; 
  KaskoSirketKod:string="";                
  KaskoSirketAdi:string="";               
  AracId: number = 0;
  AktifZimmetId: number = 0;
  Tutar: number = 0;
  KaskoTutar: number = 0;
  Aciklama:string="";               
  EkleyenId: number = 0;
  Ekleyen: string = '';
  GuncelleyenId: number = 0;
  Guncelleyen: string = '';
  Kayit: Date = new Date();
  Guncelleme: Date = new Date(); 
  Aktif:boolean=false; 
}

export class AracGiderModel {    
  DocEntry:number=0;        
  Tarih:any;               
  AracId: number = 0;
  AktifZimmetId: number = 0;
  Tutar: number = 0;
  Aciklama:string="";               
  EkleyenId: number = 0;
  Ekleyen: string = '';
  GuncelleyenId: number = 0;
  Guncelleyen: string = '';
  Kayit: Date = new Date();
  Guncelleme: Date = new Date(); 
  Aktif:boolean=false;
  GiderTipId: number = 0;
  GiderTip: string = '';
}

export class AracGiderTipModel {    
  DocEntry:number=0;        
  Tanim:string="";               
  EkleyenId: number = 0;
  Ekleyen: string = '';
  GuncelleyenId: number = 0;
  Guncelleyen: string = '';
  Kayit: Date = new Date();
  Guncelleme: Date = new Date(); 
}

export class AracZimmetModel {    
  DocEntry:number=0;        
  AracId:number=0;        
  Plaka:string="";    
  AracMarkaId:number=0;                
  AracMarka:string="";    
  AracModelId:number=0;                
  AracModel:string="";    
  Turu:number=0;                 
  TuruStr:string="";  
  SapSubeId:number=0;                  
  SapSube:string="";                
  KiralamaFirmaKodu:string="";                
  KiralamaFirmaAdi:string="";                
  AnlasmaFiyat: number = 0;
  YakitLimit: number = 0;
  KmLimit: number = 0;
  AnlBaslangicTarihi: any;
  AnlBitisTarihi: any; 
  EkleyenId: number = 0;
  Aktif: boolean = false;
  Ekleyen: string = '';
  GuncelleyenId: number = 0;
  Guncelleyen: string = '';
  Kayit: any;
  Guncelleme: any; 

  EmpId:number=0;        
  ZimmetSahibi:string="";  
  SehirId:string="";  
  Sehir:string="";
  Aciklama:string=""; 
  ZimmetBasTarih: any; 
  ZimmetBitTarih: any; 
  OnayId:number=0;    
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
  DocEntry: number = 0;
  TalepId: number = 0;
  Mesaj: string="";
  EkleyenId: number = 0;
  Ekleyen: string=""; 
  Kayit:any;
}

export class MolaTipModel {    
  DocEntry:number=0;        
  Adi:string="";  
  SorumluBirimId:number=0;        
  SorumluBirim:string="";              
  Aktif: boolean = false;
  EkleyenId: number = 0;
  Ekleyen: string = '';
  GuncelleyenId: number = 0;
  Guncelleyen: string = '';
  Kayit: Date = new Date();
  Guncelleme: Date = new Date(); 
}
export class FinanOdemeTipModel {    
  DocEntry:number=0;        
  Adi:string="";               
  EkleyenId: number = 0;
  OdemeSira: number = 0;
  Ekleyen: string = '';
  GuncelleyenId: number = 0;
  Guncelleyen: string = '';
  Kayit: Date = new Date();
  Guncelleme: Date = new Date(); 
  Yetki: boolean = false;
}
export class AracTanimModel {    
  DocEntry:number=0;        
  Plaka:string="";    
  AracMarkaId:number=0;                
  AracMarka:string="";    
  AracModelId:number=0;                
  AracModel:string="";    
  Turu:number=0;                 
  TuruStr:string="";  
  SapSubeId:number=0;                  
  SapSube:string="";                
  KiralamaFirmaKodu:string="";                
  KiralamaFirmaAdi:string="";                
  AnlasmaFiyat: number = 0;
  YakitLimit: number = 0;
  KmLimit: number = 0;
  AnlBaslangicTarihi: any;
  AnlBitisTarihi: any;
  MuayaneBitisTarih: any;
  EkleyenId: number = 0;
  Aktif: boolean = false;
  Ekleyen: string = '';
  GuncelleyenId: number = 0;
  Guncelleyen: string = '';
  Kayit: any;
  Guncelleme: any; 
  AktifZimmetId: number = 0;
}

export class SapTabloModel {    
  DocEntry:number=0;        
  VeriTabaniAdi:string="";                
  TabloAdi:string="";                
  Aciklama1:string="";                
  Aciklama2:string="";                
  EkleyenId: number = 0;
  Ekleyen: string = '';
  GuncelleyenId: number = 0;
  Guncelleyen: string = '';
  Kayit: Date = new Date();
  Guncelleme: Date = new Date(); 
}

export class AracModelData {    
  DocEntry:number=0;        
  Model:string="";               
  MarkaId:number=0; 
  Marka:string="";               
  EkleyenId: number = 0;
  Ekleyen: string = '';
  GuncelleyenId: number = 0;
  Guncelleyen: string = '';
  Kayit: Date = new Date();
  Guncelleme: Date = new Date(); 
}

export class AracMarkaModel {    
  DocEntry:number=0;        
  Marka:string="";               
  EkleyenId: number = 0;
  Ekleyen: string = '';
  GuncelleyenId: number = 0;
  Guncelleyen: string = '';
  Kayit: Date = new Date();
  Guncelleme: Date = new Date(); 
}

export class OfisTanimModel {    
  DocEntry:number=0;        
  OfisAdi:string="";         
  Logo:string="";         
  BackLogo:string="";         
  Title:string="";          
  EkleyenId:number=0; 
  Ekleyen:string="";
  GuncelleyenId:number=0;
  Guncelleyen:string="";
  Kayit:Date=new Date();
  Guncelleme:Date=new Date(); 
}
export class SapEtsDepartman {    
  Code:string="";    
  DeptKod:string="";    
  DeptAdi:string="";    
  SapSube:number=0;     
}
export class ElkPosSatis {    
  DocEntry:number=0;    
  ElektraId:number=0;    
  SubeId:number=0;     
  Sube:string="";   
  Tarih:any;         
  DepartmanKodu:string="";         
  Departman:string="";         
  GelirGrupKod:string="";         
  GelirGrup:string="";         
  StokKodu:string="";          
  StokAdi:string="";          
  Adet:number=0    
  Tutar:number=0    
  ToplamSatis:number=0   
  SonSatinAlmaMaliyet:number=0   
  SonSatinAlmaMaliyetToplam:number=0   
  SonSatinAlmaMaliyetKar:number=0    
  AdisyonTur:string="";  
  CariId:number=0    
  CarKod:string="";  
  CariUnvan:string="";   
  DepoKodu:string="";    
  DepoAdi:string="";   
  ReceteVarmi:number=0; 
  OrtalamaMaliyet:number=0; 
  OrtalamaMaliyetToplam:number=0; 
  OrtalamaMaliyetKar:number=0;  
  MalCikisId:number=0;  
  UretimSipNo:number=0;  
  UretimMalGirisNo:number=0;  
  MasrafMerkeziKodu:string=""; 
}
export class KullaniciTalepModel {    
  DocEntry:number=0;    
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
  Telefon:string="";   
  Ekleyen:number=0; 
  EkleyenAd:string="";
  Guncelleyen:number=0;
  GuncelleyenAd:string="";
  Kayit:Date=new Date();
  Guncelleme:Date=new Date(); 
  SorumluBirim:number=0; 
  SorumluBirimStr:string="";
  OncelikId:number=0;
}
export class KullaniciTalepKat1Model {    
  Id:number=0;        
  Kod:string="";         
  Adi:string="";   
}
export class KullaniciTalepKatModel {    
  DocEntry:number=0;        
  AnaModul:string="";         
  AltModul:string="";         
  Modul:string="";          
  Ekleyen:number=0; 
  EkleyenAd:string="";
  Guncelleyen:number=0;
  GuncelleyenAd:string="";
  Kayit:Date=new Date();
  Guncelleme:Date=new Date(); 
}
export class FinHareketKategoriModel {    
  DocEntry:number=0;        
  Adi:string="";         
  Aktif:boolean=false;
  Ekleyen:number=0; 
  EkleyenAd:string="";
  Guncelleyen:number=0;
  GuncelleyenAd:string="";
  Kayit:Date=new Date();
  Guncelleme:Date=new Date(); 
}
export class SNT_KRD_BANKA_HESAPLAR {     
  SapSube:number=0; 
  SapSubeAdi:string="";   
  HesapId:number=0;
  BankCode:string="";   
  BankName:string="";   
  SubeKodu:string="";   
  HesapNo:string="";   
  MuhasebeHesapPlanNo:string="";   
  IBAN:string="";   
  AcctName:string="";   
  MusteriNo:string="";   
  ParaBirim:string="";   
}
export class MatbuFormModel {     
  RaporParametre:string="";      
}
export class RaporTasarim {    
  ID:number=0;       
  BASLIK:string="";      
}
export class CrmBaiTanimModel {    
  Code:number=0;     
  KonuId:number=0;     
  Adi:string="";     
  Konu:string="";     
  Aktif:boolean=false;
  Ekleyen:number=0; 
  EkleyenAd:string="";
  Guncelleyen:number=0;
  GuncelleyenAd:string="";
  Kayit:Date=new Date();
  Guncelleme:Date=new Date(); 
}
export class CrmDurumTanimModel {    
  Code:number=0;     
  Adi:string="";     
  Aktif:boolean=false;
  Ekleyen:number=0; 
  EkleyenAd:string="";
  Guncelleyen:number=0;
  GuncelleyenAd:string="";
  Kayit:Date=new Date();
  Guncelleme:Date=new Date(); 
}
export class CrmKonuTanimModel {    
  Code:number=0;     
  AnaKonu:string="";   
  Konu:string="";   
  Aktif:boolean=false;
  Ekleyen:number=0; 
  EkleyenAd:string="";
  Guncelleyen:number=0;
  GuncelleyenAd:string="";
  Kayit:Date=new Date();
  Guncelleme:Date=new Date(); 
}
export class SmsBilgiModel {   
  Code:number=0;  
  Baslik:string="";  
  SmsBilgi:string="";
  EkranId:number=0; 
  Ekran:string="";
  DurumId:number=0; 
  Durum:string="";
  Tumu:boolean=false;
  Aktif:boolean=false;
  Ekleyen:number=0; 
  EkleyenAd:string="";
  Guncelleyen:number=0;
  GuncelleyenAd:string="";
  Kayit:Date=new Date();
  Guncelleme:Date=new Date();
  RetAciklama:string="";
  OnaylayanId:number=0; 
  OnaylayanAd:string="";
  OnayTarih:Date=new Date();
}
export class UyeAidatTaahhukModel {    
  Code:number=0;     
  Adi:string="";   
  Aktif:boolean=false;
  Ekleyen:number=0; 
  EkleyenAd:string="";
  Guncelleyen:number=0;
  GuncelleyenAd:string="";
  Kayit:Date=new Date();
  Guncelleme:Date=new Date(); 
}
export class UyeKargoFirmaTanim {   
  Code:number=0; 
  FirmaKodu:string=""; 
  FirmaAdi:string=""; 
  Adres:string=""; 
  ApiUrl:string=""; 
  ApiUser:string=""; 
  ApiKey:string=""; 
  Aktif:boolean=false;
  Ekleyen:number=0; 
  EkleyenAd:string="";
  Guncelleyen:number=0;
  GuncelleyenAd:string="";
  Kayit:Date=new Date();
  Guncelleme:Date=new Date();
}
export class UyeAidatTanimFiyat {   
  DocEntry:number=0;
  Yil:number=0;
  DonemId:number=0;
  Donem:string="";
  HaftaSayi:number=0;
  Hafta:string="";
  EbatId:number=0;
  Ebat:string="";
  Aidat:number=0; 
  TesisId:number=0; 
  Tesis:string="";
  Aktif:boolean=false;
  Ekleyen:number=0; 
  EkleyenAd:string="";
  Guncelleyen:number=0;
  GuncelleyenAd:string="";
  Kayit:Date=new Date();
  Guncelleme:Date=new Date();
}
export class BoyutModel {   
  Code:string="";
  Boyut3Kodu:string="";
  Boyut3Adi:string=""; 
}
export class FinTaahhukParametreModel {    
  Code:number=0;     
  Adi:string="";   
  Aktif:boolean=false;
  Ekleyen:number=0; 
  EkleyenAd:string="";
  Guncelleyen:number=0;
  GuncelleyenAd:string="";
  Kayit:Date=new Date();
  Guncelleme:Date=new Date(); 
}
export class CariHesapModel {   
  Code:number=0;
  CardCode:string="";
  CardName:string="";
  CardCurrencyName:string=""; 
}
export class SimKartKullaniciModel {    
  Code:number=0;     
  SimKartId:number=0;     
  EmpId:number=0;     
  AdSoyad:string="";   
  Bolge:string="";   
  BolgeStr:string="";   
  SeriNo:string="";   
  TeslimTarihi:Date=new Date(); 
  IadeTarihi!:Date;
  Aciklama:string="";   
  Aktif:boolean=false;
  Ekleyen:number=0; 
  EkleyenAd:string="";
  Guncelleyen:number=0;
  GuncelleyenAd:string="";
  Kayit:Date=new Date();
  Guncelleme:Date=new Date(); 
}
export class SimKartModel {    
  Code:number=0;     
  SubeId:number=0;     
  Sube:string="";   
  Operator:string="";   
  OperatorStr:string="";   
  PaketBilgi:string="";   
  CepTel:string="";   
  EvrakEklendi:number=0;
  Aktif:boolean=false;
  Ekleyen:number=0; 
  EkleyenAd:string="";
  Guncelleyen:number=0;
  GuncelleyenAd:string="";
  Kayit:Date=new Date();
  Guncelleme:Date=new Date(); 
}
export class DemirbasKatModel {    
  Code:number=0;     
  Adi:string="";   
  Aktif:boolean=false;
  Ekleyen:number=0; 
  EkleyenAd:string="";
  Guncelleyen:number=0;
  GuncelleyenAd:string="";
  Kayit:Date=new Date();
  Guncelleme:Date=new Date(); 
}
export class BankaModel {    
  BankCode:string="";   
  BankName:string="";  
}
export class SurecEvOrtakModel {
  semkey:string="";   
  Code:number=0;    
  EvId:number=0;    
  OrtakTuru:number=0;  
  OrtakTuruStr:string="";  
  Tutar:number=0;    
  OrtakAdi:string="";   
  OrtakTc:string="";   
  OrtakTel1:string="";   
  OrtakTel2:string="";   
  OrtakAdres:string="";   
  OrtakAdresKodu:string=""; 
  OrtakSehir:string="";  
  Sehir:string="";  
  OrtakIlce:string="";  
  Aktif:boolean=false;
  Ekleyen:number=0; 
  EkleyenAd:string="";
  Guncelleyen:number=0;
  GuncelleyenAd:string="";
  Kayit:Date=new Date();
  Guncelleme:Date=new Date();
}
export class SurecEvDemirbasModel {  
  semkey:string=""; 
  Code:number=0;    
  EvId:number=0;    
  DemKategoriId:number=0;   
  DemKategori:string=""; 
  Adet:number=0;    
  BirimFiyat:number=0;    
  Aciklama:string="";   
  Kontrol:string="";   
  KontrolTarih!:Date;
  KontrolEden:string="";   
  EvAdi:string="";   
  Ekip:string="";   
  Aktif:boolean=false;
  Ekleyen:number=0; 
  EkleyenAd:string="";
  Guncelleyen:number=0;
  GuncelleyenAd:string="";
  Kayit:Date=new Date();
  Guncelleme:Date=new Date();
}
export class SurecEvFaturaModel {   
  semkey:string="";
  Code:number=0;    
  EvId:number=0;    
  SurecId:number=0;    
  AltSurecId:number=0;    
  AboneAdi:string="";   
  SozlesmeNo:string="";   
  AboneNo:string="";   
  Surec:string="";   
  AltSurec:string="";  
  EkipEvno:number=0;     
  EvAdi:string="";   
  Aktif:boolean=false;
  Ekleyen:number=0; 
  EkleyenAd:string="";
  Guncelleyen:number=0;
  GuncelleyenAd:string="";
  Kayit:Date=new Date();
  Guncelleme:Date=new Date();
}
export class SurecEvKonaklayanModel {   
  semkey:string="";
  Code:number=0;    
  EvId:number=0;    
  EmpId:number=0;    
  AdiSoyadi:string="";   
  Departman:string="";   
  Pozisyon:string="";   
  Manager:string="";   
  Sirket:string="";     
  Aktif:boolean=false;
  Ekleyen:number=0; 
  EkleyenAd:string="";
  Guncelleyen:number=0;
  GuncelleyenAd:string="";
  Kayit:Date=new Date();
  Guncelleme:Date=new Date();
}
export class SurecEvModel {   
  semkey:string="";
  Code:number=0;    
  StopajHesapla:boolean=false;  
  ResmiHesap:boolean=false; 
  TumKasa:boolean=false;
  DepartmanId:number=0;   
  Departman:string=""; 
  Bolge:string=""; 
  BolgeId:string="00";  
  EkipId:number=0;    
  KasaId:number=0;
  Kasa:string="";
  ManagerId:number=0;   
  Manager:string="";    
  SubeId:number=0;   
  BoyutId:number=0; 
  MasrafMerkezi:string="";  
  MasrafMerkeziStr:string="";  
  KontratBaslangic:Date=new Date();
  KontrarBitis!:Date;
  MuhasebeKodu:string=""; 
  KontratImza:string=""; 
  CinsId:number=0;   
  KullanimTipi:number=0;   
  BelgeEklendi:number=0;
  EvOfisAdres:string="";  
  Aciklama:string="";  
  AyinKacinciGunu:number=0;   
  AidatTutar:number=0;   
  KiraBedeli:number=0;   
  FaturaKesilecek:boolean=false; 
  FaturaCari:string=""; 
  FaturaCariAdi:string=""; 
  EvSahibiAdi:string=""; 
  EvAdi:string=""; 
  EvSahibiTc:string=""; 
  EvSahibiTel1:string=""; 
  EvSahibiTel2:string=""; 
  EvSahibiAdres:string=""; 
  EvSahibiSehir:string=""; 
  EvSahibiSehirStr:string=""; 
  EvSahibiBanka:string=""; 
  EvSahibiBankaStr:string="";
  EvSahibiHesapNo:string=""; 
  EvSahibiIban:string=""; 

  Aktif:boolean=false;
  Ekleyen:number=0; 
  EkleyenAd:string="";
  Guncelleyen:number=0;
  GuncelleyenAd:string="";
  Kayit:Date=new Date();
  Guncelleme:Date=new Date();
}
export class HesapPlan {   
  Code:number=0;    
  HesapKodu:string="";   
  HesapAdi:string=""; 
  SurecId:number=0;    
  AltSurecId:number=0;    
  Surec:string="";  
  SurecTanim:string="";  
  BorcAlacak:string="";    
  Parametre:number=0;    
  ParametreStr:string="";
  KarsiParametre:number=0;
  KarsiParametreStr:string="";  
  FaturaSor:number=0;  
  OrtakKullanim:number=0;  
  KarsiIslem:number=0; 
  TalepYapilabilir:number=0; 
  TaahhukParamId:number=0;    
  TaahhukParam:string="";
  TopluIslem:number=0; 
  Goruntule:number=0;
  Aktif:boolean=false;
  Ekleyen:number=0; 
  EkleyenAd:string="";
  Guncelleyen:number=0;
  GuncelleyenAd:string="";
  Kayit:Date=new Date();
  Guncelleme:Date=new Date();
}
export class FinManagerModel {   
  Code:number=0;    
  Manager:string="";   
  Aktif:boolean=false;
  Ekleyen:number=0; 
  EkleyenAd:string="";
  Guncelleyen:number=0;
  GuncelleyenAd:string="";
  Kayit:Date=new Date();
  Guncelleme:Date=new Date();
}
export class FinOdemeTuruModel {   
  Code:number=0;    
  OdemeTuru:string="";  
  Bolum:string="";  
  Aktif:boolean=false;
  Ekleyen:number=0; 
  EkleyenAd:string="";
  Guncelleyen:number=0;
  GuncelleyenAd:string="";
  Kayit:Date=new Date();
  Guncelleme:Date=new Date();
}
export class FinDepartmanModel {   
  Code:number=0;    
  DepartmanAdi:string="";  
  Aktif:boolean=false;
  Ekleyen:number=0; 
  EkleyenAd:string="";
  Guncelleyen:number=0;
  GuncelleyenAd:string="";
  Kayit:Date=new Date();
  Guncelleme:Date=new Date();
}
export class FinHaftaModel {   
  Code:number=0;   
  Yil:number=0;  
  Hafta:number=0;  
  HaftaAdi:string=""; 
  Baslangic:any;
  Bitis:any; 
  Aktif:boolean=false;
  Ekleyen:number=0; 
  EkleyenAd:string="";
  Guncelleyen:number=0;
  GuncelleyenAd:string="";
  Kayit:Date=new Date();
  Guncelleme:Date=new Date();
}
export class FinHaftaSayiModel {   
  Code:number=0;   
  Hafta:number=0;  
  HaftaAdi:string="";  
  Aktif:boolean=false;
  Ekleyen:number=0; 
  EkleyenAd:string="";
  Guncelleyen:number=0;
  GuncelleyenAd:string="";
  Kayit:Date=new Date();
  Guncelleme:Date=new Date();
}
export class IkFirmaModel {   
  Code:number=0;  
  SapSubeId:number=0;   
  SapSube:string="";
  IkFirmaId:number=0;   
  IkFirmaAdi:string=""; 
  KullaniciAdi:string=""; 
  Sifre:string=""; 
  CompanyCode:string=""; 
  Host:string="";
  Port:number=0;
  EnableSsl:boolean=false;
  UseDefaultCredentials:boolean=false;
  Userx:string="";
  Pass:string="";
  Aktif:boolean=false;
  Ekleyen:number=0; 
  EkleyenAd:string="";
  Guncelleyen:number=0;
  GuncelleyenAd:string="";
  Kayit:Date=new Date();
  Guncelleme:Date=new Date();
  OfisId:number=0;
  OfisAdi:string="";
}
export class UyeRaporAltDonem {   
  Code:number=0;  
  AltDonemKod:number=0;   
  AltDonemTr:string="";
  AltDonemEng:string=""; 
  Aktif:boolean=false;
  Ekleyen:number=0; 
  EkleyenAd:string="";
  Guncelleyen:number=0;
  GuncelleyenAd:string="";
  Kayit:Date=new Date();
  Guncelleme:Date=new Date();
}
export class UyeRaporDonem {   
  Code:number=0;  
  Donem:number=0;    
  Aktif:boolean=false;
  Ekleyen:number=0; 
  EkleyenAd:string="";
  Guncelleyen:number=0;
  GuncelleyenAd:string="";
  Kayit:Date=new Date();
  Guncelleme:Date=new Date();
}
export class UyeOdemeTuru {   
  Code:number=0;  
  OdemeTuru:string="";   
  Aktif:boolean=false;
  Ekleyen:number=0; 
  EkleyenAd:string="";
  Guncelleyen:number=0;
  GuncelleyenAd:string="";
  Kayit:Date=new Date();
  Guncelleme:Date=new Date();
}
export class UyeSozlOzelDurum {   
  Code:number=0;  
  OzelDurum:string="";   
  Aktif:boolean=false;
  Ekleyen:number=0; 
  EkleyenAd:string="";
  Guncelleyen:number=0;
  GuncelleyenAd:string="";
  Kayit:Date=new Date();
  Guncelleme:Date=new Date();
}
export class UyeSozlTaahhut {   
  Code:number=0;  
  Taahhut:string="";  
  TaahhutBaslik:string="";
  IndirimOran:number=0; 
  Aktif:boolean=false;
  Ekleyen:number=0; 
  EkleyenAd:string="";
  Guncelleyen:number=0;
  GuncelleyenAd:string="";
  Kayit:Date=new Date();
  Guncelleme:Date=new Date();
}
export class UyeSozlesmeSatisTuruTip {   
  Code:number=0;  
  SatisTuru:string="";  
  MuhasebeKod:string="";  
  Aktif:boolean=false;
  Ekleyen:number=0; 
  EkleyenAd:string="";
  Guncelleyen:number=0;
  GuncelleyenAd:string="";
  Kayit:Date=new Date();
  Guncelleme:Date=new Date();
}
export class UyeDaireTip {   
  Code:number=0;  
  DaireTip:string="";  
  Aktif:boolean=false;
  Ekleyen:number=0; 
  EkleyenAd:string="";
  Guncelleyen:number=0;
  GuncelleyenAd:string="";
  Kayit:Date=new Date();
  Guncelleme:Date=new Date();
  RCIBRKodu:string="";
  RCIMPKodu:string="";
}
export class UyeParsel {   
  Code:number=0;  
  Parsel:string="";  
  Aktif:boolean=false;
  Ekleyen:number=0; 
  EkleyenAd:string="";
  Guncelleyen:number=0;
  GuncelleyenAd:string="";
  Kayit:Date=new Date();
  Guncelleme:Date=new Date();
}
export class UyeHisse {   
  Code:number=0;  
  Hisse:string="";  
  Aktif:boolean=false;
  Ekleyen:number=0; 
  EkleyenAd:string="";
  Guncelleyen:number=0;
  GuncelleyenAd:string="";
  Kayit:Date=new Date();
  Guncelleme:Date=new Date();
}
export class UyeBagimsizBolum {   
  Code:number=0; 
  ParselId:number=0; 
  Parsel:string="";
  Bolum:number=0;  
  Aktif:boolean=false;
  Ekleyen:number=0; 
  EkleyenAd:string="";
  Guncelleyen:number=0;
  GuncelleyenAd:string="";
  Kayit:Date=new Date();
  Guncelleme:Date=new Date();
}
export class UyeDurum {   
  Code:number=0; 
  DurumKodu:string="";
  DurumAdi:string=""; 
  Tip:string=""; 
  TipStr:string=""; 
  BirimAktar:string=""; 
  BirimId:number=0; 
  BirimAdi:string=""; 
  Prim:boolean=true;
  PrimOranFarkli:number=0; 
  FarkliPrimOran:number=0; 
  PrimDepartman:string=""; 
  Aktif:boolean=false;
  Ekleyen:number=0; 
  EkleyenAd:string="";
  Guncelleyen:number=0;
  GuncelleyenAd:string="";
  Kayit:Date=new Date();
  Guncelleme:Date=new Date();
}
export class UyeDonem {   
  Code:number=0; 
  DonemKodu:string="";
  DonemAdi:string=""; 
  Aktif:boolean=false;
  Ekleyen:number=0; 
  EkleyenAd:string="";
  Guncelleyen:number=0;
  GuncelleyenAd:string="";
  Kayit:Date=new Date();
  Guncelleme:Date=new Date();
}
export class UyeEbat {   
  Code:number=0; 
  EbatAdi:string="";
  DaireTipi:number=0;
  DaireTipiAdi:string="";
  Aktif:boolean=false;
  Ekleyen:number=0; 
  EkleyenAd:string="";
  Guncelleyen:number=0;
  GuncelleyenAd:string="";
  Kayit:Date=new Date();
  Guncelleme:Date=new Date();
}
export class UyeSozlParams {   
  Code:number=0; 
  AcenteId:number=0;
  Acente:string="";
  Uzunluk:number=0;
  SonSozlesmeNo:number=0;
  BaslangicKarakter:string="";
  Aktif:boolean=false;
  Ekleyen:number=0; 
  EkleyenAd:string="";
  Guncelleyen:number=0;
  GuncelleyenAd:string="";
  Kayit:Date=new Date();
  Guncelleme:Date=new Date();
}
export class UyeHafta {   
  Code:number=0; 
  DonemId:number=0;
  Donem:string="";
  HaftaSayi:number=0;
  Hafta:string="";
  Aktif:boolean=false;
  Ekleyen:number=0; 
  EkleyenAd:string="";
  Guncelleyen:number=0;
  GuncelleyenAd:string="";
  Kayit:Date=new Date();
  Guncelleme:Date=new Date();
}
export class UyeDonemFiyat {   
  Code:number=0;
  DonemId:number=0;
  Donem:string="";
  HaftaSayi:number=0;
  Hafta:string="";
  EbatId:number=0;
  Ebat:string="";
  Fiyat48:number=0;
  Fiyat36:number=0;
  FiyatPesin:number=0;
  YururlukTarih:Date=new Date();
  Aktif:boolean=false;
  Ekleyen:number=0; 
  EkleyenAd:string="";
  Guncelleyen:number=0;
  GuncelleyenAd:string="";
  Kayit:Date=new Date();
  Guncelleme:Date=new Date();
}
export class Sabit {   
  Code:number=0;
  Adi:string="";
  EngAdi:string="";
  Aktif:boolean=false;
  Ekleyen:number=0; 
  EkleyenAd:string="";
  Guncelleyen:number=0;
  GuncelleyenAd:string="";
  Kayit:Date=new Date();
  Guncelleme:Date=new Date();
}

export class Sabit2 {   
  DocEntry:number=0;
  Adi:string="";
  EngAdi:string="";
  Aktif:boolean=false;
  EkleyenId:number=0; 
  Ekleyen:string="";
  GuncelleyenId:number=0;
  Guncelleyen:string="";
  Kayit:Date=new Date();
  Guncelleme:Date=new Date();
}