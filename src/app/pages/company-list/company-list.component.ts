import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Location} from "@angular/common";
import {CompanyListService} from "./company-list.service";
import { AuthService } from 'src/app/Auth/auth.service';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'uni-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.scss']
})
export class CompanyListComponent implements OnInit {
  companyData: any []= []
  industryInterested: any;
  // investorOrgType: any;
  // investorType: any;
  countryList: any;
  headQuartersList: any
  page = 1;
  pageSize = 500;
  valueNearYouFilter: any;
  totalCompanyCount: any;
  isFilterVisible: string = 'none';
  filterForm:FormGroup;
  planExpired!: boolean;

  constructor(private _location: Location, private fb: FormBuilder, private companyListService: CompanyListService, private authService: AuthService, private router:Router) {
    this.filterForm = this.fb.group({
      country: [''],
      head_quarters: [''],
      fromdate: [''],
      todate: [''],
      industry_interested: [''],
    });
  }

  ngOnInit(): void {
    this.loadMultiSelectData();
    this.loadInvestorData();
    this.checkplanExpire();
  }

  goBack(){
    this._location.back();
  }

  performSearch(events:any){
    var data={
      nearby_search:this.valueNearYouFilter
    }
  }

  onEnterKeyPressed(){
    var data={
      global_search: this.valueNearYouFilter
    }

    this.companyListService.getInvestorList(data).subscribe((response) => {
      this.companyData = response.data;
      this.totalCompanyCount = response.count;
      //this.totalCompanyCount = response.count;
    });
  }

  loadMultiSelectData(){
    this.companyListService.getMultiSelectData().subscribe((response) => {
      this.industryInterested = response.investor_industry_interested;
      // this.investorOrgType = response.investor_org_type;
      // this.investorType = response.investor_type;
      this.countryList = response.countries_list;
      this.headQuartersList = response.head_quarters_list;
    });
  }

  resetFilter(){
    this.filterForm.reset();
    this.loadInvestorData();
  }


  loadInvestorData(){
    let data = {
      country: this.filterForm.value.country ? this.filterForm.value.country : '',
      head_quarters: this.filterForm.value.head_quarters ? this.filterForm.value.head_quarters : '',
      fromdate: this.filterForm.value.fromdate ? this.filterForm.value.fromdate : '',
      todate: this.filterForm.value.todate ? this.filterForm.value.todate : '',
      industry_interested: this.filterForm.value.industry_interested ? this.filterForm.value.industry_interested : '',
      page: this.page,
      perpage: this.pageSize,
    }
    this.companyListService.getInvestorList(data).subscribe((response) => {
      this.companyData = response.data;
      this.totalCompanyCount = response.count;
      //this.totalCompanyCount = response.count;
    });
    this.isFilterVisible = 'none'
  }

  pageChange(event: any){
    this.page = event.page + 1;
    this.pageSize = event.rows;
    this.loadInvestorData();
  }

  closePopup(){
    this.isFilterVisible = 'none'

  }

  filterBy(){
    this.isFilterVisible = 'block';
  }

  exportTable(){
    this.companyListService.export().subscribe((response) => {
      window.open(response.link, '_blank');
    });
  }

  checkplanExpire(): void {
    this.authService.getNewUserTimeLeft().subscribe((res) => {
      let data = res.time_left;
      let subscription_exists_status = res.subscription_details;
      if (data.plan === "expired" || subscription_exists_status === 'free_trail' || subscription_exists_status === 'Popular') {
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
