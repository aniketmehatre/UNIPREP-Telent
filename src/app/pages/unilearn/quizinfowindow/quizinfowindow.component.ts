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
  selector: "uni-quizinfowindow",
  templateUrl: "./quizinfowindow.component.html",
  styleUrls: ["./quizinfowindow.component.scss"],
})
export class QuizinfowindowComponent implements OnInit {
  @Input() parentid: number;
  @Input() moduleid: number;
  @Input() totalquestion: number;
  @Input() selected_module: string;
  quizwindowvisibility = false;
  @Output() moduleChange = new EventEmitter();
  constructor(
    private pageFacade: PageFacadeService,
    private router: Router,
    private learnService: UniLearnService
  ) {}
  paramData: any;
  ngOnInit(): void {
  }
  openVideoPopup(videoLink: string) {
    this.pageFacade.openHowitWorksVideoPopup(videoLink);
  }
  enablequizWindow() {
    this.quizwindowvisibility = true;
  }
  visibilityChange(data: any) {
    this.quizwindowvisibility = data;
    this.moduleChange.emit({
      parent_id: Number(localStorage.getItem("parent_id")),
      module_id: this.moduleid,
      selected_module: this.selected_module,
      stage: 3,
    });
  }
}
