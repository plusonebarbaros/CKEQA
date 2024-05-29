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
  selector: 'app-siparis-muhasebe-kontrol',
  templateUrl: './siparis-muhasebe-kontrol.component.html',
  styleUrls: ['./siparis-muhasebe-kontrol.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers:[
    {provide:DatePipe},
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } }
  ]
})
export class SiparisMuhasebeKontrolComponent implements OnInit {
  @ViewChild('gridMuhKontrol', { static: false }) grid!: DxDataGridComponent;
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
  MuhKontrolId:number=0;

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
    this.GetSiparisMuhsebeKontList();  
  }

  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();   
 }
 
  async GetSiparisMuhsebeKontList()  {
    this.blockUI.start(EkranMesaj.Listele);
      (await this.talepsrc.GetSiparisMuhsebeKontList(this.filter.Baslangic,this.filter.Bitis,this.MuhKontrolId)).subscribe(
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
    this.secilikalem=new TalepDetail();
    let list  = this.grid.instance.getSelectedRowsData() as TalepDetail[]; 
 
    if (list.length==1){ 
      this.teslimalgoster=true;  
      this.evrekyuklegoster=true;
      this.secilidata = list; 
      this.secilikalem=this.secilidata[0]; 
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
      this.confirmationDialogService.confirm('Muhasebe Kontrol', 'Seçili Kalemler İçin Kontrol Süreci Tamamlanacak, Devam Edilsin mi?')
      .then(async (confirmed:any) => 
      {
        if(confirmed.sonuc==true)  {
          this.blockUI.start("Kayıt Başladı...");
          var sonuc = await this.talepsrc.SiparisMuhasebeKont(list);
          if(sonuc.Success==true){
            this.modalService.dismissAll();
            this.alertify.success("İşlem Tamamlandı!"); 
          } else{
            this.alertify.warning(sonuc.Message);
          }
          this.blockUI.stop(); 

          this.GetSiparisMuhsebeKontList();
        }
      })
      .catch((err) => {
        this.alertify.warning("Hata Oluştu! "+err);
      });
    }    
  }
}
