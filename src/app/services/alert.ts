import { Injectable } from "@angular/core";

declare let alertify: any;

@Injectable({
  providedIn: "root"
})
export class AlertifyService {
  constructor() {}

  success(message: string) {
    alertify.set('notifier','position', 'top-right');
    alertify.success(message);
  }

  error(message: string) {
    alertify.set('notifier','position', 'top-right');
    alertify.error(message);
  }

  info(message: string) {
    alertify.set('notifier','position', 'top-right');
    alertify.info(message);
  }

  warning(message: string) {
    alertify.set('notifier','position', 'top-right');
    alertify.warning(message);
  }
}