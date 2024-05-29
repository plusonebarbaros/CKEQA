import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { EkranMesaj, GenelApi, MailGonderimModel } from 'src/app/Services/GenelSrc';
import { NotifyService } from 'src/app/Services/notify';
import { RaporService } from 'src/app/Services/RaporSrc';
import { CofirmsrcService } from 'src/app/Utils/confirm-dialog/cofirmsrc.service';

@Component({
  selector: 'app-form-goster',
  templateUrl: './form-goster.component.html',
  styleUrls: ['./form-goster.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers:[
    { provide: DatePipe },
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } },
  ]
})
export class FormGosterComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  @Input() FirmaKodu: string="";
  @Input() baslik: string="";
  @Input() icerik: string="";
  @Input() to: string="";
  @Input() cc: string="";
  @Input() bcc: string="";
  @Input() pdfdata: any;
  @Input() pdfjson: string="";
  @Input() pdfmail: boolean=false;
  @Input() Base64Ext: string="";
  pdfgoster:boolean = false;

  constructor(
    private activeModal: NgbActiveModal,
    private notify:NotifyService,
    private modal:NgbModal,
    private confirm: CofirmsrcService,
    private raporsrc: RaporService,
    private genelsrc: GenelApi,
    ) { }

  ngOnInit(): void {
    if(this.Base64Ext=="application/pdf")this.pdfgoster=true;
    else if(this.Base64Ext=="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")this.pdfgoster=true;
    else this.pdfgoster=false;

    this.GetMailBilgi();
  }
  
  public dismiss() {
    this.activeModal.dismiss();
  }

  mailGonder(){
    if (this.pdfjson==undefined || this.pdfjson==""){
      this.notify.warning("Pdf İçeriği Okunamadı!") 
      return;
    } 
    if (this.baslik==undefined || this.baslik==""){
      this.notify.warning("Başlık Bilgisi Zorunludur!") 
      return;
    } 
    if (this.to==undefined || this.to==""){
      this.notify.warning("Alıcı Bilgisi Zorunludur!") 
      return;
    } 

    this.confirm.confirm('Mail Gönder', 'Görüntülemekte Olduğunuz Form Mail Olarak Gönderilecek, Devam Edilsin mi?')
    .then(async (confirmed:any) => 
    {
      if(confirmed.sonuc==true)  {
        this.blockUI.start(EkranMesaj.Kaydet);
        var result = await this.genelsrc.FormMailGonder(this.pdfjson,this.to,this.bcc,this.cc,this.baslik,this.icerik);
        this.blockUI.stop();  
          if(result.Success==true){
            this.mailgonder=false;
            this.notify.success("Mail Gönderimi Tamamlandı") 
          } else{ 
            this.notify.warning(result.Message);
          }  
      }
    })
    .catch((e:any) => {
      this.blockUI.stop();  
    });
  }

  mailgonder:boolean=false;
  mailGoster(){
    this.mailgonder = !this.mailgonder;
  }

  async GetMailBilgi()  {  
      (await this.genelsrc.GetMailBilgi(this.FirmaKodu)).subscribe(
        data=>{ 
          var mail=data.Model as MailGonderimModel;  

          if(mail!=null){
            this.to = mail.Musteri;
            this.cc = mail.Satici;
          }
        }
      )     
  }  
}
