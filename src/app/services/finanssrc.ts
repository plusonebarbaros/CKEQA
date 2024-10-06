import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core"; 
import { HesapModel, Result, ReturnValues, SistemEkran } from "./Genel/genelsrv";
import { IslemTipi } from "./Onay/onay-surev-src.service";
import { map } from 'rxjs/operators';
import { DemibasData, DemirbasZimmetModel, Sabit } from "./sabitsrc/sabitserv.service";
import moment from "moment";
import { OnKayit, SanalPosOdemeBekleyenModel, TahsilatModel } from "./anket/anket-yonetim.service";
import { KullaniciSrcService, SirketYetki } from "./kullanici/kullanici-src.service";


@Injectable({
    providedIn: 'root'
  })
  export class FinansService { 
  
    constructor(
      @Inject('semUrl') private semUrl:string,
      private http: HttpClient,
      private kullsrc:KullaniciSrcService
    ) { }


    async FinansTalepEkle(post:FinansTalepModel,tip:IslemTipi):Promise<ReturnValues>  {
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
      
        var result = await this.http.post<any>(this.semUrl+"/Finans/FinansTalepEkle", body, options).toPromise();
      
        var sonuc = JSON.parse(JSON.stringify(result))['Model'];
        return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
      }
       

    async GetFinansTalepList(id:number,onaydurum:number,talepdurum:number,kasaid:number)
    { 
     let url=this.semUrl+"/Finans/GetFinansTalepList?Docentry="+id+"&OnayDurum="+onaydurum+"&TalepDurum="+talepdurum+"&KasaId="+kasaid+"&Token="+this.kullsrc.token; 
        return await this.http.get<Result<FinansTalepModel>>(url).pipe( map((res:any)=> res));
    }

    async FinansTalepOnay(post:FinansTalepModel,tip:IslemTipi):Promise<ReturnValues>  {
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
      
        var result = await this.http.post<any>(this.semUrl+"/Finans/FinansTalepOnay", body, options).toPromise();
      
        var sonuc = JSON.parse(JSON.stringify(result))['Model'];
        return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
      }

      async GetFinansOdemeGun(id:number)
      { 
       let url=this.semUrl+"/Finans/GetFinansOdemeGun?Docentry="+id+"&Token="+this.kullsrc.token; 
          return await this.http.get<Result<Sabit>>(url).pipe( map((res:any)=> res));
      } 

      async FinansTalepOnayGeriAl(post:FinansTalepModel,tip:IslemTipi):Promise<ReturnValues>  {
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
      
        var result = await this.http.post<any>(this.semUrl+"/Finans/FinansTalepOnayGeriAl", body, options).toPromise();
      
        var sonuc = JSON.parse(JSON.stringify(result))['Model'];
        return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
      }

      async GetFinansKarsiHesapList(surecid:number,altsurecid:number,islemid:number,odenenhesapid:number,arama:string,sirketid:number)
      { 
           let url=this.semUrl+"/Finans/GetFinansKarsiHesapList?SurecId="+surecid+"&AltSurecId="+altsurecid+"&IslemId="+islemid+"&OdenenBirimId="+odenenhesapid+"&Arama="+arama+"&Token="+this.kullsrc.token+"&SirketId="+sirketid; 
              return await this.http.get<Result<FinansKarsiHesapModel>>(url).pipe( map((res:any)=> res));
      }

      async FinansHareketEkle(post:FinansHareketModel,detay:FinansKarsiHesapModel[]=[],tekilislem:boolean,tip:IslemTipi):Promise<ReturnValues>  {
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
          "Detay":  detay,  
          "TekilIslem":  tekilislem,  
          "Token":this.kullsrc.token, 
          "Tip":tip, 
        });
      
        var result = await this.http.post<any>(this.semUrl+"/Finans/FinansHareketEkle", body, options).toPromise();
      
        var sonuc = JSON.parse(JSON.stringify(result))['Model'];
        return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
      }

      async FinansTopluHareketEkle(post:FinansHareketModel[],tip:IslemTipi,guidcheck:boolean):Promise<ReturnValues>  {
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
          "GuidCheck":guidcheck, 
          "Tip":tip, 
        });
      
        var result = await this.http.post<any>(this.semUrl+"/Finans/FinansTopluHareketEkle", body, options).toPromise();
      
        var sonuc = JSON.parse(JSON.stringify(result))['Model'];
        return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
      }

      async GetFinansHareketList(id:number,birim:string,baglibirim:string,hesapid:number,acente:number,devir:number,ekranid:SistemEkran,baslangic:Date | undefined,bitis:Date |undefined,beklemede:number,hesapkontrol:number,hesapturu:number,surec:string)
      { 
           let url=this.semUrl+"/Finans/GetFinansHareketList?Docentry="+id+"&Birim="+birim+"&BagliBirim="+baglibirim+"&HesapId="+hesapid+"&AcenteId="+acente+"&Aktarim="+devir+"&Ekran="+ekranid+"&Baslangic="+moment(baslangic).format("yyyy-MM-DD")+"&Bitis="+moment(bitis).format("yyyy-MM-DD")+"&Beklemede="+beklemede+"&HesapKontrol="+hesapkontrol+"&HesapTuru="+hesapturu+"&Surec="+surec+"&Token="+this.kullsrc.token; 
              return await this.http.get<Result<FinansHareketModel>>(url).pipe( map((res:any)=> res));
      }

      async GetFinansHareketOtherList(id:number,birim:string,surec:string,altsurec:string,hesapid:number,acente:number,devir:number,ekranid:SistemEkran,baslangic:Date | undefined,bitis:Date |undefined,beklemede:number,hesapkontrol:number)
      { 
           let url=this.semUrl+"/Finans/GetFinansHareketOtherList?Docentry="+id+"&Birim="+birim+"&Surec="+surec+"&AltSurec="+altsurec+"&HesapId="+hesapid+"&AcenteId="+acente+"&Aktarim="+devir+"&Ekran="+ekranid+"&Baslangic="+moment(baslangic).format("yyyy-MM-DD")+"&Bitis="+moment(bitis).format("yyyy-MM-DD")+"&Beklemede="+beklemede+"&HesapKontrol="+hesapkontrol+"&Token="+this.kullsrc.token; 
              return await this.http.get<Result<FinansHareketModel>>(url).pipe( map((res:any)=> res));
      }

      async GetFinansHareketTahakkukList(id:number,birim:string,surec:string,altsurec:string,hesapid:number,acente:number,devir:number,ekranid:SistemEkran,baslangic:Date | undefined,bitis:Date |undefined,beklemede:number,hesapkontrol:number)
      { 
           let url=this.semUrl+"/Finans/GetFinansHareketTahakkukList?Docentry="+id+"&Birim="+birim+"&Surec="+surec+"&AltSurec="+altsurec+"&HesapId="+hesapid+"&AcenteId="+acente+"&Aktarim="+devir+"&Ekran="+ekranid+"&Baslangic="+moment(baslangic).format("yyyy-MM-DD")+"&Bitis="+moment(bitis).format("yyyy-MM-DD")+"&Beklemede="+beklemede+"&HesapKontrol="+hesapkontrol+"&Token="+this.kullsrc.token; 
              return await this.http.get<Result<FinansHareketModel>>(url).pipe( map((res:any)=> res));
      }

      async GetCariFinansHareketList(id:number,birim:string,baglibirim:string,hesapid:number,acente:number,devir:number,ekranid:SistemEkran,baslangic:Date | undefined,bitis:Date |undefined,beklemede:number,hesapkontrol:number,hesapturu:number,surec:string)
      { 
           let url=this.semUrl+"/Finans/GetCariFinansHareketList?Docentry="+id+"&Birim="+birim+"&BagliBirim="+baglibirim+"&HesapId="+hesapid+"&AcenteId="+acente+"&Aktarim="+devir+"&Ekran="+ekranid+"&Baslangic="+moment(baslangic).format("yyyy-MM-DD")+"&Bitis="+moment(bitis).format("yyyy-MM-DD")+"&Beklemede="+beklemede+"&HesapKontrol="+hesapkontrol+"&HesapTuru="+hesapturu+"&Surec="+surec+"&Token="+this.kullsrc.token; 
              return await this.http.get<Result<FinansHareketModel>>(url).pipe( map((res:any)=> res));
      }

      async FinansPosHesapEkle(post:FinansPosHesapModel,tip:IslemTipi):Promise<ReturnValues>  {
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
      
        var result = await this.http.post<any>(this.semUrl+"/Finans/FinansPosHesapEkle", body, options).toPromise();
      
        var sonuc = JSON.parse(JSON.stringify(result))['Model'];
        return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
      }

      async GetFinansPosHesapList(id:number)
      { 
           let url=this.semUrl+"/Finans/GetFinansPosHesapList?Docentry="+id+"&Token="+this.kullsrc.token; 
              return await this.http.get<Result<HesapModel>>(url).pipe( map((res:any)=> res));
      }

      async FinansDovizHesapEkle(post:FinansDovizHesapModel,tip:IslemTipi):Promise<ReturnValues>  {
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
      
        var result = await this.http.post<any>(this.semUrl+"/Finans/FinansDovizHesapEkle", body, options).toPromise();
      
        var sonuc = JSON.parse(JSON.stringify(result))['Model'];
        return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
      }

      async GetFinansDovizHesapList(id:number)
      { 
           let url=this.semUrl+"/Finans/GetFinansDovizHesapList?Docentry="+id+"&Token="+this.kullsrc.token; 
              return await this.http.get<Result<HesapModel>>(url).pipe( map((res:any)=> res));
      }

      async FinSurecEkle(post:FinSurecModel,tip:IslemTipi):Promise<ReturnValues>  {
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
      
        var result = await this.http.post<any>(this.semUrl+"/Tanim/FinSurecEkle", body, options).toPromise();
      
        var sonuc = JSON.parse(JSON.stringify(result))['Model'];
        return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
      }

      async GetFinSurecList(id:number)
      { 
           let url=this.semUrl+"/Tanim/GetFinSurecList?Docentry="+id+"&Token="+this.kullsrc.token; 
              return await this.http.get<Result<FinSurecModel>>(url).pipe( map((res:any)=> res));
      }

      async FinAltSurecEkle(post:FinAltSurecModel,tip:IslemTipi):Promise<ReturnValues>  {
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
      
        var result = await this.http.post<any>(this.semUrl+"/Tanim/FinAltSurecEkle", body, options).toPromise();
      
        var sonuc = JSON.parse(JSON.stringify(result))['Model'];
        return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
      }

      async GetFinAltSurecList(id:number,surecid:number)
      { 
           let url=this.semUrl+"/Tanim/GetFinAltSurecList?Docentry="+id+"&SurecId="+surecid+"&Token="+this.kullsrc.token; 
              return await this.http.get<Result<FinAltSurecModel>>(url).pipe( map((res:any)=> res));
      }

      async FinParametreEkle(post:FinParametreModel,tip:IslemTipi):Promise<ReturnValues>  {
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
      
        var result = await this.http.post<any>(this.semUrl+"/Tanim/FinParametreEkle", body, options).toPromise();
      
        var sonuc = JSON.parse(JSON.stringify(result))['Model'];
        return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
      }

      async GetFinParametreList(id:number)
      { 
           let url=this.semUrl+"/Tanim/GetFinParametreList?Docentry="+id+"&Token="+this.kullsrc.token; 
              return await this.http.get<Result<FinParametreModel>>(url).pipe( map((res:any)=> res));
      }

      async FinTaahhukEkle(post:FinTaahhukModel,tip:IslemTipi):Promise<ReturnValues>  {
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
      
        var result = await this.http.post<any>(this.semUrl+"/Finans/FinTaahhukEkle", body, options).toPromise();
      
        var sonuc = JSON.parse(JSON.stringify(result))['Model'];
        return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
      }

      async GetFinTaahhukList(id:number,evid:number,donemid:number,altdonemid:number,)
      { 
           let url=this.semUrl+"/Finans/GetFinTaahhukList?Docentry="+id+"&EvId="+evid+"&DonemId="+donemid+"&AltDonemId="+altdonemid+"&Token="+this.kullsrc.token; 
              return await this.http.get<Result<FinTaahhukModel>>(url).pipe( map((res:any)=> res));
      }

      async FinEvHakedisEkle(post:FinEvHakedisModel,tip:IslemTipi):Promise<ReturnValues>  {
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
      
        var result = await this.http.post<any>(this.semUrl+"/Finans/FinEvHakedisEkle", body, options).toPromise();
      
        var sonuc = JSON.parse(JSON.stringify(result))['Model'];
        return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
      }
 
      async GetFinEvHakedisList(id:number,departmanid:number,bolgeid:string="",durumid:number=0)
      { 
           let url=this.semUrl+"/Finans/GetFinEvHakedisList?Docentry="+id+"&DepartmanId="+departmanid+"&BolgeId="+bolgeid+"&Durum="+durumid+"&Token="+this.kullsrc.token; 
              return await this.http.get<Result<FinTaahhukModel>>(url).pipe( map((res:any)=> res));
      }

      async FinIsAvansEkleEkle(post:FinansIsAvansModel,detay:FinansIsAvansDetayModel[],tip:IslemTipi):Promise<ReturnValues>  {
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
          "Detay":  detay,  
          "Token":this.kullsrc.token, 
          "Tip":tip, 
        });
      
        var result = await this.http.post<any>(this.semUrl+"/Finans/FinIsAvansEkleEkle", body, options).toPromise();
      
        var sonuc = JSON.parse(JSON.stringify(result))['Model'];
        return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
      }

      async GetFinansKarsiHesapListStr(surec:string,altsurec:string,arama:string)
      { 
           let url=this.semUrl+"/Finans/GetFinansKarsiHesapListStr?Surec="+surec+"&AltSurec="+altsurec+"&Arama="+arama+"&Token="+this.kullsrc.token; 
              return await this.http.get<Result<FinansKarsiHesapModel>>(url).pipe( map((res:any)=> res));
      }

      async GetFinIsAvansList(id:number,hesapid:number,baslangic:Date | undefined,bitis:Date |undefined)
      { 
           let url=this.semUrl+"/Finans/GetFinIsAvansList?Docentry="+id+"&HesapId="+hesapid+"&Baslangic="+moment(baslangic).format("yyyy-MM-DD")+"&Bitis="+moment(bitis).format("yyyy-MM-DD")+"&Token="+this.kullsrc.token; 
              return await this.http.get<Result<FinansIsAvansDetayModel>>(url).pipe( map((res:any)=> res));
      }

      async IsAvansIade(post:FinansHareketModel,carikasa:number,tip:IslemTipi):Promise<ReturnValues>  {
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
          "CariKasa":  carikasa,    
          "Token":this.kullsrc.token, 
          "Tip":tip, 
        });
      
        var result = await this.http.post<any>(this.semUrl+"/Finans/IsAvansIade", body, options).toPromise();
      
        var sonuc = JSON.parse(JSON.stringify(result))['Model'];
        return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
      }

      async GetFinansMuhasebeAktarimtList(sapsube:number,baslangic:Date | undefined,bitis:Date |undefined,beklemede:number,islemtipi:string)
      { 
           let url=this.semUrl+"/Finans/GetFinansMuhasebeAktarimtList?SapSube="+sapsube+"&Baslangic="+moment(baslangic).format("yyyy-MM-DD")+"&Bitis="+moment(bitis).format("yyyy-MM-DD")+"&Beklemede="+beklemede+"&IslemTipi="+islemtipi+"&Token="+this.kullsrc.token; 
              return await this.http.get<Result<FinansHareketModel>>(url).pipe( map((res:any)=> res));
      }

      async FinansHareketIptal(post:FinansHareketModel,islemaciklama:string,tip:IslemTipi):Promise<ReturnValues>  {
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
          "IslemAciklama":  islemaciklama,    
          "Token":this.kullsrc.token, 
          "Tip":tip, 
        });
      
        var result = await this.http.post<any>(this.semUrl+"/Finans/FinansHareketIptal", body, options).toPromise();
      
        var sonuc = JSON.parse(JSON.stringify(result))['Model'];
        return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
      }

      async GetFinansIptalTalepList(sapsube:number,baslangic:Date | undefined,bitis:Date |undefined,durumid:number)
      { 
           let url=this.semUrl+"/Finans/GetFinansIptalTalepList?SapSube="+sapsube+"&Baslangic="+moment(baslangic).format("yyyy-MM-DD")+"&Bitis="+moment(bitis).format("yyyy-MM-DD")+"&DurumId="+durumid+"&Token="+this.kullsrc.token; 
              return await this.http.get<Result<FinansHareketModel>>(url).pipe( map((res:any)=> res));
      }

      async FinansHareketIptalIslem(post:FinansHareketModel[],islemaciklama:string,durumid:number,tip:IslemTipi):Promise<ReturnValues>  {
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
          "IslemAciklama":  islemaciklama,    
          "IptalOnayDurum":  durumid,    
          "Token":this.kullsrc.token, 
          "Tip":tip, 
        });
      
        var result = await this.http.post<any>(this.semUrl+"/Finans/FinansHareketIptalIslem", body, options).toPromise();
      
        var sonuc = JSON.parse(JSON.stringify(result))['Model'];
        return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
      }

      async GetFinansBakiyeList(birim:string,baglibirim:string,ekran:number)
      { 
           let url=this.semUrl+"/Finans/GetFinansBakiyeList?Birim="+birim+"&BagliBirim="+baglibirim+"&Ekran="+ekran+"&Token="+this.kullsrc.token; 
              return await this.http.get<Result<FinansBakiyeModel>>(url).pipe( map((res:any)=> res));
      }

      async GetFinansBakiyeSorgula(birim:string,baglibirim:string,hesapid:number)
      { 
           let url=this.semUrl+"/Finans/GetFinansBakiyeSorgula?Birim="+birim+"&BagliBirim="+baglibirim+"&HesapId="+hesapid+"&Token="+this.kullsrc.token; 
              return await this.http.get<Result<FinansBakiyeModel>>(url).pipe( map((res:any)=> res));
      }

      async MakbuzYazdir(odeme:FinansHareketModel[]):Promise<ReturnValues>  {
        const headers = new HttpHeaders(
          {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Headers': 'Content-Type',
         }
        ); 
      
          let options = { headers: headers };
      
          const body =  JSON.stringify({ 
            "Data":  odeme,   
            "Durum":  0,   
            "Token":this.kullsrc.token, 
          });
      
        var result = await this.http.post<any>(this.semUrl+"/Finans/MakbuzYazdir", body, options).toPromise();
      
        var sonuc = JSON.parse(JSON.stringify(result))['Model'];
        return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
    } 

    async UyeAidatTaahhukEkle(data:UyeAidatTahsilatModel,tip:IslemTipi,Aciklama:String):Promise<ReturnValues>  {
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
        "Aciklama":Aciklama, 
      });
    
      var result = await this.http.post<any>(this.semUrl+"/Anket/UyeAidatTaahhukEkle", body, options).toPromise();
    
      var sonuc = JSON.parse(JSON.stringify(result))['Model'];
      return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
    }

    async GetUyeAidatTaahhukList(code:number,sozlesmeid:number,baslangic:Date | undefined,bitis:Date |undefined,tumu:boolean,tckn:string)
    { 
         let url=this.semUrl+"/Anket/GetUyeAidatTaahhukList?Code="+code+"&SozlesmeId="+sozlesmeid+"&Token="+this.kullsrc.token+"&Baslangic="+moment(baslangic).format("yyyy-MM-DD")+"&Bitis="+moment(bitis).format("yyyy-MM-DD")+"&Tumu="+tumu+"&Tckn="+tckn; 
            return await this.http.get<Result<UyeAidatTahsilatModel>>(url).pipe( map((res:any)=> res));
    }


    async TopluSenetAktarim(formdata:FormData):Promise<ReturnValues>  {
      const headers = new HttpHeaders(); 
      let options = { headers: headers }; 

      formdata.append('token', this.kullsrc.token+"" );

      var result = await this.http.post<any>(this.semUrl+"/Anket/TopluSenetAktarim", formdata,options).toPromise();

      var sonuc = JSON.parse(JSON.stringify(result));
      return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
   } 

   async TopluAidatAktarim(formdata:FormData):Promise<ReturnValues>  {
    const headers = new HttpHeaders(); 
    let options = { headers: headers }; 

    formdata.append('token', this.kullsrc.token+"" );

    var result = await this.http.post<any>(this.semUrl+"/Anket/TopluAidatAktarim", formdata,options).toPromise();

    var sonuc = JSON.parse(JSON.stringify(result));
    return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
 } 

   async GetTopluSenetEslestirme(code:number,durum:string,bolumid:number,Baslangic:Date | undefined,Bitis:Date | undefined,Tarihkontrol:boolean)
    { 
         let url=this.semUrl+"/Anket/GetTopluSenetEslestirme?Code="+code+"&Durum="+durum+"&BolumId="+bolumid+"&Baslangic="+moment(Baslangic).format("yyyy-MM-DD")+"&Bitis="+moment(Bitis).format("yyyy-MM-DD")+"&Tarihkontrol="+Tarihkontrol+"&Token="+this.kullsrc.token; 
            return await this.http.get<Result<TopluSenetEslestirmeModel>>(url).pipe( map((res:any)=> res));
    }

    async FinansHareketSil(post:FinansHareketModel[],baglantiid:number,ekran:number):Promise<ReturnValues>  {
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
        "BaglantiId":  baglantiid,  
        "Ekran":  ekran,  
        "Token":this.kullsrc.token,  
      });
    
      var result = await this.http.post<any>(this.semUrl+"/Finans/FinansHareketSil", body, options).toPromise();
    
      var sonuc = JSON.parse(JSON.stringify(result))['Model'];
      return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
    } 

    async FinansHareketSilTekil(post:FinansHareketModel[],baglantiid:number,ekran:number):Promise<ReturnValues>  {
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
        "BaglantiId":  baglantiid,  
        "Ekran":  ekran,  
        "Token":this.kullsrc.token,  
      });
    
      var result = await this.http.post<any>(this.semUrl+"/Finans/FinansHareketSilTekil", body, options).toPromise();
    
      var sonuc = JSON.parse(JSON.stringify(result))['Model'];
      return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
    } 

    async SozlesmeSenetKapatmaGeriAl(post:FinansHareketModel[],baglantiid:number,ekran:number):Promise<ReturnValues>  {
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
        "SenetId":  baglantiid,  
        "Ekran":  ekran,  
        "Token":this.kullsrc.token,  
      });
    
      var result = await this.http.post<any>(this.semUrl+"/Anket/SozlesmeSenetKapatmaGeriAl", body, options).toPromise();
    
      var sonuc = JSON.parse(JSON.stringify(result))['Model'];
      return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
    } 

    async TopluTahakkukAktarim(formdata:FormData):Promise<ReturnValues>  {
      const headers = new HttpHeaders(); 
      let options = { headers: headers }; 

      formdata.append('token', this.kullsrc.token+"" );

      var result = await this.http.post<any>(this.semUrl+"/Finans/TopluTahakkukAktarim", formdata,options).toPromise();

      var sonuc = JSON.parse(JSON.stringify(result));
      return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
   } 

   async GetTopluTahakkukAktarim(docentry:number,durum:number)
    { 
         let url=this.semUrl+"/Finans/GetTopluTahakkukAktarim?DocEntry="+docentry+"&Durum="+durum+"&Token="+this.kullsrc.token; 
            return await this.http.get<Result<TopluTahakkukModel>>(url).pipe( map((res:any)=> res));
    }

    async TopluTahakkukAktarimGuncelle(data:TopluTahakkukModel | undefined,list:TopluTahakkukModel[]=[],tip:IslemTipi):Promise<ReturnValues>  {
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

      var result = await this.http.post<any>(this.semUrl+"/Finans/TopluTahakkukAktarimGuncelle", body, options).toPromise();

      var sonuc = JSON.parse(JSON.stringify(result))['Model'];
      return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
    }

    async TopluTahakkukFinansHarEkle(tahsilat:TahsilatModel,list:TopluTahakkukModel[]=[],hesap:HesapModel,tip:IslemTipi):Promise<ReturnValues>  {
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
          "List":  list,
          "Hesap":  hesap,
          "Tip":  tip,
          "Token":this.kullsrc.token,
        });

      var result = await this.http.post<any>(this.semUrl+"/Finans/TopluTahakkukFinansHarEkle", body, options).toPromise();

      var sonuc = JSON.parse(JSON.stringify(result))['Model'];
      return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
    }

    async TopluTahakkukFinansOdemeEkle(tahsilat:TahsilatModel,list:TopluTahakkukModel[]=[],hesap:HesapModel,tip:IslemTipi):Promise<ReturnValues>  {
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
          "List":  list,
          "Hesap":  hesap,
          "Tip":  tip,
          "Token":this.kullsrc.token,
        });

      var result = await this.http.post<any>(this.semUrl+"/Finans/TopluTahakkukFinansOdemeEkle", body, options).toPromise();

      var sonuc = JSON.parse(JSON.stringify(result))['Model'];
      return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
    }

    async KasaYazdir(hesap:KasaYazdirModel):Promise<ReturnValues>  {
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
    
      var result = await this.http.post<any>(this.semUrl+"/Finans/KasaYazdir", body, options).toPromise();
    
      var sonuc = JSON.parse(JSON.stringify(result))['Model'];
      return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
  } 

  async KasaEvrakYazdir(hesap:KasaYazdirModel):Promise<ReturnValues>  {
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
  
    var result = await this.http.post<any>(this.semUrl+"/Finans/KasaEvrakYazdir", body, options).toPromise();
  
    var sonuc = JSON.parse(JSON.stringify(result))['Model'];
    return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
} 


async TahsilatMakbuzYazdir(hesap:FinansHareketModel):Promise<ReturnValues>  {
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

  var result = await this.http.post<any>(this.semUrl+"/Finans/TahsilatMakbuzYazdir", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
} 

async SenetOdemeIade(post:FinansHareketModel[],baglantiid:number,ekran:number):Promise<ReturnValues>  {
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
    "BaglantiId":  baglantiid,  
    "Ekran":  ekran,  
    "Token":this.kullsrc.token,  
  });

  var result = await this.http.post<any>(this.semUrl+"/Finans/SenetOdemeIade", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
} 

async SenetOdemeIadeTekil(post:FinansHareketModel,baglantiid:number,ekran:number,iadetutar:number,iadeaciklama:string):Promise<ReturnValues>  {
  const headers = new HttpHeaders(
    {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Headers': 'Content-Type',
   }
  ); 

  let options = { headers: headers };
  
  const body =  JSON.stringify({ 
    "Data2":  post,  
    "BaglantiId":  baglantiid,  
    "Ekran":  ekran,  
    "IadeEdilecekTutar":  iadetutar,  
    "IadeAciklama":  iadeaciklama,  
    "Token":this.kullsrc.token,  
  });

  var result = await this.http.post<any>(this.semUrl+"/Finans/SenetOdemeIadeTekil", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
} 

async AidatOdemeIade(post:FinansHareketModel[],baglantiid:number,ekran:number):Promise<ReturnValues>  {
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
    "BaglantiId":  baglantiid,  
    "Ekran":  ekran,  
    "Token":this.kullsrc.token,  
  });

  var result = await this.http.post<any>(this.semUrl+"/Finans/AidatOdemeIade", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
} 

async SozlesmeAidatKapatmaGeriAl(post:FinansHareketModel[],baglantiid:number,ekran:number):Promise<ReturnValues>  {
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
    "SenetId":  baglantiid,  
    "Ekran":  ekran,  
    "Token":this.kullsrc.token,  
  });

  var result = await this.http.post<any>(this.semUrl+"/Anket/SozlesmeAidatKapatmaGeriAl", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
} 

async FinansPrimPersonelGuncelle(post:FinansHareketModel[],sorumluid:number,personelid:number):Promise<ReturnValues>  {
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
    "SorumluBirimId":  sorumluid,  
    "AtananKullaniciId":  personelid,  
    "Token":this.kullsrc.token,  
  });

  var result = await this.http.post<any>(this.semUrl+"/Finans/FinansPrimPersonelGuncelle", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
} 

async FinansPrimPersonel2Guncelle(post:FinansHareketModel[],sorumluid:number,personelid:number):Promise<ReturnValues>  {
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
    "SorumluBirimId":  sorumluid,  
    "AtananKullaniciId":  personelid,  
    "Token":this.kullsrc.token,  
  });

  var result = await this.http.post<any>(this.semUrl+"/Finans/FinansPrimPersonel2Guncelle", body, options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result))['Model'];
  return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
} 

async GetAgentTahsilatlarim(id:number,baslangic:Date | undefined,bitis:Date |undefined,sorumlubirim:number)
      { 
           let url=this.semUrl+"/Finans/GetAgentTahsilatlarim?Docentry="+id+"&Baslangic="+moment(baslangic).format("yyyy-MM-DD")+"&Bitis="+moment(bitis).format("yyyy-MM-DD")+"&SorumluBirim="+sorumlubirim+"&Token="+this.kullsrc.token; 
              return await this.http.get<Result<FinansHareketModel>>(url).pipe( map((res:any)=> res));
      }

      async AgentItirazTalepOlustur(post:FinansHareketModel[],atananbirimid:number,aciklama:string):Promise<ReturnValues>  {
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
          "AtananBirimId":  atananbirimid,  
          "Aciklama":  aciklama,  
          "Token":this.kullsrc.token,  
        });
      
        var result = await this.http.post<any>(this.semUrl+"/Finans/AgentItirazTalepOlustur", body, options).toPromise();
      
        var sonuc = JSON.parse(JSON.stringify(result))['Model'];
        return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
      } 

      async GetAgentItirazTalepList(id:number,baslangic:Date | undefined,bitis:Date |undefined)
      { 
           let url=this.semUrl+"/Finans/GetAgentItirazTalepList?Docentry="+id+"&Baslangic="+moment(baslangic).format("yyyy-MM-DD")+"&Bitis="+moment(bitis).format("yyyy-MM-DD")+"&Token="+this.kullsrc.token; 
              return await this.http.get<Result<FinansHareketModel>>(url).pipe( map((res:any)=> res));
      }
     
      async AgentItirazTalepOnayla(post:FinansHareketModel[],atananbirimid:number,atanankullanici:number,aciklama:string,onaydurum:number):Promise<ReturnValues>  {
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
          "AtananBirimId":  atananbirimid,  
          "AtananKullanici":  atanankullanici,  
          "OnayDurum":  onaydurum,  
          "Aciklama":  aciklama,  
          "Token":this.kullsrc.token,  
        });
      
        var result = await this.http.post<any>(this.semUrl+"/Finans/AgentItirazTalepOnayla", body, options).toPromise();
      
        var sonuc = JSON.parse(JSON.stringify(result))['Model'];
        return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
      }  

      async TopluRciEkle(formdata:FormData):Promise<ReturnValues>  {
        const headers = new HttpHeaders(); 
        let options = { headers: headers }; 
    
        formdata.append('token', this.kullsrc.token+"" );
    
        var result = await this.http.post<any>(this.semUrl+"/Anket/TopluRciEkle", formdata,options).toPromise();
    
        var sonuc = JSON.parse(JSON.stringify(result));
        return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
     } 

     async GetTopluRci(durum:number=0)
    { 
         let url=this.semUrl+"/Anket/GetTopluRci?DurumId="+durum+"&Token="+this.kullsrc.token; 
            return await this.http.get<Result<TopluRciModel>>(url).pipe( map((res:any)=> res));
    }

    async TopluRciGuncelle(data:TopluRciModel | undefined,sozlesme:OnKayit| undefined,list:TopluRciModel[]=[],tip:IslemTipi):Promise<ReturnValues>  {
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

      var result = await this.http.post<any>(this.semUrl+"/Anket/TopluRciGuncelle", body, options).toPromise();

      var sonuc = JSON.parse(JSON.stringify(result))['Model'];
      return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
    }

    async UyeTopluRCIEkle(list:TopluRciModel[]=[],tip:IslemTipi):Promise<ReturnValues>  {
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
          "Tip":  tip, 
          "Token":this.kullsrc.token,
        });

      var result = await this.http.post<any>(this.semUrl+"/Anket/UyeTopluRCIEkle", body, options).toPromise();

      var sonuc = JSON.parse(JSON.stringify(result))['Model'];
      return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
    }

    async FinansKasaVirman(kasaid:number,birim:string,list:FinansBakiyeModel[]=[],tarih:any):Promise<ReturnValues>  {
      const headers = new HttpHeaders(
        {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Headers': 'Content-Type',
       }
      );

        let options = { headers: headers };

        const body =  JSON.stringify({ 
          "KasaId":  kasaid,
          "Data":  list, 
          "Birim":  birim, 
          "Tarih":  tarih, 
          "Token":this.kullsrc.token,
        });

      var result = await this.http.post<any>(this.semUrl+"/Finans/FinansKasaVirman", body, options).toPromise();

      var sonuc = JSON.parse(JSON.stringify(result))['Model'];
      return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
    }

    async GetFinansIslemTipList()
      { 
           let url=this.semUrl+"/Finans/GetFinansIslemTipList?Token="+this.kullsrc.token; 
              return await this.http.get<Result<FinansHareketTipModel>>(url).pipe( map((res:any)=> res));
      }

      async FinansYevmiyeFisOlustur(list:FinansHareketModel[]=[]):Promise<ReturnValues>  {
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
  
        var result = await this.http.post<any>(this.semUrl+"/Finans/FinansYevmiyeFisOlustur", body, options).toPromise();
  
        var sonuc = JSON.parse(JSON.stringify(result))['Model'];
        return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
      }

      async FinansYevmiyeSatirIptal(list:FinansHareketModel[]=[]):Promise<ReturnValues>  {
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
  
        var result = await this.http.post<any>(this.semUrl+"/Finans/FinansYevmiyeSatirIptal", body, options).toPromise();
  
        var sonuc = JSON.parse(JSON.stringify(result))['Model'];
        return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
      }

      async FinansYevmiyeFisIptal(list:FinansHareketModel[]=[]):Promise<ReturnValues>  {
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
  
        var result = await this.http.post<any>(this.semUrl+"/Finans/FinansYevmiyeFisIptal", body, options).toPromise();
  
        var sonuc = JSON.parse(JSON.stringify(result))['Model'];
        return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
      }

      async FinansYevmiyeTersKayit(list:FinansHareketModel[]=[]):Promise<ReturnValues>  {
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
  
        var result = await this.http.post<any>(this.semUrl+"/Finans/FinansYevmiyeTersKayit", body, options).toPromise();
  
        var sonuc = JSON.parse(JSON.stringify(result))['Model'];
        return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
      }

      
      async GetAnlikBankaHareketList(hesapid:number,baslangic:any,bitis:any)
      { 
           let url=this.semUrl+"/Finans/GetAnlikBankaHareketList?HesapId="+hesapid+"&Baslangic="+baslangic+"&Bitis="+bitis+"&Token="+this.kullsrc.token; 
              return await this.http.get<Result<AnlikBankaModel>>(url).pipe( map((res:any)=> res));
      }

      async GetAnlikHareketLog(hesapid:number)
      { 
           let url=this.semUrl+"/Finans/GetAnlikHareketLog?HesapId="+hesapid+"&Token="+this.kullsrc.token; 
              return await this.http.get<Result<AnlikHareketLogModel>>(url).pipe( map((res:any)=> res));
      }

      async BankaExcelEslestirme(data:BankaExcelEslesitmeModel,tip:IslemTipi):Promise<ReturnValues>  {
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
  
        var result = await this.http.post<any>(this.semUrl+"/Muhasebe/BankaExcelEslestirme", body, options).toPromise();
  
        var sonuc = JSON.parse(JSON.stringify(result))['Model'];
        return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
      }

      async GetBankaExcelEslestirme(BankaKodu:string,Tumu:boolean)
      { 
           let url=this.semUrl+"/Muhasebe/GetBankaExcelEslestirme?BankaKodu="+BankaKodu+"&Tumu="+Tumu+"&Token="+this.kullsrc.token; 
              return await this.http.get<Result<BankaExcelEslesitmeModel>>(url).pipe( map((res:any)=> res));
      }

      async BankaEkstreYuke(formdata:FormData):Promise<ReturnValues>  {
        const headers = new HttpHeaders();
        let options = { headers: headers };
  
        formdata.append('token', this.kullsrc.token+"" );
  
        var result = await this.http.post<any>(this.semUrl+"/Finans/BankaEkstreYuke", formdata,options).toPromise();
  
        var sonuc = JSON.parse(JSON.stringify(result));
        return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
     } 

     async BankaEkstreGuncelle(data:BankaEkstreModel | undefined,list:BankaEkstreModel[],tip:IslemTipi):Promise<ReturnValues>  {
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

      var result = await this.http.post<any>(this.semUrl+"/Finans/BankaEkstreGuncelle", body, options).toPromise();

      var sonuc = JSON.parse(JSON.stringify(result))['Model'];
      return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
    }

    async BankaKuralCalistir(BankaKodu:string):Promise<ReturnValues>  {
      const headers = new HttpHeaders(
        {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Headers': 'Content-Type',
       }
      );

        let options = { headers: headers };

        const body =  JSON.stringify({   
          "BankaKodu":  BankaKodu,
          "Token":this.kullsrc.token,
        });

      var result = await this.http.post<any>(this.semUrl+"/Finans/BankaKuralCalistir", body, options).toPromise();

      var sonuc = JSON.parse(JSON.stringify(result))['Model'];
      return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
    }

    async SapBankaEkstreAktarim(list:BankaEkstreModel[]):Promise<ReturnValues>  {
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

      var result = await this.http.post<any>(this.semUrl+"/Finans/SapBankaEkstreAktarim", body, options).toPromise();

      var sonuc = JSON.parse(JSON.stringify(result))['Model'];
      return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
    }

    async BankaEkstreWebServisAktarim():Promise<ReturnValues>  {
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

      var result = await this.http.post<any>(this.semUrl+"/Finans/BankaEkstreWebServisAktarim", body, options).toPromise();

      var sonuc = JSON.parse(JSON.stringify(result))['Model'];
      return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
    }

    async BankaSenetAidatWebServis():Promise<ReturnValues>  {
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

      var result = await this.http.post<any>(this.semUrl+"/Finans/BankaSenetAidatWebServis", body, options).toPromise();

      var sonuc = JSON.parse(JSON.stringify(result))['Model'];
      return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
    }

      async GetBankaEkstre(durumtip:number,bankakodu:string,hesapid:number,baslangic:any,bitis:any,AktarimTip:string,FinansKontrol:number)
      { 
           let url=this.semUrl+"/Finans/GetBankaEkstre?DurumTip="+durumtip+"&BankaKodu="+bankakodu+"&HesapId="+hesapid+"&Baslangic="+baslangic+"&Bitis="+bitis+"&Token="+this.kullsrc.token+"&AktarimTip="+AktarimTip+"&FinansKontrol="+FinansKontrol; 
              return await this.http.get<Result<BankaEkstreModel>>(url).pipe( map((res:any)=> res));
      }

      async BankaEkstreHareketGuncelle(data:BankaEkstreModel[],FinansKontrol:number):Promise<ReturnValues>  {
        const headers = new HttpHeaders(
          {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Headers': 'Content-Type',
         }
        );
  
          let options = { headers: headers };
  
          const body =  JSON.stringify({  
            "List":  data,  
            "FinansKontrol":  FinansKontrol,  
            "Token":this.kullsrc.token,
          });
  
        var result = await this.http.post<any>(this.semUrl+"/Finans/BankaEkstreHareketGuncelle", body, options).toPromise();
  
        var sonuc = JSON.parse(JSON.stringify(result))['Model'];
        return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
      }

      async   BankaEkstreKuralTanim(data:BankaEkstreKuralModel,tip:IslemTipi):Promise<ReturnValues>  {
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
            "Tip":tip,
            "Token":this.kullsrc.token,
          });
  
        var result = await this.http.post<any>(this.semUrl+"/Muhasebe/BankaEkstreKuralTanim", body, options).toPromise();
  
        var sonuc = JSON.parse(JSON.stringify(result))['Model'];
        return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
      }

      async GetBankaEkstreKural(BankaKodu:string,id:number)
      { 
           let url=this.semUrl+"/Muhasebe/GetBankaEkstreKural?BankaKodu="+BankaKodu+"&DocEntry="+id+"&Token="+this.kullsrc.token; 
              return await this.http.get<Result<BankaEkstreKuralModel>>(url).pipe( map((res:any)=> res));
      }

      async CekKocanTanim(data:CekKocanModel,tip:IslemTipi):Promise<ReturnValues>  {
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
            "Tip":tip,
            "Token":this.kullsrc.token,
          });
  
        var result = await this.http.post<any>(this.semUrl+"/Finans/CekKocanTanim", body, options).toPromise();
  
        var sonuc = JSON.parse(JSON.stringify(result))['Model'];
        return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
      }

      async GetCekKocanList(BankaKodu:string,SubeKodu:string,SubeId:number)
      { 
           let url=this.semUrl+"/Finans/GetCekKocanList?BankaKodu="+BankaKodu+"&SubeKodu="+SubeKodu+"&SubeId="+SubeId+"&Token="+this.kullsrc.token; 
              return await this.http.get<Result<CekKocanModel>>(url).pipe( map((res:any)=> res));
      }

      async CekTanim(data:CekTanimModel,list:CekTanimModel[]=[],tip:IslemTipi,aciklama:string=""):Promise<ReturnValues>  {
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
            "Tip":tip,
            "Aciklama":aciklama,
            "Token":this.kullsrc.token,
          });
  
        var result = await this.http.post<any>(this.semUrl+"/Finans/CekTanim", body, options).toPromise();
  
        var sonuc = JSON.parse(JSON.stringify(result))['Model'];
        return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
      }

      async GetCekList(BankaKodu:string,SubeKodu:string,SubeId:number)
      { 
           let url=this.semUrl+"/Finans/GetCekList?BankaKodu="+BankaKodu+"&SubeKodu="+SubeKodu+"&SubeId="+SubeId+"&Token="+this.kullsrc.token; 
              return await this.http.get<Result<CekTanimModel>>(url).pipe( map((res:any)=> res));
      }

      async CekSeriEkle(data:CekKocanModel,SeriBas:number,SeriBit:number):Promise<ReturnValues>  {
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
            "SeriBas":SeriBas,
            "SeriBit":SeriBit,
            "Token":this.kullsrc.token,
          });
  
        var result = await this.http.post<any>(this.semUrl+"/Finans/CekSeriEkle", body, options).toPromise();
  
        var sonuc = JSON.parse(JSON.stringify(result))['Model'];
        return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
      }

      async CekCikisEkle(data:CekCikisModel,list:CekCikisModel[]=[],tip:IslemTipi,aciklama:string=""):Promise<ReturnValues>  {
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
            "Tip":tip,
            "Aciklama":aciklama,
            "Token":this.kullsrc.token,
          });
  
        var result = await this.http.post<any>(this.semUrl+"/Finans/CekCikisEkle", body, options).toPromise();
  
        var sonuc = JSON.parse(JSON.stringify(result))['Model'];
        return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
      }

      async GetCekCikisList()
      { 
           let url=this.semUrl+"/Finans/GetCekCikisList?Token="+this.kullsrc.token; 
              return await this.http.get<Result<CekCikisModel>>(url).pipe( map((res:any)=> res));
      }

      async CekFirmaCikis(list:CekCikisModel[]=[]):Promise<ReturnValues>  {
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
  
        var result = await this.http.post<any>(this.semUrl+"/Finans/CekFirmaCikis", body, options).toPromise();
  
        var sonuc = JSON.parse(JSON.stringify(result))['Model'];
        return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
      }

      async CekFirmaCikisIptal(list:CekCikisModel[]=[]):Promise<ReturnValues>  {
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
  
        var result = await this.http.post<any>(this.semUrl+"/Finans/CekFirmaCikisIptal", body, options).toPromise();
  
        var sonuc = JSON.parse(JSON.stringify(result))['Model'];
        return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
      }

      async SenetTopluMakbuzYazdir(odeme:FinansHareketModel[]):Promise<ReturnValues>  {
        const headers = new HttpHeaders(
          {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Headers': 'Content-Type',
         }
        ); 
      
          let options = { headers: headers };
      
          const body =  JSON.stringify({ 
            "Data":  odeme,    
            "Token":this.kullsrc.token, 
          });
      
        var result = await this.http.post<any>(this.semUrl+"/Finans/SenetTopluMakbuzYazdir", body, options).toPromise();
      
        var sonuc = JSON.parse(JSON.stringify(result))['Model'];
        return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
      }
      
      async KrediKartCikisEkle(data:KrediKartCikisModel,list:KrediKartCikisModel[]=[],tip:IslemTipi,aciklama:string=""):Promise<ReturnValues>  {
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
            "Tip":tip,
            "Aciklama":aciklama,
            "Token":this.kullsrc.token,
          });
  
        var result = await this.http.post<any>(this.semUrl+"/Finans/KrediKartCikisEkle", body, options).toPromise();
  
        var sonuc = JSON.parse(JSON.stringify(result))['Model'];
        return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
      }

      async GetKrediKartCikisList()
      { 
           let url=this.semUrl+"/Finans/GetKrediKartCikisList?Token="+this.kullsrc.token; 
              return await this.http.get<Result<KrediKartCikisModel>>(url).pipe( map((res:any)=> res));
      }
      async KrediKartFirmaCikis(list:KrediKartCikisModel[]=[]):Promise<ReturnValues>  {
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
  
        var result = await this.http.post<any>(this.semUrl+"/Finans/KrediKartFirmaCikis", body, options).toPromise();
  
        var sonuc = JSON.parse(JSON.stringify(result))['Model'];
        return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
      }

      async KrediKartFirmaCikisIptal(list:KrediKartCikisModel[]=[]):Promise<ReturnValues>  {
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
  
        var result = await this.http.post<any>(this.semUrl+"/Finans/KrediKartFirmaCikisIptal", body, options).toPromise();
  
        var sonuc = JSON.parse(JSON.stringify(result))['Model'];
        return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
      }

      async ElektraFaturaAktarimList(tip:string,baslangic:Date,hotelid:string,sapsubeid:number)
      { 
           let url=this.semUrl+"/Muhasebe/ElektraFaturaAktarimList?Tur="+ tip+"&BasTarih="+moment(baslangic).format("yyyy-MM-DD")+"&HotelId="+hotelid+"&SapSube="+sapsubeid+"&Token="+ this.kullsrc.token; 
              return await this.http.get<Result<ElkFatura>>(url).pipe( map((res:any)=> res));
      }

      async GetHotelSubeElektra()
      { 
           let url=this.semUrl+"/Muhasebe/GetHotelSubeElektra?Token="+ this.kullsrc.token; 
              return await this.http.get<Result<SirketYetki>>(url).pipe( map((res:any)=> res));
      }

      async EntegrasyonFaturaAktarim(data:ElkFatura[],Tur:string,SapSubeId:number):Promise<ReturnValues>  {
        const headers = new HttpHeaders(
          {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Headers': 'Content-Type',
         }
        );
  
          let options = { headers: headers };
  
          const body =  JSON.stringify({  
            "List":  data,  
            "Tur":Tur,
            "SapSubeId":SapSubeId,
            "Token":this.kullsrc.token,
          });
  
        var result = await this.http.post<any>(this.semUrl+"/Muhasebe/EntegrasyonFaturaAktarim", body, options).toPromise();
  
        var sonuc = JSON.parse(JSON.stringify(result))['Model'];
        return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
      }

      async EntFinansYevmiyeFisIptal(list:ElkFatura[]=[]):Promise<ReturnValues>  {
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
  
        var result = await this.http.post<any>(this.semUrl+"/Muhasebe/EntFinansYevmiyeFisIptal", body, options).toPromise();
  
        var sonuc = JSON.parse(JSON.stringify(result))['Model'];
        return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
      }

      async TopluSozlesemeDurumUpload(formdata:FormData):Promise<ReturnValues>  {
        const headers = new HttpHeaders(); 
        let options = { headers: headers }; 
  
        formdata.append('token', this.kullsrc.token+"" );
  
        var result = await this.http.post<any>(this.semUrl+"/Anket/TopluSozlesemeDurumUpload", formdata,options).toPromise();
  
        var sonuc = JSON.parse(JSON.stringify(result));
        return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
     } 

     async SanalPosOdemeSorgula(data:OnKayit,Tutar:number,BankaId:number,OdemeId:string):Promise<ReturnValues>  {
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
          "Tutar":  Tutar,   
          "BankaId":  BankaId,   
          "Data":  data,   
          "OdemeId":  OdemeId,   
          "Dahili":  dahili,  
          "Token":this.kullsrc.token,
        });

      var result = await this.http.post<any>(this.semUrl+"/Finans/SanalPosOdemeSorgula", body, options).toPromise();

      var sonuc = JSON.parse(JSON.stringify(result))['Model'];
      return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
    }
 
    async SanalPosOdemeTamamla(data:OnKayit,Tutar:number,BankaId:number,OdemeTesisId:number,odemelist:SanalPosOdemeBekleyenModel[]=[],OdemeId:string):Promise<ReturnValues>  {
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
          "Tutar":  Tutar,   
          "BankaId":  BankaId,   
          "OdemeTesisId":  OdemeTesisId,   
          "Data":  data,   
          "List":  odemelist,   
          "Dahili":  dahili,   
          "OdemeId":  OdemeId,   
          "Token":this.kullsrc.token,
        });

      var result = await this.http.post<any>(this.semUrl+"/Finans/SanalPosOdemeTamamla", body, options).toPromise();

      var sonuc = JSON.parse(JSON.stringify(result))['Model'];
      return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
    }

    async SanalPosExecute(santralsunucu:string,CallId:string)
      { 
        const headers = new HttpHeaders(); 
        let options = { headers: headers }; 
           let url="https://"+santralsunucu+"/ami.php?xcallid="+CallId; 
           var result = await this.http.post<any>(url,{},options).toPromise();

      }

      async NtxSanalPosExecute(tutar:number,sozlesmeno:string,terminalid:string)
      { 
        var dahili = sessionStorage.getItem("Dahili")??"";
        var empid = sessionStorage.getItem("EmpId")??"";
        const headers = new HttpHeaders(); 
        let options = { headers: headers }; 
        let url="https://karaderilisantral.nitelix.com/apiv2/ccivr?cmd=submit&extension="+dahili+"&txId="+terminalid+"&userId="+empid+"&terminalId="+terminalid+"&amount="+tutar.toFixed(0)+"&data="+sozlesmeno+""; 
        var result = await this.http.post<any>(url,{},options).toPromise();

      }

      async NtxSanalPosExecute2(tutar:number,sozlesmeno:string,terminalid:string)
      { 
       try{
        var dahili = sessionStorage.getItem("Dahili")??"";
        var empid = sessionStorage.getItem("EmpId")??"";
  
        const headers = new HttpHeaders(
          {
            'Content-Type': 'multipart/form-data' 
         }
        );
  
          let options = { headers: headers };
   
          const body =  JSON.stringify({
            "cmd":  "submit", 
            "extension":  dahili, 
            "txId":  terminalid, 
            "userId":  empid, 
            "amount":  tutar.toFixed(2),
            "terminalId":  terminalid,
            "data":  sozlesmeno
          }); 
  
         var result = await this.http.post("https://karaderilisantral.nitelix.com/apiv2/ccivr/", body, options); 
       }
       catch(e){}
      }

      async SanalPosOdemeKapat(OdemeId:string):Promise<ReturnValues>  {
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
            "Dahili":  dahili,     
            "OdemeId":  OdemeId,     
            "Token":this.kullsrc.token,
          });
  
        var result = await this.http.post<any>(this.semUrl+"/Finans/SanalPosOdemeKapat", body, options).toPromise();
  
        var sonuc = JSON.parse(JSON.stringify(result))['Model'];
        return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
      }

      

      async GetSantralAdi(Santral:string,DisHatId:string)
      { 
      let url=this.semUrl+"/Santral/GetSantralAdi?Santral="+Santral+"&DisHatId="+ DisHatId+"&Token="+ this.kullsrc.token;
        return this.http.get<Result<string>>(url).pipe(map((res: any) => res));
      }  

      async TekrarEdenTalep(data:TekrarEdenTalepModel,tip:IslemTipi,aciklama:string=""):Promise<ReturnValues>  {
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
            "Tip":tip,
            "Aciklama":aciklama,
            "Token":this.kullsrc.token,
          });
  
        var result = await this.http.post<any>(this.semUrl+"/Finans/TekrarEdenTalep", body, options).toPromise();
  
        var sonuc = JSON.parse(JSON.stringify(result))['Model'];
        return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
      }

      async GetTekrarEdenTalep()
      { 
           let url=this.semUrl+"/Finans/GetTekrarEdenTalep?Token="+this.kullsrc.token; 
              return await this.http.get<Result<TekrarEdenTalepModel>>(url).pipe( map((res:any)=> res));
      }

      async OdemeTalep(data:OdemeTalepModel | undefined,List:OdemeTalepModel[],tip:IslemTipi,aciklama:string=""):Promise<ReturnValues>  {
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
            "List":  List,    
            "Tip":tip,
            "Aciklama":aciklama,
            "Token":this.kullsrc.token,
          });
  
        var result = await this.http.post<any>(this.semUrl+"/Finans/OdemeTalep", body, options).toPromise();
  
        var sonuc = JSON.parse(JSON.stringify(result))['Model'];
        return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
      }

      async GetOdemeTalep(DocEntry:number,DurumId:number,baslangic:Date,bitis:Date)
      { 
           let url=this.semUrl+"/Finans/GetOdemeTalep?DocEntry="+DocEntry+"&DurumId="+DurumId+"&Token="+this.kullsrc.token+"&Baslangic="+moment(baslangic).format("yyyy-MM-DD")+"&Bitis="+moment(bitis).format("yyyy-MM-DD"); 
              return await this.http.get<Result<OdemeTalepModel>>(url).pipe( map((res:any)=> res));
      }

      async OdemeTalepManuel(data:OdemeTalepModel,aciklama:string=""):Promise<ReturnValues>  {
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
            "Aciklama":aciklama,
            "Token":this.kullsrc.token,
          });
  
        var result = await this.http.post<any>(this.semUrl+"/Finans/OdemeTalepManuel", body, options).toPromise();
  
        var sonuc = JSON.parse(JSON.stringify(result))['Model'];
        return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
      }

      async OdemeTalepRevize(data:OdemeTalepModel | undefined,List:OdemeTalepModel[],tip:IslemTipi,aciklama:string=""):Promise<ReturnValues>  {
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
            "List":  List,    
            "Tip":tip,
            "Aciklama":aciklama,
            "Token":this.kullsrc.token,
          });
  
        var result = await this.http.post<any>(this.semUrl+"/Finans/OdemeTalepRevize", body, options).toPromise();
  
        var sonuc = JSON.parse(JSON.stringify(result))['Model'];
        return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
      }

      async OdemeKapat(List:OdemeTalepModel[]):Promise<ReturnValues>  {
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
  
        var result = await this.http.post<any>(this.semUrl+"/Finans/OdemeKapat", body, options).toPromise();
  
        var sonuc = JSON.parse(JSON.stringify(result))['Model'];
        return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
      } 

      async OdemeEmir(Data:OdemeEmirModel,List:OdemeTalepModel[]):Promise<ReturnValues>  {
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
            "List":List, 
            "Token":this.kullsrc.token,
          });
  
        var result = await this.http.post<any>(this.semUrl+"/Finans/OdemeEmir", body, options).toPromise();
  
        var sonuc = JSON.parse(JSON.stringify(result))['Model'];
        return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
      }

      async GetAnaBankaHesaplar(DocEntry:number)
      { 
           let url=this.semUrl+"/Finans/GetAnaBankaHesaplar?DocEntry="+DocEntry+"&Token="+this.kullsrc.token; 
              return await this.http.get<Result<AnaBankaHesapModel>>(url).pipe( map((res:any)=> res));
      }

      async AnaBankaHesapGuncelle(Data:AnaBankaHesapModel):Promise<ReturnValues>  {
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
  
        var result = await this.http.post<any>(this.semUrl+"/Finans/AnaBankaHesapGuncelle", body, options).toPromise();
  
        var sonuc = JSON.parse(JSON.stringify(result))['Model'];
        return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
      }

      async ElektraPosSatisAdetList(BasTarih:any,BitTarih:any,SubeId:number):Promise<ReturnValues>  {
        const headers = new HttpHeaders(
          {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Headers': 'Content-Type',
         }
        );
  
          let options = { headers: headers };
  
          const body =  JSON.stringify({  
            "BasTarih":  BasTarih,  
            "BitTarih":  BitTarih,  
            "SubeId":  SubeId,  
            "Token":this.kullsrc.token,
          });
  
        var result = await this.http.post<any>(this.semUrl+"/Muhasebe/ElektraPosSatisAdetList", body, options).toPromise();
  
        var sonuc = JSON.parse(JSON.stringify(result))['Model'];
        return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
      }

      async GetAnaBankaHesapBakiye(DocEntry:number)
      { 
           let url=this.semUrl+"/Finans/GetAnaBankaHesapBakiye?DocEntry="+DocEntry+"&Token="+this.kullsrc.token; 
              return await this.http.get<Result<AnaBankaHesapModel>>(url).pipe( map((res:any)=> res));
      }

      async GetKasaBakiyeOzet(DocEntry:number)
      { 
           let url=this.semUrl+"/Finans/GetKasaBakiyeOzet?DocEntry="+DocEntry+"&Token="+this.kullsrc.token; 
              return await this.http.get<Result<FinansBakiyeModel>>(url).pipe( map((res:any)=> res));
      }

      async AnaBankaBakiyeGuncelle(Data:AnaBankaHesapModel):Promise<ReturnValues>  {
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
  
        var result = await this.http.post<any>(this.semUrl+"/Finans/AnaBankaBakiyeGuncelle", body, options).toPromise();
  
        var sonuc = JSON.parse(JSON.stringify(result))['Model'];
        return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
      }

      async FinansBalansEkle(data:FinansBalansModel | undefined,List:FinansBalansModel[],tip:IslemTipi,aciklama:string=""):Promise<ReturnValues>  {
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
            "List":  List,    
            "Tip":tip,
            "Aciklama":aciklama,
            "Token":this.kullsrc.token,
          });
  
        var result = await this.http.post<any>(this.semUrl+"/Finans/FinansBalansEkle", body, options).toPromise();
  
        var sonuc = JSON.parse(JSON.stringify(result))['Model'];
        return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
      }

      async GetFinansBalans(DocEntry:number,DurumId:number,baslangic:Date,bitis:Date)
      { 
           let url=this.semUrl+"/Finans/GetFinansBalans?DocEntry="+DocEntry+"&DurumId="+DurumId+"&Token="+this.kullsrc.token+"&Baslangic="+moment(baslangic).format("yyyy-MM-DD")+"&Bitis="+moment(bitis).format("yyyy-MM-DD"); 
              return await this.http.get<Result<FinansBalansModel>>(url).pipe( map((res:any)=> res));
      }

      async BalansDataOlustur():Promise<ReturnValues>  {
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
  
        var result = await this.http.post<any>(this.semUrl+"/Finans/BalansDataOlustur", body, options).toPromise();
  
        var sonuc = JSON.parse(JSON.stringify(result))['Model'];
        return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
      }

      async BalansGunSonuOlustur(Tarih:any):Promise<ReturnValues>  {
        const headers = new HttpHeaders(
          {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Headers': 'Content-Type',
          }
        );
  
          let options = { headers: headers };
  
          const body =  JSON.stringify({   
            "Tarih":Tarih,
            "Token":this.kullsrc.token,
          });
  
        var result = await this.http.post<any>(this.semUrl+"/Finans/BalansGunSonuOlustur", body, options).toPromise();
  
        var sonuc = JSON.parse(JSON.stringify(result))['Model'];
        return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
      }

      async FinansOdemeNoOlustur():Promise<ReturnValues>  {
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
  
        var result = await this.http.post<any>(this.semUrl+"/Finans/FinansOdemeNoOlustur", body, options).toPromise();
  
        var sonuc = JSON.parse(JSON.stringify(result))['Model'];
        return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
      }

      async GetOdemeEslestirmeList(HesapId:number)
      { 
           let url=this.semUrl+"/Finans/GetOdemeEslestirmeList?HesapId="+HesapId+"&Token="+this.kullsrc.token; 
              return await this.http.get<Result<FinansHareketModel[]>>(url).pipe( map((res:any)=> res));
      }

      async FinansOdemeEslestir(EkstreId:number,FharId:number,DurumId:number):Promise<ReturnValues>  {
        const headers = new HttpHeaders(
          {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Headers': 'Content-Type',
          }
        );
  
          let options = { headers: headers };
  
          const body =  JSON.stringify({   
            "EkstreId":EkstreId,
            "FharId":FharId,
            "DurumId":DurumId,
            "Token":this.kullsrc.token,
          });
  
        var result = await this.http.post<any>(this.semUrl+"/Finans/FinansOdemeEslestir", body, options).toPromise();
  
        var sonuc = JSON.parse(JSON.stringify(result))['Model'];
        return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
      }

      async DemirbasCezaEkle(Data:DemibasData,Zimmet:DemirbasZimmetModel,Aciklama:string,Tutar:number):Promise<ReturnValues>  {
        const headers = new HttpHeaders(
          {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Headers': 'Content-Type',
          }
        );
  
          let options = { headers: headers };
  
          const body =  JSON.stringify({   
            "Data":Data,
            "Zimmet":Zimmet,
            "Aciklama":Aciklama,
            "Tutar":Tutar,
            "Token":this.kullsrc.token,
          });
  
        var result = await this.http.post<any>(this.semUrl+"/Finans/DemirbasCezaEkle", body, options).toPromise();
  
        var sonuc = JSON.parse(JSON.stringify(result))['Model'];
        return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
      }
  }  
  

  export class FinansBalansModel {    
    DocEntry:number=0;        
    Tarih:any;
    IslemTipId:number=0;        
    IslemTip:string="";               
    Tanim:string="";               
    Birim:string="";               
    HesapId: number = 0;
    Tutar: number = 0;
    GirisTutar: number = 0;
    CikisTutar: number = 0;
    ParaBirim:string="";  
    Kur: number = 0;
    Aciklama:string=""; 
    DataAktarimTarih:string=""; 
    GC:string=""; 
    BalansTipId: number = 0;
    BalansTip:string=""; 
    SatirGuid:string=""; 

    Aktif:boolean=false;
    EkleyenId: number = 0;
    Ekleyen: string = '';
    GuncelleyenId: number = 0;
    Guncelleyen: string = '';
    Kayit: Date = new Date();
    Guncelleme: Date = new Date();  
  }
  export class AnaBankaHesapModel {     
    AbsEntry:any;      
    HesapKodu:string="";
    HesapAdi:string="";
    BankaKodu:string="";
    Banka:string="";
    BankaSube:string="";
    SirketAdi:string="";
    WebServisDurum:string="";
    Iban:string="";
    KisaAd:string="";
    WebGoster:string="";
    Boyut1:string="";
    Boyut2:string="";
    Boyut3:string="";
    SanalPos:string="";
    DtsSanalPosId:number=0;
    SapSubeId:number=0;
    Kategori1:string="";
    Kategori2:string=""; 
    AidatHesap:string=""; 
    Aktif:string=""; 
    MusteriNo:string=""; 
    UserName:string=""; 
    Pass:string=""; 
    Bakiye:number=0;
    KulBakiye:number=0;
    BlokeBakiye:number=0;
    HacizBakiye:number=0;
    KrediBakiye:number=0;
    SonAktarimTarih:string="";
    AktarimHesapTipi:string="";
    WebServisMesaj:string="";
  }

  export class OdemeEmirModel {     
    OdemeTarih:any;                  
    IslemBirimId: number = 0;
    DetayAciklamaId: number = 0;
    HesapId: number = 0; 
    Aciklama:string="";
    KarsiHesapKodu:string="";
    KarsiHesapAdi:string="";
    KarsiHesapId:number=0;
    Birim:string="";
    ToplamTutar:number=0;
    ListToplamTutar:number=0;
    OdemeTurId:number=0;
    BankaOdemeKod:string="";
    ParaBirim:string="";
    HesapKodu:string="";
    Aktif:boolean=true;
    Tarih:any;
    SapSubeId: number = 0;
    Tutar: number = 0;
    BakiyeHesapId: number = 0;
    ManagerId: number = 0;
    DepartmanId: number = 0;
    BoyutId:string="";   
    HarcamaAlan:string="";    
    BorcAlacak:string="";   
    IsletmeKasaCikisTip: number = 0;
    AraHesapId: number = 0;
    AraHesapKodu:string="";   
    AraHesapAdi:string="";  
    BelgeTur : number = 0;
    SurecId : number = 0;
    AltSurecId : number = 0;
    BelgeNo:string="";   
    KarsiIslemTip: number = 0;
    Kdv1: number = 0;
    Kdv8: number = 0;
    Kdv18: number = 0;
    DonemId: number = 0;
    AltDonemId : number = 0;
    OzelKod:string="";  
    KrediKartNo:string="";  
    Ekran: number = 0;
    IsletmeKasaTip: number = 0;
    datakey:string="";  
    Beklemede:number=0;
    OdenecekBelge: FinansKarsiHesapModel[]=[]; 
  }

  // export class OdemeTalepModel {   
  //   semkey:string=""; 
  //   DocEntry:number=0;        
  //   IslemTipId:number=0;        
  //   IslemTip:string="";               
  //   OdemeSekliId: number = 0;
  //   OdemeHesapId: number = 0;
  //   Tarih:any;
  //   VadeTarih:any;
  //   OnaylananVadeTarih:any;
  //   OdemeTarih:any;
  //   Tutar: number = 0;
  //   OnaylananTutar: number = 0;
  //   OdemeToplam: number = 0;
  //   Kalan: number = 0;
  //   Aciklama:string="";  
  //   SapSubeId:number=0;        
  //   SapSube:string=""; 
  //   HesapKodu:string="";   
  //   CariMuhasebe:string="";   
  //   HesapAdi:string=""; 
  //   KarsiHesapKodu:string="";   
  //   KarsiHesapAdi:string=""; 
  //   Kaynak: number = 0;
  //   DurumId: number = 0;
  //   Durum:string="";   
  //   OnayDurum:string="";   
  //   SapYevmiyeNo: number = 0;
  //   ParaBirim:string="";   
  //   Aktif:boolean=false;  
  //   OdemeYapanId: number = 0;
  //   OdemeYapan: string = ''; 
  //   OnayId: number = 0;
  //   EkleyenId: number = 0;
  //   Ekleyen: string = '';
  //   GuncelleyenId: number = 0;
  //   Guncelleyen: string = '';
  //   Kayit: Date = new Date();
  //   Guncelleme: Date = new Date(); 
  //   Yil: number = 0;
  //   Ay: number = 0;
  //   Hafta: number = 0;
  //   OdemePlanToplam: number = 0;
  // }

  export class OdemeTalepModel {   
    semkey:string=""; 
    DocEntry:number=0;        
    IslemTipId:number=0;        
    IslemTip:string="";               
    OdemeSekliId: number = 0;
    OdemeHesapId: number = 0;
    Tarih:any;
    VadeTarih:any;
    OnaylananVadeTarih:any;
    OdemeTarih:any;
    Tutar: number = 0;
    OnaylananTutar: number = 0;
    OdemeToplam: number = 0;
    Kalan: number = 0;
    Aciklama:string="";  
    SapSubeId:number=0;        
    SapSube:string=""; 
    HesapKodu:string="";   
    CariMuhasebe:string="";   
    HesapAdi:string=""; 
    KarsiHesapKodu:string="";   
    KarsiHesapAdi:string=""; 
    Kaynak: number = 0;
    DurumId: number = 0;
    Durum:string="";   
    OnayDurum:string="";   
    SapYevmiyeNo: number = 0;
    ParaBirim:string="";   
    Aktif:boolean=false;  
    OdemeYapanId: number = 0;
    OdemeYapan: string = ''; 
    OnayId: number = 0;
    EkleyenId: number = 0;
    Ekleyen: string = '';
    GuncelleyenId: number = 0;
    Guncelleyen: string = '';
    Kayit: Date = new Date();
    Guncelleme: Date = new Date(); 
    Yil: number = 0;
    Ay: number = 0;
    Hafta: number = 0;
    OdemePlanToplam: number = 0;
    BelgeNo: string=""; 
    SatirGuid: string=""; 
  }
  export class TekrarEdenTalepModel {    
    DocEntry:number=0;   
    IslemTipId:number=0;        
    IslemTip:string="";       
    AyinGunu:number=0;        
    Aciklama:string="";               
    Tutar: number = 0;
    BaslangicTarih:any;
    BitisTarih:any;
    HesapKodu:string="";   
    HesapAdi:string="";   
    CariMuhasebe:string="";
    ParaBirim:string="";   
    SapSubeId:number=0;        
    SapSube:string="";   
    Aktif:boolean=false;    
    EkleyenId: number = 0;
    Ekleyen: string = "";   
    GuncelleyenId: number = 0;
    Guncelleyen: string = "";   
    Kayit: Date = new Date();
    Guncelleme: Date = new Date(); 
  }
  export class ElkFatura {    
    SapSube:number=0;   
    Tarih:any; 
    HesapKodu:string="";  
    SapHesapKodu:string="";  
    SatirAciklama:string="";  
    Doviz:string="";  
    Borc:number=0;   
    Alacak:number=0;   
    Kur:number=0;   
    BaBsTutar:number=0;   
    OzelKod1:string="";  
    MasrafMerkezKod:string="";  
    Projekodu:string="";  
    BelgeKodu:string="";  
    YevmiyeNo:number=0;   
    KarsiYevmiyeNo:number=0;   
    HataAciklama:string=""; 
    DepartmanKodu:string="";
    GelirGrupkodu:string="";
    Boyut1:string="";
    Boyut2:string="";
    Boyut3:string="";
    HesapAdi:string="";
    SubeAdi:string="";
  }
  export class KrediKartCikisModel {    
    DocEntry:number=0;   
    OdemeTip:number=0; 
    OdemeTipStr:string="";  
    CikisTip:number=0;   
    CikisTipStr:string="";  
    KaynakSubeKod:number=0;   
    KaynakSubeAdi:string=""; 
    Kaynak393HesapKodu:string="";
    Kaynak320:string="";
    Kaynak120:string="";
    HedefSubeKod:number=0;   
    HedefSubeAdi:string="";
    Hedef393HesapKodu:string="";
    Hedef320:string=""; 
    Hedef120:string=""; 
    MuhatapKod:string=""; 
    MuhatapAdi:string=""; 
    KartAdi:string="";
    Fisno:number=0;   
    Tutar:number=0;   
    VadeTarih:any;   
    IslemTarih:any;   
    BankaSubeKodu:string="";
    BankaSubeAdi:string="";
    Aciklama:string=""; 
    YapilanOdemeNo:number=0;   
    Aktarimseviye:number=0;   
    AktarimHata:string=""; 
    Aktarildi:number=0;   
    Silindi:number=0;   
    AktarimTarih:any;
    OzelKod:string=""; 
    AktaranId:number=0; 
    AktaranAd:string=""; 
    Ekleyen:number=0; 
    EkleyenAd:string=""; 
    Guncelleyen:number=0; 
    GuncelleyenAd:string=""; 
    Kayit:Date=new Date();
    Guncelleme:Date=new Date();          
    PosId:number=0;   
    PosHesapKodu:number=0;   
    YevmiyeNo:number=0;   
    CariMuh:string="";
    TalepEden:string="";
    HesapKod:string="";
    HesapAdi:string="";
    BelgeEklendi:number=0;
  }

  export class CekCikisModel {    
    DocEntry:number=0;   
    OdemeTip:number=0;   
    CikisTip:number=0;   
    KaynakSubeKod:number=0;   
   
    KaynakSubeAdi:string=""; 
    Kaynak393HesapKodu:string="";
    Kaynak320:string="";
    Kaynak120:string="";
    HedefSubeKod:number=0;   
    HedefSubeAdi:string="";
    Hedef393HesapKodu:string="";
    Hedef320:string=""; 
    Hedef120:string=""; 
    MuhatapKod:string=""; 
    MuhatapAdi:string=""; 
    CekNo:number=0;   
    CekId:number=0;   
    Tutar:number=0;   
    VadeTarih:any;   
    IslemTarih:any;   
    BankaKodu:string="";
    BankaAdi:string="";
    BankaSubeKodu:string="";
    BankaSubeAdi:string="";
    Aciklama:string=""; 
    YapilanOdemeNo:number=0;   
    TahsilatNo:number=0;   
    IbrazNo:number=0;   
    Aktarimseviye:number=0;   
    AktarimHata:string=""; 
    Aktarildi:number=0;   
    Silindi:number=0;   
    AktarimTarih:any;
    OzelKod:string=""; 
    Sirket:string=""; 

    AktaranId:number=0; 
    AktaranAd:string=""; 
    Ekleyen:number=0; 
    EkleyenAd:string=""; 
    Guncelleyen:number=0; 
    GuncelleyenAd:string=""; 
    Kayit:Date=new Date();
    Guncelleme:Date=new Date();          
  }
  export class CekEkleModel {   
    SeriBas:number=0;   
    SeriBit:number=0;            
    Toplam:number=0;            
  }
  export class CekTanimModel {    
    DocEntry:number=0;   
    KocanId:number=0;   
    CekNo:number=0;   
    DurumId:number=0;  
    Durum:string=""; 
    CikisId:number=0;   
    IptalTarih:any;   
    IptalAciklama:string=""; 
    BankaKodu:string="";
    Banka:string="";
    SubeKodu:string="";
    BankaSubeAdi:string="";
    Adi:string="";
    SubeId:number=0;   
    Sube:string=""; 
    Aciklama:string=""; 
    Tutar:number=0;   
    VadeTarih:any; 
    MuhatapAdi:string=""; 
    BelgeEklendi:number=0;   
    Ekleyen:number=0; 
    EkleyenAd:string=""; 
    Guncelleyen:number=0; 
    GuncelleyenAd:string=""; 
    Kayit:Date=new Date();
    Guncelleme:Date=new Date();          
  }
  export class CekKocanModel {    
    DocEntry:number=0;   
    BankaKodu:string="";
    Banka:string="";
    SubeKodu:string="";
    BankaSubeAdi:string="";
    Adi:string="";
    SubeId:number=0;   
    Sube:string=""; 

    Ekleyen:number=0; 
    EkleyenAd:string=""; 
    Guncelleyen:number=0; 
    GuncelleyenAd:string=""; 
    Kayit:Date=new Date();
    Guncelleme:Date=new Date();          
  }
  export class BankaEkstreKuralModel {    
    DocEntry:number=0;   
    Kural1:string="";
    Kural2:string="";
    BankaKodu:string="";
    BankaAdi:string="";
    HesapKodu:string="";
    HesapAdi:string="";
    KarsitHesap:string="";
    KarsitHesapAdi:string="";
    CariMuhasebe:number=-1;   
    GirisCikis:number=0;   
    Oncelik:number=0;   
    Hesap1Cm:number=0;    
    HedefHesap:string="";
    HedefHesapAdi:string=""; 
    Hesap2Cm:number=0;    
    KarsiHedefHesap:string=""; 
    KarsiHedefHesapAdi:string="";  
    SubeId:number=0;   
    KarsiSubeId:number=0;   
    KarsiSube:string="";  
    TersKayit:boolean=false;  

    Ekleyen:number=0; 
    EkleyenAd:string=""; 
    Guncelleyen:number=0; 
    GuncelleyenAd:string=""; 
    Kayit:Date=new Date();
    Guncelleme:Date=new Date();          
  }
  export class BankaEkstreModel {    
    DocEntry:number=0;   
    BankaHesapId:number=0;   
    SubeId:number=0;   
    Sube:string="";
    BankaKod:string="";
    Banka:string="";
    BankaHesap:string="";
    HesapAdi:string=""; 
    Aktarildi:number=0;   
    KategoriId:number=0;  
    AktarimTip:number=0;
    Kategori:string=""; 
    IslemTarih:any;   
    VadeTarih:any;   
    Gelen:number=0;   
    Giden:number=0;   
    Tutar:number=0;   
    Aciklama:string="";
    FisDekontNo:string="";
    BorcAlacak:string="";
    Etiket:string="";
    OzelKod:string="";
    ParaBirim:string="";
    CariMuhasebe:number=0;   
    KuralId:number=0;   
    KarsiSubeId:number=0;
    KarsiSube:string="";
    KarsiHesapId:number=0;
    KarsiHesap:string="";
    KarsiHesapAdi:string=""; 
    Hesap1Cm:number=0;
    Hesap2Cm:number=0;
    TersKayitEkle:number=0;
    Hesap1Ba:string="";
    Hesap2Ba:string="";
    GirisCikis:number=0;
    YevmiyeNo:number=0; 
    HedefHesap:string=""; 
    HedefHesapAdi:string=""; 
    KarsiHedefHesap:string=""; 
    KarsiHedefHesapAdi:string="";  
    FinansKontrol:number=0; 
    BalansTipId:number=0; 
    BalansTip:string="";
    BalansDetayTipId:number=0; 
    BalansDetayTip:string="";
    BalansKuralId:number=0; 
    FharBaglantiId:number=0; 
    Ekleyen:number=0; 
    EkleyenAd:string=""; 
    Guncelleyen:number=0; 
    GuncelleyenAd:string=""; 
    Kayit:Date=new Date();
    Guncelleme:Date=new Date();          
  }
  export class BankaExcelEslesitmeModel {    
    DocEntry:number=0;   
    SatirGuid:string="";
    BankaKod:string="";
    BankaAdi:string="";
    HareketSatir:number=0;   
    IbanSatir:number=0;   
    IslemTarih:number=0;   
    VadeTarih:number=0;   
    Aciklama:number=0;   
    FisDekontNo:number=0;   
    Tutar:number=0;   
    BA:number=0;   
    Etiket:number=0;   
    DigitSeperator:number=0;
    Ekleyen:number=0; 
    EkleyenAd:string=""; 
    Guncelleyen:number=0; 
    GuncelleyenAd:string=""; 
    Kayit:Date=new Date();
    Guncelleme:Date=new Date();          
  }
  export class AnlikHareketLogModel {    
    Id:number=0;   
    HesapId:number=0;   
    U_WebAdi:string="";
    Aciklama:string="";
    UserId:string="";  
    IslemTarihi:any;        
  }
  export class AnlikBankaModel {     
    KayitNo:string="";
    IslemTarihi:any;    
    IslemTuru:string="";    
    BorcAlacak:string="";    
    Tutar:number=0;    
    MusteriReferans:string="";    
    KartNo:string="";    
    GonderenAd:string="";    
    GonderenBanka:string="";    
    GonderenSube:string="";    
    GonderenIban:string="";    
    IslemAciklamasi:string="";    
  }
  export class FinansHareketTipModel {     
    Kod:string="";
    Adi:string="";    
  }
  export class TopluRciModel {    
    DocEntry:number=0;
    Adi:string="";
    Soyadi:string="";   
    Telefon:string="";     
    City:string="";     
    Email:string="";     
    ResortId:string="";     
    WeekNumber:number=0;   
    UyelikNo:string="";
    UyelikTarih:any;
    Tip:number=0; 
    AktarimId:number=0; 
    EslesenSozlesmeId:number=0; 
    CokluEslesen:number=0; 
    DurumId:number=0; 
    DurumStr:string="";    
    SozlAdSoyad:string="";    
    SozlTckn:string="";    
    UyeSozlesmeNo:string="";    
    SatisTarih:any;    
    EkleyenId:number=0; 
    Ekleyen:string=""; 
    AktaranId:number=0; 
    Aktaran:string=""; 
    CreateDate:Date=new Date();
    UpdateDate:Date=new Date(); 
  }

  export class KasaYazdirModel {  
    HesapId:number=0;  
    Tarih:any;   

    }

  export class TopluTahakkukModel {    
    DocEntry:number=0;
    semkey:string="";
    Tckn:string="";   
    empID:number=0;  
    TahakkukPersonel:string="";     
    Tutar:number=0; 
    DetayAciklamaId:number=0; 
    DetayAciklama:string="";
    Durum:number=0; 
    DurumStr:string="";    
    EkleyenId:number=0; 
    GuncelleyenId:number=0; 
    Ekleyen:string=""; 
    Guncelleyen:string=""; 
    CreateDate:Date=new Date();
    UpdateDate:Date=new Date(); 
  }
  export class TopluSenetEslestirmeModel {    
    Tarih!:Date;
    DocEntry:number=0;     
    DosyaAdi:string="";  
    AdSoyad:string="";
    SozlesmeNo:string="";
    UpgradeSozNo:string="";     
    Tckn:string="";  
    OdemeTarih!:Date;   
    Tutar:number=0;
    BankaTutar:number=0;
    Iban:string="";
    Aciklama:string="";   
    OdemeSekli:string="";  
    EslesenSozlesme:number=0;
    CokluEslesen:number=0;
    Durum:string=""
    EslesmeYontem:string="";
    
    SozlAdSoyad:string=""; 
    SozlTckn:string=""; 
    SozlParaBirim:string=""; 
    TahsilatPersonel:string=""; 
    AidatPersonel:string=""; 
    SatisTarih:any; 
    SorumluBirim:number=0;
    UyeSozlesmeNo:string="";
    semkey:string=""; 
    Il:string=""; 
    Ilce:string=""; 
    MedeniDurum:string=""; 
    Cash:string=""; 
    Kick:string=""; 
    KalanOdeme:number=0;  
    SenetSayi:number=0; 
    OdemeToplam:number=0; 
    GecikenTutar:number=0; 
    SozlesmeSatisTutar:number=0; 
    SozlesmeTutar:number=0; 
    OdenenSenet:number=0; 
    OdemeYuzde:number=0; 
    OdenenenTutar:number=0;

    OdemeYontemId: number = 0; 
    HesapKodu:string="";
    HesapAdi:string="";
    KasaAktarimId: number = 0;
    HesapId: number = 0;
    Birim:string="";
    ParaBirim:string="";
    HataliDurum:number=0;

    Bolum: number = 0;
    AidatId: number = 0;
    TesisId: number = 0;
    Tesis:string="";
    BilinmeyenAktarimAciklama:string="";
    AdiatYil:any;
    
    Ekleyen:number=0; 
    EkleyenAd:string="";
    Guncelleyen:number=0;
    GuncelleyenAd:string="";
    Kayit:Date=new Date();
    Guncelleme:Date=new Date();
    HesapSubeId:number=0;
  }
  export class UyeAidatTahsilatModel {    
    semkey:string="";
    DocEntry:number=0;     
    SozlesmeId:number=0;   
    KarsiHesapAdi:string="";
    KarsiHesapKodu:string="";
    Yil:string="";     
    TurId:number=0;
    Tur:string="";
    Tutar:number=0;   
    Odeme:number=0;   
    OdemeAidat:number=0;   
    OdemeAidatKapatma:number=0;   
    Kalan:number=0;   
    Aciklama:string="";   
    Adi:string=""; 
    SozlesmeNo:string="";
    Acente:string=""; 
    Aktif:boolean=false;
    Ekleyen:number=0; 
    EkleyenAd:string="";
    Guncelleyen:number=0;
    GuncelleyenAd:string="";
    Kayit:Date=new Date();
    Guncelleme:Date=new Date();
    Rezervasyon:number=0;   
    RezervasyonDurum:string="";  
    Tesis:string="";  
    Tckn:string="";  
    ParaBirim:string="";  
  }
  export class FinansBakiyeModel { 
    Code:number=0;    
    ParaBirim:string="";
    HesapAdi:string="";     
    HesapKodu:string="";     
    Sorumlu:string="";     
    Bakiye:number=0; 
    Virman:number=0; 
    SubeId:number=0; 
  }
  export class FinansIsAvansModel {    
    semkey:string="";
    Code:number=0;     
    DepartmanId:number=0;   
    Departman:string="";     
    KasaId:number=0;
    Kasa:string="";
    EmpId:number=0;   
    AdSoyad:string="";    
    SubeId:number=0;  
    Sube:string=""; 
    BoyutId:string="";
    Boyut:string=""; 
    Aciklama:string="";   
    Tarih:Date=new Date(); 
    Degisebilir:number=0;   
    BelgeNo:string="";   
    BelgeTur:number=0;    
    BelgeTurStr:string="";   
    HarcamaAlan:string="";   
    DonemId:number=0;    
    Donem:string="";      
    AltDonemId:number=0;    
    AltDonem:string=""; 
    YevmiyeNo:number=0;     
    Tutar:number=0; 
    Toplam:number=0; 
    OdemeTurId:number=0; 
    OdemeTuru:string=""; 
    KarsiIslemTip:number=0;
    KarsiIslemBaglantiId:number=0; 
    KarsiIslemBaglanti:string=""; 
    KarsiHesapKodu:string=""; 
    KarsiHesapAdi:string=""; 
    BorcAlacak:string=""; 
    Aktif:boolean=false;
    Ekleyen:number=0; 
    EkleyenAd:string="";
    Guncelleyen:number=0;
    GuncelleyenAd:string="";
    Kayit:Date=new Date();
    Guncelleme:Date=new Date();
  }
  export class FinansIsAvansDetayModel {    
    semkey:string="";
    Birim:string="";
    Sira:number=0;     
    Code:number=0;   
    Tarih:Date=new Date();  
    BaglantiId:number=0; 
    EkipId:number=0; 
    EmpId:number=0;   
    AdSoyad:string="";  
    TalepId:number=0; 
    KasaId:number=0; 
    KarsiKasaId:number=0; 
    Kasa:string=""; 
    HesapKodu:string=""; 
    HesapAdi:string=""; 
    KarsiHesapKodu:string=""; 
    KarsiHesapAdi:string="";  
    SubeId:number=0; 
    Sube:string="";; 
    BoyutId:string="";
    Boyut:string=""; 
    BakiyeHesapId:number=0; 
    BakiyeHesap:string=""; 
    BelgeNo:string="";
    BelgeTur:number=0; 
    BelgeTurStr:string="";
    DepartmanId:number=0; 
    Departman:string="";
    KarsiIslemId:number=0; 
    KarsiIslem:string="";
    HarcamaAlan:string="";
    Iade:number=0; 
    ManagerId:number=0; 
    Manager:string="";
    Aciklama:string="";  
    OdemeTurId:number=0; 
    OdemeTuru:string=""; 
    BorcAlacak:string=""; 
    Tutar:number=0; 
    Borc:number=0; 
    Alacak:number=0; 
    ParaBirim:string="";
    DonemId:number=0;    
    Donem:string="";      
    AltDonemId:number=0;    
    AltDonem:string=""; 
    YevmiyeNo:number=0;   
    KarsiIslemTip:number=0; 
    SurecId:number=0; 
    AltSurecId:number=0; 
    KarsiIslemBaglantiId:number=0; 
    KarsiIslemBaglanti:string=""; 
    MakbuzYazdirildi:boolean=false;
    MakbuzYazdiran:number=0;
    MakbuzYazdiranStr:string="";
    MakbuzYazdirTarih:Date=new Date();     
    Degisebilir:number=0;
    Aktif:boolean=false;
    Ekleyen:number=0; 
    EkleyenAd:string="";
    Guncelleyen:number=0;
    GuncelleyenAd:string="";
    Kayit:Date=new Date();
    Guncelleme:Date=new Date(); 
  }
  export class FinEvHakedisModel {    
    semkey:string="";
    DocEntry:number=0;     
    DepartmanId:number=0;   
    Departman:string=""; 
    BolgeId:string="00";    
    KasaId:number=0;
    Kasa:string="";
    EmpId:number=0;   
    AdSoyad:string="";    
    SubeId:number=0;  
    Sube:string=""; 
    BoyutId:string="";
    Boyut:string=""; 
    Aciklama:string="";   
    Tarih:Date=new Date(); 
    HerAyinKaci:number=0;   
    Kira:number=0;    
    Elektrik:number=0;    
    Dogalgaz:number=0;    
    Su:number=0;    
    Aidat:number=0;    
    Yol:number=0;    
    Toplam:number=0;
    Aktif:boolean=false;
    Ekleyen:number=0; 
    EkleyenAd:string="";
    Guncelleyen:number=0;
    GuncelleyenAd:string="";
    Kayit:Date=new Date();
    Guncelleme:Date=new Date();
  }
  export class FinTaahhukModel {    
    DocEntry:number=0;        
    semkey:string="";   
    Birim:string="";   
    IslemId:number=0;
    IslemAdi:string="";
    Tarih:Date=new Date(); 
    Fisno:string="";  
    SubeId:number=0;     
    Sube:string="";
    KasaId:number=0;     
    Kasa:string="";
    BoyutId:string="";     
    Boyut:string="";
    Aciklama:string="";
    DonemId:number=0;   
    AltDonemId:number=0;   
    SurecId:number=0;   
    Surec:string="";
    AltSurecId:number=0;   
    AltSurec:string="";
    BelgeNo:string="";
    Tutar:number=0;  
    BorcAlacak:string="";
    BelgeEklendi:number=0;  
    OdemeDurumId:number=0;  
    OdemeDurum:string="";
    OdemeId:number=0;  
    Aktif:boolean=false;
    Ekleyen:number=0; 
    EkleyenAd:string="";
    Guncelleyen:number=0;
    GuncelleyenAd:string="";
    Kayit:Date=new Date();
    Guncelleme:Date=new Date(); 
  }
  export class FinParametreModel {    
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
  export class FinAltSurecModel {    
    Code:number=0;     
    Adi:string="";  
    SurecId:number=0;     
    Surec:string="";   
    Aktif:boolean=false;
    Ekleyen:number=0; 
    EkleyenAd:string="";
    Guncelleyen:number=0;
    GuncelleyenAd:string="";
    Kayit:Date=new Date();
    Guncelleme:Date=new Date(); 
  }
  export class FinSurecModel {    
    Code:number=0;     
    Adi:string="";   
    TopluIslem:number=0;
    Aktif:boolean=false;
    Ekleyen:number=0; 
    EkleyenAd:string="";
    Guncelleyen:number=0;
    GuncelleyenAd:string="";
    Kayit:Date=new Date();
    Guncelleme:Date=new Date(); 
  }
  export class FinansDovizHesapModel {    
    Code:number=0;     
    HesapKodu:string=""; 
    HesapAdi:string="";     
    Aktif:boolean=false;
    Ekleyen:number=0; 
    EkleyenAd:string="";
    Guncelleyen:number=0;
    GuncelleyenAd:string="";
    Kayit:Date=new Date();
    Guncelleme:Date=new Date(); 
  }
  export class FinansPosHesapModel {    
    Code:number=0;     
    HesapKodu:string=""; 
    HesapAdi:string="";   
    SubeId:number=0;     
    Sube:string="";   
    Aktif:boolean=false;
    Ekleyen:number=0; 
    EkleyenAd:string="";
    Guncelleyen:number=0;
    GuncelleyenAd:string="";
    Kayit:Date=new Date();
    Guncelleme:Date=new Date(); 
  }
  export class FinansKarsiHesapModel {   
    semkey:string="";
    Code:number=0;    
    Kodu:string="";   
    Adi:string=""; 
    EkBilgi:string=""; 
    EkBilgi1:string=""; 
    EkBilgi2:string=""; 
    EkBilgi3:string="";
    EkBilgi4:string="";
    Tutar:number=0;  
    Odeme:number=0;  
    Kalan:number=0;  
    Donem:number=0;  
    AltDonem:number=0;  
  }
  export class FinansHareketModel {   
    semkey:string="";
    validkey:string="";
    datakey:string="";
    Birim:string="";
    BagliBirim:string="";
    KarsiBirim:string="";
    DocEntry:number=0; 
    Sira:number=0; 
    Tarih:any; 
    BaglantiId:number=0; 
    EkipId:number=0; 
    TalepId:number=0; 
    KasaId:number=0;
    Kasa:string=""; 
    Ekran:SistemEkran=0;
    BoyutId:string="";
    Boyut:string="";

    HesapId:number=0;   
    HesapKodu:string=""; 
    HesapAdi:string=""; 

    AraHesapId:number=0;   
    AraHesapKodu:string=""; 
    AraHesapAdi:string=""; 

    KarsiHesapId:number=0;    
    KarsiHesapKodu:string=""; 
    KarsiHesapAdi:string=""; 
    //KarsiIslemId:number=0; 
    //KarsiIslem:string="";

    DetayAciklamaId:number=0;  
    DetayAciklama:string="";
    //KarsiIslemTip:number=0; 

    SubeId:number=0; 
    Beklemede:number=0;
    Sube:string="";; 
    BakiyeHesapId:number=0; 
    BakiyeHesap:string=""; 
    BelgeNo:string="";
    BelgeTur:number=0; 
    BelgeTurStr:string="";
    DepartmanId:number=0; 
    Departman:string=""; 
    HarcamaAlan:string="";
    Iade:number=0; 
    ManagerId:number=0; 
    Manager:string="";
    Aciklama:string="";  
    OdemeTurId:number=0; 
    OdemeTuru:string=""; 
    BorcAlacak:string=""; 
    Tutar:number=0; 
    TutarTRY:number=0; 
    Borc:number=0; 
    Alacak:number=0; 
    Yuruyen:number=0;
    YuruyenCari:number=0;
    ParaBirim:string="";
    DonemId:number=0;  
    AltDonemId:number=0; 
    AltDonem:string=""; 
    YevmiyeNo:number=0; 
    SurecId:number=0; 
    AltSurecId:number=0;     
    KarsiIslemTip:number=0;
    MakbuzYazdirildi:boolean=false;
    MakbuzYazdiran:number=0;
    MakbuzYazdiranStr:string="";
    MakbuzYazdirTarih:Date=new Date();     
    Degisebilir:number=0;
    Aktarim:number=0;
    IptalTalebi:number=0;
    Aktif:boolean=false;
    Ekleyen:number=0; 
    EkleyenAd:string="";
    Guncelleyen:number=0;
    GuncelleyenAd:string="";
    Kayit:Date=new Date();
    Guncelleme:Date=new Date(); 

    TalepTarih:Date | undefined; 
    IptalId:number=0; 
    TalepAciklama:string=""; 
    IslemAciklama:string="";
    TalepEden:string=""; 
    BelgeEklendi:number=0;  
    OdemeDurumId:number=0;  
    OdemeDurum:string="";
    OdemeId:number=0;  
    OdemeTakip:number=0; 
    
    OzelKod:string="H";
    Kdv1:number=0;  
    Kdv8:number=0;  
    Kdv18:number=0;  
    IsletmeKasaTip:number=0;  
    IsletmeKasaCikisTip:number=0;   
    Tesis:string="";
    SenetOdemeTipId:number=0; 
    SenetOdemeTip:string="";
    TahsilatPersonel:string="";
    AidatPersonel:string="";
    OdenecekBelge: FinansKarsiHesapModel[]=[]; 
    SozlesmeId:number=0; 

    ItirazEdildi:number=0; 
    ItirazEdildiStr:string="";
    ItirazEden:number=0; 
    ItirazEdenStr:number=0; 
    ItirazAciklama:number=0; 
    ItirazTarih:any; 
    ItirazYonlendirilenBirim:number=0; 
    ItirazYonlendirilenBirimStr:string="";
    KrediKartNo:string="";
    ItirazOnayAciklama:string="";
    YevmiyeAktarimTip:string="";
    OdemeYuzde:number=0; 
    Boyut1:string="";
    Boyut2:string="";
    Boyut3:string="";
    SozlParaBirim:string="";
    TersKayitFisNo:number=0; 
    BankaOdemeKod:string="";
  }
  export class FinansTalepOzetModel {
    ToplamTalep:number=0;
    OnaylananTalep:number=0;
    OdenenTalep:number=0;
    KalanTalep:number=0;
    ToplamTalepTutar:number=0;
    OnaylananTalepTutar:number=0;
    OdenenTalepTutar:number=0;
    KalanTalepTutar:number=0; 
 
    PazartesiTalep:number=0;
    PazartesiTutar:number=0;
    SaliTalep:number=0;
    SaliTutar:number=0;
    CarsambaTalep:number=0;
    CarsambaTutar:number=0;
    PersembeTalep:number=0;
    PersembeTutar:number=0;
    CumaTalep:number=0;
    CumaTutar:number=0;
    CumartesiTalep:number=0;
    CumartesiTutar:number=0;
    PazarTalep:number=0;
    PazarTutar:number=0;
    BeklemedeTalep:number=0;
    BeklemedeTutar:number=0;
    OdenmeyecekTalep:number=0;
    OdenmeyecekTutar:number=0;
  }
  export class FinansTalepModel {   
    DocEntry:number=0;  
    TalepTarih:Date=new Date();  
    Ekran:SistemEkran=0;
    TalepKimin:number=0; 
    TalepYapan:number=0; 
    TalepYapanStr:string=""; 
    TalepYapilan:number=0; 
    TalepYapilanStr:string="";; 
    KasaId:number=0; 
    KasaStr:string=""; 
    KasaYetkili:string="";
    HaftaId:number=0; 
    HaftaStr:string="";
    TalepDurum:number=0; 
    TalepDurumStr:string="";
    HesapPlanId:number=0; 
    HesapAdi:string="";
    BolgeId:number=0; 
    BolgeStr:string="";
    Aciklama:string="";  
    TalepTutar:number=0; 
    DonemId:number=0; 
    AltDonemId:number=0; 
    AltDonem:string=""; 
    OdemeHaftasi:number=0; 
    OdemeHaftasiStr:string=""; 
    OdemeGunu:number=0; 
    OdemeGunuStr:string=""; 
    TalepOnaylayan:number=0; 
    TalepOnaylayanStr:string="";
    TalepOnayTarih:Date=new Date(); 
    OnaylananTutar:number=0; 
    GuncelOnaylananTutar:number=0; 
    OdenecekTutar:number=0;
    OnayDurum:number=0; 
    OnayDurumStr:string="";
    Durum:number=0; 
    DurumStr:string="";
    SonOnaylananTutar:number=0; 
    FinansGonderim:boolean=false; 
    SurecSecim:boolean=false;
    KasadanGonderim:boolean=false; 
    KalanTutar:number=0;
    ToplamKalan:number=0;
    OdenenTutar:number=0;
    Aktif:boolean=false;
    Ekleyen:number=0; 
    EkleyenAd:string="";
    Guncelleyen:number=0;
    GuncelleyenAd:string="";
    Kayit:Date=new Date();
    Guncelleme:Date=new Date();
    semkey:string="";
    KrediKartNo:string="";
  }


  