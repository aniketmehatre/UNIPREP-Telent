import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class InterviewJobrolesService {

  constructor(private http: HttpClient) { }

  getJobRoles(data: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/serachJobrole", data ,{
      headers: headers,
    });
  }

  getIntervireQuestions(data: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/questionByJobrole", data ,{
      headers: headers,
    });
  }

}
