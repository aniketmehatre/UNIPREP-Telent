import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from '@env/environment';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class landingServices {
    headers = new HttpHeaders().set("Accept", "application/json");

    constructor(private http: HttpClient) { }

    getLandingPageBasedOnCategory(category: number) {
      return this.http.post<any>(environment.ApiUrl + "/landingpageview",{category: category}, {
        headers: this.headers});
    }

    getLandingPageChooseUs(id: number) {
      return this.http.post<any>(environment.ApiUrl + "/landingpagechooseus",{id: id}, {
        headers: this.headers});
    }

    getLandingPageFAQ(id: number) {
      return this.http.post<any>(environment.ApiUrl + "/landingpagefaqs",{id: id}, {
        headers: this.headers});
    }

    getLandingPageHowItsWorks(id: number) {
      return this.http.post<any>(environment.ApiUrl + "/landingpagehowitsworks",{id: id}, {
        headers: this.headers});
    }

    getLandingPageWhoItsFors(id: number) {
      return this.http.post<any>(environment.ApiUrl + "/landingpagewhoitsfors",{id: id}, {
        headers: this.headers});
    }

    getLandingPageData(val: any){
      return this.http.post<any>(`${environment.ApiUrl}/landingpageedit`, {id: val});
    }

  getManagementTeamMembersList(data: any) {
    return this.http.post<any>(`${environment.ApiUrl}/landingpageactivemanagement`, data);
  }
}
