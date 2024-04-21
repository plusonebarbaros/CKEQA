import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'; 
import { NotifyService } from 'src/app/services/notify';

@Component({
  selector: 'app-mesaj-goster',
  templateUrl: './mesaj-goster.component.html',
  styleUrls: ['./mesaj-goster.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers:[
    { provide: DatePipe },
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } },
  ]
})
export class MesajGosterComponent implements OnInit {
  @Input() title: string="";
  @Input() message: string="";
  @Input() btnOkText: string="";
  @Input() btnCancelText: string=""; 
  @Input() CommentsShow: boolean=false; 
  Comments:string=""; 
  
  constructor(private activeModal: NgbActiveModal,private alertify:NotifyService ) { }

  ngOnInit(): void {
  }
  
  public dismiss() {
    this.activeModal.dismiss();
  }
}
