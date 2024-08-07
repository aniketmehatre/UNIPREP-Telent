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

  bookmarkCourseData(courseId:any,user_id:any,fav:any){
    let params={ 
      course_list_id:courseId,
      user_id :user_id,
      updateFavourite:fav
        }
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/addcourselistfavourite", params, {
      headers: headers,
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

  downloadResume(){
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/downloadResume", {
      headers: headers,
    });
  }

  getTemplate(): Observable<string> {
    // return this.http.get('templates/resumetemplate.html', { responseType: 'text' });
    return this.http.get('/templates/resumetemplate.html', { responseType: 'text' });
  }
}
