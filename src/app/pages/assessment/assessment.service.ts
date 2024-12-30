import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { BehaviorSubject } from 'rxjs';
import { AssessmentResponse } from 'src/app/@Models/assessment.model';
import { ILearnChallengeData, ILearnChallengeResponse } from 'src/app/@Models/ilearn-challenge.model';

@Injectable({
  providedIn: 'root'
})
export class AssessmentService {

  headers = new HttpHeaders().set("Accept", "application/json");
  iLearnChallenge = new BehaviorSubject<ILearnChallengeData>({ overAllParticipants: 0, currentPosition: 0, isILearn: false });
  iLearnChallengeData$ = this.iLearnChallenge.asObservable();

  constructor(
    private http: HttpClient
  ) { }

  getAssessments() {
    return this.http.get<AssessmentResponse>(environment.ApiUrl + "/listOfModulesLists", {
      headers: this.headers,
    });
  }

  getiLearnChallenges() {
    return this.http.get<ILearnChallengeResponse>(environment.ApiUrl + "/iLearnData", {
      headers: this.headers,
    });
  }

  getAssessmentsQuiz(data:any) {
    return this.http.post<any>(environment.ApiUrl + "/quizquestions", data, {
      headers: this.headers,
    });
  }
}
