import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertifyService } from 'src/app/services/alert';
import { NotifyService } from 'src/app/services/notify';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {

  @Input() title: string="";
  @Input() message: string="";
  @Input() btnOkText: string="";
  @Input() btnCancelText: string=""; 
  @Input() CommentsShow: boolean=false; 
  Comments:string=""; 
  
  constructor(private activeModal: NgbActiveModal,private alertify:NotifyService ) { }

  ngOnInit(): void {
  }

  public decline() {
    this.activeModal.close({sonuc:false,aciklama:""});
  }

  public accept() {
    if(this.CommentsShow && this.Comments==""){
      this.alertify.warning("Açıklama Alanı Zorunludur!");
      return;
    }
    else 
    {
      this.activeModal.close({sonuc:true,aciklama:this.Comments}); 
    }
  }

  public dismiss() {
    this.activeModal.dismiss({sonuc:false,aciklama:this.Comments});
  }

}
