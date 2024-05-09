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
  private dataLanguage = new BehaviorSubject<any>(this.getLanguageNameData() || null);
  dataLanguageName$ = this.dataLanguage.asObservable();

  private languageType = new BehaviorSubject<any>(this.getLanguageTypeData() || null);
  dataLanguageType$ = this.languageType.asObservable();

  constructor(private http: HttpClient) { }

  setLanguageData(data: any) {
    localStorage.setItem('languageId', data);
    this.dataSubject.next(data);
  }

  setDataLanguageName(data: any) {
    localStorage.setItem('languageName', data);
    this.dataLanguage.next(data);
  }

  setDataLanguageType(data: any) {
    localStorage.setItem('languageType', data);
    this.languageType.next(data);
  }


  private getDataFromStorage(): any {
    const data = localStorage.getItem('languageId');
    return data ? JSON.parse(data) : null;
  }

  private getLanguageNameData(): any {
    const data = localStorage.getItem('languageName');
    return data ? JSON.parse(data) : null;
  }

  private getLanguageTypeData(): any {
    const data = localStorage.getItem('languageType');
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

  getCategoryList(req: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/getlanguagesubmodule",  req, {
      headers: headers,
    });
  }

  getQuestionList() {
    let req = {
      languageid: 1,
      languagetype: 1
    }
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/getlanguagequestions",  req, {
      headers: headers,
    });
  }

}
