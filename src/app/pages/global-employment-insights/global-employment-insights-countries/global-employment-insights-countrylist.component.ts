import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ArrayHeaderService } from "../../unilearn/array-header.service";
import { GlobalEmploymentService } from "../global-employment-insights.service";
import { PageFacadeService } from "../../page-facade.service";
import { Router } from "@angular/router";

@Component({
  selector: "uni-global-employment-country-lists",
  templateUrl: "./global-employment-insights-countrylist.component.html",
  styleUrls: ["./global-employment-insights-countrylist.component.scss"],
  standalone: false
})
export class GlobalEmploymentCountryListsComponent implements OnInit {
  constructor(
    private router: Router,
    private arrayHeaderService: ArrayHeaderService,
    private service: GlobalEmploymentService,
    private pageFacade: PageFacadeService,
  ) { }
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
  page: number = 1;
  perpage: number = 50;
  totalDataCount: any = 0;
  init() {
    this.service.getcountrylists().subscribe((res: any) => {
      this.isSkeletonVisible = false;
      this.moduleList = res;
    });
  }
  paginate(event: any) {
    this.page = event.page + 1;
    this.perpage = event.rows;
    this.init();
  }
  backtoMain() {
    this.router.navigateByUrl("/pages/job-tool/career-tool");
  }
  openVideoPopup() {
    this.pageFacade.openHowitWorksVideoPopup("global-employment-insights");
  }
  onModuleClick(moduledata: any) {
    this.prepData = {
      country: moduledata.country,
      country_id: moduledata.id,
      stage: 2,
    }
    this.windowChange.emit({
      country: moduledata.country,
      country_id: moduledata.id,
      stage: 2,
    });
  }
}
