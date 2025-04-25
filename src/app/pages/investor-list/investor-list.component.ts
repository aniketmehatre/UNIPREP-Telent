import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { InvestorListService } from "./investor-list.service";
import { AuthService } from 'src/app/Auth/auth.service';
import { Router } from '@angular/router';
import { UserManagementService } from '../user-management/user-management.service';
import { MessageService } from 'primeng/api';
import { DataService } from 'src/app/data.service';
import { PageFacadeService } from '../page-facade.service';
import { LocationService } from 'src/app/location.service';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { PaginatorModule } from 'primeng/paginator';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
@Component({
  selector: 'uni-investor-list',
  templateUrl: './investor-list.component.html',
  styleUrls: ['./investor-list.component.scss'],
  standalone: true,
  imports: [CommonModule, DialogModule, MultiSelectModule, FormsModule, ReactiveFormsModule, RouterModule, CardModule, PaginatorModule, CarouselModule, ButtonModule, SelectModule, InputGroupModule, InputTextModule, InputGroupAddonModule],
})
export class InvestorListComponent implements OnInit {
  investorData: any[] = []
  investorIndustryInterested: any;
  // investorOrgType: any;
  investorType: any;
  countryList: any;
  headQuartersList: any;
  // anyHeadquartersList: any;
  page = 1;
  pageSize = 50;
  totalInvestorCount = 0;
  valueNearYouFilter: string = '';
  totalInvestorsCount: any;
  isFilterVisible: string = 'none';
  filterForm: FormGroup;
  planExpired!: boolean;
  currentPlan: string = "";
  isBookmarked: boolean = false;
  PersonalInfo!: any;
  viewFavouritesLabel: string = "View Favourites";
  allInvestorList: any[] = [];
  allInvestorCount: number = 0;
  selectedInvestors: number = 0;
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
      question: "What type of an investor are you looking for?",
    },
    {
      id: 2,
      question: "What is the preferred country of the investor?",
    },
    {
      id: 3,
      question: "What is the preferred headquaters location?",
    },
  ];

  invalidClass: boolean = false;
  selectedData: { [key: string]: any } = {};


  constructor(
    private _location: Location,
    private fb: FormBuilder,
    private investorList: InvestorListService,
    private authService: AuthService,
    private router: Router,
    private userManagementService: UserManagementService,
    private toast: MessageService,
    private dataService: DataService,
    private pageFacade: PageFacadeService,
    private locationService: LocationService,
  ) {
    this.filterForm = this.fb.group({
      org_name: [''],
      country: [''],
      head_quarters: [''],
      investor_type: [''],
      industry_interested: [''],
    });
  }

  ngOnInit(): void {
    this.loadMultiSelectData();
    this.checkplanExpire();
    this.GetPersonalProfileData();
    this.getStoredRecommendation();
  }

  goBack() {
    this._location.back();
  }

  // performSearch(events: any) {
  //   if (this.valueNearYouFilter == "") {
  //     this.loadInvestorData(0);
  //     return;
  //   }
  //   var investorSearchData: any = [];
  //   this.investorData.filter(item => {
  //     if (item.org_name?.toLowerCase().includes(this.valueNearYouFilter.toLowerCase())) {
  //       investorSearchData.push(item);
  //     };
  //   });
  //   this.investorData = [...investorSearchData];
  // }

  performSearch() {
    if (this.valueNearYouFilter === "") {
      this.loadInvestorData(0);
      return;
    }
    else {
      var investorSearchData: any = [];
      this.investorData.filter(item => {
        if (item.org_name?.toLowerCase().includes(this.valueNearYouFilter.toLowerCase())) {
          investorSearchData.push(item);
        };
      });
      this.investorData = [...investorSearchData];
      const filteredData = this.investorData.filter((item: any) => {

        return item.org_name.toLowerCase().includes(this.valueNearYouFilter.toLowerCase()) ||
          item.country.toLowerCase().includes(this.valueNearYouFilter.toLowerCase());
      });


      this.investorData = filteredData;


      this.totalInvestorsCount = filteredData.length;


      if (this.totalInvestorsCount <= this.pageSize) {
        this.page = 1;  // Reset page to 1
      }


      const totalPages = Math.ceil(this.totalInvestorsCount / this.pageSize);
      if (this.page > totalPages) {
        this.page = totalPages;
      }
    }
  }

  loadMultiSelectData() {
    this.investorList.getMultiSelectData().subscribe((response) => {
      this.investorIndustryInterested = response.investor_industry_interested;
      // this.investorOrgType = response.investor_org_type;
      this.investorType = response.investor_type;
      let anyInvestor: any = {
        id: "any",
        investor_type_name: "Select All"
      };
      this.investorType.unshift(anyInvestor);
      this.countryList = response.countries_list;
    });
  }

  selectAllCheckbox() {
    this.selectedInvestors = 0;
    this.selectAllCheckboxes = !this.selectAllCheckboxes;
    if (this.selectAllCheckboxes) {
      this.allInvestorList.forEach(item => {
        item.isChecked = 1;
        this.selectedInvestors += 1;
      })
    } else {
      this.allInvestorList.forEach(item => {
        item.isChecked = 0;
      });
    }

  }

  onCheckboxChange(event: any) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.selectedInvestors = isChecked ? this.selectedInvestors + 1 : this.selectedInvestors - 1;

    if (isChecked == false) {
      if (this.selectedInvestors) {
        this.selectAllCheckboxes = false;
      }
    } else {
      if (this.allInvestorList.length == this.selectedInvestors) {
        this.selectAllCheckboxes = true;
      }
    }
  }

  // resetFilter() {
  //   this.filterForm.reset();
  //   this.loadInvestorData();
  // }
  clearFilter() {
    this.filterForm.reset();
    this.loadInvestorData(0);
  }

  investorGuidlines(): void {
    this.router.navigate(["/pages/investor-guidlines"]);
  }

  buyCredits(): void {
    if (this.planExpired) {
      this.authService.hasUserSubscription$.next(true);
      return;
    }
    this.router.navigate(["/pages/export-credit"]);
  }

  loadInvestorData(isFavourite: number) {
    let data: any;
    if (isFavourite == 1) {
      data = {
        favourite: 1,
        page: this.page,
        perpage: this.pageSize,
      };
    } else {
      data = {
        org_name: this.filterForm.value.org_name ? this.filterForm.value.org_name : '',
        org_type: this.filterForm.value.org_type ? this.filterForm.value.org_type : '',
        country: this.filterForm.value.country ? this.filterForm.value.country : '',
        head_quarters: this.filterForm.value.head_quarters ? this.filterForm.value.head_quarters : '',
        investor_type: this.filterForm.value.investor_type ? this.filterForm.value.investor_type : '',
        industry_interested: this.filterForm.value.industry_interested ? this.filterForm.value.industry_interested : '',
        planname: this.currentPlan ? this.currentPlan : "",
        page: this.page,
        perpage: this.pageSize,
      };
    }
    this.investorList.getInvestorList(data).subscribe((response) => {
      this.investorData = response.data;
      this.favCount = response.favourite_count;
      this.exportCreditCount = response.credit_count ? response.credit_count : 0;
      if (isFavourite != 1) {
        this.allInvestorList = response.data;
        this.allInvestorCount = response.count;
      }
      this.totalInvestorsCount = response.count;
    });
    this.isFilterVisible = 'none';
  }

  pageChange(event: any) {
    if (this.planExpired) {
      this.authService.hasUserSubscription$.next(true);
      return;
    }
    this.selectAllCheckboxes = false;
    this.selectedInvestors = 0;
    this.page = event.page + 1;
    this.pageSize = event.rows;
    this.loadInvestorData(0);
  }

  closePopup() {
    this.isFilterVisible = 'none'

  }

  filterBy() {
    if (this.planExpired) {
      this.authService.hasUserSubscription$.next(true);
      return;
    }
    this.isFilterVisible = 'block';
  }

  exportTable() {
    this.investorList.export().subscribe((response) => {
      window.open(response.link, '_blank');
    });
  }

  checkplanExpire(): void {
    if (this.authService._userSubscrition.time_left.plan === "expired" ||
      this.authService._userSubscrition.time_left.plan === "subscription_expired" ||
      this.authService._userSubscrition.subscription_details.subscription_plan === "Student" ||
      this.authService._userSubscrition.subscription_details.subscription_plan === "Career") {
      this.planExpired = true;
    }
    else {
      this.planExpired = false;
    }
  }

  loadHeadQuartersData(event: any) {
    this.investorList.getHeadQuartersList(event.value).subscribe((response) => {
      this.headQuartersList = response;
      // this.anyHeadquartersList = [...response];
      // let anyCountryArray: any = {id: "any", head_quarters_name: "Any HeadQuarters"};
      // this.anyHeadquartersList.unshift(anyCountryArray);
    });
  }

  GetPersonalProfileData() {
    this.userManagementService.GetUserPersonalInfo().subscribe(data => {
      this.PersonalInfo = data;
    });
  }
  bookmarkQuestion(investorId: any, isFav: any) {
    isFav = isFav != '1' ? true : false;
    this.favCount = isFav == true ? this.favCount + 1 : this.favCount - 1;
    this.investorList.bookmarkInvestorData(investorId, this.PersonalInfo.user_id, isFav).subscribe((response) => {
      let investorListData = this.investorData.find(item => item.id == investorId);
      isFav == true ? investorListData.favourite = 1 : investorListData.favourite = null;
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
      this.loadInvestorData(1);
    }
    else {
      let investorList = this.allInvestorList.map(investor => {
        let foundInvestor = this.investorData.find(s => s.id == investor.id);
        if (foundInvestor) {
          investor.favourite = foundInvestor.favourite;
        }
        return investor;
      });
      let favouriteInvestor = investorList.filter(investor => investor.favourite === 1);
      let nonFavouriteInvestors = investorList.filter(investor => investor.favourite !== 1);
      this.investorData = favouriteInvestor.concat(nonFavouriteInvestors);
      this.totalInvestorsCount = this.allInvestorCount;
    }
  }

  exportData() {
    if (this.planExpired) {
      this.authService.hasUserSubscription$.next(true);
      return;
    } else if (this.exportCreditCount != 0) {
      this.exportDataIds = [];
      this.investorData.forEach(item => {
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
        module_id: 1,
        export_id: this.exportDataIds
      };
      this.investorList.exportSelectedData(data).subscribe((response) => {
        window.open(response.link, '_blank');
        this.selectAllCheckboxes = false;
        this.selectedInvestors = 0;
        this.loadInvestorData(0);
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
      reporttype: 5,
      moduleId: 5,
      report_mode: "other_module"
    };
    this.dataService.openReportWindow(data);
  }

  openVideoPopup(videoLink: string) {
    this.pageFacade.openHowitWorksVideoPopup(videoLink);
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
  getRecommendation() {
    if (this.planExpired) {
      this.authService.hasUserSubscription$.next(true);
      return;
    }
    this.enableModule = true;
    let keyMapping: any = { "1": "investor_type", "2": "country", "3": "head_quarters" };
    let newData = Object.fromEntries(Object.entries(this.selectedData).map(([key, value]) => {
      let mappedKey = keyMapping[key] || key;
      // if (Array.isArray(value)) {
      //   value = value.filter(item => item !== null);
      // }
      return [mappedKey, value];
    }));
    this.investorList.storeRecommendation(newData).subscribe();
    this.setRecommendationToForm(newData);
  }

  setRecommendationToForm(data: any) {
    this.filterForm.patchValue(data);
    this.loadInvestorData(0);
  }

  // selectCube(key: number, id: number) {
  //   if(this.selectedData[key] == "any"){

  //   }
  //   if (!Array.isArray(this.selectedData[key])) {
  //     this.selectedData[key] = [];
  //   }
  //   const index = this.selectedData[key].indexOf(id);
  //   if (index > -1) {
  //     this.selectedData[key].splice(index, 1);
  //   } else {
  //     this.selectedData[key].push(id);
  //   }
  // } 

  selectCube(key: number, id: number | string) {
    if (id === "any") {
      if (this.selectedData[key]?.includes(id)) {
        this.selectedData[key] = [];
      } else {
        this.selectedData[key] = this.investorType.map((cube: any) => cube.id);
      }
    } else {
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

  getStoredRecommendation() {
    this.investorList.getStoredRecommendation().subscribe(res => {
      // console.log(res);
      if (res.status) {
        this.enableModule = true;
        this.setRecommendationToForm(res.data);
      } else {
        this.enableModule = false;
      }
    });
  }

  resetRecommendation() {
    this.investorList.resetRecommendation().subscribe(res => {
      this.activePageIndex = 0;
      this.enableModule = false;
      this.selectedData = {};
      this.viewFavouritesLabel = "View Favourites";
    });
  }
  goBackButton() {
    this.router.navigate(['/pages/founderstool/founderstoollist']);
  }
}
