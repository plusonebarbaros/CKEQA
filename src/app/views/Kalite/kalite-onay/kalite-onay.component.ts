import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { KullaniciSrcService } from 'src/app/services/KullaniciSrc';
import { NotifyService } from 'src/app/services/notify';
import { CofirmsrcService } from 'src/app/utils/confirm-dialog/cofirmsrc.service';

@Component({
  selector: 'app-kalite-onay',
  templateUrl: './kalite-onay.component.html',
  styleUrls: ['./kalite-onay.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers:[
    {provide:DatePipe},
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } } 
  ]
})
export class KaliteOnayComponent implements OnInit {
  @ViewChild("matAutoManager", { read: MatAutocompleteTrigger }) autocomplete!: MatAutocompleteTrigger;
  @ViewChild('multiSelect', { static: true }) multiSelect!: MatSelect;
  @Input() placeholderLabel = 'Ara...';
  @BlockUI() blockUI!: NgBlockUI;
  @Input() data:any;
  constructor(
    private modalService: NgbModal,
    private alertify:NotifyService ,
    private confirm: CofirmsrcService,    
    private kullanicisrc:KullaniciSrcService,
    
  ) { }

  ngOnInit(): void {
  }

}
