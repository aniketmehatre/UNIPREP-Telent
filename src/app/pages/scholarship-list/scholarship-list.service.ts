import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class ScholarshipListService {

  constructor(
    private http:HttpClient
  ) { }

  getScholarshipList(val: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/getscholarshiplist",val, {
      headers: headers,
    });
  }
  getScholarshipCountry(scholarship_country:number){
    let params = new HttpParams();
    params=params.append("scholarship_country",scholarship_country)
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<any>(environment.ApiUrl + "/country", {
        headers: headers,params:params
    });
  }
  getStudyLevel(){
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<any>(environment.ApiUrl + "/getstudylevel", {
        headers: headers,
    });
  }
  
  getRegion() {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<any>(`${environment.ApiUrl}/GetRegions`,{headers: headers});
  }
  getUniversity(countryId:number){
    let params = new HttpParams();
    params=params.append("country_id",countryId);
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<any>(environment.ApiUrl +"/getuniversity",{headers: headers,params:params});
  }

}
