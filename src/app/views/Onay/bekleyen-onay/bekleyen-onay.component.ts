import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DxDataGridComponent } from 'devextreme-angular';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { GenelApi, EkranMesaj } from 'src/app/services/GenelSrc';
import { KullaniciYetki, KullaniciModel, KullaniciSrcService } from 'src/app/services/KullaniciSrc';
import { NotifyService } from 'src/app/services/notify';
import { DtsOnaySurecMasterModel, DtsOnayTanimDetayModel, OnaySurevSrcService } from 'src/app/services/OnaySrc';
import { Items, TalepsrcService } from 'src/app/services/SatinAlmaSrc';
import { TabService } from 'src/app/services/tab.service';
import { Tab } from 'src/app/services/tabs-mod';
import { CofirmsrcService } from 'src/app/utils/confirm-dialog/cofirmsrc.service';
import { TalepDetayComponent } from '../../SatinAlma/talep-detay/talep-detay.component';
import { OzelSiparisDetayComponent } from '../../Siparis/ozel-siparis-detay/ozel-siparis-detay.component';

@Component({
  selector: 'app-bekleyen-onay',
  templateUrl: './bekleyen-onay.component.html',
  styleUrls: ['./bekleyen-onay.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers:[
    {provide:DatePipe},
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } }
  ]
})
export class BekleyenOnayComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  @Input() data:any;
  @ViewChild('taleponaygrid', { static: false }) taleponaygrid!: DxDataGridComponent;
  @ViewChild('teklifonaygrid', { static: false }) teklifonaygrid!: DxDataGridComponent;
  @ViewChild('ozelsiparisgrid', { static: false }) ozelsiparisgrid!: DxDataGridComponent;
  @ViewChild('firecikisgrid', { static: false }) firecikisgrid!: DxDataGridComponent;
  
  yetki:KullaniciYetki;
  miktaryetki:KullaniciYetki;
  kalemdegistir:KullaniciYetki;
  onaygoster:boolean=false;
  retgoster:boolean=false;
  taleponaydetay:DtsOnaySurecMasterModel[]=[]; 
  teklifonaylist:DtsOnaySurecMasterModel[]=[]; 
  ozelsiparislist:DtsOnaySurecMasterModel[]=[]; 
  firecikislist:DtsOnaySurecMasterModel[]=[]; 

  checkBoxesMode: string="";
  allMode: string="";
  onaybolum: string="";
  retaciklama:string="";
  onayaciklama:string="";
  kalemlist:Items[]=[]; 
  secilikalem:Items; 
  kalemkeyword:string=""; 
  kalemdegistirgoster:boolean=false; 
  interval: any;
  secilenuser:DtsOnayTanimDetayModel;
  loguser:KullaniciModel;  
  yonlendirgerigelsin:boolean=false;
  
constructor(
    private genelsrv:GenelApi,
    private alertify:NotifyService ,
    private talepsrc:TalepsrcService,
    private confirmationDialogService: CofirmsrcService,
    private onaysrc: OnaySurevSrcService,
    private tabService: TabService,
    private kullanicisrc:KullaniciSrcService,
    private modalService: NgbModal
  ) {  
    this.allMode = 'allPages';
    this.checkBoxesMode = 'always';
    this.yetki = this.kullanicisrc.userperm?.filter(p=>p.YetkiKodu=="YT0020")[0]; 
    this.miktaryetki = this.kullanicisrc.userperm?.filter(p=>p.YetkiKodu=="YT0022")[0]; 
    this.kalemdegistir = this.kullanicisrc.userperm?.filter(p=>p.YetkiKodu=="YT0023")[0]; 
    this.secilikalem = new Items(); 
    this.secilenuser=new DtsOnayTanimDetayModel();
  }

  ngOnInit(): void {   
    this.loguser = JSON.parse(sessionStorage.getItem('data')??"") as KullaniciModel;

    this.BekleyenOnaylar();   
    this.ekranYenile(); 
  }

  ngOnDestroy(): void { 
    clearInterval(this.interval);
  } 

  async BekleyenOnaylar(){  
    await this.GetOnayBekleyenList();
  }
 
taleponaygoster(e:any,bolum:string){ 
  this.onaybolum=bolum;

  let onaysecimlist  = this.taleponaygrid.instance.getSelectedRowsData();
  if (onaysecimlist!=null && onaysecimlist.length>0){

    if(onaysecimlist.length>20){
      this.alertify.warning("20 Kalemden Fazla Onay Verilemez!");
    }

    this.onaygoster=true;
    this.retgoster=true;
    if(onaysecimlist.length==1)this.kalemdegistirgoster=true;
    else this.kalemdegistirgoster=false;
  }
  else {
    this.onaygoster=false;
    this.retgoster=false;  
    this.kalemdegistirgoster=false;
  }   
}

async talepOnaylaMod(content:any){
  this.onayaciklama=""; 
  this.modalService.open(content, {  size: 'lg',windowClass: 'modalcss50', backdrop: 'static' });  
}

async talepOnayla(){
  if(this.onayaciklama==""|| this.onayaciklama==undefined){
    this.alertify.warning("Onay İşleminde Açıklama Alanı Zorunludur!");
    return;
  }
  else{
    var onaylist:DtsOnaySurecMasterModel[]=[];
    var talep = this.taleponaygrid.instance.getSelectedRowsData() as DtsOnaySurecMasterModel[];  
    var fire = this.firecikisgrid.instance.getSelectedRowsData() as DtsOnaySurecMasterModel[];  

    if(talep.length>0)onaylist = talep;
    if(fire.length>0)onaylist = fire;

    if(onaylist.length>0){
      this.confirmationDialogService.confirm('Onayla', 'Seçili Kalemler Onaylanacak, Devam Edilsin mi?')
      .then(async (confirmed:any) => 
      {
        if(confirmed.sonuc==true)  {
          this.blockUI.start(EkranMesaj.Kaydet);
          var sonuc = await this.onaysrc.OnaylaV2(onaylist,true,this.onayaciklama);
        if(sonuc.Success==true){
          this.alertify.success("Seçili Kalemler Onaylandı!");
          this.modalService.dismissAll();
        } else{
        this.alertify.warning(sonuc.Message);
        }
        this.blockUI.stop(); 
        this.BekleyenOnaylar();
        }
      })
      .catch((err) => {
        this.alertify.warning("Hata Oluştu! "+err);
      }); 
    }
    else{
      this.alertify.warning("Onay Listesinden Seçin Yapınız!");
      return;
    }
  }
}


retTalepMod(content:any){   
  this.retaciklama=""; 
  this.modalService.open(content, {  size: 'lg',windowClass: 'modalcss50', backdrop: 'static' });  
}

retBaslat(){
  if(this.retaciklama==""|| this.retaciklama==undefined){
    this.alertify.warning("Ret İşleminde Açıklama Alanı Zorunludur!");
    return;
  }
  else{
    var onaylist:DtsOnaySurecMasterModel[]=[];
    var talep = this.taleponaygrid.instance.getSelectedRowsData() as DtsOnaySurecMasterModel[];  
    var fire = this.firecikisgrid.instance.getSelectedRowsData() as DtsOnaySurecMasterModel[];  

    if(talep.length>0)onaylist = talep;
    if(fire.length>0)onaylist = fire;
  
    this.confirmationDialogService.confirm('Ret', 'Seçili Kalemler Reddedilecek, Devam Edilsin mi?')
    .then(async (confirmed:any) => 
    {
      if(confirmed.sonuc==true)  {
        this.blockUI.start(EkranMesaj.Kaydet);
        var sonuc = await this.onaysrc.OnaylaV2(onaylist,false,this.retaciklama);
       if(sonuc.Success==true){
        this.alertify.success("Seçili Talepler Reddedildi!");
        this.BekleyenOnaylar();
        this.modalService.dismissAll();
       } else{
      this.alertify.warning(sonuc.Message);
       }
        this.blockUI.stop(); 
      }
    })
    .catch((err) => {
      this.alertify.warning("Hata Oluştu! "+err);
    });
  } 
}
 
kalemEklemod(content:any){ 
  this.kalemlist=[];
  this.kalemkeyword=""; 
  this.secilikalem=new Items();
  this.modalService.open(content, {  size: 'lg',windowClass: 'rettalepmodal', backdrop: 'static' });   
} 

async kalemAra(ev:any){ 
  if(this.kalemkeyword==""){
    this.alertify.warning("Aramak İstediğiniz Ürünü Kısaca Yazın...");
    return;
  }

  if (ev.keyCode === 13 && this.kalemkeyword!="") {
    this.blockUI.start(EkranMesaj.Listele);
    var sonuc = await this.genelsrv.GetStokList("", 50, this.kalemkeyword?.toLocaleUpperCase('tr')??"","T",0);
    this.blockUI.stop(); 
    if(sonuc.Success){
      this.kalemlist=sonuc.List;  
    }
    else{
      this.alertify.warning(sonuc.Message);
    }   
  }
}

aramaTemizle(){
  this.kalemkeyword="";
  this.kalemlist=[];
}

malzDegistir(){
  var talepd = new DtsOnaySurecMasterModel();
   if(this.onaybolum && this.taleponaygrid.instance.getSelectedRowsData().length>0) talepd = this.taleponaygrid.instance.getSelectedRowsData()[0] as DtsOnaySurecMasterModel; 

  if(this.secilikalem==null || this.secilikalem.ItemCode==""){
    this.alertify.warning("Malzeme Seçilmedi!");
    return;
  }

  if(talepd==null || talepd.Id<=0){
    this.alertify.warning("Talep Seçilmedi!");
    return;
  } 

  this.confirmationDialogService.confirm('Malzeme Değiştir', 'Onay Bekleyen Kalem Stok Kodu Değiştirilecek, Devam Edilsin mi?')
  .then(async (confirmed:any) => 
  {
    if(confirmed.sonuc==true)  {
      this.blockUI.start(EkranMesaj.Kaydet);
      var sonuc = await this.onaysrc.OnayMalzemeDegistir(talepd,"",this.secilikalem.ItemCode);
     if(sonuc.Success==true){
      this.alertify.success("İşlem Tamamlandı!");
      this.modalService.dismissAll();
     } else{
    this.alertify.warning(sonuc.Message);
     }
     this.blockUI.stop(); 
     this.BekleyenOnaylar();
    }
  })
  .catch((err) => {
    this.alertify.warning("Hata Oluştu! "+err);
  });
}

satirSec(e:any){   
  if (e!=null){  
    this.secilikalem = e.data; 
  }
  else { 
    this.secilikalem =new Items();
  }
}

async ekranYenile(){ 
  this.interval =  setInterval(async ()=>{ 
    await this.BekleyenOnaylar();
   },60000 * 8);
 }

 talepDetay(talep:any){ 
   var yetki = new KullaniciYetki;
   yetki.Export = true;
   yetki.Ekle=false;
   yetki.Guncelle=false;
   yetki.Sil=false;
  this.tabService.addTab(new Tab(TalepDetayComponent, "Talep Detay - "+ talep.BelgeId , { parent: "AppComponent", _talepid:talep.BelgeId,yetki:yetki,Kontrol:true },0));
}

onayAciklamaModal(content:any){   
  this.onayaciklama=""; 
  this.modalService.open(content, {  size: 'lg',windowClass: 'modalcss65', backdrop: 'static' });  
}

onayAciklama(){
  var onaylist:DtsOnaySurecMasterModel[]=[];
  var talep = this.taleponaygrid.instance.getSelectedRowsData() as DtsOnaySurecMasterModel[];  
  var fire = this.firecikisgrid.instance.getSelectedRowsData() as DtsOnaySurecMasterModel[];  

  if(talep.length>0)onaylist = talep;
  if(fire.length>0)onaylist = fire;

  this.confirmationDialogService.confirm('Onay Açıklama', 'Seçili Kalemler İçin Açıklama Girilecek, Devam Edilsin mi?')
  .then(async (confirmed:any) => 
  {
    if(confirmed.sonuc==true)  {
      this.blockUI.start(EkranMesaj.Kaydet);
      var sonuc = await this.onaysrc.OnayAciklama(onaylist,this.onayaciklama);
     if(sonuc.Success==true){
      this.alertify.success("İşlem Tamamlandı!");
     } else{
      this.alertify.warning(sonuc.Message);
     }
     this.modalService.dismissAll();
     this.blockUI.stop(); 
     this.BekleyenOnaylar();
    }
  })
  .catch((err) => {
    this.alertify.warning("Hata Oluştu! "+err);
  }); 
}

async GetOnayBekleyenList() {
  this.blockUI.start("Bekleyen Onaylar Getirilyor..."); 
  (await this.onaysrc.GetOnayBekleyenList()).subscribe(
   data=>{
    this.blockUI.stop();
    if(!data.Success){
      this.alertify.warning(data.Message);
      return;  
    }
    var onaylist = data.List as DtsOnaySurecMasterModel[];

    this.taleponaydetay = onaylist.filter((x) => x.EkranId==1 || x.EkranId==2);
    this.teklifonaylist = onaylist.filter((x) => x.EkranId==3);
    this.ozelsiparislist = onaylist.filter((x) => x.EkranId==4);
    this.firecikislist = onaylist.filter((x) => x.EkranId==6);
    this.taleponaygrid.instance.clearSelection();
    this.teklifonaygrid.instance.clearSelection();      
    this.ozelsiparisgrid.instance.clearSelection();      
   }
 ) 
}

kullanicilist:KullaniciModel[]=[]; 
kularamaTemizle(){
 this.kalemkeyword="";
 this.kullanicilist=[]; 
}

async kulkalemAra(ev:any){ 
 if(this.kalemkeyword==""){
   this.alertify.warning("Aramak İstediğiniz Kullanıcıyı Kısaca Yazın...");
   return;
 }

 if (ev.keyCode === 13 && this.kalemkeyword!="") { 
   this.blockUI.start(EkranMesaj.Listele);
     (await this.kullanicisrc.GetKullaniciAramaList(this.kalemkeyword??"")).subscribe(
       data=>{
         this.blockUI.stop(); 
         if(!data.Success){
           this.alertify.warning(data.Message);
           return;
         }
         this.kullanicilist=data.List;  
       }
     ) 
 }
}
  
kullsecimyap(){   
  var onaylist:DtsOnaySurecMasterModel[]=[];
  if(this.secilitab==1){
    onaylist = this.ozelsiparisgrid.instance.getSelectedRowsData() as DtsOnaySurecMasterModel[];  
  }
  if(this.secilitab==2){
    onaylist = this.taleponaygrid.instance.getSelectedRowsData() as DtsOnaySurecMasterModel[];  
  }
  else if(this.secilitab==3){
    onaylist = this.teklifonaygrid.instance.getSelectedRowsData() as DtsOnaySurecMasterModel[];  
  }
  else if(this.secilitab==4){
    onaylist = this.firecikisgrid.instance.getSelectedRowsData() as DtsOnaySurecMasterModel[];  
  }

  if(onaylist.length<=0){
    this.alertify.warning("Yönlendirme Yapılacak Satırları Seçiniz!");
    return;
  }
  else if (this.onayaciklama=="" || this.onayaciklama==undefined){
    this.alertify.warning("Açıklama Alanı Zorunludur!");
    return;
  }
  else{
    this.confirmationDialogService.confirm('Yönlendir', 'Onay Süreci Seçili Kullanıcıya Yönlendirilecek, Devam Edilsin mi?')
    .then(async (confirmed:any) => 
    {
      if(confirmed.sonuc==true)  {
          this.blockUI.start(EkranMesaj.Kaydet);
          var sonuc = await this.onaysrc.OnayYonlendir(onaylist,this.secilenuser,this.yonlendirgerigelsin,this.onayaciklama);
          if(sonuc.Success==true){
            this.alertify.success("İşlem Tamamlandı!");
            this.modalService.dismissAll();
            this.BekleyenOnaylar();
          } else{
            this.alertify.warning(sonuc.Message);
          }
          this.blockUI.stop(); 
      }
    })
    .catch((err) => {
      this.alertify.warning("Hata Oluştu! "+err);
    }); 
  }    
}

onKullSelectionChg(e:any){
 let secim = e?.selectedRowsData[0] ?? null;
 if(secim!=null){
   this.secilenuser = secim;
 }
} 

secilitab:number=1;
tabsec(e:any){ 
  if(e.tab.textLabel=="Özel Sipari"){
    this.secilitab=1;
  }
  else if(e.tab.textLabel=="Talep Onayları"){
    this.secilitab=2;
  }
  else if(e.tab.textLabel=="Teklif Onayları"){
    this.secilitab=3;
  }
  else if(e.tab.textLabel=="Fire Çıkış Onayları"){
    this.secilitab=4;
  }
} 

yonlendirMod(content:any){
  this.onayaciklama="";
  this.yonlendirgerigelsin=true;
  let talep:DtsOnaySurecMasterModel[]=[];
  if(this.secilitab==1){
      talep = this.ozelsiparisgrid.instance.getSelectedRowsData() as DtsOnaySurecMasterModel[];  
  }
  else if(this.secilitab==2){
    talep = this.taleponaygrid.instance.getSelectedRowsData() as DtsOnaySurecMasterModel[];  
  }
  else if(this.secilitab==3){
    talep = this.teklifonaygrid.instance.getSelectedRowsData() as DtsOnaySurecMasterModel[];  
  }
  else if(this.secilitab==4){
    talep = this.firecikisgrid.instance.getSelectedRowsData() as DtsOnaySurecMasterModel[];  
  }

  if(talep.length<=0){
    this.alertify.warning("Yönlendirme Yapılacak Satırları Seçiniz!");
    return;
  }
  else{
    this.OnayYonlendirmeKulList(content,talep[0].OnayTanimId);
  }   
}
onayyonlendirmelist: DtsOnayTanimDetayModel[]=[];    
async OnayYonlendirmeKulList(content:any,surecid:number)  {
  this.blockUI.start(EkranMesaj.Listele);
    (await this.onaysrc.GetOnayTanimDetay(0,surecid,3)).subscribe(
      data=>{ 
        this.blockUI.stop(); 
        this.onayyonlendirmelist=(data.List as DtsOnayTanimDetayModel[]).filter((x)=>x.Bolum==3);

        if(this.onayyonlendirmelist.length>0){
          this.secilenuser=new DtsOnayTanimDetayModel();
          this.kalemkeyword="";
          this.kullanicilist=[]; 
          this.modalService.open(content, {  size: 'lg',windowClass: 'modalcss60', backdrop: 'static' });
        }   
        else{
          this.alertify.warning("Yönlendirme Yapılacak Kullanıcı Tanımı Bulunamadı!");
          return;
        } 
      }
    )    
} 


teklifDetay(teklif:DtsOnaySurecMasterModel){ 
  //this.tabService.addTab(new Tab(TeklifOnayDetayComponent, "Teklif Onay - "+ teklif.BelgeId , { parent: "AppComponent", _teklifid:teklif.BelgeId,surec:teklif }));
}


evrekyuklegoster:boolean=false;
secilionaykalem:DtsOnaySurecMasterModel;
belgeYukleModal(content:any){
  if(this.secilionaykalem==null || this.secilionaykalem.Id<=0){
    this.alertify.success("Seçim Yapılmadı!");
    return;
  }
  this.modalService.open(content, {  size: 'lg',windowClass: 'belgeyuklemodal', backdrop: 'static' });
}


silgosterChanged(e:any,secekranid:0){
  let silinecekler  =  secekranid==0 ? this.ozelsiparisgrid.instance.getSelectedRowsData() :
                       secekranid==1 ? this.taleponaygrid.instance.getSelectedRowsData() :
                       secekranid==2 ? this.teklifonaygrid.instance.getSelectedRowsData() :
                       secekranid==3 ? this.firecikisgrid.instance.getSelectedRowsData() :
                        [];

  if (silinecekler!=null && silinecekler.length==1){
    this.evrekyuklegoster=true;
    this.secilionaykalem = silinecekler[0];
  }
  else if (silinecekler!=null && silinecekler.length>1){
    this.evrekyuklegoster=false;
    this.secilionaykalem =new DtsOnaySurecMasterModel();
  }
  else {
    this.evrekyuklegoster=false;
    this.secilionaykalem =new DtsOnaySurecMasterModel();
   }
}

SatirGuid:string="";
tarihceDetay(content:any,data:DtsOnaySurecMasterModel){
  this.SatirGuid=data.SatirGuid;
  this.modalService.open(content, {  size: 'lg',windowClass: 'modalcss45', backdrop: 'static' });   
}  

TeklifTalepDetay(talep:any){ 
  var yetki = new KullaniciYetki;
  yetki.Export = true;
  yetki.Ekle=false;
  yetki.Guncelle=false;
  yetki.Sil=false;
 this.tabService.addTab(new Tab(TalepDetayComponent, "Talep Detay - "+ talep.Miktar5 , { parent: "AppComponent", _talepid:talep.Miktar5,yetki:yetki,Kontrol:true },0));
}

ozelSipDetay(talep:any){ 
  var yetki = new KullaniciYetki;
  yetki.Export = true;
  yetki.Ekle=false;
  yetki.Guncelle=false;
  yetki.Sil=false;
 this.tabService.addTab(new Tab(OzelSiparisDetayComponent, "Özel Sipariş Detay - "+ talep.BelgeId , { parent: "AppComponent", _talepid:talep.BelgeId,yetki:yetki,Kontrol:true },0));
}

ozelsiponaygonder(e:any,bolum:string){ 
  this.onaybolum=bolum;

  let onaysecimlist  = this.ozelsiparisgrid.instance.getSelectedRowsData();
  if (onaysecimlist!=null && onaysecimlist.length>0){

    if(onaysecimlist.length>20){
      this.alertify.warning("20 Kalemden Fazla Onay Verilemez!");
    }

    this.onaygoster=true;
    this.retgoster=true;
    if(onaysecimlist.length==1)this.kalemdegistirgoster=true;
    else this.kalemdegistirgoster=false;
  }
  else {
    this.onaygoster=false;
    this.retgoster=false;  
    this.kalemdegistirgoster=false;
  }   
}

overrideOnValueChanged(e:any) { 
}

async TalepCellDegisti(e:any){ 
  var data = e.data as DtsOnaySurecMasterModel;
  if(data.Miktar3>data.Miktar4){
    this.alertify.warning("Transfer Miktarı Depo Bakiyesinden Fazla Olamaz!");
    e.data.Miktar3=0;
    e.data.Miktar=e.data.Miktar2;
  }
  
  if(data.Miktar3>0 && data.Miktar3<=data.Miktar4){
    e.data.Miktar=e.data.Miktar-e.data.Miktar3;
    if(e.data.Miktar<0){
      this.alertify.warning("Transfer Miktarı Talep Miktarından Fazla Olamaz!");
      e.data.Miktar3=0;
      e.data.Miktar=e.data.Miktar2;
    }
  }
  
  if(data.Miktar3==null || data.Miktar3==undefined || data.Miktar3<=0){
    e.data.Miktar3=0;
  }

  if(data.Miktar3>e.data.Miktar2){
    this.alertify.warning("Transfer Miktarı Talep Miktarından Fazla Olamaz!");
    e.data.Miktar3=0;
    e.data.Miktar=e.data.Miktar2;
  }
}

fireonayGoster(e:any,bolum:string){ 
  this.onaybolum=bolum;

  let onaysecimlist  = this.firecikisgrid.instance.getSelectedRowsData();
  if (onaysecimlist!=null && onaysecimlist.length>0){

    if(onaysecimlist.length>20){
      this.alertify.warning("20 Kalemden Fazla Onay Verilemez!");
    }

    this.onaygoster=true;
    this.retgoster=true;
    if(onaysecimlist.length==1)this.kalemdegistirgoster=true;
    else this.kalemdegistirgoster=false;
  }
  else {
    this.onaygoster=false;
    this.retgoster=false;  
    this.kalemdegistirgoster=false;
  }   
}

}
