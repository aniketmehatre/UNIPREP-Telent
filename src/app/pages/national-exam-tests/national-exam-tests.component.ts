import { Component, OnInit } from "@angular/core"
import { NationalExamService } from "../national-exam-categories/national-exam.service"
import { ActivatedRoute, Router } from "@angular/router"
import { Location } from "@angular/common"
import { AuthService } from "src/app/Auth/auth.service";
import { CommonModule } from "@angular/common";
import { DialogModule } from "primeng/dialog";
import { StorageService } from "../../services/storage.service";
@Component({
	selector: "uni-national-exam-tests",
	templateUrl: "./national-exam-tests.component.html",
	styleUrls: ["./national-exam-tests.component.scss"],
	standalone: true,
	imports: [CommonModule, DialogModule],
})
export class NationalExamTestsComponent implements OnInit {
	tests: any
	count: number = 1
	category_id: any | null
	planExpired: boolean = false;
	nCategory: string = '';

	constructor(private service: NationalExamService, private authService: AuthService, private route: ActivatedRoute,
		private location: Location, private router: Router, private storage: StorageService) { }

	ngOnInit() {
		this.category_id = this.route.snapshot.paramMap.get("slug");
		this.nCategory = this.storage.get('nc-name') ?? '';
		var data = {
			category_id: this.category_id,
		}
		this.service.getTests(data).subscribe((response) => {
			this.tests = response
		})
		this.checkplanExpire();
	}

	goToHome(event: any) {
		this.location.back()
	}

	goToTest(testid: any) {
		if (this.planExpired) {
			this.authService.hasUserSubscription$.next(true);
			return;
		}
		this.router.navigate([`/pages/national-exams/${this.category_id}/questions/${testid}`]);
	}
	checkplanExpire(): void {
		if (this.authService._userSubscrition.time_left.plan === "expired" ||
			this.authService._userSubscrition.time_left.plan === "subscription_expired") {
			this.planExpired = true;
		}
		else {
			this.planExpired = false;
		}
	}

}
