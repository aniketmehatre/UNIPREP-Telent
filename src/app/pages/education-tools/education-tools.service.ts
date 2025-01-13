import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class EducationToolsService {

  headers = new HttpHeaders().set("Accept", "application/json");

  constructor(
    private http: HttpClient
  ) { }

  getEduRecommadations(data:any) {
    return this.http.post<any>(environment.ApiUrl + "/getEduRecommadations", {
      headers: this.headers,
    });
  }

  getEduSavedRecommadations(data:any) {
    return this.http.post<any>(environment.ApiUrl + "/getEduSavedRecommadations", {
      headers: this.headers,
    });
  }
}
