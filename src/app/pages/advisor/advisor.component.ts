import { AfterViewChecked, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AdvisorService } from './advisor.service';
import { NgxUiLoaderService } from "ngx-ui-loader";
import { ActivatedRoute, Router } from '@angular/router';
import { PageFacadeService } from '../page-facade.service';
import { AuthService } from 'src/app/Auth/auth.service';
import { LocationService } from 'src/app/location.service';
import {MessageService} from 'primeng/api';

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
  smallquestion: boolean = true;
  responsiveOptions: any[] = [];
  planExpired!: boolean;
  restrict: boolean = false;
  currentPlan: string = "";
  imagewhitlabeldomainname: any;
  orgnamewhitlabel: any;
  orglogowhitelabel: any;
  ehitlabelIsShow: boolean = true;
  isQuestionEmpty: boolean = false;
  private scrollToBottom(): void {
    setTimeout(() => {
      try {
        const chatContainerElement = this.chatContainer.nativeElement;
        const scrollHeight = chatContainerElement.scrollHeight;
        const scrollPosition = scrollHeight * 0.95; // this code scrolls you when the last question and answer approximately only if the question contains the answer.
        chatContainerElement.scrollTop = scrollPosition;
      } catch (err) {
        console.error('Scroll Error:', err);
      }
    }, 100);  // Adjust delay if needed (100ms is usually enough for most cases)
  }
  
  
  constructor(private service: AdvisorService, private ngxService: NgxUiLoaderService,
    private route: ActivatedRoute, private pageFacade: PageFacadeService, private authService: AuthService,
    private locationService: LocationService, private router: Router,private messageService: MessageService
  ) { }

  ngOnInit() {
    this.checkplanExpire();
    this.locationService.getImage().subscribe(imageUrl => {
      this.orglogowhitelabel = imageUrl;
    });
    this.locationService.getOrgName().subscribe(orgname => {
      this.orgnamewhitlabel = orgname;
    });
    this.imagewhitlabeldomainname = window.location.hostname;
    if (this.imagewhitlabeldomainname === "dev-student.uniprep.ai" || this.imagewhitlabeldomainname === "uniprep.ai" || this.imagewhitlabeldomainname === "localhost") {
      this.ehitlabelIsShow = true;
    } else {
      this.ehitlabelIsShow = false;
    }

    this.questions = [
      { question: "Must visit places in Milan.",icons:"fa-earth-americas" },
      { question: "Top 10 fully funded scholarships for international students in the UK.",icons:"fa-diploma" },
      { question: "Step-by-step guide to starting a business in France",icons:"fa-briefcase" },
      { question: "High-paying job opportunities for finance graduates in the US.",icons:"fa-coins" },
      { question: "Oxford University admission criteria for international students",icons:"fa-university" },
      { question: "Number of Public holidays for full-time staff in the UK",icons:"fa-calendar" },
      { question: "Document checklist required for Spain travel visa application",icons:"fa-folder" },
      { question: "Top 10 in-demand jobs in the healthcare industry",icons:"fa-hospital" },
      { question: "Top 20 government funding opportunities for startups in the UK",icons:"fa-rocket" },
    ]
    this.responsiveOptions = [
      {
        breakpoint: '1199px',
        numVisible: 3,
        numScroll: 1
      },
      {
        breakpoint: '991px',
        numVisible: 2,
        numScroll: 1
      },
      {
        breakpoint: '767px',
        numVisible: 1,
        numScroll: 1,
      }
    ];
    this.responseType = "Ask AI Advisor"
    this.requestButton = "Ask an Expert!"
    this.lengthCheck();
  }
  pquestion: any | null;

  lengthCheck(){
    if (this.userQuestion.length < 20 || this.userQuestion.length == 0) {
      this.smallquestion = true;
    } else {
      this.smallquestion = false;
    }
  }

  getChatHistory(){
    if (this.planExpired) {
      this.restrict = true;
      return;
    }
    this.isQuestionAsked = true;
    this.showSkeleton = true;
    this.isQuestionNotAsked = false;
    this.service.getChatHistory().subscribe(response => {
      this.showSkeleton = false;
      this.chatdata = response;
      this.ngxService.stopBackground();
      this.userQuestion = '';
      this.scrollToBottom();
    });
  }
  private scrollUpSlightly(): void {
    // Scroll the window up by a small amount after the content is added
    window.scrollBy(0, -100);  // Adjust -100 as needed
  }

  getAns(){
    if (this.planExpired) {
      this.restrict = true;
      return;
    }
    if (this.userQuestion && this.userQuestion.trim() === '') {
      return
    }
      this.isQuestionEmpty = true;
      if (this.askExpertResponse == 0) {
        this.isQuestionAsked = true;
        this.showSkeleton = true;
        this.isQuestionNotAsked = false;
        this.ngxService.startBackground();
        var data = {
          question: this.userQuestion
        }
        this.service.getAnswer(data).subscribe(response => {
          this.showSkeleton = false;
          this.chatdata = response;
          this.ngxService.stopBackground();
          this.userQuestion = '';
          this.scrollToBottom();
        });
      } else {
        this.isQuestionAsked = true;
        this.showSkeleton = true;
        this.isQuestionNotAsked = false;

        this.ngxService.startBackground();
        var data = {
          question: this.userQuestion
        }
        this.service.getTeamAnswer(data).subscribe(response => {
          this.showSkeleton = false;
          this.chatdata = response;
          this.ngxService.stopBackground();
          this.userQuestion = '';
          this.scrollToBottom();
          // alert("Thank you , Our team will get back to you in next 8 working hours");
          this.messageService.add({ severity:'success', summary: 'Success', detail: 'Thank you , Our team will get back to you in next 8 working hours'});
        });

    }
  }

  triggerSample(sample: any) {
    this.userQuestion = sample;
    this.smallquestion = false;
  }

  askExpert() {
    this.smallquestion = true;
    // if (this.userQuestion && this.userQuestion.trim() === '') {
    //   return
    // }
      
    if (this.askExpertResponse == 0) {
      this.responseType = " Ask Expert";
      this.requestButton = "Ask AI Advisor";
      this.askExpertResponse = 1;
    } else {
      this.responseType = " Ask AI Advisor";
      this.requestButton = "Ask Expert";
      this.askExpertResponse = 0;
    }
  }

  openVideoPopup(videoLink: string) {
    this.pageFacade.openHowitWorksVideoPopup(videoLink);
  }
  checkplanExpire() {
    this.authService.getNewUserTimeLeft().subscribe((res) => {
      let data = res.time_left;
      let subscription_exists_status = res.subscription_details;
      this.currentPlan = subscription_exists_status.subscription_plan;
      if (data.plan === "expired" || data.plan === 'subscription_expired' ||
        subscription_exists_status.subscription_plan === 'free_trail') {
        this.planExpired = true;
      } else {
        this.planExpired = false;
      }
    })
  }
  upgradePlan() {
    this.router.navigate(["/pages/subscriptions"]);
  }
  clearRestriction() {
    this.restrict = false;
  }

}
