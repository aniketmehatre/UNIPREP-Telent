import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class NationalExamService {

  constructor(private http: HttpClient) { }

  getCategories() {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/nationalexamcategories",{
      headers: headers,
    });
  }

  getTests() {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/nationalexamtests",{
      headers: headers,
    });
  }

}
