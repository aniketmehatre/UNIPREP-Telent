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
export class SalaryHacksService {
  constructor(private http: HttpClient) {}

  getSalaryegotitationhacks(reqdata: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(
      environment.ApiUrl + "/getsalarynegotitationhacks",
      reqdata,
      { headers: headers }
    );
  }
  getSalarynegotitationhackcountries() {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<any>(environment.ApiUrl + "/salarynegotitationhackscountries", {
      headers: headers,
    });
  }
}
