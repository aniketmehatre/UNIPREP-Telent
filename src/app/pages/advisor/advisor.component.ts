import { Component, OnInit } from '@angular/core';
import { AdvisorService } from './advisor.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'uni-advisor',
  templateUrl: './advisor.component.html',
  styleUrls: ['./advisor.component.scss']
})
export class AdvisorComponent implements OnInit {
isQuestionAsked: boolean = false;
isQuestionNotAsked: boolean = true;
userQuestion: any;
  question: any;
  answer: any;
  chatdata: any;
  pquestion: any | null ;

  constructor(private service:AdvisorService , private route: ActivatedRoute) { }

  ngOnInit(): void {
    if(this.route.snapshot.paramMap.get('question') != null){
    this.userQuestion = this.route.snapshot.paramMap.get('question');
    }
  }

  getAns(){
    this.isQuestionAsked = true;
    this.isQuestionNotAsked = false;
    // alert(this.userQuestion);
    var data = {
      question : this.userQuestion
    }
    this.service.getAnswer(data).subscribe(response => {
      this.chatdata = response;
      // this.question = response.question;
      // this.answer = response.answer;
    });
  }

  triggerSample(sample:any){
    this.isQuestionAsked = true;
    this.isQuestionNotAsked = false;
    // alert(this.userQuestion);
    var data = {
      question : sample
    }
    this.service.getAnswer(data).subscribe(response => {
      this.chatdata = response;
      // this.question = response.question;
      // this.answer = response.answer;
    });
  }

  askExpert(){
    alert("Our team will get back to you shortly");
  }

}
