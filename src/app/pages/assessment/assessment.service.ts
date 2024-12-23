import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
<<<<<<< HEAD
import { Observable } from 'rxjs/internal/Observable';
import { Assessment } from 'src/app/@Models/assessment.model';
=======
import { AssessmentResponse } from 'src/app/@Models/assessment.model';
>>>>>>> 788e7fa2a81e10c6a7104e8450a9e8b3d1b249b0
import { ILearnChallengeResponse } from 'src/app/@Models/ilearn-challenge.model';

@Injectable({
  providedIn: 'root'
})
export class AssessmentService {

  headers = new HttpHeaders().set("Accept", "application/json");

  constructor(
    private http: HttpClient
  ) { }

<<<<<<< HEAD
  getAssessments() : Observable<Assessment>{
    return this.http.get<Assessment>(environment.ApiUrl + "/listOfModulesLists", {
=======
  getAssessments() {
    return this.http.get<AssessmentResponse>(environment.ApiUrl + "/listOfModulesLists", {
>>>>>>> 788e7fa2a81e10c6a7104e8450a9e8b3d1b249b0
      headers: this.headers,
    });
  }

  getiLearnChallenges() {
    return this.http.get<ILearnChallengeResponse>(environment.ApiUrl + "/iLearnData", {
      headers: this.headers,
    });
  }
}
