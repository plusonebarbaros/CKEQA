import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";
import { Tab } from './tabs-mod';

@Injectable({
  providedIn: 'root'
})
export class TabService {

  public tabs: Tab[] = [];

  public tabSub = new BehaviorSubject<Tab[]>(this.tabs);

  public removeTab(index: number) {
    this.tabs.splice(index, 1);
    if (this.tabs.length > 0) {
      this.tabs[this.tabs.length - 1].active = true;
    }
    this.tabSub.next(this.tabs);
  }

  public addTab(tab: Tab,kontrol:boolean=false) {
  
    if(kontrol==true){ 
       let tabacikmi = this.tabs.filter((item)=> item.title===tab.title)[0];
       if(tabacikmi!=null){ 
        this.selectTab(tabacikmi);
        return;
       }
    } 

    for (let i = 0; i < this.tabs.length; i++) {
      if (this.tabs[i].active === true) {
        this.tabs[i].active = false;
      }
    }

    tab.id = this.tabs.length + 1;
    tab.active = true; 
    this.tabs.push(tab);
    this.tabSub.next(this.tabs);
  }

  public selectTab(tab: Tab) { 
    for (let i = 0; i < this.tabs.length; i++) {
      if (this.tabs[i].active === true) {
        this.tabs[i].active = false;
      }
    } 
    tab.active = true; 
    this.tabSub.next(this.tabs);
  }
  
}
