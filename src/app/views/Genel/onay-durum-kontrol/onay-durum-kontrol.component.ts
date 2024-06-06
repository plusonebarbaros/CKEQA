import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { OnayAsamaTakip, EkranMesaj } from 'src/app/services/GenelSrc';
import { NotifyService } from 'src/app/services/notify';
import { OnaySurevSrcService } from 'src/app/services/OnaySrc';

@Component({
  selector: 'app-onay-durum-kontrol',
  templateUrl: './onay-durum-kontrol.component.html',
  styleUrls: ['./onay-durum-kontrol.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers:[
    {provide:DatePipe},
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } }
  ]
})
export class OnayDurumKontrolComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;   
  @Input() onayid:any;         
  datalist:OnayAsamaTakip[]=[];

  constructor(
    private alertify:NotifyService ,
    private onaysrc:OnaySurevSrcService
  ) {    
  }

  ngOnInit(): void { 
    this.OnayTakip();
  }  

  async OnayTakip()  {
    this.blockUI.start(EkranMesaj.Listele);
      (await this.onaysrc.GetOnayAsamaTakipUstBilgiDetay(this.onayid)).subscribe(
        async data=>{
          this.blockUI.stop(); 
          if(!data.Success){
            this.alertify.warning(data.Message);
            return;
          }
          this.datalist=data.List;    
        }
      ) 
  } 
}
