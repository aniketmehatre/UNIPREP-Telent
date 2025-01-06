import { Component, OnDestroy, OnInit } from '@angular/core';
import { AssessmentService } from '../assessment.service';
import { ILearnChallengeModule, ILearnChallengeResponse, LeaderBoard } from 'src/app/@Models/ilearn-challenge.model';
import { AuthService } from 'src/app/Auth/auth.service';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'uni-ilearn-challenge',
  templateUrl: './ilearn-challenge.component.html',
  styleUrls: ['./ilearn-challenge.component.scss']
})
export class IlearnChallengeComponent implements OnInit, OnDestroy {

  iLearnChallengeModuleList: ILearnChallengeModule[] = [];
  leaderBoardList: LeaderBoard[] = [];
  overallScore: number;
  currentPosition: string = '';
  currentScore: string = '0';
  currentPositionIndex: number = -1;
  isSkeletonVisible: boolean = true;
  instructionTitle: string = '';
  isInstruction: boolean = false;
  pdfURL: any;
  contestRulePdfURL: any;

  constructor(
    private assessmentService: AssessmentService,
    private authService: AuthService,
    private router: Router,
    private sanitizer: DomSanitizer
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
        this.overallScore = response.overallScore;
        this.contestRulePdfURL = this.sanitizer.bypassSecurityTrustResourceUrl('https://api.uniprep.ai/uniprepapi/storage/app/public/Unilearn//GenralInfo/IELTSAcademic/Test_Format_and_Structure_.pdf');
        let userIndex = this.leaderBoardList.findIndex(item => item.user_id == this.authService._user?.user_id);
        if (userIndex !== -1) {
          this.currentPositionIndex = userIndex;
          this.findUserPosition(userIndex + 1);
          this.currentScore = this.leaderBoardList[userIndex].total_score;
          this.assessmentService.iLearnChallenge.next({ overAllParticipants: this.leaderBoardList.length, currentPosition: userIndex + 1, isILearn: true });
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

  navigateAssignedmodule(data: ILearnChallengeModule) {
    switch (data.module_name) {
      case 'Learning Hub':
        localStorage.setItem('learningHubMainModuleName', data.category_name);
        this.router.navigate(['/pages/modules/learning-hub/question-list', data.submodule_id]);
        break;
      case 'Skill Mastery':
        this.router.navigate(['/pages/modules/skill-mastery/question-list', data.submodule_id]);
        break;
      case 'Pshychometric Test':
        localStorage.setItem('MainTitleCareerTool', data.category_name)
        this.router.navigate(['/pages/job-tool/quiz/psychometric/list', data.category_id]);
        break;
      case 'CV Builder':
        this.router.navigate(['/pages/job-tool/cv-builder']);
        break;
      case 'Cover Letter Builder':
        this.router.navigate(['/pages/job-tool/coverletter-builder']);
        break;
      case 'Cost of Living':
        this.router.navigate(['/pages/assessment/quiz', data.module_id]);
        break;
      case 'Global Salary Converter':
        this.router.navigate(['/pages/assessment/quiz', data.module_id]);
        break;
      case 'Employer Test':
        this.router.navigate(['/pages/language-hub/levels', data.submodule_id]);
        break;
      case 'Language Hub':
        this.router.navigate(['/pages/language-hub/levels', data.submodule_id]);
        break;
    }
  }

  onClickGuide(data: ILearnChallengeModule) {
    this.isInstruction = true;
    this.instructionTitle = data.submodule_name;
    this.pdfURL = this.sanitizer.bypassSecurityTrustResourceUrl(data.instruction_guide);
  }

  onClickContestRule() {
    this.isInstruction = true;
    this.instructionTitle = 'Contest Rules';
    this.pdfURL = this.contestRulePdfURL;
  }

  goBack() {
    this.isInstruction = false;
  }

  ngOnDestroy() {
    this.assessmentService.iLearnChallenge.next({ overAllParticipants: 0, currentPosition: 0, isILearn: false });
  }
}
