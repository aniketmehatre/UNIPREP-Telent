import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ScholarshipListService } from "./scholarship-list.service";
import { LocationService } from "src/app/location.service";
import { MessageService } from "primeng/api";
import { AuthService } from "src/app/Auth/auth.service";
import { Router } from "@angular/router";
import { UserManagementService } from "../user-management/user-management.service";
import { DataService } from "src/app/data.service";
import { PageFacadeService } from "../page-facade.service";

@Component({
  selector: "uni-scholarship-list",
  templateUrl: "./scholarship-list.component.html",
  styleUrls: ["./scholarship-list.component.scss"],
})
export class ScholarshipListComponent implements OnInit {
  scholarshipData: any[] = [];
  industryInterested: any;
  investorOrgType: any;
  investorType: any;
  countryList: any;
  anyCountryList: any;
  headQuartersList: any;
  page = 1;
  pageSize = 25;
  first: number = 0;
  searchScholarshpName: string = "";
  totalScholarShipCount: any;
  isFilterVisible: boolean = false;
  filterForm: FormGroup;
  homeCountryList: any[] = [];
  studyLevelList: any[] = [];
  regionList: any[] = [];
  filterUniversityList: any[] = [];
  planExpired!: boolean;
  scholarshipTypeList: any[] = [];
  anyScholarshipTypeList: any[] = [];
  coverList: any[] = [];
  anyCoverList: any[] = [];
  restrict: boolean = false;
  currentPlan: string = "";
  PersonalInfo!: any;
  viewFavouritesLabel: string = "View Favourites";
  allScholarshipList: any[] = [];
  allScholarshipCount: number = 0;
  // selectedIndex: any;
  // toSend: boolean = false;
  selectAllCheckboxes: boolean = false;
  // selectedCheckboxCount: number = 0;
  exportCreditCount: number = 0;
  exportDataIds: any = [];
  selectedScholarship: number = 0;
  favCount: number = 0;
  ehitlabelIsShow: boolean = true;
  imagewhitlabeldomainname: any;
  orglogowhitelabel: any;
  orgnamewhitlabel: any;
  constructor(
    private fb: FormBuilder,
    private scholarshipListService: ScholarshipListService,
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
      home_country: [null],
      study_level: [null],
      // region: [null],
      university: [null],
      valueRange: [null],
      type: [null],
      cover_id: [null],
    });
  }
  enableModule: boolean = false;
  activePageIndex: number = 0;
  recommendations: any = [
    {
      id: 1,
      question: "Select your Scholarship Country",
    },
    {
      id: 2,
      question: "Select your Study Level",
    },
    {
      id: 3,
      question: "Select your Scholarship Type",
    },
    {
      id: 4,
      question: "Choose  your Scholarship Coverage",
    },
  ];
  invalidClass: boolean = false;
  selectedData: { [key: string]: any } = {};
  studyLevelCubes: any = [{ id: "UG", label: 'Undergraduate' }, { id: "PG", label: 'Postgraduate' }, { id: null, label: 'Any' }];

  ngOnInit(): void {
    this.locationService.getImage().subscribe(imageUrl => {
      this.orglogowhitelabel = imageUrl;
    });
    this.locationService.getOrgName().subscribe(orgname => {
      this.orgnamewhitlabel = orgname;
    });
    this.imagewhitlabeldomainname=window.location.hostname;
    if (this.imagewhitlabeldomainname === "dev-student.uniprep.ai" || this.imagewhitlabeldomainname === "uniprep.ai" || this.imagewhitlabeldomainname === "localhost") {
      this.ehitlabelIsShow=true;
    }else{
      this.ehitlabelIsShow=false;
    }
    this.checkUserRecommendation();
    this.getScholarshipCountry();
    this.gethomeCountryList();
    this.getStudyLevel();
    this.getFilterUniversityList("");
    this.checkplanExpire();
    this.getScholarshipType();
    this.getRegionList();
    this.getCovers();
    this.GetPersonalProfileData();
  }

  performSearch() {
    if (this.searchScholarshpName == "") {
      this.loadScholarShipData(0);
      return;
    }
    var searchedScholarship: any = [];
    this.scholarshipData.filter((item) => {
      if (item.name?.toLowerCase().includes(this.searchScholarshpName.toLowerCase())) {
        searchedScholarship.push(item);
      }
    });
    this.scholarshipData = [...searchedScholarship];
  }

  // resetFilter() {
  //   this.regionList = [];
  //   this.filterForm.reset();
  //   this.data = {
  //     page: this.page,
  //     perpage: this.pageSize,
  //   }
  //   this.loadScholarShipData(0);
  //   // this.getRegionList();
  //   this.getFilterUniversityList("");
  //   this.isFilterVisible = false;
  // }
  clearFilter() {
    this.regionList = [];
    this.filterForm.reset();
    // this.getRegionList();
    this.getFilterUniversityList("");
    //this.data = {}
    delete this.data.country;
    delete this.data.home_country;
    delete this.data.type;
    delete this.data.study_level;
    delete this.data.university;
    delete this.data.cover_id;

  }
  getScholarshipCountry() {
    this.scholarshipListService.getScholarshipCountry(1).subscribe((response) => {
      let allCountries = response;
      this.countryList = allCountries;
      this.anyCountryList = [...allCountries]; // this is shallow copy of all countries.if am not taking shallow copy when i add any array its showing it reflect for both arrays.
    });
  }

  gethomeCountryList() {
    this.scholarshipListService.getScholarshipCountry(2).subscribe(
      (res: any) => {
        this.homeCountryList = res;
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

  getStudyLevel() {
    this.scholarshipListService.getStudyLevel().subscribe((response) => {
      this.studyLevelList = response;
    });
  }

  getScholarshipType() {
    this.scholarshipListService.getScholarshipType().subscribe((response) => {
      this.scholarshipTypeList = response;
      this.anyScholarshipTypeList = [...response]; 
    });
  }
  getCovers() {
    this.scholarshipListService.getCoverList().subscribe((response) => {
      this.coverList = [...response];
      this.anyCoverList = [...response];
    });
  }

  loadScholarShipData(isFavourite: number) {
    if (isFavourite == 1) {
      this.data = {}
      this.data['favourite'] = 1;
    } else {
      this.data['favourite'] = 0;
    }
    this.data.planname = this.currentPlan ? this.currentPlan : "";

    this.scholarshipListService
      .getScholarshipList(this.data)
      .subscribe((response) => {
        this.scholarshipData = response.scholarship;
        this.favCount = response.favourite_count;
        if (isFavourite != 1) {
          this.allScholarshipList = response.scholarship;
          this.allScholarshipCount = response.count;
        }
        this.exportCreditCount = response.credit_count ? response.credit_count : 0;
        this.totalScholarShipCount = response.count;
      });
    this.isFilterVisible = false;
  }
  applyFilter() {
    const formData = this.filterForm.value;
    if (
      !formData.home_country &&
      !formData.country &&
      !formData.study_level &&
      !formData.university &&
      // !formData.region &&
      !formData.type &&
      !formData.valueRange &&
      !formData.cover_id
    ) {
      // this.toast.add({
      //   severity: "error",
      //   summary: "Error",
      //   detail: "Please make sure you have some filter!",
      // });
      this.regionList = [];
      this.filterForm.reset();
      this.data = {
        page: this.page,
        perpage: this.pageSize,
      }
      this.loadScholarShipData(0);
      this.getRegionList();
      this.getFilterUniversityList("");
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
    // if (
    //   this.filterForm.value.region &&
    //   this.filterForm.value.region.length > 0
    // ) {
    //   this.data.region = this.filterForm.value.region;
    // }
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
    this.scholarshipListService
      .getScholarshipList(this.data)
      .subscribe((response) => {
        this.scholarshipData = response.scholarship;
        this.totalScholarShipCount = response.count;
      });
    this.isFilterVisible = false;
  }
  getRegionList() {
    this.scholarshipListService.getRegion().subscribe((response) => {
      this.regionList = response;
    });
  }
  countryChange(event: any) {
    // if (event.value == 105) {
    //   this.getRegionList();
    // } else {
    //   this.filterForm.value.region = null;
    //   this.regionList = [];
    // }
    this.getFilterUniversityList(event.value);
  }
  data: any = {
    page: this.page,
    perpage: this.pageSize,
  };
  pageChange(event: any) {
    if (this.planExpired) {
      this.restrict = true;
      return;
    }
    this.page = event.first / this.pageSize + 1;
    this.pageSize = event.rows;
    this.first = event.first;
    this.data.page = this.page;
    this.data.perpage = this.pageSize;
    this.loadScholarShipData(0);
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
  getFilterUniversityList(value: any) {
    this.scholarshipListService.getUniversity(value).subscribe((response) => {
      this.filterUniversityList = response;
    });
  }

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
      this.loadScholarShipData(0);
    });
  }

  upgradePlan(): void {
    this.router.navigate(["/pages/subscriptions"]);
  }
  clearRestriction() {
    this.restrict = false;
  }

  scholarGuidlines(): void {
    this.router.navigate(["/pages/scholarship-guidlines"]);
  }
  GetPersonalProfileData() {
    this.userManagementService.GetUserPersonalInfo().subscribe(data => {
      this.PersonalInfo = data;
    });
  }
  bookmarkQuestion(scholarshipId: any, isFav: any) {
    isFav = isFav != '1' ? true : false;
    this.favCount = isFav == true ? this.favCount + 1 : this.favCount - 1;

    this.scholarshipListService.bookmarkScholarshipData(scholarshipId, this.PersonalInfo.user_id, isFav).subscribe((response) => {
      let scholarshipListData = this.scholarshipData.find(item => item.id == scholarshipId);
      isFav == true ? scholarshipListData.favourite = 1 : scholarshipListData.favourite = null;
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
      this.loadScholarShipData(1);
    }
    else {
      let scholarshipList = this.allScholarshipList.map(scholarship => {
        let foundScholarship = this.scholarshipData.find(s => s.id == scholarship.id);
        if (foundScholarship) {
          scholarship.favourite = foundScholarship.favourite;
        }
        return scholarship;
      });
      let favouriteScholarships = scholarshipList.filter(scholarship => scholarship.favourite === 1);
      let nonFavouriteScholarships = scholarshipList.filter(scholarship => scholarship.favourite !== 1);
      this.scholarshipData = favouriteScholarships.concat(nonFavouriteScholarships);
      this.totalScholarShipCount = this.allScholarshipCount;
    }
  }
  checkBoxopen() {

  }
  // sholarshipquestionid: number[] = [];
  // selectedlistcount:number=0
  // questionSelectedCheckBox(event: any, index: number, ticketques: any) {
  // if (event.target.checked) {
  //   this.sholarshipquestionid.push(ticketques.id);
  //   console.log(this.sholarshipquestionid);
  // } else {
  //   const indexToRemove = this.sholarshipquestionid.indexOf(ticketques.id);
  //   if (indexToRemove !== -1) {
  //     this.sholarshipquestionid.splice(indexToRemove, 1);
  //     console.log(this.sholarshipquestionid);
  //   }
  // }
  // this.selectedlistcount=this.sholarshipquestionid.length;

  //   this.selectedIndex = event.target.checked ? index : undefined;
  //   this.toSend = event.target.checked;
  //     this.sholarshipquestionid=ticketques.id
  //     console.log(this.sholarshipquestionid);
  // }

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
    this.selectedScholarship = 0;
    this.selectAllCheckboxes = !this.selectAllCheckboxes;
    if (this.selectAllCheckboxes) {
      this.scholarshipData.forEach(item => {
        item.isChecked = 1;
        this.selectedScholarship += 1;
      });
    } else {
      this.scholarshipData.forEach(item => {
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
      this.scholarshipData.forEach(item => {
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
      this.scholarshipListService.exportSelectedData(data).subscribe((response) => {
        window.open(response.link, '_blank');
        this.selectAllCheckboxes = false;
        // this.selectedCheckboxCount = 0;
        this.selectedScholarship = 0;
        this.loadScholarShipData(0);
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
    this.selectedScholarship = isChecked ? this.selectedScholarship + 1 : this.selectedScholarship - 1;
    if (isChecked == false) {
      if (this.selectedScholarship) {
        this.selectAllCheckboxes = false;
      }
    } else {
      if (this.scholarshipData.length == this.selectedScholarship) {
        this.selectAllCheckboxes = true;
      }
    }
  }

  openHowItWorksVideoPopup(videoLink: string) {
    this.pageFacade.openHowitWorksVideoPopup(videoLink);
  }

  checkUserRecommendation(){
    this.scholarshipListService.getRecommendations().subscribe(res => {
      if(res.status){
        this.enableModule = true;
        this.setRecommendationToForm(res.data);
      }else{
        this.enableModule = false;
        this.addAnyValueToOptions();
      }
    });
  }
  addAnyValueToOptions(){
    setTimeout(() => {
      let anyCountryArray: any = {id: null,country: "Any Country"};
      this.anyCountryList.unshift(anyCountryArray);

      let anyScholarList:any = { id: null, type: "Any"};
      this.anyScholarshipTypeList.unshift(anyScholarList); 

      let anyCoverList:any = {id: null,cover_name: "Any" };
      this.anyCoverList.unshift(anyCoverList);
    }, 1000);
  }

  setRecommendationToForm(data: any){
    this.filterForm.patchValue(data);
    this.applyFilter();
  }

  getRecommendation() {
    let keyMapping: any = {"1": "country","2": "study_level","3": "type","4": "cover_id"};
    
    let newData = Object.fromEntries(Object.entries(this.selectedData).map(([key, value]) => {
      let mappedKey = keyMapping[key] || key;
      if (Array.isArray(value)) {
        value = value.filter(item => item !== null);
      }
      return [mappedKey, value];
    }));
    this.scholarshipListService.storeRecommendation(newData).subscribe();
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

  selectCube(key: number, id: number) {
    if (key === 3) {
      if (!Array.isArray(this.selectedData[key])) {
        this.selectedData[key] = [];
      }
      const index = this.selectedData[key].indexOf(id);
      if (index > -1) {
        this.selectedData[key].splice(index, 1);
      } else {
        this.selectedData[key].push(id);
      }
    } else {
      this.selectedData[key] = id;
    }
  }  

  resetRecommendation(){
    this.scholarshipListService.resetRecommendation().subscribe(res => {
      this.enableModule = false;
      this.filterForm.reset();
      this.selectedData = {};
      this.activePageIndex = 0;
      this.addAnyValueToOptions();
    });
  }
}
