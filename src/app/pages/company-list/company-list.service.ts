import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {environment} from "@env/environment";
import {ExportData} from "../../@Models/module.model";

@Injectable({
  providedIn: 'root'
})
export class CompanyListService {


  constructor(private http: HttpClient) { }

  getCompanyList(val: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/ListOfCompanies",val, {
      headers: headers,
    });
  }

  getMultiSelectData() {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<any>(environment.ApiUrl + "/CompanySelectValues", {
      headers: headers,
    });
  }

  export() {
    return this.http.post<ExportData>(environment.ApiUrl + '/ExportInvestors',{
    })
  }

  getHeadQuartersList(SelectedCountries: any){
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/GetHeadQuartersForCompany",{selectedCountry: SelectedCountries}, {
      headers: headers,
    });
  }
  bookmarkCompanyData(comapany_id:any,user_id:any,fav:any){
    let params={
      company_list_id:comapany_id,
      user_id :user_id,
      updateFavourite:fav
        }
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/addcompanylistfavourite", params, {
      headers: headers,
    });
  }

  exportSelectedData(data: any){
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/BuyCreditexportData", data, {
      headers: headers,
    });
  }

  storeRecommendation(data: any){
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/storeCompanyRec", data, {
      headers: headers,
    });
  }

  resetRecommendation(){
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/resetCompanyRec", {
      headers: headers,
    });
  }

  getStoredRecommendation(){
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/getCompanyRec", {
      headers: headers,
    });
  }
}
