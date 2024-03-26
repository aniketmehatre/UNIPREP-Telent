import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Location} from "@angular/common";
import {CompanyListService} from "./company-list.service";
import { AuthService } from 'src/app/Auth/auth.service';
import { Route, Router } from '@angular/router';
import { UserManagementService } from '../user-management/user-management.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'uni-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.scss']
})
export class CompanyListComponent implements OnInit {
  companyListData: any []= []
  industryInterested: any;
  countryList: any;
  headQuartersList: any
  page = 1;
  pageSize = 50;
  valueNearYouFilter: string = '';
  totalCompanyCount: any;
  isFilterVisible: string = 'none';
  filterForm:FormGroup;
  planExpired!: boolean;
  restrict:boolean=false;
  currentPlan:string="";
  PersonalInfo!:any;

  constructor(
    private _location: Location, 
    private fb: FormBuilder, 
    private companyListService: CompanyListService, 
    private authService: AuthService, 
    private router:Router, 
    private userManagementService:UserManagementService,
    private toast: MessageService,
    ) {
    this.filterForm = this.fb.group({
      company_name: [''],
      country: [''],
      head_quarters: [''],
      // fromdate: [''],
      // todate: [''],
      industry_interested: [''],
    });
  }

  ngOnInit(): void {
    
    this.loadMultiSelectData();
    this.checkplanExpire();
    this.GetPersonalProfileData();
  }

  goBack(){
    this._location.back();
  }

  performSearch(events:any){
    if(this.planExpired){
      this.restrict=true;
      this.valueNearYouFilter = "";
      return;
    }
    if (this.valueNearYouFilter == "") {
      this.loadCompanyData();
      return;
    }
    var companySearchData: any = [];
    this.companyListData.filter(item => {
      if (item.company_name?.toLowerCase().includes(this.valueNearYouFilter.toLowerCase())) {
        companySearchData.push(item);
      }
    });
    this.companyListData = [...companySearchData];
  }

  searchClick(){
    if(this.planExpired){
      this.restrict=true;
      this.valueNearYouFilter = "";
      let searchInput = document.getElementById("searchInput") as HTMLInputElement;;
      if (searchInput !== null) {
        searchInput.disabled = true;
      }
    }
  }
  loadMultiSelectData(){
    this.companyListService.getMultiSelectData().subscribe((response) => {
      this.industryInterested = response.company_industry;
      this.countryList = response.countries_list;
    });
  }

  // resetFilter(){
  //   this.filterForm.reset();
  //   this.loadInvestorData();
  // }

  clearFilter(){
    this.filterForm.reset();
    this.loadCompanyData();
  }
  clearRestriction() {
    this.restrict = false;
    let searchInput = document.getElementById("searchInput")as HTMLInputElement;;
      if (searchInput !== null) {
        searchInput.disabled = false;
      }
  }
  loadCompanyData(){
    let data = {
      company_name: this.filterForm.value.company_name ? this.filterForm.value.company_name : '',
      country: this.filterForm.value.country ? this.filterForm.value.country : '',
      head_quarters: this.filterForm.value.head_quarters ? this.filterForm.value.head_quarters : '',
      // fromdate: this.filterForm.value.fromdate ? this.filterForm.value.fromdate : '',
      // todate: this.filterForm.value.todate ? this.filterForm.value.todate : '',
      industry_interested: this.filterForm.value.industry_interested ? this.filterForm.value.industry_interested : '',
      page: this.page,
      perpage: this.pageSize,
      planname:this.currentPlan?this.currentPlan:""
    }
    this.companyListService.getCompanyList(data).subscribe((response) => {
      this.companyListData = response.data;
      this.totalCompanyCount = response.count;
    });
    this.isFilterVisible = 'none'
  }

  pageChange(event: any){
    if(this.planExpired){
      this.restrict=true;
      return;
    }
    this.page = event.page + 1;
    this.pageSize = event.rows;
    this.loadCompanyData();
  }

  closePopup(){
    this.isFilterVisible = 'none'

  }

  filterBy(){
    if(this.planExpired){
      this.restrict=true;
      return;
    }
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
      this.currentPlan=subscription_exists_status.subscription_plan;
      if (data.plan === "expired" || data.plan === 'subscription_expired' || subscription_exists_status.subscription_plan === 'free_trail' || subscription_exists_status.subscription_plan === 'Student') {
        this.planExpired = true;
      } else {
        this.planExpired = false;
      }
      this.loadCompanyData();
    })
  }

  companyGuidlines(): void{
    this.router.navigate(["/pages/company-guidlines"]);
  }

  upgradePlan(): void {
    this.router.navigate(["/pages/subscriptions"]);
  }
 
  loadHeadQuartersData(event: any){
    this.companyListService.getHeadQuartersList(event.value).subscribe((response) => {
      this.headQuartersList = response;
    });
  }
  GetPersonalProfileData() {
    this.userManagementService.GetUserPersonalInfo().subscribe(data => {
        this.PersonalInfo = data;
    });
}
  bookmarkQuestion(companyId:any,isFav:any){
    isFav=isFav!='1'?true:false;
     this.companyListService.bookmarkCompanyData(companyId,this.PersonalInfo.user_id,isFav).subscribe((response) => {
      let companyData=this.companyListData.find(item=>item.id==companyId);
      isFav==true?companyData.favourite=1:companyData.favourite=null;
      this.toast.add({
        severity: "success",
        summary: "Success",
        detail: response.message,
      });
     });
  }
}
