import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ScholarshipListService } from './scholarship-list.service';
import { LocationService } from 'src/app/location.service';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/Auth/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'uni-scholarship-list',
  templateUrl: './scholarship-list.component.html',
  styleUrls: ['./scholarship-list.component.scss']
})
export class ScholarshipListComponent implements OnInit {
  scholarshipData: any[] = []
  industryInterested: any;
  investorOrgType: any;
  investorType: any;
  countryList: any;
  headQuartersList: any
  page = 1;
  pageSize = 100;
  searchScholarshpName: string = '';
  totalScholarShipCount: any;
  isFilterVisible: string = 'none';
  filterForm: FormGroup;
  homeCountryList: any[] = [];
  studyLevelList: any[] = [];
  regionList: any[] = [];
  filterUniversityList:any[]=[];
  planExpired!: boolean;
  scholarshipTypeList: any[] = [];
  constructor(
    private fb: FormBuilder,
    private scholarshipListService: ScholarshipListService,
    private locationService: LocationService,
    private toast: MessageService,
    private authService: AuthService,
    private router: Router
  ) {
    this.filterForm = this.fb.group({
      country: [null],
      home_country: [null],
      study_level: [null],
      region: [null],
      university: [null],
      valueRange: [null],
      type:[null]
    });
  }

  ngOnInit(): void {
    this.loadScholarShipData();
    this.getScholarshipCountry();
    this.gethomeCountryList();
    this.getStudyLevel();
    this.getFilterUniversityList("");
    this.checkplanExpire();
    this.getScholarshipType();
    this.getRegionList();
  }



  performSearch() {
    if (this.searchScholarshpName == "") {
      this.loadScholarShipData();
      return;
    }
    var searchedScholarship: any = [];
    this.scholarshipData.filter(item => {
      if (item.name?.includes(this.searchScholarshpName)) {
        searchedScholarship.push(item);
      };
    });
    this.scholarshipData = [...searchedScholarship];
  }



  resetFilter() {
    this.regionList = [];
    this.filterForm.reset();
    this.loadScholarShipData();
    this.getRegionList();
    this.getFilterUniversityList('');
  }

  getScholarshipCountry() {
    this.scholarshipListService.getScholarshipCountry(1).subscribe((response) => {
      this.countryList = response;
    });
  }


  gethomeCountryList() {
    this.locationService.getHomeCountry(2).subscribe(
      (res: any) => {
        this.homeCountryList = res;
      },
      (error: any) => {
        this.toast.add({ severity: 'warning', summary: 'Warning', detail: error.error.message });
      }
    );
  }

  getStudyLevel() {
    this.scholarshipListService.getStudyLevel().subscribe((response) => {
      this.studyLevelList = response;
    })
  }

  getScholarshipType() {
    this.scholarshipListService.getScholarshipType().subscribe(response => {
      this.scholarshipTypeList = response;
    })
  }

  loadScholarShipData() {

    let data: any = {
      page: this.page,
      perpage: this.pageSize,
    }
    if (this.filterForm.value.country) {
      data.country = this.filterForm.value.country
    }
    if (this.filterForm.value.home_country) {
      data.home_country = this.filterForm.value.home_country
    }
    if (this.filterForm.value.type) {
      data.type = this.filterForm.value.type
    }
    if (this.filterForm.value.study_level && this.filterForm.value.study_level.length > 0) {
      data.study_level = this.filterForm.value.study_level
    }
    if (this.filterForm.value.region && this.filterForm.value.region.length > 0) {
      data.region = this.filterForm.value.region
    }
    if (this.filterForm.value.university && this.filterForm.value.university.length > 0) {
      data.university = this.filterForm.value.university
    }
    this.scholarshipListService.getScholarshipList(data).subscribe((response) => {
      this.scholarshipData = response.scholarship;
      this.totalScholarShipCount = response.count;
    });
    this.isFilterVisible = 'none'
  }
  getRegionList() {
    this.scholarshipListService.getRegion().subscribe(response => {
      this.regionList = response;
    });
  }
  countryChange(event: any) {
    if (event.value == 15) {
      this.getRegionList();
    }
    else {
      this.filterForm.value.region=null;
      this.regionList = [];
    }
    this.getFilterUniversityList(event.value);
  }
  pageChange(event: any) {
    this.page = event.first + 1;
    this.pageSize = event.rows;
    this.loadScholarShipData();
  }

  closePopup() {
    this.isFilterVisible = 'none'
  }

  filterBy() {

    this.isFilterVisible = 'block';
  }

  exportTable() {

  }
  getFilterUniversityList(value: any) {
    this.scholarshipListService.getUniversity(value).subscribe(response => {
      this.filterUniversityList = response;
    });
  }

  checkplanExpire(): void {
    this.authService.getNewUserTimeLeft().subscribe((res) => {
      let data = res.time_left;
      let subscription_exists_status = res.subscription_details;
      if (data.plan === "expired" || subscription_exists_status.subscription_plan === 'free_trail') {
        this.planExpired = true;
      } else {
        this.planExpired = false;
      }
    })
  }

  upgradePlan(): void {
    this.router.navigate(["/pages/subscriptions"]);
  }
}
