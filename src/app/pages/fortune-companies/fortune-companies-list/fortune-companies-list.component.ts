import {
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
import { debounceTime, Subject } from "rxjs";
import { AuthService } from "src/app/Auth/auth.service";
import { FormBuilder, FormGroup } from "@angular/forms";
import { CompanyListService } from "../../company-list/company-list.service";

@Component({
  selector: "uni-fortune-companies-lists",
  templateUrl: "./fortune-companies-list.component.html",
  styleUrls: ["./fortune-companies-list.component.scss"],
  standalone: false,
})
export class FortuneCompaniesListsComponent implements OnInit {

  countryLists: any[] = [];
  selectedCountryId: any = null;
  isSkeletonVisible: boolean = true;
  moduleList: any;
  @Input() prepData: any;
  @Output() windowChange = new EventEmitter();
  loopRange = Array.from({ length: 30 }).fill(0).map((_, index) => index);
  page: number = 1;
  perpage: number = 50;
  totalDataCount: any = 0;
  valueNearYouFilter = "";
  searchSubject = new Subject<string>();
  filterForm: FormGroup;
  isFilterVisible:boolean=false;
  industryInterested: any;
  employerSizeOptions:any[] = [];
  headQuartersList: any;
  constructor(
    private router: Router,
    private arrayHeaderService: ArrayHeaderService,
    private service: FortuneCompaniesService,
    private pageFacade: PageFacadeService,
    private authService: AuthService,
    private fb: FormBuilder,
    private companyListService: CompanyListService,
  ) {
    this.searchSubject.pipe(debounceTime(1000)).subscribe(() => {
      this.getFortuneCompanyList();
    });
    this.filterForm = this.fb.group({
      searchinput: [''],
      country: [''],
      industry_interested: [''],
      employer_size:[''],
      startYear:[''],
      endYear:[''],
      location:[''],
    });
  }

  ngOnInit(): void {
    this.initFortuneCompanyList();
    this.getCountryList();
    this.arrayHeaderService.clearAll();
    this.loadMultiSelectData();
    this.employerSizeOptions = [
      { label: '50+', value: '50+' },
      { label: '100+', value: '100+' },
      { label: '200+', value: '200+' },
      { label: '500+', value: '500+' },
      { label: '1000+', value: '1000+' },
      { label: '2000+', value: '2000+' },
      { label: '5000+', value: '5000+' },
      { label: '10000+', value: '1000-+' }
    ];
  }
  loadMultiSelectData() {
    this.companyListService.getMultiSelectData().subscribe((response) => {
      this.industryInterested = response.company_industry;
      // this.countryList = response.countries_list;
    });
  }
  initFortuneCompanyList() {
    this.selectedCountryId = this.prepData?.countryId;
    this.valueNearYouFilter = this.prepData?.searchText;
    this.getFortuneCompanyList();
  }
  getFortuneCompanyList() {
    var data = {
      page: this.page,
      perPage: this.perpage,
      country: this.filterForm.value.country,
      search: this.filterForm.value.searchinput,
      industry:this.filterForm.value.industry_interested,
      end_year: this.filterForm.value.endYear,
      start_year: this.filterForm.value.startYear,
      size:this.filterForm.value.employer_size,
      hq:this.filterForm.value.location,
    }
    this.service.getfortunecompanieslists(data).subscribe((res) => {
      this.isSkeletonVisible = false;
      this.totalDataCount = res.total_count;
      this.moduleList = res.data;
    });
  }

  getCountryList() {
    this.service.getfortunecompaniescountrylists().subscribe((countryList: any) => {
      this.countryLists = countryList;
    });
  }

  selectCountry(selectedId: any): void {
    if (this.authService.isInvalidSubscription('career_tools')) {
      this.authService.hasUserSubscription$.next(true);
      return;
    }
    this.getFortuneCompanyList();
  }

  performSearch() {
    if (this.authService.isInvalidSubscription('career_tools')) {
      this.authService.hasUserSubscription$.next(true);
      return;
    }
    this.searchSubject.next(this.valueNearYouFilter);
  }

  paginate(event: any) {
    if (this.authService.isInvalidSubscription('career_tools')) {
      this.authService.hasUserSubscription$.next(true);
      return;
    }
    this.page = event.page + 1;
    this.perpage = event.rows;
    this.getFortuneCompanyList();
  }

  onClear(event: Event) {
    if (this.authService.isInvalidSubscription('career_tools')) {
      this.authService.hasUserSubscription$.next(true);
      return;
    }
    this.selectedCountryId = null;
    this.getFortuneCompanyList();
  }

  backtoMain() {
    this.router.navigateByUrl("/pages/job-tool/career-tool");
  }

  openVideoPopup(videoLink: string) {
    this.pageFacade.openHowitWorksVideoPopup(videoLink);
  }

  onModuleClick(moduledata: any) {
    if (this.authService.isInvalidSubscription('career_tools')) {
      this.authService.hasUserSubscription$.next(true);
      return;
    }
    this.prepData = {
      fortune_company_id: moduledata.id,
      companyName: moduledata.company_name,
      stage: 2,
    };
    this.windowChange.emit({
      fortune_company_id: moduledata.id,
      companyName: moduledata.company_name,
      stage: 2,
      countryId: this.selectedCountryId,
      searchText: this.valueNearYouFilter
    });
  }
  clearFilter(){
    this.filterForm.reset();
    this.getFortuneCompanyList()
  }
  filterBy(){
    this.isFilterVisible=true;
  }
  loadCompanyData(){
    this.getFortuneCompanyList()
  }
  loadHeadQuartersData(event: any) {
    this.companyListService.getHeadQuartersList(event.value).subscribe((response) => {
      this.headQuartersList = response;
    });
  }
}
