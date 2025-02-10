import { Component, OnInit } from '@angular/core';
import { AssessmentService } from '../assessment.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserquizResponse } from 'src/app/@Models/assessment.model';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { DialogModule } from 'primeng/dialog';
import { SkeletonModule } from 'primeng/skeleton';
import { TooltipModule } from 'primeng/tooltip';
import { RadioButtonModule } from 'primeng/radiobutton';
@Component({
    selector: 'uni-assessment-quiz-review',
    templateUrl: './assessment-quiz-review.component.html',
    styleUrls: ['./assessment-quiz-review.component.scss'],
    standalone: true,
    imports: [CommonModule, TableModule, ButtonModule, SelectModule, DialogModule, SkeletonModule, TooltipModule, RadioButtonModule]
})
export class AssessmentQuizReviewComponent implements OnInit {


  constructor(private assessmentService: AssessmentService, private route: ActivatedRoute, private router: Router) { }

  questions: UserquizResponse[] = [];
  selectedValue: any;
  page: number = 0;
  activeQuestion: string;
  activeOptOne: string;
  activeOptTwo: string;
  activeOptThree: string;
  activeOptFour: string;
  answer: number;
  moduleId: string = '';
  title: string = '';
  quizcount: number = 0;

  ngOnInit(): void {
    this.moduleId = this.route.snapshot.paramMap.get("moduleId") || '';
    if (this.moduleId) {
      this.title = this.moduleId === '21' ? 'Global Salary Converter' : 'Cost of Living';
      this.getReviewAssessmentQuizAns();
    }
  }

  getReviewAssessmentQuizAns() {
    this.assessmentService.getReviewAssessmentQuizAns(this.moduleId).subscribe(response => {
      this.questions = response.userquiz;
      this.activeQuestion = this.questions[this.page].question;
      this.activeOptOne = this.questions[this.page].option1;
      this.activeOptTwo = this.questions[this.page].option2;
      this.activeOptThree = this.questions[this.page].option3;
      this.activeOptFour = this.questions[this.page].option4;
      this.selectedValue = this.questions[this.page].useranswer;
      this.answer = this.questions[this.page].answer;
      this.quizcount = this.questions.length;
    });
  }

  nextQues() {
    if (this.page != 4) {
      this.page = this.page + 1;
      this.activeQuestion = this.questions[this.page].question;
      this.activeOptOne = this.questions[this.page].option1;
      this.activeOptTwo = this.questions[this.page].option2;
      this.activeOptThree = this.questions[this.page].option3;
      this.activeOptFour = this.questions[this.page].option4;
      this.selectedValue = this.questions[this.page].useranswer;
      this.answer = this.questions[this.page].answer;
    }
  }

  prevQues() {
    if (this.page != 0) {
      this.page = this.page - 1;
      this.activeQuestion = this.questions[this.page].question;
      this.activeOptOne = this.questions[this.page].option1;
      this.activeOptTwo = this.questions[this.page].option2;
      this.activeOptThree = this.questions[this.page].option3;
      this.activeOptFour = this.questions[this.page].option4;
      this.selectedValue = this.questions[this.page].useranswer;
      this.answer = this.questions[this.page].answer;
    }
  }
}