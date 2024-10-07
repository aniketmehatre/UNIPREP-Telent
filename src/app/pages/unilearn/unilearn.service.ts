import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "@env/environment";
import { learnModules, learnsubModules } from "./unilearn.model";

@Injectable({
  providedIn: "root",
})
export class UniLearnService {
  constructor(private http: HttpClient) {}
  getLearnModules() {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<learnModules>(environment.ApiUrl + "/getUnilearnModules", {
      headers: headers,
    });
  }
  getUniLearnsubModules(paramData:any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<learnsubModules>(environment.ApiUrl + "/getUnilearnSubmodules",paramData, {
      headers: headers,
    });
  }
}
