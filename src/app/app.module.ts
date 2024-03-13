import { BrowserModule } from "@angular/platform-browser";
import { LOCALE_ID, NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatTabsModule } from "@angular/material/tabs";
import { MatButtonModule } from "@angular/material/button";
import { HttpClientModule } from '@angular/common/http';
import { MatInputModule} from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {MatBadgeModule} from '@angular/material/badge';

import { TabService } from './services/tab.service'; 
import { TabContentComponent } from "./tabs/tab-content";
import { ContentContainerDirective } from "./tabs/content-container";
import { DxDataGridModule } from 'devextreme-angular/ui/data-grid';   
import { DxButtonModule } from 'devextreme-angular/ui/button';   
import { DxSortableModule } from 'devextreme-angular/ui/sortable';   
import { DxTabPanelModule } from 'devextreme-angular/ui/tab-panel';    
import { DxSelectBoxModule } from 'devextreme-angular/ui/select-box'; 

import { AppComponent } from './app.component';

import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import * as $ from "jquery";
import { LoginComponent } from './views/login/login.component';
import { NgbDatepickerModule, NgbModalModule, NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import {MatAutocompleteModule} from '@angular/material/autocomplete'; 
import { FilterPipe } from './utils/filter.pipe';
import { BlockUIModule } from "ng-block-ui";
import { ConfirmDialogComponent } from './utils/confirm-dialog/confirm-dialog.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {MatSlideToggleModule} from '@angular/material/slide-toggle'; 
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';  
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import {MatSnackBarModule} from '@angular/material/snack-bar'; 
import {MatTooltipModule} from '@angular/material/tooltip'; 
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatRadioModule} from '@angular/material/radio';  
import {MatGridListModule} from '@angular/material/grid-list'; 
import tr from '@angular/common/locales/tr';
import { registerLocaleData } from '@angular/common'; 
import {MatExpansionModule} from '@angular/material/expansion';
import { DxPivotGridModule } from 'devextreme-angular/ui/pivot-grid';
import {ClipboardModule} from '@angular/cdk/clipboard';
import { DxCalendarModule, DxListModule, DxPieChartModule, DxSpeedDialActionModule, DxTemplateModule } from 'devextreme-angular';
import { DxChartModule } from 'devextreme-angular';
import { CommonModule } from '@angular/common';
import trMessages from "devextreme/localization/messages/tr.json";
import { locale, loadMessages } from "devextreme/localization";
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import { NgxMaskModule } from "ngx-mask";
import { DxProgressBarModule } from "devextreme-angular";
import { StokAramaComponent } from './views/Stok/stok-arama/stok-arama.component';
import { RafBulmaComponent } from './views/Stok/raf-bulma/raf-bulma.component';
import { SiparisAktarmaComponent } from './views/Siparis/siparis-aktarma/siparis-aktarma.component';

registerLocaleData(tr);
loadMessages(trMessages);
locale(navigator.language);

@NgModule({
  declarations: [  
    AppComponent,
    TabContentComponent,
    ContentContainerDirective, 
    LoginComponent,
    FilterPipe,
    ConfirmDialogComponent,
    StokAramaComponent,
    RafBulmaComponent,
    SiparisAktarmaComponent,
      
      ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule, 
    MatTabsModule,
    MatButtonModule, 
    MatNativeDateModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    MatSlideToggleModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule ,
    MatExpansionModule,
    MatCardModule, 
    MatBadgeModule, 
    HttpClientModule,  
    DxDataGridModule,
    DxButtonModule, 
    DxTabPanelModule, 
    DxListModule,  
    DxPivotGridModule,  
    DxSelectBoxModule,
    DxPieChartModule, 
    DxTemplateModule, 
    FormsModule,
    NgbModule, 
    ReactiveFormsModule,
    BlockUIModule.forRoot(), 
    MatIconModule,
    NgxMatSelectSearchModule,
    NgbDatepickerModule,  
    MatMomentDateModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatSidenavModule,
    MatRadioModule,
    MatGridListModule, 
    ClipboardModule,
    CommonModule,
    DxCalendarModule,
    DxProgressBarModule,
    DxChartModule
      ],
  providers: [
    { provide: LOCALE_ID, useValue: "tr-TR" },
    { provide: MAT_DATE_LOCALE, useValue: 'tr-TR' },
    {provide:'semUrl',useValue:'http://localhost:3525/api'},
    //{provide:'semUrl',useValue:'http://ciroapi.harmantr.com/api'},
    TabService,
    MatDatepickerModule,     
  ],
  bootstrap: [AppComponent],
  entryComponents: [],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})

export class AppModule { } 