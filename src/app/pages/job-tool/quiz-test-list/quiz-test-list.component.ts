import { Component, OnInit } from "@angular/core";
import { TestQuizService } from "../test-quiz.service";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { GetQuizPayload, Quiz } from "src/app/@Models/career-tool-category.model";
import { AuthService } from "src/app/Auth/auth.service";
import { LocationService } from "src/app/location.service";
import { CommonModule } from "@angular/common";
import { DialogModule } from "primeng/dialog";
import { StorageService } from "../../../storage.service";
@Component({
  selector: "uni-quiz-test-list",
  templateUrl: "./quiz-test-list.component.html",
  styleUrls: ["./quiz-test-list.component.scss"],
  standalone: true,
  imports: [CommonModule, DialogModule],
})
export class QuizTestListComponent implements OnInit {
  quizlist: any = [];
  currentModule: string = "Psychometric";
  subModuleId: string = "";
  moduleId: string = "";
  count: number = 0;
  constructor(private testQuizService: TestQuizService, private activatedRoute: ActivatedRoute,
    private authService: AuthService, private router: Router, private locationService: LocationService,
    private storage: StorageService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.storage.set("employerName", "");
      this.currentModule = params["name"];
      this.subModuleId = params["id"];
      this.quizlistData();
    });
    this.checkplanExpire();
  }
  quizlistData() {
    const params: GetQuizPayload = {
      categoryId: this.subModuleId,
    };
    this.testQuizService.getQuizList(params).subscribe((res) => {
      this.quizlist = res.data;
      this.count = res.count;
    });
  }
  showQuizQuestions(subModuleId: number, currentModule: any, careertoolquiz: any, havequeryParam: boolean) {
    if (this.planExpired) {
      this.authService.hasUserSubscription$.next(true);
      return;
    }
    this.storage.set("learninghubsubmoduleid", subModuleId.toString());
    havequeryParam
      ? this.router.navigate(["/pages/modules", currentModule, careertoolquiz], {
        queryParams: { showReview: "true" },
      })
      : this.router.navigate(["/pages/modules", currentModule, careertoolquiz]);
  }
  planExpired: boolean = false;
  checkplanExpire(): void {
    if (this.authService._userSubscrition.time_left.plan === "expired" ||
      this.authService._userSubscrition.time_left.plan === "subscription_expired" ||
      this.authService._userSubscrition.subscription_details.subscription_plan === "Student") {
      this.planExpired = true;
    }
    else {
      this.planExpired = false;
    }
  }

}
