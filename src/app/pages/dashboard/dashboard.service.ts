import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "@env/environment";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

constructor(private http: HttpClient,) { }



  getDashboardCounts(){
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<any>(environment.ApiUrl + "/getdashboardcount", {
      headers: headers,
    });
  }
  getReadProgression(val: any): Observable<any>{
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/getreadprogression",val, {'headers': headers});
  }
  getQuizProgression(val: any): Observable<any>{
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/getquizprogression",val, {'headers': headers});
  }


}
