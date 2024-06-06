import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { EkranMesaj } from 'src/app/services/GenelSrc';
import { NotifyService } from 'src/app/services/notify';
import { TalepTarihceModel, TalepsrcService } from 'src/app/services/SatinAlmaSrc';

@Component({
  selector: 'app-talep-tarihce',
  templateUrl: './talep-tarihce.component.html',
  styleUrls: ['./talep-tarihce.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers:[
    {provide:DatePipe},
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } }
  ]
})
export class TalepTarihceComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  datalist:TalepTarihceModel[]=[]; 
  @Input() SatirGuid: string="";
   
  constructor( 
    private alertify:NotifyService ,
    private satinalmasrc:TalepsrcService
  ) {  
  }

  ngOnInit(): void {
    this.GetTalepKalemTarihce();
  } 

  async GetTalepKalemTarihce()  {
    this.blockUI.start(EkranMesaj.Listele);
      (await this.satinalmasrc.GetTalepKalemTarihce(this.SatirGuid)).subscribe(
        data=>{
          this.blockUI.stop();  
          if(!data.Success){
            this.alertify.warning(data.Message);
            return;
          }
          this.datalist = data.List;      
        }
      )      
  } 
}
