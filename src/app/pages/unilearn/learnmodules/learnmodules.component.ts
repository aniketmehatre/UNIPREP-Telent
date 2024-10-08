import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { PageFacadeService } from "../../page-facade.service";
import { learnModules } from "../unilearn.model";
import { UniLearnService } from "../unilearn.service";

@Component({
  selector: "uni-learnmodules",
  templateUrl: "./learnmodules.component.html",
  styleUrls: ["./learnmodules.component.scss"],
})
export class LearnModulesComponent implements OnInit {
  constructor(
    private pageFacade: PageFacadeService,
    private learnService: UniLearnService
  ) {}
  @Input() parentid:number;
  @Input() moduleid:number;
  @Input() selected_module: string;
  @Output() moduleChange = new EventEmitter();
  isSkeletonVisible: boolean = true;
  moduleList: any;
  loopRange = Array.from({ length: 30 })
    .fill(0)
    .map((_, index) => index);

  ngOnInit(): void {
    this.init();
  }
  init() {
    this.learnService.getLearnModules().subscribe((res: learnModules) => {
      this.isSkeletonVisible = false;
      this.moduleList = res;
    });
  }
  openVideoPopup(videoLink: string) {
    this.pageFacade.openHowitWorksVideoPopup(videoLink);
  }
  onModuleClick(moduledata: learnModules) {
    this.parentid = 0;
    this.moduleid = moduledata.id;
    localStorage.setItem("module_id",String(moduledata.id))
    this.selected_module = moduledata.module_name;
    this.moduleChange.emit({parent_id: this.parentid, module_id: this.moduleid,selected_module:this.selected_module,stage:2});
  }
}
