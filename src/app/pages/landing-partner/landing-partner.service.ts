import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from '@env/environment';

@Injectable({
    providedIn: 'root'
})
export class LandingPartnerServices {
    headers = new HttpHeaders().set("Accept", "application/json");

    constructor(private http: HttpClient) { }

    getCountryList() {
      return this.http.get<any>(environment.ApiUrl + "/courseCountries");
    }

    getUniversityList(countryId: number) {
      return this.http.post<any>(environment.ApiUrl + "/country",{country_id: countryId}, {
        headers: this.headers});
    }
}