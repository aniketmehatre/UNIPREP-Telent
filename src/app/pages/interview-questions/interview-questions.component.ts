import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '@env/environment';
import { InterviewJobrolesService } from '../interview-jobroles/interview-jobroles.service';
import { Router } from '@angular/router';
import { AuthService } from "src/app/Auth/auth.service";

@Component({
  selector: 'uni-interview-questions',
  templateUrl: './interview-questions.component.html',
  styleUrls: ['./interview-questions.component.scss']
})
export class InterviewQuestionsComponent implements OnInit {
  jobrole: string | null | undefined;
  questions: any;
  showAnswer: boolean = false;
  seeQues: string | undefined;
  seeAns: string | undefined;
  modulename: any;
  planExpired: boolean = false;
  restrict: boolean = false;
  ehitlabelIsShow: boolean = true;
  orgnamewhitlabel: any;
  orglogowhitelabel: any;
  imagewhitlabeldomainname: any
  constructor(private http: HttpClient ,private authService: AuthService, private route: ActivatedRoute , private  jrservice: InterviewJobrolesService ,  private router: Router) { }

  ngOnInit(){
    this.checkplanExpire();
    this.imagewhitlabeldomainname = window.location.hostname;
    if (this.imagewhitlabeldomainname === "dev-student.uniprep.ai" || this.imagewhitlabeldomainname === "uniprep.ai" || this.imagewhitlabeldomainname === "localhost") {
      this.ehitlabelIsShow = true;
    } else {
      this.ehitlabelIsShow = false;
    }
    this.jobrole = this.route.snapshot.paramMap.get('slug');
    this.modulename = this.jobrole?.replace("-"," ");
    var data = {
      jobrole:this.jobrole
    }
    this.jrservice.getIntervireQuestions(data).subscribe(response => {
      this.questions = response;
    });
  }

  goBack(){
    this.router.navigate(['/pages/jobroles']);
  }

  seeAnswer(ques: string, ans: string){
    if (this.planExpired) {
      this.restrict = true;
      return;
    }
    this.showAnswer = true;
    this.seeQues = ques;
    this.seeAns  = ans;
  }
  checkplanExpire(): void {
    this.authService.getNewUserTimeLeft().subscribe((res) => {
      let data = res.time_left;
      let subscription_exists_status = res.subscription_details;
      if (data.plan === "expired" || data.plan === 'subscription_expired' || subscription_exists_status.subscription_plan=="Student") {
        this.planExpired = true;
      } else {
        this.planExpired = false;
      }
    })
  }
  upgradePlan(): void {
    this.router.navigate(["/pages/subscriptions"]);
  }
  clearRestriction() {
    this.restrict = false;
  }
}


