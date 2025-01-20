import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "@env/environment";
@Injectable({
  providedIn: "root",
})
export class AveragesalaryestimatorService {
  constructor(private http: HttpClient) {}
  getJobPreferences() {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<any>(environment.ApiUrl + "/getjobpreferences", {
      headers: headers,
    });
  }
  getWorkplacetype() {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<any>(environment.ApiUrl + "/getworkplacetypes", {
      headers: headers,
    });
  }
  getWorkmodetype() {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<any>(environment.ApiUrl + "/getworkplacetypes", {
      headers: headers,
    });
  }getJobRoles() {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/serachJobrole", {
      headers: headers,
    });
  }
  getestimates(recommendData:any){
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/getaveragesalaryestimates",recommendData, {
      headers: headers,
    });
  }
  getCities() {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<any>(environment.ApiUrl + "/getcities", {
      headers: headers,
    });
  }
  getCurrencies() {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/getcountryandcurrency", {
      headers: headers,
    });
  }
  getavgsalarysavedresponse() {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<any>(environment.ApiUrl + "/getaveragesalarysavedresponse", {
      headers: headers,
    });
  }
  saveResponseByJobrole(data: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/saveaveragesalaryresponse", data ,{
      headers: headers,
    });
  }
  getcustomizedResponse(data: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/getcustomizedresponse", data ,{
      headers: headers,
    });
  }
  saveInterviewQuestion(data: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/saveinterviewquestion", data ,{
      headers: headers,
    });
  }
}
