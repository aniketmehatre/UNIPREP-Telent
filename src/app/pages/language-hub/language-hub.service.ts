import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "@env/environment";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LanguageHubService {

  private dataSubject = new BehaviorSubject<any>(this.getDataFromStorage() || null);
  data$ = this.dataSubject.asObservable();
  constructor(private http: HttpClient) { }

  setLanguageData(data: any) {
    localStorage.setItem('languageId', data);
    this.dataSubject.next(data);
  }

  private getDataFromStorage(): any {
    const data = localStorage.getItem('languageId');
    return data ? JSON.parse(data) : null;
  }

  // language listing
  getLanguageList() {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/getlanguages", {}, {
      headers: headers,
    });
  }

  getLanguageTypeList() {
    let req = {
      type_id: 1
    }
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/getlanguagetype",  req, {
      headers: headers,
    });
  }

  getCategoryList() {
    let req = {
      languageid: 1,
      languagetype: 1
    }
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/getlanguagesubmodule",  req, {
      headers: headers,
    });
  }

}
