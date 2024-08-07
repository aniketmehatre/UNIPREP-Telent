import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "@env/environment";
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
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

  downloadResume(data: any){
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/downloadResume", data ,{
      headers: headers,
    });
  }
  downloadCoverletter(data: any){
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/generatecoverletter", data ,{
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

  private dataSubject = new BehaviorSubject<boolean>(true);
  data$ = this.dataSubject.asObservable();

  setData(data: boolean) {
    this.dataSubject.next(data);
  }

  getAlreadyCreatedResumes(){
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/resumeHistories",{
      headers: headers,
    });
  }
}
