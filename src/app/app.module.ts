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
import { MatFormFieldModule } from '@angular/material/form-field';

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
import { SiparisAktarmaComponent } from './views/Siparis/siparis-aktarma/siparis-aktarma.component';
import { MesajGosterComponent } from './views/Genel/mesaj-goster/mesaj-goster.component';
import { KullaniciComponent } from './views/Yonetim/kullanici/kullanici.component';
import { KullaniciDetayComponent } from './views/Yonetim/kullanici-detay/kullanici-detay.component';
import { GrupYetkiComponent } from './views/Yonetim/grup-yetki/grup-yetki.component';
import { GrupYetkiDetayComponent } from './views/Yonetim/grup-yetki-detay/grup-yetki-detay.component';
import { KullaniciDepartmanComponent } from './views/Yonetim/kullanici-departman/kullanici-departman.component';
import { KullaniciPozisyonComponent } from './views/Yonetim/kullanici-pozisyon/kullanici-pozisyon.component';
import { IrsaliyeAktarmaComponent } from './views/Siparis/irsaliye-aktarma/irsaliye-aktarma.component';
import { OzelSiparisComponent } from './views/Siparis/ozel-siparis/ozel-siparis.component';
import { OzelSiparisDetayComponent } from './views/Siparis/ozel-siparis-detay/ozel-siparis-detay.component';
import { SistemParametreComponent } from './views/Yonetim/sistem-parametre/sistem-parametre.component';
import { OnayKategoriComponent } from './views/Onay/onay-kategori/onay-kategori.component';
import { OnayKategoriDetayComponent } from './views/Onay/onay-kategori-detay/onay-kategori-detay.component';
import { OnayKuralComponent } from './views/Onay/onay-kural/onay-kural.component';
import { OnayTanimComponent } from './views/Onay/onay-tanim/onay-tanim.component';
import { OnayTanimDetayComponent } from './views/Onay/onay-tanim-detay/onay-tanim-detay.component';
import { TalepComponent } from './views/SatinAlma/talep/talep.component';
import { TalepDetayComponent } from './views/SatinAlma/talep-detay/talep-detay.component';
import { TransferComponent } from './views/SatinAlma/transfer/transfer.component';
import { TransferOnayComponent } from './views/SatinAlma/transfer-onay/transfer-onay.component';
import { TalepTarihceComponent } from './views/Genel/talep-tarihce/talep-tarihce.component';
import { OnayDurumKontrolComponent } from './views/Genel/onay-durum-kontrol/onay-durum-kontrol.component';
import { BelgeGoruntuleComponent } from "./views/Genel/belge-goruntule/belge-goruntule.component";
import { BekleyenOnayComponent } from './views/Onay/bekleyen-onay/bekleyen-onay.component';
import { OnayGecmisComponent } from './views/Onay/onay-gecmis/onay-gecmis.component';
import { FireYonetimComponent } from './views/Stok/fire-yonetim/fire-yonetim.component';
import { SayimYonetimComponent } from './views/Stok/sayim-yonetim/sayim-yonetim.component';
import { SayimDetayComponent } from './views/Stok/sayim-detay/sayim-detay.component';
import { FireTipTanimComponent } from './views/Yonetim/fire-tip-tanim/fire-tip-tanim.component';
import { TalepKontrolListesiComponent } from './views/SatinAlma/talep-kontrol-listesi/talep-kontrol-listesi.component';
import { SiparisTeslimAlComponent } from './views/SatinAlma/siparis-teslim-al/siparis-teslim-al.component';
import { DepoTransferOnayComponent } from './views/SatinAlma/depo-transfer-onay/depo-transfer-onay.component';
import { SozlesmeListesiComponent } from './views/Test/sozlesme-listesi/sozlesme-listesi.component';
import { SozlesmeDetayComponent } from './views/Test/sozlesme-detay/sozlesme-detay.component';
import { FireTipMuhasebeTanimComponent } from './views/Yonetim/fire-tip-muhasebe-tanim/fire-tip-muhasebe-tanim.component'; 
import { DinamikGridPopupComponent } from './views/dinamik-grid-popup/dinamik-grid-popup/dinamik-grid-popup.component';
import { KaliteIsemriComponent } from './views/Kalite/kalite-isemri/kalite-isemri.component';
import { KaliteGirisStokComponent } from './views/Kalite/kalite-giris/kalite-giris-stok/kalite-giris-stok.component'; 
import { KaliteGirisSatinalmaComponent } from './views/Kalite/kalite-giris/kalite-giris-satinalma/kalite-giris-satinalma.component'; 
import { KaliteReceteEngelComponent } from './views/Kalite/kalite-recete-engel/kalite-recete-engel.component';
import { KaliteOnayComponent } from './views/Kalite/kalite-onay/kalite-onay.component';

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
    SiparisAktarmaComponent,
    MesajGosterComponent,
    KullaniciComponent,
    KullaniciDetayComponent,
    GrupYetkiComponent,
    GrupYetkiDetayComponent,
    KullaniciDepartmanComponent,
    KullaniciPozisyonComponent,
    IrsaliyeAktarmaComponent,
    OzelSiparisComponent,
    OzelSiparisDetayComponent,
    SistemParametreComponent,
    OnayKategoriComponent,
    OnayKategoriDetayComponent,
    OnayKuralComponent,
    OnayTanimComponent,
    OnayTanimDetayComponent,
    TalepComponent,
    TalepDetayComponent,
    TransferComponent,
    TransferOnayComponent,
    TalepTarihceComponent,
    OnayDurumKontrolComponent,
    BelgeGoruntuleComponent,
    BekleyenOnayComponent,
    OnayGecmisComponent,
    FireYonetimComponent,
    SayimYonetimComponent,
    SayimDetayComponent,
    FireTipTanimComponent,
    TalepKontrolListesiComponent,
    SiparisTeslimAlComponent,
    DepoTransferOnayComponent,
    SozlesmeListesiComponent,
    SozlesmeDetayComponent,
    FireTipMuhasebeTanimComponent, 
    DinamikGridPopupComponent,
    KaliteIsemriComponent,
    KaliteGirisStokComponent,
    KaliteGirisSatinalmaComponent,
    KaliteReceteEngelComponent,
    KaliteOnayComponent
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
    DxChartModule,
    MatFormFieldModule,
    NgxMaskModule.forRoot(),

      ],
  providers: [
    { provide: LOCALE_ID, useValue: "tr-TR" },
    { provide: MAT_DATE_LOCALE, useValue: 'tr-TR' },
    { provide:'semUrl',useValue:'http://82.222.7.156:13921/api'},
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