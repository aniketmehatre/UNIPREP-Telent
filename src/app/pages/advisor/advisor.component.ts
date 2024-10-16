import { Component, OnInit } from '@angular/core';
import { AdvisorService } from './advisor.service';
import {NgxUiLoaderService} from "ngx-ui-loader";

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

  constructor(private service:AdvisorService,private ngxService: NgxUiLoaderService,) { }

  ngOnInit(): void {
    
  }

  getAns(){
    
    this.isQuestionAsked = true;
    this.isQuestionNotAsked = false;
    // alert(this.userQuestion);
    this.ngxService.start();
    var data = {
      question : this.userQuestion
    }
    this.service.getAnswer(data).subscribe(response => {
      this.chatdata = response;
      // this.question = response.question;
      // this.answer = response.answer;
      this.ngxService.stop();
    });
  }

  triggerSample(sample:any){
    this.isQuestionAsked = true;
    this.isQuestionNotAsked = false;
    this.ngxService.startBackground();
    // alert(this.userQuestion);
    var data = {
      question : sample
    }
    this.service.getAnswer(data).subscribe(response => {
      this.chatdata = response;
      // this.question = response.question;
      // this.answer = response.answer;
      this.ngxService.stopBackground();
    });
  }

  askExpert(){
    alert("Our team will get back to you shortly");
  }

}
