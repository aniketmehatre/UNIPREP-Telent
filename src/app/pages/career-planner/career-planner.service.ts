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

  storeCareerPlans(data: any){
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/StoreCareerPlanners", { data },{
      headers: headers,
    });
  }

  checkCareerPlanExist(){
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/CareerPlanExist",{
      headers: headers,
    });
  }

  loadListPageData(data: any){
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/ListPageDataLoading", data ,{
      headers: headers,
    });
  }

  resetRecommendation(){
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/ResetRecommendation",{
      headers: headers,
    });
  }
}
