import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {
  City,
  CostOfLiving,
  CurrencyConvert,
  GoodWithIcon,
} from "src/app/@Models/cost-of-living";
import { environment } from "@env/environment";

@Injectable({
  providedIn: "root",
})
export class GlobalEmploymentService {
  constructor(private http: HttpClient) {}

  getdata(reqdata: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(
      environment.ApiUrl + "/getglobalemploymentinsights",
      reqdata,
      { headers: headers }
    );
  }
  getcountrylists() {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<any>(environment.ApiUrl + "/globalemploymentinsightcountry", {
      headers: headers,
    });
  }
}
