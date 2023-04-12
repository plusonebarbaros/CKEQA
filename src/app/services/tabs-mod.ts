import { Type } from '@angular/core';

export class Tab {
  public id: number | undefined;
  public title: string;
  public tabData: any;
  public active: boolean | undefined;
  public component: Type<any>;
  public tabid:number;

  constructor(component: Type<any>, title: string, tabData: any,tabId:number=0) {
    this.tabData = tabData;
    this.component = component;
    this.title = title;
    this.tabid=tabId;    
  }
}