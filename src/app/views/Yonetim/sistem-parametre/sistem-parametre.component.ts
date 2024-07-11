import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subject } from 'rxjs';
import { IslemTipi, EkranMesaj } from 'src/app/services/GenelSrc';
import { KullaniciYetki } from 'src/app/services/KullaniciSrc';
import { NotifyService } from 'src/app/services/notify';
import { ConnParametreModel, SabitservService } from 'src/app/services/SabitSrc';

@Component({
  selector: 'app-sistem-parametre',
  templateUrl: './sistem-parametre.component.html',
  styleUrls: ['./sistem-parametre.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers:[
    {provide:DatePipe},
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } } 
  ]
})
export class SistemParametreComponent implements OnInit {
  yetki:KullaniciYetki;   
  @BlockUI() blockUI!: NgBlockUI;
  sistem:ConnParametreModel;

  protected _onDestroy = new Subject<void>();

  constructor( 
    private alertify:NotifyService ,
    private sabitsrc:SabitservService,
  ) {  
    this.yetki=new  KullaniciYetki();
    this.sistem=new ConnParametreModel();
  }

  ngOnInit(): void {
    this.DataLoad();
  }

  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  async kaydet(){
    this.blockUI.start("Kayıt Başladı..."); 
    var sonuc = await this.sabitsrc.SistemParametreEkle(this.sistem,this.sistem.Id>0?IslemTipi.Guncelle:IslemTipi.Ekle);
    if(sonuc.Success==true){      
      if(this.sistem.Id<=0)this.sistem.Id=sonuc.Id; 
      this.alertify.success("Kayıt Tamamlandı!"); 
      } else{
    this.alertify.warning(sonuc.Message);
    }
      this.blockUI.stop(); 
  }

  DataLoad(){
    this.GetSistemParametre();
  } 
 
  async GetSistemParametre()  {
    this.blockUI.start(EkranMesaj.Listele);
      (await this.sabitsrc.GetSistemParametre(0)).subscribe(
        data=>{
          this.blockUI.stop(); 
          if(!data.Success){
            this.alertify.warning(data.Message);
            return;
          }
         if(data.Model!=null) this.sistem=data.Model;         
        }
      )         
  }   

  tabsec(e:any){ 
    if(e.tab.textLabel=="Genel"){
        
    }
   } 
}
