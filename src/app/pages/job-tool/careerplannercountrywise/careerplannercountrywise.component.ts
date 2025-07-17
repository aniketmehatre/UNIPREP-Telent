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
import { PromptService } from "src/app/services/prompt.service";
import { SkeletonModule } from 'primeng/skeleton';
import { SharedModule } from 'src/app/shared/shared.module';
import { AuthService } from 'src/app/Auth/auth.service';
import { LocationService } from 'src/app/services/location.service';
import { removeExtraResponse } from '../../../@Supports/prompt';
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
  
  currentPlan: string = ""
  userInputs: any;
  experienceArray = [
    { label: 'Fresher', value: 'Fresher' },
    { label: '1 Year', value: '1 Year' },
    { label: '2 Years', value: '2 Years' },
    { label: '3 Years', value: '3 Years' },
    { label: '4 Years', value: '4 Years' },
    { label: '5 Years', value: '5 Years' },
    { label: '6 Years', value: '6 Years' },
    { label: '7 Years', value: '7 Years' },
    { label: '8 Years', value: '8 Years' },
    { label: '9 Years', value: '9 Years' },
    { label: '10 Years', value: '10 Years' },
    { label: '10+ Years', value: '10+ Years' },
  ];
  
  constructor(private router: Router, private service: JobSearchService, private fb: FormBuilder, private pageFacade: PageFacadeService,
    private toast: MessageService, private educationService: EducationToolsService, private sanitizer: DomSanitizer,
    private promptService: PromptService, private authService: AuthService, private locationService: LocationService
  ) {
    this.form = this.fb.group({
      country: ['', [Validators.required]],
      specialization_name: ['', [Validators.required]],
      experience: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.service.getCountryCurrency().subscribe((res: any) => {
      this.countries = res
    })

    this.educationService.getcareerPlannerSpec().subscribe({
      next: response => {
        this.specializationList = response;
      }
    });
    

  }


  get f() {
    return this.form.controls;
  }
  formSubmit() {
    this.recommendationData = "";
    if (this.authService.isInvalidSubscription('career_tools')) {
      this.authService.hasUserSubscription$.next(true);
      return;
    }

    this.submitted = true;
    if (this.form.valid) {
      var data = {
        mode: "careerplanner",
        country: this.form.value.country,
        specialization_name: this.form.value.specialization_name,
        experience: this.form.value.experience
      }
      this.userInputs = data;
      this.isFormVisible = false;
      this.isFormChatgptresponse = true;
      this.isResponseSkeleton = true;
      this.service.getCountryCurrencyChatGptOutput(data).subscribe({
        next: (res: any) => {
          
          this.isResponseSkeleton = false;
          this.recommendationData = this.sanitizer.bypassSecurityTrustHtml(res.response);
          this.submitted = false
          this.isSavedResponse = false;
          this.authService.aiCreditCount$.next(true);
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
    if (this.authService.isInvalidSubscription('career_tools')) {
      this.authService.hasUserSubscription$.next(true);
      return;
    }
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
  newResponse() {
    this.isFormVisible = true;
    this.isFormChatgptresponse = false;
    this.isSavedResponse = false;
  }
  goBackChatGptResp() {
    if (this.recommendationData?.toString().trim().length > 0) {
      this.isFormVisible = false;
      this.isFormChatgptresponse = true;
      this.isSavedResponse = false;
    } else {
      this.isFormVisible = true;
      this.isFormChatgptresponse = false;
      this.isSavedResponse = false;
    }
  }
  showRecommandationData(data: any, userInputs: any) {
    // this.recommendationData = data
    this.recommendationData = removeExtraResponse(data);
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
  openVideoPopup() {
    this.pageFacade.openHowitWorksVideoPopup("career-planner-country-wise");
  }
  onSaveRes() {
    this.toast.add({ severity: "success", summary: "Success", detail: "Response saved successfully" });
  }

  downloadRecommadation() {
    let addingInput: string = `
      <p style="color: var(--p-primary-500);"><strong>Which country are you interested in pursuing your career?</strong></p>
      <p>${this.userInputs.country}</p><br>
      <p style="color: var(--p-primary-500);"><strong>Select Your Specialization</strong></p>
      <p>${this.userInputs.specialization_name}</p>
      <p style="color: var(--p-primary-500);"><strong>How many years of experience do you have?</strong></p>
      <p>${this.userInputs.experience}</p>
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
    if (this.authService.isInvalidSubscription('career_tools')) {
      this.authService.hasUserSubscription$.next(true);
      return;
    }
    this.router.navigate(["/pages/export-credit"])
  }

}
