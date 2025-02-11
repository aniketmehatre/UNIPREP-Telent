import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "@env/environment";
@Injectable({
  providedIn: "root",
})
export class JobOfferComparisionService {
  constructor(private http: HttpClient) {}
  getemployeeBenefits() {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<any>(environment.ApiUrl + "/getemployeebenefits", {
      headers: headers,
    });
  }
  
  getemploymentType() {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<any>(environment.ApiUrl + "/getemploymenttypes", {
      headers: headers,
    });
  }
  gettravelOppertunities() {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<any>(environment.ApiUrl + "/gettraveloppurtunities", {
      headers: headers,
    });
  }
  getworkBenefits() {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<any>(environment.ApiUrl + "/getworkbenefits", {
      headers: headers,
    });
  }
  getworkHours() {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<any>(environment.ApiUrl + "/getworkhours", {
      headers: headers,
    });
  }
  getworkingDays() {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<any>(environment.ApiUrl + "/getworkingdays", {
      headers: headers,
    });
  }
  getavgsalarysavedresponse() {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<any>(
      environment.ApiUrl + "/getaveragesalarysavedresponse",
      {
        headers: headers,
      }
    );
  }
  saveResponseByJobrole(data: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(
      environment.ApiUrl + "/saveaveragesalaryresponse",
      data,
      {
        headers: headers,
      }
    );
  }
  getcomparisonResponse(data: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(
      environment.ApiUrl + "/getjoboffercomparison",
      data,
      {
        headers: headers,
      }
    );
  }
  saveInterviewQuestion(data: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(
      environment.ApiUrl + "/saveinterviewquestion",
      data,
      {
        headers: headers,
      }
    );
  }
}
