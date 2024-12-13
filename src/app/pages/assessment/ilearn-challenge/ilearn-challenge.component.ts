import { Component, OnInit } from '@angular/core';
import { AssessmentService } from '../assessment.service';
import { ILearnChallengeModule, ILearnChallengeResponse, LeaderBoard } from 'src/app/@Models/ilearn-challenge.model';
import { AuthService } from 'src/app/Auth/auth.service';

@Component({
  selector: 'uni-ilearn-challenge',
  templateUrl: './ilearn-challenge.component.html',
  styleUrls: ['./ilearn-challenge.component.scss']
})
export class IlearnChallengeComponent implements OnInit {

  iLearnChallengeModuleList: ILearnChallengeModule[] = [];
  leaderBoardList: LeaderBoard[] = [];
  currentPosition: string = '';
  currentScore: string = '0';
  currentPositionIndex: number = 0;
  isSkeletonVisible: boolean = true;

  constructor(
    private assessmentService: AssessmentService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.getiLearnChallengeList();
  }


  getiLearnChallengeList() {
    this.assessmentService.getiLearnChallenges().subscribe({
      next: (response: ILearnChallengeResponse) => {
        this.isSkeletonVisible = false;
        this.leaderBoardList = response.leaderBoard;
        this.iLearnChallengeModuleList = response.userData;
        let userIndex = this.leaderBoardList.findIndex(item => item.user_id == this.authService._user?.user_id);
        if (userIndex !== -1) {
          this.currentPositionIndex = userIndex;
          this.findUserPosition(userIndex + 1);
          this.currentScore = this.leaderBoardList[userIndex].total_score;
        }
      },
      error: (error: any) => {
        this.isSkeletonVisible = false;
      }
    });
  }

  findUserPosition(position: number) {
    const suffix = (position % 100 >= 11 && position % 100 <= 13) ? 'th' : ['th', 'st', 'nd', 'rd'][Math.min(position % 10, 4)];
    this.currentPosition = position + suffix;
  }
}
