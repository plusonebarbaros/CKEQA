import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
import { GridDataModel, GridDataResponse } from './mpopup-model';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-dinamik-grid-popup',
  templateUrl: './dinamik-grid-popup.component.html',
  styleUrls: ['./dinamik-grid-popup.component.scss'],
  encapsulation: ViewEncapsulation.None
})
 

export class DinamikGridPopupComponent implements OnInit {
  @ViewChild('gridRehber', { static: false }) gridRehber!: DxDataGridComponent;
  _response :GridDataResponse;
  
  @Input() fromParent:GridDataModel;
    columns: any;

  constructor( 
    private modalService: NgbModal, 
    public activeModal: NgbActiveModal
  ) 
  {  
  }
 

  
  ngOnInit() { 

  }

  closeModal() {
    this._response={ resultData: [] , Status: "Close" }
    this.activeModal.close(this._response);
  }
  
  Sec() {
    this._response={ resultData: this.gridRehber.instance.getSelectedRowsData() , Status: "SelectedData" }
    this.activeModal.close(this._response);

  }
  
  
} 

