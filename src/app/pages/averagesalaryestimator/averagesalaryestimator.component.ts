import { Component, Input, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { PageFacadeService } from "../page-facade.service";
import { AveragesalaryestimatorService } from "./averagesalaryestimator.service";
import { CommonModule } from "@angular/common"
import { MessageService } from 'primeng/api'
import { DialogModule } from "primeng/dialog"
import { SidebarModule } from "primeng/sidebar"
import { PromptService } from "../prompt.service";
import { CardModule } from "primeng/card"
import { PaginatorModule } from "primeng/paginator"
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import { CarouselModule } from "primeng/carousel"
import { ButtonModule } from "primeng/button"
import { MultiSelectModule } from "primeng/multiselect"
import { SelectModule } from "primeng/select"
import { InputGroupModule } from "primeng/inputgroup"
import { InputTextModule } from "primeng/inputtext"
import { InputGroupAddonModule } from "primeng/inputgroupaddon"
import { RadioButtonModule } from "primeng/radiobutton"
import { City } from "src/app/@Models/cost-of-living";
import { EducationToolsService } from "../education-tools/education-tools.service";
import { AverageSalaryPreparedListComponent } from "./preparedlist/preparedlist.component";
import { PdfViewerModule } from "ng2-pdf-viewer";
import { AuthService } from "src/app/Auth/auth.service";

@Component({
  selector: "uni-averagesalaryestimator",
  templateUrl: "./averagesalaryestimator.component.html",
  styleUrls: ["./averagesalaryestimator.component.scss"],
  standalone: true,
  imports: [CommonModule, DialogModule, RadioButtonModule, SidebarModule, PdfViewerModule, RouterModule, CardModule, PaginatorModule, FormsModule, ReactiveFormsModule, CarouselModule, ButtonModule, MultiSelectModule, SelectModule, InputGroupModule, InputTextModule, InputGroupAddonModule, AverageSalaryPreparedListComponent],
})
export class AverageSalaryComponent implements OnInit {
  @ViewChild("jobRoleInput") JobRoleInput: ElementRef;

  constructor(
    private router: Router,
    private pageFacade: PageFacadeService,
    private service: AveragesalaryestimatorService,
    private educationService: EducationToolsService,
    private promptService: PromptService,
    private toast: MessageService,
    private authService: AuthService
  ) {
    this.getJobRoles();
  }
  @Input() prepData: any;
  enableModule: boolean = false;
  activePageIndex: number = 0;
  invalidClass: boolean = false;
  selectedData: { [key: string]: any } = {};
  filterJobRole: any[] = [];
  
  recommendations: { id: number, question: string }[] = [
    {
      id: 1,
      question: "What is your Job Role",
    },
    {
      id: 2,
      question: "How many years of experience do you have?",
    },
    {
      id: 3,
      question: "What is your Employement type?",
    },
    {
      id: 4,
      question: "Select your Job location",
    },
    {
      id: 5,
      question: "What is your work type",
    },
    // {
    //   id: 6,
    //   question: "Select your Preferred Currency",
    // },
  ];
  userInputs: any;

  ngOnInit() {
    this.selectedData = {};
    this.activePageIndex = 0;
    this.selectedCardIndex = null;
    this.getJobPreferences();
    this.getworkMode();
    this.getCityList();
    this.getyearsofExperience();
    this.getcurrencies();
  }



  selectedCardIndex: number | null = null;

  selectCard(index: number): void {
    this.selectedCardIndex = index;
  }

  departureLocationList: City[] = [];

  getCityList() {
    this.service.getCitieswithflag().subscribe({
      next: (response: any) => {
        this.departureLocationList = response;
      },
    });
  }
  jobPreferences: any = [];
  getJobPreferences() {
    this.service.getJobPreferences().subscribe((response: any) => {
      this.jobPreferences = response;
    });
  }
  jobRoles = [];
  getJobRoles() {
    this.service.getJobRoles().subscribe((response: any) => {
      this.jobRoles = response;
    });
  }
  workMode = [];
  getworkMode() {
    this.service.getWorkmodetype().subscribe((response: any) => {
      this.workMode = response;
    });
  }
  currencies: any = [];
  getcurrencies() {
    this.educationService.getCurrencies().subscribe({
      next: (response: any) => {
        this.currencies = response;
      }
    });
    // this.service.getCurrencies().subscribe((response) => {
    //   this.currencies = [
    //     { country: "Select", currency_code: null },
    //     ...response,
    //   ];
    // });
  }
  yearsOfExperience: any = [];
  getyearsofExperience() {
    this.yearsOfExperience = [];
    this.service.getExperiences().subscribe((response: any) => {
      this.yearsOfExperience = [...response];
    });
  }
  previous(): void {
    this.invalidClass = false;
    if (this.activePageIndex > 0) {
      this.activePageIndex--;
    }
  }

  next(selectedId: number): void {
    if (this.authService.isInvalidSubscription('career_tools')) {
      this.authService.hasUserSubscription$.next(true);
      return;
    }
    this.invalidClass = false;
    if (this.selectedData[selectedId]?.length == 0) {
      this.invalidClass = true;
      return;
    }
    if (selectedId in this.selectedData) {
      if (this.activePageIndex < this.recommendations.length - 1) {
        this.activePageIndex++;
      }
    } else {
      this.invalidClass = true;
    }
  }
  preparedvisibility = false;
  getRecommendation() {
    this.invalidClass = false;
    if (this.selectedData[5] == null) {
      this.invalidClass = true;
      return;
    }

    this.preparedvisibility = true;
    const selectedJob: any = this.jobRoles.find(
      (data: any) => data.id === this.selectedData[1]
    );
    const findWrkType: any = this.jobPreferences.find((data: any) => data.id === this.selectedData[3]);
    const findWrkModeType: any = this.workMode.find((data: any) => data.id === this.selectedData[5]);
    let processedData = {
      role: selectedJob.jobrole,
      jobrole: selectedJob.id,
      worktype: this.selectedData[3],
      worktype_name: findWrkType.jobpreferences,
      workplace_type: this.selectedData[5],
      workplace_type_name: findWrkModeType.name,
      locationid: this.selectedData[4]?.city_id,
      location_name: this.selectedData[4]?.city_name + ', ' + this.selectedData[4]?.country_name,
      experience: this.selectedData[2],
      // currency: this.selectedData[6],
    };
    this.prepData = processedData;
  }
  windowChange(data: any) {
    this.preparedvisibility = data;
    this.ngOnInit();
  }
  openVideoPopup() {
    this.pageFacade.openHowitWorksVideoPopup("average-salary-estimator");
  }
  goBack() {
    if (this.preparedvisibility) {
      this.router.navigate(["/pages/average-salary-estimator"]);
    } else {
      this.router.navigate(["/pages/job-tool/career-tool"]);
    }
  }
  searchJob(event: Event): void {
    const input = event.target as HTMLInputElement;
    const query = input.value.toLowerCase().trim();
    if (query && query.length > 3) {
      const mockJobs = this.jobRoles;

      // Filter jobs that include the query
      this.filterJobRole = mockJobs.filter((job: any) =>
        job.jobrole.toLowerCase().includes(query)
      );

      // Sort the filtered jobs to prioritize exact matches
      this.filterJobRole.sort((a: any, b: any) => {
        const aJob = a.jobrole.toLowerCase();
        const bJob = b.jobrole.toLowerCase();

        if (aJob === query && bJob !== query) {
          return -1; // a comes first
        } else if (aJob !== query && bJob === query) {
          return 1; // b comes first
        } else if (aJob.startsWith(query) && !bJob.startsWith(query)) {
          return -1; // a comes first if it starts with the query
        } else if (!aJob.startsWith(query) && bJob.startsWith(query)) {
          return 1; // b comes first if it starts with the query
        } else {
          return 0; // Keep original order for other cases
        }
      });
    } else if (query.length < 1) {
      this.filterJobRole = [];
    }
  }
  setJobtitle(jobRoleId: number, jobRoleLabel: string) {
    this.selectedData[1] = jobRoleId;
    this.JobRoleInput.nativeElement.value = jobRoleLabel;
    this.filterJobRole = [];
  }

  showHistoryList: boolean = false;
  readResponse: boolean = false;
  ListData: any;
  totalDataCount: number = 0;
  saveRecommadation() {
    if (this.authService.isInvalidSubscription('career_tools')) {
      this.authService.hasUserSubscription$.next(true);
      return;
    }
    this.service.getavgsalarysavedresponse().subscribe((response: any) => {
      this.ListData = response;
      this.totalDataCount = this.ListData.length;
      this.showHistoryList = true;
      this.readResponse = false;
    });
  }
  savedresponseData: any = [];
  readSavedResponse(savedResponse: any) {
    const encodedJson = savedResponse.user_inputs;
    const decodedInput = JSON.parse(encodedJson);
    this.userInputs = decodedInput;
    this.savedresponseData = savedResponse;
    this.readResponse = true;
  }

  downloadRecommadation() {
    let addingInput: string = '';
    this.recommendations.forEach(values => {
      addingInput += `<p style="color: #3f4c83;"><strong>${values.question}</strong></p>`;
      let currentAnswer = "";
      if (values.id == 1) {
        currentAnswer = this.userInputs.role;
      } else if (values.id == 2) {
        if (this.userInputs.experience === 1) {
          currentAnswer = " Fresher";
        } else {
          currentAnswer = `${this.userInputs.experience} ${this.userInputs.experience === 1 ? "Year" : "Years"}`;
        }
      } else if (values.id == 3) {
        currentAnswer = this.userInputs.worktype_name;
      } else if (values.id == 4) {
        currentAnswer = this.userInputs.location_name;
      } else if (values.id == 5) {
        currentAnswer = this.userInputs.workplace_type_name;
      } else if (values.id == 6) {
        currentAnswer = this.userInputs.currency;
      }
      addingInput += `<p>${currentAnswer}</p><br>`;
    });
    let params: any = {
      module_name: "Average Salary Estimator",
      file_name: "average_salary_estimator",
      response: this.savedresponseData.answer,
      inputString: addingInput
    };
    this.promptService.responseBuilder(params);
  }
}
