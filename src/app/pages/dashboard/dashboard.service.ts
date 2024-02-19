import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "@env/environment";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class DashboardService {
  constructor(private http: HttpClient) {}

  getDashboardCounts() {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<any>(
      environment.ApiUrl +
        "/getdashboardcount?" +
        "getcountry_id=" +
        Number(localStorage.getItem("countryId")),
      {
        headers: headers,
      }
    );
  }

  getReadProgression(val: any): Observable<any> {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(
      environment.ApiUrl + "/getreadprogression",
      val,
      { headers: headers }
    );
  }

  getQuizProgression(val: any): Observable<any> {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(
      environment.ApiUrl + "/getquizprogression",
      val,
      { headers: headers }
    );
  }

  getCountries() {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<any>(environment.ApiUrl + "/country", {
      headers: headers,
    });
  }

  searchKeyword(val: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/searchkeyword", val, {
      headers: headers,
    });
  }

  getModuleReadProgression(val: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(
      environment.ApiUrl + "/getmodulereadprogression",
      val,
      { headers: headers }
    );
  }

  getModuleQuizProgression(val: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(
      environment.ApiUrl + "/getmodulequizprogression",
      val,
      { headers: headers }
    );
  }

  countryList() {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get(environment.ApiUrl + "/country", { headers: headers });
  }

  getTrustedPartners() {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post(
      environment.ApiUrl + "/GetTrusterPatners",
      {},
      { headers: headers }
    );
  }

  getUserSubscribtionCount() {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(
      environment.ApiUrl + "/gettimeleft",
      {},
      { headers: headers }
    );
  }

  getContineTrial(data: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(
      environment.ApiUrl + "/freetrailcontinue",
      data.phone ? data : null,
      {
        headers: headers,
      }
    );
  }
}
