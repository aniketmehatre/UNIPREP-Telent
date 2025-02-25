import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ArrayHeaderService } from "../../unilearn/array-header.service";
import { FortuneCompaniesService } from "../fortune-companies.service";
import { PageFacadeService } from "../../page-facade.service";
import { Router } from "@angular/router";
import { count } from "console";

@Component({
  selector: "uni-fortune-companies-lists",
  templateUrl: "./fortune-companies-list.component.html",
  styleUrls: ["./fortune-companies-list.component.scss"],
})
export class FortuneCompaniesListsComponent implements OnInit {
  constructor(
    private router: Router,
    private arrayHeaderService: ArrayHeaderService,
    private service: FortuneCompaniesService,
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
  page: number = 1;
  perpage: number = 50;
  totalDataCount: any = 0;
  init() {
    this.service
      .getfortunecompanieslists({ perpage: this.perpage, page: this.page })
      .subscribe((res: any) => {
        this.isSkeletonVisible = false;
        this.totalDataCount = res.total_count;
        this.moduleList = res.data;
      });
  }
  valueNearYouFilter = "";
  performSearch() {
    const searchValue = this.valueNearYouFilter.toLowerCase();
    if (searchValue == "") {
      this.init();
    }
    if (searchValue.length >= 4) {
      this.service
        .getfortunecompanieslists({
          perpage: this.perpage,
          page: this.page,
          search: searchValue,
        })
        .subscribe((res: any) => {
          this.isSkeletonVisible = false;
          this.totalDataCount = res.total_count;
          this.moduleList = res.data;
        });
    }
  }
  paginate(event: any) {
    this.page = event.page + 1;
    this.perpage = event.rows;
    this.init();
  }
  backtoMain() {
    this.router.navigateByUrl("/pages/job-tool/career-tool");
  }
  openVideoPopup(videoLink: string) {
    this.pageFacade.openHowitWorksVideoPopup(videoLink);
  }
  onModuleClick(moduledata: any) {
    this.prepData = {
      fortune_company_id: moduledata.id,
      companyName: moduledata.company_name,
      stage: 2,
    };
    this.windowChange.emit({
      fortune_company_id: moduledata.id,
      companyName: moduledata.company_name,
      stage: 2,
    });
  }
}
