import { Component, OnInit } from '@angular/core';
import { PitchDeskService } from "./pitch-desk.service";
import { FormBuilder, FormGroup } from "@angular/forms";
import { AuthService } from 'src/app/Auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'uni-pitch-desk',
  templateUrl: './pitch-desk.component.html',
  styleUrls: ['./pitch-desk.component.scss']
})
export class PitchDeskComponent implements OnInit {
  pitchDeskList: any[] = [];
  page = 1;
  pageSize = 50;
  totalPitchDeckCount = 0;
  isFilterVisible: string = 'none';
  filterForm: FormGroup;
  countrySelectBox:any = [];
  fundingTypeSelectBox:any = [];
  sectorSelectBox:any = [];
  valueNearYouFilter:string ="";
  showDiv: boolean = true;
  restrict: boolean = false;
  planExpired!: boolean;
  currentPlan: string = "";

  constructor(private pitchDesk:PitchDeskService, private fb: FormBuilder,private router: Router,private authService: AuthService,) { 
    this.filterForm = this.fb.group({
      pitchdeck_name: [''],
      country: [''],
      funding_type: [''],
      sector: [''],
    });
  }

  ngOnInit(): void {
    this.getPitchDeskList();
    this.checkplanExpire();
    this.selectBoxValues();
  }

  getPitchDeskList(){
    let data = {
      pitchdeck_name: this.filterForm.value.pitchdeck_name ? this.filterForm.value.pitchdeck_name : '',
      country: this.filterForm.value.country ? this.filterForm.value.country : '',
      funding_type: this.filterForm.value.funding_type ? this.filterForm.value.funding_type : '',
      sector: this.filterForm.value.sector ? this.filterForm.value.sector : '',
      page: this.page,
      perpage: this.pageSize,
      planname:this.currentPlan?this.currentPlan:"",
    }
    this.pitchDesk.getPitchDeskData(data).subscribe((responce)=>{
      this.totalPitchDeckCount = responce.total_count;
      this.pitchDeskList = responce.data;
    });
    this.isFilterVisible = 'none'
  }

  selectBoxValues(){
    this.pitchDesk.getSelectBoxValues().subscribe((responce)=>{
      
      this.countrySelectBox = responce.country;
      this.fundingTypeSelectBox = responce.funding_type;
      this.sectorSelectBox = responce.sectors;
    });
  }

  pageChange(event: any){
    if (this.planExpired) {
      this.restrict = true;
      return;
    }
    this.page = event.page + 1;
    this.pageSize = event.rows;
    this.getPitchDeskList();
  }

  filterBy(){
    if (this.planExpired) {
      this.restrict = true;
      return;
    }
    this.isFilterVisible = 'block';
  }

  clearFilter() {
    this.filterForm.reset();
    this.getPitchDeskList();
  }

  performSearch() {
    if (this.valueNearYouFilter == "") {
      this.getPitchDeskList();
      return;
    }
    var investorSearchData: any = [];
    this.pitchDeskList.filter(item => {
      if (item.pitchdeck_name?.toLowerCase().includes(this.valueNearYouFilter.toLowerCase())) {
        investorSearchData.push(item);
      };
    });
    this.pitchDeskList = [...investorSearchData];
  }

  closeGuidelines(){
    this.showDiv = !this.showDiv;
  }

  showPdf(url: any){
    window.open(url, "_blank");
  }

  clearRestriction() {
    this.restrict = false;
  }
  
  upgradePlan(): void {
    this.router.navigate(["/pages/subscriptions"]);
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
      this.getPitchDeskList();
    })
  }
}
