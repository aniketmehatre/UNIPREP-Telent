import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { PageFacadeService } from "../../page-facade.service";
import { learnModules, learnsubModules } from "../unilearn.model";
import { UniLearnService } from "../unilearn.service";
import { Router } from "@angular/router";

@Component({
  selector: "uni-learnsubmodules",
  templateUrl: "./learnsubmodules.component.html",
  styleUrls: ["./learnsubmodules.component.scss"],
})
export class LearnsubModulesComponent implements OnInit {
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
  getModules() {
    this.learnService
      .getUniLearnsubModules(this.paramData)
      .subscribe((res: learnsubModules) => {
        this.isSkeletonVisible = false;
        this.submoduleList = res;
      });
  }
  openVideoPopup(videoLink: string) {
    this.pageFacade.openHowitWorksVideoPopup(videoLink);
  }
  pdfURL: any;
  pdfvisibility=false;
  onModuleClick(moduledata: learnsubModules) {
    this.paramData.parent_id = moduledata.id;
    this.paramData.module_id = moduledata.module_id;
    this.parentid = moduledata.id;
    this.moduleid = moduledata.id;
    this.selected_module = moduledata.submodule_name;
    switch (moduledata.file_type) {
      case 1:
        this.getModules();
        break;
      case 2:
        this.pdfvisibility=true;
        this.pdfURL=moduledata.attachment_filename;
        break;
      case 3:
        this.pageFacade.openHowitWorksVideoPopup(moduledata.attachment_filename);
        break;
      default:
        this.getModules();
        break;
    }
  }
  backtoMain() {
    if(this.pdfvisibility){
      this.pdfvisibility=false;
      return;
    }
    if (this.parentid == 0 && this.moduleid == 1) {
      this.moduleChange.emit({
        parent_id: this.parentid,
        module_id: this.moduleid,
        selected_module: this.selected_module,
        stage: 1,
      });
    } else {
      this.getModules();
    }
  }
}
