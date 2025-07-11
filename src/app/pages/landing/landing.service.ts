import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { IPAddress } from './pricing/pricing.component';

@Injectable({
  providedIn: 'root'
})
export class landingServices {
  headers = new HttpHeaders().set("Accept", "application/json");

  constructor(private http: HttpClient) { }

  getLandingPageBasedOnCategory(category: number) {
    return this.http.post<any>(environment.ApiUrl + "/landingpageview", { category: category }, {
      headers: this.headers
    });
  }

  getLandingPageChooseUs(slug: string) {
    return this.http.post<any>(environment.ApiUrl + "/landingpagechooseus", { slug: slug }, {
      headers: this.headers
    });
  }

  getLandingPageFAQ(slug: string) {
    return this.http.post<any>(environment.ApiUrl + "/landingpagefaqs", { slug: slug }, {
      headers: this.headers
    });
  }

  getLandingPageHowItsWorks(slug: string) {
    return this.http.post<any>(environment.ApiUrl + "/landingpagehowitsworks", { slug: slug }, {
      headers: this.headers
    });
  }

  getLandingPageWhoItsFors(slug: string) {
    return this.http.post<any>(environment.ApiUrl + "/landingpagewhoitsfors", { slug: slug }, {
      headers: this.headers
    });
  }

  getLandingPageData(slug: string) {
    return this.http.post<any>(`${environment.ApiUrl}/landingpageedit`, { slug: slug }, {
      headers: this.headers
    });
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


  getJobInviteDetails(uuid: string): Observable<any> {
    return this.http.post<any>(`${environment.ApiUrl}/getjobsharedetails`, { uuid });
  }

  getCompanyInviteDetails(uuid: string): Observable<any> {
    return this.http.post(`${environment.ApiUrl}/getcompanysharedetails`, { uuid });
  }

  getTalentInviteDetails(uuid: string): Observable<any> {
    return this.http.post(`${environment.ApiUrl}/gettalentsharedetails`, { uuid });
  }
}
