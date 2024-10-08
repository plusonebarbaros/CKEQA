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
import { EmirList, KaliteSrcService, Liste, ListeArama, ReceteList, ReceteListArama, ReceteListPost, Senaryo, SenaryoArama, SeriRehberModel, SonucListeSTK, StokRehberModel } from 'src/app/services/kaliteSrc';
import { KullaniciYetki, ConDepoYetki, KullaniciModel, KullaniciSrcService } from 'src/app/services/KullaniciSrc';
import { NotifyService } from 'src/app/services/notify';
import { ConnOlcuBirim, SabitservService } from 'src/app/services/SabitSrc';
import { Items, Customer, ConnTalepIhtDurum, TalepsrcService, TalepMaster, ItemsFile } from 'src/app/services/SatinAlmaSrc';
import { OzelSiparisMaster, OzelSiparisKalem, SiparisService } from 'src/app/services/SiparisSrc';
import { CofirmsrcService } from 'src/app/utils/confirm-dialog/cofirmsrc.service';
import { DinamikGridPopupComponent } from 'src/app/views/dinamik-grid-popup/dinamik-grid-popup/dinamik-grid-popup.component';
import { GridDataModel } from 'src/app/views/dinamik-grid-popup/dinamik-grid-popup/mpopup-model';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-kalite-recete-engel',
  templateUrl: './kalite-recete-engel.component.html',
  styleUrls: ['./kalite-recete-engel.component.scss']
})
export class KaliteReceteEngelComponent implements OnInit {
  @ViewChild('gridRecete', { static: false }) gridRecete!: DxDataGridComponent;
  @BlockUI() blockUI!: NgBlockUI;
  @Input() data:any;    
  yetki:KullaniciYetki;  
  kulltoken:string="";
  lookupDataSource = {};
  date:any;  
  alldata:any;

  stokrehberlist:StokRehberModel[]=[];
  serirehberlist:SeriRehberModel[]=[];
  
  btnKaydetCaption:string="KAYDET";
  receteList:ReceteList[]=[];

  secilistok:StokRehberModel; 
  secilistokModal:StokRehberModel; 

  seciliseri:SeriRehberModel; 
  seciliseriModal:SeriRehberModel; 

  kalemkeyword:string=""; 
 
  seciliuser: KullaniciModel; 
 
  KullaniciAdi:string=""; 
 
  filter:ReceteListArama;
  recetePost :ReceteListPost[]=[];

  _gridColumns:Array<dxDataGridColumn | string>
  gridDataModel : GridDataModel;
 
  btnKaydetDisable:boolean;
  constructor(
    
    private genelsrv:GenelApi,
    private alertify:NotifyService,
    private kalitesrc:KaliteSrcService,
    private modalService: NgbModal,
    private cdr: ChangeDetectorRef 
    ) {       
      this.seciliuser=new KullaniciModel; 
     
      this.secilistok=new StokRehberModel();
      this.secilistokModal=new StokRehberModel();
      this.seciliseri=new SeriRehberModel();
      this.seciliseriModal=new SeriRehberModel();
      this.filter = new ReceteListArama();
      
    }   
    
    

    
  async ngOnInit(): Promise<void> {  
      
      this.kulltoken = sessionStorage?.getItem("Token")??"";
      const data = sessionStorage.getItem('data');
      const parsedData = data ? JSON.parse(data) : null;
      this.KullaniciAdi = parsedData ? parsedData.KullaniciAdi : null;    
    
  }
 async Kaydet(){

        this.blockUI.start(EkranMesaj.Kaydet);
        this.alldata = this.gridRecete.instance.getDataSource().items();
        this.recetePost = [];
        this.alldata.forEach((row: any) => {
        let recete = new ReceteListPost(); 
        recete.Token = this.kulltoken;
        recete.Kullanici = this.KullaniciAdi; 
        recete.Lot = this.seciliseri.DistNumber || "";
        recete.ReceteKodu = row.ReceteUrunKodu || "";
        recete.StokKodu = this.secilistok.ItemCode || "";
        recete.Secim = row.Secim || false;
        this.recetePost.push(recete);
    }) 

    var sonuc  =  await this.kalitesrc.SetReceteListesi(this.recetePost); 
    
    
    if (!sonuc.Success) 
      {
        this.alertify.warning(sonuc.Message);
        this.blockUI.stop();    
        return;
      }  
      this.blockUI.stop();    
      this.alertify.success("Kayıt işlemi tamamlanmıştır");
  

 }

 async ReceteGetir(){
    if(this.seciliseri.DistNumber==""){
      this.alertify.warning("LOT numarası olmadan Reçeteleri listeleyemezsiniz");
      return;
    }

    if(this.secilistok.ItemCode==""){
      this.alertify.warning("Stok Kodu  olmadan Reçeteleri listeleyemezsiniz");
      return;
    }
    
    this.receteList=[];
    this.blockUI.start(EkranMesaj.Listele);
    this.filter.ItemCode = this.secilistok.ItemCode;
    this.filter.Token = this.kulltoken;
    this.filter.Lot = this.seciliseri.DistNumber;


    var sonuc  =  await this.kalitesrc.GetReceteListesi(this.filter); 
    
    if ( sonuc.List.length < 1) 
    {
      this.alertify.warning("Seçmiş olduğunuz kriterler ile senaryo bulunamamıştır");
      this.blockUI.stop();    
      return;
    }
    this.receteList =  sonuc.List;
    this.secilistok.ItemName = sonuc.List[0].StokAdi;
 
    this.blockUI.stop();    

 }

 


  async stokkalemAra(ev:any){ 
    if(this.kalemkeyword==""){
      this.alertify.warning("Aramak İstediğiniz Firmayı Kısaca Yazın...");
      return;
    }

    if (ev.keyCode === 13 && this.kalemkeyword!="") { 
      this.blockUI.start(EkranMesaj.Listele);
      (await this.kalitesrc.GetReceteStokRehberAramaList(this.kalemkeyword??"")).subscribe(
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
  
      (await this.kalitesrc.GetReceteSeriRehberAramaList(this.kalemkeyword??"",this.secilistok.ItemCode)).subscribe(
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
 

 

  onRowDblClickModal(){  
    document.getElementById("finhspkapat")?.click();   
    if(this.secilistokModal==null)return;
    this.secilistok.ItemCode = this.secilistokModal.ItemCode; 
    this.secilistok.ItemName = this.secilistokModal.ItemName; 
    this.receteList=[];
 
  }

  onRowDblClickSeriModal(){  
    document.getElementById("finhspkapat")?.click();   
    if(this.seciliseriModal==null)return;
    this.seciliseri.DistNumber = this.seciliseriModal.DistNumber; 
    this.receteList=[];
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
 
}
 