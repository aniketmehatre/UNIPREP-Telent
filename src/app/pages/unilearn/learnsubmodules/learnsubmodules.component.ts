import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { PageFacadeService } from "../../page-facade.service";
import { learnModules, learnsubModules, submoduledata } from "../unilearn.model";
import { UniLearnService } from "../unilearn.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ArrayHeaderService } from "../array-header.service";
import { Location } from "@angular/common";
import { AuthService } from "src/app/Auth/auth.service";
import { DialogModule } from "primeng/dialog";
import { NgxExtendedPdfViewerModule } from "ngx-extended-pdf-viewer";
@Component({
  selector: "uni-learnsubmodules",
  templateUrl: "./learnsubmodules.component.html",
  styleUrls: ["./learnsubmodules.component.scss"],
  imports: [DialogModule,CommonModule,NgxExtendedPdfViewerModule],
    standalone: true,
})
export class LearnsubModulesComponent implements OnInit {
  @Input() parentid: number;
  @Input() moduleid: number;
  @Input() selected_module: string;
  @Output() moduleChange = new EventEmitter();
  isSkeletonVisible: boolean = true;
  submoduleList: any;
  constructor(private pageFacade: PageFacadeService, private authService: AuthService, private router: Router, private arrayHeaderService: ArrayHeaderService, private learnService: UniLearnService, private route: ActivatedRoute, private cdRef: ChangeDetectorRef) {
    // this.route.params.subscribe(() => {
    //   console.log('asfdasdf', this.arrayHeaderService.getItems().length)
    //
    //   this.cdRef.detectChanges();
    // });
  }
  loopRange = Array.from({ length: 30 })
    .fill(0)
    .map((_, index) => index);
  paramData: any;
  planExpired: boolean = false;
  restrict: boolean = false;
  ehitlabelIsShow: boolean = true;
  orgnamewhitlabel: any;
  orglogowhitelabel: any;
  imagewhitlabeldomainname: any;
  ngOnInit(): void {
    this.paramData = { parent_id: this.parentid, module_id: this.moduleid };
    this.getModules();
    this.checkplanExpire();
    this.imagewhitlabeldomainname = window.location.hostname;
    if (this.imagewhitlabeldomainname === "dev-student.uniprep.ai" || this.imagewhitlabeldomainname === "uniprep.ai" || this.imagewhitlabeldomainname === "localhost") {
      this.ehitlabelIsShow = true;
    } else {
      this.ehitlabelIsShow = false;
    }
  }
  getFormattedValues(): string {
    return this.arrayHeaderService.getItems().join(" -> ");
  }
  getModules() {
    this.learnService.getUniLearnsubModules(this.paramData).subscribe((res: learnsubModules) => {
      this.isSkeletonVisible = false;
      this.submoduleList = res.data;
      localStorage.setItem("parent_id", String(res.previous_id));
    });
  }
  openVideoPopup(videoLink: string) {
    this.pageFacade.openHowitWorksVideoPopup(videoLink);
  }
  pdfURL: any;
  pdfvisibility = false;
  onModuleClick(moduledata: submoduledata) {
    if (moduledata.isTestmodule == 1) {
      this.arrayHeaderService.addItem(moduledata.submodule_name);
      this.moduleChange.emit({
        parent_id: moduledata.id,
        module_id: moduledata.module_id,
        selected_module: moduledata.submodule_name,
        stage: 3,
        isfromquizinfo: false,
      });
      return;
    }
    this.arrayHeaderService.addItem(moduledata.submodule_name);
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
        this.pageFacade.openHowitWorksVideoPopup(moduledata.attachment_filename);
        break;
      case 4:
        break;
      default:
        this.getModules();
        break;
    }
  }
  backtoMain() {
    this.arrayHeaderService.removeItem(this.arrayHeaderService.getItems().length - 1);
    this.getFormattedValues();
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
    if (this.planExpired) {
      this.restrict = true;
      return;
    }
    window.open(this.pdfURL, "_blank");
  }
  checkplanExpire(): void {
    this.authService.getNewUserTimeLeft().subscribe((res) => {
      let data = res.time_left;
      let subscription_exists_status = res.subscription_details;
      if (data.plan === "expired" || data.plan === "subscription_expired") {
        this.planExpired = true;
      } else {
        this.planExpired = false;
      }
    });
  }
  upgradePlan(): void {
    this.router.navigate(["/pages/subscriptions"]);
  }
  clearRestriction() {
    this.restrict = false;
  }
}
