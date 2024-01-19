import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "@env/environment";

@Injectable({
  providedIn: 'root'
})
export class InvestorListService {

  constructor(private http: HttpClient) { }

  getInvestorList(val: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/ListOfInvestors",val, {
      headers: headers,
    });
  }

  //http://40.80.95.32/uniprepapi/public/api/SelectBoxValues
  getMultiSelectData() {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/SelectBoxValues",{}, {
      headers: headers,
    });
  }

}
