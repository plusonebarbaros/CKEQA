import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DxDataGridComponent } from 'devextreme-angular';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subject, ReplaySubject, takeUntil } from 'rxjs';
import { IslemTipi, EkranMesaj, StokGrupModel, GenelApi } from 'src/app/services/GenelSrc';
import { KullaniciYetki } from 'src/app/services/KullaniciSrc';
import { NotifyService } from 'src/app/services/notify';
import { ConnFireTipMuhasebeTanim, ConnFireTipTanimModel, SabitservService } from 'src/app/services/SabitSrc';
import { CofirmsrcService } from 'src/app/utils/confirm-dialog/cofirmsrc.service';

@Component({
  selector: 'app-fire-tip-muhasebe-tanim',
  templateUrl: './fire-tip-muhasebe-tanim.component.html',
  styleUrls: ['./fire-tip-muhasebe-tanim.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers:[
    {provide:DatePipe},
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } } 
  ]
})
export class FireTipMuhasebeTanimComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  @ViewChild('gridFireTipTanim', { static: false }) grid!: DxDataGridComponent;
  @Input() data:any;     
  yetki:KullaniciYetki;
  datalist: ConnFireTipMuhasebeTanim[]=[];    
  silgoster:boolean=false;  
  secilidata:ConnFireTipMuhasebeTanim; 
  isReadOnly: boolean=false;     
  firetiplist: ConnFireTipTanimModel[]=[];  
  stokgruplist: StokGrupModel[]=[]

  protected _onDestroy = new Subject<void>();

  public formFireTip: FormControl = new FormControl();
  public filterFireTip: ReplaySubject<ConnFireTipTanimModel[]> = new ReplaySubject<ConnFireTipTanimModel[]>(1);

  public formStokGrup: FormControl = new FormControl();
  public filterStokGrup: ReplaySubject<StokGrupModel[]> = new ReplaySubject<StokGrupModel[]>(1);

  
  constructor(  
    private modalService: NgbModal,
    private alertify:NotifyService ,
    private confirmationDialogService: CofirmsrcService,  
    private sabitsrc:SabitservService,
    private genelsrv:GenelApi,
    ) 
    {  
      this.secilidata=new  ConnFireTipMuhasebeTanim();  
      this.yetki=new  KullaniciYetki();
    }  

  ngOnInit() { 
    this.yetki = this.data?.yetki;    
    this.DataListele();    
    this.GetFireTipTanim();    
    this.GetStokGrup();
    this.formFireTip.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {this.filterFireTipList();});  
    this.formStokGrup.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {this.filterStokGrupList();});  
  } 

  async GetFireTipTanim()  {
    this.blockUI.start(EkranMesaj.Listele);
      (await this.sabitsrc.GetFireTipTanim(0)).subscribe(
        data=>{
          this.blockUI.stop(); 
          if(!data.Success){
            this.alertify.warning(data.Message);
            return;
          }
          this.firetiplist=data.List;
          this.filterFireTip.next(this.firetiplist.slice());
        }
      )         
  }

  protected filterStokGrupList() {
    if (!this.stokgruplist) {
      return;
    } 
    let search = this.formStokGrup.value+"";
    if (!search) {
      this.filterStokGrup.next(this.stokgruplist.slice());
      return;
    } else {
      search = search.toUpperCase();
    } 
    this.filterStokGrup.next(
      this.stokgruplist.filter(item => (item?.ItmsGrpNam??"").toUpperCase().indexOf(search) > -1)
    );
  } 

  async GetStokGrup() {
    this.blockUI.start("Depo Yetki Okunuyor...");
    (await this.genelsrv.GetStokGrup("",true)).subscribe((data)=>{  
      this.blockUI.stop();  
      if(!data.Success){
        this.alertify.warning(data.Message);
        return;
      }
      this.stokgruplist=data.List;  
      this.filterStokGrup.next(this.stokgruplist.slice());
   })  
  }

  
  defGrup(event: any) {
    this.secilidata.StokGrupId = 0;
    event.stopPropagation();
  }

  ngOnDestroy(): void {
    this._onDestroy.next();
     this._onDestroy.complete();
  }

 protected filterFireTipList() {
   if (!this.firetiplist) {
     return;
   } 
   let search = this.formFireTip.value+"";
   if (!search) {
     this.filterFireTip.next(this.firetiplist.slice());
     return;
   } else {
     search = search.toUpperCase();
   } 
   this.filterFireTip.next(
     this.firetiplist.filter(item => (item?.Tanim??"").toUpperCase().indexOf(search) > -1)
   );
  } 

  defFireTip(event: any) {
    this.secilidata.FireTipId = 0;
    event.stopPropagation();
  }
 
  async kaydet(){  
    if(this.secilidata.FireTipId <= 0){
      this.alertify.warning("Fire Tip Seçimi Zorunludur!") 
      return;
    } 
    if(this.secilidata.StokGrupId <= 0){
      this.alertify.warning("Stok Grup Seçimi Zorunludur!") 
      return;
    }   
    if(this.secilidata.HesapKodu == ""){
      this.alertify.warning("Hesap Kodu Alanı Zorunludur!") 
      return;
    }  
  
      this.blockUI.start("Kayıt Başladı...");
      var sonuc = await this.sabitsrc.FireTipMuhasebeTanimEkle(this.secilidata,this.secilidata.Id>0?IslemTipi.Guncelle:IslemTipi.Ekle);
      if(sonuc.Success==true){
        this.alertify.success("Kayıt Tamamlandı!");
        this.modalService.dismissAll();
        this.DataListele();
        } else{
      this.alertify.warning(sonuc.Message);
      }
        this.blockUI.stop(); 
  }  

  async DataListele()  {
    this.blockUI.start(EkranMesaj.Listele);
      (await this.sabitsrc.GetFireTipMuhasebeTanim(0)).subscribe(
        data=>{
          this.blockUI.stop(); 
          if(!data.Success){
            this.alertify.warning(data.Message);
            return;
          }
          this.datalist=data.List;
        }
      )         
  }

  yeniEkle(content:any){  
    this.isReadOnly=false; 
    this.secilidata=new  ConnFireTipMuhasebeTanim();
    this.secilidata.Aktif=true; 
    this.secilidata.FireTipId=0;
    this.secilidata.HesapKodu="";
    this.modalService.open(content, {  size: 'lg',windowClass: 'modalcss40', backdrop: 'static' }); 
  } 

  silgosterChanged(e:any){ 
    let silinecekler  = this.grid.instance.getSelectedRowsData()[0]; 
 
    if (silinecekler!=null){ 
      this.silgoster=true;  
      this.secilidata = silinecekler; 
    }
    else {
      this.silgoster=false; 
    }
  }
  
  kayitdetay(content:any,data:any){
    if(!this.yetki.Guncelle){
      this.alertify.warning("Güncelleme Yetkiniz Bulunmamaktadır!");
      return;
    }
    this.isReadOnly=true;
    this.secilidata = data ; 
    this.modalService.open(content, {  size: 'lg',windowClass: 'modalcss40', backdrop: 'static' }); 
  }

  async kayitsil(){    
    if(this.secilidata==null || this.secilidata.Id<=0){
      this.alertify.warning("Seçim Yapılmadı!") 
      return;
    } 

    this.confirmationDialogService.confirm('Sil', this.secilidata.Id + ' Nolu Satır Silinecek, Devam Edilsin mi?')
    .then(async (confirmed:any) => 
    {
      if(confirmed.sonuc==true)  {
        this.blockUI.start(EkranMesaj.Kaydet);
        var sonuc = await this.sabitsrc.FireTipMuhasebeTanimEkle(this.secilidata,IslemTipi.Sil);
          if(sonuc.Success==true){
            this.alertify.success(EkranMesaj.KayitTamamlandi) 
          } else{
          this.alertify.warning(sonuc.Message);
          }
        
        this.DataListele();
        this.blockUI.stop(); 
      }
    })
    .catch(() => { }); 
  } 
}
