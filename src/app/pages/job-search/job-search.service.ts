import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs/internal/Observable";

@Injectable({
  providedIn: 'root'
})
export class JobSearchService {
  private apiUrl = 'https://api.adzuna.com/v1/api/jobs';
  private appId = '5be5ff77'; // Replace with your App ID
  private appKey = '8c20f3e26f4df3630e037182b7b31f42'; // Replace with your App Key

  constructor(private http: HttpClient) { }

  searchJobs(query: any): Observable<any> {
    console.log(query);
    
    let params = new HttpParams()
      .set('app_id', this.appId)
      .set('app_key', this.appKey)
      .set('what', query.what)
      .set('where', query.where)
      .set('results_per_page', query.result_per_page)
    return this.http.get(`${this.apiUrl}/${query.location}/search/${query.page}`, { params });
  }

  fetchCategory(query: any): Observable<any> {
    console.log(query);
    
    let params = new HttpParams()
      .set('app_id', this.appId)
      .set('app_key', this.appKey)
    return this.http.get(`${this.apiUrl}/${query.location}/categories`, { params });
  }
}
