import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/Auth/auth.service';
import { DataService } from 'src/app/data.service';
import { LocationService } from 'src/app/location.service';
import { PageFacadeService } from '../../page-facade.service';
import { UserManagementService } from '../../user-management/user-management.service';
import { FounderstoolService } from '../founderstool.service';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '@env/environment';
import { Country } from 'ngx-intl-tel-input/lib/model/country.model';

@Component({
  selector: 'uni-goverment-funding-opportunity',
  templateUrl: './goverment-funding-opportunity.component.html',
  styleUrls: ['./goverment-funding-opportunity.component.scss']
})
export class GovermentFundingOppurtunityComponent implements OnInit {

  fundData: any[] =
    [
      {
        "id": 1,
        "name": "Fund Name",
        "country": "Country Name",
        "state": "State Name",
        "website": "https://example.com",
        "fundType": "Fund Type",
        "isSelected": true,
        "isFavorite": 1
      },
      {
        "id": 2,
        "name": "CSU Alumngive Scholarship",
        "country": "Country Name",
        "state": "State Name",
        "website": "https://example.com",
        "fundType": "Fund Type",
        "isSelected": false,
        "isFavorite": 0
      }
    ];
  countryList: Country[] = [];
  stateList: unknown = [];
  tempCountryList: unknown;
  headQuartersList: any;
  page = 1;
  pageSize = 25;
  first: number = 0;
  searchScholarshpName: string = "";
  totalFundCount: any;
  isFilterVisible: boolean = false;
  filterForm: FormGroup;
  homeCountryList: any[] = [];
  filterUniversityList: any[] = [];
  planExpired!: boolean;
  recommendRestrict!: boolean;
  fundTypeList: any[] = [
    {
      "id": 31,
      "type": "Angola",
      "flag": "https://flagcdn.com/ao.svg",
      "country_code": "+244"
    }
  ];;
  anyFundTypeList: any[] = [];
  coverList: any[] = [];
  anyCoverList: any[] = [];
  restrict: boolean = false;
  currentPlan: string = "";
  PersonalInfo!: any;
  viewFavouritesLabel: string = "View Favourites";
  allfundList: any[] = [];
  allFundCount: number = 0;
  selectAllCheckboxes: boolean = false;
  exportCreditCount: number = 0;
  exportDataIds: any = [];
  selectedFund: number = 0;
  favCount: number = 0;
  ehitlabelIsShow: boolean = true;
  imagewhitlabeldomainname: any;
  orglogowhitelabel: any;
  orgnamewhitlabel: any;
  data: any = {
    page: this.page,
    perpage: this.pageSize,
  };
  constructor(
    private fb: FormBuilder,
    private fundListService: FounderstoolService,
    private locationService: LocationService,
    private toast: MessageService,
    private authService: AuthService,
    private router: Router,
    private userManagementService: UserManagementService,
    private dataService: DataService,
    private pageFacade: PageFacadeService
  ) {
    this.filterForm = this.fb.group({
      country: [null],
      state: [null],
      type: [null],
    });
  }
  enableModule: boolean = false;
  activePageIndex: number = 0;
  recommendations: any = [
    {
      id: 1,
      question: "Select your Country",
    },
    {
      id: 2,
      question: "Select your State",
    },
    {
      id: 3,
      question: "Choose your Fund Type",
    },
  ];
  invalidClass: boolean = false;
  selectedData: { [key: string]: any } = {};

  ngOnInit(): void {
    this.locationService.getImage().subscribe(imageUrl => {
      this.orglogowhitelabel = imageUrl;
    });
    this.locationService.getOrgName().subscribe(orgname => {
      this.orgnamewhitlabel = orgname;
    });
    this.imagewhitlabeldomainname = window.location.hostname;
    if (this.imagewhitlabeldomainname === "dev-student.uniprep.ai" || this.imagewhitlabeldomainname === "uniprep.ai" || this.imagewhitlabeldomainname === "localhost") {
      this.ehitlabelIsShow = true;
    } else {
      this.ehitlabelIsShow = false;
    }
    this.checkUserRecommendation();
    this.getFundCountry();
    this.getStateListByCountry();
    this.checkplanExpire();
    this.getFundType();
    this.GetPersonalProfileData();
  }

  performSearch() {
    if (this.searchScholarshpName == "") {
      this.loadFundData(0);
      return;
    }
    var searchedFund: any = [];
    this.fundData.filter((item) => {
      if (item.name?.toLowerCase().includes(this.searchScholarshpName.toLowerCase())) {
        searchedFund.push(item);
      }
    });
    this.fundData = [...searchedFund];
  }

  clearFilter() {
    this.filterForm.reset();
    delete this.data.country;
    delete this.data.home_country;
    delete this.data.type;
    delete this.data.study_level;
    delete this.data.university;
    delete this.data.cover_id;

  }
  getFundCountry() {
    this.fundListService.getFundCountries().subscribe(res => {
      let allCountries = res;
      this.countryList = allCountries;
    });
  }

  getStateListByCountry() {
    this.fundListService.getFundStateByCountry().subscribe(
      (res: any) => {
        this.stateList = res;
      },
      (error: any) => {
        this.toast.add({
          severity: "warning",
          summary: "Warning",
          detail: error.error.message,
        });
      }
    );
  }


  getFundType() {
    this.fundListService.getFundType().subscribe((response) => {
      this.fundTypeList = response;
      this.anyFundTypeList = [...response, { id: "any", type: "Select All" }];
    });
  }


  loadFundData(isFavourite: number) {
    if (isFavourite == 1) {
      this.data = {}
      this.data['favourite'] = 1;
    } else {
      this.data['favourite'] = 0;
    }
    this.data.planname = this.currentPlan ? this.currentPlan : "";

    this.fundListService
      .getFundList(this.data)
      .subscribe((response) => {
        this.fundData = response.fund;
        this.favCount = response.favourite_count;
        if (isFavourite != 1) {
          this.allfundList = response.fund;
          this.allFundCount = response.count;
        }
        this.exportCreditCount = response.credit_count ? response.credit_count : 0;
        this.totalFundCount = response.count;
      });
    this.isFilterVisible = false;
  }
  applyFilter() {
    const formData = this.filterForm.value;
    console.log(this.data);
    if (!formData.home_country && !formData.country && !formData.study_level && !formData.university && !formData.type && !formData.valueRange && !formData.cover_id) {
      this.filterForm.reset();
      this.data = {
        page: this.page,
        perpage: this.pageSize,
      }
      this.loadFundData(0);
      this.isFilterVisible = false;
      return;
    }
    this.data.page = 1;
    this.data.perpage = 100;
    if (this.filterForm.value.country) {
      this.data.country = this.filterForm.value.country;
    }
    if (this.filterForm.value.home_country) {
      this.data.home_country = this.filterForm.value.home_country;
    }
    if (this.filterForm.value.type) {
      this.data.type = this.filterForm.value.type;
    }
    if (
      this.filterForm.value.study_level &&
      this.filterForm.value.study_level.length > 0
    ) {
      this.data.study_level = this.filterForm.value.study_level;
    }
    if (
      this.filterForm.value.university &&
      this.filterForm.value.university.length > 0
    ) {
      this.data.university = this.filterForm.value.university;
    }
    if (this.filterForm.value.cover_id) {
      this.data.cover_id = this.filterForm.value.cover_id;
    }
    this.first = 0;
    this.fundListService
      .getFundList(this.data)
      .subscribe((response) => {
        this.fundData = response.fund;
        this.totalFundCount = response.count;
      });
    this.isFilterVisible = false;
  }


  pageChange(event: any) {
    if (this.planExpired) {
      this.restrict = true;
      return;
    }
    this.selectAllCheckboxes = false;
    this.selectedFund = 0;
    this.page = event.first / this.pageSize + 1;
    this.pageSize = event.rows;
    this.first = event.first;
    this.data.page = this.page;
    this.data.perpage = this.pageSize;
    this.loadFundData(0);
  }

  closePopup() {
    this.isFilterVisible = false;
  }

  filterBy() {
    if (this.planExpired) {
      this.restrict = true;
      return;
    }
    this.isFilterVisible = true;
  }

  exportTable() { }

  checkplanExpire(): void {
    this.authService.getNewUserTimeLeft().subscribe((res) => {
      let data = res.time_left;
      let subscription_exists_status = res.subscription_details;
      this.currentPlan = subscription_exists_status?.subscription_plan;
      if (
        data.plan === "expired" || data.plan === 'subscription_expired' ||
        subscription_exists_status?.subscription_plan === "free_trail"
      ) {
        this.planExpired = true;
      } else {
        this.planExpired = false;
      }
      if (
        data.plan === "expired" || data.plan === 'subscription_expired'
      ) {
        this.recommendRestrict = true;
      } else {
        this.recommendRestrict = false;
      }


      this.loadFundData(0);
    });
  }

  upgradePlan(): void {
    this.router.navigate(["/pages/subscriptions"]);
  }
  clearRestriction() {
    this.restrict = false;
  }

  fundingGuidlines(): void {
    this.router.navigate(["/pages/fund-guidlines"]);
  }
  GetPersonalProfileData() {
    this.userManagementService.GetUserPersonalInfo().subscribe(data => {
      this.PersonalInfo = data;
    });
  }
  bookmarkQuestion(FundId: any, isFav: any) {
    isFav = isFav != '1' ? true : false;
    this.favCount = isFav == true ? this.favCount + 1 : this.favCount - 1;

    this.fundListService.addFavFundData(FundId, this.PersonalInfo.user_id, isFav).subscribe((response) => {
      let fundListData = this.fundData.find(item => item.id == FundId);
      isFav == true ? fundListData.favourite = 1 : fundListData.favourite = null;
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
      this.loadFundData(1);
    }
    else {
      let fundList = this.allfundList.map(fund => {
        let foundFund = this.fundData.find(s => s.id == fund.id);
        if (foundFund) {
          fund.favourite = foundFund.favourite;
        }
        return fund;
      });
      let favouriteFunds = fundList.filter(fund => fund.favourite === 1);
      let nonFavouriteFunds = fundList.filter(fund => fund.favourite !== 1);
      this.fundData = favouriteFunds.concat(nonFavouriteFunds);
      this.totalFundCount = this.allFundCount;
    }
  }

  openReport() {
    let data = {
      isVisible: true,
      reporttype: 4,
      moduleId: 4,
      report_mode: "other_module"
    };
    this.dataService.openReportWindow(data);

  }

  buyCredits(): void {
    if (this.planExpired) {
      this.restrict = true;
      return;
    }
    this.router.navigate(["/pages/export-credit"]);
  }

  selectAllCheckbox() {
    this.selectedFund = 0;
    this.selectAllCheckboxes = !this.selectAllCheckboxes;
    if (this.selectAllCheckboxes) {
      this.fundData.forEach(item => {
        item.isChecked = 1;
        this.selectedFund += 1;
      });
    } else {
      this.fundData.forEach(item => {
        item.isChecked = 0;
      });
    }
  }

  exportData() {
    if (this.planExpired) {
      this.restrict = true;
      return;
    } else if (this.exportCreditCount != 0) {
      this.exportDataIds = [];
      this.fundData.forEach(item => {
        if (item.isChecked == 1) {
          this.exportDataIds.push(item.id);
        }
      })
      if (this.exportDataIds.length == 0) {
        this.toast.add({ severity: "error", summary: "error", detail: "Select Some data for export!.", });
        return;
      }
      if (this.exportCreditCount < this.exportDataIds.length) {
        if (this.exportCreditCount < this.exportDataIds.length) {
          this.toast.add({ severity: "error", summary: "error", detail: "insufficient credits.Please Buy Some Credits.", });
          this.router.navigate(["/pages/export-credit"]);
          return;
        }
      } else {
        if (this.exportCreditCount < this.exportDataIds.length) {
          this.toast.add({ severity: "error", summary: "error", detail: "To download additional data beyond your free credits, please upgrade your plan.", });
          this.restrict = true;
          return;
        }
      }
      let data = {
        module_id: 3,
        export_id: this.exportDataIds
      };
      this.fundListService.exportSelectedData(data).subscribe((response) => {
        window.open(response.link, '_blank');
        this.selectAllCheckboxes = false;
        // this.selectedCheckboxCount = 0;
        this.selectedFund = 0;
        this.loadFundData(0);
      })
    } else if (this.exportCreditCount == 0) {
      if (this.imagewhitlabeldomainname === "dev-student.uniprep.ai" || this.imagewhitlabeldomainname === "uniprep.ai" || this.imagewhitlabeldomainname === "localhost") {
        this.toast.add({ severity: "error", summary: "error", detail: "Please Buy Some Credits.", });
        this.router.navigate(["/pages/export-credit"]);
      } else {
        this.restrict = true;
      }
    }

  }

  onCheckboxChange(event: any) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.selectedFund = isChecked ? this.selectedFund + 1 : this.selectedFund - 1;
    if (isChecked == false) {
      if (this.selectedFund) {
        this.selectAllCheckboxes = false;
      }
    } else {
      if (this.fundData.length == this.selectedFund) {
        this.selectAllCheckboxes = true;
      }
    }
  }

  openHowItWorksVideoPopup(videoLink: string) {
    this.pageFacade.openHowitWorksVideoPopup(videoLink);
  }

  checkUserRecommendation() {
    this.fundListService.getRecommendations().subscribe(res => {
      if (res.status) {
        this.enableModule = true;
        this.setRecommendationToForm(res.data);
      } else {
        this.enableModule = false;
        // this.addAnyValueToOptions();
      }
    });
  }

  setRecommendationToForm(data: any) {
    this.filterForm.patchValue(data);
    this.applyFilter();
  }

  getRecommendation() {
    if (this.recommendRestrict) {
      this.restrict = true;
      return;
    }
    let keyMapping: any = { "1": "country", "2": "state", "3": "type" };
    let newData = Object.fromEntries(Object.entries(this.selectedData).map(([key, value]) => {
      let mappedKey = keyMapping[key] || key;
      if (Array.isArray(value)) {
        value = value.filter(item => item !== null);
      }
      return [mappedKey, value];
    }));
    this.fundListService.storeRecommendation(newData).subscribe();
    this.enableModule = true;
    this.setRecommendationToForm(newData);
  }

  previous(): void {
    this.invalidClass = false;
    if (this.activePageIndex > 0) {
      this.activePageIndex--;
    }
  }

  next(productId: number): void {
    this.invalidClass = false;
    if (productId in this.selectedData) {
      if (this.activePageIndex < this.recommendations.length - 1) {
        this.activePageIndex++;
      }
    } else {
      this.invalidClass = true;
    }
  }

  selectCube(key: number, id: number | string) {
    if (id === "any") {
      if (this.selectedData[key]?.includes(id)) {
        this.selectedData[key] = [];
      } else {
        if (key === 3) {
          this.selectedData[key] = this.anyFundTypeList.map((cube: any) => cube.id);
        } else if (key === 4) {
          this.selectedData[key] = this.anyCoverList.map((cube: any) => cube.id);
        }

      }
    } else {
      // this.selectedData[key] = [id];
      if (!Array.isArray(this.selectedData[key])) {
        this.selectedData[key] = [];
      }

      const index = this.selectedData[key].indexOf(id);
      if (index > -1) {
        this.selectedData[key].splice(index, 1);
      } else {
        this.selectedData[key].push(id);
      }
    }
    // console.log(this.selectedData, "selected cube");
  }

  resetRecommendation() {
    this.fundListService.resetRecommendation().subscribe(res => {
      this.enableModule = false;
      this.filterForm.reset();
      this.selectedData = {};
      this.activePageIndex = 0;
      this.viewFavouritesLabel = "View Favourites";
      this.data.favourite = 0;
      // this.addAnyValueToOptions();
    });
  }
}
