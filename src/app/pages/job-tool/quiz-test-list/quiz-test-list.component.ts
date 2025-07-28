import { Component, OnInit } from "@angular/core";
import { TestQuizService } from "../test-quiz.service";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { GetQuizPayload } from "src/app/@Models/career-tool-category.model";
import { CommonModule } from "@angular/common";
import { DialogModule } from "primeng/dialog";
import { StorageService } from "../../../services/storage.service";
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
    private router: Router, private storage: StorageService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.storage.set("employerName", "");
      this.currentModule = params["name"];
      this.subModuleId = params["id"];
      this.quizlistData();
    });
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
    this.storage.set("learninghubsubmoduleid", subModuleId.toString());
    havequeryParam
      ? this.router.navigate(["/pages/modules", currentModule, careertoolquiz], {
        queryParams: { showReview: "true" },
      })
      : this.router.navigate(["/pages/modules", currentModule, careertoolquiz]);
  }

}
