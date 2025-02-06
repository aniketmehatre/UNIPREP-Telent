import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ArrayHeaderService } from "../../unilearn/array-header.service";
import { JobseekerSuccessStoriesService } from "../job-seeker-success-stories.service";
import { PageFacadeService } from "../../page-facade.service";
import { Router } from "@angular/router";
import { count } from "console";
import { CommonModule } from "@angular/common";
import { DialogModule } from "primeng/dialog";
@Component({
  selector: "uni-seekercountries",
  templateUrl: "./seekercountries.component.html",
  styleUrls: ["./seekercountries.component.scss"],
  standalone: true,
  imports: [CommonModule, DialogModule]
})
export class SeekercountriesComponent implements OnInit {
  constructor(
    private router: Router,
    private arrayHeaderService: ArrayHeaderService,
    private service: JobseekerSuccessStoriesService,
    private pageFacade: PageFacadeService
  ) {}
  isSkeletonVisible: boolean = true;
  moduleList: any;
  @Input() prepData: any;
  @Output() windowChange = new EventEmitter();
  loopRange = Array.from({ length: 30 })
    .fill(0)
    .map((_, index) => index);

  ngOnInit(): void {
    this.init();
    this.arrayHeaderService.clearAll();
  }
  init() {
    this.service.getjobseekerstoriesCountries().subscribe((res: any) => {
      this.isSkeletonVisible = false;
      this.moduleList = res;
    });
  }
  backtoMain() {
    this.router.navigateByUrl("/pages/job-tool/career-tool");
  }
  openVideoPopup(videoLink: string) {
    this.pageFacade.openHowitWorksVideoPopup(videoLink);
  }
  onModuleClick(moduledata: any) {
    this.prepData={
      country_id: moduledata.id,
      stage: 2,
    }
    this.windowChange.emit({
      country_id: moduledata.id,
      stage: 2,
    });
  }
}
