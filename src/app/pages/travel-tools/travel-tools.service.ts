import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { ChatGPTResponse } from 'src/app/@Models/chat-gpt.model';
import { CountryandCurrency } from 'src/app/@Models/currency.model';

@Injectable({
  providedIn: 'root'
})
export class TravelToolsService {

  headers = new HttpHeaders().set("Accept", "application/json");

  constructor(
    private http: HttpClient
  ) { }

  getCurrencies() {
    return this.http.post<CountryandCurrency[]>(environment.ApiUrl + "/getcountryandcurrency", {
      headers: this.headers,
    });
  }

  getChatgptRecommendations(data: any) {
    return this.http.post<{ response: string }>(environment.ApiUrl + "/getIntegratedRecom", data, {
      headers: this.headers,
    });
  }

  getCountriesList() {
    return this.http.post<any>(environment.ApiUrl + "/AllCountries", {
      headers: this.headers,
    });
  }

  getTripList(type:string) {
    return this.http.get<ChatGPTResponse>(environment.ApiUrl + `/userSavedResponse?mode=${type}`, {
      headers: this.headers,
    });
  }
}
