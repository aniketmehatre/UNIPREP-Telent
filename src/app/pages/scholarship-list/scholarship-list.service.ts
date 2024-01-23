import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  getScholarshipCountry(){
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<any>(environment.ApiUrl + "/country", {
        headers: headers,
    });
  }
  getStudyLevel(){
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<any>(environment.ApiUrl + "/getstudylevel", {
        headers: headers,
    });
  }
  
  getRegion() {
    return this.http.get<any>(`${environment.ApiUrl}/GetRegions`);
  }

}
