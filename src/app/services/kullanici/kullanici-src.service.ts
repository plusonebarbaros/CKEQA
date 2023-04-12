import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import moment from 'moment';
import { Observable } from 'rxjs';
import { isEmpty, map } from 'rxjs/operators';  
import { AcenteModel, IlceModel, MeslekModel, PrimOzetModel, Result, ReturnValues, ReturnValuesList, SehirModel, SistemModel, SorumluBirim, TesisModel, UlkeModel } from '../Genel/genelsrv';
import { IslemTipi } from '../Onay/onay-surev-src.service';
import { FinanOdemeTipModel } from '../sabitsrc/sabitserv.service';

@Injectable({
  providedIn: 'root'
})
export class KullaniciSrcService {
  token = sessionStorage.getItem("Token");
  userperm:KullaniciYetki[]=[];
  sirketlist:SirketYetki[]=[];
  tumdepolist: DepoYetki[]=[];
  sehirlist: SehirModel[]=[];    
  ilcelist: IlceModel[]=[];    
  ulkelist: UlkeModel[]=[];     
  tesislist: TesisModel[]=[];   
  acentelist: AcenteModel[]=[]; 
  altacentelist: AcenteModel[]=[];  
  ulkeflaglist:UlkeDialModel[]=[]; 
  molatiplist:MolaTipModel[]=[]; 
  aktifsirket:number=0;
  kullSorumluBirim:number=0;
  kullUserId:number=0;
  kullToken:string="";
  aktifsirketadi:string="";
  sirketbirimlist: SirketBirim[]=[];   
  aramafiltrelist:  FiltreAramaModel[]=[];
  sistem!:SistemModel;
  SistemKilitSure:number=0; 

  constructor( @Inject('semUrl') private semUrl:string,
    private http: HttpClient) { 

      this.aramafiltrelist.push(new FiltreAramaModel(1,"Sözleşme No","SozlesmeNo",""));
      this.aramafiltrelist.push(new FiltreAramaModel(2,"Tc Kimlik No","Tckn",""));
      this.aramafiltrelist.push(new FiltreAramaModel(3,"Ad Soyad","Adi",""));
      this.aramafiltrelist.push(new FiltreAramaModel(4,"Telefon No","TumTelefonlar",""));
      this.aramafiltrelist.push(new FiltreAramaModel(5,"Şehir","Il",""));
      this.aramafiltrelist.push(new FiltreAramaModel(6,"İlçe","Ilce",""));
      this.aramafiltrelist.push(new FiltreAramaModel(7,"Refakatçi","Refakatci",""));
      this.aramafiltrelist.push(new FiltreAramaModel(8,"Eş Adı","EsAdSoyad",""));   
      this.aramafiltrelist.push(new FiltreAramaModel(9,"Eş Tckn","U_EsTckn",""));   
      this.aramafiltrelist.push(new FiltreAramaModel(10,"Sertifika No","DocEntry",""));  
    } 

    GetUserTcknView():boolean{
      if(this.kullSorumluBirim==SorumluBirim.Admin)return true;
      if(this.kullSorumluBirim==SorumluBirim.Hukuk)return true;
      if(this.kullSorumluBirim==SorumluBirim.KıymetliEvrak)return true;
      if(this.kullSorumluBirim==SorumluBirim.Bilgiİşlem)return true; 
      if(this.kullSorumluBirim==SorumluBirim.Crm)return true; 
      else return false;
    }

    async GetManagerList(empid:number,secimmi:number,managerdata:boolean)
  { 
       let url=this.semUrl+"/Login/GetManagerList?EmpId="+empid+"&Token="+ this.token+"&Secimmi="+ secimmi+"&ManagerData="+ managerdata; 
        return await this.http.get<Result<KullaniciModel[]>>(url).pipe( map((res:any)=> res));
  }

  async GetAnketSorumluList(empid:number,tip:number,managerid:number)
  { 
       let url=this.semUrl+"/Login/GetAnketSorumluList?EmpId="+empid+"&Token="+ this.token+"&Tip="+ tip+"&ManagerId="+ managerid; 
        return await this.http.get<Result<KullaniciModel[]>>(url).pipe( map((res:any)=> res));
  }

  async GetSupervisorList(managerid:number,secimmi:number)
  { 
       let url=this.semUrl+"/Login/GetSupervisorList?ManagerId="+managerid+"&Token="+ this.token+"&Secimmi="+ secimmi; 
        return await this.http.get<Result<KullaniciModel[]>>(url).pipe( map((res:any)=> res));
  }

  async GetConfList()
  { 
       let url=this.semUrl+"/Login/GetConfList?Token="+ this.token; 
        return await this.http.get<Result<KullaniciModel[]>>(url).pipe( map((res:any)=> res));
  }
  

  async getKullaniciList(empid:number,secimmi:number,birim:number,managerid:number,webdurum:number=0,keyword:string,trimps:boolean=false):Promise<ReturnValuesList<KullaniciModel>>  {
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
        "Secimmi":  secimmi,    
        "SorumluBirim":  birim,    
        "ManagerId":  managerid,    
        "WebDurum":  webdurum,     
        "KeyWord":  keyword,    
        "Token":this.token
      });
  
    var result = await this.http.post<any>(this.semUrl+"/Login/GetKullaniciList", body, options).toPromise();
  
    var sonuc = JSON.parse(JSON.stringify(result));
  
    var list = sonuc.Model["List"];
    if(trimps)list.forEach((x:KullaniciModel)=> x.SantralDahiliPass=x.SantralDahiliPass.replace("A1q77a8a","")); 

    return new ReturnValuesList( sonuc.Model["Id"], sonuc.Model["Success"], sonuc.Model["Message"] ?? "", sonuc.Model["Token"] ?? "",list);
  }

  async getAnketKullanici(birim:string,deptid:number,managerid:number)
  { 
       let url=this.semUrl+"/Login/GetAnketDataKullanici?Birim="+birim+"&DepartmanId="+deptid+"&ManagerId="+managerid+"&Token="+ this.token; 
        return await this.http.get<Result<KullaniciModel[]>>(url).pipe( map((res:any)=> res));
  }   

  async getUserBranch(tumu:boolean)
  { 
   let url=this.semUrl+"/Login/GetUserBranch?Tumu="+tumu+"&Token="+ this.token
    return this.http.get<Result<OnayHesapModel[]>>(url).pipe(map((res: any) => res));
  }
  
  async GetDepartman()
  { 
   let url=this.semUrl+"/Login/GetDepartman?Token="+ this.token
    return this.http.get<Result<OnayHesapModel[]>>(url).pipe(map((res: any) => res));
   }
 
  async GetPozisyon()
  { 
   let url=this.semUrl+"/Login/GetPozisyon?Token="+ this.token
    return this.http.get<Result<OnayHesapModel[]>>(url).pipe(map((res: any) => res));
  }
  
  async  KullaniciGuncelle(kull:KullaniciModel):Promise<ReturnValues>  {
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
     }
    ); 

      let options = { headers: headers };

      const body =  JSON.stringify({ 
        "Kull":  kull, 
        "Token":this.token
      });
   
      var result = await this.http.post<any>(this.semUrl+"/Login/KullaniciGuncelle", body,options).toPromise();

    var sonuc = JSON.parse(JSON.stringify(result))['Model'];
    return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
   } 
   
   async GetSantralYetkili(santral:string)
   { 
    let url=this.semUrl+"/Santral/GetSantralYetkili?Santral="+santral+"&Token="+ this.token
     return this.http.get<Result<SantralYetkiliModel[]>>(url).pipe(map((res: any) => res));
   } 

   async GetSonDahili(santral:string,cusid:number)
   { 
    let url=this.semUrl+"/Santral/GetSonDahili?Santral="+santral+"&CusId="+cusid+"&Token="+ this.token
     return this.http.get<Result<number>>(url).pipe(map((res: any) => res));
   } 
   
   async GetSantralGrubu(santral:string,cusid:number)
   { 
    let url=this.semUrl+"/Santral/GetSantralGrubu?Santral="+santral+"&CusId="+cusid+"&Token="+ this.token
     return this.http.get<Result<SantralGrupModel[]>>(url).pipe(map((res: any) => res));
   }  
   
   async GetSantralNumaralar(santral:string,cusid:number)
   { 
    let url=this.semUrl+"/Santral/GetSantralNumaralar?Santral="+santral+"&CusId="+cusid+"&Token="+ this.token
     return this.http.get<Result<SanralNumaraModel[]>>(url).pipe(map((res: any) => res));
   }  

   async GetSirketYetki(empid:number,yetki:number)
  { 
   let url=this.semUrl+"/Login/GetSirketYetki?EmpId="+empid+"&Yetki="+yetki+"&Token="+ this.token
    return this.http.get<Result<SirketYetki[]>>(url).pipe(map((res: any) => res));
  }

  async GetAcenteYetki(empid:number)
  { 
   let url=this.semUrl+"/Login/GetAcenteYetki?EmpId="+empid+"&Token="+ this.token
    return this.http.get<Result<AcenteYetki[]>>(url).pipe(map((res: any) => res));
  }

  async GetDepoYetki(empid:number,subeid:number,yetki:number)
  { 
   let url=this.semUrl+"/Login/GetDepoYetki?EmpId="+empid+"&SubeId="+subeid+"&Yetki="+yetki+"&Token="+ this.token
    return this.http.get<Result<DepoYetki[]>>(url).pipe(map((res: any) => res));
  }

  async GetKullaniciYetki(empid:number,grupid:number,yetkikodu:string="",birimkisit:string)
  { 
   let url=this.semUrl+"/Login/GetKullaniciYetki?EmpId="+empid+"&GrupId="+ grupid+"&YetkiKodu="+ yetkikodu+"&Token="+ this.token+"&BirimKisit="+ birimkisit;
    return this.http.get<Result<KullaniciYetki[]>>(url).pipe(map((res: any) => res));
  }

  async GetFinansOdemeTipYetki(empid:number)
  { 
   let url=this.semUrl+"/Login/GetFinansOdemeTipYetki?EmpId="+empid+"&Token="+ this.token
    return this.http.get<Result<FinanOdemeTipModel[]>>(url).pipe(map((res: any) => res));
  }

  async YetkiGrupEkle(post:YetkiGrup,tip:IslemTipi):Promise<ReturnValues>  {
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
      "Token":this.token, 
      "Tip":tip, 
    });
  
    var result = await this.http.post<any>(this.semUrl+"/Login/YetkiGrupEkle", body, options).toPromise();
  
    var sonuc = JSON.parse(JSON.stringify(result))['Model'];
    return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
  }
  
  async GetYetkiGrup(code:number)
  { 
       let url=this.semUrl+"/Login/GetYetkiGrup?Code="+code+"&Token="+this.token; 
          return await this.http.get<Result<YetkiGrup>>(url).pipe( map((res:any)=> res));
  }

  async GrupYetkiOlustur(post:YetkiGrup,yetki:KullaniciYetki[],tip:IslemTipi):Promise<ReturnValues>  {
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
      "Yetki":  yetki,  
      "Token":this.token, 
      "Tip":tip, 
    });
  
    var result = await this.http.post<any>(this.semUrl+"/Login/GrupYetkiOlustur", body, options).toPromise();
  
    var sonuc = JSON.parse(JSON.stringify(result))['Model'];
    return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
  }

  async GetKasaYetki(empid:number)
  { 
       let url=this.semUrl+"/Login/GetKasaYetki?EmpId="+empid+"&Token="+this.token; 
          return await this.http.get<Result<KasaYetki>>(url).pipe( map((res:any)=> res));
  }

  async GetBankaYetki(empid:number)
  { 
       let url=this.semUrl+"/Login/GetBankaYetki?EmpId="+empid+"&Token="+this.token; 
          return await this.http.get<Result<BankaYetki>>(url).pipe( map((res:any)=> res));
  }

  async GetKullaniciOzetList(empid:number,secimmi:number,grupid:string,managerid:number,yetkikodu="")
  { 
       let url=this.semUrl+"/Login/GetKullaniciOzetList?EmpId="+empid+"&Token="+ this.token+"&Secimmi="+ secimmi+"&GrupId="+ grupid+"&ManagerId="+ managerid+"&YetkiKodu="+ yetkikodu; 
        return await this.http.get<Result<KullaniciModel[]>>(url).pipe( map((res:any)=> res));
  } 

  async GetSorumluBirimKullanicilar(empid:number,SorumluBirim:number,ManagerId:number)
  { 
       let url=this.semUrl+"/Login/GetSorumluBirimKullanicilar?EmpId="+empid+"&SorumluBirim="+ SorumluBirim+"&ManagerId="+ ManagerId+"&Token="+ this.token; 
        return await this.http.get<Result<KullaniciModel[]>>(url).pipe( map((res:any)=> res));
  } 

  

  async GetKullaniciAramaList(arama:string,durum:number=0,acentekisit:number=0,kisit:number=0,tumkullanicilar:number=0)
  { 
       let url=this.semUrl+"/Login/GetKullaniciAramaList?Arama="+arama+"&Token="+ this.token+"&Durum="+ durum+"&AcenteKisit="+ acentekisit+"&Kisit="+ kisit+"&TumKullanicilar="+ tumkullanicilar;
        return await this.http.get<Result<KullaniciModel[]>>(url).pipe( map((res:any)=> res));
  }
  
  async GetOnaySurecKullaniciList(empid:number)
  { 
       let url=this.semUrl+"/Login/GetOnaySurecKullaniciList?EmpId="+empid+"&Token="+ this.token; 
        return await this.http.get<Result<OnayHesapModel[]>>(url).pipe( map((res:any)=> res));
  } 

  async GetOnaySurecDigerList(empid:number)
  { 
       let url=this.semUrl+"/Login/GetOnaySurecDigerList?EmpId="+empid+"&Token="+ this.token; 
        return await this.http.get<Result<OnayHesapModel[]>>(url).pipe( map((res:any)=> res));
  } 

  async KullaniciGirisBilgiGuncelle(empid:number,sirketid:number):Promise<ReturnValues>  {
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
      "SirketId":  sirketid,    
      "Token":this.token
    });
  
    var result = await this.http.post<any>(this.semUrl+"/Login/KullaniciGirisBilgiGuncelle", body, options).toPromise();
  
    var sonuc = JSON.parse(JSON.stringify(result))['Model'];
    return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
  }

  async GetSirketBirim()
    { 
     let url=this.semUrl+"/Anket/GetSirketBirim?Token="+ this.token; 
     return await this.http.get<Result<SirketBirim[]>>(url).pipe( map((res:any)=> res));
    } 

    async BirimYetkiGuncelle(kullanici:KullaniciModel,yetki:KullaniciYetki[]):Promise<ReturnValues>  {
      const headers = new HttpHeaders(
        {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Headers': 'Content-Type',
       }
      ); 
    
      let options = { headers: headers };
      
      const body =  JSON.stringify({ 
        "Kullanici":  kullanici,    
        "Yetki":  yetki,    
        "Token":this.token
      });
    
      var result = await this.http.post<any>(this.semUrl+"/Login/BirimYetkiGuncelle", body, options).toPromise();
    
      var sonuc = JSON.parse(JSON.stringify(result))['Model'];
      return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
    }

    async PersonelTcknKontrol(tckn:string,empid:number)  {
      const headers = new HttpHeaders(
        {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Headers': 'Content-Type',
       }
      ); 
    
      let options = { headers: headers };
      
      const body =  JSON.stringify({ 
        "Tckn":  tckn,    
        "EmpId":  empid,    
        "Token":this.token
      });
    
      var result = await this.http.post<any>(this.semUrl+"/Login/PersonelTcknKontrol", body, options).toPromise();
    
      var sonuc = JSON.parse(JSON.stringify(result));
      return sonuc;
    }

    async PersonelPrimTcknGuncelle(kullanici:KullaniciModel,primsatir:PrimOzetModel):Promise<ReturnValues>  {
      const headers = new HttpHeaders(
        {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Headers': 'Content-Type',
       }
      ); 
    
      let options = { headers: headers };
      
      const body =  JSON.stringify({ 
        "Kullanici":  kullanici,    
        "PrimSatir":  primsatir,    
        "Token":this.token
      });
    
      var result = await this.http.post<any>(this.semUrl+"/Login/PersonelPrimTcknGuncelle", body, options).toPromise();
    
      var sonuc = JSON.parse(JSON.stringify(result))['Model'];
      return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");

    }

    async TahsilatPersonelPrimGuncelle(kullanici:KullaniciModel):Promise<ReturnValues>  {
      const headers = new HttpHeaders(
        {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Headers': 'Content-Type',
       }
      ); 
    
      let options = { headers: headers };
      
      const body =  JSON.stringify({ 
        "Kullanici":  kullanici,       
        "Token":this.token
      });
    
      var result = await this.http.post<any>(this.semUrl+"/Login/TahsilatPersonelPrimGuncelle", body, options).toPromise();
    
      var sonuc = JSON.parse(JSON.stringify(result))['Model'];
      return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");

    }

    async GetTahsilatPrimPersonelList(empid:number)
  { 
       let url=this.semUrl+"/Login/GetTahsilatPrimPersonelList?EmpId="+empid+"&Token="+ this.token; 
        return await this.http.get<Result<KullaniciModel[]>>(url).pipe( map((res:any)=> res));
  } 

  async CrmPersonelPrimGuncelle(kullanici:KullaniciModel):Promise<ReturnValues>  {
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
     }
    ); 
  
    let options = { headers: headers };
    
    const body =  JSON.stringify({ 
      "Kullanici":  kullanici,       
      "Token":this.token
    });
  
    var result = await this.http.post<any>(this.semUrl+"/Login/CrmPersonelPrimGuncelle", body, options).toPromise();
  
    var sonuc = JSON.parse(JSON.stringify(result))['Model'];
    return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");

  }

  async GetCrmPrimPersonelList(empid:number,baslangic:Date | undefined,bitis:Date |undefined)
  { 
       let url=this.semUrl+"/Login/GetCrmPrimPersonelList?EmpId="+empid+"&Token="+ this.token+"&Baslangic="+moment(baslangic).format("yyyy-MM-DD")+"&Bitis="+moment(bitis).format("yyyy-MM-DD"); 
        return await this.http.get<Result<KullaniciModel[]>>(url).pipe( map((res:any)=> res));
  }
   
  async GetFuPersonelList(empid:number)
  { 
       let url=this.semUrl+"/Login/GetFuPersonelList?EmpId="+empid+"&Token="+ this.token; 
        return await this.http.get<Result<KullaniciModel[]>>(url).pipe( map((res:any)=> res));
  }

  async PdksKullaniciGuncelle(kullanici:KullaniciModel):Promise<ReturnValues>  {
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
     }
    ); 
  
    let options = { headers: headers };
    
    const body =  JSON.stringify({ 
      "Kullanici":  kullanici,       
      "Token":this.token
    });
  
    var result = await this.http.post<any>(this.semUrl+"/Login/PdksKullaniciGuncelle", body, options).toPromise();
  
    var sonuc = JSON.parse(JSON.stringify(result))['Model'];
    return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
  }

  async GetPdksKartBostakiler(empid:number)
  { 
       let url=this.semUrl+"/Login/GetPdksKartBostakiler?EmpId="+empid+"&Token="+ this.token; 
        return await this.http.get<Result<KullaniciModel[]>>(url).pipe( map((res:any)=> res));
  }

  async GetSantralAramaNoList()
  { 
   let url=this.semUrl+"/Santral/GetSantralAramaNoList?Token="+ this.token
    return this.http.get<Result<SantralAramaNoModel[]>>(url).pipe(map((res: any) => res));
  }  

  async GetUlkeDial()
  { 
   let url=this.semUrl+"/Tanim/GetUlkeDial?Token="+ this.token
    return this.http.get<Result<UlkeDialModel[]>>(url).pipe(map((res: any) => res));
  }  

  

  async GetNtxSantralSube()
  { 
  let url=this.semUrl+"/Santral/GetNtxSantralSube?Token="+ this.token;
    return this.http.get<Result<NtxSantralSubeModel>>(url).pipe(map((res: any) => res));
  } 

  async GetNtxSantralDahili(Sube:string)
  { 
  let url=this.semUrl+"/Santral/GetNtxSantralDahili?Sube="+Sube+"&Token="+ this.token;
    return this.http.get<Result<NtxSantralDahiliModel>>(url).pipe(map((res: any) => res));
  } 

  async GetNtxSantralDisHat(Sube:string)
  { 
  let url=this.semUrl+"/Santral/GetNtxSantralDisHat?Sube="+Sube+"&Token="+ this.token;
    return this.http.get<Result<NtxSantralDisHatModel>>(url).pipe(map((res: any) => res));
  } 

  async  KullaniciSil(kull:KullaniciModel):Promise<ReturnValues>  {
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
     }
    ); 

      let options = { headers: headers };

      const body =  JSON.stringify({ 
        "Kull":  kull, 
        "Token":this.token
      });
   
      var result = await this.http.post<any>(this.semUrl+"/Login/KullaniciSil", body,options).toPromise();

    var sonuc = JSON.parse(JSON.stringify(result))['Model'];
    return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
   } 

   async GetNtxKuyrukList(Sube:string)
  { 
  let url=this.semUrl+"/Santral/GetNtxKuyrukList?Sube="+Sube+"&Token="+ this.token;
    return this.http.get<Result<NtxSantralKuyrukModel>>(url).pipe(map((res: any) => res));
  } 

  async  NtxKuyrukGuncelle(List:NtxSantralKuyrukModel[]):Promise<ReturnValues>  {
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
        "Sube":  sessionStorage.getItem("DahiliSube")+"", 
        "Dahili":  sessionStorage.getItem("Dahili")+"", 
        "Token":this.token
      });
   
      var result = await this.http.post<any>(this.semUrl+"/Santral/NtxKuyrukGuncelle", body,options).toPromise();

    var sonuc = JSON.parse(JSON.stringify(result))['Model'];
    return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
   } 

   async  KullaniciMolayaCik(durumid:number,molacikistip:number):Promise<ReturnValues>  {
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
      ); 

      let options = { headers: headers };

      const body =  JSON.stringify({  
        "Durum":durumid,  
        "MolaTipId":molacikistip,  
        "Token":this.token
      });
   
      var result = await this.http.post<any>(this.semUrl+"/Login/KullaniciMolayaCik", body,options).toPromise();

      var sonuc = JSON.parse(JSON.stringify(result))['Model'];
      return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
   } 

   async KullaniciAyarGuncelle(vekilid:number,izintarih:any,izindurum:number):Promise<ReturnValues>  {
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
     }
    ); 
  
    let options = { headers: headers };
    
    const body =  JSON.stringify({  
      "VekilEmpId":  vekilid,    
      "IzinBitisTarih":  izintarih,   
      "IzinDurum":izindurum, 
      "Token":this.token
    });
  
    var result = await this.http.post<any>(this.semUrl+"/Login/KullaniciAyarGuncelle", body, options).toPromise();
  
    var sonuc = JSON.parse(JSON.stringify(result))['Model'];
    return new ReturnValues( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["ValidKey"] ?? "");
  }

  async GetSantralDahiliNumaralar()
  { 
  let url=this.semUrl+"/Santral/GetSantralDahiliNumaralar?Token="+ this.token;
    return this.http.get<Result<X_SANTRAL_NUMARALARI>>(url).pipe(map((res: any) => res));
  } 

}
  
export class X_SANTRAL_NUMARALARI{
  id:number=0; 
  idx:number=0; 
  cus_id:string="";   
  did:string="";   
  description:string="";   
  prefix:string="";   
  gorunum:number=0;  
  gorunumadi:string="";   
}
export  class MolaTipModel { 
  DocEntry: number=0;   
  SorumluBirimId: number=0;  
  Adi: string="";  
} 

export class NtxSantralKuyrukModel{
  SatirGuid:string="";   
  EmpId:number=0; 
  Adi:string="";   
  KuyrukAdi:string="";   
  Durum:number=0;  
  DurumStr:string="";   
  Parametre:string="";   
  Parametre2:string="";   
  ApiKey:string="";  
  Secim:boolean=false; 
}

export class NtxSantralDisHatModel{
  rulesId:string="";  
  rulesname:string="";   
  tenant:string="";
}

export class NtxSantralDahiliModel{
  dahilino:string="";  
  dahiliadi:string="";  
  dahilipass:string="";  
  dahilisube:string="";  
  username:string="";  
  Kullanimda:number=0;  
  EmpId:number=0;  
  KullaniciAdi:string="";   
}


export class NtxSantralSubeModel{
  tenant_code:string="";  
  tenant_title:string="";  
  tenant_apikey:string="";  
}

export  class UlkeDialModel { 
  name: string="";   
  dial: string="";  
  code: string="";  
  mask: string="";   
} 

export class SantralAramaNoModel{ 
  Kod:string="";
  Numara:string="";
  Adi:string="";
}


export class SirketBirim{
  DocEntry: number = 0; 
  Birim:string="";
  Devir:string="";
}

export class TcknModel
{
  EkipId:number=0; 
  Tckn:string="";  
  Adi:string="";  
  Soyadi:string="";  
  DogumTarih:Date=new Date();   
  TcknDogrula:number=0;
}

export class TcknCheck
{
  EkipId:number=0; 
  Adi:string="";  
  Soyadi:string="";  
  Tckn:string="";  
  DogumTarih:Date=new Date(); 
  TcknDogrula:number=0; 
}

export class BankaYetki {   
  Code:number=0;  
  EmpId:number=0;  
  Banka:string="";  
  BankaHesap:string="";  
  KebirHesap:string="";  
  Sube:number=0;  
  SubeAdi:string="";  
  ParaBirim:string="";  
  Aktif:boolean=false;
  Ekleyen:number=0; 
  EkleyenAd:string="";
  Guncelleyen:number=0;
  GuncelleyenAd:string="";
  Kayit:Date=new Date();
  Guncelleme:Date=new Date();
  Goruntule:boolean=false;
  Ekle:boolean=false;
  Sil:boolean=false;
  Guncelle:boolean=false;
  Export:boolean=false;
}

export class KasaYetki {   
  Code:number=0;  
  EmpId:number=0;  
  KasaKodu:string="";  
  KasaAdi:string="";  
  Bolge:number=0;  
  BolgeStr:string="";  
  Aktif:boolean=false;
  Ekleyen:number=0; 
  EkleyenAd:string="";
  Guncelleyen:number=0;
  GuncelleyenAd:string="";
  Kayit:Date=new Date();
  Guncelleme:Date=new Date();
  Goruntule:boolean=false;
  Ekle:boolean=false;
  Sil:boolean=false;
  Guncelle:boolean=false;
  Export:boolean=false;
  KasaTipi:string="";
}

export class YetkiGrup {   
  Code:number=0;  
  GrupAdi:string="";  
  Aktif:boolean=false;
  Ekleyen:number=0; 
  EkleyenAd:string="";
  Guncelleyen:number=0;
  GuncelleyenAd:string="";
  Kayit:Date=new Date();
  Guncelleme:Date=new Date();
}

export  class KullaniciYetki { 
  Code:number=0;
  YetkiKodu: string="";  
  Bolum:string="";
  Modul: string="";  
  Yetki: string="";  
  AramaKey: string="";  
  Goruntule:boolean=false;
  Ekle:boolean=false;
  Sil:boolean=false;
  Guncelle:boolean=false;
  Export:boolean=false;
} 

export  class DepoYetki { 
  DepoKodu: string="";  
  DepoAdi: string="";  
  Sube:string=""; 
  AnaDepo:string=""; 
  SubeId:number=0; 
  Yetki:number=0;
} 
export  class AcenteYetki {
  Code: number=0;
  Adi: string="";  
  CalismaSekliStr: string="";  
  BolgeStr:string=""; 
  Parametre:string=""; 
  Yetki:number=0;
  ManuelSozlesme:number=0;
  SatistaGoster:boolean=false;
 } 

export  class SirketYetki {
  Id: number=0;
  Adi: string="";  
  Yetki:number=0;
  Tipi:number=0;
  VergiNo: string="";  
  MusteriKodu: string="";  
  SaticiKodu: string="";  
  SubeHesap393: string="";  
  ElektraHotelId: string="";   
} 

export class KullaniciModel{
  empID: number=0;
  Adminmi:boolean=false;
  Ad: string="";
  Soyad: string="";
  AdSoyad: string="";
  Mail: string=""; 
  CrmSirket: number=0;
  Sirket: number=0;
  IkFirmaId:number=0;
  Tesis: number[]=[]; 
  AnlikRoyalPasif: boolean=false; 
  BlokeAcik: boolean=false;  
  SantralAktif: boolean=false; 
  KullaniciAktif: boolean=false; 
  Santral: number=0; 
  SantralBaglantiTipi: string="";
  SantralBaglantiKodu: string="";
  Dahili: number=0; 
  DahiliKod: number=0; 
  SantralNo1: number=0; 
  SantralNo2: number=0; 
  SantralNo3: number=0; 
  SantralNo4: number=0; 
  SantralNo5: number=0; 
  SantralNo6: number=0; 
  SantralNo7: number=0; 
  SantralNo8: number=0; 
  SantralNo9: number=0; 
  SantralNo10: number=0; 
  SantralNo11: number=0; 
  SantralNo12: number=0; 
  SantralGrubu: string="";
  CalmaSuresi: number=30; 
  SantralSunucuYol: string="";
  SesKaydiGelen: boolean=true; 
  SesKaydiGiden: boolean=true; 
  Sehirici: boolean=true; 
  SehirlerArasi: boolean=true; 
  Mobil: boolean=true; 
  UluslarArasi: boolean=false; 
  CrmLogin: boolean=false; 
  SmsOnayli: boolean=false; 
  Manager: number=0;
  Supervisor  : number=0;
  ManagerStr: string="";
  SupervisorStr: string="";
  CepTel: string="";
  Pozisyon: number=0;
  Departman: number=0;
  DepartmanStr: string="";
  PozisyonStr: string="";
  CrmSifre: string="";
  Tckn:string="";
  SantralAdi:string="";
  GrupYetkiId:number=0;
  GrupYetki:string="";
  IkId:number=0;
  SirketYetki:SirketYetki[]=[];
  AcenteYetki:AcenteYetki[]=[];
  DepoYetki:DepoYetki[]=[];
  KullaniciYetki:KullaniciYetki[]=[];
  KasaYetki:KasaYetki[]=[];
  BankaYetki:BankaYetki[]=[];
  OdemeTipYetki:FinanOdemeTipModel[]=[];
  IkFirmaAdi:string="";
  Ekip:string="";
  DefaultSirket:number=0;
  SorumluBirim:number=0;
  SorumluBirimStr:string="";
  Acente:number=0;
  CalismaTipi:number=0;
  CalismaTipiStr:string="";
  KullaniciSeviye:number=0;
  KullaniciSeviyeStr:string="";
  Yonetici:string="";
  Aktif:string="";
  UyeBasiTahsilat:number=0;
  PrimGrupId:number=0;
  PrimGrup:string="";
  SpiffGrupId:string="";
  SpiffGrup:string="";
  PrimYetki: number[]=[]; 
  BirimYetki: number[]=[]; 

  CrmPrimGorev:number=0;
  CrmPrimGorevStr:string="";
  CrmPrimEtud:number=0;
  CrmPrimRaporlama:number=0;
  CrmPrimYardimlasma:number=0;
  CrmPrimRezervasyonSayi:number=0;
  PdksKartId:number=0; 
  PdksKartNo:string="";
  PdksGrupId:number=0;
  PdksGrup:string="";
  OfisId:number=0;
  OfisAdi:string=""; 
  AnketHavuzYetkisi:number=0; 
  
  SantralYol1:string=""; 
  SantralYol2:string=""; 
  SantralAramaYol:string=""; 
  SantralDirekAktar:string=""; 
  SantralGorusAktar:string=""; 
  SantralCagriCekme:string=""; 
  SantralDinle:string=""; 
  SantralFisilda:string="";  
  SantralDahili:string=""; 
  SantralDahiliPass:string=""; 
  SantralDahiliSube:string=""; 
  SantralDahiliSubeKey:string="";
  SantralDahiliUserName:string="";
  SantralKuyrukDurum:number=0; 
  MolaDurum:number=0; 
  PauseDurum:number=0; 
  SirketBirim:number=0;
  SirketBirimStr:string=""; 
  YemekOgunSayisi:number=0;
  GorusmeSayi:number=0;
  PdksOzelKod:number=0;
 }

 export  class OnayHesapModel {
  Id: number=0;
  Name: string="";  
  Ek1: string="";  
  Ek2: string="";  
  Ek3: number=0;
  Secili:boolean=false;
  IkId:number=0;
  MuhasebeKod: string="";  
  MuhasebeAdi: string="";  
  constructor(_id:number,_name:string) {
   this.Id =_id;
   this.Name=_name; 
  }
 } 

 export  class Departman {
  Id: number=0;
  Adi: string="";   
 }
 
 export  class SantralYetkiliModel {
  cus_id: string=""; 
  description: string="";   
 }

 export  class SantralGrupModel {
  cp_group: string="";   
  description: string="";   
 }

 export  class SanralNumaraModel {
  idx: number=0;  
  did: string="";   
  dclid: string="";   
  description: string="";   
 }

 export class FiltreAramaModel {
  constructor(id:number,alan:string,dbalan:string,deger:string) {
    this.Id=id;
    this.DbAlan=dbalan;
    this.Alan=alan;
    this.Deger=deger;
  }
  Id: number=0;
  DbAlan: string="";
  Alan: string="";
  Deger: string="";
 }

export class FilterMod {
  constructor(bastarih:any,bittarih:any) { 
    this.Baslangic=moment(bastarih).format("yyyy-MM-DD");
    this.Bitis=moment(bittarih).format("yyyy-MM-DD");
  }
  Baslangic:any;
  Bitis:any;
}

export class GrafikData {
  name:string="";
  value:number=0;
}