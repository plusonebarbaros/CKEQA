import { Injectable } from "@angular/core";
import { DxTemplateModule, DxButtonModule, DxPopupModule, DxPopoverModule } from 'devextreme-angular';
import notify from 'devextreme/ui/notify';
 

@Injectable({
  providedIn: "root"
})
export class NotifyService {
  constructor() {}

  success(message: string) {
    notify({
        message: message,
        width: 300
    }, 
    "success",
    4000);
  } 

  warning(message: string) {
    notify({
        message: message,
        width: 300
    }, 
    "error",
    4000);
  }
}