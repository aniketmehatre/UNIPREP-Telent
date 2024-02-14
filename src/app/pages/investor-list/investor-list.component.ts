import { Component, OnInit } from '@angular/core';
import {Location} from "@angular/common";
import {FormBuilder, FormGroup} from "@angular/forms";
import {InvestorListService} from "./investor-list.service";
import { AuthService } from 'src/app/Auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'uni-investor-list',
  templateUrl: './investor-list.component.html',
  styleUrls: ['./investor-list.component.scss']
})
export class InvestorListComponent implements OnInit {
  investorData: any []= []
  investorIndustryInterested: any;
  // investorOrgType: any;
  investorType: any;
  countryList: any;
  headQuartersList: any
  page = 1;
  pageSize = 100;
  valueNearYouFilter: string = '';
  totalInvestorsCount: any;
  isFilterVisible: string = 'none';
  filterForm:FormGroup;
  planExpired!: boolean;

  constructor(private _location: Location, private fb: FormBuilder, private investorList: InvestorListService, private authService: AuthService,private router:Router) {
    this.filterForm = this.fb.group({
      org_name: [''],
      // org_type: [''],
      country: [''],
      head_quarters: [''],
      investor_type: [''],
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
    if (this.valueNearYouFilter == "") {
      this.loadInvestorData();
      return;
    }
    var investorSearchData: any = [];
    this.investorData.filter(item => {
      if (item.org_name?.includes(this.valueNearYouFilter)) {
        investorSearchData.push(item);
      };
    });
    this.investorData = [...investorSearchData];
  }

  loadMultiSelectData(){
    this.investorList.getMultiSelectData().subscribe((response) => {
      console.log(response);
      this.investorIndustryInterested = response.investor_industry_interested;
      // this.investorOrgType = response.investor_org_type;
      this.investorType = response.investor_type;
      this.countryList = response.countries_list;
    });
  }

  resetFilter(){
    this.filterForm.reset();
    this.loadInvestorData();
  }


  loadInvestorData(){
    let data = {
      org_name: this.filterForm.value.org_name ? this.filterForm.value.org_name : '',
      org_type: this.filterForm.value.org_type ? this.filterForm.value.org_type : '',
      country: this.filterForm.value.country ? this.filterForm.value.country : '',
      head_quarters: this.filterForm.value.head_quarters ? this.filterForm.value.head_quarters : '',
      investor_type: this.filterForm.value.investor_type ? this.filterForm.value.investor_type : '',
      industry_interested: this.filterForm.value.industry_interested ? this.filterForm.value.industry_interested : '',
      page: this.page,
      perpage: this.pageSize,
    }
    this.investorList.getInvestorList(data).subscribe((response) => {
      this.investorData = response.data;
      this.totalInvestorsCount = response.count;
    });
    this.isFilterVisible = 'none'
  }

  pageChange(event: any){
    console.log(event);
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
    this.investorList.export().subscribe((response) => {
      window.open(response.link, '_blank');
    });
  }

  checkplanExpire(): void {
    this.authService.getNewUserTimeLeft().subscribe((res) => {
      let data = res.time_left;
      let subscription_exists_status = res.subscription_details;
      if (data.plan === "expired" || data.plan === 'subscription_expired' || subscription_exists_status.subscription_plan === 'free_trail' || subscription_exists_status.subscription_plan === 'Student' || subscription_exists_status.subscription_plan === 'Career') {
        this.planExpired = true;
      } else {
        this.planExpired = false;
      }
    })
  }

  upgradePlan(): void {
    this.router.navigate(["/pages/subscriptions"]);
  }

  loadHeadQuartersData(event: any){
    this.investorList.getHeadQuartersList(event.value).subscribe((response) => {
      this.headQuartersList = response;
    });
  }
}
