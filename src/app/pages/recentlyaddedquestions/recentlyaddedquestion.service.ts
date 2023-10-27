import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecentlyaddedquestionService {

  constructor(private http: HttpClient,) { }
  getRecentlyAddedQuestions(req: any, apiName: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + `/${apiName}`,req, {
        headers: headers,
    });
  }
}
