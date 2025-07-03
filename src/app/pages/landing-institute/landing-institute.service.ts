import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from '@env/environment';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LandingInstituteService {
    headers = new HttpHeaders().set("Accept", "application/json");

    constructor(private http: HttpClient) { }

  getCountryList() {
      return this.http.get<any>(environment.ApiUrl + "/getWhiteLabelCountry");
  }

  getPartnersListById(countryId: number, type: string) {
    return this.http.post<any>(environment.ApiUrl + "/getWhiteLabelInstitute", { country: countryId, mitypename: type }, {
        headers: this.headers});
  }

  getStaticCardsByType(type: string) {
    return this.http.post<string[]>(environment.ApiUrl + "/", { type: type });
  }
  // register api
   registerEmployer(formValue: any): Observable<any> {
        const formData = new FormData();
        formData.append('name', formValue.name);
        formData.append('email', formValue.email);
        formData.append('phone', formValue.phone_number);
        formData.append('phonenumber', formValue.phonenumber);
        formData.append('password', formValue.password);
        formData.append('password_confirmation', formValue.password_confirmation);
        formData.append('country_id', formValue.country_id);
        formData.append('location_id', formValue.location_id);
        formData.append('organization_name', formValue.company_name);
        formData.append('organization_website', formValue.company_website);
        formData.append('designation', formValue.company_designation);
        formData.append('gender', formValue.gender);
        const headers = new HttpHeaders({
            'Accept': 'application/json'
        });

        return this.http.post<any>(environment.ApiUrl + "/institutesRegister", formData, { headers });
    }

    sendEmailOTP(email: any, name: any, mobile: any): Observable<any> {
        const formData = new FormData();
        formData.append('email', email);
        formData.append('name', name);
        formData.append('mobile', mobile);
        const headers = new HttpHeaders({
            'Accept': 'application/json'
        });

        return this.http.post<any>(environment.ApiUrl + "/sendpartnerotp", formData, { headers });
    }
    verifyEmailOTP(formValue: any): Observable<any> {
        const formData = new FormData();
        formData.append('full_name', formValue.full_name);
        formData.append('email', formValue.email);
        formData.append('otp', formValue.otp);

        const headers = new HttpHeaders({
            'Accept': 'application/json'
        });

        return this.http.post<any>(environment.ApiUrl + "/verifypartnerotp", formData, { headers });
    }
}