import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { NationalExamResult } from 'src/app/@Models/nationl-exams.model';

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
  
  GetResult(data:any){
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<NationalExamResult>(environment.ApiUrl + "/showresult", data, {
      headers: headers,
    });
  }

  showResult(data:any){
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/reviewresult", data, {
      headers: headers,
    });
  }

}
