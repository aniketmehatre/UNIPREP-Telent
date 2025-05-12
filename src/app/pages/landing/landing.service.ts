import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from '@env/environment';
import {Observable} from 'rxjs';
import { IPAddress } from './pricing/pricing.component';

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

  getLandingCategories(id: number) {
    return this.http.post<any>(environment.ApiUrl + "/showCategory", { id: id }, {
      headers: this.headers
    });
  }

  getLandingCategoryTags(id: number) {
    return this.http.post<any>(environment.ApiUrl + "/Categorytags", { id: id }, {
      headers: this.headers
    });
  }

  getLandingCategoryCards(id: number) {
    return this.http.post<any>(environment.ApiUrl + "/Categorycards", { id: id }, {
      headers: this.headers
    });
  }

  getManagementTeamMembersList(data: any) {
    return this.http.post<any>(`${environment.ApiUrl}/landingpageactivemanagement`, data);
  }

  sendContactUsPage(data: any) {
    return this.http.post<any>(`${environment.ApiUrl}/contactussave`, data);
  }

  getCitiesCountry(data: any) {
    return this.http.get<any>(`${environment.ApiUrl}/getworldcitiescountry`, { params: data });
  }

  getLandingPageSubscriptionList(data: any) {
    return this.http.post<IPAddress>(`${environment.ApiUrl}/getlandingpagesubscriptionlist`, data);
  }

  getCountryName() {
    return this.http.get('https://ipapi.co/json/');
  }
}
