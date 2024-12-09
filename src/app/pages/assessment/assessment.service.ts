import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Assessment } from 'src/app/@Models/assessment.model';

@Injectable({
  providedIn: 'root'
})
export class AssessmentService {

  headers = new HttpHeaders().set("Accept", "application/json");

  constructor(
    private http: HttpClient
  ) { }

  getAssessments() {
    return this.http.get<Assessment[]>(environment.ApiUrl + "/listOfModulesLists", {
      headers: this.headers,
    });
  }
}
