import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <router-outlet></router-outlet>
    <p-toast position="top-right"></p-toast>
    <ngx-ui-loader fgsColor="#9bc329" [hasProgressBar]="false"></ngx-ui-loader>`
})
export class AppComponent {
}
