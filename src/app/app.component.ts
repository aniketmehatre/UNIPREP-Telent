import {Component} from '@angular/core';
import {  HostListener } from '@angular/core';
@Component({
  selector: 'app-root',
  template: `
    <router-outlet></router-outlet>
    <p-toast position="top-right"></p-toast>
    <ngx-ui-loader overlayColor="rgba(0,0,0,0.8)" logoUrl="uniprep-assets/images/uniprep-dark.svg" [logoSize]="200" fgsType="ball-scale-multiple" fgsColor="#f0780e" [hasProgressBar]="false"></ngx-ui-loader>`
})
export class AppComponent {

  // @HostListener('window:unload', [ '$event' ])
  // unloadHandler(event: any) {
  //   alert(event);
  // }
  //
  // @HostListener('window:beforeunload', [ '$event' ])
  // beforeUnloadHandler(event: any) {
  //   alert(event);
  // }

  child : Boolean=true;

  @HostListener('keydown', ['$event']) triggerEsc(e: KeyboardEvent) {
    
    if(e.keyCode===27 && this.child===true){


    }else{
      this.child=true;
    }
  }

  public doSomething(child: any):void {
    this.child=child;
}
}
