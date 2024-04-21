import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';  
import { MesajGosterComponent } from '../views/Genel/mesaj-goster/mesaj-goster.component';

@Injectable({
  providedIn: 'root'
})
export class MesajversrcService {

  constructor(private modalService: NgbModal) { }

  public confirm(
    title: string,
    message: string,
    btnOkText: string = 'Evet',
    btnCancelText: string = 'Vazgeç',
    Comments:boolean=false,
    CommentsText:string="",
    dialogSize: 'sm'|'lg' = 'sm'): Promise<boolean> {
    const modalRef = this.modalService.open(MesajGosterComponent,{  size: "lg", windowClass: 'modalcss20', backdrop: 'static' });
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.message = message;
    modalRef.componentInstance.btnOkText = btnOkText;
    modalRef.componentInstance.btnCancelText = btnCancelText;
    modalRef.componentInstance.CommentsShow=Comments;
    modalRef.componentInstance.Comments=CommentsText;

    return modalRef.result;
  }
}
