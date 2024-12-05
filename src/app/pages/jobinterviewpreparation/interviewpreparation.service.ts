import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "@env/environment";
@Injectable({
  providedIn: "root",
})
export class InterviewPreparationService {
  constructor(private http: HttpClient) {}
  getJobPreferences() {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<any>(environment.ApiUrl + "/getjobpreferences", {
      headers: headers,
    });
  }
  getsoftSkills() {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<any>(environment.ApiUrl + "/getsoftskills", {
      headers: headers,
    });
  }
  gethardSkills(jobroleid:any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/gettechnicalskills",jobroleid,{
        headers: headers,
      });
  }getJobExperience() {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<any>(environment.ApiUrl + "/getjobexperiences", {
      headers: headers,
    });
  }
  getJoiningReasons() {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<any>(environment.ApiUrl + "/getjoiningreasons", {
      headers: headers,
    });
  }
  getJobRoles() {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/serachJobrole", {
      headers: headers,
    });
  }
  getquestionByJobrole(data: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/questionByJobrole", data ,{
      headers: headers,
    });
  }
  getsavedquestionByJobrole(data: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/getsavedinterviewquestions", data ,{
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
