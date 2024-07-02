import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DxDataGridComponent } from 'devextreme-angular';
import moment from 'moment';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subject, ReplaySubject } from 'rxjs';
import { GenelApi, EkranMesaj } from 'src/app/services/GenelSrc';
import { FilterMod, KullaniciYetki, KullaniciModel } from 'src/app/services/KullaniciSrc';
import { NotifyService } from 'src/app/services/notify';
import { TalepDetail, ConnTeklifMas, ConnTeklifFirma, TalepsrcService } from 'src/app/services/SatinAlmaSrc';
import { CofirmsrcService } from 'src/app/utils/confirm-dialog/cofirmsrc.service';

@Component({
  selector: 'app-siparis-teslim-al',
  templateUrl: './siparis-teslim-al.component.html',
  styleUrls: ['./siparis-teslim-al.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers:[
    {provide:DatePipe},
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } }
  ]
})
export class SiparisTeslimAlComponent implements OnInit {
  @ViewChild('gridSipTeslim', { static: false }) grid!: DxDataGridComponent;
  @BlockUI() blockUI!: NgBlockUI;
  taleplist: TalepDetail[]=[]; 
  teslimalgoster:boolean=false;
  allMode: string="";
  checkBoxesMode: string="";
  secilidata:TalepDetail[]=[];
  filter!:FilterMod; 
  teslimlist:TalepDetail[]=[];   
  teklif:ConnTeklifMas;
  @Input() data:any;     
  yetki:KullaniciYetki;
  totalrows:number=0;  
  secilifirmalist:ConnTeklifFirma[]=[];
  kalemkeyword:string=""; 
  loguser:KullaniciModel;  
  TeslimDurumId:number=0;

  protected _onDestroy = new Subject<void>();

  public formFirma: FormControl = new FormControl();
  public filterFirma: ReplaySubject<ConnTeklifFirma[]> = new ReplaySubject<ConnTeklifFirma[]>(1);

  constructor(
    private talepsrc:TalepsrcService,
    private alertify:NotifyService,
    private confirmationDialogService: CofirmsrcService,
    private modalService: NgbModal,
    private genelsrc:GenelApi, 
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
    this.GetSiparisTeslimList();  
  }

  
  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();   
 }

  cariDblClick(e:any) {
    if(e.rowType === "data" && e.column.dataField === "DocEntry") {
  
   }
  } 
 
  async GetSiparisTeslimList()  {
    this.blockUI.start(EkranMesaj.Listele);
      (await this.talepsrc.GetSiparisTeslimList(this.filter.Baslangic,this.filter.Bitis,this.TeslimDurumId)).subscribe(
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

  async teslimAl(){
    var devam=true;
    if(this.teslimlist.length<=0){
      devam=false;
      this.alertify.warning("Teslim Alınacak Malzemeler Seçilmedi!");
      return;
    }

    this.teslimlist.forEach((x)=> {
      if(x.GirisMiktar<=0 && devam){
        devam=false;
        this.alertify.warning(x.StokAdi + " Malzemesi Giriş Miktar Alanı Sıfırdan Büyük Olmalıdır!");
        return;
      }
      if(((x.TeslimMiktar+x.GirisMiktar)>x.Miktar) && devam){
        devam=false;
        this.alertify.warning(x.StokAdi + " Malzemesi İçin Teslim Miktarı Aşılıyor, Kontrol Ediniz!");
        return;
      }
    });
     
    if(devam){
      this.confirmationDialogService.confirm('Teslim', 'Seçili Kalemler İçin Teslim Alma Süreci Başlatılacak, Devam Edilsin mi?')
      .then(async (confirmed:any) => 
      {
        if(confirmed.sonuc==true)  {
          this.blockUI.start("Kayıt Başladı...");
          var sonuc = await this.talepsrc.SiparisTeslimAl(this.teslimlist);
          if(sonuc.Success==true){
            this.modalService.dismissAll();
            this.alertify.success("İşlem Tamamlandı!"); 
          } else{
            this.alertify.warning(sonuc.Message);
          }
          this.blockUI.stop(); 

          this.GetSiparisTeslimList();
        }
      })
      .catch((err) => {
        this.alertify.warning("Hata Oluştu! "+err);
      });
    }    
  }

  teslimMod(content:any){
    if(this.secilidata==null || this.secilidata.length<=0){
      this.alertify.warning("Seçim Yapılmadı!") 
      return;
    }
    this.teslimlist=[];

    this.secilidata.forEach(item=> { 
      item.BelgeTarih=moment(new Date()).format("yyyy-MM-DD"); 
      item.GirisMiktar=item.KalanMiktar;
      this.teslimlist.push(item);
    }); 
    this.modalService.open(content, {  size: 'lg',windowClass: 'modalcss80', backdrop: 'static' , keyboard:false}); 
  }

  BasTarihChg(e:any){
    this.filter.Baslangic=moment(e._d).format("yyyy-MM-DD"); 
  }

  BitTarihChg(e:any){
    this.filter.Bitis=moment(e._d).format("yyyy-MM-DD"); 
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

  SatirGuid:string="";
  tarihceDetay(content:any,data:TalepDetail){
    this.SatirGuid=data.SatirGuid;
    this.modalService.open(content, {  size: 'lg',windowClass: 'modalcss45', backdrop: 'static' });   
  }  
}
