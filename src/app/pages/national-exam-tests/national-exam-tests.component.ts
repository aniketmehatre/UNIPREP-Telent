import { Component, OnInit } from "@angular/core"
import { NationalExamService } from "../national-exam-categories/national-exam.service"
import { ActivatedRoute, Router } from "@angular/router"
import { Location } from "@angular/common"
import { AuthService } from "src/app/Auth/auth.service";
@Component({
	selector: "uni-national-exam-tests",
	templateUrl: "./national-exam-tests.component.html",
	styleUrls: ["./national-exam-tests.component.scss"],
})
export class NationalExamTestsComponent implements OnInit {
	tests: any
	count: number = 1
	category_id: any | null
	planExpired: boolean = false;
	restrict: boolean = false;
	ehitlabelIsShow: boolean = true;
	orgnamewhitlabel: any;
	orglogowhitelabel: any;
	imagewhitlabeldomainname: any
	constructor(private service: NationalExamService, private authService: AuthService, private route: ActivatedRoute, private location: Location ,private router: Router) {}

	ngOnInit() {
		this.category_id = this.route.snapshot.paramMap.get("slug")
		var data = {
			category_id: this.category_id,
		}
		this.service.getTests(data).subscribe((response) => {
			this.tests = response
		})
		this.checkplanExpire();
		this.imagewhitlabeldomainname = window.location.hostname;
		if (this.imagewhitlabeldomainname === "dev-student.uniprep.ai" || this.imagewhitlabeldomainname === "uniprep.ai" || this.imagewhitlabeldomainname === "localhost") {
		  this.ehitlabelIsShow = true;
		} else {
		  this.ehitlabelIsShow = false;
		}
	}

	goToHome(event: any) {
		this.location.back()
	}

	goToTest(testid:any){
		if (this.planExpired) {
			this.restrict = true;
			return;
		  }
		this.router.navigate(['/pages/national-exams/questions/'+testid]);
	}
	checkplanExpire(): void {
		this.authService.getNewUserTimeLeft().subscribe((res) => {
		  let data = res.time_left;
		  let subscription_exists_status = res.subscription_details;
		  if (data.plan === "expired" || data.plan === 'subscription_expired' ) {
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
