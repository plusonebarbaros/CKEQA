import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DxDataGridComponent } from 'devextreme-angular';
import moment from 'moment';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import { GenelApi, EkranMesaj } from 'src/app/services/GenelSrc';
import { KullaniciYetki } from 'src/app/services/KullaniciSrc';
import { MesajversrcService } from 'src/app/services/mesajversrc.service';
import { NotifyService } from 'src/app/services/notify';
import { SiparisService, SaticiSipKontrolModel, Customer, IhracatTasimaTip, PlasiyerModel, DepoModel } from 'src/app/services/SiparisSrc';
import { CofirmsrcService } from 'src/app/utils/confirm-dialog/cofirmsrc.service';

@Component({
  selector: 'app-irsaliye-aktarma',
  templateUrl: './irsaliye-aktarma.component.html',
  styleUrls: ['./irsaliye-aktarma.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers:[
    {provide:DatePipe},
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } } 
  ]
})
export class IrsaliyeAktarmaComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  @ViewChild('gridDataList', { static: false }) grid!: DxDataGridComponent;
  @Input() data:any;     
  yetki:KullaniciYetki;
  datalist: SaticiSipKontrolModel[]=[];    
  secilidata:SaticiSipKontrolModel; 
  isReadOnly: boolean=false;  
  fileList!:FileList;
  firmalist:Customer[]=[];
  secilifirma:Customer;
  kalemkeyword:string=""; 
  plalist: PlasiyerModel[]=[];    
  depolist: DepoModel[]=[];    
  ihrtasimatip: IhracatTasimaTip[]=[];    

  SipTipId:number=0;
  SipTurId:number=0;
  SiparisNo:string="";
  PlasiyerKod:string="";
  DepoKodu:number=60;
  SiparisTarih:any;
  IthalatTip:number=0;
  FirmaAdi:string="";
  FirmaKodu:string="";

  public formPla: FormControl = new FormControl();
  public filterPla: ReplaySubject<PlasiyerModel[]> = new ReplaySubject<PlasiyerModel[]>(1); 

  public formDepo: FormControl = new FormControl();
  public filterDepo: ReplaySubject<DepoModel[]> = new ReplaySubject<DepoModel[]>(1); 

  public formIhr: FormControl = new FormControl();
  public filterIhr: ReplaySubject<IhracatTasimaTip[]> = new ReplaySubject<IhracatTasimaTip[]>(1); 

  protected _onDestroy = new Subject<void>();

  constructor( 
    private siparissrc:SiparisService,
    private modalService: NgbModal,
    private alertify:NotifyService ,
    private confirmationDialogService: CofirmsrcService,
    private genelsrv:GenelApi,
    private mesajver:MesajversrcService,
    ) 
    {  
      this.secilidata=new  SaticiSipKontrolModel();
      this.yetki=new  KullaniciYetki();
    } 

  ngOnInit() {    
    this.yetki = this.data?.yetki;
    this.GetPlasiyerList();
    this.GetDepoList();
    this.GetIhracatTeslimTipList();
    
    this.formPla.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {this.filterPlaList();});  
    this.formDepo.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {this.filterDepoList();});  
    this.formIhr.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {this.filterIhrList();});  
  }  

  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  protected filterIhrList() {
    if (!this.ihrtasimatip) {
      return;
    } 
    let search = this.formIhr.value+"";
    if (!search) {
      this.filterIhr.next(this.ihrtasimatip.slice());
      return;
    } else {
      search = search.toUpperCase();
    } 
    this.filterIhr.next(
      this.ihrtasimatip.filter(item => (item?.Code??"").toUpperCase().indexOf(search) > -1)
    );
  }

  protected filterDepoList() {
    if (!this.depolist) {
      return;
    } 
    let search = this.formDepo.value+"";
    if (!search) {
      this.filterDepo.next(this.depolist.slice());
      return;
    } else {
      search = search.toUpperCase();
    } 
    this.filterDepo.next(
      this.depolist.filter(item => (item?.WhsName??"").toUpperCase().indexOf(search) > -1)
    );
  }

  protected filterPlaList() {
    if (!this.plalist) {
      return;
    } 
    let search = this.formPla.value+"";
    if (!search) {
      this.filterPla.next(this.plalist.slice());
      return;
    } else {
      search = search.toUpperCase();
    } 
    this.filterPla.next(
      this.plalist.filter(item => (item?.PLASIYER_ADI??"").toUpperCase().indexOf(search) > -1)
    );
  }

  async GetDepoList() { 
    this.blockUI.start(EkranMesaj.Listele);
    (await this.siparissrc.GetDepoList()).subscribe(
      data =>{
        this.blockUI.stop(); 
        if(!data.Success){
          this.alertify.warning(data.Message);
          return;
        }
        this.depolist=data.List;   
        this.filterDepo.next(this.depolist.slice());
     }
   )
  }

  async GetIhracatTeslimTipList()  {
    this.blockUI.start(EkranMesaj.Listele);
    var sonuc = await this.siparissrc.GetIhracatTeslimTipList(); 
    this.blockUI.stop();  
    if(sonuc.Success){
      this.ihrtasimatip=sonuc.List;
      this.filterIhr.next(this.ihrtasimatip.slice());
    }else{
      this.alertify.warning(sonuc.Message);
      return;
    }    
  } 

  async GetPlasiyerList()  {
    this.blockUI.start(EkranMesaj.Listele);
    var sonuc = await this.siparissrc.GetPlasiyerList(); 
    this.blockUI.stop();  
    if(sonuc.Success){
      this.plalist=sonuc.List;
      this.filterPla.next(this.plalist.slice());
    }else{
      this.alertify.warning(sonuc.Message);
      return;
    }    
  } 

  uploadFile(files:any) { 
    this.fileList = files.target.files;   
  }   

  topluyukle(content:any){   
    this.modalService.open(content, {  size: 'lg',windowClass: 'modalcss35', backdrop: 'static' }); 
  }

  async kontrolBaslat(){   
    if(this.fileList==null || this.fileList.length<=0){
      this.alertify.warning("Dosya Seçilmedi!");
      return;
    }

    let  file: File = this.fileList[0];
    let formData: FormData = new FormData();
    formData.append('files', file ); 
    formData.append('userid', "0"); 

    this.confirmationDialogService.confirm('Fatura Kontrol', 'Sipariş Fatura Kontrol İşlemi Yapılacak, Devam Edilsin mi?')
    .then(async (confirmed:any) => 
    {
      if(confirmed.sonuc==true){
        this.blockUI.start("Kayıt Başladı...");
        var sonuc = await this.siparissrc.SaticiSipKontrol(formData);
        if(sonuc.Success==true){
          this.alertify.success("İşlem Tamamlandı!");
          this.modalService.dismissAll();    
          this.datalist = sonuc.List; 
          } else{
        this.alertify.warning(sonuc.Message);
        }
          this.blockUI.stop(); 
      }
    })
    .catch(() => { 
    }); 
  } 

  firmaSec(content:any){
    this.firmalist=[];
    this.secilifirma=new Customer();    
    this.modalService.open(content, {  size: 'lg',windowClass: 'modalcss60', backdrop: 'static' }); 
  }

  async firmkalemAra(ev:any){ 
    if(this.kalemkeyword==""){
      this.alertify.warning("Aramak İstediğiniz Firmayı Kısaca Yazın...");
      return;
    }

    if (ev.keyCode === 13 && this.kalemkeyword!="") {
      this.blockUI.start(EkranMesaj.Listele);
      var sonuc = await this.siparissrc.CariList(this.kalemkeyword??"", 50, "","");
      this.blockUI.stop(); 
      if(sonuc.Success){
        this.firmalist=sonuc.List;  
      }
      else{
        this.alertify.warning(sonuc.Message);
      }
    }
  } 

  async firmaSecimYap(){ 
    if(this.secilifirma==null || this.secilifirma.CARI_KOD==""){
      this.alertify.warning("Firma Listesinden Seçim Yapınız!");
      return;
    }    
    this.FirmaKodu=this.secilifirma.CARI_KOD;   
    this.FirmaAdi=this.secilifirma.CARI_ISIM;  
    document.getElementById("btnfirmakapat")?.click();
  }

  onFirmaChg(e:any){
    if(e.selectedRowsData==null || e.selectedRowsData.length<=0){
      return;
    }
    this.secilifirma = (e.selectedRowsData as Customer[])[0];
  }

  firmaTemizle(){
    this.FirmaKodu="";   
    this.FirmaAdi=""; 
  }

  firmaramaTemizle(){
    this.kalemkeyword="";
    this.firmalist=[];
  }

  async irsaliyeOlustur(){    
    if(this.datalist==null || this.datalist.length<=0){
      this.alertify.warning("Sipariş Şablonunu Yükledikten Sonra İşlem Yapabilirsiniz!") 
      return;
    } 

    if(this.FirmaKodu==null || this.FirmaKodu=="" || this.FirmaKodu==undefined){
      this.alertify.warning("Firma Seçiniz!") 
      return;
    } 
    if(this.SiparisTarih==null || this.SiparisTarih==undefined){
      this.alertify.warning("Sipariş Tarih Seçiniz!") 
      return;
    } 
    if(this.SiparisNo==null || this.SiparisNo=="" || this.SiparisNo==undefined){
      this.alertify.warning("Sipariş No Boş Olamaz!") 
      return;
    } 
    if(this.SiparisNo.length != 15){
      this.alertify.warning("Sipariş No Alanı 15 Karakter Olmalıdır!") 
      return;
    } 
    if(this.PlasiyerKod==null || this.PlasiyerKod=="" || this.PlasiyerKod==undefined){
      this.alertify.warning("Plasiyer Seçiniz!") 
      return;
    } 
    if(this.DepoKodu<=0){
      this.alertify.warning("Depo Seçiniz!") 
      return;
    } 

    this.confirmationDialogService.confirm('Sipariş', 'Listedeki Kalemler İçin Sipariş Oluşturulacak, Devam Edilsin mi?')
    .then(async (confirmed:any) => 
    {
      if(confirmed.sonuc==true)  {
        this.blockUI.start(EkranMesaj.Kaydet);
        var sonuc = await this.siparissrc.IrsaliyeOlustur(this.datalist,this.FirmaKodu,this.SiparisTarih,this.SiparisNo,this.PlasiyerKod,this.DepoKodu,this.IthalatTip,this.SipTurId);
        if(sonuc.Success==true){
            this.blockUI.stop();  
            this.alertify.success(EkranMesaj.KayitTamamlandi) 
            this.modalService.dismissAll();
            this.mesajver.confirm('Bilgilendirme',sonuc.Message);
        } else{
            this.blockUI.stop(); 
            this.mesajver.confirm('Bilgilendirme',sonuc.Message);
        } 
      }
    })
    .catch(() => {
    });
  } 

  SiparisTarihChg(e:any){
    this.SiparisTarih =moment(e._d).format("yyyy-MM-DD");
  } 

  irsaliyeMod(content:any){ 
    if(this.datalist==null || this.datalist.length<=0){
      this.alertify.warning("Şablon Yükledikten Sonra İrsaliye Aktarım Süreci Başlatılabilir!");
      return;
    }  
    if(this.datalist.filter((x)=>x.StokKartNetsisteVar==false).length>0){
      this.alertify.warning("Stok Kartı Tanımlı Olmayan Kalemler Mevcut, İşleme Devam Edilemiyor!");
      return;
    }
    this.SiparisTarih =moment(new Date()).format("yyyy-MM-DD");
    this.SipTipId=0;
    this.SipTurId=0;
    this.SiparisNo="";
    this.PlasiyerKod="";
    this.FirmaKodu="";
    this.FirmaAdi="";
    this.DepoKodu=60;
    this.modalService.open(content, {  size: 'lg',windowClass: 'modalcss40', backdrop: 'static' }); 
  }

  defPla(event: any) {
    this.PlasiyerKod = "";
    event.stopPropagation();
  }
  
  defIhr(event: any) {
    this.IthalatTip = 0;
    event.stopPropagation();
  }
}
