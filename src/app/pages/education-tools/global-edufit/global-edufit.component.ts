import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/Auth/auth.service';
import { LocationService } from 'src/app/location.service';
import { PageFacadeService } from '../../page-facade.service';
import { EducationToolsService } from '../education-tools.service';
import { optionsGlobal } from './global-edufit.data';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { CardModule } from 'primeng/card';
import { PaginatorModule } from 'primeng/paginator';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { DownloadRespose } from 'src/app/@Models/travel-tools.model';
import { TravelToolsService } from '../../travel-tools/travel-tools.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
@Component({
  selector: 'uni-global-edufit',
  templateUrl: './global-edufit.component.html',
  styleUrls: ['./global-edufit.component.scss'],
  standalone: true,
  imports: [CommonModule, SelectModule,RouterModule, DialogModule, CardModule, PaginatorModule,CarouselModule, ButtonModule, FormsModule, ReactiveFormsModule]
})
export class GlobalEdufitComponent implements OnInit {
  universityList: any = [];
  countryList: any = [];
  interestedCountryList: any = [];
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
  recommendationData: SafeHtml;
  constructor(
    private fb: FormBuilder,
    private educationToolService: EducationToolsService,
    private locationService: LocationService,
    private toast: MessageService,
    private authService: AuthService,
    private router: Router,
    private pageFacade: PageFacadeService,
    private travelToolService: TravelToolsService,
    private sanitizer: DomSanitizer
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
    this.form.controls['university'].valueChanges.subscribe(value =>{
      if(value){
        this.getCourseNameList(value.id);
      }
    })
    this.form.controls['interested_country'].valueChanges.subscribe(value =>{
      if(value){
        this.setCompareUniversityList(value.id);
      }
    })
  }

  enableModule: boolean = true;
  activePageIndex: number = 0;
  recommendations: any = [
    {
      id: 1,
      question: {
        heading: 'Basic Information',
        branches: ["Which country are you planning to study in?", "Which university are you considering?","What Course are you interested in?"]
      },
    },
    {
      id: 2,
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
    if (this.imagewhitlabeldomainname === "*.uniprep.ai" || this.imagewhitlabeldomainname === "dev-student.uniprep.ai" || this.imagewhitlabeldomainname === "uniprep.ai" || this.imagewhitlabeldomainname === "localhost") {
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
    // this.educationToolService.getCountryList().subscribe(data => {
    //   this.countryList = data;
    // });
    this.locationService.getHomeCountry(2).subscribe({
      next: response => {
        this.countryList = response;
      }
    });
    this.educationToolService.unifinderCountries().subscribe({
      next: response =>{
        this.interestedCountryList = response;
      }
    });
    // this.educationToolService.getCurrentSpecializations().subscribe(data => {
    //   this.specializationList = data;
    // });
    this.educationToolService.getCurrencies().subscribe(data => {
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
    // const isValidSixAmount = (value: any) => /^[0-9]{1,6}$/.test(value);
    // const isValidEightAmount = (value: any) => /^[0-9]{1,8}$/.test(value);
    const isValidEightAmount = (value: any) => {
      return typeof value === "number" && Number.isInteger(value) && value >= 0 && value <= 99999999;
    };
    if (!isValidEightAmount(formData.fees) || !isValidEightAmount(formData.cost_estimation)) {
      this.submitted = true;
      return;
    }
    if (this.recommendRestrict) {
      this.restrict = true;
      return;
    }
    let data: any = {
      ...this.form.value,
      university: formData.university.university_name,
      interested_country: formData.interested_country.country,
      mode: 'global_edufit'
    }
    this.educationToolService.getChatgptRecommendations(data).subscribe({
      next: response => {
        this.isRecommendationQuestion = false;
        this.isRecommendationData = true;
        this.isRecommendationSavedData = false;
        let chatGptResponse = response.response;
				chatGptResponse = chatGptResponse
					.replace(/```html|```/g, '')
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
				this.recommendationData = this.sanitizer.bypassSecurityTrustHtml(chatGptResponse);
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
    if (this.activePageIndex == 0) {
      if (!formData.interested_country || !formData.university || !formData.specialization) {
        this.submitted = true;
        return;
      }
    }
    // if (this.activePageIndex == 1) {
    //   if (!formData.specialization || !formData.duration) {
    //     this.submitted = true;
    //     return;
    //   }
    // }
    if (this.activePageIndex == 1) {
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
      this.specializationList = [];
      this.universityList = [];
    });
  }

  onSaveRes() {
    this.toast.add({ severity: "success", summary: "Success", detail: "Response saved successfully" });
  }

  downloadRecommadation() {
    const formValue = ['interested_country', 'university', 'specialization', 'fees', 'cost_estimation', 'period'];
    const formData = this.form.value;
    let addingInput = `<div style="font-family: 'Poppins', sans-serif; display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #d32f2f; padding-bottom: 10px; margin-bottom: 20px;">
				<div style="text-align: center;">
					<h2 style="margin: 0; color: #1a237e;">GLOBAL EDUFIT</h2>
				</div></div><p><strong>Input:<br></strong></p>`;

    // Keep track of which formValue index we're currently using
    let formValueIndex = 0;

    this.recommendations.forEach((category: any) => {
      addingInput += `<p><strong>${category.question.heading}</strong></p>`;

      category.question.branches.forEach((branchQuestion: any) => {
        addingInput += `<p style="color: #d32f2f;"><strong>${branchQuestion}</strong></p>`;

        let currentAnswer = "";
        const currentFormField = formValue[formValueIndex];

        if (formData && formData[currentFormField]) {
          if (currentFormField == 'fees' || currentFormField == 'cost_estimation') {
            currentAnswer = formData['currency_code'] + ' ' + formData[currentFormField];
          }
          else if (currentFormField == 'interested_country') {
            currentAnswer = formData['interested_country'].country
          }
          else if (currentFormField == 'university') {
            currentAnswer = formData['university'].university_name
          }
          else {
            currentAnswer = formData[currentFormField];
          }
        } else {
          currentAnswer = "No answer provided";
        }
        addingInput += `<p>${currentAnswer}</p>`;

        formValueIndex++;
      });

      // Add spacing between categories
      addingInput += `<br>`;
    });

    let finalRecommendation = addingInput + '<p><strong>Response:<br></strong></p>' + this.recommendationData;
     finalRecommendation = finalRecommendation
			.replace(/```html|```/g, '')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
			.replace(/\(see https:\/\/g\.co\/ng\/security#xss\)/g, '') 
			.replace(/SafeValue must use \[property\]=binding:/g, '')
			.replace(/class="container"/g, 'style="line-height:1.9"'); //because if i add container the margin will increase so i removed the container now the spacing is proper.

    let paramData: DownloadRespose = {
      response: finalRecommendation,
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
      this.universityList = data
    })
  }

  getCourseNameList(universityId: number){
    this.educationToolService.courseNameList(universityId).subscribe({
      next: response =>{
        this.specializationList = response;
      }
    })
  }
}
