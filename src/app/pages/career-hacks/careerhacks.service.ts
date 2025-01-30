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
export class CareerJobHacksService {
  constructor(private http: HttpClient) {}

  getcareerjobhacks(reqdata: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(
      environment.ApiUrl + "/getcareerjobhacks",
      reqdata,
      { headers: headers }
    );
  }
  getcareerjobcountries() {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<any>(environment.ApiUrl + "/careerjobhackscountries", {
      headers: headers,
    });
  }
}
