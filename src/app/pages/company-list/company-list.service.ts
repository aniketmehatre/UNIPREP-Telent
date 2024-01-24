import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "@env/environment";
import {ExportData} from "../../@Models/module.model";

@Injectable({
  providedIn: 'root'
})
export class CompanyListService {


  constructor(private http: HttpClient) { }

  getInvestorList(val: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/ListOfCompanies",val, {
      headers: headers,
    });
  }

  getMultiSelectData() {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/SelectBoxValues",{}, {
      headers: headers,
    });
  }

  export() {
    return this.http.post<ExportData>(environment.ApiUrl + '/ExportInvestors',{
    })
  }

}
