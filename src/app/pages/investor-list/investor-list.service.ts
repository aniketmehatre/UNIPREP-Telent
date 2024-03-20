import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { environment } from "@env/environment";
import { ExportData } from "../../@Models/module.model";

@Injectable({
  providedIn: 'root'
})
export class InvestorListService {

  constructor(private http: HttpClient) { }

  getInvestorList(val: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/ListOfInvestors", val, {
      headers: headers,
    });
  }

  getMultiSelectData() {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/SelectBoxValues", {}, {
      headers: headers,
    });
  }

  export() {
    return this.http.post<ExportData>(environment.ApiUrl + '/ExportInvestors', {
    })
  }

  getHeadQuartersList(selectedValue: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/GetHeadQuartersbyCountry", { selectedCountry: selectedValue }, {
      headers: headers,
    });
  }
  bookmarkInvestorData(investor_id:any,user_id:any,fav:any){
    let params={
      investor_list_id:investor_id,
      user_id :user_id,
      updateFavourite:fav
        }
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/addinvestorlistfavourite", params, {
      headers: headers,
    });
  }
}
