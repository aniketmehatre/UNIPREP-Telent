import { Component, OnInit } from "@angular/core"
import { NationalExamService } from "../national-exam-categories/national-exam.service"
import { ActivatedRoute, Router } from "@angular/router"
import { Location } from "@angular/common"

@Component({
	selector: "uni-national-exam-tests",
	templateUrl: "./national-exam-tests.component.html",
	styleUrls: ["./national-exam-tests.component.scss"],
})
export class NationalExamTestsComponent implements OnInit {
	tests: any
	count: number = 1
	category_id: any | null

	constructor(private service: NationalExamService, private route: ActivatedRoute, private location: Location ,private router: Router) {}

	ngOnInit() {
		this.category_id = this.route.snapshot.paramMap.get("slug")
		var data = {
			category_id: this.category_id,
		}
		this.service.getTests(data).subscribe((response) => {
			this.tests = response
		})
	}

	goToHome(event: any) {
		this.location.back()
	}

	goToTest(testid:any){
		// alert("this");
		this.router.navigate(['/pages/national-exams/questions/'+testid]);
	}
}
