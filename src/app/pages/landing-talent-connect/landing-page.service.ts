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

  sendContactUsPage(data: any) {
    return this.http.post<any>(`${environment.ApiUrl}/contactussave`, data);
  }

  getTalentsList(params: any): Observable<any> {
    return this.http.post<any>(`${environment.ApiUrl}/talentlist`, params, { headers: this.headers });
  }

  getJobsList(params: any): Observable<any> {
    return this.http.post<any>(`${environment.ApiUrl}/activeJobList`, params, { headers: this.headers });
  }

  getCompanyConnectList(params: any): Observable<any> {
    return this.http.post<any>(`${environment.ApiUrl}/landingpagecompanies`, params, { headers: this.headers });
  }
}