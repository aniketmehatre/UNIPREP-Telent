import {AfterViewChecked, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import { AdvisorService } from './advisor.service';
import {NgxUiLoaderService} from "ngx-ui-loader";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'uni-advisor',
  templateUrl: './advisor.component.html',
  styleUrls: ['./advisor.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AdvisorComponent implements OnInit {
  @ViewChild('chatContainer') private chatContainer: ElementRef;

  isQuestionAsked: boolean = false;
isQuestionNotAsked: boolean = true;
questions: any;
userQuestion: any;
  question: any;
  answer: any;
  chatdata: any;
  showSkeleton: boolean = false;
  responseType: string;
  askExpertResponse: number = 0;
  requestButton: string;
  smallquestion: boolean = false;

  private scrollToBottom(): void {
      try {
        this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
      } catch (err) {
        console.error('Scroll Error:', err);
    }
  }
  constructor(private service:AdvisorService,private ngxService: NgxUiLoaderService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    if(this.route.snapshot.paramMap.get('question') != null){
      this.userQuestion = this.route.snapshot.paramMap.get('question');
      }
    this.questions =[
      {question:"Must visit places in Milan."},
      {question:"Top 10 fully funded scholarships for international students in the UK."},
      {question:"Step-by-step guide to starting a business in France"},
      {question:"High-paying job opportunities for finance graduates in the US."},
      {question:"Oxford University admission criteria for international students"},
      {question:"Number of Public holidays for full-time staff in the UK"},
      {question:"Document checklist required for Spain travel visa application"},
      {question:"Top 10 in-demand jobs in the healthcare industry"},
      {question:"Top 20 government funding opportunities for startups in the UK"},
    ]
    this.responseType = "Ask AI Advisor"
    this.requestButton = "Ask an Expert!"
  }
  pquestion: any | null ;

  lengthCheck(){
    console.log(this.userQuestion.length);
    if(this.userQuestion.length < 20 ){
      this.smallquestion = true;
    }else{
      this.smallquestion = false;
    }
  }
  getAns(){

    if(this.askExpertResponse == 0){
    this.isQuestionAsked = true;
    this.showSkeleton= true;
    this.isQuestionNotAsked = false;
    // alert(this.userQuestion);
    this.ngxService.startBackground();
    var data = {
      question : this.userQuestion
    }
    this.service.getAnswer(data).subscribe(response => {
      this.showSkeleton= false;
      this.chatdata = response;
      // this.question = response.question;
      // this.answer = response.answer;
      this.ngxService.stopBackground();
      this.userQuestion = '';
      this.scrollToBottom();
    });
  }else{
    this.isQuestionAsked = true;
    this.showSkeleton= true;
    this.isQuestionNotAsked = false;
    // alert(this.userQuestion);
    this.ngxService.startBackground();
    var data = {
      question : this.userQuestion
    }
    this.service.getTeamAnswer(data).subscribe(response => {
      this.showSkeleton= false;
      this.chatdata = response;
      // this.question = response.question;
      // this.answer = response.answer;
      this.ngxService.stopBackground();
      this.userQuestion = '';
      this.scrollToBottom();
    });
  }
  }

  triggerSample(sample:any){
    this.userQuestion = sample;
    // this.isQuestionAsked = true;
    // this.showSkeleton= true;
    // this.isQuestionNotAsked = false;
    // this.ngxService.startBackground();
    // alert(this.userQuestion);
    // var data = {
    //   question : sample
    // }
    // this.service.getAnswer(data).subscribe(response => {
    //   this.showSkeleton= false;
    //   this.chatdata = response;

    //   // this.question = response.question;
    //   // this.answer = response.answer;
    //   this.ngxService.stopBackground();
    // });
  }

  askExpert(){
    // if(this.userQuestion.length < 20 ){
    //   this.smallquestion = true;
    //   return
    // }
    //alert("Our team will get back to you shortly");
    if(this.askExpertResponse == 0){
    this.responseType = " Ask Expert";
     this.requestButton = "Ask AI Advisor";
    this.askExpertResponse = 1;
    }else{
      this.responseType = " Ask AI Advisor";
      this.requestButton = "Ask Expert";
     this.askExpertResponse = 0;
    }
  }

}
