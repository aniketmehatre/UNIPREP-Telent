import { Component, OnInit } from '@angular/core';
import { AssessmentService } from '../assessment.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'uni-assessment-quiz-review',
  templateUrl: './assessment-quiz-review.component.html',
  styleUrls: ['./assessment-quiz-review.component.scss']
})
export class AssessmentQuizReviewComponent implements OnInit {

  constructor(private assessmentService: AssessmentService, private route: ActivatedRoute, private router: Router) { }

  questions: any;
  selectedValue: any;
  progressvalue: number = 0;

  question_id: any;
  results: any = [];
  showError: boolean = false;
  page: any = 0;
  activeQuestion: string;
  activeQuestionId: number
  activeOptOne: string;
  activeOptTwo: string;
  activeOptThree: string;
  activeOptFour: string;
  answer: number;
  moduleId: string = '';

  ngOnInit(): void {

    this.moduleId = this.route.snapshot.paramMap.get("moduleId") ?? '';
    this.assessmentService.getReviewAssessmentQuizAns(this.moduleId).subscribe(response => {
      this.questions = response.userquiz;
      this.activeQuestion = this.questions[this.page].question;
      this.activeQuestionId = this.questions[this.page].id;
      this.activeOptOne = this.questions[this.page].option1;
      this.activeOptTwo = this.questions[this.page].option2;
      this.activeOptThree = this.questions[this.page].option3;
      this.activeOptFour = this.questions[this.page].option4;
      this.selectedValue = this.questions[this.page].useranswer;
      this.answer = this.questions[this.page].answer
      this.progressvalue = this.page * 20;
    });
  }

  nextQues() {

    if (this.page != 4) {
      this.page = this.page + 1;
      this.activeQuestion = this.questions[this.page].question;
      this.activeQuestionId = this.questions[this.page].id;
      this.activeOptOne = this.questions[this.page].option1;
      this.activeOptTwo = this.questions[this.page].option2;
      this.activeOptThree = this.questions[this.page].option3;
      this.activeOptFour = this.questions[this.page].option4;
      this.selectedValue = this.questions[this.page].useranswer;
      this.answer = this.questions[this.page].answer;
      this.progressvalue = this.page * 20;
    } else {
    }

  }

  prevQues() {
    if (this.page != 0) {
      this.page = this.page - 1;
      this.activeQuestion = this.questions[this.page].question;
      this.activeQuestionId = this.questions[this.page].id;
      this.activeOptOne = this.questions[this.page].option1;
      this.activeOptTwo = this.questions[this.page].option2;
      this.activeOptThree = this.questions[this.page].option3;
      this.activeOptFour = this.questions[this.page].option4;
      this.selectedValue = this.questions[this.page].useranswer;
      this.answer = this.questions[this.page].answer;
    }
  }

  goToResult() {
    // this.router.navigate([`/pages/national-exams/${this.categoryId}/result/${this.questions[0].result_id}`]);
  }

  goToCats() {
    this.router.navigate(['/pages/national-exams']);
  }

}