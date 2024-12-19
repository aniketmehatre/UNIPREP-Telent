import { Component, OnInit } from '@angular/core';
import { AssessmentService } from '../assessment.service';
import { ILearnChallengeModule, ILearnChallengeResponse, LeaderBoard } from 'src/app/@Models/ilearn-challenge.model';

@Component({
  selector: 'uni-ilearn-challenge',
  templateUrl: './ilearn-challenge.component.html',
  styleUrls: ['./ilearn-challenge.component.scss']
})
export class IlearnChallengeComponent implements OnInit {

  iLearnChallengeModuleList: ILearnChallengeModule[] = [];
  leaderBoardList: LeaderBoard[] = [];
  overallScore: number;

  constructor(
    private assessmentService: AssessmentService,
  ) { }

  ngOnInit(): void {
    this.getiLearnChallengeList();
  }


  getiLearnChallengeList() {
    this.assessmentService.getiLearnChallenges().subscribe({
      next: (response: ILearnChallengeResponse) => {
        this.leaderBoardList = response.leaderBoard;
        this.iLearnChallengeModuleList = response.userData;
        this.overallScore = response.overallScore;
      },
      error: (error: any) => {
      }
    });
  }
}
