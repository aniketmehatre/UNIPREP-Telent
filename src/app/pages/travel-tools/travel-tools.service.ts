import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Currency } from 'src/app/@Models/currency.model';

@Injectable({
  providedIn: 'root'
})
export class TravelToolsService {

 headers = new HttpHeaders().set("Accept", "application/json");

  constructor(
    private http: HttpClient
  ) { }

  getCurrencies() {
    return this.http.post<Currency[]>(environment.ApiUrl + "/getcountryandcurrency", {
      headers: this.headers,
    });
  }

  getRecommendationforTravelCostEstimator(data:any) {
    return this.http.post<{response:string}>(environment.ApiUrl + "/careerplannercountrywisecurrency", data, {
      headers: this.headers,
    });
  }
}
