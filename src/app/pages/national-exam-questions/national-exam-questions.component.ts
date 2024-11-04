import { Component, OnInit } from '@angular/core';
import { NationalExamService } from '../national-exam-categories/national-exam.service';

interface result {
  question_id : number;
  answer_opt : string;
}



let results: result[] = [];


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
  results: any;
  showError:boolean = false;

  page:any = 0 ;
  activeQuestion:string;
  activeQuestionId:number
  activeOptOne:string;
  activeOptTwo:string;
  activeOptThree:string;
  activeOptFour:string;
  activeTestId:string;

  constructor(private service: NationalExamService ) { }

  ngOnInit() {
    var data = {
      test_id: 1
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
      const newResult: result =  {
        question_id : this.activeQuestionId,
        answer_opt : this.selectedValue
      }
      results.push(newResult);
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

          console.log(results);
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
          questions_id: results,
          test_id: this.activeTestId,
        }
        console.log(info);
        this.service.submitResult(info).subscribe(response => {
          console.log(response);
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
      results = results.filter((result) => result.question_id !== this.activeQuestionId-1);
      console.log(results);
    }
  }



}
