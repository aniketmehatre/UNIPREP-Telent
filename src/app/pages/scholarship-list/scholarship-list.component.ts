import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ScholarshipListService } from "./scholarship-list.service";
import { LocationService } from "src/app/location.service";
import { MessageService } from "primeng/api";
import { AuthService } from "src/app/Auth/auth.service";
import { Router } from "@angular/router";
import { UserManagementService } from "../user-management/user-management.service";

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
  restrict:boolean=false;
  currentPlan:string="";
  PersonalInfo!:any;

  constructor(
    private fb: FormBuilder,
    private scholarshipListService: ScholarshipListService,
    private locationService: LocationService,
    private toast: MessageService,
    private authService: AuthService,
    private router: Router,
    private userManagementService:UserManagementService
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
      this.loadScholarShipData();
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
    this.loadScholarShipData();
    // this.getRegionList();
    this.getFilterUniversityList("");
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

  loadScholarShipData() {
    this.data.planname=this.currentPlan?this.currentPlan:"";
    this.scholarshipListService
      .getScholarshipList(this.data)
      .subscribe((response) => {
        this.scholarshipData = response.scholarship;
        this.totalScholarShipCount = response.count;
      });
    this.isFilterVisible =false;
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
    if(this.planExpired){
      this.restrict=true;
      return;
    }
    this.page = event.first / this.pageSize + 1;
    this.pageSize = event.rows;
    this.first = event.first;
    this.data.page = this.page;
    this.data.perpage = this.pageSize;
    this.loadScholarShipData();
  }

  closePopup() {
    this.isFilterVisible = false;
  }

  filterBy() {
    if(this.planExpired){
      this.restrict=true;
      return;
    }
    this.isFilterVisible =true;
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
      this.currentPlan=subscription_exists_status?.subscription_plan;
      if (
        data.plan === "expired" || data.plan === 'subscription_expired' ||
        subscription_exists_status?.subscription_plan === "free_trail"
      ) {
        this.planExpired = true;
      } else {
        this.planExpired = false;
      }
      this.loadScholarShipData();
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
bookmarkQuestion(scholarshipId:any,isFav:any){
  isFav=isFav!='1'?true:false;
   this.scholarshipListService.bookmarkScholarshipData(scholarshipId,this.PersonalInfo.user_id,isFav).subscribe((response) => {
    let scholarshipListData=this.scholarshipData.find(item=>item.id==scholarshipId);
    isFav==true?scholarshipListData.favourite=1:scholarshipListData.favourite=null;
    this.toast.add({
      severity: "success",
      summary: "Success",
      detail: response.message,
    });
   });
}
}
