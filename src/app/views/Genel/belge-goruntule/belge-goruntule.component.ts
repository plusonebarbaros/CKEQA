import { DatePipe } from "@angular/common";
import { Component, ViewEncapsulation, OnInit, Input } from "@angular/core";
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from "@angular/material/form-field";
import { DomSanitizer } from "@angular/platform-browser";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { BelgeModel, GenelApi, EkranMesaj } from "src/app/Services/GenelSrc";
import { NotifyService } from "src/app/Services/notify";
import { ConnBelgeTip, SabitservService } from "src/app/Services/SabitSrc";
import { CofirmsrcService } from "src/app/Utils/confirm-dialog/cofirmsrc.service";

@Component({
  selector: 'app-belge-goruntule',
  templateUrl: './belge-goruntule.component.html',
  styleUrls: ['./belge-goruntule.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers:[
    {provide:DatePipe},
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } }
  ]
})
export class BelgeGoruntuleComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  belgelist:BelgeModel[]=[]; 
  belgetiplist:ConnBelgeTip[]=[]; 
  pdfdata!:any; 
  imagedata!:any; 
  fileList!:FileList;
  @Input() semkey: string="";
  @Input() kayitid: number=0;
  @Input() ekranid: number=0;
  @Input() defbelgetipid: number=3;
  @Input() secilidata:any;
  BelgeTipId:number=0;
   
  constructor( 
    private modalService: NgbModal,
    private alertify:NotifyService ,
    private genelsrv:GenelApi,
    private confirmationDialogService: CofirmsrcService, 
    private sanitizer: DomSanitizer,
    private sabitsrc: SabitservService,
  ) {  
  }

  ngOnInit(): void {
    this.belgeListele();
    this.GetDtsBelgeTip();
  } 

  belgeYukleModal(content:any){ 
    if(this.kayitid==null || this.kayitid<=0){
      this.alertify.success("Seçim Yapılmadı!");
      return;
    }
    this.belgeListele();
    this.modalService.open(content, {  size: 'lg',windowClass: 'belgeyuklemodal', backdrop: 'static' }); 
  }

  async belgeYukle(){ 
    if(this.fileList==null || this.fileList.length<=0){
      this.alertify.warning("Dosya Seçilmedi!");
      return;
    }
    if(this.BelgeTipId==null || this.BelgeTipId<=0){
      this.alertify.warning("Belge Tipi Seçiniz!");
      return;
    }
    let formData: FormData = new FormData();
 
    for (let i = 0; i < this.fileList.length; i++) {
      let  file: File = this.fileList[i];
      formData.append(file.name, file);
    }
    
    formData.append('semkey', this.semkey );
    formData.append('ekranid',this.ekranid+"" );  
    formData.append('kayitid', this.kayitid+"" );  
    formData.append('BelgeTipId', this.BelgeTipId+"" );  

    this.blockUI.start("Kayıt Başladı...");
    var sonuc = await this.genelsrv.BelgeYukle(formData);
    if(sonuc.Success==true){
      this.alertify.success("Belge Yüklendi!");
       this.belgeListele();
      } else{
    this.alertify.warning(sonuc.Message);
    }
      this.blockUI.stop(); 
  }

  uploadFile(files:any) { 
    this.fileList = files.target.files;   
  }   
  
  async belgeListele() {
    this.blockUI.start("Belgeler Getiriliyor..."); 
    var sonuc = await this.genelsrv.BelgeList(this.ekranid,this.kayitid,this.semkey,0,[]);
    if(sonuc.Success){ 
      this.belgelist=sonuc.List;
    }
    else{
      this.alertify.warning(sonuc.Message);
        return;
    }
    this.blockUI.stop();
  }  
 
  async GetDtsBelgeTip()  {
    this.blockUI.start(EkranMesaj.Listele);
      (await this.sabitsrc.GetConnBelgeTip()).subscribe(
        data=>{
          this.blockUI.stop();  
          if(!data.Success){
            this.alertify.warning(data.Message);
            return;
          }
          this.belgetiplist = data.List;      
          this.BelgeTipId = this.defbelgetipid;
        }
      )      
  }
 
  btnbelgegoster(indir:number,e:any,content:any){
    if(e==null || e.data==null){
      return;
    } 

    if(indir==0){
      let modal=true;
      if(e.data.Uzanti=="application/pdf")this.pdfdata = this.sanitizer.bypassSecurityTrustResourceUrl('data:application/pdf;base64,' + e.data.Base64Data); 
      else if(e.data.Uzanti=="image/jpeg" || e.data.Uzanti=="image/jpg" || e.data.Uzanti=="image/png") this.pdfdata = this.sanitizer.bypassSecurityTrustResourceUrl('data:'+e.data.Uzanti+';base64,' + e.data.Base64Data); 
      else {
        modal=false; 
        var a = document.createElement("a"); 
        a.href = 'data:'+e.data.Uzanti+';base64,' + e.data.Base64Data; 
        a.download = e.data.BelgeAdi; 
        a.click();
      }
      if(modal)this.modalService.open(content, {  size: 'lg',windowClass: 'belgeyuklemodal', backdrop: 'static' }); 
    } else{
        var a = document.createElement("a"); 
        a.href = 'data:'+e.data.Uzanti+';base64,' + e.data.Base64Data; 
        a.download = e.data.BelgeAdi; 
        a.click();
    }  
  }

  btnbelgesil(belge:any){
 
    if(belge==null){
      this.alertify.warning("Seçim Yapılmadı!") 
      return;
    } 

    this.confirmationDialogService.confirm('Sil', belge.data.BelgeAdi + ', Seçili Belge Silinecek, Devam Edilsin mi?')
    .then(async (confirmed:any) => 
    {
      if(confirmed.sonuc==true)  {
        this.blockUI.start(EkranMesaj.Kaydet);
        var result = await this.genelsrv.BelgeSil(belge.data);
 
        this.blockUI.stop(); 
          if(result.Success==true){
            this.alertify.success(EkranMesaj.KayitTamamlandi) 
          } else{
          this.alertify.warning(result.Message);
          } 

        this.belgeListele();
      }
    })
    .catch((e:any) => {
      this.blockUI.stop(); 
      this.alertify.warning(e.message);
    });
  }
}
