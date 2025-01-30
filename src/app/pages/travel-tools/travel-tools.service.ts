import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { ChatGPTResponse } from 'src/app/@Models/chat-gpt.model';
import { Countries } from 'src/app/@Models/country.model';
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
    return this.http.post<Countries[]>(environment.ApiUrl + "/AllCountries", {
      headers: this.headers,
    });
  }

  getTripList(type: string) {
    return this.http.get<ChatGPTResponse>(environment.ApiUrl + `/userSavedResponse?mode=${type}`, {
      headers: this.headers,
    });
  }

  getStravelGlossary(val: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/travelGlossaryList", val, {
      headers: headers,
    });
  }

  getVisaRecommendations(data: any) {
    return this.http.post<any>(environment.ApiUrl + "/getVisaRecom", data, {
      headers: this.headers,
    });
  }

  getVisaCategoryList(visaId: number, questionId?: number) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    let params = new HttpParams().set('visa_id', visaId);
    if (questionId) {
      params = params.set('question_id', questionId);
    }
    return this.http.get<any[]>(`${environment.ApiUrl}/getVisaCategories`, {
      headers, params
    });
  }
}
