import { Component, OnInit } from '@angular/core';
import {Location} from "@angular/common";
import {FormBuilder, FormGroup} from "@angular/forms";
import {InvestorListService} from "./investor-list.service";

@Component({
  selector: 'uni-investor-list',
  templateUrl: './investor-list.component.html',
  styleUrls: ['./investor-list.component.scss']
})
export class InvestorListComponent implements OnInit {
  investorData: any []= []
  investorIndustryInterested: any;
  investorOrgType: any;
  investorType: any;
  countryList: any;
  headQuartersList: any
  page = 1;
  pageSize = 50;
  valueNearYouFilter: any;
  totalInvestorsCount: any;
  isFilterVisible: string = 'none';
  filterForm:FormGroup;

  constructor(private _location: Location, private fb: FormBuilder, private investorList: InvestorListService) {
    this.filterForm = this.fb.group({
      org_name: [''],
      org_type: [''],
      country: [''],
      head_quarters: [''],
      investor_type: [''],
      industry_interested: [''],
    });
  }

  ngOnInit(): void {
    this.loadMultiSelectData();
    this.loadInvestorData();
  }

  goBack(){
    this._location.back();
  }

  performSearch(events:any){
    var data={
      nearby_search:this.valueNearYouFilter
    }
    // this.getEventUpComming(data)
    // this.getPostEvent(data)
  }

  loadMultiSelectData(){
    this.investorList.getMultiSelectData().subscribe((response) => {
      this.investorIndustryInterested = response.investor_industry_interested;
      this.investorOrgType = response.investor_org_type;
      this.investorType = response.investor_type;
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
}
