import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NationalExamService } from '../national-exam-categories/national-exam.service';

@Component({
  selector: 'uni-national-exam-review',
  templateUrl: './national-exam-review.component.html',
  styleUrls: ['./national-exam-review.component.scss']
})
export class NationalExamReviewComponent implements OnInit {

  constructor(private service: NationalExamService , private route: ActivatedRoute,private router: Router ) { }

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
  answerReason:string;
  answer:string;

  ngOnInit(): void {

    var data = {
      result_id:  this.route.snapshot.paramMap.get("resultid")
    }
    this.service.showResult(data).subscribe(response => {
      this.questions = response;
      console.log(this.questions);
      this.activeQuestion = this.questions[this.page].question;
      this.activeQuestionId = this.questions[this.page].id;
      this.activeTestId = this.questions[this.page].test_id;
      this.activeOptOne = this.questions[this.page].option_one;
      this.activeOptTwo = this.questions[this.page].option_two;
      this.activeOptThree = this.questions[this.page].option_three;
      this.activeOptFour = this.questions[this.page].option_four;
      this.selectedValue = this.questions[this.page].selected_option;
      this.answerReason = this.questions[this.page].ans_reason;
      this.answer = this.questions[this.page].ans_option
      // alert(this.activeQuestionId);
    });   
  }

  nextQues(){

      if(this.page != 9){
        this.page = this.page + 1;
        this.activeQuestion = this.questions[this.page].question;
        this.activeQuestionId = this.questions[this.page].id;
        this.activeTestId = this.questions[this.page].test_id;
        this.activeOptOne = this.questions[this.page].option_one;
        this.activeOptTwo = this.questions[this.page].option_two;
        this.activeOptThree = this.questions[this.page].option_three;
        this.activeOptFour = this.questions[this.page].option_four;
        this.selectedValue = this.questions[this.page].selected_option;
        this.answerReason = this.questions[this.page].ans_reason;
        this.answer = this.questions[this.page].ans_option
        this.progressvalue = this.page*10;
      }else{
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
      this.selectedValue = this.questions[this.page].selected_option;
      this.answerReason = this.questions[this.page].ans_reason;
    }
  }



}
