import {
    Component,
    Input,
    ComponentFactoryResolver,
    ViewChild,
    OnInit
  } from "@angular/core";
  import { Tab } from "../services/tabs-mod"; 
import { ContentContainerDirective } from "./content-container";
import { SkeletonComponent } from "./skeleton";
   
  @Component({
    selector: "app-tab-content",
    template: "<ng-template content-container></ng-template>"
  })
  export class TabContentComponent implements OnInit {
    @Input()
      tab!: Tab;
    @ViewChild(ContentContainerDirective, { static: true })
      contentContainer!: ContentContainerDirective;
  
    constructor(private componentFactoryResolver: ComponentFactoryResolver) {}
  
    ngOnInit() {
      const tab: Tab = this.tab;
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(
        tab.component
      );
      const viewContainerRef = this.contentContainer.viewContainerRef;
      const componentRef = viewContainerRef.createComponent(componentFactory);
      (componentRef.instance as SkeletonComponent).data = tab.tabData;
    }
  }
  