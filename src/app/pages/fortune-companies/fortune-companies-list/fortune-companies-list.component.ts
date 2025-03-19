import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from "@angular/core";
import { ArrayHeaderService } from "../../unilearn/array-header.service";
import { FortuneCompaniesService } from "../fortune-companies.service";
import { PageFacadeService } from "../../page-facade.service";
import { Router } from "@angular/router";
import { count } from "console";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { DialogModule } from "primeng/dialog";
import { PaginatorModule } from "primeng/paginator";
import { FormsModule } from "@angular/forms";
import { Skeleton } from "primeng/skeleton";
import { LocationService } from "src/app/location.service";

@Component({
  selector: "uni-fortune-companies-lists",
  templateUrl: "./fortune-companies-list.component.html",
  styleUrls: ["./fortune-companies-list.component.scss"],
  standalone: false,
})
export class FortuneCompaniesListsComponent implements OnInit {
  constructor(
    private router: Router,
    private arrayHeaderService: ArrayHeaderService,
    private service: FortuneCompaniesService,
    private pageFacade: PageFacadeService,
    private locationService: LocationService
  ) {}
  countryLists: any[] = [];
  selectedCountryId: any = 0;
  isSkeletonVisible: boolean = true;
  moduleList: any;
  @Input() prepData: any;
  @Output() windowChange = new EventEmitter();
  loopRange = Array.from({ length: 30 })
    .fill(0)
    .map((_, index) => index);

  ngOnInit(): void {
    this.init();
    this.locationService
      .dashboardLocationList()
      .subscribe((countryList: any) => {
        this.countryLists = countryList;
      });
    this.arrayHeaderService.clearAll();
  }
  selectCountry(selectedId: any): void {
    this.countryLists.forEach((element: any) => {
      if (element.id === selectedId) {
        // element.id
        this.service
          .getfortunecompanieslists({
            perpage: this.perpage,
            page: this.page,
            country: element.id,
          })
          .subscribe((res: any) => {
            this.isSkeletonVisible = false;
            this.totalDataCount = res.total_count;
            this.moduleList = res.data;
          });
      }
    });
    this.countryLists.forEach((item: any, i: any) => {
      if (item.id === selectedId) {
        this.countryLists.splice(i, 1);
        this.countryLists.unshift(item);
      }
    });
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
