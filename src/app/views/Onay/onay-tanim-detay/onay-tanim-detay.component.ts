import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DxDataGridComponent } from 'devextreme-angular';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { EkranMesaj, IslemTipi } from 'src/app/services/GenelSrc';
import { KullaniciYetki, OnayHesapModel, KullaniciSrcService } from 'src/app/services/KullaniciSrc';
import { NotifyService } from 'src/app/services/notify';
import { DtsOnayKategoriModel, DtsOnayTanimDetayModel, DtsOnayTanimModel, DtsOnayCiftKuralModel, DtsOnayKuralModel, DtsOnaySurecKuralModel, OnaySurevSrcService } from 'src/app/services/OnaySrc';
import { CofirmsrcService } from 'src/app/utils/confirm-dialog/cofirmsrc.service';

@Component({
  selector: 'app-onay-tanim-detay',
  templateUrl: './onay-tanim-detay.component.html',
  styleUrls: ['./onay-tanim-detay.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers:[
    {provide:DatePipe},
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } } 
  ]
})
export class OnayTanimDetayComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  @ViewChild('gridOnay1', { static: false }) gridOnay1!: DxDataGridComponent;
  @ViewChild('gridOnay2', { static: false }) gridOnay2!: DxDataGridComponent;
  @ViewChild('gridOnay3', { static: false }) gridOnay3!: DxDataGridComponent;
  @ViewChild('gridOnay4', { static: false }) gridOnay4!: DxDataGridComponent;
  @ViewChild('gridOnay5', { static: false }) gridOnay5!: DxDataGridComponent;
  @Input() data:any;     
  yetki:KullaniciYetki;
  kategorilist: DtsOnayKategoriModel[]=[];    
  onaysureclist: DtsOnayTanimDetayModel[]=[];    
  onaydisilist: DtsOnayTanimDetayModel[]=[];    
  onayyonlendirmelist: DtsOnayTanimDetayModel[]=[];    
  datalist: DtsOnayTanimModel[]=[];    
  silgoster:boolean=false;  
  secilidata:DtsOnayTanimModel; 
  isReadOnly: boolean=false;   
  onaytip:string="K";
  onaysecimlist: OnayHesapModel[] = [];  
  seciliuser: OnayHesapModel[] = []; 
  allMode: string="";
  checkBoxesMode: string=""; 
  operatorlist:string[]=[];
  OnayCiftKural:number=1;
  ciftonaykurallist:DtsOnayCiftKuralModel[]=[];
  onaykurallist:DtsOnayKuralModel[]=[];
  onaysureckurallist:DtsOnaySurecKuralModel[]=[];
  secilikural:DtsOnaySurecKuralModel;
  surecsilgoster:boolean=false;
  onaydisisilgoster:boolean=false;
  yonlendirsilgoster:boolean=false;
  kuralsilgoster:boolean=false;
  ciftonaysilgoster:boolean=false;

  constructor( 
    private onaysrc:OnaySurevSrcService,
    private modalService: NgbModal,
    private alertify:NotifyService ,
    private confirmationDialogService: CofirmsrcService,
    private kullanicisrc:KullaniciSrcService,
    ) 
    {  
      this.allMode = 'allPages';
      this.checkBoxesMode = 'always';
      this.secilidata=new  DtsOnayTanimModel();
      this.yetki = this.kullanicisrc.userperm.filter((x)=>x.YetkiKodu=="YT0017")[0];
      this.secilikural=new  DtsOnaySurecKuralModel();
    } 

  ngOnInit() {  
    this.operatorlist.push("<");  
    this.operatorlist.push("<=");  
    this.operatorlist.push("=");  
    this.operatorlist.push(">");  
    this.operatorlist.push(">=");  
    this.secilidata =  this.data?.data; 
    this.DataLoad();
  }  

  tabsec(e:any){ 
    if(e.tab.textLabel=="Onay Süreci"){
      this.onaybolum=1;
    }
    else if(e.tab.textLabel=="Onay Dışı"){
      this.onaybolum=2;
    }
    else if(e.tab.textLabel=="Yönlendirmme"){
      this.onaybolum=3;
    }
  }  

  onaytipdegisti(){
    if(this.onaytip=="K")this.KullaniciList(0);
    else if(this.onaytip=="B")this.PozisyonList();
    else if(this.onaytip=="D1")this.DepartmanList();
    else if(this.onaytip=="D2")this.PozisyonList();
    else if(this.onaytip=="D3")this.DigerList(0); 
  }
  
  async DepartmanList() {
    this.onaysecimlist=[];
    this.blockUI.start(EkranMesaj.Listele);
    (await this.kullanicisrc.GetDepartman()).subscribe(
      data =>{
        this.blockUI.stop(); 
        if(!data.Success){
          this.alertify.warning(data.Message);
          return;
        }
        this.onaysecimlist=data.List;  
     }
   )
  }

  async PozisyonList() {
    this.onaysecimlist=[];
    this.blockUI.start(EkranMesaj.Listele);
    (await this.kullanicisrc.GetPozisyon()).subscribe(
      data =>{
        this.blockUI.stop(); 
        if(!data.Success){
          this.alertify.warning(data.Message);
          return;
        }
        this.onaysecimlist=data.List;  
     }
   )
  }

  async KullaniciList(empid:number) {
    this.onaysecimlist=[];
    this.blockUI.start(EkranMesaj.Listele);
    (await this.kullanicisrc.GetOnaySurecKullaniciList(empid)).subscribe(
      data =>{
        this.blockUI.stop(); 
        if(!data.Success){
          this.alertify.warning(data.Message);
          return;
        }
        this.onaysecimlist=data.List;  
     }
   )
  }

  async DigerList(empid:number) {
    this.onaysecimlist=[];
    this.blockUI.start(EkranMesaj.Listele);
    (await this.kullanicisrc.GetOnaySurecDigerList(empid)).subscribe(
      data =>{
        this.blockUI.stop(); 
        if(!data.Success){
          this.alertify.warning(data.Message);
          return;
        }
        this.onaysecimlist=data.List;  
     }
   )
  }

  surecekle(content:any,bolumid:number) { 
    this.onaytip="K";
    this.onaybolum=bolumid;
    this.onaytipdegisti();
    this.seciliuser=[]; 
    this.modalService.open(content, {  size: 'lg',windowClass: 'modalcss50', backdrop: 'static' }); 
  } 

  onSelectionChanged (e:any) {   
    this.seciliuser = e.selectedRowsData; 
  } 
 
  onaybolum:number=1;
  async onaykullanicisec(){
    this.confirmationDialogService.confirm("Kullanıcı Ekle","Onay Sürecine Kullanıcı Eklenecek, Devam Edilsin mi?")
    .then(async (confirmed:any) =>
    {
      if(confirmed.sonuc==true){
        let sira =  1;
        if(this.onaysureclist!=null && this.onaysureclist.length>0){
        sira=this.onaysureclist.reduce((p, c) => p.Sira > c.Sira ? p : c).Sira+1;
        }      
        else sira=1;
        
        this.blockUI.start(EkranMesaj.Kaydet);
    
        this.seciliuser.forEach(async arr=>{
          let ony =new  DtsOnayTanimDetayModel;
          ony.AdSoyad=arr.Name;
          ony.OnayTanimId=this.secilidata.Id;
          ony.YetkiId=arr.Id;
          ony.Tip=this.onaytip;
          ony.Sira=sira;
          ony.Birim= this.onaytip!="K" ? arr.Name:"";
          ony.Anahtar="";
          ony.AltLimit=0;
          ony.AltOperator=">=";
          ony.UstLimit=0;
          ony.UstOperator="<=";
          ony.Bolum=this.onaybolum;
          ony.OtomatikOnaySure=15;
          ony.DirektorHaric=false;
          ony.Lokasyon="";
           
          var sonuc = await this.onaysrc.OnayTanimDetayEkle(ony,IslemTipi.Ekle);
          if(sonuc.Success==true){
            this.alertify.success(EkranMesaj.KayitTamamlandi);
            this.DataLoad();
            sira+=1;
          } else{
          this.alertify.warning(sonuc.Message);
          }
        });
        this.blockUI.stop(); 
        this.modalService.dismissAll();  
      }
    })
    .catch(() => {
    }); 
  } 

  DataLoad(){
    this.SureList();
    this.GetOnayCiftKural();
    this.GetOnayKural();
    this.GetOnaySurecKural();
  } 

  async SureList()  {
    this.blockUI.start(EkranMesaj.Listele);
      (await this.onaysrc.GetOnayTanimDetay(0,this.secilidata.Id,0)).subscribe(
        data=>{ 
          this.blockUI.stop(); 
          this.onaysureclist=(data.List as DtsOnayTanimDetayModel[]).filter((x)=>x.Bolum==1);
          this.onaydisilist=(data.List as DtsOnayTanimDetayModel[]).filter((x)=>x.Bolum==2);
          this.onayyonlendirmelist=(data.List as DtsOnayTanimDetayModel[]).filter((x)=>x.Bolum==3);
        }
      )    
  } 

  async CellDegisti(e:any){  
    if(e.data==null || e.data.Id<=0){
      this.alertify.warning("Güncelleme İşlemi Yapılamadı!");
      return;
    }
    this.blockUI.start(EkranMesaj.Kaydet);
    var sonuc = await this.onaysrc.OnayTanimDetayEkle(e.data,IslemTipi.Guncelle);
      if(sonuc.Success==true){
        this.alertify.success(EkranMesaj.KayitTamamlandi) 
      } else{
      this.alertify.warning(sonuc.Message);
      } 
    this.blockUI.stop(); 
 } 

onayciftmodal(content:any) { 
  var secililist= this.gridOnay1.instance.getSelectedRowsData() as DtsOnayTanimDetayModel[];
  if(secililist==null || secililist.length<=0){
    this.alertify.warning("Süreç Listesinden Seçim Yapınız!");
    return;
  }
  if(secililist.length<=1){
    this.alertify.warning("Çift Onay Kuralında 2 veya Daha Fazla Süreç Seçilmelidir!");
    return;
  }
  this.OnayCiftKural=1; 
  this.modalService.open(content, {  size: 'lg',windowClass: 'modalcss30', backdrop: 'static' }); 
}
async onayciftkuralekle(){
  var secililist= this.gridOnay1.instance.getSelectedRowsData() as DtsOnayTanimDetayModel[];

  this.confirmationDialogService.confirm("Çift Onay","Çift Onay Kuralı Eklenecek, Devam Edilsin mi?")
  .then(async (confirmed:any) =>
  {
    if(confirmed.sonuc==true){   
      this.blockUI.start(EkranMesaj.Kaydet);
      var list:DtsOnayCiftKuralModel[]=[];

      secililist.forEach(async arr=>{        
        let ony =new  DtsOnayCiftKuralModel;
        ony.OnayTanimId=this.secilidata.Id;
        ony.OnaySatirId=arr.Id;
        ony.Sira=arr.Sira;
        ony.Kural=this.OnayCiftKural;  
        list.push(ony);
      }); 
  
      var sonuc = await this.onaysrc.OnayCiftKuralEkle(undefined,list,IslemTipi.Ekle);
      if(sonuc.Success==true){
        this.alertify.success(EkranMesaj.KayitTamamlandi) 
        this.blockUI.stop(); 
        this.modalService.dismissAll(); 
        this.DataLoad();
        this.gridOnay1.instance.clearSelection();
      } else{
        this.alertify.warning(sonuc.Message);
      } 
      
    }
  })
  .catch(() => {
  }); 
  
} 
async GetOnayCiftKural()  {
  this.blockUI.start(EkranMesaj.Listele);
    (await this.onaysrc.GetOnayCiftKural(0,this.secilidata.Id,0,"")).subscribe(
      data=>{ 
        this.blockUI.stop(); 
        this.ciftonaykurallist=data.List;
      }
    )    
} 
async GetOnayKural()  {
  this.blockUI.start(EkranMesaj.Listele);
    (await this.onaysrc.GetOnayKural(0)).subscribe(
      data=>{ 
        this.blockUI.stop(); 
        this.onaykurallist=data.List;
      }
    )    
} 
async GetOnaySurecKural()  {
  this.blockUI.start(EkranMesaj.Listele);
    (await this.onaysrc.GetOnaySurecKural(0,this.secilidata.Id,0)).subscribe(
      data=>{ 
        this.blockUI.stop(); 
        this.onaysureckurallist=data.List;
      }
    )    
} 
onaysurekuralekle(content:any) { 
  this.secilikural=new  DtsOnaySurecKuralModel();
  this.secilikural.OnayTanimId=this.secilidata.Id; 
  this.modalService.open(content, {  size: 'lg',windowClass: 'modalcss30', backdrop: 'static' }); 
}
sureckuralkaydet(){
  if(this.secilikural.KuralId<=0){
    this.alertify.warning("Kural Seçimi Yapılmadı!");
    return;
  }
  if(this.secilikural.Deger==""){
    this.alertify.warning("Kural Sürecinde Çalışacak Değer Bilgisini Giriniz!");
    return;
  }

  this.confirmationDialogService.confirm("Kural Ekle","Onay Sürecine Kural Eklenecek, Devam Edilsin mi?")
  .then(async (confirmed:any) =>
  {
    if(confirmed.sonuc==true){  
      this.blockUI.start(EkranMesaj.Kaydet);
      var sonuc = await this.onaysrc.OnaySurecKuralEkle(this.secilikural,IslemTipi.Ekle);
      if(sonuc.Success==true){
        this.alertify.success(EkranMesaj.KayitTamamlandi) 
        this.blockUI.stop(); 
        this.modalService.dismissAll(); 
        this.GetOnaySurecKural();
      } else{
        this.alertify.warning(sonuc.Message);
      }  
    }
  })
  .catch(() => {
  });
}
async surecsil(){   
  var secililist= this.gridOnay1.instance.getSelectedRowsData() as DtsOnayTanimDetayModel[];
 
  if(secililist==null || secililist.length<=0){
    this.alertify.warning("Seçim Yapılmadı!") 
    return;
  }  

  this.confirmationDialogService.confirm("Sil","Seçili Satırlar Silinecek, Devam Edilsin mi?")
  .then(async (confirmed:any) =>
  {
    if(confirmed.sonuc==true){ 
  
      this.blockUI.start(EkranMesaj.Kaydet);
  
      secililist.forEach(async arr=>{  
        var sonuc = await this.onaysrc.OnayTanimDetayEkle(arr,IslemTipi.Sil);
        if(sonuc.Success==true){ } else{
          this.alertify.warning(sonuc.Message);
        } 
      });
  
      this.alertify.success(EkranMesaj.SilmeTamamlandi) 
      this.blockUI.stop();  
      this.DataLoad();
    }
  })
  .catch(() => {
  }); 
}
async onaydisisil(){   
  var secililist= this.gridOnay2.instance.getSelectedRowsData() as DtsOnayTanimDetayModel[];
 
  if(secililist==null || secililist.length<=0){
    this.alertify.warning("Seçim Yapılmadı!") 
    return;
  }  

  this.confirmationDialogService.confirm("Sil","Seçili Satırlar Silinecek, Devam Edilsin mi?")
  .then(async (confirmed:any) =>
  {
    if(confirmed.sonuc==true){ 
  
      this.blockUI.start(EkranMesaj.Kaydet);
  
      secililist.forEach(async arr=>{  
        var sonuc = await this.onaysrc.OnayTanimDetayEkle(arr,IslemTipi.Sil);
        if(sonuc.Success==true){ } else{
          this.alertify.warning(sonuc.Message);
        } 
      });
  
      this.alertify.success(EkranMesaj.SilmeTamamlandi) 
      this.blockUI.stop(); 
      this.modalService.dismissAll(); 
      setTimeout(() => {
        this.DataLoad();
      }, 500);
    }
  })
  .catch(() => {
  }); 
}
async yonlendirsil(){   
  var secililist= this.gridOnay3.instance.getSelectedRowsData() as DtsOnayTanimDetayModel[];
 
  if(secililist==null || secililist.length<=0){
    this.alertify.warning("Seçim Yapılmadı!") 
    return;
  }  

  this.confirmationDialogService.confirm("Sil","Seçili Satırlar Silinecek, Devam Edilsin mi?")
  .then(async (confirmed:any) =>
  {
    if(confirmed.sonuc==true){   
      this.blockUI.start(EkranMesaj.Kaydet);  
      secililist.forEach(async arr=>{  
        var sonuc = await this.onaysrc.OnayTanimDetayEkle(arr,IslemTipi.Sil);
        if(sonuc.Success==true){ } else{
          this.alertify.warning(sonuc.Message);
        } 
      }); 
  
      this.alertify.success(EkranMesaj.SilmeTamamlandi) 
      this.blockUI.stop(); 
      this.modalService.dismissAll(); 
      setTimeout(() => {
        this.DataLoad();
      }, 500);
    }
  })
  .catch(() => {
  }); 
}
async kuralsil(){   
  var secililist= this.gridOnay4.instance.getSelectedRowsData() as DtsOnaySurecKuralModel[];
 
  if(secililist==null || secililist.length<=0){
    this.alertify.warning("Seçim Yapılmadı!") 
    return;
  }  

  this.confirmationDialogService.confirm("Sil","Seçili Satırlar Silinecek, Devam Edilsin mi?")
  .then(async (confirmed:any) =>
  {
    if(confirmed.sonuc==true){   
      this.blockUI.start(EkranMesaj.Kaydet);  
      secililist.forEach(async arr=>{  
        var sonuc = await this.onaysrc.OnaySurecKuralEkle(arr,IslemTipi.Sil);
        if(sonuc.Success==true){ } else{
          this.alertify.warning(sonuc.Message);
        } 
      }); 
  
      this.alertify.success(EkranMesaj.SilmeTamamlandi) 
      this.blockUI.stop(); 
      this.modalService.dismissAll(); 
      setTimeout(() => {
        this.DataLoad();
      }, 500);
    }
  })
  .catch(() => {
  }); 
}
async ciftonaysil(){   
  var secililist= this.gridOnay5.instance.getSelectedRowsData() as DtsOnayCiftKuralModel[];
 
  if(secililist==null || secililist.length<=0){
    this.alertify.warning("Seçim Yapılmadı!") 
    return;
  }  

  this.confirmationDialogService.confirm("Sil","Seçili Satırlar Silinecek, Devam Edilsin mi?")
  .then(async (confirmed:any) =>
  {
    if(confirmed.sonuc==true){   
      this.blockUI.start(EkranMesaj.Kaydet);  
      secililist.forEach(async arr=>{  
        var sonuc = await this.onaysrc.OnayCiftKuralEkle(arr,[],IslemTipi.Sil);
        if(sonuc.Success==true){ } else{
          this.alertify.warning(sonuc.Message);
        } 
      }); 
  
      this.alertify.success(EkranMesaj.SilmeTamamlandi) 
      this.blockUI.stop(); 
      this.modalService.dismissAll(); 
      setTimeout(() => {
        this.DataLoad();
      }, 500);
    }
  })
  .catch(() => {
  }); 
}

onaySurecSilChg(e:any){ 
  let silinecekler  = this.gridOnay1.instance.getSelectedRowsData();  
  if (silinecekler!=null && silinecekler.length>0){ 
    this.surecsilgoster=true;  
  }
  else {
    this.surecsilgoster=false; 
  }
}
onayDisiSilChg(e:any){ 
  let silinecekler  = this.gridOnay2.instance.getSelectedRowsData();  
  if (silinecekler!=null && silinecekler.length>0){ 
    this.onaydisisilgoster=true;  
  }
  else {
    this.onaydisisilgoster=false; 
  }
}
onayYonlendirSilChg(e:any){  
  let silinecekler  = this.gridOnay3.instance.getSelectedRowsData();  
  if (silinecekler!=null && silinecekler.length>0){ 
    this.yonlendirsilgoster=true;  
  }
  else {
    this.yonlendirsilgoster=false; 
  }
}
onayCiftSilChg(e:any){  
  let silinecekler  = this.gridOnay5.instance.getSelectedRowsData();  
  if (silinecekler!=null && silinecekler.length>0){ 
    this.ciftonaysilgoster=true;  
  }
  else {
    this.ciftonaysilgoster=false; 
  }
}
onayKuralSilChg(e:any){  
  let silinecekler  = this.gridOnay4.instance.getSelectedRowsData();  
  if (silinecekler!=null && silinecekler.length>0){ 
    this.kuralsilgoster=true;  
  }
  else {
    this.kuralsilgoster=false; 
  }
}
}
