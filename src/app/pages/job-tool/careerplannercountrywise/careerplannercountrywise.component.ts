import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JobSearchService } from '../../job-search/job-search.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageFacadeService } from '../../page-facade.service';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { SidebarModule } from 'primeng/sidebar';
import { RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { PaginatorModule } from 'primeng/paginator';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { EducationToolsService } from '../../education-tools/education-tools.service';
import { PdfViewerModule } from "ng2-pdf-viewer";
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { PromptService } from '../../prompt.service';
import { SkeletonModule } from 'primeng/skeleton';
import { SharedModule } from 'src/app/shared/shared.module';
import { AuthService } from 'src/app/Auth/auth.service';
import { LocationService } from 'src/app/location.service';
@Component({
  selector: 'uni-careerplannercountrywise',
  templateUrl: './careerplannercountrywise.component.html',
  styleUrls: ['./careerplannercountrywise.component.scss'],
  standalone: true,
  imports: [CommonModule, DialogModule, SidebarModule, PdfViewerModule, RouterModule, CardModule, PaginatorModule, FormsModule, ReactiveFormsModule, CarouselModule, ButtonModule, MultiSelectModule, SelectModule, InputGroupModule, InputTextModule, InputGroupAddonModule, SkeletonModule, SharedModule]
})

export class CareerplannercountrywiseComponent implements OnInit {
  countries: any = [];
  form: FormGroup;
  submitted: boolean = false;
  isFormVisible: boolean = true;
  recommendationData: SafeHtml;
  isFormChatgptresponse: boolean = false;
  isSavedResponse: boolean = false;
  recommadationSavedQuestionList: any[] = [];
  specializationList: any = [];
  isResponseSkeleton: boolean = false;
  aiCreditCount:number = 0;
  planExpired: boolean = false
	currentPlan: string = ""
  restrict: boolean = false;
  ehitlabelIsShow: boolean = true;
  imagewhitlabeldomainname: any
	orgnamewhitlabel: any
	orglogowhitelabel: any
  userInputs: any;

  constructor(private router: Router, private service: JobSearchService, private fb: FormBuilder, private pageFacade: PageFacadeService,
    private toast: MessageService, private educationService: EducationToolsService, private sanitizer: DomSanitizer,
    private promptService: PromptService,private authService: AuthService,private locationService: LocationService
  ) {
    this.form = this.fb.group({
      country: ['', [Validators.required]],
      specialization_name: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.locationService.getImage().subscribe((imageUrl) => {
			this.orglogowhitelabel = imageUrl
		})
		this.locationService.getOrgName().subscribe((orgname) => {
			this.orgnamewhitlabel = orgname
		})
		this.imagewhitlabeldomainname = window.location.hostname
		if (this.imagewhitlabeldomainname === "*.uniprep.ai" || this.imagewhitlabeldomainname === "dev-student.uniprep.ai" || this.imagewhitlabeldomainname === "uniprep.ai" || this.imagewhitlabeldomainname === "localhost") {
			this.ehitlabelIsShow = true
		} else {
			this.ehitlabelIsShow = false
		}
    this.service.getCountryCurrency().subscribe((res: any) => {
      this.countries = res
    })

    this.educationService.getcareerPlannerSpec().subscribe({
      next: response => {
        this.specializationList = response;
      }
    });
    this.checkplanExpire();
    this.getAICreditCount();
   
  }

  getAICreditCount(){
    this.promptService.getAicredits().subscribe({
      next: resp =>{
        this.aiCreditCount = resp;
      }
    })
  }

  get f() {
    return this.form.controls;
  }
  formSubmit() {
    if (this.planExpired) {
			this.restrict = true
			return
		}
    this.submitted = true;
    if (this.form.valid) {
      var data = {
        mode: "careerplanner",
        country: this.form.value.country,
        specialization_name: this.form.value.specialization_name
      }
      this.userInputs = data;
      this.isFormVisible = false;
      this.isFormChatgptresponse = true;
      this.isResponseSkeleton = true;
      this.service.getCountryCurrencyChatGptOutput(data).subscribe({
        next: (res: any) => {
          this.getAICreditCount();
          this.isResponseSkeleton = false;
          this.recommendationData = this.sanitizer.bypassSecurityTrustHtml(res.response);
          this.submitted = false
          this.isSavedResponse = false;
          
        },
        error: (error) => {
          console.error(error);
          this.isResponseSkeleton = false;
        }
      })
    }
  }

 
  BackReset() {
    this.isFormVisible = true;
    this.isFormChatgptresponse = false;
    this.isSavedResponse = false;
    this.form.reset();
  }
  saveRecommadation() {
    this.service.getTripList('careerplanner').subscribe({
      next: response => {
        this.isFormVisible = false;
        this.isFormChatgptresponse = false;
        this.isSavedResponse = true;
        this.recommadationSavedQuestionList = response.data;
      },
      error: error => {
      }
    });
  }
  newResponse(){
    this.isFormVisible = true;
    this.isFormChatgptresponse = false;
    this.isSavedResponse = false;
  }
  goBackChatGptResp() {
    if(this.recommendationData?.toString().trim().length > 0 ){
      this.isFormVisible = false;
      this.isFormChatgptresponse = true;
      this.isSavedResponse = false;
    }else{
      this.isFormVisible = true;
      this.isFormChatgptresponse = false;
      this.isSavedResponse = false;
    }
  }
  showRecommandationData(data: any, userInputs: any) {
    console.log(data);
    
    this.recommendationData = data
    this.isFormVisible = false;
    this.isFormChatgptresponse = true;
    this.isSavedResponse = false;

    const encodedJson = userInputs;
		const decodedInput = JSON.parse(encodedJson);
		this.userInputs = decodedInput;
  }
  goBackcareerPlanList() {
    this.router.navigate(['/pages/job-tool/career-tool']);
  }
  openVideoPopup(videoLink: string) {
    this.pageFacade.openHowitWorksVideoPopup(videoLink);
  }
  onSaveRes() {
    this.toast.add({ severity: "success", summary: "Success", detail: "Response saved successfully" });
  }

  downloadRecommadation() {
    let addingInput: string = `
      <p style="color: #3f4c83;"><strong>Which country are you interested in pursuing your career?</strong></p>
      <p>${this.userInputs.country}</p><br>
      <p style="color: #3f4c83;"><strong>Select Your Specialization</strong></p>
      <p>${this.userInputs.specialization_name}</p>
      <br>
    `;
    let params: any = {
      module_name: "Career Planner Coutrywise",
      file_name: "career_planner_coutrywise",
      response: this.recommendationData,
      inputString: addingInput
    };
    this.promptService.responseBuilder(params);
  }
  buyCredits(): void {
		if (this.planExpired) {
			this.restrict = true
			return
		}
		this.router.navigate(["/pages/export-credit"])
	}
  checkplanExpire(): void {
		this.authService.getNewUserTimeLeft().subscribe((res) => {
			let data = res.time_left
			let subscription_exists_status = res.subscription_details
			this.currentPlan = subscription_exists_status.subscription_plan
			if (data.plan === "expired" || data.plan === "subscription_expired" || subscription_exists_status.subscription_plan === "free_trail" || subscription_exists_status.subscription_plan === "Student"  ) {
				this.planExpired = true
				//this.restrict = true;
			} else {
				this.planExpired = false
				//this.restrict = false;
			}
		})
	}
  clearRestriction() {
		this.restrict = false
	}

	upgradePlan(): void {
		this.router.navigate(["/pages/subscriptions"])
	}
}
