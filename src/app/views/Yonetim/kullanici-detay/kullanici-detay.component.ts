import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DxDataGridComponent } from 'devextreme-angular';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import { PrimParametreModel, GenelApi, EkranMesaj, IslemTipi, StokGrupModel } from 'src/app/services/GenelSrc';
import { KullaniciYetki, KullaniciModel, OnayHesapModel, SirketYetki, AcenteYetki, DepoYetki, YetkiGrup, KasaYetki, BankaYetki, DepoYetkiModel, MuhatapYetkiModel, SirketBirim, SapSirket, KategoriYetkiModel, KullaniciSrcService, MuhatapModel } from 'src/app/services/KullaniciSrc';
import { NotifyService } from 'src/app/services/notify';
import { DepoModel, SiparisService } from 'src/app/services/SiparisSrc';
import { CofirmsrcService } from 'src/app/utils/confirm-dialog/cofirmsrc.service';

@Component({
  selector: 'app-kullanici-detay',
  templateUrl: './kullanici-detay.component.html',
  styleUrls: ['./kullanici-detay.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers:[
    {provide:DatePipe},
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } } 
  ]
})
export class KullaniciDetayComponent implements OnInit {
  @ViewChild('secyetki', { static: false }) secyetki!: DxDataGridComponent;
  @ViewChild("matAutoManager", { read: MatAutocompleteTrigger }) autocomplete!: MatAutocompleteTrigger;
  @ViewChild('multiSelect', { static: true }) multiSelect!: MatSelect;

  yetki:KullaniciYetki;
  
  @Input() placeholderLabel = 'Ara...';
  @BlockUI() blockUI!: NgBlockUI;
  @Input() data:any;
  seciliuser: KullaniciModel; 
  managerlist: KullaniciModel[] = []; 
  supervisorlist: KullaniciModel[] = []; 
  departmanlist: OnayHesapModel[] = []; 
  pozisyonlist: OnayHesapModel[] = []; 
  subelist:  OnayHesapModel[]=[];
  secimsubelist:  SirketYetki[]=[];   
  secimacentelist:  AcenteYetki[]=[];   
  secimdepolist:  DepoYetki[]=[];   
  yetkilist:  KullaniciYetki[]=[];   
  grupyetkilist: YetkiGrup[]=[];   
  kasayetkilist:KasaYetki[]=[];
  bankayetkilist:BankaYetki[]=[];
  kuldepoyetkilist:DepoYetkiModel[]=[];
  kulmuhatapyetkilist:MuhatapYetkiModel[]=[];
  allMode: string="";
  checkBoxesMode: string="";
  sirketbirimlist: SirketBirim[]=[];    
  kullanicilist:KullaniciModel[]=[];
  secilikullanici:KullaniciModel; 
  kalemkeyword:string=""; 
  primparamtrelist: PrimParametreModel[]=[]; 
  sirketlist: SapSirket[]=[]; 
  SapSirket:string=""; 
  kulkategoriyetkilist:KategoriYetkiModel[]=[];
  depolist: DepoModel[]=[];    

  public autoGrupYetki: FormControl = new FormControl();
  public filterGrupYetki: ReplaySubject<YetkiGrup[]> = new ReplaySubject<YetkiGrup[]>(1);

  public autoSirket: FormControl = new FormControl();
  public filterSirket: ReplaySubject<SapSirket[]> = new ReplaySubject<SapSirket[]>(1);

  public autoDepartman: FormControl = new FormControl();
  public filterDepartman: ReplaySubject<OnayHesapModel[]> = new ReplaySubject<OnayHesapModel[]>(1);

  public autoPozisyon: FormControl = new FormControl();
  public filterPozisyon: ReplaySubject<OnayHesapModel[]> = new ReplaySubject<OnayHesapModel[]>(1); 

  public formDepo: FormControl = new FormControl();
  public filterDepo: ReplaySubject<DepoModel[]> = new ReplaySubject<DepoModel[]>(1);

  public formCalistigiSube: FormControl = new FormControl();
  public filterCalistigiSube: ReplaySubject<DepoModel[]> = new ReplaySubject<DepoModel[]>(1);

  protected _onDestroy = new Subject<void>();

  constructor( 
    private modalService: NgbModal,
    private alertify:NotifyService ,
    private confirm: CofirmsrcService,    
    private kullanicisrc:KullaniciSrcService,
    private genelsrv:GenelApi,
    private siparissrc:SiparisService,
  ) { 
    this.allMode = 'allPages';
    this.checkBoxesMode = 'always';
    this.seciliuser=new KullaniciModel; 
    this.secilikullanici=new KullaniciModel();
    this.yetki=this.kullanicisrc.userperm.filter((x)=>x.YetkiKodu=="YT0007")[0];
  }

  ngOnDestroy(): void {
     this._onDestroy.next();
     this._onDestroy.complete();
  }
  ngAfterViewInit(): void {
    
  }

  async ngOnInit(): Promise<void> { 
    var kullanici =this.data._kullanici;
    this.yetki = this.data?.yetki; 

    if(kullanici!=null && kullanici.Id>0){
      await this.GetKullaniciDetay(kullanici.Id);
    }
    else {
      this.seciliuser = new KullaniciModel();
      this.seciliuser.Id=0;
      this.seciliuser.Aktif=true;
    }
    
    this.DataLoad();
  }

  DataLoad() {
    document.getElementById("maindataload")?.click();   
    this.GetSirketList(); 
    this.GetGrupYetkiList();  
    this.DepartmanList();  
    this.PozisyonList();  
    this.GetDepoList();  
     
    this.autoGrupYetki.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {this.filterGrupYetkiList();});  
    this.autoSirket.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {this.filterSirketList();});  
    this.autoDepartman.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {this.filterDepartmanList();});  
    this.autoPozisyon.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {this.filterPozisyonList();});  
    this.formDepo.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {this.filterDepoList();});  
    this.formCalistigiSube.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {this.filterCalistigiSubeList();});  

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
        this.filterCalistigiSube.next(this.depolist.slice());
     }
   )
  }

  protected filterCalistigiSubeList() {
    if (!this.depolist) {
      return;
    } 
    let search = this.formCalistigiSube.value+"";
    if (!search) {
      this.filterCalistigiSube.next(this.depolist.slice());
      return;
    } else {
      search = search.toUpperCase();
    } 
    this.filterCalistigiSube.next(
      this.depolist.filter(item => (item?.WhsName??"").toUpperCase().indexOf(search) > -1)
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


  protected filterPozisyonList() {
    if (!this.pozisyonlist) {
      return;
    } 
    let search = this.autoPozisyon.value+"";
    if (!search) {
      this.filterPozisyon.next(this.pozisyonlist.slice());
      return;
    } else {
      search = search.toUpperCase();
    } 
    this.filterPozisyon.next(
      this.pozisyonlist.filter(item => (item?.Name??"").toUpperCase().indexOf(search) > -1)
    );
  }

  protected filterDepartmanList() {
    if (!this.departmanlist) {
      return;
    } 
    let search = this.autoDepartman.value+"";
    if (!search) {
      this.filterDepartman.next(this.departmanlist.slice());
      return;
    } else {
      search = search.toUpperCase();
    } 
    this.filterDepartman.next(
      this.departmanlist.filter(item => (item?.Name??"").toUpperCase().indexOf(search) > -1)
    );
  }

  protected filterSirketList() {
    if (!this.sirketlist) {
      return;
    } 
    let search = this.autoSirket.value+"";
    if (!search) {
      this.filterSirket.next(this.sirketlist.slice());
      return;
    } else {
      search = search.toUpperCase();
    } 
    this.filterSirket.next(
      this.sirketlist.filter(item => (item?.cmpName??"").toUpperCase().indexOf(search) > -1)
    );
  } 

  protected filterGrupYetkiList() {
    if (!this.grupyetkilist) {
      return;
    } 
    let search = this.autoGrupYetki.value+"";
    if (!search) {
      this.filterGrupYetki.next(this.grupyetkilist.slice());
      return;
    } else {
      search = search.toUpperCase();
    } 
    this.filterGrupYetki.next(
      this.grupyetkilist.filter(item => (item?.GrupAdi??"").toUpperCase().indexOf(search) > -1)
    );
  } 
   
  async GetGrupYetkiList()  {
    this.blockUI.start("Grup Yetkileri Getiriliyor...");
      (await this.kullanicisrc.GetYetkiGrup(0)).subscribe(
        data=>{
          this.blockUI.stop(); 
          if(!data.Success){
            this.alertify.warning(data.Message);
            return;
          }
          this.grupyetkilist=data.List;
          this.filterGrupYetki.next(this.grupyetkilist.slice());
        }
      )         
  }  
  
  async GetSirketList()  {
    this.blockUI.start("Grup Yetkileri Getiriliyor...");
      (await this.kullanicisrc.GetSirketList()).subscribe(
        data=>{
          this.blockUI.stop(); 
          if(!data.Success){
            this.alertify.warning(data.Message);
            return;
          }
          this.sirketlist=data.List;
          this.filterSirket.next(this.sirketlist.slice());
        }
      )         
  }  

  async DepartmanList() {
    this.blockUI.start(EkranMesaj.Listele);
    (await this.kullanicisrc.GetDepartman()).subscribe(
      data =>{
        this.blockUI.stop(); 
        if(!data.Success){
          this.alertify.warning(data.Message);
          return;
        }
        this.departmanlist=data.List;  
        this.filterDepartman.next(this.departmanlist.slice());
     }
   )
  }

  async PozisyonList() { 
    this.blockUI.start(EkranMesaj.Listele);
    (await this.kullanicisrc.GetPozisyon()).subscribe(
      data =>{
        this.blockUI.stop(); 
        if(!data.Success){
          this.alertify.warning(data.Message);
          return;
        }
        this.pozisyonlist=data.List;  
        this.filterPozisyon.next(this.pozisyonlist.slice());
     }
   )
  }

  async GetKullaniciYetki() {
    this.blockUI.start("Yetki Okunuyor...");
    (await this.kullanicisrc.GetKullaniciYetki(this.seciliuser.Id,-1,"","H")).subscribe((data)=>{   
      this.blockUI.stop(); 
      if(!data.Success){
        this.alertify.warning(data.Message);
        return;
      }
      this.yetkilist=data.List;  
   })  
  }

  async GetKullaniciDetay(id:number) {
    this.blockUI.start("Yetki Okunuyor...");
    (await this.kullanicisrc.GetKullaniciDetay(id)).subscribe((data)=>{   
      this.blockUI.stop(); 
      if(!data.Success){
        this.alertify.warning(data.Message);
        return;
      }
      this.seciliuser=data.Model;  
   })  
  }
 
  secilitab:string="";
  tabDegisti(e:any){
    this.secilitab=e.tab.textLabel;
    if(e.tab.textLabel=="Kullanıcı Yetki"){
      this.GetKullaniciYetki();
    }  
  }

  async kaydet(){ 
    if(this.seciliuser.AdSoyad=="" || this.seciliuser.AdSoyad==undefined){
      this.alertify.warning("Ad Soyad Alanı Zorunludur!");
      return;
    }
    if(this.seciliuser.KullaniciAdi=="" || this.seciliuser.KullaniciAdi==undefined){
      this.alertify.warning("Kullanıcı Adı Alanı Zorunludur!");
      return;
    }
    if(this.seciliuser.Sifre=="" || this.seciliuser.Sifre==undefined){
      this.alertify.warning("Şifre Alanı Zorunludur!");
      return;
    }
    if(this.seciliuser.Sirket==null || this.seciliuser.Sirket==undefined || this.seciliuser.Sirket.length<=0){
      this.alertify.warning("Şirket Seçimi Zorunludur!");
      return;
    }
    if(this.seciliuser.Depo==null || this.seciliuser.Depo==undefined || this.seciliuser.Depo.length<=0){
      this.alertify.warning("Yetkili Mağaza Seçimi Zorunludur!");
      return;
    }
    if(this.seciliuser.CalistigiSubeKod=="" || this.seciliuser.CalistigiSubeKod==undefined){
      this.alertify.warning("Çalıştığı Mağaza Seçimi Zorunludur!");
      return;
    }
    
    this.blockUI.start("Kayıt Başladı..."); 
    var sonuc = await this.kullanicisrc.KullaniciEkle(this.seciliuser,this.seciliuser.Id>0?IslemTipi.Guncelle:IslemTipi.Ekle,this.yetkilist); 
    if(sonuc.Success==true){      
      if(this.seciliuser.Id<=0)this.seciliuser.Id=sonuc.Id; 
      this.alertify.success("Kayıt Tamamlandı!");
      this.modalService.dismissAll();
      } else{
    this.alertify.warning(sonuc.Message);
    }
      this.blockUI.stop(); 
  }

  onSirketChanged (e:any) {   
    
  } 

  onAcenteChanged (e:any) {   
     
  } 

  onDepoChanged (e:any) {   
     
  } 

  onYetkiChanged (e:any) {   
     
  } 

  YetkiYuklendi(e:any){ 
    
  }

  KasaYetkiYuklendi(e:any){ 
    
  }

  BankaYetkiYuklendi(e:any){ 
    
  }

  kulTumunuSec(e:number){
    if(this.yetkilist==null || this.yetkilist.length<=0){
      return;
    }

    if(e==1){
      this.confirm.confirm('Bilgilendirme', 'Görüntüle Yetkilerinin Tümü Değiştirilecek, Devam Edilsin mi?')
      .then(async (confirmed:any) => 
      {
        if(confirmed.sonuc==true)  {
          let durum = this.yetkilist[0].Goruntule;
          this.yetkilist.forEach(item=>{
            item.Goruntule=!durum;
          })
        }
      })
      .catch(() => {
  
      });
     
    }
    else if(e==2){
      this.confirm.confirm('Bilgilendirme', 'Ekle Yetkilerinin Tümü Değiştirilecek, Devam Edilsin mi?')
      .then(async (confirmed:any) => 
      {
        if(confirmed.sonuc==true)  {
          let durum = this.yetkilist[0].Ekle;
          this.yetkilist.forEach(item=>{
            item.Ekle=!durum;
          })
        }
      })
      .catch(() => {
  
      });
     
    }
    else if(e==3){
      this.confirm.confirm('Bilgilendirme', 'Güncelle Yetkilerinin Tümü Değiştirilecek, Devam Edilsin mi?')
      .then(async (confirmed:any) => 
      {
        if(confirmed.sonuc==true)  {
          let durum = this.yetkilist[0].Guncelle;
          this.yetkilist.forEach(item=>{
            item.Guncelle=!durum;
          })
        }
      })
      .catch(() => {
  
      });
     
    }
    else if(e==4){
      this.confirm.confirm('Bilgilendirme', 'Sil Yetkilerinin Tümü Değiştirilecek, Devam Edilsin mi?')
      .then(async (confirmed:any) => 
      {
        if(confirmed.sonuc==true)  {
          let durum = this.yetkilist[0].Sil;
          this.yetkilist.forEach(item=>{
            item.Sil=!durum;
          })
        }
      })
      .catch(() => {
  
      });
     
    }
    else if(e==5){
      this.confirm.confirm('Bilgilendirme', 'Export Yetkilerinin Tümü Değiştirilecek, Devam Edilsin mi?')
      .then(async (confirmed:any) => 
      {
        if(confirmed.sonuc==true)  {
          let durum = this.yetkilist[0].Export;
          this.yetkilist.forEach(item=>{
            item.Export=!durum;
          })
        }
      })
      .catch(() => {
  
      });
     
    }
  } 

  async kullkalemAra(ev:any){ 
    if(this.kalemkeyword==""){
      this.alertify.warning("Aramak İstediğiniz Firmayı Kısaca Yazın...");
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

  kullaramaTemizle(){
    this.kalemkeyword="";
    this.kullanicilist=[];
  }

  kullhesapSecModal(content:any){
    this.kalemkeyword="";
    this.kullanicilist=[];
    this.secilikullanici=new KullaniciModel();     
    this.modalService.open(content, {  size: 'lg',windowClass: 'modalcss50', backdrop: 'static' }); 
  } 
  
  kullhesapSec(){  
    document.getElementById("finhspkapat")?.click();   
    if(this.secilikullanici==null)return;
    
    this.seciliuser.YoneticiId = this.secilikullanici.Id;
    this.seciliuser.Yonetici = this.secilikullanici.AdSoyad;    

  }

  kullonHesapChg(e:any){
    let secim = e?.selectedRowsData[0] ?? null;
    if(secim!=null){
      this.secilikullanici = secim;
    } 
  } 

  kullSecimTemizle(){
    this.secilikullanici=new KullaniciModel(); 
    this.seciliuser.YoneticiId = 0;
    this.seciliuser.Yonetici = "";    
  }

  defGrup(event: any) {
    this.seciliuser.GrupYetkiId = 0;
    event.stopPropagation();
  }

  defDepartman(event: any) {
    this.seciliuser.DepartmanId = 0;
    event.stopPropagation();
  }

  defPozisyon(event: any) {
    this.seciliuser.PozisyonId = 0;
    event.stopPropagation();
  }

  tumunuSec(e:number){
    if(this.yetkilist==null || this.yetkilist.length<=0){
      return;
    }

    if(e==1){
      this.confirm.confirm('Bilgilendirme', 'Görüntüle Yetkilerinin Tümü Değiştirilecek, Devam Edilsin mi?')
      .then(async (confirmed:any) => 
      {
        if(confirmed.sonuc==true)  {
          let durum = this.yetkilist[0].Goruntule;
          this.yetkilist.forEach(item=>{
            item.Goruntule=!durum;
          })
        }
      })
      .catch(() => {
  
      });
     
    }
    else if(e==2){
      this.confirm.confirm('Bilgilendirme', 'Ekle Yetkilerinin Tümü Değiştirilecek, Devam Edilsin mi?')
      .then(async (confirmed:any) => 
      {
        if(confirmed.sonuc==true)  {
          let durum = this.yetkilist[0].Ekle;
          this.yetkilist.forEach(item=>{
            item.Ekle=!durum;
          })
        }
      })
      .catch(() => {
  
      });
     
    }
    else if(e==3){
      this.confirm.confirm('Bilgilendirme', 'Güncelle Yetkilerinin Tümü Değiştirilecek, Devam Edilsin mi?')
      .then(async (confirmed:any) => 
      {
        if(confirmed.sonuc==true)  {
          let durum = this.yetkilist[0].Guncelle;
          this.yetkilist.forEach(item=>{
            item.Guncelle=!durum;
          })
        }
      })
      .catch(() => {
  
      });
     
    }
    else if(e==4){
      this.confirm.confirm('Bilgilendirme', 'Sil Yetkilerinin Tümü Değiştirilecek, Devam Edilsin mi?')
      .then(async (confirmed:any) => 
      {
        if(confirmed.sonuc==true)  {
          let durum = this.yetkilist[0].Sil;
          this.yetkilist.forEach(item=>{
            item.Sil=!durum;
          })
        }
      })
      .catch(() => {
  
      });
     
    }
    else if(e==5){
      this.confirm.confirm('Bilgilendirme', 'Export Yetkilerinin Tümü Değiştirilecek, Devam Edilsin mi?')
      .then(async (confirmed:any) => 
      {
        if(confirmed.sonuc==true)  {
          let durum = this.yetkilist[0].Export;
          this.yetkilist.forEach(item=>{
            item.Export=!durum;
          })
        }
      })
      .catch(() => {
  
      });
     
    }
  } 
}
