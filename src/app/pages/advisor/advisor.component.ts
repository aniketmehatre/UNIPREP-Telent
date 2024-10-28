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
  }
  pquestion: any | null ;

  getAns(){

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
    alert("Our team will get back to you shortly");
  }

}
