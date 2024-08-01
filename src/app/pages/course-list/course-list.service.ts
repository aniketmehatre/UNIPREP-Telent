import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "@env/environment";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CourseListService {

  constructor(private http: HttpClient) { }
  headers:any = new HttpHeaders().set("Accept", "application/json");

  getListOfCourses(data: any) {
    // const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/CourseList" ,data,{
      headers: this.headers,
    });
  }

  loadDropdownValues() {
    return this.http.post<any>(environment.ApiUrl + "/CourseListSelectBox",{
      headers: this.headers,
    });
  }

  exportSelectedData(data: any){
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/BuyCreditexportData", data, {
      headers: headers,
    });
  }

  downloadResume(data: any){
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/downloadResume", data ,{
      headers: headers,
    });
  }

  getTemplate(): Observable<string> {
    // return this.http.get('templates/resumetemplate.html', { responseType: 'text' });
    return this.http.get('/templates/resumetemplate.html', { responseType: 'text' });
  }
  getcoverletterdummy(){
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<any>(environment.ApiUrl + "/samplecoverletter",{
      headers: headers,
    });
  }
}
