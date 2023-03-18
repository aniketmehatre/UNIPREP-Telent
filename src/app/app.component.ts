import {Component} from '@angular/core';
@Component({
  selector: 'app-root',
  template: `
    <router-outlet></router-outlet>
    <p-toast position="top-right"></p-toast>
    <ngx-ui-loader fgsColor="#9bc329" [hasProgressBar]="false"></ngx-ui-loader>`
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
}
