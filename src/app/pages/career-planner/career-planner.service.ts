import { Injectable } from '@angular/core';
import { environment } from "@env/environment";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class CareerPlannerService {

  constructor(private http:HttpClient) { }

  loadSelectBoxValues(){
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/CareerPlannerSelectBox", {
      headers: headers,
    });
  }

  storeCareerPlans(){
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/StoreCareerPlanners", {
      headers: headers,
    });
  }
}
