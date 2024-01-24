import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Location} from "@angular/common";
import {CompanyListService} from "./company-list.service";

@Component({
  selector: 'uni-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.scss']
})
export class CompanyListComponent implements OnInit {
  companyData: any []= []
  industryInterested: any;
  investorOrgType: any;
  investorType: any;
  countryList: any;
  headQuartersList: any
  page = 1;
  pageSize = 50;
  valueNearYouFilter: any;
  totalCompanyCount: any;
  isFilterVisible: string = 'none';
  filterForm:FormGroup;

  constructor(private _location: Location, private fb: FormBuilder, private companyListService: CompanyListService) {
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
  }

  goBack(){
    this._location.back();
  }

  performSearch(events:any){
    var data={
      nearby_search:this.valueNearYouFilter
    }
  }

  loadMultiSelectData(){
    this.companyListService.getMultiSelectData().subscribe((response) => {
      this.industryInterested = response.investor_industry_interested;
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
      this.totalCompanyCount = response.count;
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
}
