import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { EducationToolsService } from '../education-tools.service';
import { AuthService } from 'src/app/Auth/auth.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

export interface Politician {
  name: string;
  country: string;
  occupation: string;
  description: string;
  imageUrl: string;
  flag: string;
}

@Component({
  selector: 'uni-politician-insights',
  templateUrl: './politician-insights.component.html',
  styleUrls: ['./politician-insights.component.scss']
})
export class PoliticianInsightsComponent implements OnInit, OnDestroy {
  recommendations: { id: number, question: string }[] = [
    { id: 1, question: 'Select your preferred country?' },
  ];
  activePageIndex: number = 0;
  first = 0;
  page = 1;
  pageSize = 25;
  data: any = {
    page: this.page,
    perpage: this.pageSize,
  };
  inValidClass: boolean = false;
  selectedData: { [key: string]: any } = {};
  enableModule: boolean = false;
  subscription: Subscription;
  recommendRestrict: boolean = false;
  restrict: boolean = false;
  planExpired: boolean = false;
  currentPlan: any;
  countryList: any;
  totalPoliticianList = 2;
  isSkeletonVisible: boolean = false;
  politicians: Politician[] = [
  ];
  constructor(
    private toast: MessageService,
    private educationToolsService: EducationToolsService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.checkplanExpire();
    this.getCountryList();
  }

  pageChange(event: any) {
    if (this.planExpired) {
      this.restrict = true;
      return;
    }
    this.page = event.first / this.pageSize + 1;
    this.pageSize = event.rows;
    this.first = event.first;
    this.data.page = this.page;
    this.data.perpage = this.pageSize;
    this.getPoliticiansList(this.data);
  }

  backtoMain() {
    this.router.navigateByUrl('/pages/education-tools');
  }

  getRecommendation() {
    if (this.recommendRestrict) {
      this.restrict = true;
      return;
    }

    this.getPoliticiansList({ ...this.data });
  }

  getPoliticiansList(data: any) {
    this.isSkeletonVisible = true;
    let keyMapping: any = { "1": "country" };
    let newData = Object.fromEntries(Object.entries(this.selectedData).map(([key, value]) => {
      let mappedKey = keyMapping[key] || key;
      if (Array.isArray(value)) {
        value = value.filter(item => item !== null);
      }
      return [mappedKey, value];
    }));
    this.educationToolsService.getPoliticiansListByCountry({ ...newData, ...data }).subscribe({
      next: response => {
        this.isSkeletonVisible = false;
        this.enableModule = true;
        this.politicians = response?.politicians;
      },
      error: error => {
        this.isSkeletonVisible = false;
        this.toast.add({
          severity: "warning",
          summary: "Warning",
          detail: error.error.message,
        });
      }
    });
  }

  checkplanExpire(): void {
    this.authService.getNewUserTimeLeft().subscribe((res) => {
      let data = res.time_left;
      let subscription_exists_status = res.subscription_details;
      this.currentPlan = subscription_exists_status?.subscription_plan;
      if (
        data.plan === "expired" || data.plan === 'subscription_expired' ||
        subscription_exists_status?.subscription_plan === "free_trail"
      ) {
        this.planExpired = true;
      } else {
        this.planExpired = false;
      }
      if (
        data.plan === "expired" || data.plan === 'subscription_expired'
      ) {
        this.recommendRestrict = true;
      } else {
        this.recommendRestrict = false;
      }
    });
  }

  getCountryList() {
    this.educationToolsService.getCountry().subscribe(res => {
      let allCountries = res;
      this.countryList = allCountries;
    })
  }

  goBack() {
    this.router.navigateByUrl('/pages/education-tools');
  }

  ngOnDestroy() {
    // this.subscription.unsubscribe();
  }


}
