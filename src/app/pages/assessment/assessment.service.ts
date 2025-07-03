import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { BehaviorSubject, Subject } from 'rxjs';
import { AssessmentQuiz, AssessmentResponse, StoreQuizResponse, UserquizResponseData } from 'src/app/@Models/assessment.model';
import { ILearnChallengeData, ILearnChallengeResponse, LeaderBoard } from 'src/app/@Models/ilearn-challenge.model';

@Injectable({
  providedIn: 'root'
})
export class AssessmentService {

  headers = new HttpHeaders().set("Accept", "application/json");
  iLearnChallenge = new BehaviorSubject<ILearnChallengeData>({ overAllParticipants: 0, currentPosition: 0, isILearn: false });
  iLearnChallengeData$ = this.iLearnChallenge.asObservable();
  sideMenuiLearnChallenge = new BehaviorSubject<boolean>(false);
  sideMenuiLearnChallengeData$ = this.sideMenuiLearnChallenge.asObservable();
  // after ai credit buy , the header ai credit count automatically refresh 
  private updateTrigger = new Subject<void>();
  updateRequested$ = this.updateTrigger.asObservable();

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


  getAssessmentQuizList(moduleId: string) {
    return this.http.get<AssessmentQuiz[]>(`${environment.ApiUrl}/getAssessmentQuiz?moduleId=${moduleId}`, {
      headers: this.headers,
    });
  }

  storeAssessmentQuizAns(data: any) {
    return this.http.post<StoreQuizResponse>(`${environment.ApiUrl}/storeAssessmentQuizAns`, data, {
      headers: this.headers,
    });
  }

  getReviewAssessmentQuizAns(moduleId: string) {
    return this.http.get<UserquizResponseData>(`${environment.ApiUrl}/reviewAssessmentQuizAns?moduleId=${moduleId}`, {
      headers: this.headers,
    });
  }

  getAssessmentParticipatingCount() {
    return this.http.get<{ cluster_count: number }>(environment.ApiUrl + "/clusterCount", {
      headers: this.headers,
    });
  }

  getLeaderBoardUsers(grpId: string) {
    return this.http.get<{ leaderBoard: LeaderBoard[] }>(`${environment.ApiUrl}/leaderBoardUsers?cluster_id=${grpId}`, {
      headers: this.headers,
    });
  }
  requestUpdate() {
    this.updateTrigger.next(); // 🔔 Emit update signal
  }
}
