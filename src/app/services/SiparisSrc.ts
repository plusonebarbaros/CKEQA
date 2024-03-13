import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { IslemTipi, Result, ReturnValues, ReturnValuesList } from './GenelSrc';
import { KullaniciSrcService } from './KullaniciSrc';

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

  var result = await this.http.post<any>(this.semUrl+"/Stok/StokRafKontrol", formdata,options).toPromise();

  var sonuc = JSON.parse(JSON.stringify(result));
  return new ReturnValuesList( sonuc["Id"], sonuc["Success"], sonuc["Message"] ?? "", sonuc["Token"] ?? "",sonuc["List"]);
} 



}

export  class SiparisAktarimModel {
  STOK_KODU: string="";  
  STOK_ADI: string="";  
  MIKTAR: number=0;
  FIYAT: number=0;
  DOVIZTIP: string="";  
  SIPARISNO: string="";  
  semkey: string="";  
} 
