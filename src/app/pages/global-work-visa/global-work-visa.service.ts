import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "@env/environment";

@Injectable({
  providedIn: "root",
})
export class GlobalworkvisaService {
  headers = new HttpHeaders().set("Accept", "application/json");

  constructor(private http: HttpClient) {}

  getNationalityList() {
    return this.http.get<any[]>(
      environment.ApiUrl + "/getglobalworkvisanationalities",
      {
        headers: this.headers,
      }
    );
  }
  getVisaCountriesList() {
    return this.http.get<any[]>(
      environment.ApiUrl + "/getglobalworkvisacountries",
      {
        headers: this.headers,
      }
    );
  }
  getVisaRecommendationsList(data: any) {
    return this.http.post<any>(
      environment.ApiUrl + "/getglobalworkvisarecommendations",
      data,
      {
        headers: this.headers,
      }
    );
  }

  getGlobalworkvisaQuestionCategories(data: any) {
    return this.http.post<any>(
      environment.ApiUrl + "/getglobalworkvisaquestioncategories",
      data,
      {
        headers: this.headers,
      }
    );
  }

  getGlobalworkvisaQA(data: any) {
    return this.http.post<any>(
      environment.ApiUrl + "/getglobalworkvisaqa",
      data,
      {
        headers: this.headers,
      }
    );
  }
}
