import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core'; 
import { HesapModel, Result, ReturnValues, ReturnValuesList, SistemModel } from '../Genel/genelsrv';
import { isEmpty,map } from 'rxjs/operators';
import { NgbDateStruct, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import moment from 'moment';
import { IslemTipi } from '../Onay/onay-surev-src.service'; 
import { FinansHareketModel, TopluSenetEslestirmeModel, UyeAidatTahsilatModel } from '../finanssrc';
import { FiltreAramaModel, KullaniciModel, KullaniciSrcService } from '../kullanici/kullanici-src.service';
import { SmsBilgiModel, UyeKampanyaModel } from '../sabitsrc/sabitserv.service';

@Injectable({
  providedIn: 'root'
})
export class AnketYonetimService { 

  constructor(
      @Inject('semUrl') private semUrl:string,
      private http: HttpClient,
      private kullsrc:KullaniciSrcService
      )
      { }

  async anketYukle(formdata:FormData):Promise<ReturnValues>  {
      const headers = new HttpHeaders();
      let options = { headers: headers };

      formdata.append('token', this.kullsrc.token+"" );

      var result = await this.http.post<any>(this.semUrl+"/Anket/AnketYukle", formdata,options).toPromise();

      var sonuc = JSON.parse(JSON.stringify(result));
      return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
   }

   async getAnketList(anketid:number)
  {
       let url=this.semUrl+"/Anket/GetAnketList?AnketId="+anketid+"&Token="+ this.kullsrc.token;
        return await this.http.get<Result<AnketMaster[]>>(url).pipe( map((res:any)=> res));
  }

  async getAnketDeyayList(anketid:number)
  {
       let url=this.semUrl+"/Anket/GetAnketDetayList?AnketId="+anketid+"&Token="+ this.kullsrc.token;
        return await this.http.get<Result<AnketDetay[]>>(url).pipe( map((res:any)=> res));
  }

  async intAnketAktar(anketid:number,managerid:number,havuzmu:number):Promise<ReturnValues>  {
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
     }
    );

      let options = { headers: headers };

      const body =  JSON.stringify({
        "AnketId":  anketid,
        "ManagerId":  managerid,
        "Havuzmu":  havuzmu,
        "Token":this.kullsrc.token
      });

    var result = await this.http.post<any>(this.semUrl+"/Anket/InternetAnketAktar", body, options).toPromise();

    var sonuc = JSON.parse(JSON.stringify(result))['Model'];
    return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
 }

  async getAnketHavuzList(havuzid:number)
  {
       let url=this.semUrl+"/Anket/GetAnketHavuzList?HavuzId="+havuzid+"&Token="+ this.kullsrc.token;
        return await this.http.get<Result<AnketMaster[]>>(url).pipe( map((res:any)=> res));
  }

  async getAnketHavuzDeyayList(havuzid:number)
  {
       let url=this.semUrl+"/Anket/GetAnketHavuzDetayList?HavuzId="+havuzid+"&Token="+ this.kullsrc.token;
        return await this.http.get<Result<AnketDetay[]>>(url).pipe( map((res:any)=> res));
  }

  async intAnketEslestir(anketid:number,managerid:number,supervisorid:number,satir:AnketDetay[]):Promise<ReturnValues>  {
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
     }
    );

      let options = { headers: headers };

      const body =  JSON.stringify({
        "AnketId":  anketid,
        "ManagerId":  managerid,
        "SupervisorId":  supervisorid,
        "Satir":  satir,
        "Token":this.kullsrc.token
      });

    var result = await this.http.post<any>(this.semUrl+"/Anket/InternetAnketEslestir", body, options).toPromise();

    var sonuc = JSON.parse(JSON.stringify(result))['Model'];
    return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
 }

 async faturaOlustur(havuzid:number):Promise<ReturnValues>  {
  const headers = new HttpHeaders(
    {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Headers': 'Content-Type',
   }
  );

    let options = { headers: headers };

    const body =  JSON.stringify({
      "DocEntry":  havuzid,
      "Token":this.kullsrc.token
    });

  var result = await this.http.post<any>(this.semUrl+"/Anket/AnketFaturaOlustur", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
  }

  async getAnketFaturaDetay(faturaid:number)
  {
       let url=this.semUrl+"/Anket/GetAnketFaturaDetay?FaturaId="+faturaid+"&Token="+ this.kullsrc.token;
        return await this.http.get<Result<AnketDetay[]>>(url).pipe( map((res:any)=> res));
  }

  async GetTeleAnketAileBul(havuzid:number)
  {
       let url=this.semUrl+"/Anket/GetTeleAnketAileBul?HavuzId="+havuzid+"&Token="+ this.kullsrc.token;
        return await this.http.get<Result<AnketDetay>>(url).pipe( map((res:any)=> res));
  }

  async AnketDataGonder(anket:AnketDetay,durum:number,aciklama:string):Promise<ReturnValues>  {
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
     }
    );

      let options = { headers: headers };

      const body =  JSON.stringify({
        "Data":  anket,
        "Token":this.kullsrc.token,
        "Durum":durum,
        "Aciklama":aciklama
      });

    var result = await this.http.post<any>(this.semUrl+"/Anket/AnketDataGonder", body, options).toPromise();

    var sonuc = JSON.parse(JSON.stringify(result))['Model'];
    return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
    }

 async GetAnketGorusmeDetay(comment:number)
 {
      let url=this.semUrl+"/Anket/GetAnketGorusmeDetay?Token="+ this.kullsrc.token+"&Comments="+comment;
       return await this.http.get<Result<AnketDetay[]>>(url).pipe( map((res:any)=> res));
 }

 async GetAnketOzet()
 {
      let url=this.semUrl+"/Anket/GetAnketOzet?Token="+ this.kullsrc.token;
       return await this.http.get<Result<AnketOzetSayi>>(url).pipe( map((res:any)=> res));
 }

 async GetTeleAnketHavuzManagerOzet(havuzid:number,durum:string,genel:string)
  {
       let url=this.semUrl+"/Anket/GetTeleAnketHavuzManagerOzet?HavuzId="+havuzid+"&Token="+ this.kullsrc.token+"&Durum="+durum+"&Genel="+genel;
        return await this.http.get<Result<TeleAnketMngOzet[]>>(url).pipe( map((res:any)=> res));
  }

 async TeleAnketHavuzDurumChg(havuzid:number,durum:string):Promise<ReturnValues>  {
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
     }
    );

      let options = { headers: headers };

      const body =  JSON.stringify({
        "HavuzId":  havuzid,
        "Token":this.kullsrc.token,
        "Durum":durum
      });

    var result = await this.http.post<any>(this.semUrl+"/Anket/TeleAnketHavuzDurumChg", body, options).toPromise();

    var sonuc = JSON.parse(JSON.stringify(result))['Model'];
    return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
 }

 async GetTeleAnketHavuzManagerGenel(managerid:number)
    {
        let url=this.semUrl+"/Anket/GetTeleAnketHavuzManagerGenel?Token="+ this.kullsrc.token+"&ManagerId="+ managerid;
          return await this.http.get<Result<TeleAnketMngOzet>>(url).pipe( map((res:any)=> res));
 }

 async GetTeleAnketAramaOzetGrafikData(baslangic:Date,bitis:Date,managerid:number)
    {
        let url=this.semUrl+"/Anket/GetTeleAnketAramaOzetGrafikData?Token="+ this.kullsrc.token+"&Baslangic="+moment(baslangic).format("yyyy-MM-DD")+"&Bitis="+moment(bitis).format("yyyy-MM-DD")+"&ManagerId="+ managerid;
          return await this.http.get<Result<TeleAnketGrafikData>>(url).pipe( map((res:any)=> res));
 }

 async AnketSoruEkle(soru:AnketSoruModel,tip:IslemTipi):Promise<ReturnValues>  {
  const headers = new HttpHeaders(
    {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
    );

    let options = { headers: headers };

    const body =  JSON.stringify({
      "Data":  soru,
      "Token":this.kullsrc.token,
      "Tip":tip
    });

  var result = await this.http.post<any>(this.semUrl+"/Anket/AnketSoruEkle", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
  }

 async GetAnketSoruList(ekranid:number,managerid:number)
 {
        let url=this.semUrl+"/Anket/GetAnketSoruList?EkranId="+ekranid+"&ManagerId="+managerid+"&Token="+ this.kullsrc.token;
          return await this.http.get<Result<AnketSoruModel[]>>(url).pipe( map((res:any)=> res));
 }

 async AnketMetinEkle(metin:AnketMetinModel,tip:IslemTipi):Promise<ReturnValues>  {
   const headers = new HttpHeaders(
     {
       'Content-Type': 'application/json',
       'Accept': 'application/json',
       'Access-Control-Allow-Headers': 'Content-Type',
     }
     );

     let options = { headers: headers };

     const body =  JSON.stringify({
       "Data":  metin,
       "Token":this.kullsrc.token,
       "Tip":tip
     });

   var result = await this.http.post<any>(this.semUrl+"/Anket/AnketMetinEkle", body, options).toPromise();

   var sonuc = JSON.parse(JSON.stringify(result))['Model'];
   return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
  }

 async GetAnketMetinList(ekranid:number,managerid:number)
 {
     let url=this.semUrl+"/Anket/GetAnketMetinList?EkranId="+ekranid+"&ManagerId="+managerid+"&Token="+ this.kullsrc.token;
      return await this.http.get<Result<AnketMetinModel[]>>(url).pipe( map((res:any)=> res));
 }

 async GetTeleOpcIstatistik()
 {
     let url=this.semUrl+"/Anket/GetTeleOpcIstatistik?Token="+ this.kullsrc.token;
       return await this.http.get<Result<TeleAnketGrafikData>>(url).pipe( map((res:any)=> res));
 }

 async GetTeleDetayliIstatistik(baslangic:Date,bitis:Date)
  {
       let url=this.semUrl+"/Anket/GetTeleDetayliIstatistik?Baslangic="+moment(baslangic).format("yyyy-MM-DD")+"&Bitis="+moment(bitis).format("yyyy-MM-DD")+"&Token="+ this.kullsrc.token;
        return await this.http.get<Result<TeleGenelIstatistikModel[]>>(url).pipe( map((res:any)=> res));
  }

  async CallCagriEkle(call:CagriTrafikModel,tip:IslemTipi,sorumlubirim:number,furortaklist:FuOrtakModel[]=[]):Promise<ReturnValues>  {
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
      );

      let options = { headers: headers };
      var dahili = sessionStorage.getItem("Dahili")?.toString()??"";
      const body =  JSON.stringify({
        "Data":  call,
        "Token":this.kullsrc.token,
        "Ortak":furortaklist,
        "SorumluBirim":sorumlubirim,
        "Dahili":dahili.split("-")[0],
        "Tip":tip
      });

    var result = await this.http.post<any>(this.semUrl+"/Anket/CallCagriEkle", body, options).toPromise();

    var sonuc = JSON.parse(JSON.stringify(result))['Model'];
    return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
    }

    async CallCagriNotGuncelle(call:CagriTrafikModel):Promise<ReturnValues>  {
      const headers = new HttpHeaders(
        {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
        );
  
        let options = { headers: headers };
        const body =  JSON.stringify({
          "Data":  call,
          "Token":this.kullsrc.token
        });
  
      var result = await this.http.post<any>(this.semUrl+"/Anket/CallCagriNotGuncelle", body, options).toPromise();
  
      var sonuc = JSON.parse(JSON.stringify(result))['Model'];
      return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
      }

    async CallCagriEkleBilinmeyen(data:CagriBilinmeyenModel):Promise<ReturnValues>  {
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
          "Token":this.kullsrc.token 
        });
  
      var result = await this.http.post<any>(this.semUrl+"/Anket/CallCagriEkleBilinmeyen", body, options).toPromise();
  
      var sonuc = JSON.parse(JSON.stringify(result))['Model'];
      return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
      }

    async CallCagriEkleManuel(call:CagriTrafikModel,tip:IslemTipi,sorumlubirim:number):Promise<ReturnValues>  {
      const headers = new HttpHeaders(
        {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
        );
  
        let options = { headers: headers };
  
        const body =  JSON.stringify({
          "Data":  call,
          "Token":this.kullsrc.token,
          "SorumluBirim":sorumlubirim,
          "Tip":tip
        });
  
      var result = await this.http.post<any>(this.semUrl+"/Anket/CallCagriEkleManuel", body, options).toPromise();
  
      var sonuc = JSON.parse(JSON.stringify(result))['Model'];
      return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
      }

 async GetCallCagriList(cagriid:number,opcid:number,managerid:number,ekranid:number)
 {
      let url=this.semUrl+"/Anket/GetCallCagriList?CagriId="+cagriid+"&OpcId="+opcid+"&ManagerId="+managerid+"&EkranId="+ekranid+"&Token="+ this.kullsrc.token;
       return await this.http.get<Result<TeleGenelIstatistikModel[]>>(url).pipe( map((res:any)=> res));
 }

 async GetAnketCagriTrafik(ekranid:number)
 {
      let url=this.semUrl+"/Anket/GetAnketCagriTrafik?EkranId="+ekranid+"&Token="+ this.kullsrc.token;
       return await this.http.get<Result<TeleGenelIstatistikModel[]>>(url).pipe( map((res:any)=> res));
 }

 async GetConfHavuzList(havuzid:number,durum:string)
  {
       let url=this.semUrl+"/Anket/GetConfHavuzList?HavuzId="+havuzid+"&Token="+ this.kullsrc.token+"&Durum="+ durum;
        return await this.http.get<Result<AnketMaster[]>>(url).pipe( map((res:any)=> res));
  }

  async GetConfManuelAnketHavuzList(ankettipi:string)
  {
       let url=this.semUrl+"/Anket/GetConfManuelAnketHavuzList?AnketTipi="+ankettipi+"&Token="+ this.kullsrc.token;
        return await this.http.get<Result<AnketMaster[]>>(url).pipe( map((res:any)=> res));
  }

  async GetConfHavuzDetayList(havuzid:number,durum:number)
  {
       let url=this.semUrl+"/Anket/GetConfHavuzDetayList?HavuzId="+havuzid+"&Token="+ this.kullsrc.token+"&Durum="+durum;
        return await this.http.get<Result<AnketDetay[]>>(url).pipe( map((res:any)=> res));
  }

  async ConfAnketGonder(anketid:number,confid:number,satir:AnketDetay[]):Promise<ReturnValues>  {
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
     }
    );

      let options = { headers: headers };

      const body =  JSON.stringify({
        "AnketId":  anketid,
        "ConfId":  confid,
        "Satir":  satir,
        "Token":this.kullsrc.token
      });

    var result = await this.http.post<any>(this.semUrl+"/Anket/ConfAnketGonder", body, options).toPromise();

    var sonuc = JSON.parse(JSON.stringify(result))['Model'];
    return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
  }

  async ConfAnketAtamaIptal(anketid:number,satir:AnketDetay[]):Promise<ReturnValues>  {
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
     }
    );

      let options = { headers: headers };

      const body =  JSON.stringify({
        "AnketId":  anketid, 
        "Satir":  satir,
        "Token":this.kullsrc.token
      });

    var result = await this.http.post<any>(this.semUrl+"/Anket/ConfAnketAtamaIptal", body, options).toPromise();

    var sonuc = JSON.parse(JSON.stringify(result))['Model'];
    return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
  }

  async GetConfAnketOzet()
 {
      let url=this.semUrl+"/Anket/GetConfAnketOzet?Token="+ this.kullsrc.token;
       return await this.http.get<Result<AnketOzetSayi>>(url).pipe( map((res:any)=> res));
 }

 async GetConfAnketGorusmeDetay(comments:number)
 {
      let url=this.semUrl+"/Anket/GetConfAnketGorusmeDetay?Token="+ this.kullsrc.token+"&Comments="+comments;
       return await this.http.get<Result<AnketDetay[]>>(url).pipe( map((res:any)=> res));
 }

 async GetConfAnketDetay(confid:number)
  {
       let url=this.semUrl+"/Anket/GetConfAnketDetay?ConfId="+confid+"&Token="+ this.kullsrc.token;
        return await this.http.get<Result<AnketDetay[]>>(url).pipe( map((res:any)=> res));
  }

  async ConfAnketOlustur(anket:AnketDetay,durum:number,aciklama:string):Promise<ReturnValues>  {
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
     }
    );

      let options = { headers: headers };

      const body =  JSON.stringify({
        "Data":  anket,
        "Token":this.kullsrc.token,
        "Durum":durum,
        "Aciklama":aciklama
      });

    var result = await this.http.post<any>(this.semUrl+"/Anket/ConfAnketOlustur", body, options).toPromise();

    var sonuc = JSON.parse(JSON.stringify(result))['Model'];
    return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
    }

    async GetConfIstatistik()
    {
        let url=this.semUrl+"/Anket/GetConfIstatistik?Token="+ this.kullsrc.token;
          return await this.http.get<Result<TeleAnketGrafikData>>(url).pipe( map((res:any)=> res));
    }


  async ConfEkuriEkle(anket:AnketDetay):Promise<ReturnValues>  {
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
     }
    );

      let options = { headers: headers };

      const body =  JSON.stringify({
        "Data":  anket,
        "Token":this.kullsrc.token,
        "Durum":0,
        "Aciklama":""
      });

    var result = await this.http.post<any>(this.semUrl+"/Anket/ConfEkuriEkle", body, options).toPromise();

    var sonuc = JSON.parse(JSON.stringify(result))['Model'];
    return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
    }

    async ConfManuelAileEkle(anket:AnketDetay):Promise<ReturnValues>  {
      const headers = new HttpHeaders(
        {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Headers': 'Content-Type',
       }
      );
  
        let options = { headers: headers };
  
        const body =  JSON.stringify({
          "Data":  anket,
          "Token":this.kullsrc.token,
          "Durum":0,
          "Aciklama":""
        });
  
      var result = await this.http.post<any>(this.semUrl+"/Anket/ConfManuelAileEkle", body, options).toPromise();
  
      var sonuc = JSON.parse(JSON.stringify(result))['Model'];
      return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
      }

    async GetReConfHavuzDetay(comments:number,baslangic:Date,bitis:Date,kontrol:string)
    {
          let url=this.semUrl+"/Anket/GetReConfHavuzDetay?Token="+ this.kullsrc.token+"&Comments="+comments+"&Baslangic="+ moment(baslangic).format("yyyy-MM-DD")+"&Bitis="+moment(bitis).format("yyyy-MM-DD")+"&Kontrol="+kontrol;
          return await this.http.get<Result<AnketDetay[]>>(url).pipe( map((res:any)=> res));
    }

    async GetConfDetayliIstatistik(baslangic:Date,bitis:Date)
  {
       let url=this.semUrl+"/Anket/GetConfDetayliIstatistik?Baslangic="+moment(baslangic).format("yyyy-MM-DD")+"&Bitis="+moment(bitis).format("yyyy-MM-DD")+"&Token="+ this.kullsrc.token;
        return await this.http.get<Result<TeleGenelIstatistikModel[]>>(url).pipe( map((res:any)=> res));
  }

  async ReConfAnketOlustur(anket:AnketDetay,durum:number,aciklama:string):Promise<ReturnValues>  {
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
     }
    );

      let options = { headers: headers };

      const body =  JSON.stringify({
        "Data":  anket,
        "Token":this.kullsrc.token,
        "Durum":durum,
        "Aciklama":aciklama
      });

    var result = await this.http.post<any>(this.semUrl+"/Anket/ReConfAnketOlustur", body, options).toPromise();

    var sonuc = JSON.parse(JSON.stringify(result))['Model'];
    return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
    }

    async GetConfAnketAramaOzetGrafikData(aramatip:string,baslangic:Date,bitis:Date,managerid:number)
    {
        let url=this.semUrl+"/Anket/GetConfAnketAramaOzetGrafikData?Token="+ this.kullsrc.token+"&AramaTip="+aramatip+"&Baslangic="+moment(baslangic).format("yyyy-MM-DD")+"&Bitis="+moment(bitis).format("yyyy-MM-DD");
          return await this.http.get<Result<ConfeAnketGrafikData>>(url).pipe( map((res:any)=> res));
    }

    async GetConfAnketAramaOzet(managerid:number)
    {
        let url=this.semUrl+"/Anket/GetConfAnketAramaOzet?Token="+ this.kullsrc.token;
          return await this.http.get<Result<ConfAnketMngOzet>>(url).pipe( map((res:any)=> res));
    }

    async ReConfOtobusSip(anket:AnketDetay[],otobus:OtobusSiparisMod[]):Promise<ReturnValues>  {
      const headers = new HttpHeaders(
        {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Headers': 'Content-Type',
       }
      );

        let options = { headers: headers };

        const body =  JSON.stringify({
          "Anket":  anket,
          "Otobus":  otobus,
          "Token":this.kullsrc.token,
        });

      var result = await this.http.post<any>(this.semUrl+"/Anket/ReConfOtobusSip", body, options).toPromise();

      var sonuc = JSON.parse(JSON.stringify(result))['Model'];
      return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
      }

      async GetOtobusSiparislist(baslangic:Date,bitis:Date,ekran:number,tip:number,tarihtip:number)
      {
           let url=this.semUrl+"/Anket/GetOtobusSiparislist?Token="+ this.kullsrc.token+"&Baslangic="+moment(baslangic).format("yyyy-MM-DD")+"&Bitis="+moment(bitis).format("yyyy-MM-DD")+"&Ekran="+ ekran+"&Tip="+ tip+"&TarihTip="+ tarihtip;
            return await this.http.get<Result<OtobusSiparis[]>>(url).pipe( map((res:any)=> res));
      }

 async ReConfOtobusSipSonuc(siparis:OtobusSiparis):Promise<ReturnValues>  {
        const headers = new HttpHeaders(
          {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Headers': 'Content-Type',
         }
        );

          let options = { headers: headers };

          const body =  JSON.stringify({
            "Data":  siparis,
            "Token":this.kullsrc.token,
          });

        var result = await this.http.post<any>(this.semUrl+"/Anket/ReConfOtobusSipSonuc", body, options).toPromise();

        var sonuc = JSON.parse(JSON.stringify(result))['Model'];
        return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
   }

   async GetOtobusSiparisDetayList(siparisid:number,durum:number)
        {
             let url=this.semUrl+"/Anket/GetOtobusSiparisDetayList?Token="+ this.kullsrc.token+"&SiparisId="+siparisid+"&Durum="+durum;
              return await this.http.get<Result<OtobusSiparis[]>>(url).pipe( map((res:any)=> res));
   }

   async ReConfOtobusAtama(siparis:OtobusSiparis[]):Promise<ReturnValues>  {
          const headers = new HttpHeaders(
            {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Access-Control-Allow-Headers': 'Content-Type',
           }
          );

            let options = { headers: headers };

            const body =  JSON.stringify({
              "Data":  siparis,
              "Token":this.kullsrc.token,
            });

          var result = await this.http.post<any>(this.semUrl+"/Anket/ReConfOtobusAtama", body, options).toPromise();

          var sonuc = JSON.parse(JSON.stringify(result))['Model'];
          return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
     }

     async ReConfOtobusUyeVazgecti(siparis:OtobusSiparis[]):Promise<ReturnValues>  {
      const headers = new HttpHeaders(
        {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Headers': 'Content-Type',
       }
      );

        let options = { headers: headers };

        const body =  JSON.stringify({
          "Data":  siparis,
          "Token":this.kullsrc.token,
        });

      var result = await this.http.post<any>(this.semUrl+"/Anket/ReConfOtobusUyeVazgecti", body, options).toPromise();

      var sonuc = JSON.parse(JSON.stringify(result))['Model'];
      return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
 }

     async GetAnketAramaList(havuzid:number,havuzlineid:number)
          {
               let url=this.semUrl+"/Anket/GetAnketAramaList?Token="+ this.kullsrc.token+"&HavuzId="+havuzid+"&HavuzLineId="+havuzlineid;
                return await this.http.get<Result<AramaLog[]>>(url).pipe(map((res:any)=> res));
     }

     async GetAnketAramaListCrm(havuzid:number,havuzlineid:number)
          {
               let url=this.semUrl+"/Anket/GetAnketAramaListCrm?Token="+ this.kullsrc.token+"&HavuzId="+havuzid+"&HavuzLineId="+havuzlineid;
                return await this.http.get<Result<CagriTrafikModel[]>>(url).pipe(map((res:any)=> res));
     }

     async GetAnketAramaListFu(havuzid:number,havuzlineid:number)
          {
               let url=this.semUrl+"/Anket/GetAnketAramaListFu?Token="+ this.kullsrc.token+"&HavuzId="+havuzid+"&HavuzLineId="+havuzlineid;
                return await this.http.get<Result<CagriTrafikModel[]>>(url).pipe(map((res:any)=> res));
     }

     async OtobusBindi(siparis:OtobusSiparis[],islem:number):Promise<ReturnValues>  {
            const headers = new HttpHeaders(
              {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Access-Control-Allow-Headers': 'Content-Type',
             }
            );

              let options = { headers: headers };

              const body =  JSON.stringify({
                "Data":  siparis,
                "Islem":  islem,
                "Token":this.kullsrc.token,
              });

            var result = await this.http.post<any>(this.semUrl+"/Anket/OtobusBindi", body, options).toPromise();

            var sonuc = JSON.parse(JSON.stringify(result))['Model'];
            return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
       }

    async OtobusTaslakFaturaOlustur(siparis:OtobusSiparis[],islem:number):Promise<ReturnValues>  {
      const headers = new HttpHeaders(
        {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Headers': 'Content-Type',
       }
      );

        let options = { headers: headers };

        const body =  JSON.stringify({
          "Data":  siparis,
          "Islem":  islem,
          "Token":this.kullsrc.token,
        });

      var result = await this.http.post<any>(this.semUrl+"/Anket/OtobusTaslakFaturaOlustur", body, options).toPromise();

      var sonuc = JSON.parse(JSON.stringify(result))['Model'];
      return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
   }

   async GetOtobusFaturalist(baslangic:Date,bitis:Date,tip:number,firmakodu:string)
      {
           let url=this.semUrl+"/Anket/GetOtobusFaturalist?Token="+ this.kullsrc.token+"&Baslangic="+moment(baslangic).format("yyyy-MM-DD")+"&Bitis="+moment(bitis).format("yyyy-MM-DD")+"&Tip="+ tip+"&FirmaKodu="+ firmakodu;
            return await this.http.get<Result<OtobusSiparis[]>>(url).pipe( map((res:any)=> res));
   }

   async OtobusFaturaGuncelle(siparis:OtobusSiparis):Promise<ReturnValues>  {
        const headers = new HttpHeaders(
          {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Headers': 'Content-Type',
         }
        );

          let options = { headers: headers };

          const body =  JSON.stringify({
            "Data":  siparis,
            "Token":this.kullsrc.token,
          });

        var result = await this.http.post<any>(this.semUrl+"/Anket/OtobusFaturaGuncelle", body, options).toPromise();

        var sonuc = JSON.parse(JSON.stringify(result))['Model'];
        return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
   }

   async OtobusMutabakat(siparis:OtobusMutabakatMod[]):Promise<ReturnValues>  {
          const headers = new HttpHeaders(
            {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Access-Control-Allow-Headers': 'Content-Type',
           }
          );

            let options = { headers: headers };

            const body =  JSON.stringify({
              "Data":  siparis,
              "Token":this.kullsrc.token,
            });

          var result = await this.http.post<any>(this.semUrl+"/Anket/OtobusMutabakat", body, options).toPromise();

          var sonuc = JSON.parse(JSON.stringify(result))['Model'];
          return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
     }

      async OtobusSiparisSil(siparis:OtobusSiparis[]):Promise<ReturnValues>  {
          const headers = new HttpHeaders(
            {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Access-Control-Allow-Headers': 'Content-Type',
           }
          );

            let options = { headers: headers };

            const body =  JSON.stringify({
              "Siparis":  siparis,
              "Token":this.kullsrc.token,
            });

          var result = await this.http.post<any>(this.semUrl+"/Anket/OtobusSiparisSil", body, options).toPromise();

          var sonuc = JSON.parse(JSON.stringify(result))['Model'];
          return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
     }

     async RezervasyonListesi(baslangic:Date,bitis:Date,durum:number)
          {
                let url=this.semUrl+"/Anket/RezervasyonListesi?Token="+ this.kullsrc.token+"&Baslangic="+ moment(baslangic).format("yyyy-MM-DD")+"&Bitis="+moment(bitis).format("yyyy-MM-DD")+"&Durum="+durum;
                return await this.http.get<Result<AnketDetay[]>>(url).pipe( map((res:any)=> res));
     }

     async RespOtelGiris(anket:AnketDetay[],durum:number):Promise<ReturnValues>  {
            const headers = new HttpHeaders(
              {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Access-Control-Allow-Headers': 'Content-Type',
             }
            );

              let options = { headers: headers };

              const body =  JSON.stringify({
                "Data":  anket,
                "Durum":  durum,
                "Token":this.kullsrc.token,
              });

            var result = await this.http.post<any>(this.semUrl+"/Anket/RespOtelGiris", body, options).toPromise();

            var sonuc = JSON.parse(JSON.stringify(result))['Model'];
            return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
       }

   async RespFrontDesk(anket:AnketDetay[]):Promise<ReturnValues>  {
              const headers = new HttpHeaders(
                {
                  'Content-Type': 'application/json',
                  'Accept': 'application/json',
                  'Access-Control-Allow-Headers': 'Content-Type',
               }
              );

                let options = { headers: headers };

                const body =  JSON.stringify({
                  "Data":  anket,
                  "Durum":  0,
                  "Token":this.kullsrc.token,
                });

              var result = await this.http.post<any>(this.semUrl+"/Anket/RespFrontDesk", body, options).toPromise();

              var sonuc = JSON.parse(JSON.stringify(result))['Model'];
              return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
     }

  async OnKayitListesi(baslangic:Date,bitis:Date,ekip:number,durum:number)
  {
   let url=this.semUrl+"/Anket/OnKayitListesi?Token="+ this.kullsrc.token+"&Baslangic="+ moment(baslangic).format("yyyy-MM-DD")+"&Bitis="+ moment(bitis).format("yyyy-MM-DD")+"&EkipId="+ekip+"&Durum="+durum;
   return await this.http.get<Result<AnketDetay[]>>(url).pipe( map((res:any)=> res));
  }

 async OnKayit(anket:OnKayit,durum:number):Promise<ReturnValues>  {
        const headers = new HttpHeaders(
          {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Headers': 'Content-Type',
         }
        );

          let options = { headers: headers };

          const body =  JSON.stringify({
            "Data":  anket,
            "Durum":  durum,
            "Token":this.kullsrc.token,
          });

        var result = await this.http.post<any>(this.semUrl+"/Anket/OnKayit", body, options).toPromise();

        var sonuc = JSON.parse(JSON.stringify(result))['Model'];
        return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
  }

  async GetTeleAnketList(empid:number,baslangic:Date,bitis:Date,ekranid:number)
        {
              let url=this.semUrl+"/Anket/GetTeleAnketList?Token="+ this.kullsrc.token+"&EmpId="+empid+"&Baslangic="+ moment(baslangic).format("yyyy-MM-DD")+"&Bitis="+moment(bitis).format("yyyy-MM-DD")+"&EkranId="+ekranid;
              return await this.http.get<Result<AnketDetay[]>>(url).pipe( map((res:any)=> res));
  }
  async AnketCommentRevize(anket:AnketDetay,ekran:number):Promise<ReturnValues>  {
          const headers = new HttpHeaders(
            {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Access-Control-Allow-Headers': 'Content-Type',
           }
          );

            let options = { headers: headers };

            const body =  JSON.stringify({
              "Data":  anket,
              "Ekran":  ekran,
              "Token":this.kullsrc.token,
            });

          var result = await this.http.post<any>(this.semUrl+"/Anket/AnketCommentRevize", body, options).toPromise();

          var sonuc = JSON.parse(JSON.stringify(result))['Model'];
          return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
    }
    async GetReConfCevapsiz(empid:number)
          {
                let url=this.semUrl+"/Anket/GetReConfCevapsiz?Token="+ this.kullsrc.token+"&EmpId="+empid;
                return await this.http.get<Result<number>>(url).pipe( map((res:any)=> res));
    }


 async MolaSureEkle(data: MolaSure, tip: IslemTipi):Promise<ReturnValues>  {
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
       "Token":this.kullsrc.token,
       "Tip":tip,
     });


   var result = await this.http.post<any>(this.semUrl+"/Tanim/MolaSureEkle", body, options).toPromise();

   var sonuc = JSON.parse(JSON.stringify(result))['Model'];
   return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
   }


  async GetMolaSure(id: number,managerid:number,ekranid:number)
  {
    let url=this.semUrl+"/Tanim/GetMolaSureList?Docentry="+id+'&ManagerId='+ managerid+'&EkranId=' + ekranid+"&Token="+this.kullsrc.token;
    return await this.http.get<Result<MolaSure[]>>(url).pipe( map((res:any)=> res));
  }

  async AcikCagrilariKapat(empid:number):Promise<ReturnValues>  {
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
     }
    );

      let options = { headers: headers };

      const body =  JSON.stringify({
        "EmpId":  empid,
        "Token":this.kullsrc.token,
        "Tarih":new Date().toLocaleString(),
      });

    var result = await this.http.post<any>(this.semUrl+"/Anket/AcikCagrilariKapat", body, options).toPromise();

    var sonuc = JSON.parse(JSON.stringify(result))['Model'];
    return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
    }

    async GetMolaKalanSure(empid:number,ekran:number)
    {
        let url=this.semUrl+"/Anket/GetMolaKalanSure?EmpId="+empid+"&Ekran="+ ekran+"&Token="+ this.kullsrc.token;
        return await this.http.get<Result<number>>(url).pipe( map((res:any)=> res));
    }

    async GetMolaSayac(empid:number,ekran:number)
    {
        let url=this.semUrl+"/Anket/GetMolaSayac?EmpId="+empid+"&Ekran="+ ekran+"&Token="+ this.kullsrc.token;
        return await this.http.get<Result<number>>(url).pipe( map((res:any)=> res));
    }

    async OnSozlesmeListesi(baslangic:Date,bitis:Date,ekip:number,durum:number,code:number,aktif:number)
  {
   let url=this.semUrl+"/Anket/OnSozlesmeListesi?Token="+ this.kullsrc.token+"&Baslangic="+ moment(baslangic).format("yyyy-MM-DD")+"&Bitis="+ moment(bitis).format("yyyy-MM-DD")+"&EkipId="+ekip+"&Durum="+durum+"&Code="+code+"&Aktif="+aktif;
   return await this.http.get<Result<OnKayit[]>>(url).pipe( map((res:any)=> res));
  }

  async OnSozlesmeDaireSatisListesi(baslangic:Date,bitis:Date,ekip:number,durum:number,code:number,aktif:number)
  {
   let url=this.semUrl+"/Anket/OnSozlesmeDaireSatisListesi?Token="+ this.kullsrc.token+"&Baslangic="+ moment(baslangic).format("yyyy-MM-DD")+"&Bitis="+ moment(bitis).format("yyyy-MM-DD")+"&EkipId="+ekip+"&Durum="+durum+"&Code="+code+"&Aktif="+aktif;
   return await this.http.get<Result<OnKayit[]>>(url).pipe( map((res:any)=> res));
  }


  async OnSozlesme(anket:OnKayit,durum:number,SenetGuncelle:boolean,SenetList:SozlesmeSenetModel[]):Promise<ReturnValues>  {
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
     }
    );

      let options = { headers: headers };

      const body =  JSON.stringify({
        "Data":  anket,
        "Durum":  durum,
        "SenetGuncelle":  SenetGuncelle,
        "SenetList":  SenetList,
        "Token":this.kullsrc.token,
      });

    var result = await this.http.post<any>(this.semUrl+"/Anket/OnSozlesme", body, options).toPromise();

    var sonuc = JSON.parse(JSON.stringify(result))['Model'];
    return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}

async ZeyilBaslat(anket:OnKayit,durum:number):Promise<ReturnValues>  {
  const headers = new HttpHeaders(
    {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Headers': 'Content-Type',
   }
  );

    let options = { headers: headers };

    const body =  JSON.stringify({
      "Data":  anket,
      "Durum":  durum,
      "Token":this.kullsrc.token,
    });

  var result = await this.http.post<any>(this.semUrl+"/Anket/ZeyilBaslat", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}

async UyeEskiSozlesmeList(tckn:string,anketid:number)
  {
   let url=this.semUrl+"/Anket/UyeEskiSozlesmeList?Tckn="+tckn+"&Token="+ this.kullsrc.token+"&AnketId="+ anketid;
   return await this.http.get<Result<OnKayit[]>>(url).pipe( map((res:any)=> res));
  }

  async AgentEskiSozlesmeList(tckn:string,anketid:number)
  {
   let url=this.semUrl+"/Anket/AgentEskiSozlesmeList?Tckn="+tckn+"&Token="+ this.kullsrc.token+"&AnketId="+ anketid;
   return await this.http.get<Result<OnKayit[]>>(url).pipe( map((res:any)=> res));
  }

  async SonSozlemeNo(code:number,ekipid:number,sozltip:number)
  {
   let url=this.semUrl+"/Anket/SonSozlemeNo?Code="+code+"&EkipId="+ekipid+"&SozlTip="+sozltip+"&Token="+ this.kullsrc.token;
   return await this.http.get<Result<SozlesmeNoModel>>(url).pipe( map((res:any)=> res));
  }

  async EskiSozlesmeSonNo(anketid:number,ekipid:number)
  {
   let url=this.semUrl+"/Anket/EskiSozlesmeSonNo?Anket="+anketid+"&EkipId="+ekipid+"&Token="+ this.kullsrc.token;
   return await this.http.get<Result<SozlesmeNoModel>>(url).pipe( map((res:any)=> res));
  }

  async SozlOrtakEkle(post:SozlesmeOrtakModel,tip:IslemTipi):Promise<ReturnValues>  {
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

    var result = await this.http.post<any>(this.semUrl+"/Anket/SozlOrtakEkle", body, options).toPromise();

    var sonuc = JSON.parse(JSON.stringify(result))['Model'];
    return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
  }

  async GeSozlOrtakList(id:number)
  {
       let url=this.semUrl+"/Anket/GeSozlOrtakList?Docentry="+id+"&Token="+this.kullsrc.token;
          return await this.http.get<Result<SozlesmeOrtakModel>>(url).pipe( map((res:any)=> res));
  }

  async SozlSenetEkle(post:SozlesmeSenetModel[],sozlesme:OnKayit,tip:IslemTipi):Promise<ReturnValues>  {
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
      "Sozlesme": sozlesme,
      "Token":this.kullsrc.token,
      "Tip":tip,
    });

    var result = await this.http.post<any>(this.semUrl+"/Anket/SozlSenetEkle", body, options).toPromise();

    var sonuc = JSON.parse(JSON.stringify(result))['Model'];
    return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
  }

  async GeSozlSenetList(id:number,sozlesmeid:number)
  {
       let url=this.semUrl+"/Anket/GeSozlSenetList?Docentry="+id+"&SozlesmeId="+sozlesmeid+"&Token="+this.kullsrc.token;
          return await this.http.get<Result<SozlesmeSenetModel>>(url).pipe( map((res:any)=> res));
  }

  async SozlTaahhutEkle(post:SozlesmeTaahhutModel,sozlesme:OnKayit,tip:IslemTipi):Promise<ReturnValues>  {
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
      "Sozlesme": sozlesme,
      "Token":this.kullsrc.token,
      "Tip":tip,
    });

    var result = await this.http.post<any>(this.semUrl+"/Anket/SozlTaahhutEkle", body, options).toPromise();

    var sonuc = JSON.parse(JSON.stringify(result))['Model'];
    return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
  }

  async GeSozlTaahhutList(id:number)
  {
       let url=this.semUrl+"/Anket/GeSozlTaahhutList?Docentry="+id+"&Token="+this.kullsrc.token;
          return await this.http.get<Result<SozlesmeTaahhutModel>>(url).pipe( map((res:any)=> res));
  }

  async SozlOzelDurumEkle(post:SozlesmeOzelDurumModel,sozlesme:OnKayit,tip:IslemTipi):Promise<ReturnValues>  {
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
      "Sozlesme": sozlesme,
      "Token":this.kullsrc.token,
      "Tip":tip,
    });

    var result = await this.http.post<any>(this.semUrl+"/Anket/SozlOzelDurumEkle", body, options).toPromise();

    var sonuc = JSON.parse(JSON.stringify(result))['Model'];
    return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
  }

  async GeSozlOzelDurumList(id:number,baslangic:Date,bitis:Date)
  {
       let url=this.semUrl+"/Anket/GeSozlOzelDurumList?Docentry="+id+"&Baslangic="+ moment(baslangic).format("yyyy-MM-DD")+"&Bitis="+ moment(bitis).format("yyyy-MM-DD")+"&Token="+this.kullsrc.token;
          return await this.http.get<Result<SozlesmeOzelDurumModel>>(url).pipe( map((res:any)=> res));
  }

  async SozlOzelDurumTamamla(post:SozlesmeOzelDurumModel,sozlesme:OnKayit,tip:IslemTipi):Promise<ReturnValues>  {
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
      "Sozlesme": sozlesme,
      "Token":this.kullsrc.token,
      "Tip":tip,
    });

    var result = await this.http.post<any>(this.semUrl+"/Anket/SozlOzelDurumTamamla", body, options).toPromise();

    var sonuc = JSON.parse(JSON.stringify(result))['Model'];
    return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
  }

  async TaahhutFormYazdir(Data:SozlesmeTaahhutModel):Promise<ReturnValues>  {
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
     }
    );

      let options = { headers: headers };

      const body =  JSON.stringify({
        "Data":  Data,
        "Token":this.kullsrc.token,
      });

    var result = await this.http.post<any>(this.semUrl+"/Anket/TaahhutFormYazdir", body, options).toPromise();

    var sonuc = JSON.parse(JSON.stringify(result))['Model'];
    return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}

async OzelDurumFormYazdir(Data:SozlesmeOzelDurumModel):Promise<ReturnValues>  {
  const headers = new HttpHeaders(
    {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Headers': 'Content-Type',
   }
  );

    let options = { headers: headers };

    const body =  JSON.stringify({
      "Data":  Data,
      "Token":this.kullsrc.token,
    });

  var result = await this.http.post<any>(this.semUrl+"/Anket/OzelDurumFormYazdir", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}

async OnSozlesmeFormYazdir(Data:OnKayit,raporid:number):Promise<ReturnValues>  {
  const headers = new HttpHeaders(
    {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Headers': 'Content-Type',
   }
  );

    let options = { headers: headers };

    const body =  JSON.stringify({
      "Data":  Data,
      "RaporId":  raporid,
      "Token":this.kullsrc.token,
    });

  var result = await this.http.post<any>(this.semUrl+"/Anket/OnSozlesmeFormYazdir", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}
  
  async TapuListesi(filter:FiltreAramaModel[],code:number,durum:number,baslangic:Date,bitis:Date,tapudurum:number,tapuodemeonay:string):Promise<ReturnValuesList<OnKayit>>  {
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
     }
    );

      let options = { headers: headers };

      const body =  JSON.stringify({
        "Data":  filter,
        "Code":  code, 
        "Durum":  durum, 
        "TapuDurumTip":  tapudurum, 
        "TapuOdemeOnayTip":  tapuodemeonay, 
        "Baslangic":  baslangic,
        "Bitis":  bitis,
        "Token":this.kullsrc.token,
      });

    var result = await this.http.post<any>(this.semUrl+"/Anket/TapuListesi", body, options).toPromise();

    var sonuc = JSON.parse(JSON.stringify(result));

    return new ReturnValuesList( sonuc.Model["Id"], sonuc.Model["Success"], sonuc.Model["Message"] ?? "", sonuc.Model["Token"] ?? "",sonuc.Model["List"],sonuc.Model["JsonData"]);
  }

  async TapuUyeHavuzListesi(filter:FiltreAramaModel[],code:number,baslangic:Date,bitis:Date,durumid:number,basyuzde:number,bityuzde:number):Promise<ReturnValuesList<OnKayit>>  {
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
     }
    );

      let options = { headers: headers };

      const body =  JSON.stringify({
        "Data":  filter,
        "Code":  code,  
        "Baslangic":  baslangic,
        "Bitis":  bitis,
        "BasYuzde":  basyuzde,
        "BitYuzde":  bityuzde,
        "DurumId":  durumid,
        "Token":this.kullsrc.token,
      });

    var result = await this.http.post<any>(this.semUrl+"/Anket/TapuUyeHavuzListesi", body, options).toPromise();

    var sonuc = JSON.parse(JSON.stringify(result));

    return new ReturnValuesList( sonuc.Model["Id"], sonuc.Model["Success"], sonuc.Model["Message"] ?? "", sonuc.Model["Token"] ?? "",sonuc.Model["List"],sonuc.Model["JsonData"]);
  }

async OnSozlesmeOnay(anket:OnKayit[],durum:number):Promise<ReturnValues>  {
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
     }
    );

      let options = { headers: headers };

      const body =  JSON.stringify({
        "Data":  anket,
        "Durum":  durum,
        "Token":this.kullsrc.token,
      });

    var result = await this.http.post<any>(this.semUrl+"/Anket/OnSozlesmeOnay", body, options).toPromise();

    var sonuc = JSON.parse(JSON.stringify(result))['Model'];
    return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}

async OnSozlesmeSil(anket:OnKayit[],birim:number):Promise<ReturnValues>  {
  const headers = new HttpHeaders(
    {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Headers': 'Content-Type',
   }
  );

    let options = { headers: headers };

    const body =  JSON.stringify({
      "Data":  anket,
      "Durum":  birim,
      "Token":this.kullsrc.token,
    });

  var result = await this.http.post<any>(this.semUrl+"/Anket/OnSozlesmeSil", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}

async TapuKayit(anket:OnKayit,digersozlesme:OnKayit[],durum:number):Promise<ReturnValues>  {
  const headers = new HttpHeaders(
    {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Headers': 'Content-Type',
   }
  );

    let options = { headers: headers };

    const body =  JSON.stringify({
      "Data":  anket,
      "DigerSozlesme":  digersozlesme,
      "Durum":  durum,
      "Token":this.kullsrc.token,
    });

  var result = await this.http.post<any>(this.semUrl+"/Anket/TapuKayit", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}

async TapuOdemeOnay(data:OnKayit[],durum:number):Promise<ReturnValues>  {
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
      "Durum":  durum,
      "Token":this.kullsrc.token,
    });

  var result = await this.http.post<any>(this.semUrl+"/Anket/TapuOdemeOnay", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}

async TapuHakkiYok(data:OnKayit[],durum:number):Promise<ReturnValues>  {
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
      "Durum":  durum,
      "Token":this.kullsrc.token,
    });

  var result = await this.http.post<any>(this.semUrl+"/Anket/TapuHakkiYok", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}

async TapuTutarGuncelle(data:OnKayit):Promise<ReturnValues>  {
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
      "Token":this.kullsrc.token,
    });

  var result = await this.http.post<any>(this.semUrl+"/Anket/TapuTutarGuncelle", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}

async MusteriSicilKartList(filter:FiltreAramaModel[]):Promise<ReturnValuesList<OnKayit>>  {
  const headers = new HttpHeaders(
    {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Headers': 'Content-Type',
   }
  );

    let options = { headers: headers };

    const body =  JSON.stringify({
      "Data":  filter,
      "Token":this.kullsrc.token,
    });

  var result = await this.http.post<any>(this.semUrl+"/Anket/MusteriSicilKartList", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result));

  return new ReturnValuesList( sonuc.Model["Id"], sonuc.Model["Success"], sonuc.Model["Message"] ?? "", sonuc.Model["Token"] ?? "",sonuc.Model["List"]);
}

async MusteriSicilKartListV2(keyword:string,sirketid:number[]):Promise<ReturnValuesList<OnKayit>>  {
  const headers = new HttpHeaders(
    {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Headers': 'Content-Type',
   }
  );

    let options = { headers: headers };

    const body =  JSON.stringify({
      "Keyword":  keyword,
      "SirketId":sirketid,
      "Token":this.kullsrc.token,
    });

  var result = await this.http.post<any>(this.semUrl+"/Anket/MusteriSicilKartListV2", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result));

  return new ReturnValuesList( sonuc.Model["Id"], sonuc.Model["Success"], sonuc.Model["Message"] ?? "", sonuc.Model["Token"] ?? "",sonuc.Model["List"]);
}

async SenetTahsilatUyeList(filter:FiltreAramaModel[]):Promise<ReturnValuesList<OnKayit>>  {
  const headers = new HttpHeaders(
    {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Headers': 'Content-Type',
   }
  );

    let options = { headers: headers };

    const body =  JSON.stringify({
      "Data":  filter,
      "Token":this.kullsrc.token,
    });

  var result = await this.http.post<any>(this.semUrl+"/Anket/SenetTahsilatUyeList", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result));

  return new ReturnValuesList( sonuc.Model["Id"], sonuc.Model["Success"], sonuc.Model["Message"] ?? "", sonuc.Model["Token"] ?? "",sonuc.Model["List"]);
}

async MusteriSicilKartListFirst(code:number,sozlesmeno:string)
  {
   let url=this.semUrl+"/Anket/MusteriSicilKartListFirst?Code="+ code+"&SozlesmeNo="+ sozlesmeno+"&Token="+ this.kullsrc.token;
   return await this.http.get<Result<OnKayit[]>>(url).pipe( map((res:any)=> res));
  }

  async AgentSicilKartListFirst(code:number,sozlesmeno:string)
  {
   let url=this.semUrl+"/Anket/AgentSicilKartListFirst?Code="+ code+"&SozlesmeNo="+ sozlesmeno+"&Token="+ this.kullsrc.token;
   return await this.http.get<Result<OnKayit[]>>(url).pipe( map((res:any)=> res));
  }

  async MusteriSicilKartAramaList(keyword:string)
  {
   let url=this.semUrl+"/Anket/MusteriSicilKartAramaList?KeyWord="+ keyword+"&Token="+ this.kullsrc.token;
   return await this.http.get<Result<OnKayit[]>>(url).pipe( map((res:any)=> res));
  }

  async TopluSenetMusteriArama(keyword:string)
  {
   let url=this.semUrl+"/Anket/TopluSenetMusteriArama?KeyWord="+ keyword+"&Token="+ this.kullsrc.token;
   return await this.http.get<Result<OnKayit[]>>(url).pipe( map((res:any)=> res));
  }

  async TopluAidatMusteriArama(keyword:string)
  {
   let url=this.semUrl+"/Anket/TopluAidatMusteriArama?KeyWord="+ keyword+"&Token="+ this.kullsrc.token;
   return await this.http.get<Result<OnKayit[]>>(url).pipe( map((res:any)=> res));
  }

  async RciMusteriArama(keyword:string)
  {
   let url=this.semUrl+"/Anket/RciMusteriArama?KeyWord="+ keyword+"&Token="+ this.kullsrc.token;
   return await this.http.get<Result<OnKayit[]>>(url).pipe( map((res:any)=> res));
  }

async UyeAdresEkle(data:UyeAdresModel,tip:IslemTipi):Promise<ReturnValues>  {
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
      "Tip":  tip,
      "Token":this.kullsrc.token,
    });

  var result = await this.http.post<any>(this.semUrl+"/Anket/UyeAdresEkle", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}

async UyeAdresList(tckn:string,sozlesmeid:number)
  {
   let url=this.semUrl+"/Anket/UyeAdresList?Tckn="+ tckn+"&SozlesmeId="+ sozlesmeid+"&Token="+ this.kullsrc.token;
   return await this.http.get<Result<UyeAdresModel[]>>(url).pipe( map((res:any)=> res));
  }


  async UyeTelefonEkle(data:UyeTelefonModel,tip:IslemTipi):Promise<ReturnValues>  {
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
        "Tip":  tip,
        "Token":this.kullsrc.token,
      });

    var result = await this.http.post<any>(this.semUrl+"/Anket/UyeTelefonEkle", body, options).toPromise();

    var sonuc = JSON.parse(JSON.stringify(result))['Model'];
    return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
  }

  async UyeTelefonList(tckn:string,sozlesmeid:number)
    {
     let url=this.semUrl+"/Anket/UyeTelefonList?Tckn="+ tckn+"&SozlesmeId="+ sozlesmeid+"&Token="+ this.kullsrc.token;
     return await this.http.get<Result<UyeTelefonModel[]>>(url).pipe( map((res:any)=> res));
    }

    async UyeTelefonOzetList(tckn:string,sozlesmeid:number)
    {
     let url=this.semUrl+"/Anket/UyeTelefonOzetList?Tckn="+ tckn+"&SozlesmeId="+ sozlesmeid+"&Token="+ this.kullsrc.token;
     return await this.http.get<Result<UyeTelefonModel[]>>(url).pipe( map((res:any)=> res));
    }

    async SozlesmeSenetKargoGonder(data:SozlesmeSenetModel,list:SozlesmeSenetModel[]):Promise<ReturnValues>  {
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
          "Token":this.kullsrc.token,
        });

      var result = await this.http.post<any>(this.semUrl+"/Anket/SozlesmeSenetKargoGonder", body, options).toPromise();

      var sonuc = JSON.parse(JSON.stringify(result))['Model'];
      return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
    }

    async SozlesmeSenetKargoGonderIptal(list:SozlesmeSenetModel[]):Promise<ReturnValues>  {
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
        });

      var result = await this.http.post<any>(this.semUrl+"/Anket/SozlesmeSenetKargoGonderIptal", body, options).toPromise();

      var sonuc = JSON.parse(JSON.stringify(result))['Model'];
      return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
    }

    async UyeOzelNotEkle(data:UyeOzelNotModel,tip:IslemTipi,list:OnKayit[]=[]):Promise<ReturnValues>  {
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
          "Tip":  tip,
          "Token":this.kullsrc.token,
        });

      var result = await this.http.post<any>(this.semUrl+"/Anket/UyeOzelNotEkle", body, options).toPromise();

      var sonuc = JSON.parse(JSON.stringify(result))['Model'];
      return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
    }

    async UyeOzelNotList(sozlesmeid:number)
      {
       let url=this.semUrl+"/Anket/UyeOzelNotList?SozlesmeId="+ sozlesmeid+"&Token="+ this.kullsrc.token;
       return await this.http.get<Result<UyeOzelNotModel[]>>(url).pipe( map((res:any)=> res));
      }

      async UyeSertifikaEkle(data:UyeSertifikaModel,tip:IslemTipi):Promise<ReturnValues>  {
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
            "Tip":  tip,
            "Token":this.kullsrc.token,
          });

        var result = await this.http.post<any>(this.semUrl+"/Anket/UyeSertifikaEkle", body, options).toPromise();

        var sonuc = JSON.parse(JSON.stringify(result))['Model'];
        return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
      }

      async UyeSertifikaList(sozlesmeid:number)
        {
         let url=this.semUrl+"/Anket/UyeSertifikaList?SozlesmeId="+ sozlesmeid+"&Token="+ this.kullsrc.token;
         return await this.http.get<Result<UyeSertifikaModel>>(url).pipe( map((res:any)=> res));
        }

        async UyeRCIEkle(data:UyeRCIModel,tip:IslemTipi):Promise<ReturnValues>  {
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
              "Tip":  tip,
              "Token":this.kullsrc.token,
            });

          var result = await this.http.post<any>(this.semUrl+"/Anket/UyeRCIEkle", body, options).toPromise();

          var sonuc = JSON.parse(JSON.stringify(result))['Model'];
          return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
        }

        async UyeRCIList(sozlesmeid:number,tckn:string)
          {
           let url=this.semUrl+"/Anket/UyeRCIList?SozlesmeId="+ sozlesmeid+"&Token="+ this.kullsrc.token+"&Tckn="+ tckn;
           return await this.http.get<Result<UyeRCIModel[]>>(url).pipe( map((res:any)=> res));
          }

          async UyeRCIDetayEkle(data:UyeRCIDetayModel,tip:IslemTipi):Promise<ReturnValues>  {
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
                "Tip":  tip,
                "Token":this.kullsrc.token,
              });

            var result = await this.http.post<any>(this.semUrl+"/Anket/UyeRCIDetayEkle", body, options).toPromise();

            var sonuc = JSON.parse(JSON.stringify(result))['Model'];
            return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
          }

          async UyeRCIDetayList(rciid:number)
            {
             let url=this.semUrl+"/Anket/UyeRCIDetayList?RciId="+ rciid+"&Token="+ this.kullsrc.token;
             return await this.http.get<Result<UyeRCIDetayModel[]>>(url).pipe( map((res:any)=> res));
            }

  async GeUyeTaahhutOzelDurumList(id:number)
    {
      let url=this.semUrl+"/Anket/GeUyeTaahhutOzelDurumList?Docentry="+id+"&Token="+this.kullsrc.token;
      return await this.http.get<Result<SozlesmeTaahhutModel>>(url).pipe( map((res:any)=> res));
    }

    async UyeSozlesmeDurumEkle(data:UyeSozlesmeDurumModel,tip:IslemTipi):Promise<ReturnValues>  {
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
          "Tip":  tip,
          "Token":this.kullsrc.token,
        });

      var result = await this.http.post<any>(this.semUrl+"/Anket/UyeSozlesmeDurumEkle", body, options).toPromise();

      var sonuc = JSON.parse(JSON.stringify(result))['Model'];
      return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
    }

    async UyeSozlesmeTopluDurumEkle(list:OnKayit[],data:UyeSozlesmeDurumModel,tip:IslemTipi):Promise<ReturnValues>  {
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
          "Data":  data,
          "Tip":  tip,
          "Token":this.kullsrc.token,
        });

      var result = await this.http.post<any>(this.semUrl+"/Anket/UyeSozlesmeTopluDurumEkle", body, options).toPromise();

      var sonuc = JSON.parse(JSON.stringify(result))['Model'];
      return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
    }

    async UyeSozlesmeDurumList(id:number,sozlesmeid:number)
      {
       let url=this.semUrl+"/Anket/UyeSozlesmeDurumList?Code="+id+"&SozlesmeId="+ sozlesmeid+"&Token="+ this.kullsrc.token;
       return await this.http.get<Result<UyeSozlesmeDurumModel[]>>(url).pipe( map((res:any)=> res));
      }

      async SozlesmeSenetTahsilat(data:OnKayit,hesap:HesapModel,tahsilat:TahsilatModel,senetlist:SozlesmeSenetModel[]=[],tip:IslemTipi):Promise<ReturnValues>  {
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
            "Hesap":  hesap,
            "Tahsilat":  tahsilat,
            "List":  senetlist,
            "Tip":  tip,
            "Token":this.kullsrc.token,
          });

        var result = await this.http.post<any>(this.semUrl+"/Anket/SozlesmeSenetTahsilat", body, options).toPromise();

        var sonuc = JSON.parse(JSON.stringify(result))['Model'];
        return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
      }

      async SozlesmeAidatTahsilat(data:OnKayit,hesap:HesapModel,tahsilat:TahsilatModel,aidatlist:UyeAidatTahsilatModel[]=[],tip:IslemTipi):Promise<ReturnValues>  {
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
            "Hesap":  hesap,
            "Tahsilat":  tahsilat,
            "AidatList":  aidatlist,
            "Tip":  tip,
            "Token":this.kullsrc.token,
          });

        var result = await this.http.post<any>(this.semUrl+"/Anket/SozlesmeAidatTahsilat", body, options).toPromise();

        var sonuc = JSON.parse(JSON.stringify(result))['Model'];
        return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
      }

      async RezervasyonYemekTahsilat(data:OnKayit,hesap:HesapModel,tahsilat:TahsilatModel,rezervasyon:UyeRezervasyonModel,tip:IslemTipi):Promise<ReturnValues>  {
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
            "Hesap":  hesap,
            "Tahsilat":  tahsilat,
            "Rezervasyon":  rezervasyon ,
            "Tip":  tip,
            "Token":this.kullsrc.token,
          });

        var result = await this.http.post<any>(this.semUrl+"/Anket/RezervasyonYemekTahsilat", body, options).toPromise();

        var sonuc = JSON.parse(JSON.stringify(result))['Model'];
        return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
      }

      async GetSenetFinansOdemeDetay(code:number,semkey:string,donem:number,sozlesmeid:Number)
       {
        let url=this.semUrl+"/Anket/GetSenetFinansOdemeDetay?Code="+ code+"&semkey="+ semkey+"&Token="+ this.kullsrc.token+"&DonemId="+ donem+"&SozlesmeId="+ sozlesmeid;
        return await this.http.get<Result<FinansHareketModel[]>>(url).pipe( map((res:any)=> res));
       }

       async GetAidatTahakkukOdemeDetay(code:number,semkey:string,donem:number)
       {
        let url=this.semUrl+"/Anket/GetAidatTahakkukOdemeDetay?Code="+ code+"&semkey="+ semkey+"&Token="+ this.kullsrc.token+"&DonemId="+ donem;
        return await this.http.get<Result<FinansHareketModel[]>>(url).pipe( map((res:any)=> res));
       }

       async SozlesmeCashTalep(data:OnKayit,cash:CashModel,senetlist:CashDetayModel[]=[],tip:IslemTipi,EkOnay:boolean,birim:number):Promise<ReturnValues>  {
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
            "Cash":  cash,
            "List":  senetlist,
            "EkOnay":  EkOnay,
            "Tip":  tip,
            "SorumluBirim":  birim,
            "Token":this.kullsrc.token,
          });

        var result = await this.http.post<any>(this.semUrl+"/Anket/SozlesmeCashTalep", body, options).toPromise();

        var sonuc = JSON.parse(JSON.stringify(result))['Model'];
        return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
      }

       async SozlesmeCash(onay:boolean,cashlist:CashModel[]=[],onayaciklama:string):Promise<ReturnValues>  {
        const headers = new HttpHeaders(
          {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Headers': 'Content-Type',
         }
        );

          let options = { headers: headers };

          const body =  JSON.stringify({
            "Cash":  cashlist,
            "OnayDurum":  onay,
            "Aciklama":onayaciklama,
            "Token":this.kullsrc.token,
          });

        var result = await this.http.post<any>(this.semUrl+"/Anket/SozlesmeCash", body, options).toPromise();

        var sonuc = JSON.parse(JSON.stringify(result))['Model'];
        return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
      }

      async SozlesmeCashIptal(onay:boolean,cashlist:CashModel[]=[],onayaciklama:string):Promise<ReturnValues>  {
        const headers = new HttpHeaders(
          {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Headers': 'Content-Type',
         }
        );

          let options = { headers: headers };

          const body =  JSON.stringify({
            "Cash":  cashlist,
            "OnayDurum":  onay,
            "Aciklama":onayaciklama,
            "Token":this.kullsrc.token,
          });

        var result = await this.http.post<any>(this.semUrl+"/Anket/SozlesmeCashIptal", body, options).toPromise();

        var sonuc = JSON.parse(JSON.stringify(result))['Model'];
        return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
      }

      async SozlesmeKickIptal(onay:boolean,cashlist:KickModel[]=[],onayaciklama:string):Promise<ReturnValues>  {
        const headers = new HttpHeaders(
          {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Headers': 'Content-Type',
         }
        );

          let options = { headers: headers };

          const body =  JSON.stringify({
            "Kick":  cashlist,
            "OnayDurum":  onay,
            "Aciklama":onayaciklama,
            "Token":this.kullsrc.token,
          });

        var result = await this.http.post<any>(this.semUrl+"/Anket/SozlesmeKickIptal", body, options).toPromise();

        var sonuc = JSON.parse(JSON.stringify(result))['Model'];
        return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
      }

      async TopluSenetAktarimGuncelle(data:TopluSenetEslestirmeModel | undefined,sozlesme:OnKayit| undefined,list:TopluSenetEslestirmeModel[]=[],tip:IslemTipi):Promise<ReturnValues>  {
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
            "Sozlesme":  sozlesme,
            "List":  list,
            "Tip":  tip, 
            "Token":this.kullsrc.token,
          });

        var result = await this.http.post<any>(this.semUrl+"/Anket/TopluSenetAktarimGuncelle", body, options).toPromise();

        var sonuc = JSON.parse(JSON.stringify(result))['Model'];
        return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
      }

      async TopluSenetEslestirmeSifirla(data:TopluSenetEslestirmeModel | undefined,sozlesme:OnKayit| undefined,list:TopluSenetEslestirmeModel[]=[],tip:IslemTipi):Promise<ReturnValues>  {
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
            "Sozlesme":  sozlesme,
            "List":  list,
            "Tip":  tip, 
            "Token":this.kullsrc.token,
          });

        var result = await this.http.post<any>(this.semUrl+"/Anket/TopluSenetEslestirmeSifirla", body, options).toPromise();

        var sonuc = JSON.parse(JSON.stringify(result))['Model'];
        return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
      }

      async TopluAidatGuncelle(data:TopluSenetEslestirmeModel | undefined,sozlesme:OnKayit| undefined,list:TopluSenetEslestirmeModel[]=[],tip:IslemTipi):Promise<ReturnValues>  {
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
            "Sozlesme":  sozlesme,
            "List":  list,
            "Tip":  tip, 
            "Token":this.kullsrc.token,
          });

        var result = await this.http.post<any>(this.semUrl+"/Anket/TopluAidatGuncelle", body, options).toPromise();

        var sonuc = JSON.parse(JSON.stringify(result))['Model'];
        return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
      }

      async TahsilatBilinmeyenGuncelle(data:TopluSenetEslestirmeModel | undefined,sozlesme:OnKayit| undefined,list:TopluSenetEslestirmeModel[]=[],tip:IslemTipi):Promise<ReturnValues>  {
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
            "Sozlesme":  sozlesme,
            "List":  list,
            "Tip":  tip,
            "Token":this.kullsrc.token,
          });

        var result = await this.http.post<any>(this.semUrl+"/Anket/TahsilatBilinmeyenGuncelle", body, options).toPromise();

        var sonuc = JSON.parse(JSON.stringify(result))['Model'];
        return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
      }

      async TopluSozlesmeSenetTahsilat(hesap:HesapModel,tahsilat:TahsilatModel,list:TopluSenetEslestirmeModel[]=[],tip:IslemTipi):Promise<ReturnValues>  {
        const headers = new HttpHeaders(
          {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Headers': 'Content-Type',
         }
        );

          let options = { headers: headers };

          const body =  JSON.stringify({
            "Tahsilat":  tahsilat,
            "Hesap":  hesap,
            "List":  list,
            "Tip":  tip,
            "Token":this.kullsrc.token,
          });

        var result = await this.http.post<any>(this.semUrl+"/Anket/TopluSozlesmeSenetTahsilat", body, options).toPromise();

        var sonuc = JSON.parse(JSON.stringify(result))['Model'];
        return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
      }

      async TopluAidatTahsilat(hesap:HesapModel,tahsilat:TahsilatModel,list:TopluSenetEslestirmeModel[]=[],tip:IslemTipi):Promise<ReturnValues>  {
        const headers = new HttpHeaders(
          {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Headers': 'Content-Type',
         }
        );

          let options = { headers: headers };

          const body =  JSON.stringify({
            "Tahsilat":  tahsilat,
            "Hesap":  hesap,
            "List":  list,
            "Tip":  tip,
            "Token":this.kullsrc.token,
          });

        var result = await this.http.post<any>(this.semUrl+"/Anket/TopluAidatTahsilat", body, options).toPromise();

        var sonuc = JSON.parse(JSON.stringify(result))['Model'];
        return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
      }

       async TopluSozlesmeSenetTahsilatDirekt(hesap:HesapModel | undefined,tahsilat:TahsilatModel | undefined,list:TopluSenetEslestirmeModel[]=[],direk:boolean):Promise<ReturnValues>  {
        const headers = new HttpHeaders(
          {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Headers': 'Content-Type',
         }
        );

          let options = { headers: headers };

          const body =  JSON.stringify({
            "Tahsilat":  tahsilat,
            "Hesap":  hesap,
            "List":  list,
            "Direkt":  direk,
            "Token":this.kullsrc.token,
          });

        var result = await this.http.post<any>(this.semUrl+"/Anket/TopluSozlesmeSenetTahsilatDirekt", body, options).toPromise();

        var sonuc = JSON.parse(JSON.stringify(result))['Model'];
        return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
      }

      async TopluAidatTahsilatDirekt(hesap:HesapModel | undefined,tahsilat:TahsilatModel | undefined,list:TopluSenetEslestirmeModel[]=[],direk:boolean):Promise<ReturnValues>  {
        const headers = new HttpHeaders(
          {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Headers': 'Content-Type',
         }
        );

          let options = { headers: headers };

          const body =  JSON.stringify({
            "Tahsilat":  tahsilat,
            "Hesap":  hesap,
            "List":  list,
            "Direkt":  direk,
            "Token":this.kullsrc.token,
          });

        var result = await this.http.post<any>(this.semUrl+"/Anket/TopluAidatTahsilatDirekt", body, options).toPromise();

        var sonuc = JSON.parse(JSON.stringify(result))['Model'];
        return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
      }

      async TopluSozlesmeSenetTahsilatBilinmeyen(hesap:HesapModel,tahsilat:TahsilatModel,list:TopluSenetEslestirmeModel[]=[],Direkt:boolean,BilinmeyenIade:boolean,BilinmeyenDisi:boolean):Promise<ReturnValues>  {
        const headers = new HttpHeaders(
          {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Headers': 'Content-Type',
         }
        );

          let options = { headers: headers };

          const body =  JSON.stringify({
            "Tahsilat":  tahsilat,
            "Hesap":  hesap,
            "List":  list,
            "Direkt":  Direkt,
            "BilinmeyenIade":  BilinmeyenIade,
            "BilinmeyenDisi":  BilinmeyenDisi,
            "Token":this.kullsrc.token,
          });

        var result = await this.http.post<any>(this.semUrl+"/Anket/TopluSozlesmeSenetTahsilatBilinmeyen", body, options).toPromise();

        var sonuc = JSON.parse(JSON.stringify(result))['Model'];
        return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
      }

      async TopluAidatTahsilatBilinmeyen(hesap:HesapModel,tahsilat:TahsilatModel,list:TopluSenetEslestirmeModel[]=[],Direkt:boolean,BilinmeyenIade:boolean,BilinmeyenDisi:boolean):Promise<ReturnValues>  {
        const headers = new HttpHeaders(
          {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Headers': 'Content-Type',
         }
        );

          let options = { headers: headers };

          const body =  JSON.stringify({
            "Tahsilat":  tahsilat,
            "Hesap":  hesap,
            "List":  list,
            "Direkt":  Direkt,
            "BilinmeyenIade":  BilinmeyenIade,
            "BilinmeyenDisi":  BilinmeyenDisi,
            "Token":this.kullsrc.token,
          });

        var result = await this.http.post<any>(this.semUrl+"/Anket/TopluAidatTahsilatBilinmeyen", body, options).toPromise();

        var sonuc = JSON.parse(JSON.stringify(result))['Model'];
        return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
      }

      async UyeTahsilatSurecList(filter:FiltreAramaModel[],code:number,durum:number,baslangic:Date,bitis:Date,sorumlubirim:number,kickdurum:number,agentid:number,keyword:string,sirketid:number[],agenttip:number):Promise<ReturnValuesList<OnKayit>>  {
        const headers = new HttpHeaders(
          {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Headers': 'Content-Type',
         }
        );

          let options = { headers: headers };

          const body =  JSON.stringify({
            "Data":  filter,
            "Code":  code,
            "SorumluBirim":  sorumlubirim,
            "Durum":  durum,
            "AgentTip":  agenttip,
            "KickDurum":  kickdurum,
            "Baslangic":  baslangic,
            "Bitis":  bitis,
            "FilterAgentId":  agentid,
            "Token":this.kullsrc.token,
            "Keyword":keyword,
            "SirketId":sirketid,
          });

        var result = await this.http.post<any>(this.semUrl+"/Anket/UyeTahsilatSurecList", body, options).toPromise();

        var sonuc = JSON.parse(JSON.stringify(result));

        return new ReturnValuesList( sonuc.Model["Id"], sonuc.Model["Success"], sonuc.Model["Message"] ?? "", sonuc.Model["Token"] ?? "",sonuc.Model["List"]);
      }

      async UyeCrmSurecList(filter:FiltreAramaModel[],code:number,durum:number,baslangic:Date,bitis:Date,sorumlubirim:number,kickdurum:number,agentid:number,keyword:string,sirketid:number[],agenttip:number):Promise<ReturnValuesList<OnKayit>>  {
        const headers = new HttpHeaders(
          {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Headers': 'Content-Type',
         }
        );

          let options = { headers: headers };

          const body =  JSON.stringify({
            "Data":  filter,
            "Code":  code,
            "SorumluBirim":  sorumlubirim,
            "Durum":  durum,
            "AgentTip":  agenttip,
            "KickDurum":  kickdurum,
            "Baslangic":  baslangic,
            "Bitis":  bitis,
            "FilterAgentId":  agentid,
            "Token":this.kullsrc.token,
            "Keyword":keyword,
            "SirketId":sirketid,
          });

        var result = await this.http.post<any>(this.semUrl+"/Anket/UyeCrmSurecList", body, options).toPromise();

        var sonuc = JSON.parse(JSON.stringify(result));

        return new ReturnValuesList( sonuc.Model["Id"], sonuc.Model["Success"], sonuc.Model["Message"] ?? "", sonuc.Model["Token"] ?? "",sonuc.Model["List"]);
      }

      async CrmUyeList(filter:FiltreAramaModel[],code:number,durum:number,baslangic:Date,bitis:Date,sorumlubirim:number,kickdurum:number,agentid:number,keyword:string,sirketid:number[],agenttip:number):Promise<ReturnValuesList<OnKayit>>  {
        const headers = new HttpHeaders(
          {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Headers': 'Content-Type',
         }
        );

          let options = { headers: headers };

          const body =  JSON.stringify({
            "Data":  filter,
            "Code":  code,
            "SorumluBirim":  sorumlubirim,
            "Durum":  durum,
            "AgentTip":  agenttip,
            "KickDurum":  kickdurum,
            "Baslangic":  baslangic,
            "Bitis":  bitis,
            "FilterAgentId":  agentid,
            "Token":this.kullsrc.token,
            "Keyword":keyword,
            "SirketId":sirketid,
          });

        var result = await this.http.post<any>(this.semUrl+"/Anket/CrmUyeList", body, options).toPromise();

        var sonuc = JSON.parse(JSON.stringify(result));

        return new ReturnValuesList( sonuc.Model["Id"], sonuc.Model["Success"], sonuc.Model["Message"] ?? "", sonuc.Model["Token"] ?? "",sonuc.Model["List"]);
      }

      async UyeBuDepartmanDisi()
      {
       let url=this.semUrl+"/Anket/UyeBuDepartmanDisi?Token="+ this.kullsrc.token;
       return await this.http.get<Result<OnKayit[]>>(url).pipe( map((res:any)=> res));
      }

      async UyeBuDepartmanDisiGuncelle(list:OnKayit[]=[]):Promise<ReturnValues>  {
        const headers = new HttpHeaders(
          {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Headers': 'Content-Type',
         }
        );

          let options = { headers: headers };

          const body =  JSON.stringify({
            "Data":  list,
            "Token":this.kullsrc.token,
          });

        var result = await this.http.post<any>(this.semUrl+"/Anket/UyeBuDepartmanDisiGuncelle", body, options).toPromise();

        var sonuc = JSON.parse(JSON.stringify(result))['Model'];
        return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
      }

      async UyeAtama(atanan:KullaniciModel,list:OnKayit[]=[],birim:number,aidat:number,gerial:number):Promise<ReturnValues>  {
        const headers = new HttpHeaders(
          {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Headers': 'Content-Type',
         }
        );

          let options = { headers: headers };

          const body =  JSON.stringify({
            "Atanan":  atanan,
            "List":  list,
            "SorumluBirim":  birim,
            "Aidat":  aidat,
            "Token":this.kullsrc.token,
            "GeriAl":gerial,
          });

        var result = await this.http.post<any>(this.semUrl+"/Anket/UyeAtama", body, options).toPromise();

        var sonuc = JSON.parse(JSON.stringify(result))['Model'];
        return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
      }


      async UyeTahsilatAgentList(filter:FiltreAramaModel[],sorumluid:number,durumid:number,SorumluBirim:number,AramaDurum:string):Promise<ReturnValuesList<OnKayit>>  {
        const headers = new HttpHeaders(
          {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Headers': 'Content-Type',
         }
        );

          let options = { headers: headers };

          const body =  JSON.stringify({
            "Data":  filter,
            "SorumluId":  sorumluid,
            "SorumluBirim":  SorumluBirim,
            "DurumId":  durumid,
            "AramaDurum":  AramaDurum,
            "Token":this.kullsrc.token,
          });

        var result = await this.http.post<any>(this.semUrl+"/Anket/UyeTahsilatAgentList", body, options).toPromise();

        var sonuc = JSON.parse(JSON.stringify(result));

        return new ReturnValuesList( sonuc.Model["Id"], sonuc.Model["Success"], sonuc.Model["Message"] ?? "", sonuc.Model["Token"] ?? "",sonuc.Model["List"]);
      }

      async CrmAgentList(filter:FiltreAramaModel[],sorumluid:number,durumid:number,SorumluBirim:number,AramaDurum:string):Promise<ReturnValuesList<OnKayit>>  {
        const headers = new HttpHeaders(
          {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Headers': 'Content-Type',
         }
        );

          let options = { headers: headers };

          const body =  JSON.stringify({
            "Data":  filter,
            "SorumluId":  sorumluid,
            "SorumluBirim":  SorumluBirim,
            "DurumId":  durumid,
            "AramaDurum":  AramaDurum,
            "Token":this.kullsrc.token,
          });

        var result = await this.http.post<any>(this.semUrl+"/Anket/CrmAgentList", body, options).toPromise();

        var sonuc = JSON.parse(JSON.stringify(result));

        return new ReturnValuesList( sonuc.Model["Id"], sonuc.Model["Success"], sonuc.Model["Message"] ?? "", sonuc.Model["Token"] ?? "",sonuc.Model["List"]);
      }

      async CrmAidatAgentList(filter:FiltreAramaModel[],sorumluid:number,durumid:number,SorumluBirim:number,AramaDurum:string):Promise<ReturnValuesList<OnKayit>>  {
        const headers = new HttpHeaders(
          {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Headers': 'Content-Type',
         }
        );

          let options = { headers: headers };

          const body =  JSON.stringify({
            "Data":  filter,
            "SorumluId":  sorumluid,
            "SorumluBirim":  SorumluBirim,
            "DurumId":  durumid,
            "AramaDurum":  AramaDurum,
            "Token":this.kullsrc.token,
          });

        var result = await this.http.post<any>(this.semUrl+"/Anket/CrmAidatAgentList", body, options).toPromise();

        var sonuc = JSON.parse(JSON.stringify(result));

        return new ReturnValuesList( sonuc.Model["Id"], sonuc.Model["Success"], sonuc.Model["Message"] ?? "", sonuc.Model["Token"] ?? "",sonuc.Model["List"]);
      }

      async TahsilatUyeArama(data:OnKayit,birim:number,aramadurum:string,ekran:number,AramaNotGuid:string):Promise<ReturnValues>  {
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
            "SorumluBirim":  birim, 
            "AramaNotGuid":  AramaNotGuid,
            "AramaDurum":  aramadurum,
            "Token": this.kullsrc.token,
            "EkranId": ekran
          }); 

        var result = await this.http.post<any>(this.semUrl+"/Anket/TahsilatUyeArama", body, options).toPromise();

        var sonuc = JSON.parse(JSON.stringify(result))['Model'];
        return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
      }

      async SozlOdemeEkle(odeme:SozlesmeOdemeModel[],sozlesme:OnKayit,tip:IslemTipi):Promise<ReturnValues>  {
        const headers = new HttpHeaders(
          {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Headers': 'Content-Type',
         }
        );

        let options = { headers: headers };

        const body =  JSON.stringify({
          "Data":  sozlesme,
          "List": odeme,
          "Token":this.kullsrc.token,
          "Tip":tip,
        });

        var result = await this.http.post<any>(this.semUrl+"/Anket/SozlOdemeEkle", body, options).toPromise();

        var sonuc = JSON.parse(JSON.stringify(result))['Model'];
        return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
      }

      async GeSozOdemeList(id:number,ekran:number)
      {
           let url=this.semUrl+"/Anket/GeSozOdemeList?SozlesmeId="+id+"&Ekran="+ekran+"&Token="+this.kullsrc.token;
              return await this.http.get<Result<SozlesmeOdemeModel>>(url).pipe( map((res:any)=> res));
      }

      async GetSozlesmeCashTalepList(code:number,sozlesmeid:number,durum:string)
      {
           let url=this.semUrl+"/Anket/GetSozlesmeCashTalepList?Code="+code+"&SozlesmeId="+sozlesmeid+"&Durum="+durum+"&Token="+this.kullsrc.token;
              return await this.http.get<Result<CashModel>>(url).pipe( map((res:any)=> res));
      }

      async GetSozlesmeCashTalepDetayList(code:number)
      {
           let url=this.semUrl+"/Anket/GetSozlesmeCashTalepDetayList?Code="+code+"&Token="+this.kullsrc.token;
              return await this.http.get<Result<CashDetayModel>>(url).pipe( map((res:any)=> res));
      }

      async SozlesmeCashTalepIptal(talepid:number,aciklama:string):Promise<ReturnValues>  {
        const headers = new HttpHeaders(
          {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Headers': 'Content-Type',
         }
        );

        let options = { headers: headers };

        const body =  JSON.stringify({
          "CashTalepId":  talepid,
          "Aciklama": aciklama,
          "Token":this.kullsrc.token
        });

        var result = await this.http.post<any>(this.semUrl+"/Anket/SozlesmeCashTalepIptal", body, options).toPromise();

        var sonuc = JSON.parse(JSON.stringify(result))['Model'];
        return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
      }

      async SozlesmeKickTalep(data:OnKayit,kick:KickModel,odemelist:KickDetayModel[]=[],tip:IslemTipi):Promise<ReturnValues>  {
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
            "Kick":  kick,
            "List":  odemelist,
            "Tip":  tip,
            "Token":this.kullsrc.token,
          });

        var result = await this.http.post<any>(this.semUrl+"/Anket/SozlesmeKickTalep", body, options).toPromise();

        var sonuc = JSON.parse(JSON.stringify(result))['Model'];
        return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
      }

      async GetSozlesmeKickTalepList(code:number,sozlesmeid:number,durum:string,onaykontrol:number)
      {
           let url=this.semUrl+"/Anket/GetSozlesmeKickTalepList?Code="+code+"&SozlesmeId="+sozlesmeid+"&Durum="+durum+"&Token="+this.kullsrc.token+"&OnayKontrol="+onaykontrol;
              return await this.http.get<Result<KickModel>>(url).pipe( map((res:any)=> res));
      }

      async GetSozlesmeKickTalepDetayList(code:number)
      {
           let url=this.semUrl+"/Anket/GetSozlesmeKickTalepDetayList?Code="+code+"&Token="+this.kullsrc.token;
              return await this.http.get<Result<KickDetayModel>>(url).pipe( map((res:any)=> res));
      }

  async GetUyeSozlesmeler(tckn:string,telefon:string)
  {
   let url=this.semUrl+"/Anket/GetUyeSozlesmeler?Tckn="+ tckn+"&Telefon="+ telefon +"&Token="+ this.kullsrc.token;
   return await this.http.get<Result<OnKayit[]>>(url).pipe( map((res:any)=> res));
  }

  async SozlesmeKickTalepIptal(kickid:number,aciklama:string):Promise<ReturnValues>  {
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
     }
    );

    let options = { headers: headers };

    const body =  JSON.stringify({
      "KickId":  kickid,
      "Aciklama": aciklama,
      "Token":this.kullsrc.token
    });

    var result = await this.http.post<any>(this.semUrl+"/Anket/SozlesmeKickTalepIptal", body, options).toPromise();

    var sonuc = JSON.parse(JSON.stringify(result))['Model'];
    return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
  }

  async UyeSicilKartGuncelle(data:OnKayit):Promise<ReturnValues>  {
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
        "Token":this.kullsrc.token,
      });

    var result = await this.http.post<any>(this.semUrl+"/Anket/UyeSicilKartGuncelle", body, options).toPromise();

    var sonuc = JSON.parse(JSON.stringify(result))['Model'];
    return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
  }

  async SozlesmeKick(onay:boolean,kicklist:KickModel[]=[],onayaciklama:string):Promise<ReturnValues>  {
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
     }
    );

      let options = { headers: headers };

      const body =  JSON.stringify({
        "Kick":  kicklist,
        "OnayDurum":  onay,
        "Aciklama":onayaciklama,
        "Token":this.kullsrc.token,
      });

    var result = await this.http.post<any>(this.semUrl+"/Anket/SozlesmeKick", body, options).toPromise();

    var sonuc = JSON.parse(JSON.stringify(result))['Model'];
    return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
  }

  async GetFinansIadeTalepList(code:number,durum:number,baslangic:Date,bitis:Date) 
  {
       let url=this.semUrl+"/Anket/GetFinansIadeTalepList?Code="+code+"&Durum="+durum+"&Baslangic="+moment(baslangic).format("yyyy-MM-DD")+"&Bitis="+moment(bitis).format("yyyy-MM-DD")+"&Token="+ this.kullsrc.token;
        return await this.http.get<Result<FinansIadeModel[]>>(url).pipe( map((res:any)=> res));
  }

  async IadeTalepOdeme(data:FinansIadeModel,aciklama:string):Promise<ReturnValues>  {
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
     }
    );

      let options = { headers: headers };

      const body =  JSON.stringify({
        "Odeme":  data,
        "Aciklama":  aciklama,
        "Token":this.kullsrc.token,
      });

    var result = await this.http.post<any>(this.semUrl+"/Anket/IadeTalepOdeme", body, options).toPromise();

    var sonuc = JSON.parse(JSON.stringify(result))['Model'];
    return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
  }

  async SozlesmeDegisimTalepEkle(data:SozlesmeDtModel,tip:IslemTipi):Promise<ReturnValues>  {
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
        "Tip":  tip,
        "Token":this.kullsrc.token,
      });

    var result = await this.http.post<any>(this.semUrl+"/Anket/SozlesmeDegisimTalepEkle", body, options).toPromise();

    var sonuc = JSON.parse(JSON.stringify(result))['Model'];
    return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
  }

  async GetSozlesmeDegisimTalep(code:number,sozlesmeid:number,durumid:number)
    {
     let url=this.semUrl+"/Anket/GetSozlesmeDegisimTalep?Docentry="+ code+"&SozlesmeId="+ sozlesmeid+"&DurumId="+ durumid+"&Token="+ this.kullsrc.token;
     return await this.http.get<Result<SozlesmeDtModel[]>>(url).pipe( map((res:any)=> res));
    }

    async GetSozlesmeDTMesajList(talepid:number)
    {
     let url=this.semUrl+"/Anket/GetSozlesmeDTMesajList?TalepId="+ talepid+"&Token="+ this.kullsrc.token;
     return await this.http.get<Result<SozlesmeDtMesajModel[]>>(url).pipe( map((res:any)=> res));
    }

    async GetSozlesmeDegisimSay()
    {
     let url=this.semUrl+"/Anket/GetSozlesmeDegisimSay?Token="+ this.kullsrc.token;
     return await this.http.get<Result<number>>(url).pipe( map((res:any)=> res));
    }
 
    async SozlesmeDegisimTalepKullaniciEkle(data:SozlesmeDtKullaniciModel,tip:IslemTipi):Promise<ReturnValues>  {
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
          "Tip":  tip,
          "Token":this.kullsrc.token,
        });
  
      var result = await this.http.post<any>(this.semUrl+"/Anket/SozlesmeDegisimTalepKullaniciEkle", body, options).toPromise();
  
      var sonuc = JSON.parse(JSON.stringify(result))['Model'];
      return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
    }
  
    async GetSozlesmeDegisimTalepKullanici(Docentry:number,TalepId:number)
      {
       let url=this.semUrl+"/Anket/GetSozlesmeDegisimTalepKullanici?Docentry="+ Docentry+"&TalepId="+ TalepId+"&Token="+ this.kullsrc.token;
       return await this.http.get<Result<SozlesmeDtKullaniciModel[]>>(url).pipe( map((res:any)=> res));
      }

    async SozlesmeDegisimTalepOnay(data:SozlesmeDtModel,tip:IslemTipi):Promise<ReturnValues>  {
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
          "Tip":  tip,
          "Token":this.kullsrc.token,
        });

      var result = await this.http.post<any>(this.semUrl+"/Anket/SozlesmeDegisimTalepOnay", body, options).toPromise();

      var sonuc = JSON.parse(JSON.stringify(result))['Model'];
      return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
    }

    async SozlesmeDegisimTalepOnayToplu(List:SozlesmeDtModel[],Aciklama:string,tip:IslemTipi):Promise<ReturnValues>  {
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
          "Tip":  tip,
          "Aciklama":  Aciklama,
          "Token":this.kullsrc.token,
        });

      var result = await this.http.post<any>(this.semUrl+"/Anket/SozlesmeDegisimTalepOnay", body, options).toPromise();

      var sonuc = JSON.parse(JSON.stringify(result))['Model'];
      return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
    }

    async UyeBirimDegistir(uyelist:OnKayit[],birimid:number,aciklama:string,onayduurm:number):Promise<ReturnValues>  {
      const headers = new HttpHeaders(
        {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Headers': 'Content-Type',
       }
      );

      let options = { headers: headers };

      const body =  JSON.stringify({
        "UyeList":  uyelist,
        "BirimId": birimid,
        "OnayDurum": onayduurm,
        "Aciklama": aciklama,
        "Token":this.kullsrc.token
      });

      var result = await this.http.post<any>(this.semUrl+"/Anket/UyeBirimDegistir", body, options).toPromise();

      var sonuc = JSON.parse(JSON.stringify(result))['Model'];
      return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
    }


    async UyeBirimDegistirOnay(uyelist:OnKayit[],birimid:number,aciklama:string,onayudurum:number):Promise<ReturnValues>  {
      const headers = new HttpHeaders(
        {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Headers': 'Content-Type',
       }
      );

      let options = { headers: headers };

      const body =  JSON.stringify({
        "UyeList":  uyelist,
        "BirimId": birimid,
        "OnayDurum": onayudurum,
        "Aciklama": aciklama,
        "Token":this.kullsrc.token
      });

      var result = await this.http.post<any>(this.semUrl+"/Anket/UyeBirimDegistirOnay", body, options).toPromise();

      var sonuc = JSON.parse(JSON.stringify(result))['Model'];
      return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
    }

    async CrmSikayetEkle(data:CrmSikayetModel,sozlesme:OnKayit,tip:IslemTipi):Promise<ReturnValues>  {
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
          "Sozlesme":  sozlesme,
          "Tip":  tip,
          "Token":this.kullsrc.token,
        });

      var result = await this.http.post<any>(this.semUrl+"/Anket/CrmSikayetEkle", body, options).toPromise();

      var sonuc = JSON.parse(JSON.stringify(result))['Model'];
      return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
    }

    async GetCrmSikayet(code:number,sozlesmeid:number)
      {
       let url=this.semUrl+"/Anket/GetCrmSikayet?Docentry="+ code+"&SozlesmeId="+ sozlesmeid+"&Token="+ this.kullsrc.token;
       return await this.http.get<Result<CrmSikayetModel[]>>(url).pipe( map((res:any)=> res));
      }

      async CrmSmsEkle(data:CrmSmsModel,sozlesme:OnKayit,tip:IslemTipi,SmsGonderimSekli:number):Promise<ReturnValues>  {
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
            "Sozlesme":  sozlesme,
            "Tip":  tip,
            "SmsGonderimSekli":  SmsGonderimSekli,
            "Token":this.kullsrc.token,
          });

        var result = await this.http.post<any>(this.semUrl+"/Anket/CrmSmsEkle", body, options).toPromise();

        var sonuc = JSON.parse(JSON.stringify(result))['Model'];
        return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
      }

      async CrmSmsTopluEkle(data:CrmSmsModel,list:OnKayit[],SANTRALNUMARA:string,TESISMAIL:string,SENETVADE:string,PERSONELTEL:string,ARAMASEBEBI:string,KALANAIDAT:string,YEMEKTUTAR:string):Promise<ReturnValues>  {
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
            "SANTRALNUMARA":  SANTRALNUMARA,
            "TESISMAIL":  TESISMAIL,
            "SENETVADE":  SENETVADE,
            "PERSONELTEL":  PERSONELTEL,
            "ARAMASEBEBI":  ARAMASEBEBI,
            "KALANAIDAT":  KALANAIDAT,
            "YEMEKTUTAR":  YEMEKTUTAR,
            "Token":this.kullsrc.token,
          });

        var result = await this.http.post<any>(this.semUrl+"/Anket/CrmSmsTopluEkle", body, options).toPromise();

        var sonuc = JSON.parse(JSON.stringify(result))['Model'];
        return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
      }

      async GetCrmSms(code:number,sozlesmeid:number)
        {
         let url=this.semUrl+"/Anket/GetCrmSms?Docentry="+ code+"&SozlesmeId="+ sozlesmeid+"&Token="+ this.kullsrc.token;
         return await this.http.get<Result<CrmSmsModel[]>>(url).pipe( map((res:any)=> res));
        }

        async UyeDevirOnayBekleyenList(sorumlubirim:number)
      {
       let url=this.semUrl+"/Anket/UyeDevirOnayBekleyenList?SorumluBirim="+ sorumlubirim+"&Token="+ this.kullsrc.token;
       return await this.http.get<Result<OnKayit[]>>(url).pipe( map((res:any)=> res));
      }

      async UyeRezervasyonEkle(data:UyeRezervasyonModel,sms:SmsEntegrasyonModel | undefined,tip:IslemTipi):Promise<ReturnValues>  {
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
            "Sms":  sms,
            "Tip":  tip,
            "Token":this.kullsrc.token,
          });

        var result = await this.http.post<any>(this.semUrl+"/Anket/UyeRezervasyonEkle", body, options).toPromise();

        var sonuc = JSON.parse(JSON.stringify(result))['Model'];
        return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
      }

      async UyeRezervasyonIptal(data:UyeRezervasyonModel):Promise<ReturnValues>  {
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
            "Token":this.kullsrc.token,
          });

        var result = await this.http.post<any>(this.semUrl+"/Anket/UyeRezervasyonIptal", body, options).toPromise();

        var sonuc = JSON.parse(JSON.stringify(result))['Model'];
        return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
      }

      async UyeRezervasyonAktif(data:UyeAidatTahsilatModel):Promise<ReturnValues>  {
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
            "Token":this.kullsrc.token,
          });

        var result = await this.http.post<any>(this.semUrl+"/Anket/UyeRezervasyonAktif", body, options).toPromise();

        var sonuc = JSON.parse(JSON.stringify(result))['Model'];
        return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
      }

      async GetUyeRezervasyon(code:number,sozlesmeid:number,durumid:number,tckn:string)
        {
         let url=this.semUrl+"/Anket/GetUyeRezervasyon?Docentry="+ code+"&SozlesmeId="+ sozlesmeid+"&DurumId="+ durumid+"&Tckn="+ tckn+"&Token="+ this.kullsrc.token;
         return await this.http.get<Result<UyeRezervasyonModel[]>>(url).pipe( map((res:any)=> res));
        }

        async UyeRezervasyonDetayEkle(data:UyeRezervasyonDetayModel,tip:IslemTipi):Promise<ReturnValues>  {
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
              "Tip":  tip,
              "Token":this.kullsrc.token,
            });

          var result = await this.http.post<any>(this.semUrl+"/Anket/UyeRezervasyonDetayEkle", body, options).toPromise();

          var sonuc = JSON.parse(JSON.stringify(result))['Model'];
          return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
        }

        async GetUyeRezervasyonDetay(code:number,rezervasyonid:number,sozlesmeid:number)
          {
           let url=this.semUrl+"/Anket/GetUyeRezervasyonDetay?Docentry="+ code+"&RezervasyonId="+ rezervasyonid+"&SozlesmeId="+ sozlesmeid+"&Token="+ this.kullsrc.token;
           return await this.http.get<Result<UyeRezervasyonDetayModel[]>>(url).pipe( map((res:any)=> res));
          }


          async UyeIkinciTanimiVarmi(docentry:number,telefon:String):Promise<any>  {
            const headers = new HttpHeaders(
              {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Access-Control-Allow-Headers': 'Content-Type',
             }
            );
    
              let options = { headers: headers };
    
              const body =  JSON.stringify({
                "Data":  docentry,
                "Telefon":  telefon,
                "Token":this.kullsrc.token,
              });
    
            var result = await this.http.post<any>(this.semUrl+"/Anket/UyeIkinciTanimiVarmi", body, options).toPromise();
    
            var sonuc = JSON.parse(JSON.stringify(result))['Model'];
            return sonuc;
      }  

      async UyeTelefonKontrol(telefon:String,DocEntry:number):Promise<any>  {
        const headers = new HttpHeaders(
          {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Headers': 'Content-Type',
         }
        );

          let options = { headers: headers };

          const body =  JSON.stringify({ 
            "Telefon":  telefon,
            "Data":  DocEntry,
            "Token":this.kullsrc.token,
          });

        var result = await this.http.post<any>(this.semUrl+"/Anket/UyeTelefonKontrol", body, options).toPromise();

        var sonuc = JSON.parse(JSON.stringify(result))['Model'];
        return sonuc;
  }  

  async ConfUyeTelefonKontrol(telefon:String):Promise<any>  {
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
     }
    );

      let options = { headers: headers };

      const body =  JSON.stringify({ 
        "Telefon":  telefon, 
        "Token":this.kullsrc.token,
      });

    var result = await this.http.post<any>(this.semUrl+"/Anket/ConfUyeTelefonKontrol", body, options).toPromise();

    var sonuc = JSON.parse(JSON.stringify(result))['Model'];
    return sonuc;
}  
      
      async UyeHediyeTatilSms(list:OnKayit[],otorizeveren:string,SmsTip:number,YemekUcretli:number):Promise<ReturnValues>  {
        const headers = new HttpHeaders(
          {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Headers': 'Content-Type',
         }
        );

          let options = { headers: headers };

          const body =  JSON.stringify({
            "Data":  list, 
            "OtorizeVeren":otorizeveren,
            "SmsTip":SmsTip,
            "YemekUcretli":YemekUcretli,
            "Token":this.kullsrc.token,
          });

        var result = await this.http.post<any>(this.semUrl+"/Anket/UyeHediyeTatilSms", body, options).toPromise();

        var sonuc = JSON.parse(JSON.stringify(result))['Model'];
        return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
  }

  async GetUyeHediyeTatilSmsLog(Telefon:String)
  {
   let url=this.semUrl+"/Anket/GetUyeHediyeTatilSmsLog?Telefon="+Telefon+"&Token="+ this.kullsrc.token;
   return await this.http.get<Result<any[]>>(url).pipe( map((res:any)=> res));
  }

  async UyeHediyeTatilSmsTekrar(data:OnKayit,telefon:string,mesaj:string):Promise<ReturnValues>  {
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
     }
    );

      let options = { headers: headers };

      const body =  JSON.stringify({
        "Sozlesme":  data, 
        "Telefon":  telefon, 
        "Mesaj":  mesaj, 
        "Token":this.kullsrc.token,
      });

    var result = await this.http.post<any>(this.semUrl+"/Anket/UyeHediyeTatilSmsTekrar", body, options).toPromise();

    var sonuc = JSON.parse(JSON.stringify(result))['Model'];
    return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}

async EntUyeHediyeTatilSmsTekrar(data:SmsEntegrasyonModel):Promise<ReturnValues>  {
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
      "Token":this.kullsrc.token,
    });

  var result = await this.http.post<any>(this.semUrl+"/Anket/EntUyeHediyeTatilSmsTekrar", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}

async UyeOtorizeHediyeTatilSms(data:SmsEntegrasyonModel,otorizeverenid:number,YemekUcretli:number,OtorizeAciklama:string):Promise<ReturnValues>  {
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
      "OtorizeVerenId":  otorizeverenid,  
      "YemekUcretli":  YemekUcretli,  
      "OtorizeAciklama":  OtorizeAciklama,  
      "Token":this.kullsrc.token,
    });

  var result = await this.http.post<any>(this.semUrl+"/Anket/UyeOtorizeHediyeTatilSms", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}

async UyeOtorizeSmsGonder(data:OtorizeSmsModel,tip:IslemTipi):Promise<ReturnValues>  {
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
      "Tip":  tip,
      "Token":this.kullsrc.token,
    });

  var result = await this.http.post<any>(this.semUrl+"/Anket/UyeOtorizeSmsGonder", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}

async UyeOtorizeTatilSms(list:OnKayit[]=[],otorizeverenid:number,otorizeveren:string,OtorizeAciklama:string):Promise<ReturnValues>  {
  const headers = new HttpHeaders(
    {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Headers': 'Content-Type',
   }
  );

    let options = { headers: headers };

    const body =  JSON.stringify({
      "Data":  list, 
      "OtorizeVeren":otorizeveren,
      "OtorizeVerenId":otorizeverenid,
      "OtorizeAciklama":OtorizeAciklama,
      "Token":this.kullsrc.token,
    });

  var result = await this.http.post<any>(this.semUrl+"/Anket/UyeOtorizeTatilSms", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}

async HediyeTatilSmsGuncelle(data:SmsEntegrasyonModel):Promise<ReturnValues>  {
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
      "Token":this.kullsrc.token,
    });

  var result = await this.http.post<any>(this.semUrl+"/Anket/HediyeTatilSmsGuncelle", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}

async HediyeTatilSmsAramaEkle(data:SmsEntegrasyonModel):Promise<ReturnValues>  {
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
      "Token":this.kullsrc.token,
    });

  var result = await this.http.post<any>(this.semUrl+"/Anket/HediyeTatilSmsAramaEkle", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}

async DevreTatilAramaEkle(data:DevreTatilKayitModel):Promise<ReturnValues>  {
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
      "Token":this.kullsrc.token,
    });

  var result = await this.http.post<any>(this.semUrl+"/Anket/DevreTatilAramaEkle", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}

async TopluSenetSatirKopyalama(data:TopluSenetEslestirmeModel):Promise<ReturnValues>  {
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
      "Token":this.kullsrc.token,
    });

  var result = await this.http.post<any>(this.semUrl+"/Anket/TopluSenetSatirKopyalama", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}

async TopluSenetSatirGuncelle(data:TopluSenetEslestirmeModel):Promise<ReturnValues>  {
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
      "Token":this.kullsrc.token,
    });

  var result = await this.http.post<any>(this.semUrl+"/Anket/TopluSenetSatirGuncelle", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}

async SozlesmeSenetKapatma(data:OnKayit,kapatma:OdemeKapama,senet:SozlesmeSenetModel[]):Promise<ReturnValues>  {
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
      "Kapatma":  kapatma,
      "Senet":  senet, 
      "Token":this.kullsrc.token,
    });

  var result = await this.http.post<any>(this.semUrl+"/Anket/SozlesmeSenetKapatma", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}

async TahsilatBilinmeyenAktar(list:TopluSenetEslestirmeModel[]=[],tahsilat:TahsilatModel):Promise<ReturnValues>  {
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
      "Tahsilat":  tahsilat, 
      "Token":this.kullsrc.token,
    });

  var result = await this.http.post<any>(this.semUrl+"/Anket/TahsilatBilinmeyenAktar", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}

async TahsilatBilinmeyenGeriAl(list:TopluSenetEslestirmeModel[],tahsilat:TahsilatModel):Promise<ReturnValues>  {
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
      "Tahsilat":tahsilat,
      "Token":this.kullsrc.token,
    });

  var result = await this.http.post<any>(this.semUrl+"/Anket/TahsilatBilinmeyenGeriAl", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}

async TahsilatBilinmeyenSil(list:TopluSenetEslestirmeModel[]):Promise<ReturnValues>  {
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
    });

  var result = await this.http.post<any>(this.semUrl+"/Anket/TahsilatBilinmeyenSil", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}

async TahsilatBilinmeyenDisi(list:TopluSenetEslestirmeModel[]):Promise<ReturnValues>  {
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
    });

  var result = await this.http.post<any>(this.semUrl+"/Anket/TahsilatBilinmeyenDisi", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}

async TarihKilitKontrol(tarih:any):Promise<ReturnValues>  {
  const headers = new HttpHeaders(
    {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Headers': 'Content-Type',
   }
  );

    let options = { headers: headers };

    const body =  JSON.stringify({
      "Tarih":  tarih,  
      "Token":this.kullsrc.token,
    });

  var result = await this.http.post<any>(this.semUrl+"/Anket/TarihKilitKontrol", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}

async IadeKalanSenetAktarim(sozlesme:OnKayit,data:FinansIadeModel,aciklama:string):Promise<ReturnValues>  {
  const headers = new HttpHeaders(
    {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Headers': 'Content-Type',
   }
  );

    let options = { headers: headers };

    const body =  JSON.stringify({
      "Sozlesme":  sozlesme,
      "Data":  data,
      "Aciklama":  aciklama, 
      "Token":this.kullsrc.token,
    });

  var result = await this.http.post<any>(this.semUrl+"/Anket/IadeKalanSenetAktarim", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}

async TahsilatBilinmeyenIadeGonder(list:TopluSenetEslestirmeModel[]):Promise<ReturnValues>  {
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
    });

  var result = await this.http.post<any>(this.semUrl+"/Anket/TahsilatBilinmeyenIadeGonder", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}

async TahsilatBilinmeyenIadeGeriAl(list:TopluSenetEslestirmeModel[]):Promise<ReturnValues>  {
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
    });

  var result = await this.http.post<any>(this.semUrl+"/Anket/TahsilatBilinmeyenIadeGeriAl", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}

async TahsilatBilinmeyenBirimDegistir(list:TopluSenetEslestirmeModel[],bolum:number):Promise<ReturnValues>  {
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
      "Bolum":  bolum, 
      "Token":this.kullsrc.token,
    });

  var result = await this.http.post<any>(this.semUrl+"/Anket/TahsilatBilinmeyenBirimDegistir", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}

async SozlesmeAidatKapatma(data:OnKayit,kapatma:OdemeKapama,aidat:UyeAidatTahsilatModel[]):Promise<ReturnValues>  {
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
      "Kapatma":  kapatma,
      "Aidat":  aidat, 
      "Token":this.kullsrc.token,
    });

  var result = await this.http.post<any>(this.semUrl+"/Anket/SozlesmeAidatKapatma", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}

async SozlesmeAidatKapatma2(kapatma:OdemeKapama,aidat:UyeAidatTahsilatModel):Promise<ReturnValues>  {
  const headers = new HttpHeaders(
    {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Headers': 'Content-Type',
   }
  );

    let options = { headers: headers };

    const body =  JSON.stringify({ 
      "Kapatma":  kapatma,
      "Aidat2":  aidat, 
      "Token":this.kullsrc.token,
    });

  var result = await this.http.post<any>(this.semUrl+"/Anket/SozlesmeAidatKapatma2", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}

async GetUyeDevirLogList(sozlesmeid:number)
       {
        let url=this.semUrl+"/Anket/GetUyeDevirLogList?SozlesmeId="+ sozlesmeid+"&Token="+ this.kullsrc.token;
        return await this.http.get<Result<UyeAtamaModel[]>>(url).pipe( map((res:any)=> res));
       }

       async KiymetliEvrakTakipBilgiTanimEkle(data:KiymetliEvrakTakipModel,islemtip:IslemTipi):Promise<ReturnValues>  {
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
            "Tip":  islemtip, 
            "Token":this.kullsrc.token,
          });
      
        var result = await this.http.post<any>(this.semUrl+"/Anket/KiymetliEvrakTakipBilgiTanimEkle", body, options).toPromise();
      
        var sonuc = JSON.parse(JSON.stringify(result))['Model'];
        return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
      }
      
      async GetKiymetliEvrakTakipBilgiTanim(sozlesmeid:number)
             {
              let url=this.semUrl+"/Anket/GetKiymetliEvrakTakipBilgiTanim?SozlesmeId="+ sozlesmeid+"&Token="+ this.kullsrc.token;
              return await this.http.get<Result<KiymetliEvrakTakipModel[]>>(url).pipe( map((res:any)=> res));
             }    
             
             async SozlesmeTakipBilgiEkle(data:KiymetliEvrakTakipModel,sozlesmeid:number):Promise<ReturnValues>  {
              const headers = new HttpHeaders(
                {
                  'Content-Type': 'application/json',
                  'Accept': 'application/json',
                  'Access-Control-Allow-Headers': 'Content-Type',
               }
              );
            
                let options = { headers: headers };
            
                const body =  JSON.stringify({ 
                  "Madde":  data,
                  "SozlesmeId":  sozlesmeid, 
                  "Token":this.kullsrc.token,
                });
            
              var result = await this.http.post<any>(this.semUrl+"/Anket/SozlesmeTakipBilgiEkle", body, options).toPromise();
            
              var sonuc = JSON.parse(JSON.stringify(result))['Model'];
              return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
            }
            
  async GetSozlesmeTakipBilgi(sozlesmeid:number)
         {
          let url=this.semUrl+"/Anket/GetSozlesmeTakipBilgi?SozlesmeId="+ sozlesmeid+"&Token="+ this.kullsrc.token;
          return await this.http.get<Result<KiymetliEvrakTakipModel[]>>(url).pipe( map((res:any)=> res));
         }      
          
         async KiymetliEvrakSozlesmeOnay(anket:OnKayit[],durum:number):Promise<ReturnValues>  {
          const headers = new HttpHeaders(
            {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Access-Control-Allow-Headers': 'Content-Type',
           }
          );
      
            let options = { headers: headers };
      
            const body =  JSON.stringify({
              "Data":  anket,
              "Durum":  durum,
              "Token":this.kullsrc.token,
            });
      
          var result = await this.http.post<any>(this.semUrl+"/Anket/KiymetliEvrakSozlesmeOnay", body, options).toPromise();
      
          var sonuc = JSON.parse(JSON.stringify(result))['Model'];
          return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
      }                   

      async TapuFaturaListesi(filter:FiltreAramaModel[],baslangic:Date,bitis:Date,tapudurum:number):Promise<ReturnValuesList<OnKayit>>  {
        const headers = new HttpHeaders(
          {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Headers': 'Content-Type',
         }
        );
    
          let options = { headers: headers };
    
          const body =  JSON.stringify({ 
            "Data":  filter,  
            "TapuDurumTip":  tapudurum,  
            "Baslangic":  baslangic,
            "Bitis":  bitis,
            "Token":this.kullsrc.token,
          });
    
        var result = await this.http.post<any>(this.semUrl+"/Anket/TapuFaturaListesi", body, options).toPromise();
    
        var sonuc = JSON.parse(JSON.stringify(result));
    
        return new ReturnValuesList( sonuc.Model["Id"], sonuc.Model["Success"], sonuc.Model["Message"] ?? "", sonuc.Model["Token"] ?? "",sonuc.Model["List"],sonuc.Model["JsonData"]);
      }

      async TapuFaturaOlustur(list:OnKayit[]=[],data:OnKayit|undefined,faturatarih:any,sirketid:number):Promise<ReturnValuesList<OnKayit>>  {
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
            "Data":  data,
            "FaturaTarih":  faturatarih,
            "SirketId":  sirketid,
            "Token":this.kullsrc.token,
          });
    
        var result = await this.http.post<any>(this.semUrl+"/Anket/TapuFaturaOlustur", body, options).toPromise();
    
        var sonuc = JSON.parse(JSON.stringify(result));
    
        return new ReturnValuesList( sonuc.Model["Id"], sonuc.Model["Success"], sonuc.Model["Message"] ?? "", sonuc.Model["Token"] ?? "",sonuc.Model["List"],sonuc.Model["JsonData"]);
      }

      async TapuFaturaIptal(list:OnKayit[]=[]):Promise<ReturnValuesList<OnKayit>>  {
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
          });
    
        var result = await this.http.post<any>(this.semUrl+"/Anket/TapuFaturaIptal", body, options).toPromise();
    
        var sonuc = JSON.parse(JSON.stringify(result));
    
        return new ReturnValuesList( sonuc.Model["Id"], sonuc.Model["Success"], sonuc.Model["Message"] ?? "", sonuc.Model["Token"] ?? "",sonuc.Model["List"],sonuc.Model["JsonData"]);
      }

      async OdemeIadeBilinmeyenAktar(data:FinansIadeModel,aciklama:string):Promise<ReturnValues>  {
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
            "Aciklama":  aciklama, 
            "Token":this.kullsrc.token,
          });
      
        var result = await this.http.post<any>(this.semUrl+"/Anket/OdemeIadeBilinmeyenAktar", body, options).toPromise();
      
        var sonuc = JSON.parse(JSON.stringify(result))['Model'];
        return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
      }

      async OnSozlesmeUyeDevir(eski:OnKayit,yeni:OnKayit,diger:OnKayit[]=[]):Promise<ReturnValues>  {
        const headers = new HttpHeaders(
          {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Headers': 'Content-Type',
         }
        );
      
          let options = { headers: headers };
      
          const body =  JSON.stringify({
            "Eski":  eski, 
            "Yeni":  yeni, 
            "Diger":  diger, 
            "Token":this.kullsrc.token,
          });
      
        var result = await this.http.post<any>(this.semUrl+"/Anket/OnSozlesmeUyeDevir", body, options).toPromise();
      
        var sonuc = JSON.parse(JSON.stringify(result))['Model'];
        return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
      }

      async GetFuOrtakList(cagriid:number)
      {
       let url=this.semUrl+"/Anket/GetFuOrtakList?CagriId="+ cagriid+"&Token="+ this.kullsrc.token;
       return await this.http.get<Result<FuOrtakModel[]>>(url).pipe( map((res:any)=> res));
      } 

      async GetFuPrimKontrolList(donemid:number,altdonemid:number)
          {
               let url=this.semUrl+"/Anket/GetFuPrimKontrolList?Token="+ this.kullsrc.token+"&DonemId="+donemid+"&AltDonemId="+altdonemid;
                return await this.http.get<Result<CagriTrafikModel[]>>(url).pipe(map((res:any)=> res));
     }

     async GetFuSpiffKontrolList(donemid:number,altdonemid:number)
          {
               let url=this.semUrl+"/Anket/GetFuSpiffKontrolList?Token="+ this.kullsrc.token+"&DonemId="+donemid+"&AltDonemId="+altdonemid;
                return await this.http.get<Result<FuSpiffButceModel[]>>(url).pipe(map((res:any)=> res));
     }

     async FuPrimKontrol(data:CagriTrafikModel[],islem:number,aciklama:string):Promise<ReturnValues>  {
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
          "Islem":  islem,
          "Aciklama":  aciklama,
          "Token":this.kullsrc.token,
        });
  
      var result = await this.http.post<any>(this.semUrl+"/Anket/FuPrimKontrol", body, options).toPromise();
  
      var sonuc = JSON.parse(JSON.stringify(result))['Model'];
      return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
  }

  async FuPrimKontrolHesapla(donem:number,altdonem:number):Promise<ReturnValues>  {
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
     }
    );

      let options = { headers: headers };

      const body =  JSON.stringify({
        "Donem":  donem,
        "AltDonem":  altdonem,
        "Token":this.kullsrc.token,
      });

    var result = await this.http.post<any>(this.semUrl+"/Anket/FuPrimKontrolHesapla", body, options).toPromise();

    var sonuc = JSON.parse(JSON.stringify(result))['Model'];
    return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
  }

  async FuSpiffBuceGuncelle(data:FuSpiffButceModel,donemid:number,altdonemid:number):Promise<ReturnValues>  {
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
        "DonemId":  donemid, 
        "AltDonemId":  altdonemid, 
        "Token":this.kullsrc.token,
      });

    var result = await this.http.post<any>(this.semUrl+"/Anket/FuSpiffBuceGuncelle", body, options).toPromise();

    var sonuc = JSON.parse(JSON.stringify(result))['Model'];
    return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
  }

  async GetFuPrimHesaplandimi(donemid:number,altdonemid:number)
          {
               let url=this.semUrl+"/Anket/GetFuPrimHesaplandimi?Token="+ this.kullsrc.token+"&DonemId="+donemid+"&AltDonemId="+altdonemid;
                return await this.http.get<Result<FuPrimHesapKontrol>>(url).pipe(map((res:any)=> res));
     }

     async KickFesihForm(data:KickModel):Promise<ReturnValues>  {
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
          "Token":this.kullsrc.token,
        });

      var result = await this.http.post<any>(this.semUrl+"/Anket/KickFesihForm", body, options).toPromise();

      var sonuc = JSON.parse(JSON.stringify(result))['Model'];
      return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
  }

  async IadeTalepOnay(data:FinansIadeModel,durum:boolean,aciklama:string):Promise<ReturnValues>  {
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
        "Durum":  durum, 
        "Aciklama":  aciklama, 
        "Token":this.kullsrc.token,
      });

    var result = await this.http.post<any>(this.semUrl+"/Anket/IadeTalepOnay", body, options).toPromise();

    var sonuc = JSON.parse(JSON.stringify(result))['Model'];
    return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}

async GetZeyilnameList(durum:number)
      {
           let url=this.semUrl+"/Anket/GetZeyilnameList?Durum="+durum+"&Token="+this.kullsrc.token;
              return await this.http.get<Result<OnKayit>>(url).pipe( map((res:any)=> res));
      }

    async GetTopluMakbuzOdemeList(SozlesmeId:number,Baslangic:Date | undefined,Bitis:Date |undefined)
    { 
         let url=this.semUrl+"/Anket/GetTopluMakbuzOdemeList?SozlesmeId="+SozlesmeId+"&Baslangic="+moment(Baslangic).format("yyyy-MM-DD")+"&Bitis="+moment(Bitis).format("yyyy-MM-DD")+"&Token="+this.kullsrc.token; 
            return await this.http.get<Result<FinansHareketModel>>(url).pipe( map((res:any)=> res));
    }

    async OnSozlesmeSiparisForm(bast:Date,bitt:Date,ekipId:number):Promise<ReturnValues>  {
      const headers = new HttpHeaders(
        {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Headers': 'Content-Type',
       }
      ); 
    
        let options = { headers: headers };
    
        const body =  JSON.stringify({ 
          "RaporBasTarih":  bast,    
          "RaporBitTarih":  bitt,    
          "RaporEkipId":  ekipId,    
          "Token":this.kullsrc.token, 
        });
    
      var result = await this.http.post<any>(this.semUrl+"/Anket/OnSozlesmeSiparisForm", body, options).toPromise();
    
      var sonuc = JSON.parse(JSON.stringify(result))['Model'];
      return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
  } 

  async UyeDevirSozlesmeList(DocEntry:number)
  {
   let url=this.semUrl+"/Anket/UyeDevirSozlesmeList?DocEntry="+DocEntry+"&Token="+ this.kullsrc.token;
   return await this.http.get<Result<OnKayit[]>>(url).pipe( map((res:any)=> res));
  }

  async AnketSil(data:AnketMaster[]):Promise<ReturnValues>  {
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
     }
    ); 
  
      let options = { headers: headers };
  
      const body =  JSON.stringify({ 
        "Anket":  data,        
        "Token":this.kullsrc.token, 
      });
  
    var result = await this.http.post<any>(this.semUrl+"/Anket/AnketSil", body, options).toPromise();
  
    var sonuc = JSON.parse(JSON.stringify(result))['Model'];
    return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
} 

 

  async GetSmsGonderimList(DocEntry:number,SmsDurum:number,Baslangic:Date | undefined,Bitis:Date |undefined,SozlesmeId:number,Keyword:string):Promise<ReturnValuesList<SmsEntegrasyonModel>>  {
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
     }
    );
  
      let options = { headers: headers };
  
      const body =  JSON.stringify({
        "DocEntry":  DocEntry,
        "SmsDurum":  SmsDurum,
        "SozlesmeId":  SozlesmeId,
        "Baslangic":  Baslangic,
        "Bitis":Bitis,
        "Keyword":Keyword,
        "Token":this.kullsrc.token,
      });
  
    var result = await this.http.post<any>(this.semUrl+"/Anket/GetSmsGonderimList", body, options).toPromise();
  
    var sonuc = JSON.parse(JSON.stringify(result));
  
    return new ReturnValuesList( sonuc.Model["Id"], sonuc.Model["Success"], sonuc.Model["Message"] ?? "", sonuc.Model["Token"] ?? "",sonuc.Model["List"]);
  }

  async GetConfAileBul(telefonno:string)
 {
      let url=this.semUrl+"/Anket/GetConfAileBul?TelefonNo="+telefonno+"&Token="+ this.kullsrc.token;
       return await this.http.get<Result<AnketDetay[]>>(url).pipe( map((res:any)=> res));
 }


 async SozlesmeTopluDurumEkle(data:SozlesmeTopluDurumModel,tip:IslemTipi):Promise<ReturnValues>  {
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
      "Tip":  tip,  
      "Token":this.kullsrc.token,
    });

  var result = await this.http.post<any>(this.semUrl+"/Anket/SozlesmeTopluDurumEkle", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
}

async GetSozlesmeTopluDurum(id:number,eslesmedurumid:number,durumid:number)
    {
         let url=this.semUrl+"/Anket/GetSozlesmeTopluDurum?DocEntry="+id+"&EslesmeDurumId="+eslesmedurumid+"&DurumId="+durumid+"&Token="+this.kullsrc.token;
            return await this.http.get<Result<SozlesmeTopluDurumModel>>(url).pipe( map((res:any)=> res));
    }

    async SozlesmeTopluDurumGuncelle(sozlesme:OnKayit| undefined,list:SozlesmeTopluDurumModel[]=[],tip:IslemTipi):Promise<ReturnValues>  {
      const headers = new HttpHeaders(
        {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Headers': 'Content-Type',
       }
      );

        let options = { headers: headers };

        const body =  JSON.stringify({
          "Sozlesme":  sozlesme,
          "List":  list,
          "Tip":  tip, 
          "Token":this.kullsrc.token,
        });

      var result = await this.http.post<any>(this.semUrl+"/Anket/SozlesmeTopluDurumGuncelle", body, options).toPromise();

      var sonuc = JSON.parse(JSON.stringify(result))['Model'];
      return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
    }

    async SozlesmeTopluDurumAktar(durum:UyeSozlesmeDurumModel,list:SozlesmeTopluDurumModel[]=[]):Promise<ReturnValues>  {
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
          "List":  list,
          "Token":this.kullsrc.token,
        });

      var result = await this.http.post<any>(this.semUrl+"/Anket/SozlesmeTopluDurumAktar", body, options).toPromise();

      var sonuc = JSON.parse(JSON.stringify(result))['Model'];
      return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
    } 


      async GetYemekhaneGiris(Tckn:string,Tesis:string,Adet:number,Tarih:any):Promise<ReturnValues>  {
        const headers = new HttpHeaders(
          {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Headers': 'Content-Type',
         }
        );
  
          let options = { headers: headers };
  
          const body =  JSON.stringify({
            "Tckn":  Tckn,
            "Tesis":  Tesis,
            "Adet":  Adet,
            "Tarih":  Tarih,
            "Token":this.kullsrc.token,
          });
  
        var result = await this.http.post<any>(this.semUrl+"/Entegrasyon/GetYemekhaneGiris", body, options).toPromise();
  
        var sonuc = JSON.parse(JSON.stringify(result))['Model']['Item2'];
        return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
      }

      async GetYemekhaneGirisList(Id:number,baslangic:Date,bitis:Date)
      {
           let url=this.semUrl+"/Entegrasyon/GetYemekhaneGirisList?Id="+ Id+"&Baslangic="+moment(baslangic).format("yyyy-MM-DD")+"&Bitis="+moment(bitis).format("yyyy-MM-DD")+"&Token="+ this.kullsrc.token;
            return await this.http.get<Result<YemekhaneCostModel[]>>(url).pipe( map((res:any)=> res));
      }

      async YemekHaneKisiEkle(data:YemekhaneKisi,Tip:IslemTipi):Promise<ReturnValues>  {
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
            "Tip":  Tip, 
            "Token":this.kullsrc.token,
          });
  
        var result = await this.http.post<any>(this.semUrl+"/Entegrasyon/YemekHaneKisiEkle", body, options).toPromise();
  
        var sonuc = JSON.parse(JSON.stringify(result))['Model'];
        return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
      }

      async GetYemekHaneKisiList(Id:number)
      {
           let url=this.semUrl+"/Entegrasyon/GetYemekHaneKisiList?Id="+ Id+"&Token="+ this.kullsrc.token;
            return await this.http.get<Result<YemekhaneKisi[]>>(url).pipe( map((res:any)=> res));
      }

      async GetSanalPosOdemeBekleyenList(AnaSozlesmeid:number)
    {
         let url=this.semUrl+"/Anket/GetSanalPosOdemeBekleyenList?AnaSozlesmeid="+AnaSozlesmeid+"&Token="+this.kullsrc.token;
            return await this.http.get<Result<SanalPosOdemeBekleyenModel>>(url).pipe( map((res:any)=> res));
    }

    async DevreTatilKayitEkle(data:DevreTatilKayitModel,kaynak:number,tip:IslemTipi):Promise<ReturnValues>  {
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
          "Kaynak":  kaynak,
          "Tip":  tip,
          "Token":this.kullsrc.token,
        });

      var result = await this.http.post<any>(this.semUrl+"/Entegrasyon/DevreTatilKayitEkle", body, options).toPromise();

      var sonuc = JSON.parse(JSON.stringify(result))['Model'];
      return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
    }
 

    async GetDevreTatilKayit(DocEntry:number,SmsDurum:number,Baslangic:Date | undefined,Bitis:Date |undefined,SozlesmeId:number,Keyword:string):Promise<ReturnValuesList<DevreTatilKayitModel>>  {
      const headers = new HttpHeaders(
        {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Headers': 'Content-Type',
       }
      );
    
        let options = { headers: headers };
    
        const body =  JSON.stringify({
          "DocEntry":  DocEntry,
          "SmsDurum":  SmsDurum,
          "SozlesmeId":  SozlesmeId,
          "Baslangic":  Baslangic,
          "Bitis":Bitis,
          "Keyword":Keyword,
          "Token":this.kullsrc.token,
        });
    
      var result = await this.http.post<any>(this.semUrl+"/Entegrasyon/GetDevreTatilKayit", body, options).toPromise();
    
      var sonuc = JSON.parse(JSON.stringify(result));
    
      return new ReturnValuesList( sonuc.Model["Id"], sonuc.Model["Success"], sonuc.Model["Message"] ?? "", sonuc.Model["Token"] ?? "",sonuc.Model["List"]);
    }

    async DevreTatilKayitEslestir(data:DevreTatilKayitModel,rez:UyeRezervasyonModel):Promise<ReturnValues>  {
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
          "Rezervasyon":  rez, 
          "Token":this.kullsrc.token,
        });

      var result = await this.http.post<any>(this.semUrl+"/Entegrasyon/DevreTatilKayitEslestir", body, options).toPromise();

      var sonuc = JSON.parse(JSON.stringify(result))['Model'];
      return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
    }

    async GunuBirlikKullanimEkle(data:DevreTatilKayitModel,rez:UyeRezervasyonModel):Promise<ReturnValues>  {
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
          "Rezervasyon":  rez, 
          "Token":this.kullsrc.token,
        });

      var result = await this.http.post<any>(this.semUrl+"/Entegrasyon/GunuBirlikKullanimEkle", body, options).toPromise();

      var sonuc = JSON.parse(JSON.stringify(result))['Model'];
      return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
    }

    async SenetAktiflestir(Senet:SozlesmeSenetModel):Promise<ReturnValues>  {
      const headers = new HttpHeaders(
        {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Headers': 'Content-Type',
       }
      );

        let options = { headers: headers };

        const body =  JSON.stringify({
          "Senet":  Senet, 
          "Token":this.kullsrc.token,
        });

      var result = await this.http.post<any>(this.semUrl+"/Anket/SenetAktiflestir", body, options).toPromise();

      var sonuc = JSON.parse(JSON.stringify(result))['Model'];
      return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
    }

    async CagriKuyrukBeklet(Pause:boolean):Promise<ReturnValues>  {
      const headers = new HttpHeaders(
        {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Headers': 'Content-Type',
       }
      );

        let options = { headers: headers };
        var dahili = sessionStorage.getItem("Dahili")?.toString()??"";

        const body =  JSON.stringify({
          "Pause":  Pause, 
          "Dahili":  dahili.split("-")[0], 
          "EmpId":  this.kullsrc.kullUserId, 
          "Token":this.kullsrc.token,
        });

      var result = await this.http.post<any>(this.semUrl+"/Anket/CagriKuyrukBeklet", body, options).toPromise();

      var sonuc = JSON.parse(JSON.stringify(result))['Model'];
      return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
    } 

    async CagriKuyrukBekletNtx2(Pause:boolean)  {
      try{
        const headers = new HttpHeaders(
          {
            'Content-Type': 'multipart/form-data' 
         }
        );
  
          let options = { headers: headers };
          var dahili = sessionStorage.getItem("Dahili")?.toString()??"";
          var LogAKey = sessionStorage.getItem("LogAKey")?.toString()??"";
  
          const body =  JSON.stringify({
            "key":  LogAKey.replace("bq12aa14",""), 
            "agent":  dahili.split("-")[0]
          });
  
          let pausetype  = "agentpauseall";
          if (!Pause) pausetype = "agentunpauseall";

  
          var result = await this.http.post("https://karaderilisantral.nitelix.com/apiv2/"+pausetype+"/", body, options); 
      }
      catch(e){
      }
    }
    
    async GetUyeRezervasyonAll(DocEntry:number,SmsDurum:number,Baslangic:Date | undefined,Bitis:Date |undefined,SozlesmeId:number,Keyword:string):Promise<ReturnValuesList<UyeRezervasyonDetayModel>>  {
      const headers = new HttpHeaders(
        {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Headers': 'Content-Type',
       }
      );
    
        let options = { headers: headers };
    
        const body =  JSON.stringify({
          "DocEntry":  DocEntry,
          "SmsDurum":  SmsDurum,
          "SozlesmeId":  SozlesmeId,
          "Baslangic":  Baslangic,
          "Bitis":Bitis,
          "Keyword":Keyword,
          "Token":this.kullsrc.token,
        });
    
      var result = await this.http.post<any>(this.semUrl+"/Anket/GetUyeRezervasyonAll", body, options).toPromise();
    
      var sonuc = JSON.parse(JSON.stringify(result));
    
      return new ReturnValuesList( sonuc.Model["Id"], sonuc.Model["Success"], sonuc.Model["Message"] ?? "", sonuc.Model["Token"] ?? "",sonuc.Model["List"]);
    }

    async RezervasyonDetayGuncelle(list:UyeRezervasyonDetayModel[],tip:IslemTipi,Aciklama:string,OdaNo:string,OdaTipId:number):Promise<ReturnValues>  {
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
          "Aciklama":  Aciklama,
          "OdaNo":  OdaNo,
          "OdaTipId":  OdaTipId,
          "Tip":  tip,
          "Token":this.kullsrc.token,
        });

      var result = await this.http.post<any>(this.semUrl+"/Anket/RezervasyonDetayGuncelle", body, options).toPromise();

      var sonuc = JSON.parse(JSON.stringify(result))['Model'];
      return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
    }

    async GetNtxCevapsizList(durumid:number,empid:number,baslangic:Date | undefined,bitis:Date |undefined)
    {     
      var dahili = sessionStorage.getItem("DahiliSube")?.toString()??"";
      let url=this.semUrl+"/Anket/GetNtxCevapsizList?Dahili="+dahili+"&Durum="+durumid+"&EmpId="+empid+"&Baslangic="+moment(baslangic).format("yyyy-MM-DD")+"&Bitis="+moment(bitis).format("yyyy-MM-DD")+"&Token="+this.kullsrc.token;
      return await this.http.get<Result<DTS_CEVAPSIZ_CAGRILAR>>(url).pipe( map((res:any)=> res));
    } 
 
    async UyeCevapsizAtama(atanan:KullaniciModel,list:DTS_CEVAPSIZ_CAGRILAR[]=[],birim:number,gerial:number):Promise<ReturnValues>  {
      const headers = new HttpHeaders(
        {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Headers': 'Content-Type',
       }
      );

        let options = { headers: headers };

        const body =  JSON.stringify({
          "Atanan":  atanan,
          "List":  list,
          "SorumluBirim":  birim,
          "Token":this.kullsrc.token,
          "GeriAl":gerial,
        });

      var result = await this.http.post<any>(this.semUrl+"/Anket/UyeCevapsizAtama", body, options).toPromise();

      var sonuc = JSON.parse(JSON.stringify(result))['Model'];
      return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
    }

    async SesKaydiDinle(idx:number,data:CagriTrafikModel):Promise<ReturnValues>  {
      const headers = new HttpHeaders(
        {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Headers': 'Content-Type',
       }
      );

        let options = { headers: headers }; 

        const body =  JSON.stringify({
          "idx":  idx,  
          "Data":  data,  
          "EmpId":  this.kullsrc.kullUserId, 
          "Token":this.kullsrc.token,
        });

      var result = await this.http.post<any>(this.semUrl+"/Santral/SesKaydiDinle", body, options).toPromise();

      var sonuc = JSON.parse(JSON.stringify(result))['Model'];
      return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
    } 

    async SesKaydiDinleRapor(idx:number,sube:string):Promise<ReturnValues>  {
      const headers = new HttpHeaders(
        {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Headers': 'Content-Type',
       }
      );

        let options = { headers: headers }; 

        const body =  JSON.stringify({
          "idx":  idx,  
          "Sube":  sube,  
          "EmpId":  this.kullsrc.kullUserId, 
          "Token":this.kullsrc.token,
        });

      var result = await this.http.post<any>(this.semUrl+"/Santral/SesKaydiDinleRapor", body, options).toPromise();

      var sonuc = JSON.parse(JSON.stringify(result))['Model'];
      return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
    } 

    async GetCanliCagriList(dahili:string)
    {     
      let url=this.semUrl+"/Anket/GetCanliCagriList?Dahili="+dahili+"&Token="+this.kullsrc.token;
      return await this.http.get<Result<X_CANLI_CAGRILAR>>(url).pipe( map((res:any)=> res));
    }

    async GetSantralOnlineUser(dahili:string)
    {     
      let url=this.semUrl+"/Anket/GetSantralOnlineUser?Dahili="+dahili+"&Token="+this.kullsrc.token;
      return await this.http.get<Result<SantralOnlineUserModel>>(url).pipe( map((res:any)=> res));
    }

    async GetSantralCagriIstatistik(dahili:string)
    {     
      let url=this.semUrl+"/Anket/GetSantralCagriIstatistik?Dahili="+dahili+"&Token="+this.kullsrc.token;
      return await this.http.get<Result<SantralCagriIstatistikModel>>(url).pipe( map((res:any)=> res));
    }

    async GetNtxSantralDashSayi(dahili:string)
    {     
      let url=this.semUrl+"/Anket/GetNtxSantralDashSayi?Dahili="+dahili+"&Token="+this.kullsrc.token;
      return await this.http.get<Result<NtxSantralDashBoardSayiModel>>(url).pipe( map((res:any)=> res));
    }

    async GetNtxSantralParametre()
    { 
        let url=this.semUrl+"/Anket/GetNtxSantralParametre?Token="+this.kullsrc.token; 
        return await this.http.get<Result<SistemModel>>(url).pipe( map((res:any)=> res));
    }

    async UyeNotSil(list:CagriTrafikModel[]=[]):Promise<ReturnValues>  {
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
        });

      var result = await this.http.post<any>(this.semUrl+"/Anket/UyeNotSil", body, options).toPromise();

      var sonuc = JSON.parse(JSON.stringify(result));
      return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
    } 

    async GetCallCagriEkleBilinmeyen(Baslangic:Date | undefined,Bitis:Date |undefined,Keyword:string):Promise<ReturnValuesList<CagriBilinmeyenModel>>  {
      const headers = new HttpHeaders(
        {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Headers': 'Content-Type',
       }
      );
    
        let options = { headers: headers };
    
        const body =  JSON.stringify({ 
          "Baslangic":  Baslangic,
          "Bitis":Bitis,
          "Keyword":Keyword,
          "Token":this.kullsrc.token,
        });
    
      var result = await this.http.post<any>(this.semUrl+"/Anket/GetCallCagriEkleBilinmeyen", body, options).toPromise();
    
      var sonuc = JSON.parse(JSON.stringify(result));
    
      return new ReturnValuesList( sonuc.Model["DocEntry"], sonuc.Model["Success"], sonuc.Model["Message"] ?? "", sonuc.Model["Token"] ?? "",sonuc.Model["List"]);
    }

    async GetNtxSesKayitlari(Data:CagriTrafikModel,SozlesmeId:number):Promise<ReturnValuesList<NtxSesKayitModel>>  {
      const headers = new HttpHeaders(
        {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
        );
  
        let options = { headers: headers };
        var dahili = sessionStorage.getItem("Dahili")?.toString()??"";
        var dahilisube = sessionStorage.getItem("DahiliSube")?.toString()??"";
        const body =  JSON.stringify({
          "Data":  Data,
          "SozlesmeId":  SozlesmeId,
          "Token":this.kullsrc.token,
          "Dahili":dahili,
          "DahiliSube":dahilisube
        });
  
      var result = await this.http.post<any>(this.semUrl+"/Anket/GetNtxSesKayitlari", body, options).toPromise();
  
      var sonuc = JSON.parse(JSON.stringify(result));
      return new ReturnValuesList( sonuc.Model["Id"], sonuc.Model["Success"], sonuc.Model["Message"] ?? "", sonuc.Model["Token"] ?? "",sonuc.Model["List"]);
      }

      async GetNtxSantralSubeler()
      { 
          let url=this.semUrl+"/Anket/GetNtxSantralSubeler?Token="+this.kullsrc.token; 
          return await this.http.get<Result<SantraSubeModel>>(url).pipe( map((res:any)=> res));
      }
      
      
      async GetAvukatlikSozlesmeVarmi(tckn:string)
      {
       let url=this.semUrl+"/Anket/GetAvukatlikSozlesmeVarmi?Tckn="+ tckn + "&Token="+ this.kullsrc.token;
       return await this.http.get<Result<number>>(url).pipe( map((res:any)=> res));
      }
  
      async SmsTaslakReplace(sms:SmsBilgiModel,Sozlesme:OnKayit):Promise<ReturnValuesList<CrmSmsModel>>  {
        const headers = new HttpHeaders(
          {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Headers': 'Content-Type',
         }
        );
      
          let options = { headers: headers };
      
          const body =  JSON.stringify({
            "Sms":  sms,
            "Sozlesme":Sozlesme,
            "Token":this.kullsrc.token,
          });
      
        var result = await this.http.post<any>(this.semUrl+"/Anket/SmsTaslakReplace", body, options).toPromise();
      
        var sonuc = JSON.parse(JSON.stringify(result));
 
        return new ReturnValuesList( sonuc.Model["Id"], sonuc.Model["Success"], sonuc.Model["Message"] ?? "", sonuc.Model["Token"] ?? "",sonuc.Model["List"]);
      }

      async GetNtxSantralDahililer(dahili:string)
      {     
        let url=this.semUrl+"/Anket/GetNtxSantralDahililer?Dahili="+dahili+"&Token="+this.kullsrc.token;
        return await this.http.get<Result<SNT_SANTRAL_DAHILI>>(url).pipe( map((res:any)=> res));
      }

      async GetRCITalepler(durum:string)
      {
       let url=this.semUrl+"/Anket/GetRCITalepler?Docentry="+ 0+"&Durum="+ durum +"&Token="+ this.kullsrc.token;
       return await this.http.get<Result<SNT_RCI_TALEPLER[]>>(url).pipe( map((res:any)=> res));
      }

      async SozlesmeNoBirlestir(data:OnKayit):Promise<ReturnValues>  {
        const headers = new HttpHeaders(
          {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Headers': 'Content-Type',
         }
        );
      
          let options = { headers: headers };
      
          const body =  JSON.stringify({
            "Sozlesme":  data,  
            "Token":this.kullsrc.token,
          });
      
        var result = await this.http.post<any>(this.semUrl+"/Anket/SozlesmeNoBirlestir", body, options).toPromise();
      
        var sonuc = JSON.parse(JSON.stringify(result))['Model'];
        return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
      }

      async UyeDosyaDevir(AktarimAgentTip:number,SorumluAgentId:number,DevredilecekAgentId:number,SorumluBirimId:number):Promise<ReturnValues>  {
        const headers = new HttpHeaders(
          {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Headers': 'Content-Type',
         }
        );
      
          let options = { headers: headers };
      
          const body =  JSON.stringify({
            "AktarimAgentTip":  AktarimAgentTip,  
            "SorumluAgentId":  SorumluAgentId,  
            "DevredilecekAgentId":  DevredilecekAgentId,  
            "SorumluBirimId":  SorumluBirimId,  
            "Token":this.kullsrc.token,
          });
      
        var result = await this.http.post<any>(this.semUrl+"/Anket/UyeDosyaDevir", body, options).toPromise();
      
        var sonuc = JSON.parse(JSON.stringify(result))['Model'];
        return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
      }

      async GetTesisSmsGonderebilir(tesisid:number)
      {
        let url=this.semUrl+"/Anket/GetTesisSmsGonderebilir?TesisId="+tesisid+"&Token="+ this.kullsrc.token;
        return await this.http.get<Result<number>>(url).pipe( map((res:any)=> res));
      }

      async OdemeSonrasiAidatTahakkuk(SozlesmeId:number):Promise<ReturnValues>  {
        const headers = new HttpHeaders(
          {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Headers': 'Content-Type',
         }
        );
      
          let options = { headers: headers };
      
          const body =  JSON.stringify({ 
            "SozlesmeId":  SozlesmeId,  
            "Token":this.kullsrc.token,
          });
      
        var result = await this.http.post<any>(this.semUrl+"/Anket/OdemeSonrasiAidatTahakkuk", body, options).toPromise();
      
        var sonuc = JSON.parse(JSON.stringify(result))['Model'];
        return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
      }

      async TopluSozlesmeNoBirlestir(List:OnKayit[],AnaSozlesmeId:number):Promise<ReturnValues>  {
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
            "AnaSozlesmeId":  AnaSozlesmeId,  
            "Token":this.kullsrc.token,
          });
      
        var result = await this.http.post<any>(this.semUrl+"/Anket/TopluSozlesmeNoBirlestir", body, options).toPromise();
      
        var sonuc = JSON.parse(JSON.stringify(result))['Model'];
        return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
      }

      async UyeVIPGuncelle(List:OnKayit[]):Promise<ReturnValues>  {
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
          });
      
        var result = await this.http.post<any>(this.semUrl+"/Anket/UyeVIPGuncelle", body, options).toPromise();
      
        var sonuc = JSON.parse(JSON.stringify(result))['Model'];
        return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
      }

      async SmsTahsilEkle(Data:SmsTahsilModel,Tip:IslemTipi):Promise<ReturnValues>  {
        const headers = new HttpHeaders(
          {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Headers': 'Content-Type',
         }
        );
      
          let options = { headers: headers };
      
          const body =  JSON.stringify({
            "Data":  Data,  
            "Tip":  Tip,   
            "Token":this.kullsrc.token,
          });
      
        var result = await this.http.post<any>(this.semUrl+"/Anket/SmsTahsilEkle", body, options).toPromise();
      
        var sonuc = JSON.parse(JSON.stringify(result))['Model'];
        return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
      }

      async GetSmsTahsil(id:number,sozlesmeid:number)
      {
        let url=this.semUrl+"/Anket/GetSmsTahsil?DocEntry="+id+"&SozlesmeId="+ sozlesmeid+"&Token="+ this.kullsrc.token;
        return await this.http.get<Result<SmsTahsilModel[]>>(url).pipe( map((res:any)=> res));
      }

      async UyeKampanyaSmsGonder(List:OnKayit[],Data:UyeKampanyaModel,Tip:IslemTipi):Promise<ReturnValues>  {
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
            "Data":  Data, 
            "Tip":  Tip, 
            "Token":this.kullsrc.token,
          });

        var result = await this.http.post<any>(this.semUrl+"/Anket/UyeKampanyaSmsGonder", body, options).toPromise();

        var sonuc = JSON.parse(JSON.stringify(result))['Model'];
        return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
  }

  async GetUyeKampanyaSms(id:number,sozlesmeid:number)
  {
   let url=this.semUrl+"/Anket/GetUyeKampanyaSms?DocEntry="+id+"&SozlesmeId="+ sozlesmeid+"&Token="+ this.kullsrc.token;
   return await this.http.get<Result<UyeKampanyaSmsModel[]>>(url).pipe( map((res:any)=> res));
  }

  async GetAnlikData(baslangic:Date,bitis:Date)
    {
        let url=this.semUrl+"/Anket/GetAnlikData?Baslangic="+moment(baslangic).format("yyyy-MM-DD")+"&Bitis="+moment(bitis).format("yyyy-MM-DD")+"&Token="+ this.kullsrc.token;
          return await this.http.get<Result<AnlikDataModel>>(url).pipe( map((res:any)=> res));
 }

 async GetAnlikDataKonaklama(baslangic:Date,bitis:Date)
    {
        let url=this.semUrl+"/Anket/GetAnlikDataKonaklama?Baslangic="+moment(baslangic).format("yyyy-MM-DD")+"&Bitis="+moment(bitis).format("yyyy-MM-DD")+"&Token="+ this.kullsrc.token;
          return await this.http.get<Result<AnlikDataModel>>(url).pipe( map((res:any)=> res));
 }

}

export class AnlikDataModel{
  AcenteID: number = 0;
  Acente: string="";
  Up: number = 0;
  Kisi: number = 0;
  Satis: number = 0; 
  Volume: number = 0; 
  Nakit: number = 0; 
  KrediKarti: number = 0; 
  Banka: number = 0; 
  Toplam: number = 0; 
  Konaklama: number = 0; 
  Parametre: number = 0; 
  VolMonOran: number = 0; 
  UpDealOran: number = 0; 
}    
export class UyeKampanyaSmsModel{
  DocEntry: number = 0;
  SozlesmeId: number = 0;
  KampanyaId: number = 0;
  Kampanya: string="";
  DurumId: number = 0;
  Durum: string="";
  KullanimTarih: any;
  GecerlilikTarih: any;
  Tckn: string="";
  KampanyaKodu: string=""; 
  KampanyaMesaj: string=""; 
  Telefon: string=""; 
  
  EkleyenId: number = 0;
  Ekleyen: string=""; 
  Kayit:any;
  TelefonId: number = 0;
}    

export class SmsTahsilModel{
  DocEntry: number = 0;
  OdemeTipId: number = 0;
  OdemeTip: string="";
  SozlesmeId: number = 0;
  Tarih: any;
  Tutar: number = 0;
  Kod: string=""; 
  Aciklama: string=""; 
  DurumId: number = 0;
  EkleyenId: number = 0;
  Ekleyen: string=""; 
  Kayit:any;
  TelefonId: number = 0;
  Telefon: string="";
}
export class SozlesmeDtMesajModel{
  DocEntry: number = 0;
  TalepId: number = 0;
  Mesaj: string="";
  EkleyenId: number = 0;
  Ekleyen: string=""; 
  Kayit:any;
}
export class SNT_RCI_TALEPLER{
  DocEntry: number = 0;  
  SozlesmeNo: string="";  
  Soyad: string="";  
  SoyadC:number = 0;  
  Adi: string="";  
  AdiC:number = 0;  
  Soyad2: string="";  
  Soyad2C:number = 0;  
  Adi2: string="";  
  Adi2C:number = 0;  
  Adres1: string="";  
  Adres1C:number = 0; 
  Adres2: string="";  
  Adres2C:number = 0; 
  Adres3: string="";  
  Adres3C:number = 0; 
  Sehir: string="";  
  SehirC:number = 0; 
  PostaKodu: string="";  
  PostaKoduC:number = 0; 
  Ulke: string="";  
  UlkeC:number = 0; 
  EvTel: string="";  
  EvTelC:number = 0; 
  IsTel: string="";  
  IsTelC:number = 0; 
  Telefon: string="";  
  TelefonC:number = 0; 
  Email: string="";   
  Language: string="";   
  ResortId: string="";  
  UyelikTarih:number = 0; 
  Sınıf: string="";  
  Unite: string="";   
  IntervalHaftasi: string="";   
  Sezon: string="";  
  HaftaSayi:number = 0;  
  OI: string="";  
  BRKodu: string="";  
  MPKodu: string="";  
  Mesaj1: string="";  
  Mesaj2: string="";  
  Mesaj3: string="";  
  Personel: string="";  
  UyelikOnay: string="";  
  UyelikNo: string="";  
  UyelikOnayTarih: any;  
  Basvuru: string=""; 
  BasvuruTarih: any;  
  Ekleyen: string=""; 
  Guncelleyen: string=""; 
  SozlesmeId:number=0;
  HaftaId:number=0;
  HaftaBilgi:string=""; 
  UyelikTurId:number=0;
  UyelikTur:string=""; 
  UyelikSure:number=0;
  validkey:string=""; 
  Daire:string="";  
  Tckn:string="";  
}

export class SNT_SANTRAL_DAHILI{
  exten:string=""; 
  caller_id:string=""; 
  extenprm:string=""; 
}

export class SantraSubeModel{
  FirmaId:string=""; 
  FirmaAdi:string=""; 
}

export class NtxSesKayitModel{
  idx:number=0; 
  Tarih:any; 
  CagriTipi:string=""; 
  CagriDurum:string=""; 
  Telefon:string=""; 
  Sure:string=""; 
  DisHat:string=""; 
  DishatAdi:string=""; 
  CallId:string="";
}

export class NtxSantralDashBoardSayiModel {
  X_SUBE:string=""; 
  X_TOPLAM:number=0; 
  X_TOPLAM_TEKIL:number=0; 
  X_KAYIP:number=0; 
  X_KAYIP2:number=0; 
  X_KAYIPTOPLAM:number=0; 
  X_TOPLAM_SURE:string="";
  X_BASARILI_SURE:string="";
  X_BASARISIZ_SURE:string="";
  X_KUYRUK_SURE:string="";
  X_ARAMA_ORAN:number=0; 
  X_BASARISIZ:number=0; 
  X_BASARILI:number=0; 
}
export class SantralCagriIstatistikModel {
  X_SUBE:string=""; 
  X_DAHILI:string="";
  X_TOPLAM:number=0; 
  X_BASARILI:number=0; 
  X_BASARISIZ:number=0; 
}
export class SantralOnlineUserModel {
  Durum:string=""; 
  Durum2:string=""; 
  DahiliAdi:string="";
  DurumAciklama:string=""; 
  MolaSure:string=""; 
}
export class X_CANLI_CAGRILAR {
  ID:number=0; 
  X_DURUM:string="";
  X_DAHILI:string="";
  X_TARIH:any;
  X_KUYRUK:string="";
  X_SURE:string="";
  X_TIPI:string="";
  X_ARAYAN:string="";
  X_HAT:string="";
  X_SUBE:string="";
  X_PARAMETRE:string="";
  X_PARAMETRE2:string="";
  X_PARAMETRE3:string="";
  X_DAHILINO:string="";
  X_PEER:string="";
  X_STATE:number=0; 
  X_DISHATADI:string="";
}
export class CagriBilinmeyenModel {
  DocEntry:number=0; 
  Telefon:string="";
  Adi:string="";
  Aciklama:string=""; 
  CallId:string="";
  Arayan:string="";
  CrmOzelNot:string="";
  CrmKonuId:number=0;
  CrmKonu:string="";
  CrmBaiId:number=0;
  CrmBai:string="";
  CrmUyeTipiId:number=0;
  CrmUyeTipi:string="";
  CrmDurumId:number=0;
  CrmDurum:string="";
  CrmCagriSonucId:number=0;
  CrmCagriSonuc:string="";
  CrmTahsilatTutar:number=0;
  CrmGorusmeTipi:number=0;
  DinlemeYapabilir:number=0;
  SantralGorusmeSure:number=0;
  CevapsizId:number=0;
}
export class DTS_CEVAPSIZ_CAGRILAR{
  Id: number = 0;  
  Sube: string="";  
  Tarih:any;
  Telefon:string="";  
  SozlesmeId: number = 0;  
  SozlesmeNo: string="";    
  SozlesmeDurum: string="";    
  Adi: string="";    
  SatisTarih: any;  
  Tesis: string="";
  Acente:string="";
  Kick:string="";
  Cash:string="";
  SorumluBirim:number = 0;  
  SorumluBirimStr:string="";
  VipUye:string="";
  AtayanId:number = 0;  
  Atayan:string="";
  AtananId:number = 0;  
  Atanan:string="";
  AtamaTarih:any;  
  AramaDurum:number = 0;  
  AramaTarih:any; 
  AramaNotu:string="";
  DisHat:string="";
  DisHatAdi:string="";
  Kuyruk:string="";
  Ivr:string="";
  CevapsizDurum:string="";
  KayitTarihi:any; 
}

export class DevreTatilKayitModel{
  DocEntry: number = 0; 
  SozlesmeId: number = 0;
  Adi:string="";
  Telefon:string="";
  Tckn:string="";
  SozlesmeNo:string="";
  Adres:string="";
  TalepTesisId: number = 0;
  TalepTesis: string=""; 
  TalepTarih1: any;
  TalepTarih2: any;
  TalepTarih3: any; 
  AidatOdemeDurumId: number = 0;
  SecilenMaddeId: number = 0;
  DonemId: number = 0;
  Kaynak: number = 0;
  KvkkOnay: boolean = false;
  RezervasyonConfirm: boolean = false;
  MarketingConfirm: boolean = false; 
  TalepAciklama: string="";  
  RezervasyonId: number = 0;
  RezAramaTarih: string=""; 
  RezAramaNot: string=""; 
  RezSonArayanId: number = 0; 
  RezSonArayan: string=""; 
  RezervasyonTipId: number = 0;  
  RezervasyonTip: string=""; 
  BelgeEklendi:number=0; 
  OnSozlesmeOnay:number=0;

  EkleyenId: number = 0;
  Ekleyen: string = '';
  GuncelleyenId: number = 0;
  Guncelleyen: string = '';
  Kayit: Date = new Date();
  Guncelleme: Date = new Date(); 

  RezTarih:any;
  SonAciklama:string = '';
  RezTesisId:number=0;
  RezTesis:string = '';
  RezEkleyen:string = '';
  RezGunTatil:number=0; 
  YemekUcretli:number=0; 
}


export class SanalPosOdemeBekleyenModel{
  SozlesmeId: number = 0;  
  TahsilatEkran: string="";  
  KalanToplam:number=0;
  TahsilatTutar:number=0;
  VadeIlk: any; 
  VadeSon: any;  
  Secili: boolean=false; 
  SatirId:string="";
  SozlesmeNo:string="";
}

export class YemekhaneKisi{
  Id: number = 0; 
  BagliPersonelId: number = 0; 
  BagliPersonel: string=""; 
  TcKimlik: string=""; 
  Adi: string=""; 
  Tip:number=0;
  TipStr: string=""; 
  OzelNot: string=""; 
  
  KayıtTarihi: any;
  GuncellemeTarihi: any;
  Ekleyen: number = 0;
  EkleyenStr: string = "";
  Guncelleyen: number = 0;
  GuncelleyenStr: string = "";
}

export class YemekhaneCostModel{
  Id: number = 0; 
  Tipi: number = 0; 
  EmpId:number=0;
  TesisId:number=0; 
  Tesis: string=""; 
  TcKimlik: string=""; 
  Adi: string=""; 
  Gorevi: string=""; 
  Departmanı: string=""; 
  Yetkilisi: string=""; 
  Ekip: string=""; 
  Adet: number = 0;  
  Tarih:any;
}

export class SozlesmeTopluDurumModel{
  DocEntry: number = 0; 
  
  SozlesmeNo: string=""; 
  SozlesmeId: number = 0;
  EslesmeDurumId: number = 0;
  EslesmeDurum: string=""; 
  DurumId: number = 0; 
  Aciklama: string="";  

  Kayit: any;
  Guncelleme: any;
  EkleyenId: number = 0;
  Ekleyen: string = "";
  GuncelleyenId: number = 0;
  Guncelleyen: string = "";

  AdSoyad: string = "";
  Tckn: string = "";
  Telefon: string = "";
  SorumluBirim: string = "";
  SorumluBirimId: number = 0;

}

export class SmsEntegrasyonModel{
  DocEntry: number = 0; 
  SozlesmeId: number = 0;
  Tarih: any;
  GirisiTarih: any;
  CikisTarih: any;
  TarihStr: string=""; 
  DonemId: number = 0;
  Donem: string=""; 
  TalepHaftaId: number = 0;
  TalepHafta: string=""; 
  RezervasyonId: number = 0;
  RezAramaTarih: string=""; 
  RezAramaNot: string=""; 
  RezSonArayanId: number = 0; 
  RezSonArayan: string=""; 
  TesisId: number = 0;
  TesisAdi: string=""; 
  SmsKod: string=""; 
  SmsDurum: number = 0;
  SmsDurumStr: string=""; 
  SmsUrl: string=""; 
  SmsCode: string=""; 
  SmsCodeDurum: number = 0;
  Email: string=""; 
  SmsContent: string=""; 
  SmsFirmaId: number = 0;
  ApiUrl: string=""; 
  SmsTip: number = 0;
  SmsTipAciklama: string=""; 
  Adi: string=""; 
  SozlesmeNo: string=""; 
  Telefon: string=""; 
  Adres: string=""; 
  SmsGonderen: string=""; 
  BelgeEklendi:number=0;

  EkleyenId: number = 0;
  Ekleyen: string = '';
  GuncelleyenId: number = 0;
  Guncelleyen: string = '';
  OtorizeVerenId: number = 0;
  OtorizeVeren: string = '';
  Kayit: Date = new Date();
  Guncelleme: Date = new Date(); 
  OnSozlesmeOnay:number=0;

  RezTarih:any;
  SonAciklama:string = '';
  RezTesisId:number=0;
  RezTesis:string = '';
  RezEkleyen:string = '';
  RezGunTatil:number=0;
  YemekUcretli:number=0;

}
export class SozlesmeDtKullaniciModel{
  DocEntry: number = 0; 
  TalepId: number = 0;
  KullaniciId: number = 0;
  Kullanici: string=""; 
  Ekleyen: number = 0;
  EkleyenAd: string = '';
  Guncelleyen: number = 0;
  GuncelleyenAd: string = '';
  Kayit: Date = new Date();
  Guncelleme: Date = new Date(); 
}
export class FuPrimHesapKontrol{
  Hesaplandi:number=0;
  PrimDurum:number=0;
}

export class FuSpiffButceModel{
  Id:number=0;
  DonemId:number=0;
  AltDonemId:number=0;
  EmpId:number=0;
  Tckn:string=""; 
  Adi:string=""; 
  Manager:string=""; 
  Matrah: number = 0;  
  Hesaplanan: number = 0;  
  Hakedis: number = 0;  
  KullaniciTip: number = 0;  
}
export class FuOrtakModel{
  DocEntry:number=0;
  CagriId:number=0;
  OrtakId:number=0;
  Ortak:string=""; 
  Ekleyen: number = 0;  
  EkleyenAd:string="";  
  Kayit: any; 
}
export class KiymetliEvrakTakipModel{
  DocEntry:number=0;
  TakipId:number=0;
  Madde:string="";
  Aciklama:string="";
  TeslimAlindi:boolean=false;
  TeslimAlan:string="";
  
  Ekleyen: number = 0;  
  EkleyenAd:string=""; 
  Guncelleyen: number = 0;  
  GuncelleyenAd:string=""; 
  TeslimAlmaTarih: any;
  Kayit: any;
  Guncelleme: any;
}
export class UyeAtamaModel{
  DocEntry:number=0;
  SozlesmeId:number=0;
  SorumluId:number=0;
  Sorumlu:string="";
  AtananId:number=0;
  Atanan:string="";
  SorumluBirimId:number=0;
  SorumluBirim:string="";
  AtananSorumluBirimId:number=0;
  AtananSorumluBirim:string="";
  AtamaTarih: any;
  EkleyenId: number = 0;  
  Ekleyen:string=""; 
}
export class OdemeKapama{
  Tarih: any;
  SenetTutar: number = 0; 
  Tutar: number = 0; 
  Aciklama:string="";
  SozlesmeId: number = 0;
  KapamaId: number = 0;
  SenetId: number = 0; 
}
export class OtorizeSmsModel{
  DocEntry: number = 0;
  OtorizeVeren:string="";
  OtorizeVerenId: number = 0;
  DogurlamaKod: string="";
  DogralamaTarih: string="";
  Durum: string="";
  Dogrulandi: number = 0;
  AileOnay:number=0;
  KodGonderildi:number=0;
  OtorizeAciklama:string="";
}
export class UyeRezervasyonDetayModel{
  DocEntry: number = 0;
  SozlesmeId: number = 0;
  RezervasyonId: number = 0;
  Tarih: any;
  GirisTarih: any;
  CikisTarih: any;
  KisiSayisi: number = 0;
  KullanilanGun: number = 0;
  KalanGun:number = 0;
  Aciklama: string="";
  DurumId: number = 0;
  Durum: string="";
  YemekUcreti: number = 0;
  Ekleyen: number = 0;
  EkleyenAd: string = '';
  Guncelleyen: number = 0;
  GuncelleyenAd: string = '';
  Kayit: Date = new Date();
  Guncelleme: Date = new Date();

  Yil: number = 0;
  AidatId: number = 0;
  RezervasyonTipId: number = 0;
  RezervasyonTip: string="";
  ToplamGun: number = 0;
  TesisId: number = 0;
  SonAciklama: string="";
  YemekUcretli:number=0;
  YemekTahsilat:number=0;
  YemekKalan:number=0;
  Adi:string=""
  SozlesmeNo:string=""
  SatisTuru:number = 0;
  SatisTuruStr:string=""
  SozlParaBirim:string="";
  Acente:string=""
  Tesis:string=""
  Donem:string=""
  Hafta:string=""
  OnSozlesmeOnay:number = 0;
  DurumAciklama:string=""
  OdaNo:string=""
  OdaTipId:number = 0;
  OdaTip:string=""
}
export class UyeRezervasyonModel{
  DocEntry: number = 0;
  SozlesmeId: number = 0;
  Tarih: any;
  GirisTarih:any;
  CikisTarih:any;
  Yil: number = 0;
  AidatId: number = 0;
  RezervasyonTipId: number = 0;
  RezervasyonTip: string="";
  ToplamGun: number = 0;
  KullanilanGun: number = 0;
  RezervasyonGun: number = 0;
  KalanGun: number = 0;
  Durum: number = 0;
  TesisId: number = 0;
  SonAciklama: string="";
  Ekleyen: number = 0;
  EkleyenAd: string = '';
  Guncelleyen: number = 0;
  GuncelleyenAd: string = '';
  Kayit: Date = new Date();
  Guncelleme: Date = new Date();
  YemekUcretli:number=0;
  YemekUcreti:number=0;
  YemekTahsilat:number=0;
  YemekKalan:number=0;
  KisiSayisi:number=0;
  SmsGonderilsinmi:string="";

  Adi:string=""
  SozlesmeNo:string=""
  SatisTuru:number = 0;
  SatisTuruStr:string=""
  SozlParaBirim:string="";
  Acente:string=""
  Tesis:string=""
  Donem:string=""
  Hafta:string=""
}
export class CrmSmsModel{
  DocEntry: number = 0;
  SozlesmeId: number = 0;
  SmsBilgiId: number = 0;
  SmsBilgi: string="";
  SmsTelefonId: number = 0;
  SmsTelefon: string="";
  SmsTarih:any;
  SmsSaat:any;

  Ekleyen: number = 0;
  EkleyenAd: string="";
  Kayit: Date = new Date();
}
export class CrmSikayetModel{
  DocEntry: number = 0;
  SozlesmeId: number = 0;
  Sikayet: string="";
  SmsTelefonId: number = 0;
  SmsTelefon: string="";
  DogurlamaKod: string="";
  DogralamaTarih: string="";
  Durum: string="";
  Dogrulandi: number = 0;

  Ekleyen: number = 0;
  EkleyenAd: string="";
  Kayit: Date = new Date();
  Guncelleme: Date = new Date();
}
export class SozlesmeDtModel{
  DocEntry: number = 0;
  semkey: string="";
  SozlesmeId: number = 0;
  Aciklama: string="";
  Cevap: string="";
  DurumId: number = 0;
  Durum: string="";
  Aktif:boolean=false;
  OnaylayanId: number = 0;
  OnaylayanAd: string = '';
  OnayTarih: Date = new Date();
  Ekleyen: number = 0;
  EkleyenAd: string = '';
  Guncelleyen: number = 0;
  GuncelleyenAd: string = '';
  Kayit: Date = new Date();
  Guncelleme: Date = new Date();
  OnayDurumStr:string=""
  Adi:string=""
  SozlesmeNo:string=""
  SatisTuru:number = 0;
  SatisTuruStr:string=""
  SozlParaBirim:string="";
  Acente:string=""
  Tesis:string=""
  Donem:string=""
  Hafta:string=""
  SorumluBirimId:number=0;
  SorumluBirim:string="";
  AtananKullaniciId:number=0;
  AtananKullanici:string="";
}
export class FinansIadeModel{
  DocEntry: number = 0;
  KickId: number = 0;
  TakipId: number = 0;
  SozlesmeId: number = 0;
  Bolum: number = 0;
  semkey:string="";
  OdemeVade!: Date;
  OdemeTarih!: Date;
  BolumStr:string="";
  OdemeYontemId: number = 0;
  OdemeTurId: number = 0;
  IslemBirimId : number = 0;
  HesapKodu:string="";
  HesapAdi:string="";
  KasaAktarimId: number = 0;
  HesapId: number = 0;
  Birim:string="";
  ParaBirim:string="";
  KrediKartNo:string="";
  Aciklama:string="";
  Kur: number = 0;
  Tutar: number = 0;
  OdemeYapilanTuar: number = 0;
  KalanOdeme: number = 0; 
  KalanTutar: number = 0;
  KickTutar: number = 0;
  IadeTutar: number = 0;
  AktarilacakTutar: number = 0;
  OdenenToplam: number = 0;
  OdemeToplam: number = 0;
  MasrafTutar: number = 0;
  ToplamIade: number = 0;
  KickOran: number = 0;
  OnayDurumStr:string=""
  Adi:string=""
  SozlesmeNo:string=""
  SatisTuru:number = 0;
  SatisTuruStr:string=""
  SozlParaBirim:string="";
  Acente:string=""
  Tesis:string=""
  Donem:string=""
  Hafta:string=""
  SozlesmeTutar:number = 0;
  TekCift:number = 0;
  TekCiftStr:string=""
  Durum:number = 0;
  DurumStr:string="";
  Tckn:string=""
  Aktif:boolean=false;
  Ekleyen: number = 0;
  EkleyenAd: string = '';
  Guncelleyen: number = 0;
  GuncelleyenAd: string = '';
  Kayit: Date = new Date();
  Guncelleme: Date = new Date();
  KickTarih:any;
  AktarimTipi: number =0;
  PrimDurum: number =0;
  OdemeOnayDurum: number =0;
  OdemeOnayAciklama: string="";
  BelgeEklendi: number =0;
  OdemeOnaylayanId: number =0;
  OdemeOnaylayan: string="";
  OdemeOnaylayanTarih: number =0;
}
export class KickModel{
  Code: number = 0;
  SozlesmeId: number = 0;
  KickIslemId:number=0;
  KickIslem:string="";
  semkey:string="";
  OnayDurum: string="";
  OnaylayanId: number = 0;
  Onaylayan: string="";
  OnayTarih!: Date;
  Tutar: number = 0;
  KalanOdeme: number = 0;
  KalanTutar: number = 0;
  KickTutar: number = 0;
  IcerideKalan: number = 0;
  IadeTutar: number = 0;
  OdenenToplam: number = 0;
  OdemeToplam: number = 0;
  MasrafTutar: number = 0;
  KickOran: number = 0;
  Aciklama:string="";
  OnayAciklama:string="";
  OnayDurumStr:string=""
  Adi:string=""
  SozlesmeNo:string=""
  SatisTuru:number = 0;
  SatisTuruStr:string=""
  SozlParaBirim:string="";
  Acente:string=""
  Tesis:string=""
  Donem:string=""
  Hafta:string=""
  SozlesmeTutar:number = 0;
  TekCift:number = 0;
  TekCiftStr:string=""
  DurumId:number = 0;
  DurumStr:string=""
  OnaySatirId:number = 0;
  Sira:number = 0;
  AsamaId:number = 0;
  OnayId:number = 0;
  Onaylayacak:string=""

  Aktif:boolean=false;
  Ekleyen: number = 0;
  EkleyenAd: string = '';
  Guncelleyen: number = 0;
  GuncelleyenAd: string = '';
  Kayit: any;
  Guncelleme: Date = new Date();
}
export class KickDetayModel{
  Code: number = 0;
  KickId: number = 0;
  SozlesmeId: number = 0;
  Taksitli: number = 0;
  OdemeVade!: Date;
  semkey:string="";
  OdemeYontemId: number = 0;
  HesapKodu:string="";
  HesapAdi:string="";
  KasaAktarimId: number = 0;
  HesapId: number = 0;
  Birim:string="";
  ParaBirim:string="";
  KrediKartNo:string="";
  Aciklama:string="";
  Kur: number = 0;
  Tutar: number = 0;
  Aktif:boolean=false;
  Ekleyen: number = 0;
  EkleyenAd: string = '';
  Guncelleyen: number = 0;
  GuncelleyenAd: string = '';
  Kayit: Date = new Date();
  Guncelleme: Date = new Date();
}
export class SozlesmeOdemeModel{
  DocEntry: number = 0;
  SozlesmeId: number = 0;
  semkey: string="";
  Name: string="";
  OdemeYontemId: number = 0;
  OdemeTuruId: number = 0;
  OdemeTuru:string="";
  HesapId:number=0;
  Birim:string="";
  HesapKodu:string="";
  HesapAdi:string="";
  KasaAktarimId:number = 0;
  KrediKartNo:string="";
  Aciklama:string="";
  Kur: number = 0;
  Tutar: number = 0;
  ParaBirim:string="TRY";
  Ekran:number=0;
  Ekleyen: number = 0;
  EkleyenAd: string = '';
  Guncelleyen: number = 0;
  GuncelleyenAd: string = '';
  Kayit: Date = new Date();
  Guncelleme: Date = new Date();
}
export class CashModel{
  Code: number = 0;
  SozlesmeId: number = 0;
  semkey:string="";
  OnayDurum: string="";
  OnaylayanId: number = 0;
  Onaylayan: string="";
  OnayTarih!: Date;
  Tutar: number = 0;
  KalanOdeme: number = 0;
  KalanTutar: number = 0;
  CashTutar: number = 0;
  IndirimOran: number = 0;
  OdemeToplam: number = 0;
  Tutar75: number = 0;
  Parcali:boolean=false;
  CashOran: number = 0;
  Aciklama:string="";
  OnayDurumStr:string=""
  Adi:string=""
  SozlesmeNo:string=""
  SatisTuru:number = 0;
  SatisTuruStr:string=""
  SozlParaBirim:string="";
  Acente:string=""
  Tesis:string=""
  Donem:string=""
  Hafta:string=""
  SozlesmeTutar:number = 0;

  Aktif:boolean=false;
  Ekleyen: number = 0;
  EkleyenAd: string = '';
  Guncelleyen: number = 0;
  GuncelleyenAd: string = '';
  Kayit: Date = new Date();
  Guncelleme: Date = new Date();
}
export class CashDetayModel{
  Code: number = 0;
  CashId: number = 0;
  SozlesmeId: number = 0;
  Senetmi: number = 0;
  OdemeVade:any;
  semkey:string="";
  OdemeYontemId: number = 0;
  OdemeTurId: number = 0;
  HesapKodu:string="";
  HesapAdi:string="";
  KasaAktarimId: number = 0;
  HesapId: number = 0;
  Birim:string="";
  ParaBirim:string="";
  KrediKartNo:string="";
  Aciklama:string="";
  Kur: number = 0;
  Tutar: number = 0; 
  SirketId: number = 0; 
  Aktif:boolean=false;
  Ekleyen: number = 0;
  EkleyenAd: string = '';
  Guncelleyen: number = 0;
  GuncelleyenAd: string = '';
  Kayit: Date = new Date();
  Guncelleme: Date = new Date();
}
export class TahsilatModel{
  SozlesmeId: number = 0;
  SenetTahsilTarih:any;
  IslemBirimId: number = 0;
  OdemeTuruId: number = 0;
  DetayAciklamaId: number = 0;
  HesapId: number = 0;
  Tutar: number = 0;
  SenetTutar: number = 0;
  Birim:string="";
  SirketId:number=0;
  Aciklama:string="";
  SurecId:number=0; 
  AltSurecId:number=0;  
  DepartmanId:number=0;   
  DonemId:number=0;   
  AltDonemId:number=0;    
  BorcAlacak:string="";
  TalepId:number=0;  
  ManagerId:number=0;  
  BakiyeHesapId:number=0;
  KrediKartNo:string="";
  TesisId:number=0;
  ParaBirim:string="";
}
export class UyeSozlesmeDurumModel{
  DocEntry: number = 0;
  AdSoyad: string="";
  SozlesmeId: number = 0;
  EvrakTarih: any;
  SozlesmeNoStr:string="";
  Prim:number=0;
  semkey: string="";
  Tip: number = 0;
  TipStr: string="";
  Aciklama: string="";

  Aktif:boolean=false;
  Ekleyen: number = 0;
  EkleyenAd: string = '';
  Guncelleyen: number = 0;
  GuncelleyenAd: string = '';
  Kayit: Date = new Date();
  Guncelleme: Date = new Date();
}
export class UyeTaahhutOzelDurumModel{
  Ekran: string="";
  SozlesmeNo: number = 0;
  semkey: string="";
  Code: number = 0;
  IslemId: number = 0;
  Yazdirildi: string="";
  Aciklama: string="";
  Baslik: string="";
  OtorizeVerenId: number = 0;
  OtorizeVeren: string="";
  Tarih: Date = new Date();
  SozlesmeNoStr:string="";
  Aktif:boolean=false;
  Ekleyen: number = 0;
  EkleyenAd: string = '';
  Guncelleyen: number = 0;
  GuncelleyenAd: string = '';
  Kayit: Date = new Date();
  Guncelleme: Date = new Date();
}
export class UyeRCIDetayModel{
  DocEntry: number = 0;
  SozlesmeId: number = 0;
  RciId: number = 0;
  Yil: number = 0;
  HaftaId: number = 0;
  HaftaBilgi: string="";
  Durum: string="";
  HaftaAdi: string="";
  DepozitId: number = 0;
  Depozit: string="";
  Daire: string="";
  Aciklama: string="";
  Aktif:boolean=false;
  Ekleyen: number = 0;
  EkleyenAd: string = '';
  Guncelleyen: number = 0;
  GuncelleyenAd: string = '';
  Kayit: Date = new Date();
  Guncelleme: Date = new Date();
}
export class UyeRCIModel{
  DocEntry: number = 0;
  SozlesmeId: number = 0;
  validkey: string="";
  HaftaId: number = 0;
  HaftaBilgi: string="";
  Basvuru: string="";
  BasvuruTarih: any;
  UyelikOnay: string="";
  UyelikOnayTarih: any;
  UyelikNo: string = '';
  UyelikTurId: number = 0;
  UyelikTur:string="";
  UyelikSure: number = 0;
  Daire:string="";
  Email:string="";
  Tckn:string="";
  SozlesmeNo:string="";
  Aktif:boolean=false;
  Ekleyen: number = 0;
  EkleyenAd: string = '';
  Guncelleyen: number = 0;
  GuncelleyenAd: string = '';
  Kayit: Date = new Date();
  Guncelleme: Date = new Date();
}
export class UyeSertifikaModel{
  Code: number = 0;
  validkey: string="";
  SozlesmeId: number = 0;
  SerDaire: string="";
  UyeTckn: string="";
  SerHaftaId: number = 0;
  SerSirketOdenen: number = 0;
  SerMuracat: string="";
  SerMuracatTarih!: Date;
  SerTeslimAlindimi: string="";
  SerTeslimAlindiTarih!: Date
  SerMusteriTeslim: string="";
  SerMusteriTeslimTarih:any;
  TapuId: number = 0;
  TapuNo: string="";
  TapuVekalet: string="";
  TapuVekaletTarih!: Date
  TapuTeslim: string="";
  TapuTeslimTarih!: Date
  TapuAdaNo: number = 0;
  TapuParselNo: number = 0;
  HediyeTarihBas!: Date
  HediyeTarihBit!: Date
  HediyeTesisId: number = 0;
  HediyeTesis: string="";
  HediyeOdenen: number = 0;
  HediyeMusteriAlinan: number = 0;
  HediyeParaBirim: string="";
  DegisimMuracat: string="";
  DegisimMuracatTarih!: Date
  DegisimTeslim: string="";
  DegisimTeslimTarih!: Date
  Aktif:boolean=false;
  Ekleyen: number = 0;
  EkleyenAd: string = '';
  Guncelleyen: number = 0;
  GuncelleyenAd: string = '';
  Kayit: Date = new Date();
  Guncelleme: Date = new Date();
}
export class UyeOzelNotModel{
  DocEntry: number = 0;
  UyeTckn: string="";
  AdSoyad: string="";
  Tip: number = 0;
  SozlesmeId: number = 0;
  TipStr: string="";
  OzelNot: string="";
  Aktif:boolean=false;
  Ekleyen: number = 0;
  EkleyenAd: string = '';
  Guncelleyen: number = 0;
  GuncelleyenAd: string = '';
  Kayit: Date = new Date();
  Guncelleme: Date = new Date();
}
export class UyeTelefonModel{
  DocEntry: number = 0;
  SozlesmeId: number = 0;
  Baslik: string="";
  UlkeKodu: string="";
  UyeTckn: string="";
  AdSoyad: string="";
  Tip: number = 0;
  TipStr: string="";
  Telefon: string="";
  TelefonBase64: string="";
  TelefonGorunur: string="";
  Ekleyen: number = 0;
  Aktif:boolean=false;
  AktifTelefon: boolean=false;
  EkleyenAd: string = '';
  Guncelleyen: number = 0;
  GuncelleyenAd: string = '';
  Kayit: Date = new Date();
  Guncelleme: Date = new Date();
}
export class UyeAdresModel{
  DocEntry: number = 0;
  AdresBaslik: string="";
  UyeTckn: string="";
  AdSoyad: string="";
  Tip: number = 0;
  SozlesmeId: number = 0;
  TipStr: string="";
  Adres: string="";
  Sehir: string="";
  SehirAdi:string="";
  Ulke: string="";
  UlkeAdi: string="";
  AktifAdres:boolean=false;
  Aktif:boolean=false;
  Ekleyen: number = 0;
  EkleyenAd: string = '';
  Guncelleyen: number = 0;
  GuncelleyenAd: string = '';
  Kayit: Date = new Date();
  Guncelleme: Date = new Date();
}
export class SozlesmeOzelDurumModel{
  SozlesmeNo: number = 0;
  semkey: string="";
  DocEntry: number = 0;
  OzelDurumId: number = 0;
  Yazdirildi: string="";
  OzelDurumAciklama: string="";
  OzelDurum: string="";
  OtorizeVerenId: number = 0;
  OtorizeVeren: string="";
  Tarih: Date = new Date();
  SozlesmeNoStr:string="";
  Aktif:boolean=false;
  Ekleyen: number = 0;
  EkleyenAd: string = '';
  Guncelleyen: number = 0;
  GuncelleyenAd: string = '';
  Kayit: Date = new Date();
  Guncelleme: Date = new Date();
}
export class SozlesmeTaahhutModel{
  SozlesmeNo: number = 0;
  semkey: string="";
  DocEntry: number = 0;
  TaahhutId: number = 0;
  Yazdirildi: string="";
  TaahhutAciklama: string="";
  TaahhutBaslik: string="";
  Aktif:boolean=false;
  Ekleyen: number = 0;
  EkleyenAd: string = '';
  Guncelleyen: number = 0;
  GuncelleyenAd: string = '';
  Kayit: Date = new Date();
  Guncelleme: Date = new Date();
}
export class SozlesmeSenetModel{
  SozlesmeNo: number = 0;
  semkey: string="";
  DocEntry: number = 0;
  SenetNo: number = 0;
  Vade: any;
  Tutar: number = 0;
  Yaziyla:string="";
  AdSoyad:string="";
  Odenen:number = 0;
  OdenenSenet:number = 0;
  OdenenSenetKapatma:number = 0;
  Kalan:number = 0;
  KargoyaVerildi:number = 0;
  KargoAciklama:string="";
  KargoTarih:any;
  KargoyaVerenId:number = 0;
  KargoyaVeren:string="";
  KargoVerilenTarih!:Date;
  KargorFirma:string="";
  KargoTakipNo:string="";
  GecikmeGun:number = 0;
  KargoFirmaId:number = 0;
  Durum:string="B";
  DurumStr:string="";
  Aciklama:string="";
  GonderimTip:number = 0;
  GonderimTipStr:string="";
  TeslimEdilenKullaniciId:number = 0;
  TeslimEdilenKullanici:string="";
  Aktif:boolean=false;
  Ekleyen: number = 0;
  EkleyenAd: string = '';
  Guncelleyen: number = 0;
  GuncelleyenAd: string = '';
  Kayit: Date = new Date();
  Guncelleme: Date = new Date();
  SenetDurum:number = 0;
  SenetDurumStr:string="";
  SenetDurumBilgi:number=0;
  ParaBirim:string="";
  Degisti:boolean=false;
}
export class SozlesmeOrtakModel{
  SozlesmeNo: number = 0;
  semkey: string="";
  DocEntry: number = 0;
  Tckn:string="";
  DogumTarih: Date = new Date();
  AdSoyad:string="";
  BabaAdi:string="";
  Telefon:string="";
  Telefon2:string="";
  Adres:string="";
  Sehir:string="";
  SehirStr:string="";
  Ilce:string="";
  Ekleyen: number = 0;
  EkleyenAd: string = '';
  Guncelleyen: number = 0;
  GuncelleyenAd: string = '';
  Kayit: Date = new Date();
  Guncelleme: Date = new Date();
}
export class SozlesmeNoModel{
  SozlesmeNoSon:number = 0;
  SozlesmeNo: string = "";
  ProtokolNo:string="";
}
export class MolaSure {
  Code: number = 0;
  ManagerId:number = 0;
  EkranId:number = 0;
  Manager: string = '';
  MolaSureDakika: number = 0;
  MolaSayacDakika: number = 0;
  Ekleyen: number = 0;
  EkleyenAd: string = '';
  Guncelleyen: number = 0;
  GuncelleyenAd: string = '';
  Kayit: Date = new Date();
  Guncelleme: Date = new Date();
}
export class OnKayit {
semkey:string="";
Tarih:any;
DocEntry:number=0;
HavuzId:number=0;
HavuzLineId:number=0;
Adi: String="";
SozlAd: String="";
SozlSoyad: String="";
Telefon: String="";
Telefon1Ulke: String="";
Telefon2: String="";
Telefon2Ulke: String="";
Yas: number=0;
Gelir: number=0;
Cinsiyet: string="-";
MeslekId: number=0;
Meslek: String="";
SehirKod:string="00";
IlceKod:string="0";
Bolge:string="";
Il: String="";
Ilce:String="";
EkuriAdi:string="";
MedeniDurum:string="-";
Plaka:string="";
HesKodu:string="";
HesDurumu:number=0;
HesDurumuStr:string="";
Sms:string="";
EkleyenAd:string="";
Ekip:number=0;
Acente:string="";
TesisId:number=0;
Tesis:string="";
MeslekGrubu:string="";
EsGelir:number=0;
EsMeslekId:number=0;
EsYas:number=0;
UpSayi:number=0;
KisiSayisi:number=0;

OpcId:number=0;
OpcPrim:number=0;
OpcAcente:number=0;

OpcSupervisorId:number=0;
OpcSupervisorPrim:number=0;
OpcSupervisorAcente:number=0;

OpcManagerId:number=0;
OpcManagerPrim:number=0;
OpcManagerAcente:number=0;

ConfSupervisorId:number=0;
ConfSupervisorPrim:number=0;
ConfSupervisorAcente:number=0;

ConfManagerId:number=0;
ConfManagerPrim:number=0;
ConfManagerAcente:number=0;

ConfId:number=0;
ConfPrim:number=0;
ConfAcente:number=0;

UpKimdenId:number=0;
UpKimdenPrim:number=0;
UpKimdenAcente:number=0;

DanismanId:number=0;
DanismanPrim:number=0;
DanismanAcente:number=0;

Rep1Id:number=0;
Rep1Prim:number=0;
Rep1Acente:number=0;

Rep1YId:number=0;
Rep1YPrim:number=0;
Rep1YAcente:number=0;

To1Id:number=0;
To1Prim:number=0;
To1Acente:number=0;

To1YId:number=0;
To1YPrim:number=0;
To1YAcente:number=0;

Rep2Id:number=0;
Rep2Prim:number=0;
Rep2Acente:number=0;

Rep2YId:number=0;
Rep2YPrim:number=0;
Rep2YAcente:number=0;

To2Id:number=0;
To2Prim:number=0;
To2Acente:number=0;

To2YId:number=0;
To2YPrim:number=0;
To2YAcente:number=0;

Rep3Id:number=0;
Rep3Prim:number=0;
Rep3Acente:number=0;

Rep3YId:number=0;
Rep3YPrim:number=0;
Rep3YAcente:number=0;

To3Id:number=0;
To3Prim:number=0;
To3Acente:number=0;

To3YId:number=0;
To3YPrim:number=0;
To3YAcente:number=0;

LmaId:number=0;
LmaPrim:number=0;
LmaAcente:number=0;

Lma2Id:number=0;
Lma2Prim:number=0;
Lma2Acente:number=0;

Yuzde7KomId:number=0;
Yuzde7Prim:number=0;
Yuzde7Acente:number=0;

Yuzde5KomId:number=0;
Yuzde5Prim:number=0;
Yuzde5Acente:number=0;

Yuzde5Kom2Id:number=0;
Yuzde5Kom2Prim:number=0;
Yuzde5Kom2Acente:number=0;

BuYuzde3Id:number=0;
BuYuzde3Prim:number=0;
BuYuzde3Acente:number=0;

BuYuzde2Id:number=0;
BuYuzde2Prim:number=0;
BuYuzde2Acente:number=0;

BuId:number=0;
BuPrim:number=0;
BuAcente:number=0;

CrmPersonelId:number=0;
CrmPersonelPrim:number=0;
CrmPersonelAcente:number=0;

CrmAidatPersonelId:number=0;
CrmAidatPersonelPrim:number=0;
CrmAidatPersonelAcente:number=0;

CrmSupervisorId:number=0;
CrmSupervisorPrim:number=0;
CrmSupervisorAcente:number=0;

CrmManagerId:number=0;
CrmManagerPrim:number=0;
CrmManagerAcente:number=0;

TahsilatPersonelId:number=0;
TahsilatPersonelPrim:number=0;
TahsilatPersonelAcente:number=0;

TahsilatSupervisorId:number=0;
TahsilatSupervisorPrim:number=0;
TahsilatSupervisorAcente:number=0;

TahsilatManagerId:number=0;
TahsilatManagerPrim:number=0;
TahsilatManagerAcente:number=0;

FuPersonelId:number=0;
FuPersonelPrim:number=0;
FuPersonelAcente:number=0;

FuSupervisorId:number=0;
FuSupervisorPrim:number=0;
FuSupervisorAcente:number=0;

FuManagerId:number=0;
FuManagerPrim:number=0;
FuManagerAcente:number=0;

BuPrimPersonelId:number=0;
BuPersonelPrim:number=0;
BuPersonelAcente:number=0;

BuSupervisorId:number=0;
BuSupervisorPrim:number=0;
BuSupervisorAcente:number=0;

BuManagerId:number=0;
BuManagerPrim:number=0;
BuManagerAcente:number=0;

HukukPersonelId:number=0;
HukukPersonelPrim:number=0;
HukukPersonelAcente:number=0;

HukukSupervisorId:number=0;
HukukSupervisorPrim:number=0;
HukukSupervisorAcente:number=0;

HukukManagerId:number=0;
HukukManagerPrim:number=0;
HukukManagerAcente:number=0;

Conf:string="";
ConfSupervisor:string="";
ConfManager:string="";
Opc:string="";
OpcSupervisor:string="";
OpcManager:string="";
UpKimden:string="";
Danisman:string="";
Rep1:string="";
Rep1Y:string="";
To1:string="";
To1Y:string="";
Rep2:string="";
Rep2Y:string="";
To2:string="";
To2Y:string="";
Rep3:string="";
Rep3Y:string="";
To3:string="";
To3Y:string="";
Lma:string="";
Bu:string="";
BuYuzde2:string="";
BuYuzde3:string="";
Yuzde5Kom2:string="";
Lma2:string="";
Yuzde7Kom:string="";
Yuzde5Kom:string="";

CrmPersonel:string="";
CrmAidatPersonel:string="";
CrmSupervisor:string="";
CrmManager:string="";
TahsilatPersonel:string="";
TahsilatSupervisor:string="";
TahsilatManager:string="";
FuPersonel:string="";
FuSupervisor:string="";
FuManager :string="";
BuPersonel:string="";
BuPrimPersonel:string="";
BuSupervisor:string="";
BuManager:string="";
HukukPersonel:string="";
HukukSupervisor:string="";
HukukManager:string="";

Comments:number=0;
Wawe:number=0;
GelisDurumId:number=0;
GelisDurum:string="";
SeyahatTuruId:number=0;
UpTuruId:number=0;
KonaklamaGun:number=0;
AltEkipId:number=0;
AltEkip:string="";
EsAdSoyad:string="";
EsMeslek:string="";
CommentsStr:string="";
WaweStr:string="";
Durum:string="";
SeyahatTuru:string="";
UpTuru:string="";
OzelNot:string="";
BolgeId:number=0;
SirketId:number=0;
AileEklimi:string="";
SirketAdi:string="";
EvrakDurum:string="";
SatisTuru:number=0;
SatisTuruStr:string="";
Tckn:string="";
TcknDogrula:number=0;
BabaAdi:string="";
DogumTarih:any;
Adres:string="";
SozlesmeBirlestir:number=0;
SatisTarih:any;
SozlesmeNo:string="";
EskiSozlesmeNo:string="";
UpgradeSozlesmeNo:string="";
DonemId:number=0;
Donem:string="";
EbatId:number=0;
Ebat:string="";
HaftaSayi:number=0;
Hafta:string="";
HaftaId:number=0;

BuHak:number=0;
OnayDurum:string="";
SozlesmeDurum:number=0;
SozlesmeCalismaTip:number=0;
SozlesmeCalismaTipStr:string="";
SozlesmeNoForKey:number=0;
ValidKey:string="";
SozlProtokolNo:string="";
SozlesmeTutar:number=0;
ListeFiyat:number=0;
OdemeTipi:number=1;
OdemeTipiStr:string="";
Tutar:number=0;
Nakit:number=0;
KrediKarti:number=0;
Banka:number=0;
Kur:number=0;
SozlParaBirim:string="";
PosHesabi:string="";
PosHesabiStr:string="";
BankaHesasbi:string="";
BankaHesasbiStr:string="";
KrediKartNo:string="";
SozlesmeDurumId:number=0;
SozlesmeDurumStr:string="";
SenetAdedi:number=0;
SenetTutar:number=0;
SenetToplam:number=0;
SenetBolunen:number=0;
SenetFarki:number=0;
SenetSayisi:number=0;
SozlesmeKalan:number=0;
SenetVadeTarih:any;
SenetSonTarih:any;
OnSozlesmeBelge:number=0;
OnSozlesmeOnay:number=0;
OnSozlesmeOnayTarih:any;

Email:string="";
HisseId:number=0;
Hisse:string="";
ParselId:number=0;
Parsel:string="";
BagimsizBolumId:number=0;
BagimsizBolum:number=0;
TapuBedeli:number=0;
TapuBedeliIlave:number=0;
TapuGenelToplam:number=0;
TapuHarcBedeli:number=0; 
TapuHarc:number=0;
TapuSermaye:number=0;
TapuTarih:any;
TapuOdemeTuru:string="";
TapuOdemeTuruId:number=0;
TapuPosHesabi:string="";
TapuPosHesabiStr:string="";
TapuBankaHesasbi:string="";
TapuBankaHesasbiStr:string="";
TapuKrediKarti:string="";
DonemYil:number=0;
DonemAy:number=0;
TapuSiparisNo:number=0;
TapuKayitYapan:number=0;
TapuKayitTarih:Date=new  Date;
TapuDurum:number=0;
TapuDurumStr:string="";

TapuOdemeOnay:string="";
TapuOdemeOnaylayanId:number=0;
TapuOdemeOnaylayan:string="";
TapuOdemeOnayTarih:Date=new  Date;

CocukSayisi:number=0;
EvlilikTarih:string="";
Ulke:string="TR";
EhliyetNo:string="";
EsTckn:string="";
AracPlaka:string="";
AktifAdres:number=0;
AktifTelefon:number=0;
Refakatci:string="";
RefakatciTckn:string="";
Refakatci2:string="";
Refakatci2Tckn:string="";
EsDogumTarih:any;
Cash:string="H";
Kick:string="H";
OdemeYuzde:number=0;
KalanOdeme:number=0;
OdenenenTutar:number=0;
KalanAidatTutar:number=0;

TahsilatGorusmeNotu:string="";
TahsilatErtelemeTarih:Date=new  Date;
TahsilatSonAramaTarih:Date=new  Date;
TahsilatErtelemeSaat:Date=new  Date;
TahsilatSonArayanEmpId:number=0;
TahsilatKonusmaSuresi:number=0;
TahsilatAramaSayisi:number=0;
TahsilatAramaDurum:string="";
TahsilatAramaDurumStr:string="";
TahsilatAtamaTarih:Date=new  Date;

CrmGorusmeNotu:string="";
CrmErtelemeTarih:Date=new  Date;
CrmSonAramaTarih:Date=new  Date;
CrmErtelemeSaat:Date=new  Date;
CrmSonArayanEmpId:number=0;
CrmKonusmaSuresi:number=0;
CrmAramaSayisi:number=0;
CrmAramaDurum:string="";
CrmAramaDurumStr:string="";
CrmAtamaTarih:Date=new  Date;

CrmAidatGorusmeNotu:string="";
CrmAidatErtelemeTarih:Date=new  Date;
CrmAidatSonAramaTarih:Date=new  Date;
CrmAidatErtelemeSaat:Date=new  Date;
CrmAidatSonArayanEmpId:number=0;
CrmAidatKonusmaSuresi:number=0;
CrmAidatAramaSayisi:number=0;
CrmAidatAramaDurum:string="";
CrmAidatAramaDurumStr:string="";
CrmAidatAtamaTarih:Date=new  Date;

BuGorusmeNotu:string="";
BuErtelemeTarih:Date=new  Date;
BuSonAramaTarih:Date=new  Date;
BuErtelemeSaat:Date=new  Date;
BuSonArayanEmpId:number=0;
BuKonusmaSuresi:number=0;
BuAramaSayisi:number=0;
BuAramaDurum:string="";
BuAramaDurumStr:string="";
BuAtamaTarih:Date=new  Date;

FuGorusmeNotu:string="";
FuErtelemeTarih:Date=new  Date;
FuSonAramaTarih:Date=new  Date;
FuErtelemeSaat:Date=new  Date;
FuSonArayanEmpId:number=0;
FuKonusmaSuresi:number=0;
FuAramaSayisi:number=0;
FuAramaDurum:string="";
FuAramaDurumStr:string="";
FuAtamaTarih:Date=new  Date;

HukukGorusmeNotu:string="";
HukukErtelemeTarih:Date=new  Date;
HukukSonAramaTarih:Date=new  Date;
HukukErtelemeSaat:Date=new  Date;
HukukSonArayanEmpId:number=0;
HukukKonusmaSuresi:number=0;
HukukAramaSayisi:number=0;
HukukAramaDurum:string="";
HukukAramaDurumStr:string="";
HukukAtamaTarih:Date=new  Date;

TapuGorusmeNotu:string="";
TapuErtelemeTarih:Date=new  Date;
TapuSonAramaTarih:Date=new  Date;
TapuErtelemeSaat:Date=new  Date;
TapuSonArayanEmpId:number=0;
TapuKonusmaSuresi:number=0;
TapuAramaSayisi:number=0;
TapuAramaDurum:string="";
TapuAramaDurumStr:string="";
TapuAtamaTarih:Date=new  Date;

OdemeToplam:number=0;
TapuOdemeToplam:number=0;
KiymetliEvrakOnay:number=0;
KiymetliEvrakTarih!:Date;
KiymetliEvrakOnaylayan:number=0;
KiymetliEvrakOnaylayanStr:string="";
CashTalepTarih!:Date;
CashTutar:number=0;
CashTakipId:number=0;
CashDurum:string="";
PesinatKontrol:string="";

KickTalepTarih!:Date;
KickTutar:number=0;
KickIadeTutar:number=0;
KickTakipId:number=0;
KickDurum:string="";
FesihOran:number=0;
IcerideKalan: number = 0;
SorumluBirim: number = 0;
SorumluBirimStr:string="";
SozlesmeSonDurum:string="";
SozlesmeSonDurumTarih!:Date;
PrimDurum:string="";
BuJaws:string="";
BuPozisyonId:number = 0;
DevredilenBirim:number = 0;
DevredilenBirimStr:string="";
DevredilenBirimOnay:number = 0;
DevredilenBirimOnayAciklama:string="";
GuncelleyenAd:string="";
SeyahatBolgeId:number = 0;
SeyahatBolge:string="";

OdenenSenet:number=0;
SirketAdKisa:string="";
DaireNo:string="";
KampanyaTutar:number=0;
GecikenTutar:number=0;
VadesiGelenTutar:number=0;
GecikenTutarVarmi:string=""; 
VadesiGelenTutarVarmi:string=""; 
SatisTipi:number=0;
SatisTipiStr:string=""; 
KurSabit:number=0;
KurSabitStr:string="";

BuSpiffGrupId:number=0;
BuSpiffGrup:string="";
ZeyilSozlesmeId:number=0;
BuSpiffGrupPersonelId:number=0;
BuSpiffGrupPersonel:string="";
UnlemEkleyen:string="";
Avukatlik:string="";
DevirSozlesmeId:number=0;
Devredildi:number=0;
DevirYapilamaz:number=0; 
BirimDevirYapildi:number=0; 
DevirYapilamazStr:string=""; 
KullanimSuresi:number=0;
KullanimSuresiStr:string=""; 
VipUye:string=""; 
UyelikYili:number=0;
CrmOzelNot:string=""; 
CrmKonu:string=""; 
CrmBai:string=""; 
CrmDurum:string=""; 
AidatTahakkukVarmi:number=0; 
AnaSozlesmeId:number=0;
KalanSenetAdet:number=0;

SatisEkleyenEmpId:number=0;
SatisEkleyen:string=""; 
SatisGuncelleyenEmpId:number=0;
SatisGuncelleyen:string=""; 

BuErtelemeTarihSaat:any;
TahsilatErtelemeTarihSaat:any;
CrmErtelemeTarihSaat:any;
CrmAidatErtelemeTarihSaat:any;
HukukErtelemeTarihSaat:any;
FuErtelemeTarihSaat:any;

EskiSorumluBirim:number=0;
EskiSorumluBirimStr:string="";
CrmAranmayanGunSayi:number=0;


//Daire satış bilgileri
DaireId:number=0;
Blok: string = '';
Kat: string = '';
KatTipi: string = '';
BolumNo: string = '';
OdaNo: string = '';
IsyeriNo: string = '';
TapuDaireTip: string = '';
TapuBlok: string = '';
TapuKat: string = '';
TapuKatTipi: string = '';
BrutM2: number = 0;
NetM2: number = 0;
OdaTipId: number = 0;
OdaTip: string = '';
CepheId: number = 0;
Cephe: string = '';
FiyatM2: number = 0;
ToplamFiyat: number = 0;
ParaBirim: string = '';
KdvDurumId: number = 0;
SatisSekliId: number = 0;
}
export class  OtobusTip {
  constructor(tip:number,ad:string) {
        this.Tip=tip;
        this.Adi=ad;
  }
  Tip:number=0;
  Adi:string="";
}
export class AramaLog {
  DocEntry:number=0;
  Arayan:string="";
  Aciklama:string="";
  Birim:string="";
  Baslangic:any;
  Bitis:any;
  AramaSuresi:number=0;
  TarihStr:string="";
  CallId:string="";
  DinlemeYapabilir:number=0;
  SantralGorusmeSure:number=0;
  CagriYonu:string="";
  Silebilir:number=0;
}
export class OtobusSiparis {
  DocEntry:number=0;
  LineId:number=0;
  Tarih:Date=new Date();
  TalepTarih:Date=new Date();
  FirmaKodu:string="";
  FirmaAdi:string="";
  TalepEden:number=0;
  TalepEdenStr:string="";
  GuncelleyenStr:string="";
  PlakaId:number=0;
  Plaka:string="";
  Guzergah:number=0;
  Bolge:string="";
  KalkisYeri:string="";
  VarisYeri:string="";
  KalkisSaati:string="";
  Kaptan:string="";
  KaptanTel:string="";
  Durum:number=0;
  DurumStr:string="";
  Temsilci:string="";
  TemsilciTel:string="";
  SapSipNo:number=0;
  SapSipSatirNo:number=0;
  Aciklama:string=""
  Aktif:boolean=false;
  Ekleyen:number=0;
  Guncelleyen:number=0;
  Kayit:Date=new Date();
  Guncelleme:Date=new Date();
  KisiSayisi:number=0;
  OtobusTip:number=0;
  OtobusTipStr:string=""
  HavuzId:number=0;
  HavuzLineId:number=0;
  AdSoyad:string=""
  Telefon:string=""
  semkey:string="";
  BaglantiDurum:number=0;
  BaglantiDurumStr:string="";
  OtobusBindi:number=0;
  OtobusBindiStr:string="";
  TaslakFaturaTarih:Date=new Date();
  Fiyat:number=0;
  EkUcret:number=0;
  KopruGemiUcret:number=0;
  KonaklamaUcret:number=0;
  IptalFarkUcret:number=0;
  Toplam:number=0;
  RuhastAlindimi:string="";
  Konaklamalimi:string="";
  SeyahatDurumu:number=0;
  SeyahatDurumuStr:string="";
  AcenteKodu:number=0;
  AcenteAdi:string="";
  OtobusFiyatId:number=0;
  Iptalmi:string="";
}
export class OtobusSiparisMod {
  Sira:number=0;
  WaveTarih:Date=new Date();
  Guzergah:number=0;
  KisiSayi:number=0;
  OtobusTip:number=0;
  OtobusSayi:number=0;
  Bolge:string="";
  KalkisYeri:string="";
  VarisYeri:string="";
  Ekip:number=0;
  EkipAdi:string="";
}
export class OtobusMutabakatMod {
  FirmaKodu:string="";
  FirmaAdi:string="";
  Toplam:number=0;
  BelgeNo:string="";
  Siparis:OtobusSiparis[]=[];
}
export class ConfAnketMngOzet {
  Toplam:number=0;
  Aranan:number=0;
  Kalan:number=0;
}
export class ConfeAnketGrafikData {
  ConfCikanAnket:number=0;
  ConfUlasilamayan:number=0;
  ConfAranmakIst:number=0;
  ConfErtelenen:number=0;
  ConfCop:number=0;
  ReConfBindi:number=0;
  ReConfOK:number=0;
  ReConfUlasilamayan:number=0;
  ReConfErtelenen:number=0;
  ReConfCop:number=0;
}
export class BolgeModel{
  constructor(kod:string,adi:string) {
this.Kod=kod;
this.Ad=adi;
  }
  Kod:string="";
  Ad:string="";
}
export class CagriTrafikModel {
  DocEntry:number=0;
  OpcId:number=0;
  HavuzId:number=0;
  HavuzLineId:number=0;
  semkey:string="";
  BasTarih:string="";
  BitTarih:string="";
  Dakika:number=0;
  MolaMi:string="";
  Aciklama:string="";
  Durum:string="";
  EkranId:number=0;
  AdSoyad:string="";
  Manager:string="";
  Supervisor:string="";
  AnketAdSoyad:string="";
  Dahili:number=0;
  CagriDurum:string="";
  Fark:number=0;
  Guid:string="";
  CallId:string="";
  CagriYonu:string=""; 

  Arayan:string="";
  Birim:string="";
  Baslangic:any;
  Bitis:any;
  AramaSuresi:number=0;

  CrmOzelNot:string="";
  CrmKonuId:number=0;
  CrmKonu:string="";
  CrmBaiId:number=0;
  CrmBai:string="";
  CrmUyeTipiId:number=0;
  CrmUyeTipi:string="";
  CrmDurumId:number=0;
  CrmDurum:string="";
  CrmCagriSonucId:number=0;
  CrmCagriSonuc:string="";
  CrmTahsilatTutar:number=0;
  CrmGorusmeTipi:number=0;

  FuDurumId:number=0;
  FuDurum:string="";
  DonemId:number=0;
  AltDonemId:number=0;
  OrtakId:number=0;
  Ortak:string="";
  SozlesmeDurumId:number=0;
  SozlesmeDurum:string="";
  TapuDurum:number=0;
  TapuDurumStr:string="";
  SozlesmeId:number=0;
  SozlesmeNo:string="";
  UyeAdi:string="";
  PrimOran:number=0;
  DosyaBasi:number=0;
  FuPrimKontrol:number=0;
  FuPrimKontrolStr:string="";
  FuPrimKontrolEdenId:number=0;
  FuPrimKontrolEden:string=""
  Matrah:number=0; 
  Prim:number=0; 
  TapuOran:number=0; 
  FuPrimOnayAciklama:string=""
  SozlesmeTutar:number=0; 
  OdemeToplam:number=0; 
  CevapsizId:number=0; 
  DinlemeYapabilir:number=0;
  SantralGorusmeSure:number=0;
  Silebilir:number=0; 
}
export class TeleGenelIstatistikModel {
  empID:number=0;
  Toplam:number=0;
  CikanAnket:number=0;
  Ulasilamayan:number=0;
  Isteksiz:number=0;
  Kritersiz:number=0;
  YanlisNumara:number=0;
  KullanimDisi:number=0;
  Mukerrer:number=0;
  Yonetici:number=0;
  Ertelenen:number=0;
  ToplamKapama:number=0;
  CallCenter:number=0;
  Manager:string="";
  Supervisor:string="";
  ManagerId:number=0;
  SupervisorId:number=0;
  Dahili:number=0;
  Silinen:number=0;
  Cop:number=0;

}
export class AnketSoruModel {
  Code:number=0;
  Soru:string="";
  Cevap:string="";
  ManagerId:number=0;
  EkranId:number=0;
  Sira:number=0;
  Tumu:boolean=false;
}
export class AnketMetinModel {
  Code:number=0;
  Metin:string="";
  ManagerId:number=0;
  EkranId:number=0;
}
export class TeleAnketGrafikData {
  CikanAnket:number=0;
  Ulasilamayan:number=0;
  Ertelenen:number=0;
  Cop:number=0;
  Mukerrer:number=0;
  Yonetici:number=0;
}
export class TeleAnketMngOzet {
  Id:number=0;
  Tarih!:Date;
  AnketAdi:string="";
  ToplamVeri:number=0;
  Mukerrer:number=0;
  TemizVeri:number=0;
  ArananAnket:number=0;
  CikanAnket:number=0;
  Ulasilamayan:number=0;
  Isteksiz:number=0;
  Kritersiz:number=0;
  YanlisNumara:number=0;
  KullanimDisi:number=0;
  Ertelenen:number=0;
  KalanAnket:number=0;
  HavuzKapama:number=0;
  Manager:string="";
  Supervisor:string="";
  Durum:string="";
  DurumStr:string="";
  Silinen:number=0;
}
export class AnketOzetSayi {
  AnketSayi:number=0;
  CevapsizSayi:number=0;
  ErtelendiSayi:number=0;
  UlasilamadiSayi:number=0;
  IslemYapilmadi:number=0;
  Havuz:number=0;
}
export class AnketMaster {
  Id:number=0;
  Tarih: Date=new Date();
  Ekleyen: String="";
  AnketAdi: String="";
  EkleyenId: number=0;
  Aciklama: String="";
  ToplamVeri: number=0;
  Sorgulanan: number=0;
  DosyaIcinde: number=0;
  ManagerIcinde:number=0;
  HavuzIcinde:number=0;
  TemizVeri:number=0;
  Durum:String="";
  DurumStr:String="";
  AktarimTarih: Date=new Date();
  AnketTipi: String="";
  AcenteKodu: String="";
  AcenteAdi: String="";
  ManagerKodu:number=0;
  Manager: String="";
  HavuzId:number=0;
  AnketTipStr:string="";
  ToplamAnket:number=0;
  GonderilenAnket:number=0;
  KullanimOrani:number=0;
  HesaplamaDakika:number=0;
}
export class AnketDetay {
  semkey:string="";
  Id:number=0;
  SapAnketId:number=0;
  AnketHazirlikId:number=0;
  Adi: String="";
  Telefon: String="";
  Telefon2: String="";
  Yas: number=0;
  Meslek: String="";
  Gelir: number=0;
  Cinsiyet: string="-";
  Il: String="";
  Ilce:String="";
  Durum:String="";
  ManagerId:number=0;
  SupervisorId:number=0;

  OpcId:number=0;
  OpcSupervisorId:number=0;
  OpcManagerId:number=0;
  AylikGelir:number=0;
  TatilIhtiyacmi:string="-";
  HerYilTatil:string="-";
  TatilNerede:number=0;
  TermalMi:string="-";
  TatilPlani:number=0;
  YillikIzin:number=0;
  TatilBeldesi:number=0;
  Comments:number=0;
  AramaDurum:number=0;
  TeleGorusmeNotu:String="";
  SehirKod:string="00";
  IlceKod:string="0";
  MeslekId:number=0;
  MedeniHal:string="-";
  GorusmeTarih:Date=new  Date;
  TeleErtelemeTarih:Date=new  Date;
  TeleErtelemeSaat:Date=new  Date;
  TeleKonusmaSuresi:number=0;
  TeleGorusmeNotId:number=0;
  TeleAramaSayisi:number=0;
  TeleCommentStr:string="";
  ErtelemeTarihSaat!:Date;
  TatilNeredeStr:string="";


  ConfId:number=0;
  ConfSupervisorId:number=0;
  ConfManagerId:number=0;
  ConfComments:number=0;
  ConfAramaDurum:number=0;
  ConfGorusmeNotu:string="";
  ConfErtelemeTarih:Date=new  Date;
  ConfSonAramaTarih:Date=new  Date;
  ConfErtelemeSaat:number=0;
  ConfSonArayanEmpId:number=0;
  ConfKonusmaSuresi:number=0;
  ConfAramaSayisi:number=0;
  ConfWaveTarih:any;
  ConfTarife:string="";
  ConfGun:string="";
  ConfWave:string="";
  ConfGelisDurum:number=0;
  ConfBolge:string="";
  ConfGuzergah:number=0;
  ConfKisiSayisi:number=0;
  ConfKalkisSaati:string="";
  ConfErtelemeTarihSaat!:Date;
  ConfCommentStr:string="";
  EkuriId:number=0;
  EkuriAdi:string="";
  Opc:string="";
  OpcSupervisor:string="";
  OpcManager:string="";
  Conf:string="";
  ConfSupervisor:string="";
  ConfManager:string="";
  ConfGunStr:string="";
  ConfWaveStr:string="";
  KalkisYeri:string="";
  ConfGelisDurumStr:string="";

  ReConfId:number=0;
  ReConfComments:number=0;
  ReConfCommentStr:string="";
  ReConfAramaDurum:number=0;
  ReConfGorusmeNotu:string="";
  ReConfErtelemeTarih:Date=new  Date;
  ReConfSonAramaTarih:Date=new  Date;
  ReConfErtelemeSaat:number=0;
  ReConfSonArayanEmpId:number=0;
  ReConfKonusmaSuresi:number=0;
  ReConfAramaSayisi:number=0;

  SiparisId:number=0;
  SiparisDurum:number=0;
  Plaka:string="";
  Kaptan:string="";
  KaptanTel:string="";
  TemsilciAdi:string="";
  TemsilciTel:string="";
  ReConfEkip:number=0;
  HesKodu:string="";
  Bindi:string="";
  Sms:string="";
  OtobusSipDurum:string="";

  OtelGiris:number=0;
  OtelGirisStr:string="";
  FrontDesk:number=0;
  FrontDeskStr:string="";
  TesisId:number=0;
  Tesis:string="";
  AnketId:number=0;
  AnketSatirId:number=0;

  AcenteKodu:string="";
  AcenteAdi:string="";
  AnketTipi:string="";
  AnketTipStr:string="";
  SonGuncellemeTarih:any;

  SorumluOpcManager:string="";
  SorumluOpcSupervisor:string="";
  SorumluOpc:string="";
  SorumluConfManager:string="";
  SorumluConfSupervisor:string="";
  SorumluConf:string="";
  AcenteId:number=0;
  TeleErtelemeGeldi:number=0;
  ConfErtelemeGeldi:number=0;
  ReConfErtelemeGeldi:number=0;
  SeyahatTuruId:number=0;
  SeyahatTuru:string="";
}
export class VeriBirimi {
  DocEntry:number=0;
  Birim: String="";
  Code: String="";
  Name: String="";
}
export class AnketFaturaModel {
  DocEntry:number=0;
  Tarih: Date=new Date();
  StokKodu: String="";
  StokAdi: String="";
  Adet: number=0;
  Toplam: number=0;
  CariKodu: String="";
  CariAdi: String="";
  Bakiye: number=0;
  ParaBirim: String="";
  CariParaBirim: String="";
}
export class AnketSecim {
  constructor(code:string,name:string) {
    this.Code=code;
    this.Name=name;
  }
  Code: String="";
  Name: String="";
}
export class AnketSonuc {
  Aciklama: string="";
  AramaDurum: string="";
  Tarih!: NgbDateStruct;
  WaweTarih!: NgbDateStruct;
  Saat!:NgbTimeStruct;
  Buton:number=0;

  CrmOzelNot:string="";
  CrmKonuId:number=0;
  CrmKonu:string="";
  CrmBaiId:number=0;
  CrmBai:string="";
  CrmUyeTipiId:number=0;
  CrmUyeTipi:string="";
  CrmDurumId:number=0;
  CrmDurum:string="";
  CrmCagriSonucId:number=0;
  CrmCagriSonuc:string="";
  CrmTahsilatTutar:number=0;
  CrmGorusmeTipi:number=0;

  FuDurumId:number=0;
  FuDurum:string="";
  DonemId:number=0;
  AltDonemId:number=0;
  OrtakId:number=0;
  Ortak:string="";
  SozlesmeDurumId:number=0;
  SozlesmeDurum:string="";
  GorusmeTip:number=0;

}
