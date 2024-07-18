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
  constructor(private sessionService: SessionService, private locationService: LocationService,
              private http: HttpClient, private storage: LocalStorageService) {}

  ngOnInit() {
    this.sessionService.startSession();
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadHandler(event: BeforeUnloadEvent) {
    const sessionData = {
      token: this.storage.get<string>('token')
    };
    const blob = new Blob([JSON.stringify(sessionData)], { type: 'application/json' });
    navigator.sendBeacon(`${environment.ApiUrl}/updatetracking`, blob);

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
