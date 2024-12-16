import {Component, HostListener} from '@angular/core';
import {LocationService} from "./location.service";
import {environment} from "@env/environment";
import {LocalStorageService} from "ngx-localstorage";

@Component({
  selector: 'app-root',
  template: `
    <router-outlet></router-outlet>
    <p-toast position="top-right"></p-toast>
    <ngx-ui-loader overlayColor="rgba(0,0,0,0.8)" logoUrl="uniprep-assets/images/icon-loader.svg" [bgsSize]="40" bgsType="three-bounce" [bgsOpacity]="1" bgsColor="#f0780e" [fgsOpacity]="1" fgsColor="#f0780e" [hasProgressBar]="false"></ngx-ui-loader>`
})
export class AppComponent {
  constructor(private storage: LocalStorageService,private whitelabelservice:LocationService) {}
  private isPageHidden = false;

  ngOnInit() {
    this.getImageWhitelabel()
    document.addEventListener('visibilitychange', () => {
      this.isPageHidden = document.hidden;
    });
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadHandler(event: BeforeUnloadEvent) {
    return;
    if (window.location.href.includes('localhost')) {
      return
    }
    if (window.location.href.includes('subscriptions') || window.location.href.includes('upgrade-subscription')) {
      return
    }
    if (window.location.href.includes('login')) {
      return
    }
    if (window.location.href.includes('register')) {
      return
    }
    if (window.location.href.includes('certificates')) {
      return
    }
    if (window.location.href.includes('forgot-password')) {
      return;
    }
    if (window.location.href.includes('termsandcondition')) {
      console.log('yyttt')
      return
    }
    if (window.location.href.includes('privacypolicy')) {
      return
    }
    if (window.location.href.includes('refundpolicy')) {
      return
    }
    if (window.location.href.includes('cancellationpolicy')) {
      return
    }
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
        console.log(window.location)
        console.log('Tab refreshed or navigated away');
      }
    if (window.location.href.includes('login')) {
      return
    }
    if (window.location.href.includes('register')) {
      return
    }
    if (window.location.href.includes('forgot-password')) {
      return;
    }
    if (window.location.href.includes('termsandcondition')) {
      console.log('sasdf')
      return
    }
    if (window.location.href.includes('privacypolicy')) {
      return
    }
    if (window.location.href.includes('refundpolicy')) {
      return
    }
    if (window.location.href.includes('cancellationpolicy')) {
      return
    }
      event.preventDefault();
      event.returnValue = '';

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
  // loginwhitlabelurl(){
  //   var data={
  //     domainname:"uniprep.ai"
  //   }
  //   this.storage.getWhitlabelData(data).subscribe(res => {
  //     console.log(res);
  //   });
  // }
  imagewhitlabeldomainname:any
  getImageWhitelabel(){
    this.imagewhitlabeldomainname=window.location.hostname;
    var data={
      domainname:this.imagewhitlabeldomainname
    }
    this.whitelabelservice.getWhitlabelData(data).subscribe(res => {
    });
  }
}
