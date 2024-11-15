import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { PageFacadeService } from "../../page-facade.service";
import { Location } from "@angular/common";
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
  @Input() _contentalignment: boolean;
  parantfolderId: number;
  ieltsacademiclisteningquizinstructionshow: boolean = false;
  normalquizinstruction: boolean = false;
  ieltsacademicreadingquizinstructionshow: boolean = false;
  ieltsacademicwritingquizinstructionshow: boolean = false;
  ieltsacademicspeakingquizinstructionshow: boolean = false;
  greverbalreasoningisshow: boolean = false;
  grequantativeisshow: boolean = false;
  greanalyticalwriting: boolean = false;
  constructor(
    private pageFacade: PageFacadeService,
    private router: Router,
    private learnService: UniLearnService,
    private location: Location
  ) {}
  paramData: any;
  ngOnInit(): void {
    this.parantfolderId = Number(localStorage.getItem("parent_folderid"));
    this.getunilearnquizdetails();
    // condition for quiz intruction all modules
    if (this.moduleid == 1) {
      if (this.parantfolderId == 1378) {
        this.ieltsacademiclisteningquizinstructionshow = true;
      } else if (this.parantfolderId == 1379) {
        this.ieltsacademicreadingquizinstructionshow = true;
      } else if (this.parantfolderId == 1380) {
        this.ieltsacademicwritingquizinstructionshow = true;
      } else if (this.parantfolderId == 1381) {
        this.ieltsacademicspeakingquizinstructionshow = true;
      } else {
        this.normalquizinstruction = true;
      }
    } else if (this.moduleid == 5) {
      if (this.parantfolderId == 1532) {
        this.greverbalreasoningisshow = true;
      } else if (this.parantfolderId == 1533) {
        this.grequantativeisshow = true;
      } else if (this.parantfolderId == 1534) {
        this.greanalyticalwriting = true;
      } else {
        this.normalquizinstruction = true;
      }
    } else {
      this.normalquizinstruction = true;
    }
    // console.log(this.moduleid);
    // console.log(this.parentid);
    // console.log(this.selected_module);
    // console.log(Number(localStorage.getItem("parent_id")));
    // console.log(Number(localStorage.getItem("parent_folderid")));
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
  goBack() {
    this.moduleChange.emit({
      parent_id: Number(localStorage.getItem("parent_folderid")),
      module_id: this.moduleid,
      selected_module: this.selected_module,
      stage: 3,
      isfromquizinfo: true,
    });
  }
  getunilearnquizdetails() {
    this.learnService
      .getunilearnquizdetails({ id: this.parentid })
      .subscribe((res: any) => {
        this.totalquestion = res.q_count;
      });
  }
}
