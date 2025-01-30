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
export class FortuneCompaniesService {
  constructor(private http: HttpClient) {}

  getfortunecompanyquestions(reqdata: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(
      environment.ApiUrl + "/getfortunecompanyquestion",
      reqdata,
      { headers: headers }
    );
  }
  getfortunecompanyanswer(reqdata: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(
      environment.ApiUrl + "/getfortunecompanyanswer",
      reqdata,
      { headers: headers }
    );
  }
  getfortunecompanieslists(reqdata: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/getfortunecompanylist", {
      headers: headers,
    });
  }
}
