import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { Location } from "@angular/common";
import { CompanyListService } from "./company-list.service";
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
  companyListData: any[] = []
  industryInterested: any;
  countryList: any;
  headQuartersList: any
  page = 1;
  pageSize = 50;
  valueNearYouFilter: string = '';
  totalCompanyCount: any;
  isFilterVisible: string = 'none';
  filterForm: FormGroup;
  planExpired!: boolean;
  restrict: boolean = false;
  currentPlan: string = "";
  PersonalInfo!: any;
  viewFavouritesLabel: string = "View Favourites";
  allCompanyList: any[] = [];
  allCompanyCount:number=0;
  selectedCompanies:number = 0;
  selectAllCheckboxes = false;
  exportDataIds:any[] = [];
  exportCreditCount: number = 0;

  constructor(
    private _location: Location,
    private fb: FormBuilder,
    private companyListService: CompanyListService,
    private authService: AuthService,
    private router: Router,
    private userManagementService: UserManagementService,
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

  goBack() {
    this._location.back();
  }

  performSearch(events: any) {
    if (this.planExpired) {
      this.restrict = true;
      this.valueNearYouFilter = "";
      return;
    }
    if (this.valueNearYouFilter == "") {
      this.loadCompanyData(0);
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

  searchClick() {
    if (this.planExpired) {
      this.restrict = true;
      this.valueNearYouFilter = "";
      let searchInput = document.getElementById("searchInput") as HTMLInputElement;;
      if (searchInput !== null) {
        searchInput.disabled = true;
      }
    }
  }
  loadMultiSelectData() {
    this.companyListService.getMultiSelectData().subscribe((response) => {
      this.industryInterested = response.company_industry;
      this.countryList = response.countries_list;
    });
  }

  // resetFilter(){
  //   this.filterForm.reset();
  //   this.loadInvestorData();
  // }

  clearFilter() {
    this.filterForm.reset();
    this.loadCompanyData(0);
  }
  clearRestriction() {
    this.restrict = false;
    let searchInput = document.getElementById("searchInput") as HTMLInputElement;;
    if (searchInput !== null) {
      searchInput.disabled = false;
    }
  }
  loadCompanyData(isFavourite: number) {
    let data: any = {
      company_name: this.filterForm.value.company_name ? this.filterForm.value.company_name : '',
      country: this.filterForm.value.country ? this.filterForm.value.country : '',
      head_quarters: this.filterForm.value.head_quarters ? this.filterForm.value.head_quarters : '',
      // fromdate: this.filterForm.value.fromdate ? this.filterForm.value.fromdate : '',
      // todate: this.filterForm.value.todate ? this.filterForm.value.todate : '',
      industry_interested: this.filterForm.value.industry_interested ? this.filterForm.value.industry_interested : '',
      planname: this.currentPlan ? this.currentPlan : ""
    }
    if(isFavourite==1){
      data['favourite']=1;
    }
    else{
      data['favourite'] = 0;
      data['page']=this.page;
      data['perpage']=this.pageSize;
    }
    this.companyListService.getCompanyList(data).subscribe((response) => {
      this.companyListData = response.data;
      this.exportCreditCount = response.credit_count;
      if (isFavourite != 1) {
        this.allCompanyList=response.data;
        this.allCompanyCount = response.count;
      }
      this.totalCompanyCount = response.count;
    });
    this.isFilterVisible = 'none'
  }

  pageChange(event: any) {
    if (this.planExpired) {
      this.restrict = true;
      return;
    }
    this.page = event.page + 1;
    this.pageSize = event.rows;
    this.loadCompanyData(0);
  }

  closePopup() {
    this.isFilterVisible = 'none'

  }

  filterBy() {
    if (this.planExpired) {
      this.restrict = true;
      return;
    }
    this.isFilterVisible = 'block';
  }

  exportTable() {
    this.companyListService.export().subscribe((response) => {
      window.open(response.link, '_blank');
    });
  }

  checkplanExpire(): void {
    this.authService.getNewUserTimeLeft().subscribe((res) => {
      let data = res.time_left;
      let subscription_exists_status = res.subscription_details;
      this.currentPlan = subscription_exists_status.subscription_plan;
      if (data.plan === "expired" || data.plan === 'subscription_expired' || subscription_exists_status.subscription_plan === 'free_trail' || subscription_exists_status.subscription_plan === 'Student') {
        this.planExpired = true;
      } else {
        this.planExpired = false;
      }
      this.loadCompanyData(0);
    })
  }

  companyGuidlines(): void {
    this.router.navigate(["/pages/company-guidlines"]);
  }

  upgradePlan(): void {
    this.router.navigate(["/pages/subscriptions"]);
  }

  loadHeadQuartersData(event: any) {
    this.companyListService.getHeadQuartersList(event.value).subscribe((response) => {
      this.headQuartersList = response;
    });
  }
  GetPersonalProfileData() {
    this.userManagementService.GetUserPersonalInfo().subscribe(data => {
      this.PersonalInfo = data;
    });
  }
  bookmarkQuestion(companyId: any, isFav: any) {
    isFav = isFav != '1' ? true : false;
    this.companyListService.bookmarkCompanyData(companyId, this.PersonalInfo.user_id, isFav).subscribe((response) => {
      let companyData = this.companyListData.find(item => item.id == companyId);
      isFav == true ? companyData.favourite = 1 : companyData.favourite = null;
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
      this.loadCompanyData(1);
    }
    else {
      let companyList = this.allCompanyList.map(company => {
        let foundCompany = this.companyListData.find(s => s.id == company.id);
        if (foundCompany) {
          company.favourite = foundCompany.favourite;
        }
        return company;
      });
      let favouriteCompany = companyList.filter(company => company.favourite === 1);
      let nonFavouriteCompany = companyList.filter(company => company.favourite !== 1);
      this.companyListData = favouriteCompany.concat(nonFavouriteCompany);
      this.totalCompanyCount=this.companyListData.length;
      this.totalCompanyCount=this.allCompanyCount;
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
    this.selectedCompanies = 0;
    this.selectAllCheckboxes = !this.selectAllCheckboxes;
    if(this.selectAllCheckboxes){
      this.companyListData.forEach(item=>{
        item.isChecked = 1;
        this.selectedCompanies += 1;
      })
    }else{
      this.companyListData.forEach(item=>{
        item.isChecked = 0;
      });
    }
  }

  onCheckboxChange(event: any){
    const isChecked = (event.target as HTMLInputElement).checked;
    this.selectedCompanies = isChecked ? this.selectedCompanies + 1 : this.selectedCompanies - 1;

    if(isChecked == false){
      if(this.selectedCompanies){
        this.selectAllCheckboxes = false;
      }
    }else{
      if(this.companyListData.length == this.selectedCompanies){
        this.selectAllCheckboxes = true;
      }
    }
  }

  exportData(){
    if (this.planExpired) {
      this.restrict = true;
      return;
    }else if(this.exportCreditCount != 0){
      this.exportDataIds = [];
      this.companyListData.forEach(item=>{
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
        module_id: 2,
        export_id: this.exportDataIds
      };
      this.companyListService.exportSelectedData(data).subscribe((response)=>{
        window.open(response.link, '_blank');
        this.loadCompanyData(0);
      })
    }else if(this.exportCreditCount == 0){
      this.toast.add({severity: "error",summary: "error",detail: "Please Buy Some Credits.",});
      this.router.navigate(["/pages/export-credit"]);
    }
    
  }
}

