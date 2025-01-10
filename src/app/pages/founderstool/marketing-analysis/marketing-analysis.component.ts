import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Country } from 'ngx-intl-tel-input/lib/model/country.model';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/Auth/auth.service';
import { DataService } from 'src/app/data.service';
import { LocationService } from 'src/app/location.service';
import { PageFacadeService } from '../../page-facade.service';
import { UserManagementService } from '../../user-management/user-management.service';
import { FounderstoolService } from '../founderstool.service';

@Component({
  selector: 'uni-marketing-analysis',
  templateUrl: './marketing-analysis.component.html',
  styleUrls: ['./marketing-analysis.component.scss']
})
export class MarketingAnalysisComponent implements OnInit {
  locationList: unknown[] = [];
  targetMarketList: unknown[] = [];
  productServiceList: unknown[] = [];
  businessModelList: unknown[] = [];
  salesChannelsList: unknown[] = [];
  timeFramesList: unknown[] = [];
  revenueStreamsList: unknown[] = [];
  competitorList: unknown[] = [];
  src = 'https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf';
  page = 1;
  pageSize = 25;
  first: number = 0;
  planExpired!: boolean;
  recommendRestrict: boolean = false;
  marketingForm: FormGroup = new FormGroup({});
  restrict: boolean = false;
  currentPlan: string = "";
  ehitlabelIsShow: boolean = true;
  imagewhitlabeldomainname: any;
  orglogowhitelabel: any;
  orgnamewhitlabel: any;
  locationName: string = '';
  data: any = {
    page: this.page,
    perpage: this.pageSize,
  };
  constructor(
    private fb: FormBuilder,
    private fundListService: FounderstoolService,
    private locationService: LocationService,
    private toast: MessageService,
    private authService: AuthService,
    private router: Router,
    private userManagementService: UserManagementService,
    private dataService: DataService,
    private pageFacade: PageFacadeService
  ) {
    this.marketingForm = this.fb.group({
      basics: this.fb.group({
        industry: ['', Validators.required],
        location: ['', Validators.required],
        targetMarket: ['', Validators.required],
        productService: ['', Validators.required],
      }),
      marketingAndSales: this.fb.group({
        businessModel: ['', Validators.required],
        salesChannel: ['', Validators.required],
        timeFrame: ['', Validators.required],
      }),
      finance: this.fb.group({
        budget: ['', Validators.required],
        revenueStreams: ['', Validators.required],
        competitorAnalysis: ['', Validators.required],
      })
    });

  }

  enableModule: boolean = false;
  activePageIndex: number = 0;
  recommendations: any = [
    {
      id: 1,
      question: {
        heading: 'Basic Information',
        branches: ["What is Your Industry", "Where are you located", "What is the Target Market", "Is your business a product/service"]
      },
    },
    {
      id: 2,
      question: {
        heading: 'Marketing & Sales',
        branches: ["What is Your Business Model?", "Where are you sales channel?", "Select the analysis time frame"]
      },
    },
    {
      id: 3,
      question: {
        heading: 'Finance',
        branches: ["What is your budget for marketing", "what are your revenue streams", "what is your competitor analysis focus?"]
      },
    },
  ];
  invalidClass: boolean = false;
  selectedData: { [key: string]: any } = {};

  ngOnInit(): void {
    this.locationService.getImage().subscribe(imageUrl => {
      this.orglogowhitelabel = imageUrl;
    });
    this.locationService.getOrgName().subscribe(orgname => {
      this.orgnamewhitlabel = orgname;
    });
    this.imagewhitlabeldomainname = window.location.hostname;
    if (this.imagewhitlabeldomainname === "dev-student.uniprep.ai" || this.imagewhitlabeldomainname === "uniprep.ai" || this.imagewhitlabeldomainname === "localhost") {
      this.ehitlabelIsShow = true;
    } else {
      this.ehitlabelIsShow = false;
    }
    // this.checkUserRecommendation();
    this.getFundCountry();
    // this.gethomeCountryList();
    // this.checkplanExpire();
    // this.getFundType();
    // this.GetPersonalProfileData();
  }

  backtoMain() {

  }

  performSearch() {
    if (this.locationName == "") {
      // this.loadFundData(0);
      return;
    }
    var searchedFund: any = [];
    // this..filter((item) => {
    //   if (item.name?.toLowerCase().includes(this.searchScholarshpName.toLowerCase())) {
    //     searchedFund.push(item);
    //   }
    // });
    // this.fundData = [...searchedFund];
  }

  getFundCountry() {
    this.fundListService.getFundCountries().subscribe(res => {
      let allCountries = res;
    });
  }


  // getFundType() {
  //   this.fundListService.getFundType().subscribe((response) => {
  //     this.fundTypeList = response;
  //     this.anyFundTypeList = [...response, { id: "any", type: "Select All" }];
  //   });
  // }



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
    // this.loadFundData(0);
  }

  exportTable() { }

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


      // this.loadFundData(0);
    });
  }

  upgradePlan(): void {
    this.router.navigate(["/pages/subscriptions"]);
  }
  clearRestriction() {
    this.restrict = false;
  }

  // onCheckboxChange(event: any) {
  //   const isChecked = (event.target as HTMLInputElement).checked;
  //   this.selectedFund = isChecked ? this.selectedFund + 1 : this.selectedFund - 1;
  //   if (isChecked == false) {
  //     if (this.selectedFund) {
  //       this.selectAllCheckboxes = false;
  //     }
  //   } else {
  //     if (this.fundData.length == this.selectedFund) {
  //       this.selectAllCheckboxes = true;
  //     }
  //   }
  // }

  openHowItWorksVideoPopup(videoLink: string) {
    this.pageFacade.openHowitWorksVideoPopup(videoLink);
  }

  checkUserRecommendation() {
    this.fundListService.getRecommendations().subscribe(res => {
      if (res.status) {
        this.enableModule = true;
      } else {
        this.enableModule = false;
        // this.addAnyValueToOptions();
      }
    });
  }

  getRecommendation() {
    if (this.recommendRestrict) {
      this.restrict = true;
      return;
    }
    // let keyMapping: any = { "1": "country", "2": "state", "3": "type" };

    // let newData = Object.fromEntries(Object.entries(this.selectedData).map(([key, value]) => {
    //   let mappedKey = keyMapping[key] || key;
    //   if (Array.isArray(value)) {
    //     value = value.filter(item => item !== null);
    //   }
    //   return [mappedKey, value];
    // }));
    // this.fundListService.storeRecommendation(newData).subscribe();
    this.enableModule = true;
    // this.setRecommendationToForm(newData);
  }

  previous(): void {
    this.invalidClass = false;
    if (this.activePageIndex > 0) {
      this.activePageIndex--;
    }
  }

  next(productId: number): void {
    this.invalidClass = false;
    if (this.activePageIndex < this.recommendations.length - 1) {
      this.activePageIndex++;

    } else {
      this.invalidClass = true;
    }
  }

  resetRecommendation() {
    this.fundListService.resetRecommendation().subscribe(res => {
      this.enableModule = false;
      this.selectedData = {};
      this.activePageIndex = 0;
      this.data.favourite = 0;
    });
  }

}
