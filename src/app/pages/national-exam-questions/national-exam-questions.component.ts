import { Component, OnInit } from '@angular/core';
import { NationalExamService } from '../national-exam-categories/national-exam.service';
import { ActivatedRoute, Router } from '@angular/router';
import { interval, Subscription, takeWhile } from 'rxjs';

@Component({
  selector: 'uni-national-exam-questions',
  templateUrl: './national-exam-questions.component.html',
  styleUrls: ['./national-exam-questions.component.scss']
})
export class NationalExamQuestionsComponent implements OnInit {
  questions: any;
  responsiveOptions: { breakpoint: string; numVisible: number; numScroll: number; }[];
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
  activeTestId: string;
  timer: number = 0;
  timerSubscription: Subscription | null = null;
  restrict: boolean = false;
  totalquiztime: any = 0;
  timeover: number = 0;
  quizcount: number = 0;

  constructor(private service: NationalExamService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    var data = {
      test_id: this.route.snapshot.paramMap.get("testid")
    }
    this.service.getQuestions(data).subscribe(response => {
      this.questions = response;
      this.activeQuestion = this.questions[this.page].question;
      this.activeQuestionId = this.questions[this.page].id;
      this.activeTestId = this.questions[this.page].test_id;
      this.activeOptOne = this.questions[this.page].option_one;
      this.activeOptTwo = this.questions[this.page].option_two;
      this.activeOptThree = this.questions[this.page].option_three;
      this.activeOptFour = this.questions[this.page].option_four;
      this.quizcount = 10;
      this.startTimer();
    });
  }


  nextQues() {
    if (this.selectedValue == undefined) {
      this.showError = true;
    } else {
      this.showError = false;
      const answeredQuestion = this.results.find((item: any) => item.question_id == this.activeQuestionId); // Check if question already pushed in a list or not.  
      if (answeredQuestion && answeredQuestion.answer_opt != this.selectedValue) {
        answeredQuestion.answer_opt = this.selectedValue; // if previous selected option and new selected option are not same, then set new value.
      }
      if (!answeredQuestion) {
        let newResult: any = {
          question_id: this.activeQuestionId,
          answer_opt: this.selectedValue
        }
        this.results.push(newResult); // push only new questions
      }
      if (this.page != 9 && this.page < 9) {
        this.page = this.page + 1;
        this.selectedValue = this.results[this.page]?.answer_opt;
        this.activeQuestion = this.questions[this.page].question;
        this.activeQuestionId = this.questions[this.page].id;
        this.activeTestId = this.questions[this.page].test_id;
        this.activeOptOne = this.questions[this.page].option_one;
        this.activeOptTwo = this.questions[this.page].option_two;
        this.activeOptThree = this.questions[this.page].option_three;
        this.activeOptFour = this.questions[this.page].option_four;
        this.progressvalue = this.page * 10;

        console.log(this.results);
      } else {
        this.page = this.page + 1;
        this.progressvalue = this.page * 10;
        var info = {
          questions_id: this.results,
          test_id: this.activeTestId,
        }
        this.stopTimer();
        this.service.submitResult(info).subscribe(response => {
          this.router.navigate([`/pages/national-exams/${this.route.snapshot.paramMap.get("categoryid")}/result/${response}`]);
        });
      }
    }
  }

  prevQues() {
    const answeredQuestion = this.results.find((item: any) => item.question_id == this.activeQuestionId);
    if (answeredQuestion && answeredQuestion.answer_opt != this.selectedValue) {
      answeredQuestion.answer_opt = this.selectedValue;
    }
    if (!answeredQuestion) {
      let newResult: any = {
        question_id: this.activeQuestionId,
        answer_opt: this.selectedValue
      }
      this.results.push(newResult);
    }
    if (this.page != 0) {
      this.page = this.page - 1;
      this.activeQuestion = this.questions[this.page].question;
      this.activeQuestionId = this.questions[this.page].id;
      this.activeTestId = this.questions[this.page].test_id;
      this.activeOptOne = this.questions[this.page].option_one;
      this.activeOptTwo = this.questions[this.page].option_two;
      this.activeOptThree = this.questions[this.page].option_three;
      this.activeOptFour = this.questions[this.page].option_four;
      this.selectedValue = this.results[this.page]?.answer_opt;
      this.progressvalue = this.page * 10;
    }
  }

  goToCats() {
    this.router.navigate(['/pages/national-exams'])
  }

  formatTime(seconds: number): string {
    const minutes: number = Math.floor(seconds / 60);
    const remainingSeconds: number = seconds % 60;
    return `${this.padZero(minutes)}:${this.padZero(remainingSeconds)}`;
  }
  padZero(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }

  closeQuiz() {
    this.stopTimer();
    this.router.navigate([`/pages/national-exams/${this.route.snapshot.paramMap.get("categoryid")}`]);
  }

  startTimer(): void {
    this.timeover = 0;
    this.timer = this.quizcount * 60;
    this.totalquiztime = this.quizcount * 60;
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    this.timerSubscription = interval(1000).pipe(
      takeWhile(() => this.timer > this.timeover)
    ).subscribe(() => {
      this.timer--;
      if (this.timer === this.timeover) {
        this.restrict = true;
      }
    });
  }

  stopTimer(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }
}
