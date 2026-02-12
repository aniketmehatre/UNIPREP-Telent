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
export class CostOfLivingService {
  constructor(private http: HttpClient) {}
  inrRate: any;
  calculatePrices(cityDetails: any) {
    // const headers = new HttpHeaders().set("X-RapidApi-Key", "8221e7a6d4msh41f8f8c02735020p1c8dddjsn6fdf6667711d");
    const headers = new HttpHeaders().set(
      "X-RapidApi-Key",
      "8221e7a6d4msh41f8f8c02735020p1c8dddjsn6fdf6667711d",
    );
    if (cityDetails.city_name == null) {
      return this.http.get<CostOfLiving>(
        `https://cost-of-living-and-prices.p.rapidapi.com/prices?country_name=${cityDetails.country_name}`,
        { headers: headers },
      );
    }
    return this.http.get<CostOfLiving>(
      `https://cost-of-living-and-prices.p.rapidapi.com/prices?city_name=${cityDetails.city_name}&country_name=${cityDetails.country_name}`,
      { headers: headers },
    );
  }
  getCities() {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<City[]>(environment.ApiUrl + "/getcitywithflag", {
      headers: headers,
    });
  }
  currencyConvert(data: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<CurrencyConvert>(
      environment.ApiUrl + "/currencyConvert",
      data,
      { headers: headers },
    );
  }
  getItemIconsList() {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<GoodWithIcon[]>(
      environment.ApiUrl + "/getitemicons",
      { headers: headers },
    );
  }
}
