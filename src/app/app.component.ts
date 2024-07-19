import {Component, HostListener} from '@angular/core';
import {SessionService} from "./session.service";
import {LocationService} from "./location.service";
import {Subject} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "@env/environment";
import {LocalStorageService} from "ngx-localstorage";

@Component({
  selector: 'app-root',
  template: `
    <router-outlet></router-outlet>
    <p-toast position="top-right"></p-toast>
    <ngx-ui-loader overlayColor="rgba(0,0,0,0.8)" logoUrl="uniprep-assets/images/icon-loader.svg" [fgsSize]="75" fgsType="circle" fgsColor="#f0780e" [hasProgressBar]="false"></ngx-ui-loader>`
})
export class AppComponent {
  constructor(private storage: LocalStorageService) {}
  private isPageHidden = false;

  ngOnInit() {
    document.addEventListener('visibilitychange', () => {
      this.isPageHidden = document.hidden;
    });
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadHandler(event: BeforeUnloadEvent) {
    const token = this.storage.get<string>('token');
    const sessionData = {
      token: token
    };

    // Use fetch with keepalive to send data
    fetch(`${environment.ApiUrl}/updatetracking`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(sessionData),
      keepalive: true
    });

    if (this.isPageHidden) {
      console.log('Tab closed');
    } else {
      console.log('Tab refreshed or navigated away');
    }

    event.preventDefault();
    event.returnValue = ''; // Most browsers will display a generic message here
  }
  // @HostListener('window:beforeunload', ['$event'])
  // beforeunloadHandler(event: any) {
  //   event.preventDefault();
  //   event.returnValue = 'Your data will be lost!';
  //   const sessionData = {
  //     token: this.storage.get<string>('token')
  //   };
  //   console.log('update track')
  //   const headers = new HttpHeaders().set("Accept", "application/json");
  //   return this.http.post<any>(environment.ApiUrl + "/updatetracking", sessionData, {
  //     headers: headers,
  //   });
  //   return false;
  // }
  // @HostListener('window:beforeunload', ['$event'])
  // unloadHandler(event: BeforeUnloadEvent) {
  //   this.locationService.sessionEndApiCall().subscribe((res: any) => {
  //     // Optionally handle API response or further actions
  //   });
  // }
}
