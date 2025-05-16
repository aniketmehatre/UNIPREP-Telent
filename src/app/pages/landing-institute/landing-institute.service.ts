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
      return this.http.get<any>(environment.ApiUrl + "/country?getHomeCountry=2");
    }

    getUniversityList(countryId: number) {
      return this.http.post<any>(environment.ApiUrl + "/country",{country_id: countryId}, {
        headers: this.headers});
    }
}