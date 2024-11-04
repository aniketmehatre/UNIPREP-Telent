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

  getTests(category:any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/nationalexamtests", category, {
      headers: headers,
    });
  }

  getQuestions(category:any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/nationalexamquestions", category, {
      headers: headers,
    });
  }

  submitResult(data:any){
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/submitResults", data, {
      headers: headers,
    });
  }

}
