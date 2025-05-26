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
}