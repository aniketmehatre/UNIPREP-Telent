import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ScholarshipListService } from './scholarship-list.service';
import { LocationService } from 'src/app/location.service';
import { MessageService } from 'primeng/api';


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
  pageSize = 50;
  searchScholarshpName: string = '';
  totalScholarShipCount: any;
  isFilterVisible: string = 'none';
  filterForm: FormGroup;
  homeCountryList: any[] = [];
  studyLevelList: any[] = [];
  regionList: any[] = [];
  constructor(
    private fb: FormBuilder,
    private scholarshipListService: ScholarshipListService,
    private locationService: LocationService,
    private toast: MessageService
  ) {
    this.filterForm = this.fb.group({
      country: [null],
      home_country: [null],
      study_level: [null],
      region: [null],
      valueRange: [null],
    });
  }

  ngOnInit(): void {

    this.loadScholarShipData();
    this.getScholarshipCountry();
    this.gethomeCountryList();
    this.getStudyLevel();
  }



  performSearch() {
    if (this.searchScholarshpName=="") {
      this.loadScholarShipData();
      return;
    }
    var searchedScholarship: any = [];
    this.scholarshipData.filter(item => {
      if (item.name.includes(this.searchScholarshpName)) {
        searchedScholarship.push(item);
      };
    });
    this.scholarshipData = [...searchedScholarship];
  }



  resetFilter() {
    this.filterForm.reset();
    this.loadScholarShipData();
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

  loadScholarShipData() {
    let data = {
      country: this.filterForm.value.country ? this.filterForm.value.country : '',
      home_country: this.filterForm.value.home_country ? this.filterForm.value.home_country : '',
      study_level: this.filterForm.value.study_level ? this.filterForm.value.study_level : '',
      region: this.filterForm.value.region ? this.filterForm.value.region : '',
      value: this.filterForm.value.valueRange ? this.filterForm.value.valueRange : '',
      page: this.page,
      perpage: this.pageSize,
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
    if (event.value.includes(15)==true) {
      this.getRegionList();
    }
    else {
      this.regionList = [];
    }
  }
  pageChange(event: any) {
    this.page = event.page + 1;
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

}
