import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AssessmentService } from '../assessment.service';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom, interval, Subscription, takeWhile } from 'rxjs';
import { AssessmentQuiz } from 'src/app/@Models/assessment.model';
import { CostOfLivingService } from '../../job-tool/cost-of-living/cost-of-living.service';
import { SalaryConverterService } from '../../job-tool/salary-converter/salary-converter.service';

@Component({
  selector: 'uni-assessment-quiz',
  templateUrl: './assessment-quiz.component.html',
  styleUrls: ['./assessment-quiz.component.scss']
})
export class AssessmentQuizComponent implements OnInit {

  isSkeletonVisible: boolean = true;
  moduleId: string = '';
  isInstruction: boolean = true;
  title: string = '';
  page: number = 0;
  progressvalue: number = 0;
  selectedValue: any;
  questions: AssessmentQuiz[] = [];
  question_id: any;
  results: any = [];
  showError: boolean = false;
  activeQuestion: string;
  activeQuestionId: number
  activeOptOne: string;
  activeOptTwo: string;
  activeOptThree: string;
  activeOptFour: string;

  sourceCountryPrices: any;
  targetCountryPrices: any;
  sourceCountryRate: number;
  targetCountryRate: number;

  timer: number = 0;
  timerSubscription: Subscription | null = null;
  restrict: boolean = false;
  totalquiztime: any = 0;
  timeover: number = 0;
  quizcount: number = 0;

  constructor(private assessmentService: AssessmentService, private location: Location, private route: ActivatedRoute, private router: Router, private costOfLivingService: CostOfLivingService, private salaryConverterService: SalaryConverterService) { }

  ngOnInit(): void {
    this.moduleId = this.route.snapshot.paramMap.get("moduleId") || '';
    if (this.moduleId) {
      this.title = this.moduleId === '21' ? 'Global Salary Converter' : 'Cost of Living';
      this.getAssessmentQuizList();
    }
  }

  getAssessmentQuizList() {
    this.assessmentService.getAssessmentQuizList(this.moduleId).subscribe({
      next: (response: AssessmentQuiz[]) => {
        this.questions = response;
      },
      error: (error: any) => {
      }
    });
  }

  async processGSCQuestions() {
    for (const item of this.questions) {
      this.isSkeletonVisible = true;
      try {
        const salaryConverterResponse = await firstValueFrom(this.salaryConverterService.getTaxData({
          codes: item.source_country, amt: item.salary_amount
        }));
        switch (item.answer) {
          case 1:
            item.option1 = salaryConverterResponse.quiz_amount;
            break;
          case 2:
            item.option2 = salaryConverterResponse.quiz_amount;
            break;
          case 3:
            item.option3 = salaryConverterResponse.quiz_amount;
            break;
          case 4:
            item.option4 = salaryConverterResponse.quiz_amount;
            break;
        }
      } catch (error) {
        console.error("Error processing item", item, error);
      }
    }
    this.isSkeletonVisible = false;
    this.activeQuestion = this.questions[this.page].question;
    this.activeQuestionId = this.questions[this.page].id;
    this.activeOptOne = this.questions[this.page].option1;
    this.activeOptTwo = this.questions[this.page].option2;
    this.activeOptThree = this.questions[this.page].option3;
    this.activeOptFour = this.questions[this.page].option4;
    this.quizcount = this.questions.length;
    this.startTimer();
  }

  async processCOLQuestions() {
    for (const item of this.questions) {
      this.isSkeletonVisible = true;
      try {
        // const sourceRateResponse = await firstValueFrom(this.costOfLivingService.currencyConvert({
        //   countries: `United States,${item.source_country}`,
        // }));
        // this.sourceCountryRate = Number(sourceRateResponse.rate);

        const targetRateResponse = await firstValueFrom(this.costOfLivingService.currencyConvert({
          countries: `United States,${item.target_country}`,
        }));
        this.targetCountryRate = Number(targetRateResponse.rate);

        const sourcePricesResponse = await firstValueFrom(this.costOfLivingService.calculatePrices({
          city_name: item.source_city_name,
          country_name: item.source_country,
        }));
        this.sourceCountryPrices = sourcePricesResponse.prices;

        const targetPricesResponse = await firstValueFrom(this.costOfLivingService.calculatePrices({
          city_name: item.target_city_name,
          country_name: item.target_country,
        }));
        this.targetCountryPrices = targetPricesResponse.prices;

        const targetPrice = this.targetCountryPrices.find((data: any) => data.good_id === item.good_id);
        const sourcePrice = this.sourceCountryPrices.find((data: any) => data.good_id === item.good_id);

        const diff = Number(sourcePrice.usd?.avg || 0) - Number(targetPrice.usd?.avg || 0);
        switch (item.answer) {
          case 1:
            item.option1 = `${targetPrice.currency_code} ${(diff * this.targetCountryRate).toFixed(2)}`;
            break;
          case 2:
            item.option2 = `${targetPrice.currency_code} ${(diff * this.targetCountryRate).toFixed(2)}`;
            break;
          case 3:
            item.option3 = `${targetPrice.currency_code} ${(diff * this.targetCountryRate).toFixed(2)}`;
            break;
          case 4:
            item.option4 = `${targetPrice.currency_code} ${(diff * this.targetCountryRate).toFixed(2)}`;
            break;
        }
      } catch (error) {
        console.error("Error processing item", item, error);
      }
    }
    this.isSkeletonVisible = false;
    this.activeQuestion = this.questions[this.page].question;
    this.activeQuestionId = this.questions[this.page].id;
    this.activeOptOne = this.questions[this.page].option1;
    this.activeOptTwo = this.questions[this.page].option2;
    this.activeOptThree = this.questions[this.page].option3;
    this.activeOptFour = this.questions[this.page].option4;
    this.quizcount = this.questions.length;
    this.startTimer();
  }

  startQuiz() {
    this.isInstruction = false;
    this.moduleId === '21' ? this.processGSCQuestions() : this.processCOLQuestions();
  }

  nextQues() {
    if (this.selectedValue == undefined) {
      this.showError = true;
    } else {
      this.showError = false;
      const answeredQuestion = this.results.find((item: AssessmentQuiz) => item.id == this.activeQuestionId); // Check if question already pushed in a list or not.  
      if (answeredQuestion && answeredQuestion.useranswer != this.selectedValue) {
        answeredQuestion.useranswer = this.selectedValue; // if previous selected option and new selected option are not same, then set new value.
      }
      if (!answeredQuestion) {
        const newResult = this.questions.find(item => item.id == this.activeQuestionId) as AssessmentQuiz;
        newResult.useranswer = this.selectedValue;
        this.results.push(newResult); // push only new questions
      }
      if (this.page != 4 && this.page < 4) {
        this.page = this.page + 1;
        this.selectedValue = this.results[this.page]?.useranswer;
        this.activeQuestion = this.questions[this.page].question;
        this.activeQuestionId = this.questions[this.page].id;
        this.activeOptOne = this.questions[this.page].option1;
        this.activeOptTwo = this.questions[this.page].option2;
        this.activeOptThree = this.questions[this.page].option3;
        this.activeOptFour = this.questions[this.page].option4;
        this.progressvalue = this.page * 20;
      } else {
        this.progressvalue = (this.page + 1) * 20;
        var info = {
          quizquestion: this.results,
          module_id: this.moduleId
        }
        this.stopTimer();
        this.assessmentService.storeAssessmentQuizAns(info).subscribe(response => {
          // this.router.navigate([`/pages/national-exams/${this.route.snapshot.paramMap.get("categoryid")}/result/${response}`]);
        });
      }
    }
  }

  prevQues() {
    const answeredQuestion = this.results.find((item: AssessmentQuiz) => item.id == this.activeQuestionId);
    if (answeredQuestion && answeredQuestion.useranswer != this.selectedValue) {
      answeredQuestion.useranswer = this.selectedValue;
    }
    if (!answeredQuestion) {
      const newResult = this.questions.find(item => item.id == this.activeQuestionId) as AssessmentQuiz;
      newResult.useranswer = this.selectedValue;
      this.results.push(newResult);
      console.log(this.results);
    }
    if (this.page != 0) {
      this.page = this.page - 1;
      this.activeQuestion = this.questions[this.page].question;
      this.activeQuestionId = this.questions[this.page].id;
      this.activeOptOne = this.questions[this.page].option1;
      this.activeOptTwo = this.questions[this.page].option2;
      this.activeOptThree = this.questions[this.page].option3;
      this.activeOptFour = this.questions[this.page].option4;
      this.selectedValue = this.results[this.page]?.useranswer;
      this.progressvalue = this.page * 20;
    }
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
    this.location.back();
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

  goBack() {
    this.location.back();
  }
}
