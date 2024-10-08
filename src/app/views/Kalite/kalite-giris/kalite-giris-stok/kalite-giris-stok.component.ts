import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DxDataGridComponent } from 'devextreme-angular';
import { dxDataGridColumn } from 'devextreme/ui/data_grid';
import moment from 'moment';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subject, ReplaySubject, takeUntil } from 'rxjs';
import { StokGrupModel, GenelApi, EkranMesaj, IslemTipi, SehirModel, IlceModel } from 'src/app/services/GenelSrc';
import { EmirList, KaliteSrcService, Liste, ListeArama, Senaryo, SenaryoArama, SeriRehberModel, SonucListeSTK, StokRehberModel } from 'src/app/services/kaliteSrc';
import { KullaniciYetki, ConDepoYetki, KullaniciModel, KullaniciSrcService } from 'src/app/services/KullaniciSrc';
import { NotifyService } from 'src/app/services/notify';
import { ConnOlcuBirim, SabitservService } from 'src/app/services/SabitSrc';
import { Items, Customer, ConnTalepIhtDurum, TalepsrcService, TalepMaster, ItemsFile } from 'src/app/services/SatinAlmaSrc';
import { OzelSiparisMaster, OzelSiparisKalem, SiparisService } from 'src/app/services/SiparisSrc';
import { CofirmsrcService } from 'src/app/utils/confirm-dialog/cofirmsrc.service';
import { DinamikGridPopupComponent } from 'src/app/views/dinamik-grid-popup/dinamik-grid-popup/dinamik-grid-popup.component';
import { GridDataModel } from 'src/app/views/dinamik-grid-popup/dinamik-grid-popup/mpopup-model';
import { ChangeDetectorRef } from '@angular/core';
import { TabService } from 'src/app/services/tab.service';
@Component({
  selector: 'app-kalite-giris-stok',
  templateUrl: './kalite-giris-stok.component.html',
  styleUrls: ['./kalite-giris-stok.component.scss']
})
export class KaliteGirisStokComponent implements OnInit {

  @ViewChild('gridSenaryoList', { static: false }) gridSenaryoList!: DxDataGridComponent;
  @BlockUI() blockUI!: NgBlockUI;
  @Input() data:any;   

  yetki:KullaniciYetki;  
  kulltoken:string="";
  lookupDataSource = {};
  date:any; 
  emirlist:EmirList[]=[];  
  senaryoList:Senaryo[]=[];  
  liste : Liste[]=[];
  sonucListeSTK : SonucListeSTK[]=[];

  stokrehberlist:StokRehberModel[]=[];
  serirehberlist:SeriRehberModel[]=[];
  
  btnKaydetCaption:string="KAYDET";
  senaryoArama : SenaryoArama;
  listeArama : ListeArama;

  secilistok:StokRehberModel; 
  secilistokModal:StokRehberModel; 

  seciliseri:SeriRehberModel; 
  seciliseriModal:SeriRehberModel; 

  kalemkeyword:string=""; 
  miktar:number=0;
  seciliuser: KullaniciModel; 

  senaryoAdi:string="";
  orneklem:number=0;
  tekrarsayisi:number=0;
  KullaniciAdi:string="";
  alldata:any;

  strKaliteID :number=0;
  strBaslangic:any;
  strKullanici:string="";
  EmirDurum:string="";
  KaliteID :number=0;
  _gridColumns:Array<dxDataGridColumn | string>
  gridDataModel : GridDataModel;
 
  btnKaydetDisable:boolean;
  constructor(
    
    private genelsrv:GenelApi,
    private alertify:NotifyService,
    private kalitesrc:KaliteSrcService,
    private modalService: NgbModal,
    private cdr: ChangeDetectorRef,
    private tabService: TabService
    ) {       
      this.seciliuser=new KullaniciModel; 
      this.senaryoArama = new SenaryoArama();
      this.secilistok=new StokRehberModel();
      this.secilistokModal=new StokRehberModel();
      this.seciliseri=new SeriRehberModel();
      this.seciliseriModal=new SeriRehberModel();
      this.listeArama = new ListeArama();
      
    }   
    
    

    
  async ngOnInit(): Promise<void> {  
      
      this.kulltoken = sessionStorage?.getItem("Token")??"";
      this.KaliteID = this.data.EmirNo;
      this.EmirDurum = this.data.Durum;
      await this.KaliteSonuclariniVer();       
      const data = sessionStorage.getItem('data');
      const parsedData = data ? JSON.parse(data) : null;
      this.KullaniciAdi = parsedData ? parsedData.KullaniciAdi : null;    
      this.btnKaydetDisable = this.EmirDurum == "TAM";
    
  }


  ngOnDestroy() {
    // Aboneliği iptal et 
    this.tabService.setKaliteTabActive(true);
  }

  async SenaryoGetir(){
    if (this.miktar ==0 )
    {
      this.alertify.warning("Miktar girişi yapılmadan senaryo çalıştıramazsınız...");
      return;
    }
    this.blockUI.start(EkranMesaj.Listele);
    this.senaryoArama.StokKodu = this.secilistok.ItemCode;
    this.senaryoArama.Miktar = this.miktar;
    this.senaryoArama.Bolum = "STK";
    var sonuc  =  await this.kalitesrc.GetKaliteSenaryoList(this.senaryoArama); 
    if ( sonuc.List.length < 1) 
    {
      this.alertify.warning("Seçmiş olduğunuz kriterler ile senaryo bulunamamıştır");
      this.blockUI.stop();    
      return;
    }
    this.senaryoList =  sonuc.List;
    this.senaryoAdi = this.senaryoList[0].Tanim;
    this.orneklem = this.senaryoList[0].OrneklemBaslangic;
    this.tekrarsayisi = this.senaryoList[0].TekrarSayisi;
 
    this.blockUI.stop();    

  }
  
  async KaliteSonuclariniVer(){
    this.sonucListeSTK = [];
  
    var sonuc  =  await this.kalitesrc.GetKaliteSonucListe(this.KaliteID); 
   
    this.strBaslangic = moment(new Date).format("DD-MM-yyyy");   
    
    if ( sonuc.List.length < 1) 
    {
      this.btnKaydetCaption = "KAYDET"
      
      const filteredItem = this.data.data.find((item: any) => item.DocEntry === this.KaliteID);
    
      this.secilistok.ItemCode =  filteredItem.StokKodu  
      this.seciliseri.DistNumber =  filteredItem.LotSeriNo
      this.secilistok.ItemName =  filteredItem.StokAdi
      this.miktar = 1; 
      this.strKullanici = this.KullaniciAdi;
      this.SenaryoGetir();
      this.blockUI.stop();    
      return;
    }




    this.sonucListeSTK =  sonuc.List;
    this.strKullanici =this.sonucListeSTK[0].Kullanici;
    this.strBaslangic =moment(this.sonucListeSTK[0].BaslamaTarihi).format("DD-MM-yyyy");   
    this.strKaliteID =this.sonucListeSTK[0].KaliteID;

    
    sonuc.List.forEach((row: any) => {
      let sonuc = new Senaryo();
      
      // Her bir satır verisini class'ın ilgili alanlarına ekliyoruz
      this.secilistok.ItemCode =  row.StokKodu;  
      this.seciliseri.DistNumber =  row.LotNumber;
      this.secilistok.ItemName =  row.StokAdi
      this.senaryoAdi = row.SenaryoAdi;
      this.miktar = row.Miktar;
      sonuc.ID = row.ID || 0;
      sonuc.SonucDocEntry = row.SonucDocEntry || 0;
      sonuc.SenaryoSatirId = row.SenaryoSatirId || 0;
      sonuc.TekrarNo = row.TekrarNo || 0;
      sonuc.DocEntry = row.DocEntry || 0;
      sonuc.AracKodu = row.AracKodu || "";
      sonuc.AracAdi = row.AracAdi || "";
      sonuc.TestAdi = row.TestAdi || "";
      sonuc.DegerTipi = row.DegerTipi || "";
      sonuc.DegerTipiAciklamasi = row.DegerTipiAciklamasi || "";
      sonuc.Ondalik = row.Ondalik || 0;
      sonuc.Operator = row.Operator || "";
      sonuc.Deger1 = row.Deger1 || 0;
      sonuc.Deger2 = row.Deger2 || 0;
      sonuc.Deger = row.Deger || 0;
      sonuc.Metin = row.Metin || "";
      sonuc.Liste = row.liste || "";
      sonuc.ListeKodu = row.ListeKodu || "";
      sonuc.Zorunlu = row.Zorunlu == "Y"? true :false;
      sonuc.TestYontemi = row.TestYontemi || ""; 
 
      this.senaryoList.push(sonuc);
  }) 
 
    this.cdr.detectChanges();
    this.btnKaydetCaption = "GÜNCELLE"
  }

  async SonuclariKaydet(){
   
    this.blockUI.start(EkranMesaj.Listele);
    this.sonucListeSTK = []; 
    this.senaryoList=[];

    this.gridSenaryoList.instance.repaint(); 
    
    this.alldata = this.gridSenaryoList.instance.getDataSource().items();
    

 
    this.alldata.forEach((row: any) => {
        let sonuc = new SonucListeSTK();
        
        // Her bir satır verisini class'ın ilgili alanlarına ekliyoruz
        sonuc.AddUpd = this.btnKaydetCaption =="KAYDET" ? "Add" : "Update";
        sonuc.Token = this.kulltoken;
        sonuc.KaliteID = this.data.EmirNo;
        sonuc.Kullanici = this.KullaniciAdi || "";
        sonuc.BaslamaTarihi = this.strBaslangic || new Date(); 
        sonuc.StokKodu = this.secilistok.ItemCode || "";
        sonuc.StokAdi = this.secilistok.ItemName || "";
        sonuc.LotSeri = this.seciliseri.DistNumber || "";
        sonuc.Miktar = this.miktar || 0;
        sonuc.ID = row.ID || 0;
        sonuc.SonucDocEntry = row.SonucDocEntry || 0;
        sonuc.SenaryoAdi = row.SenaryoAdi || "";
        sonuc.SenaryoSatirId = row.SenaryoSatirId || 0;
        sonuc.TekrarNo = row.TekrarNo || 0;
        sonuc.DocEntry = row.DocEntry || 0;
        sonuc.AracKodu = row.AracKodu || "";
        sonuc.AracAdi = row.AracAdi || "";
        sonuc.TestAdi = row.TestAdi || "";
        sonuc.DegerTipi = row.DegerTipi || "";
        sonuc.DegerTipiAciklamasi = row.DegerTipiAciklamasi || "";
        sonuc.Ondalik = row.Ondalik || 0;
        sonuc.Operator = row.Operator || "";
        sonuc.Deger1 = row.Deger1 || 0;
        sonuc.Deger2 = row.Deger2 || 0;
        sonuc.Deger = row.Deger || 0;
        sonuc.Metin = row.Metin || "";
        sonuc.Liste = row.Liste || "";
        sonuc.ListeKodu = row.ListeKodu || "";
        sonuc.Zorunlu = row.Zorunlu ? "Y" : "N";
        sonuc.TestYontemi = row.TestYontemi || "";  

        this.sonucListeSTK.push(sonuc);
    }) 
    console.log(this.sonucListeSTK);
    var sonuc  =  await this.kalitesrc.SetKaliteSonucKaydet(this.sonucListeSTK); 
    
    if (!sonuc.Success) 
    {
      this.alertify.warning(sonuc.Message);
      this.blockUI.stop();    
      return;
    }
    this.alertify.success("Kalite süreci başlatılmıştır");
    await this.KaliteSonuclariniVer();       

    this.btnKaydetCaption = "GÜNCELLE" 
    this.blockUI.stop();    

  }

  async EmriKapat(){
   
    this.blockUI.start(EkranMesaj.Listele);
     
    var sonuc  =  await this.kalitesrc.SetKaliteSonucKapat(this.data.EmirNo); 
    
    if (!sonuc.Success) 
    {
      this.alertify.warning(sonuc.Message);
      this.blockUI.stop();    
      return;
    }
    this.alertify.success("Kalite süreci kapatılmıştır");
    this.btnKaydetCaption = "GÜNCELLE" 
    this.blockUI.stop();    

  }




  async stokkalemAra(ev:any){ 
    if(this.kalemkeyword==""){
      this.alertify.warning("Aramak İstediğiniz Firmayı Kısaca Yazın...");
      return;
    }

    if (ev.keyCode === 13 && this.kalemkeyword!="") { 
      this.blockUI.start(EkranMesaj.Listele);
      (await this.kalitesrc.GetStokRehberAramaList(this.kalemkeyword??"")).subscribe(
        data=>{
          this.blockUI.stop(); 
          if(!data.Success){
         
            this.alertify.warning(data.Message);
            return;
          }
          this.stokrehberlist=data.List;  
        }
      )     
    }
  }

  async serikalemAra(ev:any){ 
    if(this.kalemkeyword==""){
      this.alertify.warning("Aramak İstediğiniz Firmayı Kısaca Yazın...");
      return;
    }

    if (ev.keyCode === 13 && this.kalemkeyword!="") { 
      this.blockUI.start(EkranMesaj.Listele);
      this.seriRehberDoldur();  
      this.blockUI.stop();
    }

  }

  async seriRehberDoldur( ){ 
  
      (await this.kalitesrc.GetSeriRehberAramaList(this.kalemkeyword??"",this.secilistok.ItemCode)).subscribe(
        data=>{
          this.blockUI.stop(); 
          if(!data.Success){
            this.alertify.warning(data.Message);
            return;
          }
          this.serirehberlist=data.List;  
        }
      )     
    
  }

  async stokAramaModaltemizle(){
    this.kalemkeyword="";
    this.stokrehberlist=[];
  }

  async stokrehberModalAc(content:any){
    this.kalemkeyword="";
    this.stokrehberlist=[];
    this.secilistokModal=new StokRehberModel();     
    this.modalService.open(content, {  size: 'lg',windowClass: 'modalcss50', backdrop: 'static' }); 
  } 

  async serirehberModalAc(content:any){
    this.kalemkeyword="";
    this.stokrehberlist=[];
    this.seciliseriModal=new SeriRehberModel();     
    this.modalService.open(content, {  size: 'lg',windowClass: 'modalcss50', backdrop: 'static' }); 
  } 
 
  async stokrehberTemizle(){
    this.secilistokModal=new StokRehberModel(); 
  }

  async serirehberTemizle(){
    this.seciliseriModal   =new SeriRehberModel(); 
  }

  async PopupAc(popupClass:any, event:any)  {
    
    if  (event.data.DegerTipi != "LST")
      {
        this.alertify.warning("Liste tipli olmayan satır için seçim yapılamaz");
        return;
      } 
      this.blockUI.start(EkranMesaj.Listele);
      
      this.listeArama.SenaryoSatirId = event.data.SenaryoSatirId;
      this.listeArama.DocEntry = event.data.DocEntry;
      
      
      var Rehberliste  =  await this.kalitesrc.GetKaliteListe(this.listeArama); 
      
      if ( Rehberliste.List.length < 1) 
      {
        this.alertify.warning(Rehberliste.Message);
        this.blockUI.stop();    
        return;
      }
      this.liste = Rehberliste.List;
 

    const modalRef = this.modalService.open(DinamikGridPopupComponent,
      {
        scrollable: true,
        windowClass: popupClass
      }); 


      this._gridColumns   =  [
          {dataField: 'Kod',caption: 'Kod',dataType:'number'}, 
          {dataField: 'Tanim',caption: 'Tanim',dataType: 'string' },
          {dataField: 'Aciklama1',caption: 'Aciklama',dataType: 'string' },
        ] ;

     
      this.gridDataModel = 
      {
        data:this.liste , 
        columns: this._gridColumns,
        masterKey: 'Kod',
        caption: 'Seçim Rehberi',
        description: 'Uygun görülen değeri listeden seçiniz'
      }
      this.blockUI.stop();
    modalRef.componentInstance.fromParent = this.gridDataModel;
    const  sonuc  = await modalRef.result.then((result) => {
     
      if (result.Status == "SelectedData")
      {  
      
        this.gridSenaryoList.instance.repaint();
        this.gridSenaryoList.instance.cellValue(event.rowIndex,"Liste",result.resultData[0].Tanim)
        this.gridSenaryoList.instance.saveEditData()
      } 
      else if (result.Status == "Close")
      {
        console.log("Listeden bir değer seçilmedi")  
      }
    }, 
    (reason) => {});

    
  }




  openFile(path: string) {
    // Dosyayı açma işlemi, yeni bir pencerede veya sekmede açabilir
    window.open(path, '_blank');
  }

  onRowDblClickModal(){  
    document.getElementById("finhspkapat")?.click();   
    if(this.secilistokModal==null)return;
    this.secilistok.ItemCode = this.secilistokModal.ItemCode; 
    this.secilistok.ItemName = this.secilistokModal.ItemName; 
    this.miktar = 1
  }

  onRowDblClickSeriModal(){  
    document.getElementById("finhspkapat")?.click();   
    if(this.seciliseriModal==null)return;
    this.seciliseri.DistNumber = this.seciliseriModal.DistNumber; 
  }

  onSelectionChangedStokModal(e:any){
    let secim = e?.selectedRowsData[0] ?? null;
    if(secim!=null){
      this.secilistokModal = secim;
    } 
  } 

  onSelectionChangedSeriModal(e:any){
    let secim = e?.selectedRowsData[0] ?? null;
    if(secim!=null){
      this.seciliseriModal = secim;
    } 
  } 

  onEditorPreparing(e:any) {
    if(e.row === undefined) {return}

    if (e.dataField === "Deger" && e.row.data.DegerTipi === "LST") {
        e.editorOptions.readOnly = true;
        e.cancel=true;
    }
   

    if (e.dataField === "Metin" && e.row.data.DegerTipi === "LST") {
      e.editorOptions.readOnly = true;
      e.cancel=true;
    }    
   
    
    if (e.dataField === "Deger" && e.row.data.DegerTipi === "TXT") {
      e.editorOptions.readOnly = true;
      e.cancel=true;
    }
  
    
    if (e.dataField === "Liste" && e.row.data.DegerTipi === "TXT") {
      e.editorOptions.readOnly = true;
      e.cancel=true;
    } 
    

    if (e.dataField === "Metin" && e.row.data.DegerTipi === "NUM") {
      e.editorOptions.readOnly = true;
      e.cancel=true;
    }
   
    if (e.dataField === "Liste" && e.row.data.DegerTipi === "NUM" ) {
      e.editorOptions.readOnly = true;
      e.cancel=true;
    }  
     
  }

  onCellPrepared(e:any) {
    if (e.rowType === 'data' && e.data.DegerTipi === 'LST') {
      if (e.column.dataField === 'Deger' || e.column.dataField === 'Metin') {
        e.cellElement.style.backgroundColor = '#f0f0f0';
      }
    }
    if (e.rowType === 'data' && e.data.DegerTipi === 'TXT') {
      if (e.column.dataField === 'Deger' || e.column.dataField === 'Liste') {
        e.cellElement.style.backgroundColor = '#f0f0f0';
      }
    }
    if (e.rowType === 'data' && e.data.DegerTipi === 'NUM') {
      if (e.column.dataField === 'Metin' || e.column.dataField === 'Liste') {
        e.cellElement.style.backgroundColor = '#f0f0f0';
      }
    }
    if (!(e.column.dataField === 'Metin' || e.column.dataField === 'Deger' || e.column.dataField === 'Liste')) {
      e.cellElement.style.backgroundColor = '#f0f0f0';
    }
  }
}
 