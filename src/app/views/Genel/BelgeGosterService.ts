import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';   
import { FormGosterComponent } from './form-goster/form-goster.component';

@Injectable({
  providedIn: 'root'
})
export class BelgeGosterService {

  constructor(private modalService: NgbModal) { }

  public confirm(
    pdfdata: any,
    pdfmail: boolean,
    baslik:string,
    icerik:string,
    to:string,
    cc:string,
    bcc:string,
    pdfjson:string,
    Base64Ext:string,
    FirmaKodu:string,
     ): Promise<boolean> {
    const modalRef = this.modalService.open(FormGosterComponent,{  size: "lg", windowClass: 'modalcss50', backdrop: 'static' });
    modalRef.componentInstance.pdfdata = pdfdata;
    modalRef.componentInstance.pdfmail = pdfmail;
    modalRef.componentInstance.baslik = baslik;
    modalRef.componentInstance.icerik = icerik; 
    modalRef.componentInstance.to = to; 
    modalRef.componentInstance.cc = cc; 
    modalRef.componentInstance.bcc = bcc; 
    modalRef.componentInstance.pdfjson = pdfjson; 
    modalRef.componentInstance.Base64Ext = Base64Ext; 
    modalRef.componentInstance.FirmaKodu = FirmaKodu; 

    return modalRef.result;
  }
}
