import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { EducatiionsRec } from 'src/app/@Models/course-navigator.model';

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

  getCourseQandA(degree_id: number) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<any>(`${environment.ApiUrl}/getCourseQandA?degree_id=${degree_id}`, {
      headers: headers,
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
    return this.http.get<any>(`${environment.ApiUrl}/getCNUserSavedQuestions`, {
      headers: headers,
    });
  }
}
