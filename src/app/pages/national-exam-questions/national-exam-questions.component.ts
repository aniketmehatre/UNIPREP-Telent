import { Component, OnInit } from '@angular/core';
import { NationalExamService } from '../national-exam-categories/national-exam.service';
import { ActivatedRoute, Router } from '@angular/router';

// interface result {
//   question_id : number;
//   answer_opt : string;
// }

// let results: result[] = [];

@Component({
  selector: 'uni-national-exam-questions',
  templateUrl: './national-exam-questions.component.html',
  styleUrls: ['./national-exam-questions.component.scss']
})
export class NationalExamQuestionsComponent implements OnInit {
  questions: any;
  responsiveOptions: { breakpoint: string; numVisible: number; numScroll: number; }[];
  selectedValue: any ;
  progressvalue:number = 0;

  question_id: any;
   results: any = [];
  showError:boolean = false;
  page:any = 0 ;
  activeQuestion:string;
  activeQuestionId:number
  activeOptOne:string;
  activeOptTwo:string;
  activeOptThree:string;
  activeOptFour:string;
  activeTestId:string;

  constructor(private service: NationalExamService , private route: ActivatedRoute,private router: Router ) { }

  ngOnInit() {
    // this.results = null;
    var data = {
      test_id:  this.route.snapshot.paramMap.get("testid")
    }
    this.service.getQuestions(data).subscribe(response => {
      this.questions = response;
      console.log(this.questions);
      this.activeQuestion = this.questions[this.page].question;
      this.activeQuestionId = this.questions[this.page].id;
      this.activeTestId = this.questions[this.page].test_id;
      this.activeOptOne = this.questions[this.page].option_one;
      this.activeOptTwo = this.questions[this.page].option_two;
      this.activeOptThree = this.questions[this.page].option_three;
      this.activeOptFour = this.questions[this.page].option_four;
      // alert(this.activeQuestionId);
    });
  }


  nextQues(){
    if(this.selectedValue == undefined){
      this.showError = true;
    }else{
      this.showError = false;
      let newResult: any =  {
        question_id : this.activeQuestionId,
        answer_opt : this.selectedValue
      }
      this.results.push(newResult);
      if(this.page != 9){
        this.page = this.page + 1;
        this.activeQuestion = this.questions[this.page].question;
        this.activeQuestionId = this.questions[this.page].id;
        this.activeTestId = this.questions[this.page].test_id;
        this.activeOptOne = this.questions[this.page].option_one;
        this.activeOptTwo = this.questions[this.page].option_two;
        this.activeOptThree = this.questions[this.page].option_three;
        this.activeOptFour = this.questions[this.page].option_four;
        this.selectedValue = null;
        this.progressvalue = this.page*10;

          console.log(this.results);
      }else{
        // this.page = this.page + 1;
        // const newResult: result =  {
        //   question_id : this.activeQuestionId,
        //   answer_opt : this.selectedValue
        // }
        // this.selectedValue = null;
        // this.progressvalue = this.page*10;
        // results.push(newResult);

        var info = {
          questions_id: this.results,
          test_id: this.activeTestId,
        }
        console.log(info);
        this.service.submitResult(info).subscribe(response => {
          // this.results = null;
          this.router.navigate(['/pages/national-exams/result/'+response]);
          // console.log(response);
        });
      }
    }
  }

  prevQues(){
    if(this.page != 0){
      this.page = this.page - 1;
      this.activeQuestion = this.questions[this.page].question;
      this.activeQuestionId = this.questions[this.page].id;
      this.activeTestId = this.questions[this.page].test_id;
      this.activeOptOne = this.questions[this.page].option_one;
      this.activeOptTwo = this.questions[this.page].option_two;
      this.activeOptThree = this.questions[this.page].option_three;
      this.activeOptFour = this.questions[this.page].option_four;
      this.results.pop();
      // this.results = this.results.filter((result: any) => result.question_id !== this.activeQuestionId-1);
      console.log(this.results);
    }
  }

  goToCats(){
    this.router.navigate(['/pages/national-exams'])
  }



}
