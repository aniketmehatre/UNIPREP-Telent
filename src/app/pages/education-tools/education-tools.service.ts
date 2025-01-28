import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { CourseNavigator, EducatiionsRec } from 'src/app/@Models/course-navigator.model';

@Injectable({
  providedIn: 'root'
})
export class EducationToolsService {

  headers = new HttpHeaders().set("Accept", "application/json");

  constructor(
    private http: HttpClient
  ) { }

  getCurrentSpecializations() {
    return this.http.get<{ id: number, specialization_name: string }[]>(environment.ApiUrl + "/getcurrentspecialization", {
      headers: this.headers,
    });
  }
  getDegreeRecommadations(data: any) {
    return this.http.get<EducatiionsRec[]>(`${environment.ApiUrl}/getDegrees?spec_id=${data.spec_id}&edu_id=${data.edu_id}`, {
      headers: this.headers,
    });
  }

  getEduSavedRecommadations(data: any) {
    return this.http.post<any>(environment.ApiUrl + "/getEduSavedRecommadations", {
      headers: this.headers,
    });
  }

  getCountry() {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<any>(environment.ApiUrl + "/govtfundingCountry", {
      headers: headers,
    });
  }

  getPoliticiansListByCountry(data: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/getpoliticianslist", data, {
      headers: headers,
    });
  }

  getCourseQandA(degreeId: number, questionId?: number) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    let params = new HttpParams().set('degree_id', degreeId);
    if (questionId) {
      params = params.set('question_id', questionId);
    }
    return this.http.get<CourseNavigator[]>(`${environment.ApiUrl}/getCourseQandA`, {
      headers, params
    });
  }

  addCNUserQuestions(data: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<{ message: string, status: boolean }>(environment.ApiUrl + "/addCNUserQuestions", data, {
      headers: headers,
    });
  }

  getCNUserSavedQuestions() {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<CourseNavigator[]>(`${environment.ApiUrl}/getCNUserSavedQuestions`, {
      headers: headers,
    });
  }
}
