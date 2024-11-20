import { AfterViewChecked, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AdvisorService } from './advisor.service';
import { NgxUiLoaderService } from "ngx-ui-loader";
import { ActivatedRoute, Router } from '@angular/router';
import { PageFacadeService } from '../page-facade.service';
import { AuthService } from 'src/app/Auth/auth.service';
import { LocationService } from 'src/app/location.service';

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
  planExpired!: boolean;
  restrict: boolean = false;
  currentPlan: string = "";
  imagewhitlabeldomainname:any;
  orgnamewhitlabel:any;
  orglogowhitelabel:any;
  ehitlabelIsShow:boolean=true;
  private scrollToBottom(): void {
    try {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Scroll Error:', err);
    }
  }
  constructor(private service: AdvisorService, private ngxService: NgxUiLoaderService,
    private route: ActivatedRoute, private pageFacade: PageFacadeService, private authService: AuthService,
    private locationService: LocationService,  private router: Router,
  ) { }

  ngOnInit(): void {
    this.checkplanExpire();
    this.locationService.getImage().subscribe(imageUrl => {
      this.orglogowhitelabel = imageUrl;
    });
    this.locationService.getOrgName().subscribe(orgname => {
      this.orgnamewhitlabel = orgname;
    });
    this.imagewhitlabeldomainname=window.location.hostname;
    if (this.imagewhitlabeldomainname === "dev-student.uniprep.ai" || this.imagewhitlabeldomainname === "uniprep.ai" || this.imagewhitlabeldomainname === "localhost") {
      this.ehitlabelIsShow=true;
    }else{
      this.ehitlabelIsShow=false;
    }
    if (this.route.snapshot.paramMap.get('question') != null) {
      this.userQuestion = this.route.snapshot.paramMap.get('question');
    }
    this.questions = [
      { question: "Must visit places in Milan." },
      { question: "Top 10 fully funded scholarships for international students in the UK." },
      { question: "Step-by-step guide to starting a business in France" },
      { question: "High-paying job opportunities for finance graduates in the US." },
      { question: "Oxford University admission criteria for international students" },
      { question: "Number of Public holidays for full-time staff in the UK" },
      { question: "Document checklist required for Spain travel visa application" },
      { question: "Top 10 in-demand jobs in the healthcare industry" },
      { question: "Top 20 government funding opportunities for startups in the UK" },
    ]
    this.responseType = "Ask AI Advisor"
    this.requestButton = "Ask an Expert!"
  }
  pquestion: any | null;

  getAns() {
    console.log("hi");
    
    if (this.planExpired) {
      this.restrict = true;
      return;
    }
    if (this.askExpertResponse == 0) {
      this.isQuestionAsked = true;
      this.showSkeleton = true;
      this.isQuestionNotAsked = false;
      // alert(this.userQuestion);
      this.ngxService.startBackground();
      var data = {
        question: this.userQuestion
      }
      this.service.getAnswer(data).subscribe(response => {
        this.showSkeleton = false;
        this.chatdata = response;
        // this.question = response.question;
        // this.answer = response.answer;
        this.ngxService.stopBackground();
        this.userQuestion = '';
        this.scrollToBottom();
      });
    } else {
      this.isQuestionAsked = true;
      this.showSkeleton = true;
      this.isQuestionNotAsked = false;
      // alert(this.userQuestion);
      this.ngxService.startBackground();
      var data = {
        question: this.userQuestion
      }
      this.service.getTeamAnswer(data).subscribe(response => {
        this.showSkeleton = false;
        this.chatdata = response;
        // this.question = response.question;
        // this.answer = response.answer;
        this.ngxService.stopBackground();
        this.userQuestion = '';
        this.scrollToBottom();
      });
    }
  }

  triggerSample(sample: any) {
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

  askExpert() {
    //alert("Our team will get back to you shortly");
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
  checkplanExpire(): void {
    this.authService.getNewUserTimeLeft().subscribe((res) => {
      let data = res.time_left;
      let subscription_exists_status = res.subscription_details;
      this.currentPlan = subscription_exists_status.subscription_plan;
      if (data.plan === "expired" || data.plan === 'subscription_expired' ||
          subscription_exists_status.subscription_plan === 'free_trail') {
        this.planExpired = true;
        //this.restrict = true;
      } else {
        this.planExpired = false;
        //this.restrict = false;
      }
      // this.loadInvestorData(0);  
    })
  }
  upgradePlan(): void {
    this.router.navigate(["/pages/subscriptions"]);
  }
  clearRestriction() {
    this.restrict = false;
  }

}
