import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core"
import { PageFacadeService } from "../../page-facade.service"
import { learnModules } from "../unilearn.model"
import { UniLearnService } from "../unilearn.service"
import { ArrayHeaderService } from "../array-header.service"
import { CommonModule } from "@angular/common"
import { SkeletonModule } from "primeng/skeleton"
import { TooltipModule } from "primeng/tooltip"
import { RouterModule, Router } from "@angular/router"
import { StorageService } from "../../../storage.service";
import { AuthService } from "src/app/Auth/auth.service"

@Component({
  selector: "uni-learnmodules",
  templateUrl: "./learnmodules.component.html",
  styleUrls: ["./learnmodules.component.scss"],
  standalone: false,
})
export class LearnModulesComponent implements OnInit {
	constructor(
		private pageFacade: PageFacadeService,
		private learnService: UniLearnService,
		private arrayHeaderService: ArrayHeaderService,
		private router: Router, private storage: StorageService,
		private authService: AuthService
	) { }

  @Input() parentid: number;
  @Input() moduleid: number;
  @Input() selected_module: string;
  @Output() moduleChange = new EventEmitter();
  isSkeletonVisible: boolean = true;
  moduleList: any;
  loopRange = Array.from({ length: 30 })
    .fill(0)
    .map((_, index) => index);

  ngOnInit(): void {
    this.init();
    this.arrayHeaderService.clearAll();
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
    this.storage.set("module_id",String(moduledata.id))
    this.selected_module = moduledata.module_name;
    this.moduleChange.emit({parent_id: this.parentid, module_id: this.moduleid,selected_module:this.selected_module,stage:2});
  }
}
