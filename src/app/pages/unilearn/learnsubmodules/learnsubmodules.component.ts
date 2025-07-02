import { CommonModule } from "@angular/common";
import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  EventEmitter,
  Output,
  Input,
} from "@angular/core";
import { PageFacadeService } from "../../page-facade.service";
import {
  learnModules,
  learnsubModules,
  submoduledata,
} from "../unilearn.model";
import { UniLearnService } from "../unilearn.service";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { ArrayHeaderService } from "../array-header.service";
import { Location } from "@angular/common";
import { AuthService } from "src/app/Auth/auth.service";
import { DialogModule } from "primeng/dialog";

import { StorageService } from "../../../storage.service";
import { PdfViewerModule } from "ng2-pdf-viewer";

@Component({
  selector: "uni-learnsubmodules",
  templateUrl: "./learnsubmodules.component.html",
  styleUrls: ["./learnsubmodules.component.scss"],
  standalone: false,
})
export class LearnsubModulesComponent implements OnInit {
  @ViewChild("pdfViewer") pdfViewer: any;
  isSkeletonVisible: boolean = true;
  submoduleList: any;
  paramData: any;
  planExpired: boolean = false;
  pdfURL: string = "";
  pdfvisibility = false;
  moduleId: number;
  moduleName: string;
  pdfLoadError: boolean = false;
  @Input() parentid: number;
  @Input() moduleid: number;
  @Input() selected_module: string;
  @Output() moduleChange = new EventEmitter();
  constructor(
    private pageFacade: PageFacadeService,
    private authService: AuthService,
    private router: Router,
    private arrayHeaderService: ArrayHeaderService,
    private learnService: UniLearnService,
    private route: ActivatedRoute,
    private location: Location,
    private storage: StorageService
  ) {}

  ngOnInit(): void {
    this.checkplanExpire();
    this.paramData = { parent_id: this.parentid, module_id: this.moduleid };
    this.getModules();
  }

  getFormattedValues(): string {
    return this.arrayHeaderService.getItems().join(` > `);
  }
  getModules() {
    this.learnService
      .getUniLearnsubModules(this.paramData)
      .subscribe((res: learnsubModules) => {
        this.isSkeletonVisible = false;
        this.submoduleList = res.data;
        this.storage.set("parent_id", String(res.previous_id));
      });
  }
  openVideoPopup() {
    this.pageFacade.openHowitWorksVideoPopup("unilearn");
  }
  onModuleClick(moduledata: submoduledata) {
    if (moduledata.isTestmodule == 1) {
      this.moduleChange.emit({
        parent_id: moduledata.id,
        module_id: moduledata.module_id,
        selected_module: moduledata.submodule_name,
        stage: 3,
        isfromquizinfo: false,
      });
      return;
    }
    this.paramData.parent_id = moduledata.id;
    this.paramData.module_id = moduledata.module_id;
    this.selected_module = moduledata.submodule_name;
    this.parentid = moduledata.parent_folder_id;
    this.moduleid = moduledata.module_id;
    switch (moduledata.file_type) {
      case 1:
        this.getModules();
        break;
      case 2:
        this.pdfvisibility = true;
        this.pdfURL = moduledata.attachment_filename;
        break;
      case 3:
        this.pageFacade.openHowitWorksVideoPopup(
          moduledata.attachment_filename
        );
        break;
      case 4:
        break;
      default:
        this.getModules();
        break;
    }
  }
  backtoMain() {
    if (this.pdfvisibility) {
      this.pdfvisibility = false;
      return;
    }

    if (this.submoduleList.length == 0) {
      this.moduleChange.emit({
        parent_id: 0,
        module_id: 1,
        selected_module: this.selected_module,
        stage: 1,
      });
      return;
    }
    if (this.submoduleList[0]?.parent_folder_id == 0) {
      this.moduleChange.emit({
        parent_id: 0,
        module_id: 1,
        selected_module: this.selected_module,
        stage: 1,
      });
      return;
    } else {
      this.paramData.parent_id = Number(localStorage.getItem("parent_id"));
      this.paramData.module_id = Number(localStorage.getItem("module_id"));
      this.getModules();
    }
  }
  download() {
    window.open(this.pdfURL, "_blank");
  }

  checkplanExpire(): void {
    if (
      this.authService._userSubscrition.time_left.plan === "expired" ||
      this.authService._userSubscrition.time_left.plan ===
        "subscription_expired"
    ) {
      this.planExpired = true;
    } else {
      this.planExpired = false;
    }
  }
}
