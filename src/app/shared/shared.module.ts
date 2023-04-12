import { NgModule } from '@angular/core';  
import { LoadingComponent } from '../loading/loading.component';

@NgModule({
  declarations: [LoadingComponent], 
  exports:[
    LoadingComponent,
  ]
})
export class AppModule { }