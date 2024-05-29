import { DatePipe } from '@angular/common';
import { ReadVarExpr } from '@angular/compiler';
import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DxDataGridComponent } from 'devextreme-angular';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { CariOdemeYontem, GenelApi, EkranMesaj } from 'src/app/services/GenelSrc';
import { KullaniciYetki, KullaniciSrcService } from 'src/app/services/KullaniciSrc';
import { NotifyService } from 'src/app/services/notify';
import { Items, ConnTeklifKalem, ConnTeklifFirma, TeklifKarsilastirma, TeklifLog, ConnTeklifMas, TalepsrcService } from 'src/app/services/SatinAlmaSrc';
import { CofirmsrcService } from 'src/app/utils/confirm-dialog/cofirmsrc.service';
import { BelgeGosterService } from '../../Genel/BelgeGosterService';

@Component({
  selector: 'app-satin-alma-teklif-detay',
  templateUrl: './satin-alma-teklif-detay.component.html',
  styleUrls: ['./satin-alma-teklif-detay.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers:[
    {provide:DatePipe},
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } }
  ]
})
export class SatinAlmaTeklifDetayComponent implements OnInit {
  @ViewChild('gridTeklifDetayList', { static: false }) grid!: DxDataGridComponent;
  @BlockUI() blockUI!: NgBlockUI;
  @Input() data:any; 
  lookupDataSource = {};
  date:any; 
  allMode: string="";
  checkBoxesMode: string="";
  selectedItemKeys: any[] = [];
  kalemlist:Items[]=[];
  teklifkalem:ConnTeklifKalem[]=[];
  firmalist:ConnTeklifFirma[]=[];
  teklifkalemlist:TeklifKarsilastirma[]=[];
  teklifloglist:TeklifLog[]=[];
  teklif:ConnTeklifMas;
  baslik1:string="";
  baslik2:string="";
  baslik3:string="";
  baslik4:string="";
  baslik5:string="";
  baslik1goster:boolean=false;
  baslik2goster:boolean=false;
  baslik3goster:boolean=false;     
  baslik4goster:boolean=false;     
  baslik5goster:boolean=false;     
  yetki:KullaniciYetki;
  odemeyontemlist: CariOdemeYontem[]=[];  
  silgoster:boolean=false;
  evrekyuklegoster:boolean=false;
  secilikalem:ConnTeklifKalem;
  degisebilir:boolean=false;
  
  constructor(
    public datepipe: DatePipe,
    private genelsrv:GenelApi,
    private alertify:NotifyService,
    private talepsrc:TalepsrcService,
    private kullanicisrc:KullaniciSrcService,
    private modalService: NgbModal,
    private confirmationDialogService: CofirmsrcService, 
    private sanitizer: DomSanitizer,
    private belge:BelgeGosterService,
    ) {    
    this.teklif=new ConnTeklifMas(); 
    this.allMode = 'allPages';
    this.checkBoxesMode = 'always';
    this.yetki=new  KullaniciYetki(); 
    this.GetCariOdemeYontemList(); 
   }   

   async TeklifKalemGetir() {
    this.blockUI.start(EkranMesaj.Listele);
       (await this.talepsrc.GetTeklifKalemList(this.teklif.Id)).subscribe(
        async data=>{
          if(!data.Success){
            this.alertify.warning(data.Message);
            return;
          } 
          this.teklifkalem=data.List;   
          if(this.teklif.Firma1Kodu!=""){
            this.baslik1= (this.teklif.Firma1Adi?.substr(0,20)??"") + " / " +  (this.teklif?.Firma1ParaBirimi??"");
            this.baslik1goster=true;
          }
          if(this.teklif.Firma2Kodu!=""){
            this.baslik2= (this.teklif.Firma2Adi?.substr(0,20)??"") + " / " +  (this.teklif?.Firma2ParaBirimi??"");
            this.baslik2goster=true;
          }
          if(this.teklif.Firma3Kodu!=""){
            this.baslik3= (this.teklif.Firma3Adi?.substr(0,20)??"") + " / " +  (this.teklif?.Firma3ParaBirimi??"");
            this.baslik3goster=true;
          } 
          if(this.teklif.Firma4Kodu!=""){
            this.baslik4= (this.teklif.Firma4Adi?.substr(0,20)??"") + " / " +  (this.teklif?.Firma4ParaBirimi??"");
            this.baslik4goster=true;
          } 
          if(this.teklif.Firma5Kodu!=""){
            this.baslik5= (this.teklif.Firma5Adi?.substr(0,20)??"") + " / " +  (this.teklif?.Firma5ParaBirimi??"");
            this.baslik5goster=true;
          } 

          this.teklifkalem.forEach((x)=> {
            if(x.Firma1Secildi || x.Firma2Secildi || x.Firma3Secildi || x.Firma4Secildi || x.Firma5Secildi)x.FirmaTercihYapildi=true;
            else x.FirmaTercihYapildi=false;
          });

          this.blockUI.stop();
          //console.log("tts1")
          await this.firmaTutarGnc();  
        }
      )
   }

   async GetCariOdemeYontemList()  {
    this.blockUI.start(EkranMesaj.Listele);
      (await this.genelsrv.GetCariOdemeYontemList()).subscribe(
        data=>{
          this.blockUI.stop(); 
          if(!data.Success){ 
            this.alertify.warning(data.Message);
            return;
          }
          this.odemeyontemlist=data.List; 
        }
      )     
  }

   async TeklifFirmaGetir() {
    this.blockUI.start(EkranMesaj.Listele);
       (await this.talepsrc.GetTeklifFirmaList(this.teklif.Id)).subscribe(
        data=>{
          this.blockUI.stop();
          if(!data.Success){
            this.alertify.warning(data.Message);
            return;
          } 
          this.firmalist=data.List; 

          this.firmalist.forEach((x)=> {
            if(x.VadeGun<=0)x.VadeGun=x.CalismaSekliId;
          })
        }
      )
   }

   async GetTeklifLogList() {
    this.blockUI.start(EkranMesaj.Listele);
       (await this.talepsrc.GetTeklifLogList(this.teklif.Id)).subscribe(
        data=>{
          this.blockUI.stop();
          if(!data.Success){
            this.alertify.warning(data.Message);
            return;
          } 
          this.teklifloglist=data.List; 
        }
      )
   }

   async TeklifKarsilastirmaGetir() {
    this.blockUI.start(EkranMesaj.Listele);
       (await this.talepsrc.GetTeklifKarsilastirmaList(this.teklif.Id)).subscribe(
        data=>{
          this.blockUI.stop(); 
          if(!data.Success){
            this.alertify.warning(data.Message);
            return;
          } 
          this.teklifkalemlist=data.List;          
        }
      )
   }   

  ngOnInit() {   
    this.yetki = this.data?.yetki;   
     this.date=new Date();
     this.date=this.datepipe.transform(this.date, 'yyyy-MM-dd');
     var teklif =this.data._teklif;
     
    if(teklif!=null && teklif.Id>0){
      this.teklif=teklif;
      this.TekDetDataLoad();
    } 
  }

  async TekDetDataLoad() { 
   await this.TeklifListele(); 
   await this.TeklifFirmaGetir(); 
   await this.TeklifKalemGetir(); 
   await this.GetTeklifLogList();
  }

  async TeklifListele()  {
    this.blockUI.start(EkranMesaj.Listele);
      (await this.talepsrc.GetTeklifList(this.teklif.Id,undefined,undefined)).subscribe(
        data=>{
          this.blockUI.stop(); 
          if(!data.Success){
            this.alertify.warning(data.Message);
            return;
          }
          this.teklif=data.List[0];

          this.degisebilir = this.teklif.DurumId==2 ? false:true;

          this.grid.instance.beginUpdate();
          this.grid.editing.allowUpdating=this.degisebilir;
          this.grid.instance.endUpdate();
    
        }
      )     
  }

  async kaydet(){
    var data = this.grid.instance.getDataSource();
    this.blockUI.start("Kayıt Başladı...");
      var sonuc = await this.talepsrc.TeklifGuncelle(this.teklif,this.firmalist,this.teklifkalem,false);
      if(sonuc.Success==true){
        this.alertify.success("Teklif Kayıt Tamamlandı!");        
        } else{
      this.alertify.warning(sonuc.Message);
      }
      this.blockUI.stop(); 
  } 
 
  async onEditorPreparing(e:any) {  
    if( e?.row?.data==undefined || e?.row?.data==null){
    return;
    }
  
    if (e.dataField  === 'Firma1IlkFiyat') {
      var data = e.row.data; 
      if(data!=null && data!=undefined && data.Firma1IlkFiyat>0)  e.row.data.Firma1Toplam = data.TeklifMiktar * data.Firma1IlkFiyat;      
      else e.row.data.Firma1Toplam=0; 
      await this.firmaTutarGnc();
    }
    else if (e.dataField  === 'Firma2IlkFiyat') {
      var data = e.row.data; 
      if(data!=null && data!=undefined && data.Firma2IlkFiyat>0) e.row.data.Firma2Toplam = data.TeklifMiktar * data.Firma2IlkFiyat;
      else e.row.data.Firma2Toplam=0;
      await this.firmaTutarGnc();           
    }
    else if (e.dataField  === 'Firma3IlkFiyat') {
      var data = e.row.data; 
      if(data!=null && data!=undefined && data.Firma3IlkFiyat>0)  e.row.data.Firma3Toplam = data.TeklifMiktar * data.Firma3IlkFiyat;
      else e.row.data.Firma3Toplam=0;
      await this.firmaTutarGnc();             
    }   
    else if (e.dataField  === 'Firma4IlkFiyat') {
      var data = e.row.data; 
      if(data!=null && data!=undefined && data.Firma4IlkFiyat>0)  e.row.data.Firma4Toplam = data.TeklifMiktar * data.Firma4IlkFiyat;
      else e.row.data.Firma4Toplam=0;
      await this.firmaTutarGnc();             
    }  
    else if (e.dataField  === 'Firma5IlkFiyat') {
      var data = e.row.data; 
      if(data!=null && data!=undefined && data.Firma5IlkFiyat>0)  e.row.data.Firma5Toplam = data.TeklifMiktar * data.Firma5IlkFiyat;
      else e.row.data.Firma5Toplam=0;
      await this.firmaTutarGnc();             
    }  
    
    else if (e.dataField  === 'Firma1RevFiyat') {
      var data = e.row.data; 
      if(data!=null && data!=undefined && data.Firma1RevFiyat>0)  e.row.data.Firma1RevToplam = data.TeklifMiktar * data.Firma1RevFiyat;      
      else e.row.data.Firma1RevToplam=0; 
      await this.firmaTutarGnc();
    }
    else if (e.dataField  === 'Firma2RevFiyat') {
      var data = e.row.data; 
      if(data!=null && data!=undefined && data.Firma2RevFiyat>0) e.row.data.Firma2RevToplam = data.TeklifMiktar * data.Firma2RevFiyat;
      else e.row.data.Firma2RevToplam=0;
      await this.firmaTutarGnc();           
    }
    else if (e.dataField  === 'Firma3RevFiyat') {
      var data = e.row.data; 
      if(data!=null && data!=undefined && data.Firma3RevFiyat>0)  e.row.data.Firma3RevToplam = data.TeklifMiktar * data.Firma3RevFiyat;
      else e.row.data.Firma3RevToplam=0;
      await this.firmaTutarGnc();             
    }   
    else if (e.dataField  === 'Firma4RevFiyat') {
      var data = e.row.data; 
      if(data!=null && data!=undefined && data.Firma4RevFiyat>0)  e.row.data.Firma4RevToplam = data.TeklifMiktar * data.Firma4RevFiyat;
      else e.row.data.Firma4RevToplam=0;
      await this.firmaTutarGnc();             
    }  
    else if (e.dataField  === 'Firma5RevFiyat') {
      var data = e.row.data; 
      if(data!=null && data!=undefined && data.Firma5RevFiyat>0)  e.row.data.Firma5RevToplam = data.TeklifMiktar * data.Firma5RevFiyat;
      else e.row.data.Firma5RevToplam=0;
      await this.firmaTutarGnc();             
    }  
  
    else if (e.dataField  === 'Firma1SonFiyat') {
      var data = e.row.data; 
      if(data!=null && data!=undefined && data.Firma1SonFiyat>0)  {
        e.row.data.Firma1SonFiyatToplam = data.TeklifMiktar * data.Firma1SonFiyat;
        e.row.data.Firma1SonFiyatToplamTRY = data.TeklifMiktar * (data.Firma1SonFiyat * data.Firma1Kur);
      }    
      else {
        e.row.data.Firma1SonFiyatToplam=0; 
        e.row.data.Firma1SonFiyatToplamTRY=0; 
      }
      await this.firmaTutarGnc();
    }
    else if (e.dataField  === 'Firma2SonFiyat') {
      var data = e.row.data; 
      if(data!=null && data!=undefined && data.Firma2SonFiyat>0) {
        e.row.data.Firma2SonFiyatToplam = data.TeklifMiktar * data.Firma2SonFiyat;
        e.row.data.Firma2SonFiyatToplamTRY = data.TeklifMiktar * (data.Firma2SonFiyat * data.Firma2Kur);
      }
      else {
        e.row.data.Firma2SonFiyatToplam=0;
        e.row.data.Firma2SonFiyatToplamTRY=0;
      }
      await this.firmaTutarGnc();           
    }
    else if (e.dataField  === 'Firma3SonFiyat') {
      var data = e.row.data; 
      if(data!=null && data!=undefined && data.Firma3SonFiyat>0)  {
        e.row.data.Firma3SonFiyatToplam = data.TeklifMiktar * data.Firma3SonFiyat;
        e.row.data.Firma3SonFiyatToplamTRY = data.TeklifMiktar * (data.Firma3SonFiyat * data.Firma3Kur);
      }
      else {
        e.row.data.Firma3SonFiyatToplam=0;
        e.row.data.Firma3SonFiyatToplamTRY=0;
      }
      await this.firmaTutarGnc();             
    }   
    else if (e.dataField  === 'Firma4SonFiyat') {
      var data = e.row.data; 
      if(data!=null && data!=undefined && data.Firma4SonFiyat>0) {
        e.row.data.Firma4SonFiyatToplam = data.TeklifMiktar * data.Firma4SonFiyat;
        e.row.data.Firma4SonFiyatToplamTRY = data.TeklifMiktar * (data.Firma4SonFiyat * data.Firma4Kur);
      }
      else {
        e.row.data.Firma4SonFiyatToplam=0;
        e.row.data.Firma4SonFiyatToplamTRY=0;
      }
      await this.firmaTutarGnc();             
    }  
    else if (e.dataField  === 'Firma5SonFiyat') {
      var data = e.row.data; 
      if(data!=null && data!=undefined && data.Firma5SonFiyat>0)  {
        e.row.data.Firma5SonFiyatToplam = data.TeklifMiktar * data.Firma5SonFiyat;
        e.row.data.Firma5SonFiyatToplamTRY = data.TeklifMiktar * (data.Firma5SonFiyat * data.Firma5Kur);
      }
      else {
        e.row.data.Firma5SonFiyatToplam=0;
        e.row.data.Firma5SonFiyatToplamTRY=0;
      }
      await this.firmaTutarGnc();             
    }  
  } 
  
  async firmaTutarGnc() {
     this.firmalist.forEach(frm => {
       frm.Toplam=0;
       frm.RevToplam=0;
       frm.SiparisToplam=0;
       frm.SiparisToplamTRY=0;
       frm.RevOran=0;
       frm.SonFiyatToplam=0;
       frm.SonFiyatToplamTRY=0;
  
        this.teklifkalem.filter(item=> item.Firma1Kodu==frm.FirmaKodu)
        .forEach(element => {
          frm.Toplam += element.Firma1Toplam;
          frm.RevToplam += element.Firma1RevToplam;
          frm.SonFiyatToplam += element.Firma1SonFiyatToplam;
          frm.SonFiyatToplamTRY += element.Firma1SonFiyatToplamTRY;
        });
  
        this.teklifkalem.filter(item=> item.Firma2Kodu==frm.FirmaKodu)
        .forEach(element => {
          frm.Toplam += element.Firma2Toplam;
          frm.RevToplam += element.Firma2RevToplam;
          frm.SonFiyatToplam += element.Firma2SonFiyatToplam;
          frm.SonFiyatToplamTRY += element.Firma2SonFiyatToplamTRY;
        });
  
        this.teklifkalem.filter(item=> item.Firma3Kodu==frm.FirmaKodu)
        .forEach(element => {
          frm.Toplam += element.Firma3Toplam;
          frm.RevToplam += element.Firma3RevToplam;
          frm.SonFiyatToplam += element.Firma3SonFiyatToplam;
          frm.SonFiyatToplamTRY += element.Firma3SonFiyatToplamTRY;
        });
  
        this.teklifkalem.filter(item=> item.Firma4Kodu==frm.FirmaKodu)
        .forEach(element => {
          frm.Toplam += element.Firma4Toplam;
          frm.RevToplam += element.Firma4RevToplam;
          frm.SonFiyatToplam += element.Firma4SonFiyatToplam;
          frm.SonFiyatToplamTRY += element.Firma4SonFiyatToplamTRY;
        });
  
        this.teklifkalem.filter(item=> item.Firma5Kodu==frm.FirmaKodu)
        .forEach(element => {
          frm.Toplam += element.Firma5Toplam;
          frm.RevToplam += element.Firma5RevToplam;
          frm.SonFiyatToplam += element.Firma5SonFiyatToplam;
          frm.SonFiyatToplamTRY += element.Firma5SonFiyatToplamTRY;
        });
        
        this.teklifkalem.filter(item=> item.Firma1Kodu==frm.FirmaKodu && item.Firma1Secildi==true)
        .forEach(element => {
          frm.SiparisToplam += element.Firma1SonFiyatToplam;
          frm.SiparisToplamTRY += element.Firma1SonFiyatToplamTRY;
        });
  
        this.teklifkalem.filter(item=> item.Firma2Kodu==frm.FirmaKodu && item.Firma2Secildi==true)
        .forEach(element => {
          frm.SiparisToplam += element.Firma2SonFiyatToplam;
          frm.SiparisToplamTRY += element.Firma2SonFiyatToplamTRY;
        });
  
        this.teklifkalem.filter(item=> item.Firma3Kodu==frm.FirmaKodu && item.Firma3Secildi==true)
        .forEach(element => {
          frm.SiparisToplam += element.Firma3SonFiyatToplam;
          frm.SiparisToplamTRY += element.Firma3SonFiyatToplamTRY;
        });
  
        this.teklifkalem.filter(item=> item.Firma4Kodu==frm.FirmaKodu && item.Firma4Secildi==true)
        .forEach(element => {
          frm.SiparisToplam += element.Firma4SonFiyatToplam;
          frm.SiparisToplamTRY += element.Firma4SonFiyatToplamTRY;
        });
  
        this.teklifkalem.filter(item=> item.Firma5Kodu==frm.FirmaKodu && item.Firma5Secildi==true)
        .forEach(element => {
          frm.SiparisToplam += element.Firma5SonFiyatToplam;
          frm.SiparisToplamTRY += element.Firma5SonFiyatToplamTRY;
        });
  
        if(frm.SonFiyatToplam>0 && frm.Toplam>0) frm.RevOran = frm.Toplam- frm.SonFiyatToplam;
      });
  } 

  async siparis(){
    this.confirmationDialogService.confirm('Sipariş Oluşturma','Sipariş Oluşturulacak, Devam Edilsin mi?')
    .then(async (confirmed:any) => 
    {
      if(confirmed.sonuc==true)  {
        this.blockUI.start(EkranMesaj.Kaydet);
        var sonuc = await this.talepsrc.OnayliTeklifSiparisOlustur(this.teklif,this.firmalist,this.teklifkalem);
          if(sonuc.Success==true){
            this.alertify.success(EkranMesaj.KayitTamamlandi);  
            this.teklif.Durum="S";
            this.TekDetDataLoad();  
          } else{
          this.alertify.warning(sonuc.Message);
          }
          this.blockUI.stop();  
      }
    })
    .catch(() => {
  
    }); 
  }

  onCellPrepared (e:any) {
    if (e.rowType == "data") {
       if(e.column.dataField === "VadeGun") e.cellElement.classList.add("adaptiveRowStyle");
    }
  }

  Aciklama:string="";
  geriCekMod(content:any){   
    this.Aciklama=""; 
    this.modalService.open(content, {  size: 'lg',windowClass: 'modalcss40', backdrop: 'static' });  
  }  
  
  async geriCek(){   
    if(this.Aciklama==""){
      this.alertify.warning("Açıklama Alanı Zorunludur!");  
      return;
    } 

    this.confirmationDialogService.confirm('Teklif Geri Çek','Teklif Geri Çekilecek, Devam Edilsin mi?')
    .then(async (confirmed:any) => 
    {
      if(confirmed.sonuc==true)  {
        await this.kaydet();
        this.blockUI.start(EkranMesaj.Kaydet);
        var sonuc = await this.talepsrc.TeklifGeriCek(this.teklif,this.firmalist,this.teklifkalem,this.Aciklama);
          if(sonuc.Success==true){
            this.alertify.success(EkranMesaj.KayitTamamlandi);  
            this.modalService.dismissAll();
            this.TekDetDataLoad();  
          } else{
          this.alertify.warning(sonuc.Message);
          }
          this.blockUI.stop();  
      }
    })
    .catch(() => {
    }); 
  }

  silgosterChanged(e:any){
    let silinecekler  = this.grid.instance.getSelectedRowsData();
    this.selectedItemKeys = e.selectedRowKeys;
  
    if (silinecekler!=null && silinecekler.length==1){
      this.silgoster=true;
      this.evrekyuklegoster=true;
      this.secilikalem = silinecekler[0];
    }
    else if (silinecekler!=null && silinecekler.length>1){
      this.silgoster=true;
      this.evrekyuklegoster=false;
      this.secilikalem =new ConnTeklifKalem();
    }
    else {
      this.silgoster=false;
      this.evrekyuklegoster=false;
      this.secilikalem =new ConnTeklifKalem();
     }
  }
  
  belgeYukleModal(content:any,data:ConnTeklifKalem){
    this.secilikalem=data;
    this.modalService.open(content, {  size: 'lg',windowClass: 'belgeyuklemodal', backdrop: 'static' });
  }

  teklifBelgeler(content:any){    
    this.modalService.open(content, {  size: 'lg',windowClass: 'belgeyuklemodal', backdrop: 'static' });
  }

  async firmafullsec(firma:number){

    this.teklifkalem.forEach((x)=> {
      x.Firma1Secildi=false;
      x.Firma2Secildi=false;
      x.Firma3Secildi=false; 
      x.Firma4Secildi=false; 
      x.Firma5Secildi=false; 
    })
  
    this.teklifkalem.forEach((x)=> {
      if(firma==1)x.Firma1Secildi=true;
      if(firma==2)x.Firma2Secildi=true;
      if(firma==3)x.Firma3Secildi=true; 
      if(firma==4)x.Firma4Secildi=true; 
      if(firma==5)x.Firma5Secildi=true; 
    }) 
  
    await this.firmaTutarGnc(); 
  }
  
  async teklifonay(row:any,firma:any){ 
    row.data.FirmaTercihYapildi=true;
    row.data.Firma1Secildi=false;
    row.data.Firma2Secildi=false;
    row.data.Firma3Secildi=false;
    row.data.Firma4Secildi=false;
    row.data.Firma5Secildi=false;
  
    if(firma==1) row.data.Firma1Secildi=true;
    else if(firma==2) row.data.Firma2Secildi=true;
    else if(firma==3) row.data.Firma3Secildi=true;  
    else if(firma==4) row.data.Firma4Secildi=true;  
    else if(firma==5) row.data.Firma5Secildi=true;  
  
    await this.firmaTutarGnc(); 
   }

   pdfdata!:any;
  async formGoster(firmasira:number){
    this.teklif.FirmaSira=firmasira;

    var firmakodu = firmasira== 1 ? this.teklif.Firma1Kodu :
                    firmasira== 2 ? this.teklif.Firma2Kodu :
                    firmasira== 3 ? this.teklif.Firma3Kodu :
                    firmasira== 4 ? this.teklif.Firma4Kodu :
                    firmasira== 5 ? this.teklif.Firma5Kodu : "";

    var sipid = firmasira== 1 ? this.teklifkalem.filter((x)=>x.Firma1Kodu==this.teklif.Firma1Kodu && x.SapSiparisNo>0)[0].SapSiparisNo:
                firmasira== 2 ? this.teklifkalem.filter((x)=>x.Firma2Kodu==this.teklif.Firma2Kodu && x.SapSiparisNo>0)[0].SapSiparisNo:
                firmasira== 3 ? this.teklifkalem.filter((x)=>x.Firma3Kodu==this.teklif.Firma3Kodu && x.SapSiparisNo>0)[0].SapSiparisNo:
                firmasira== 4 ? this.teklifkalem.filter((x)=>x.Firma4Kodu==this.teklif.Firma4Kodu && x.SapSiparisNo>0)[0].SapSiparisNo:
                firmasira== 5 ? this.teklifkalem.filter((x)=>x.Firma5Kodu==this.teklif.Firma5Kodu && x.SapSiparisNo>0)[0].SapSiparisNo: 0;

    this.blockUI.start(EkranMesaj.Kaydet);
    var sonuc = await this.talepsrc.TeklifFormYazdir(this.teklif,2,firmasira,sipid);
      if(sonuc.Success==true){
        this.pdfdata = this.sanitizer.bypassSecurityTrustResourceUrl('data:application/pdf;base64,' + sonuc.Message); 
        this.belge.confirm(this.pdfdata,true,sipid.toString()+ " nolu Sipariş Form",sipid.toString()+ " nolu Sipariş Form","","","",sonuc.Message,"application/pdf",firmakodu);
      } else{
      this.alertify.warning(sonuc.Message);
      }
      this.blockUI.stop();  
  }

  teklifMail(){
    this.confirmationDialogService.confirm('Mail','Firmalara Teklif Formlarını İçeren Mail Gönderilecek, Devam Edilsin mi?')
    .then(async (confirmed:any) => 
    {
      if(confirmed.sonuc==true)  {
        await this.kaydet();
        this.blockUI.start(EkranMesaj.Kaydet);
        var sonuc = await this.talepsrc.TeklifMailGonder(this.teklif,this.firmalist,this.teklifkalem);
          if(sonuc.Success==true){
            this.alertify.success(EkranMesaj.KayitTamamlandi);  
            this.modalService.dismissAll();
            this.TekDetDataLoad();  
          } else{
          this.alertify.warning(sonuc.Message);
          }
          this.blockUI.stop();  
      }
    })
    .catch(() => {
    });
  }

  async CellDegisti(e:any){ 
    this.blockUI.start("Kayıt Başladı...");
    var sonuc = await this.talepsrc.TeklifFirmaSatirGuncelle(this.teklif,e.data);
    if(!sonuc.Success){  
      this.alertify.warning(sonuc.Message);
    } 
    await this.TeklifFirmaGetir(); 
    this.blockUI.stop(); 
}

onayaGonderMod(content:any){   
  this.Aciklama=""; 
  this.modalService.open(content, {  size: 'lg',windowClass: 'modalcss40', backdrop: 'static' });  
}  


async onayaGonder(){   
  if(this.Aciklama==""){
    this.alertify.warning("Açıklama Alanı Zorunludur!");  
    return;
  } 

  var devam:boolean=true;
    this.teklifkalem.forEach((x)=> {
      if(devam && (x.Firma1SonFiyat+x.Firma2SonFiyat+x.Firma3SonFiyat+x.Firma4SonFiyat+x.Firma5SonFiyat)<=0){
        this.alertify.warning(x.StokAdi+  " Kalemi İçin Fiyat Çalışması Yapılmadı, Onay İşlemi Başlatılamaz!");
        devam=false;
      }
      if(devam && !x.FirmaTercihYapildi){
        this.alertify.warning(x.StokAdi+  " Kalemi İçin Firma Tercihi Yapılmadan Onay Süreci Başlatılamaz!");
        devam=false;
      }
    });
    
    if(devam){
      this.confirmationDialogService.confirm('Teklif Çalışma Tamamla','Teklif Onaya Gönderilecek, Devam Edilsin mi?')
      .then(async (confirmed:any) => 
      {
        if(confirmed.sonuc==true)  {
          await this.kaydet();
          this.blockUI.start(EkranMesaj.Kaydet);
          var sonuc = await this.talepsrc.TeklifTamamla(this.teklif,this.firmalist,this.teklifkalem,this.Aciklama);
            if(sonuc.Success==true){
              this.alertify.success(EkranMesaj.KayitTamamlandi);  
              this.teklif.Durum="O";
              this.modalService.dismissAll();
             this.TekDetDataLoad();  
            } else{
            this.alertify.warning(sonuc.Message);
            }
            this.blockUI.stop();  
        }
      })
      .catch(() => {
    
      }); 
    }
}


}

class GuidGenerator {
  static newGuid() {
    return 'xxxxxxxx-xxxx-xxxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0,
      v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}
