import { Injectable } from '@angular/core';
import { environment } from "@env/environment";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import {Observable} from "rxjs/internal/Observable";

@Injectable({
  providedIn: 'root'
})
export class CareerGrowthService {

  private jsonUrl = 'uniprep-assets/currency.json';

  constructor(private http:HttpClient) { }

  JobRoles(data:any){
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/serachJobrole",data,{
      headers: headers,
    });
  }

  GetProgressionDetails(data:any){
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/getjobprogression",data,{
      headers: headers,
    });
  }

  getCountries(){
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<any>(environment.ApiUrl + "/CompanySelectValues",{
      headers: headers,
    });
  }
}
