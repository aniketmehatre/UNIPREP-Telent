import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Cities, CostOfLiving } from "src/app/@Models/cost-of-living";
import { environment } from "@env/environment";

@Injectable({
    providedIn: "root",
})
export class CostOfLivingService {
    constructor(private http: HttpClient) { }
     
    calculatePrices(cityDetails:any) {
        const headers = new HttpHeaders().set("X-RapidApi-Key","09dff7af89msh193627b79d4f967p12d174jsn905ad1176841");
        return this.http.get<CostOfLiving>(
            `https://cost-of-living-and-prices.p.rapidapi.com/prices?city_name=${cityDetails.city_name}&country_name=${cityDetails.country_name}`, { headers: headers }
        );
    }
    getCities() {
        const headers = new HttpHeaders().set("X-RapidApi-Key","09dff7af89msh193627b79d4f967p12d174jsn905ad1176841");
        return this.http.get<Cities>(
            `https://cost-of-living-and-prices.p.rapidapi.com/cities`, { headers: headers }
        );
    }
    currencyConvert(data:any) {
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.post<any>(environment.ApiUrl + "/currencyConvert",data,{ headers: headers });
    }
  
}
