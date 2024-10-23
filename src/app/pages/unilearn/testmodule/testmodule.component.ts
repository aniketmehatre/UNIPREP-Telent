import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { PageFacadeService } from "../../page-facade.service";
import {
  learnModules,
  learnsubModules,
  submoduledata,
} from "../unilearn.model";
import { UniLearnService } from "../unilearn.service";
import { Router } from "@angular/router";

@Component({
  selector: "uni-testmodule",
  templateUrl: "./testmodule.component.html",
  styleUrls: ["./testmodule.component.scss"],
})
export class TestModulesComponent implements OnInit {
  @Input() parentid: number;
  @Input() moduleid: number;
  @Input() selected_module: string;
  @Output() moduleChange = new EventEmitter();
  isSkeletonVisible: boolean = true;
  submoduleList: any;
  constructor(
    private pageFacade: PageFacadeService,
    private router: Router,
    private learnService: UniLearnService
  ) {}
  loopRange = Array.from({ length: 30 })
    .fill(0)
    .map((_, index) => index);
  paramData: any;
  ngOnInit(): void {
    this.paramData = { parent_id: this.parentid, module_id: this.moduleid };
    this.getModules();
  }
  avgtotalQuestions = 0;
  avgtotalAnswers = 0;
  getModules() {
    this.learnService
      .getUniLearnsubModules(this.paramData)
      .subscribe((res: learnsubModules) => {
        this.isSkeletonVisible = false;
        this.submoduleList = res.data;
        this.avgtotalQuestions = res.totalQuestions;
        this.avgtotalAnswers = res.userAnsweredQuestions;
        localStorage.setItem("parent_id", String(res.previous_id));
      });
  }
  openVideoPopup(videoLink: string) {
    this.pageFacade.openHowitWorksVideoPopup(videoLink);
  }
  contentalignment = false;
  onModuleClick(moduledata: submoduledata) {
    this.paramData.parent_id = moduledata.id;
    this.paramData.module_id = moduledata.module_id;
    this.selected_module = moduledata.submodule_name;
    this.parentid = moduledata.parent_folder_id;
    this.moduleid = moduledata.module_id;
    switch (moduledata.file_type) {
      case 4:
        this.contentalignment = true;
        this.isSkeletonVisible = true;
        this.getModules();
        break;
      case 5:
        this.moduleChange.emit({
          parent_id: moduledata.id,
          module_id: moduledata.module_id,
          selected_module: moduledata.submodule_name,
          stage: 4,
        });
        break;
    }
  }
  backtoMain() {
    const hasFileType4 = this.submoduleList.some(
      (data: any) => data.file_type === 4
    );
    if (hasFileType4) {
      this.moduleChange.emit({
        parent_id: 0,
        module_id: 1,
        selected_module: this.selected_module,
        stage: 2,
      });
    }
    const hasFileType5 = this.submoduleList.some(
      (data: any) => data.file_type === 5
    );
    if (hasFileType5) {
      this.contentalignment = false;
    }
    if (this.submoduleList.length == 0) {
      this.moduleChange.emit({
        parent_id: 0,
        module_id: 1,
        selected_module: this.selected_module,
        stage: 2,
      });
      return;
    }
    if (this.submoduleList[0]?.parent_folder_id == 0) {
      this.moduleChange.emit({
        parent_id: 0,
        module_id: 1,
        selected_module: this.selected_module,
        stage: 2,
      });
      return;
    } else {
      this.paramData.parent_id = Number(localStorage.getItem("parent_id"));
      this.paramData.module_id = Number(localStorage.getItem("module_id"));
      this.isSkeletonVisible = true;
      this.getModules();
    }
  }
}
