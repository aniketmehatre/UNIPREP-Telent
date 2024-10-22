import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { PageFacadeService } from "../../page-facade.service";
import {
  learnModules,
  learnsubModules,
  Quizmodule,
  submoduledata,
} from "../unilearn.model";
import { UniLearnService } from "../unilearn.service";
import { Router } from "@angular/router";

@Component({
  selector: "uni-quizwindow",
  templateUrl: "./quizwindow.component.html",
  styleUrls: ["./quizwindow.component.scss"],
})
export class QuizwindowComponent implements OnInit {
  @Input() parentid: number;
  @Input() moduleid: number;
  @Input() selected_module: string;
  @Output() moduleChange = new EventEmitter();
  constructor(
    private pageFacade: PageFacadeService,
    private router: Router,
    private learnService: UniLearnService
  ) {}
  paramData: any;
  totalquestion=10;
  ngOnInit(): void {
    // this.parentid=1382
    this.paramData = { test_module_id: this.parentid};
    this.getquestions();
  }
  getquestions() {
    this.learnService
      .getQuestions(this.paramData)
      .subscribe((res: Quizmodule) => {
        });
  }
  openVideoPopup(videoLink: string) {
    this.pageFacade.openHowitWorksVideoPopup(videoLink);
  }
}
