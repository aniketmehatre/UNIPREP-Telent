import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";
import { FormBuilder, FormGroup } from "@angular/forms";
import { InvestorListService } from "./investor-list.service";
import { AuthService } from 'src/app/Auth/auth.service';
import { Router } from '@angular/router';
import { UserManagementService } from '../user-management/user-management.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'uni-investor-list',
  templateUrl: './investor-list.component.html',
  styleUrls: ['./investor-list.component.scss']
})
export class InvestorListComponent implements OnInit {
  investorData: any[] = []
  investorIndustryInterested: any;
  investorOrgType: any;
  investorType: any;
  countryList: any;
  headQuartersList: any
  page = 1;
  pageSize = 50;
  valueNearYouFilter: string = '';
  totalInvestorsCount: any;
  isFilterVisible: string = 'none';
  filterForm: FormGroup;
  planExpired!: boolean;
  restrict: boolean = false;
  currentPlan: string = "";
  isBookmarked:boolean=false;
  PersonalInfo!:any;

  constructor(
    private _location: Location, 
    private fb: FormBuilder, 
    private investorList: InvestorListService, 
    private authService: AuthService, 
    private router: Router,
    private userManagementService:UserManagementService,
    private toast: MessageService,
    ) {
    this.filterForm = this.fb.group({
      org_name: [''],
      country: [''],
      head_quarters: [''],
      investor_type: [''],
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
    if (this.valueNearYouFilter == "") {
      this.loadInvestorData(0);
      return;
    }
    var investorSearchData: any = [];
    this.investorData.filter(item => {
      if (item.org_name?.toLowerCase().includes(this.valueNearYouFilter.toLowerCase())) {
        investorSearchData.push(item);
      };
    });
    this.investorData = [...investorSearchData];
  }

  loadMultiSelectData() {
    this.investorList.getMultiSelectData().subscribe((response) => {

      this.investorIndustryInterested = response.investor_industry_interested;
      this.investorOrgType = response.investor_org_type;
      this.investorType = response.investor_type;
      this.countryList = response.countries_list;
    });
  }

  // resetFilter() {
  //   this.filterForm.reset();
  //   this.loadInvestorData();
  // }
  clearFilter() {
    this.filterForm.reset();
    this.loadInvestorData(0);
  }

  investorGuidlines(): void {
    this.router.navigate(["/pages/investor-guidlines"]);
  }
  
  loadInvestorData(isFavourite:number) {
  
    let data:any = {
      org_name: this.filterForm.value.org_name ? this.filterForm.value.org_name : '',
      org_type: this.filterForm.value.org_type ? this.filterForm.value.org_type : '',
      country: this.filterForm.value.country ? this.filterForm.value.country : '',
      head_quarters: this.filterForm.value.head_quarters ? this.filterForm.value.head_quarters : '',
      investor_type: this.filterForm.value.investor_type ? this.filterForm.value.investor_type : '',
      industry_interested: this.filterForm.value.industry_interested ? this.filterForm.value.industry_interested : '',
      page: this.page,
      perpage: this.pageSize,
      planname:this.currentPlan?this.currentPlan:"",
    }
    if(isFavourite==1){
      data['favourite']=1;
    }

    this.investorList.getInvestorList(data).subscribe((response) => {
      this.investorData = response.data;
      this.totalInvestorsCount = response.count;
    });
    this.isFilterVisible = 'none';
  }

  pageChange(event: any) {
    if (this.planExpired) {
      this.restrict = true;
      return;
    }
    this.page = event.page + 1;
    this.pageSize = event.rows;
    this.loadInvestorData(0);
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
    this.investorList.export().subscribe((response) => {
      window.open(response.link, '_blank');
    });
  }

  checkplanExpire(): void {
    this.authService.getNewUserTimeLeft().subscribe((res) => {
      let data = res.time_left;
      let subscription_exists_status = res.subscription_details;
      this.currentPlan = subscription_exists_status.subscription_plan;
      if (data.plan === "expired" || data.plan === 'subscription_expired' ||
          subscription_exists_status.subscription_plan === 'free_trail' ||
          subscription_exists_status.subscription_plan === 'Student' ||
          subscription_exists_status.subscription_plan === 'Career') {
        this.planExpired = true;
        //this.restrict = true;
      } else {
        this.planExpired = false;
        //this.restrict = false;
      }
      this.loadInvestorData(0);
    })
  }

  upgradePlan(): void {
    this.router.navigate(["/pages/subscriptions"]);
  }

  loadHeadQuartersData(event: any) {
    this.investorList.getHeadQuartersList(event.value).subscribe((response) => {
      this.headQuartersList = response;
    });
  }
  clearRestriction() {
    this.restrict = false;
  }
  GetPersonalProfileData() {
    this.userManagementService.GetUserPersonalInfo().subscribe(data => {
        this.PersonalInfo = data;
    });
}
  bookmarkQuestion(investorId:any,isFav:any){
    isFav=isFav!='1'?true:false;
     this.investorList.bookmarkInvestorData(investorId,this.PersonalInfo.user_id,isFav).subscribe((response) => {
      let investorListData=this.investorData.find(item=>item.id==investorId);
      isFav==true?investorListData.favourite=1:investorListData.favourite=null;
      this.toast.add({
        severity: "success",
        summary: "Success",
        detail: response.message,
      });
     });
  }
  viewFavourites(){
this.loadInvestorData(1);
  }
}
