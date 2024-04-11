import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ScholarshipListService } from "./scholarship-list.service";
import { LocationService } from "src/app/location.service";
import { MessageService } from "primeng/api";
import { AuthService } from "src/app/Auth/auth.service";
import { Router } from "@angular/router";
import { UserManagementService } from "../user-management/user-management.service";
import { DataService } from "src/app/data.service";

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
  coverList: any[] = [];
  restrict: boolean = false;
  currentPlan: string = "";
  PersonalInfo!: any;
  viewFavouritesLabel: string = "View Favourites";
  allScholarshipList: any[] = [];
  allScholarshipCount:number=0;
  selectedIndex: any;
  toSend: boolean = false;
  selectAllCheckboxes: boolean = false;
  selectedCheckboxCount: number = 0;
  exportCreditCount: number = 0;
  exportDataIds:any = [];
  selectedScholarship: number = 0;

  constructor(
    private fb: FormBuilder,
    private scholarshipListService: ScholarshipListService,
    private locationService: LocationService,
    private toast: MessageService,
    private authService: AuthService,
    private router: Router,
    private userManagementService: UserManagementService,
    private dataService: DataService
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

  ngOnInit(): void {

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

  resetFilter() {
    this.regionList = [];
    this.filterForm.reset();
    this.data = {
      page: this.page,
      perpage: this.pageSize,
    }
    this.loadScholarShipData(0);
    // this.getRegionList();
    this.getFilterUniversityList("");
    this.isFilterVisible = false;
  }
  clearFilter() {
    this.regionList = [];
    this.filterForm.reset();
    // this.getRegionList();
    this.getFilterUniversityList("");
  }
  getScholarshipCountry() {
    this.scholarshipListService
      .getScholarshipCountry(1)
      .subscribe((response) => {
        this.countryList = response;
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
    });
  }
  getCovers() {
    this.scholarshipListService.getCoverList().subscribe((response) => {
      this.coverList = [...response];
    });
  }

  loadScholarShipData(isFavourite: number) {
    if (isFavourite == 1) {
      this.data={}
      this.data['favourite'] = 1;
    }else{
      this.data['favourite'] = 0;
    }
    this.data.planname = this.currentPlan ? this.currentPlan : "";

    this.scholarshipListService
      .getScholarshipList(this.data)
      .subscribe((response) => {
        this.scholarshipData = response.scholarship;
        if (isFavourite != 1) {
          this.allScholarshipList = response.scholarship;
          this.allScholarshipCount = response.count;
        }
        this.exportCreditCount = response.credit_count;
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
      this.toast.add({
        severity: "error",
        summary: "Error",
        detail: "Please make sure you have some filter!",
      });
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
     let scholarshipList=this.allScholarshipList.map(scholarship=>{
      let foundScholarship = this.scholarshipData.find(s => s.id == scholarship.id);
      if (foundScholarship) {
        scholarship.favourite = foundScholarship.favourite;
      }
      return scholarship;
     });
     let favouriteScholarships = scholarshipList.filter(scholarship => scholarship.favourite === 1);
    let nonFavouriteScholarships = scholarshipList.filter(scholarship => scholarship.favourite !== 1);
     this.scholarshipData=favouriteScholarships.concat(nonFavouriteScholarships);
     this.totalScholarShipCount=this.allScholarshipCount;
  }
  }
  checkBoxopen() {

  }
  sholarshipquestionid: number[] = [];
  selectedlistcount:number=0
  questionSelectedCheckBox(event: any, index: number, ticketques: any) {
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

    this.selectedIndex = event.target.checked ? index : undefined;
    this.toSend = event.target.checked;
      this.sholarshipquestionid=ticketques.id
      console.log(this.sholarshipquestionid);
  }
  openReport() {
    if(this.toSend){
      let data = {
        isVisible: true,
        questionId: this.sholarshipquestionid,
        reporttype:4
      };
      this.dataService.openReportWindow(data);
    }else{
      this.toast.add({
        severity: "error",
        summary: "Error",
        detail: "Please make sure you have select any question!",
      });
    }
  }

  buyCredits(): void{
    if (this.planExpired) {
      this.restrict = true;
      return;
    }
    this.router.navigate(["/pages/export-credit"]);
  }

  selectAllCheckbox(){
    this.selectedCheckboxCount = 0;
    this.selectAllCheckboxes = !this.selectAllCheckboxes;
    if(this.selectAllCheckboxes){
      this.scholarshipData.forEach(item=>{
        item.isChecked = 1;
        this.selectedCheckboxCount +=1;
      });
    }else{
      this.scholarshipData.forEach(item=>{
        item.isChecked = 0;
      });
    }
  }

  exportData(){
    if (this.planExpired) {
      this.restrict = true;
      return;
    }else if(this.exportCreditCount != 0){
      this.exportDataIds = [];
      this.scholarshipData.forEach(item=>{
        if(item.isChecked == 1){
          this.exportDataIds.push(item.id);
        }
      })
      if(this.exportDataIds.length == 0){
        this.toast.add({severity: "error",summary: "error",detail: "Select Some data for export!.",});
        return;
      }
      if(this.exportCreditCount < this.exportDataIds.length){
        this.toast.add({severity: "error",summary: "error",detail: "insufficient credits.Please Buy Some Credits.",});
        this.router.navigate(["/pages/export-credit"]);
        return;
      }
      let data={
        module_id: 3,
        export_id: this.exportDataIds
      };
      this.scholarshipListService.exportSelectedData(data).subscribe((response)=>{
        window.open(response.link, '_blank');
        this.selectAllCheckboxes = false;
        this.selectedCheckboxCount = 0;
        this.loadScholarShipData(0);
      })
    }else if(this.exportCreditCount == 0){
      this.toast.add({severity: "error",summary: "error",detail: "Please Buy Some Credits.",});
      this.router.navigate(["/pages/export-credit"]);
    }
    
  }

  onCheckboxChange(event: any){
    const isChecked = (event.target as HTMLInputElement).checked;
    this.selectedScholarship = isChecked ? this.selectedScholarship + 1 : this.selectedScholarship - 1;

    if(isChecked == false){
      if(this.selectedScholarship){
        this.selectAllCheckboxes = false;
      }
    }else{
      if(this.scholarshipData.length == this.selectedScholarship){
        this.selectAllCheckboxes = true;
      }
    }
  }

}
