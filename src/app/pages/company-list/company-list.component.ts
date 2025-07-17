import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
// import { Location } from "@angular/common";
import { CompanyListService } from "./company-list.service";
import { AuthService } from 'src/app/Auth/auth.service';
import { Route, Router } from '@angular/router';
import { UserManagementService } from '../user-management/user-management.service';
import { MessageService } from 'primeng/api';
import { DataService } from 'src/app/services/data.service';
import { PageFacadeService } from '../page-facade.service';
import { LocationService } from 'src/app/services/location.service';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { Paginator, PaginatorModule } from 'primeng/paginator';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
@Component({
  selector: 'uni-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.scss'],
  standalone: true,
  imports: [CommonModule, DialogModule, MultiSelectModule, FormsModule, ReactiveFormsModule, CarouselModule, ButtonModule, CommonModule, RouterModule, DialogModule, MultiSelectModule, CardModule, InputGroupModule, InputTextModule, InputGroupAddonModule, Paginator],
})
export class CompanyListComponent implements OnInit {
  companyListData: any[] = []
  industryInterested: any;
  countryList: any;
  headQuartersList: any;
  anyHeadquartersList: any;
  page = 1;
  pageSize = 50;
  valueNearYouFilter: string = '';
  totalCompanyCount: any;
  isFilterVisible: string = 'none';
  filterForm: FormGroup;
  restrict: boolean = false;
  currentPlan: string = "";
  PersonalInfo!: any;
  viewFavouritesLabel: string = "View Favourites";
  allCompanyList: any[] = [];
  allCompanyCount: number = 0;
  selectedCompanies: number = 0;
  selectAllCheckboxes = false;
  exportDataIds: any[] = [];
  exportCreditCount: number = 0;
  favCount: number = 0;
  imagewhitlabeldomainname: any;
  enableModule: boolean = false;
  activePageIndex: number = 0;
  recommendations: any = [
    {
      id: 1,
      question: "Select your preferred Industry",
    },
    {
      id: 2,
      question: "Select your country of interest for company search",
    },
    {
      id: 3,
      question: "Select the location of the headquarters",
    },
  ];

  invalidClass: boolean = false;
  selectedData: { [key: string]: any } = {};

  constructor(
    // private _location: Location,
    private fb: FormBuilder,
    private companyListService: CompanyListService,
    private authService: AuthService,
    private router: Router,
    private userManagementService: UserManagementService,
    private toast: MessageService,
    private dataService: DataService,
    private pageFacade: PageFacadeService,
    private locationService: LocationService,
  ) {
    this.filterForm = this.fb.group({
      company_name: [''],
      country: [''],
      head_quarters: [''],
      // fromdate: [''],
      // todate: [''],
      industry_interested: [''],
    });
  }

  ngOnInit(): void {
    this.loadMultiSelectData();
    this.GetPersonalProfileData();
    this.checkRecommendation();
  }

  // goBack() {
  //   this._location.back();
  // }

  performSearch(events: any) {
    if (this.valueNearYouFilter == "") {
      this.loadCompanyData(0);
      return;
    }
    var companySearchData: any = [];
    this.companyListData.filter(item => {
      if (item.company_name?.toLowerCase().includes(this.valueNearYouFilter.toLowerCase())) {
        companySearchData.push(item);
      }
    });
    this.companyListData = [...companySearchData];
  }

  searchClick() {
    this.valueNearYouFilter = "";
    let searchInput = document.getElementById("searchInput") as HTMLInputElement;;
    if (searchInput !== null) {
      searchInput.disabled = true;
    }
  }
  loadMultiSelectData() {
    this.companyListService.getMultiSelectData().subscribe((response) => {
      this.industryInterested = response.company_industry;
      this.countryList = response.countries_list;
    });
  }

  // resetFilter(){
  //   this.filterForm.reset();
  //   this.loadInvestorData();
  // }

  clearFilter() {
    this.filterForm.reset();
    this.loadCompanyData(0);
  }

  loadCompanyData(isFavourite: number) {
    let data: any;
    if (isFavourite == 1) {
      data = {
        favourite: 1,
        page: this.page,
        perpage: this.pageSize
      }
    } else {
      data = {
        company_name: this.filterForm.value.company_name ? this.filterForm.value.company_name : '',
        country: this.filterForm.value.country ? this.filterForm.value.country : '',
        head_quarters: this.filterForm.value.head_quarters ? this.filterForm.value.head_quarters : '',
        industry_interested: this.filterForm.value.industry_interested ? this.filterForm.value.industry_interested : '',
        planname: this.currentPlan ? this.currentPlan : "",
        page: this.page,
        perpage: this.pageSize
      }
    }
    this.companyListService.getCompanyList(data).subscribe((response) => {
      this.companyListData = response.data;
      this.favCount = response.favourite_count;
      this.exportCreditCount = response.credit_count ? response.credit_count : 0;
      if (isFavourite != 1) {
        this.allCompanyList = response.data;
        this.allCompanyCount = response.count;
      }
      this.totalCompanyCount = response.count;
    });
    this.isFilterVisible = 'none'
  }

  pageChange(event: any) {
    this.selectAllCheckboxes = false;
    this.selectedCompanies = 0;
    this.page = event.page + 1;
    this.pageSize = event.rows;
    this.loadCompanyData(0);
  }

  closePopup() {
    this.isFilterVisible = 'none'

  }

  filterBy() {
    this.isFilterVisible = 'block';
  }

  exportTable() {
    this.companyListService.export().subscribe((response) => {
      window.open(response.link, '_blank');
    });
  }

  companyGuidlines(): void {
    this.router.navigate(["/pages/company-guidlines"]);
  }

  upgradePlan(): void {
    this.router.navigate(["/pages/subscriptions"]);
  }

  loadHeadQuartersData(event: any) {
    this.companyListService.getHeadQuartersList(event.value).subscribe((response) => {
      this.headQuartersList = response;
      // this.anyHeadquartersList = [...response];
      // let anyCountryArray: any = {id: null, head_quarters_name: "any"};
      // this.anyHeadquartersList.unshift(anyCountryArray);
    });
  }
  GetPersonalProfileData() {
    this.userManagementService.GetUserPersonalInfo().subscribe(data => {
      this.PersonalInfo = data;
    });
  }
  bookmarkQuestion(companyId: any, isFav: any) {
    isFav = isFav != '1' ? true : false;
    this.favCount = isFav == true ? this.favCount + 1 : this.favCount - 1;
    this.companyListService.bookmarkCompanyData(companyId, this.PersonalInfo.user_id, isFav).subscribe((response) => {
      let companyData = this.companyListData.find(item => item.id == companyId);
      isFav == true ? companyData.favourite = 1 : companyData.favourite = null;
      this.toast.add({
        severity: "success",
        summary: "Success",
        detail: response.message,
      });
    });
  }
  viewFavourites() {
    this.viewFavouritesLabel = this.viewFavouritesLabel == 'View Favourites' ? 'View All' : 'View Favourites';
    if (this.viewFavouritesLabel == "View All") {
      this.loadCompanyData(1);
    }
    else {
      let companyList = this.allCompanyList.map(company => {
        let foundCompany = this.companyListData.find(s => s.id == company.id);
        if (foundCompany) {
          company.favourite = foundCompany.favourite;
        }
        return company;
      });
      let favouriteCompany = companyList.filter(company => company.favourite === 1);
      let nonFavouriteCompany = companyList.filter(company => company.favourite !== 1);
      this.companyListData = favouriteCompany.concat(nonFavouriteCompany);
      this.totalCompanyCount = this.companyListData.length;
      this.totalCompanyCount = this.allCompanyCount;
    }
  }

  buyCredits(): void {
    if (this.authService.isInvalidSubscription('career_tools')) {
      this.authService.hasUserSubscription$.next(true);
      return;
    }
    this.router.navigate(["/pages/export-credit"]);
  }

  selectAllCheckbox() {
    this.selectedCompanies = 0;
    this.selectAllCheckboxes = !this.selectAllCheckboxes;
    if (this.selectAllCheckboxes) {
      this.companyListData.forEach(item => {
        item.isChecked = 1;
        this.selectedCompanies += 1;
      })
    } else {
      this.companyListData.forEach(item => {
        item.isChecked = 0;
      });
    }
  }

  onCheckboxChange(event: any) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.selectedCompanies = isChecked ? this.selectedCompanies + 1 : this.selectedCompanies - 1;

    if (isChecked == false) {
      if (this.selectedCompanies) {
        this.selectAllCheckboxes = false;
      }
    } else {
      if (this.companyListData.length == this.selectedCompanies) {
        this.selectAllCheckboxes = true;
      }
    }
  }

  exportData() {
    if (this.authService.isInvalidSubscription('career_tools')) {
      this.authService.hasUserSubscription$.next(true);
      return;
    }
    else if (this.exportCreditCount != 0) {
      this.exportDataIds = [];
      this.companyListData.forEach(item => {
        if (item.isChecked == 1) {
          this.exportDataIds.push(item.id);
        }
      })
      if (this.exportDataIds.length == 0) {
        this.toast.add({ severity: "error", summary: "error", detail: "Select Some data for export!.", });
        return;
      }

      if (this.imagewhitlabeldomainname === "*.uniprep.ai" || this.imagewhitlabeldomainname === "dev-student.uniprep.ai" || this.imagewhitlabeldomainname === "uniprep.ai" || this.imagewhitlabeldomainname === "localhost") {
        if (this.exportCreditCount < this.exportDataIds.length) {
          this.toast.add({ severity: "error", summary: "error", detail: "insufficient credits.Please Buy Some Credits.", });
          this.router.navigate(["/pages/export-credit"]);
          return;
        }
      } else {
        if (this.exportCreditCount < this.exportDataIds.length) {
          this.toast.add({ severity: "error", summary: "error", detail: "To download additional data beyond your free credits, please upgrade your plan.", });
          this.authService.hasUserSubscription$.next(true);
          return;
        }
      }
      let data = {
        module_id: 2,
        export_id: this.exportDataIds
      };
      this.companyListService.exportSelectedData(data).subscribe((response) => {
        window.open(response.link, '_blank');
        this.selectAllCheckboxes = false;
        this.selectedCompanies = 0;
        this.loadCompanyData(0);
      })
    } else if (this.exportCreditCount == 0) {
      if (this.imagewhitlabeldomainname === "*.uniprep.ai" || this.imagewhitlabeldomainname === "dev-student.uniprep.ai" || this.imagewhitlabeldomainname === "uniprep.ai" || this.imagewhitlabeldomainname === "localhost") {
        this.toast.add({ severity: "error", summary: "error", detail: "Please Buy Some Credits.", });
        this.router.navigate(["/pages/export-credit"]);
      } else {
        this.authService.hasUserSubscription$.next(true);
      }
    }

  }

  openReport() {

    let data = {
      isVisible: true,
      reporttype: 6,
      moduleId: 6,
      report_mode: "other_module"
    };
    this.dataService.openReportWindow(data);

  }

  openVideoPopup() {
    this.pageFacade.openHowitWorksVideoPopup("company-list");
  }

  previous(): void {
    this.invalidClass = false;
    if (this.activePageIndex > 0) {
      this.activePageIndex--;
    }
  }

  next(productId: number): void {
    if (this.authService.isInvalidSubscription('career_tools')) {
      this.authService.hasUserSubscription$.next(true);
      return;
    }
    this.invalidClass = false;
    if (productId in this.selectedData) {
      if (this.activePageIndex < this.recommendations.length - 1) {
        this.activePageIndex++;
      }
    } else {
      this.invalidClass = true;
    }
  }
  getRecommendation() {
    this.enableModule = true;
    let keyMapping: any = { "1": "industry_interested", "2": "country", "3": "head_quarters" };

    let newData = Object.fromEntries(Object.entries(this.selectedData).map(([key, value]) => {
      let mappedKey = keyMapping[key] || key;
      if (Array.isArray(value)) {
        value = value.filter(item => item !== null);
      }
      return [mappedKey, value];
    }));
    this.companyListService.storeRecommendation(newData).subscribe();
    this.setRecommendationToForm(newData);
  }

  setRecommendationToForm(data: any) {
    this.filterForm.patchValue(data);
    this.loadCompanyData(0);

  }
  resetRecommendation() {
    this.companyListService.resetRecommendation().subscribe(res => {
      this.activePageIndex = 0;
      this.enableModule = false;
      this.selectedData = {};
      this.viewFavouritesLabel = "View Favourites";
    });
  }

  checkRecommendation() {
    this.companyListService.getStoredRecommendation().subscribe(res => {
      if (res.status) {
        this.enableModule = true;
        this.setRecommendationToForm(res.data);
      } else {
        this.enableModule = false;
      }
    });
  }

  goBack() {
    this.router.navigate(['/pages/job-tool/career-tool']);
  }
}

