import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs/internal/Observable';
import { Assessment } from 'src/app/@Models/assessment.model';
import { ILearnChallengeResponse } from 'src/app/@Models/ilearn-challenge.model';

@Injectable({
  providedIn: 'root'
})
export class AssessmentService {

  headers = new HttpHeaders().set("Accept", "application/json");

  constructor(
    private http: HttpClient
  ) { }

  getAssessments() : Observable<Assessment>{
    return this.http.get<Assessment>(environment.ApiUrl + "/listOfModulesLists", {
      headers: this.headers,
    });
  }

  getiLearnChallenges() {
    return this.http.get<ILearnChallengeResponse>(environment.ApiUrl + "/iLearnData", {
      headers: this.headers,
    });
  }
}
