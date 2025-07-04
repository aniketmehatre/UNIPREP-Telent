import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
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
            headers: this.headers
        });
    }
    // register partner

    registerPartner(data: any): Observable<any> {
        const headers = new HttpHeaders({
            'Accept': 'application/json'
        });
        return this.http.post<any>(environment.ApiUrl + "/partnerregister", data, { headers });
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