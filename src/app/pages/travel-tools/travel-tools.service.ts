import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {environment} from "@env/environment";

@Injectable({
  providedIn: 'root'
})
export class TravelToolsService {

  constructor(private http: HttpClient) { }

  getCountriesList(){
    const headers = new HttpHeaders().set("Accept", "application/json");
      return this.http.post<any>(environment.ApiUrl + "/AllCountries", {
          headers: headers,
      });
  }
}
