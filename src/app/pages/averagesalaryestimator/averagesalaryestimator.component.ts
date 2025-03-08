import { Component, Input, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Router } from "@angular/router";
import { PageFacadeService } from "../page-facade.service";
import { AveragesalaryestimatorService } from "./averagesalaryestimator.service";
import value from "crypto-js";
import { City } from "src/app/@Models/cost-of-living";
import { EducationToolsService } from "../education-tools/education-tools.service";

@Component({
  selector: "uni-averagesalaryestimator",
  templateUrl: "./averagesalaryestimator.component.html",
  styleUrls: ["./averagesalaryestimator.component.scss"],
})
export class AverageSalaryComponent implements OnInit {
  @ViewChild("jobRoleInput") JobRoleInput: ElementRef;

  constructor(
    private router: Router,
    private pageFacade: PageFacadeService,
    private service: AveragesalaryestimatorService,
    private educationService: EducationToolsService
  ) {
    this.getJobRoles();
  }
  @Input() prepData: any;
  enableModule: boolean = false;
  activePageIndex: number = 0;
  invalidClass: boolean = false;
  selectedData: { [key: string]: any } = {};
  filterJobRole: any[] = [];

  recommendations: { id: number , question: string}[] = [
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
      question: "What is the type Employement type?",
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
  customFilterFunction(type: string) {
    if (this.departureFilter === "") {
      this.departureLocationList = this.cityList;
      return;
    }
    this.departureLocationList = this.cityList.filter(
      (city) =>
        city?.city_name
          ?.toLowerCase()
          .includes(this.departureFilter.toLowerCase()) ||
        city?.country_name
          ?.toLowerCase()
          .includes(this.departureFilter.toLowerCase())
    );
  }

  resetFunction(type: string) {
    this.departureFilter = "";
    this.departureLocationList = this.cityList;
  }
  cityList: City[] = [];
  departureLocationList: City[] = [];
  destinationLocationList: City[] = [];
  departureFilter: string = "";
  getCityList() {
    this.service.getCitieswithflag().subscribe({
      next: (response) => {
        this.cityList = response;
        this.departureLocationList = response;
        this.destinationLocationList = response;
      },
    });
  }
  jobPreferences: any = [];
  getJobPreferences() {
    this.service.getJobPreferences().subscribe((response) => {
      this.jobPreferences = response;
    });
  }
  jobRoles = [];
  getJobRoles() {
    this.service.getJobRoles().subscribe((response) => {
      this.jobRoles = response;
    });
  }
  workMode = [];
  getworkMode() {
    this.service.getWorkmodetype().subscribe((response) => {
      this.workMode = response;
    });
  }
  currencies: any = [];
  getcurrencies() {
    this.educationService.getCurrencies().subscribe({
      next: response => {
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
    this.service.getExperiences().subscribe((response) => {
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
      location_name: this.selectedData[4]?.city_name+', '+this.selectedData[4]?.country_name,
      experience: this.selectedData[2],
      // currency: this.selectedData[6],
    };
    this.prepData = processedData;
  }
  windowChange(data: any) {
    this.preparedvisibility = data;
    this.ngOnInit();
  }
  openVideoPopup(videoLink: string) {
    this.pageFacade.openHowitWorksVideoPopup(videoLink);
  }
  goBack() {
    if(this.preparedvisibility){
      this.router.navigate(["/pages/average-salary-estimator"]);
    }else{
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
}
