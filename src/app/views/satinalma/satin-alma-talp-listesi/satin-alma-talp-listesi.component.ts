import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

@Component({
  selector: 'app-satin-alma-talp-listesi',
  templateUrl: './satin-alma-talp-listesi.component.html',
  styleUrls: ['./satin-alma-talp-listesi.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers:[
    {provide:DatePipe},
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } }
  ]
})
export class SatinAlmaTalpListesiComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
