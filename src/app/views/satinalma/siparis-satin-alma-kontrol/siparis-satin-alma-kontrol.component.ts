import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DxDataGridComponent } from 'devextreme-angular';
import moment from 'moment';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subject, ReplaySubject } from 'rxjs';
import { EkranMesaj } from 'src/app/services/GenelSrc';
import { FilterMod, KullaniciYetki, KullaniciModel } from 'src/app/services/KullaniciSrc';
import { NotifyService } from 'src/app/services/notify';
import { TalepDetail, ConnTeklifMas, ConnTeklifFirma, TalepsrcService } from 'src/app/services/SatinAlmaSrc';
import { CofirmsrcService } from 'src/app/utils/confirm-dialog/cofirmsrc.service';

@Component({
  selector: 'app-siparis-satin-alma-kontrol',
  templateUrl: './siparis-satin-alma-kontrol.component.html',
  styleUrls: ['./siparis-satin-alma-kontrol.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers:[
    {provide:DatePipe},
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } }
  ]
})
export class SiparisSatinAlmaKontrolComponent implements OnInit {
  @ViewChild('gridSatinAlmaKontrol', { static: false }) grid!: DxDataGridComponent;
  @BlockUI() blockUI!: NgBlockUI;
  taleplist: TalepDetail[]=[]; 
  teslimalgoster:boolean=false;
  allMode: string="";
  checkBoxesMode: string="";
  secilidata:TalepDetail[]=[];
  filter!:FilterMod; 
  teklif:ConnTeklifMas;
  @Input() data:any;     
  yetki:KullaniciYetki;
  totalrows:number=0;  
  secilifirmalist:ConnTeklifFirma[]=[];
  kalemkeyword:string=""; 
  loguser:KullaniciModel;  
  SatKontrolId:number=0;

  protected _onDestroy = new Subject<void>();

  public formFirma: FormControl = new FormControl();
  public filterFirma: ReplaySubject<ConnTeklifFirma[]> = new ReplaySubject<ConnTeklifFirma[]>(1);

  constructor(
    private talepsrc:TalepsrcService,
    private alertify:NotifyService,
    private confirmationDialogService: CofirmsrcService,
    private modalService: NgbModal,
    ) {  
      this.teklif=new ConnTeklifMas(); 
      this.allMode = 'allPages';
      this.checkBoxesMode = 'always';
      this.yetki=new  KullaniciYetki(); 
    }

  ngOnInit() {
    this.yetki = this.data?.yetki;  
    this.loguser = JSON.parse(sessionStorage.getItem('data')??"") as KullaniciModel;
    let date=new Date; 
    let baslangic=new Date(date.getUTCFullYear(),date.getUTCMonth(),1); 
    this.filter = new FilterMod(baslangic,date); 
    this.GetSiparisSatinalmaKontList();  
  }

  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();   
 }
 
  async GetSiparisSatinalmaKontList()  {
    this.blockUI.start(EkranMesaj.Listele);
      (await this.talepsrc.GetSiparisSatinalmaKontList(this.filter.Baslangic,this.filter.Bitis,this.SatKontrolId)).subscribe(
        data=>{
          this.blockUI.stop(); 
          if(!data.Success){
            this.alertify.warning(data.Message);
            return;
          }
          this.taleplist=data.List;
        }
      )     
  }

  silgosterChanged(e:any){
    this.teslimalgoster=false; 
    this.evrekyuklegoster=false; 
    let list  = this.grid.instance.getSelectedRowsData() as TalepDetail[]; 
    this.secilikalem =new TalepDetail();

    if (list.length==1){ 
      this.teslimalgoster=true;  
      this.evrekyuklegoster=true;
      this.secilidata = list;  
      this.secilikalem = list[0];
    }
    if (list.length>1){ 
      this.teslimalgoster=true;  
      this.evrekyuklegoster=false;
      this.secilidata = list;  
    } 
  }

  evrekyuklegoster:boolean=false;
  secilikalem:TalepDetail;
  belgeYukleModal(content:any){
    if(this.secilikalem==null || this.secilikalem.Id<=0){
      this.alertify.success("Seçim Yapılmadı!");
      return;
    }
    this.modalService.open(content, {  size: 'lg',windowClass: 'belgeyuklemodal', backdrop: 'static' });
  }

  BasTarihChg(e:any){
    this.filter.Baslangic=moment(e._d).format("yyyy-MM-DD"); 
  }

  BitTarihChg(e:any){
    this.filter.Bitis=moment(e._d).format("yyyy-MM-DD"); 
  } 

  async kontrolEt(){
    let list  = this.grid.instance.getSelectedRowsData() as TalepDetail[]; 

    var devam=true;
    if(list.length<=0){
      devam=false;
      this.alertify.warning("Kontrol Edilecek Kalemler Seçilmedi!");
      return;
    } 
     
    if(devam){
      this.confirmationDialogService.confirm('Satın Alma Kontrol', 'Seçili Kalemler İçin Satın Alma Kontrol Süreci Tamamlanacak, Devam Edilsin mi?')
      .then(async (confirmed:any) => 
      {
        if(confirmed.sonuc==true)  {
          this.blockUI.start("Kayıt Başladı...");
          var sonuc = await this.talepsrc.SiparisSatinalmaKont(list,0,"");
          if(sonuc.Success==true){
            this.modalService.dismissAll();
            this.alertify.success("İşlem Tamamlandı!"); 
          } else{
            this.alertify.warning(sonuc.Message);
          }
          this.blockUI.stop(); 

          this.GetSiparisSatinalmaKontList();
        }
      })
      .catch((err) => {
        this.alertify.warning("Hata Oluştu! "+err);
      });
    }    
  }

  GeriGonderAciklama:string="";
  geriGonderMod(content:any){   
    this.GeriGonderAciklama=""; 
    this.modalService.open(content, {  size: 'lg',windowClass: 'modalcss50', backdrop: 'static' });  
  }

  async geriGonder(){
    let list  = this.grid.instance.getSelectedRowsData() as TalepDetail[]; 

    var devam=true;

    if(this.GeriGonderAciklama=="" || this.GeriGonderAciklama==undefined){
      devam=false;
      this.alertify.warning("Açıklama Alanı Zorunludur!");
      return;
    }

    if(list.length<=0){
      devam=false;
      this.alertify.warning("Kontrol Edilecek Kalemler Seçilmedi!");
      return;
    } 
     
    if(devam){
      this.confirmationDialogService.confirm('Kontrole Gönder', 'Seçili Kalemler Muhasebe Kontrolüne Gönderilecek, Devam Edilsin mi?')
      .then(async (confirmed:any) => 
      {
        if(confirmed.sonuc==true)  {
          this.blockUI.start("Kayıt Başladı...");
          var sonuc = await this.talepsrc.SiparisSatinalmaKont(list,1,this.GeriGonderAciklama);
          if(sonuc.Success==true){
            this.modalService.dismissAll();
            this.alertify.success("İşlem Tamamlandı!"); 
          } else{
            this.alertify.warning(sonuc.Message);
          }
          this.blockUI.stop(); 

          this.GetSiparisSatinalmaKontList();
        }
      })
      .catch((err) => {
        this.alertify.warning("Hata Oluştu! "+err);
      });
    }    
  }


}
