import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "@env/environment";

@Injectable({
  providedIn: 'root'
})
export class CourseListService {

  constructor(private http: HttpClient) { }

  getListOfCourses(data: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/CourseList" ,data,{
      headers: headers,
    });
  }
}
