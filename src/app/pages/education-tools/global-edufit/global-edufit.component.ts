import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/Auth/auth.service';
import { DataService } from 'src/app/data.service';
import { LocationService } from 'src/app/location.service';
import { FounderstoolService } from '../../founderstool/founderstool.service';
import { startupDropdownData } from '../../founderstool/start-up-expense-estimate/startup-expense.data';
import { PageFacadeService } from '../../page-facade.service';
import { EducationToolsService } from '../education-tools.service';
import { University } from 'src/app/@Models/sop-response.model';
import { options } from 'marked';
import { optionsGlobal } from './global-edufit.data';
import { DownloadRespose } from 'src/app/@Models/travel-tools.model';
import { TravelToolsService } from '../../travel-tools/travel-tools.service';

@Component({
  selector: 'uni-global-edufit',
  templateUrl: './global-edufit.component.html',
  styleUrls: ['./global-edufit.component.scss']
})
export class GlobalEdufitComponent implements OnInit {
  universityList: any = [];
  countryList: any = [];
  specializationList: any = [];
  degreeList: any = optionsGlobal.Degree;
  durationList: { name: string }[] = optionsGlobal.CourseDuration;
  // costEstimationList: { name: string }[] = optionsGlobal.;
  periodsList: { name: string }[] = optionsGlobal.Stayback;
  isFromSavedData: boolean = false;
  recommadationSavedQuestionList: any = [];
  page = 1;
  pageSize = 25;
  first: number = 0;
  planExpired!: boolean;
  recommendRestrict: boolean = false;
  form: FormGroup = new FormGroup({});
  restrict: boolean = false;
  currentPlan: string = "";
  ehitlabelIsShow: boolean = true;
  imagewhitlabeldomainname: any;
  orglogowhitelabel: any;
  orgnamewhitlabel: any;
  locationName: string = '';
  submitted: boolean = false;
  data: any = {
    page: this.page,
    perpage: this.pageSize,
  };
  currencyandCountryList: any;
  isRecommendationQuestion: boolean = true;
  isRecommendationData: boolean = false;
  isRecommendationSavedData: boolean = false;
  recommendationData: string = '';
  constructor(
    private fb: FormBuilder,
    private educationToolService: EducationToolsService,
    private locationService: LocationService,
    private toast: MessageService,
    private authService: AuthService,
    private router: Router,
    private dataService: DataService,
    private pageFacade: PageFacadeService,
    private travelToolService: TravelToolsService
  ) {
    this.form = this.fb.group({
      home_country: ['', Validators.required],
      interested_country: ['', Validators.required],
      university: ['', Validators.required],
      specialization: ['', Validators.required],
      degree: ['', Validators.required],
      duration: ['', Validators.required],
      currency_code: [''],
      fees: ['', Validators.required],
      cost_estimation: ['', Validators.required],
      period: ['', Validators.required],
    });

  }

  enableModule: boolean = true;
  activePageIndex: number = 0;
  recommendations: any = [
    {
      id: 1,
      question: {
        heading: 'Basic Information',
        branches: ["Select your home country", "Which country are you planning to study in?", "Which university are you considering?", "What specialization are you interested in?"]
      },
    },
    {
      id: 2,
      question: {
        heading: 'Course Details',
        branches: ["What type of degree are you planning to apply for?", "What is the expected duration of your studies?"]
      },
    },
    {
      id: 3,
      question: {
        heading: 'Finance',
        branches: ["What is the tuition fee for the program?", "What is the estimated cost of living per year?", "What is the post-study work visa or stayback period in the country?"]
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
    this.getCurrenyandLocation();
  }

  goBack() {
    this.router.navigateByUrl('/pages/education-tools');
  }

  getCurrenyandLocation() {
    this.educationToolService.getCountryList().subscribe(data => {
      this.countryList = data;
    });
    this.educationToolService.getCurrentSpecializations().subscribe(data => {
      this.specializationList = data;
    });
    this.educationToolService.getCurrencyAndCountries().subscribe(data => {
      this.currencyandCountryList = data;
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

  upgradePlan(): void {
    this.router.navigate(["/pages/subscriptions"]);
  }
  clearRestriction() {
    this.restrict = false;
  }

  openHowItWorksVideoPopup(videoLink: string) {
    this.pageFacade.openHowitWorksVideoPopup(videoLink);
  }


  getRecommendation() {
    this.submitted = false;
    const formData = this.form.value;
    if (!formData.fees || !formData.period || !formData.cost_estimation) {
      this.submitted = true;
      return;
    }
    const isValidSixAmount = (value: any) => /^[0-9]{1,6}$/.test(value);
    const isValidEightAmount = (value: any) => /^[0-9]{1,8}$/.test(value);
    if (
      !isValidEightAmount(formData.fees) ||
      !isValidSixAmount(formData.cost_estimation)
    ) {
      this.submitted = true;
      return;
    }
    if (this.recommendRestrict) {
      this.restrict = true;
      return;
    }
    let data: any = {
      ...this.form.value,
      mode: 'global_edufit'
    }
    this.educationToolService.getChatgptRecommendations(data).subscribe({
      next: response => {
        this.isRecommendationQuestion = false;
        this.isRecommendationData = true;
        this.isRecommendationSavedData = false;
        this.recommendationData = response.response;
      },
      error: error => {
        this.isRecommendationData = false;
      }
    });
  }

  previous(): void {
    this.invalidClass = false;
    if (this.activePageIndex > 0) {
      this.activePageIndex--;
    }
  }

  next() {
    this.submitted = false;
    const formData = this.form.value;
    console.log(formData)
    if (this.activePageIndex == 0) {
      if (!formData.home_country || !formData.interested_country || !formData.university || !formData.specialization) {
        this.submitted = true;
        return;
      }
    }
    if (this.activePageIndex == 1) {
      if (!formData.degree || !formData.duration) {
        this.submitted = true;
        return;
      }
    }
    if (this.activePageIndex == 2) {
      if (!formData.fees || !formData.period || !formData.cost_estimation) {
        this.submitted = true;
        return;
      }
    }
    this.activePageIndex++;
  }

  saveRecommadation() {
    if (!this.isFromSavedData) {
      this.educationToolService.getAnalysisList('global_edufit').subscribe({
        next: response => {
          this.isRecommendationQuestion = false;
          this.isRecommendationData = false;
          this.isRecommendationSavedData = true;
          this.recommadationSavedQuestionList = response.data;
        },
        error: error => {
        }
      });
    }
  }

  showRecommandationData(data: string) {
    this.isRecommendationQuestion = false;
    this.isRecommendationData = true;
    this.isRecommendationSavedData = false;
    this.isFromSavedData = true;
    this.recommendationData = data;
  }




  resetRecommendation() {
    this.educationToolService.resetRecommendation().subscribe(res => {
      this.isRecommendationQuestion = true;
      this.isRecommendationData = false;
      this.isRecommendationSavedData = false;
      this.form.reset();
      this.activePageIndex = 0;
      this.isFromSavedData = false;
    });
  }

  onSaveRes() {
    this.toast.add({ severity: "success", summary: "Success", detail: "Response saved successfully" });
  }

  downloadRecommadation() {
    let paramData: DownloadRespose = {
      response: this.recommendationData,
      module_name: "Global Edufit",
      file_name: "global_edufit"
    };
    this.travelToolService.convertHTMLtoPDF(paramData).then(() => {
      console.log("PDF successfully generated.");
    }).catch(error => {
      console.error("Error generating PDF:", error);
    });
  }

  setCompareUniversityList(id: string) {
    this.educationToolService.getUniverstityByCountry(id).subscribe(data => {
      this.universityList = data;
    })
  }

}
