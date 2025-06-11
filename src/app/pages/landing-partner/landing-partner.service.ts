import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from '@env/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LandingPartnerServices {
    headers = new HttpHeaders().set("Accept", "application/json");

    constructor(private http: HttpClient) { }

    getCountryList() {
      return this.http.get<any>(environment.ApiUrl + "/getWhiteLabelCountry");
    }

  getPartnersListById(countryId: number, type: string) {
    return this.http.post<any>(environment.ApiUrl + "/getWhiteLabelPartners", { country: countryId, mitypename: type }, {
        headers: this.headers});
    }
    // register partner
        fetchCountryList() {
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.get<any>(environment.ApiUrl + `/getWorldCountries`, {
            headers: headers,
        });
    }
    
    registerEmployer(formValue: any): Observable<any> {
        const formData = new FormData();
        formData.append('name', formValue.name);
        formData.append('email', formValue.email);
        formData.append('phone_number', formValue.phone_number);
        formData.append('phone_country_code', formValue.phone_country_code);
        formData.append('password', formValue.password);
        formData.append('password_confirmation', formValue.password_confirmation);
        formData.append('country_id', formValue.country_id);
        formData.append('location_id', formValue.location_id);
        formData.append('company_name', formValue.company_name);
        formData.append('company_website', formValue.company_website);
        formData.append('company_designation', formValue.company_designation);
        const headers = new HttpHeaders({
            'Accept': 'application/json'
        });

        return this.http.post<any>(environment.ApiUrlEmployer + "/registeremployer", formData, {headers});
    }
    
    sendEmailOTP(email: any,name: any,mobile: any): Observable<any> {
        const formData = new FormData();
        formData.append('email', email);
        formData.append('name', name);
        formData.append('mobile', mobile);
        const headers = new HttpHeaders({
            'Accept': 'application/json'
        });

        return this.http.post<any>(environment.ApiUrlEmployer + "/sendemailotp", formData, {headers});
    }
    verifyEmailOTP(formValue: any): Observable<any> {
        const formData = new FormData();
        formData.append('full_name', formValue.full_name);
        formData.append('email', formValue.email);
        formData.append('otp', formValue.otp);

        const headers = new HttpHeaders({
            'Accept': 'application/json'
        });

        return this.http.post<any>(environment.ApiUrlEmployer + "/verifyemailotp", formData, {headers});
    }
    fetchRegionByCountryId(countryId: any): Observable<any> {
        return this.http.get<any>(`${environment.ApiUrl}/getworldcitiesstates`, {
            params: { country_id: countryId.toString() }
        });
    }
}