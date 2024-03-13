import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DxDataGridComponent } from 'devextreme-angular';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { GenelApi, IslemTipi, EkranMesaj } from 'src/app/services/GenelSrc';
import { KullaniciYetki } from 'src/app/services/KullaniciSrc';
import { NotifyService } from 'src/app/services/notify';
import { StokRafModel, StokService } from 'src/app/services/StokSrc';
import { CofirmsrcService } from 'src/app/utils/confirm-dialog/cofirmsrc.service';

@Component({
  selector: 'app-raf-bulma',
  templateUrl: './raf-bulma.component.html',
  styleUrls: ['./raf-bulma.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers:[
    {provide:DatePipe},
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } } 
  ]
})
export class RafBulmaComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  @ViewChild('gridDataList', { static: false }) grid!: DxDataGridComponent;
  @Input() data:any;     
  yetki:KullaniciYetki;
  datalist: StokRafModel[]=[];    
  silgoster:boolean=false;  
  secilidata:StokRafModel; 
  isReadOnly: boolean=false;  
  fileList!:FileList;

  constructor( 
    private stoksrc:StokService,
    private modalService: NgbModal,
    private alertify:NotifyService ,
    private confirmationDialogService: CofirmsrcService,
    private genelsrv:GenelApi
    ) 
    {  
      this.secilidata=new  StokRafModel();
      this.yetki=new  KullaniciYetki();
    } 

  ngOnInit() {    
    this.yetki = this.data?.yetki;
  }  

  yeniEkle(content:any){  
    this.isReadOnly=false; 
    this.secilidata=new  StokRafModel(); 
    this.modalService.open(content, {  size: 'lg',windowClass: 'modalcss40', backdrop: 'static' }); 
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

    this.confirmationDialogService.confirm('Raf Sorgulama', 'Stok Raf Sorgulama Yapılacak, Devam Edilsin mi?')
    .then(async (confirmed:any) => 
    {
      if(confirmed.sonuc==true){
        this.blockUI.start("Kayıt Başladı...");
        var sonuc = await this.stoksrc.StokRafKontrol(formData);
        if(sonuc.Success==true){
          this.alertify.success("Aktarım Tamamlandı!");
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
}
