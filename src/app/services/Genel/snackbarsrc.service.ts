import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarsrcService {

  constructor(public snackBar: MatSnackBar) {}

  openSnackBar(message: string,headermsg:string,duration:number) {
    this.openSnackBarWithAction(message, headermsg,duration);
  }

  openSnackBarWithAction(message: string, action: string,duration:number) {
    this.snackBar.open(message, action, {
      duration: duration,
    });
  }
}
