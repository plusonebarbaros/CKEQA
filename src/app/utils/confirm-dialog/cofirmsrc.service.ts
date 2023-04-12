import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmDialogComponent } from './confirm-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class CofirmsrcService {

  constructor(private modalService: NgbModal) { }

  public confirm(
    title: string,
    message: string,
    btnOkText: string = 'Evet',
    btnCancelText: string = 'Vazgeç',
    Comments:boolean=false,
    CommentsText:string="",
    dialogSize: 'sm'|'lg' = 'sm'): Promise<boolean> {
    const modalRef = this.modalService.open(ConfirmDialogComponent,{  size: "lg", windowClass: 'confirmmodal', backdrop: 'static' });
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.message = message;
    modalRef.componentInstance.btnOkText = btnOkText;
    modalRef.componentInstance.btnCancelText = btnCancelText;
    modalRef.componentInstance.CommentsShow=Comments;
    modalRef.componentInstance.Comments=CommentsText;

    return modalRef.result;
  }
}
