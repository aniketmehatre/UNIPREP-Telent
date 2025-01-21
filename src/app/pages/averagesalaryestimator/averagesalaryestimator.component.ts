import { Component, Input, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Router } from "@angular/router";
import { PageFacadeService } from "../page-facade.service";
import { AveragesalaryestimatorService } from "./averagesalaryestimator.service";
import value from "crypto-js";

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
    private service: AveragesalaryestimatorService
  ) {
    this.getJobRoles();
  }
  @Input() prepData: any;
  enableModule: boolean = false;
  activePageIndex: number = 0;
  invalidClass: boolean = false;
  selectedData: { [key: string]: any } = {};
  filterJobRole: any[] = [];

  recommendations: any = [
    {
      id: 1,
      question: "Select your Job Title/Role",
    },
    {
      id: 2,
      question: "Select your Preferred work type",
    },
    {
      id: 3,
      question: "Select your Preferred work mode",
    },
    {
      id: 4,
      question: "Select your Job location",
    },
    {
      id: 5,
      question: "Select your years of experience",
    },
    {
      id: 6,
      question: "Select your Preferred Currency",
    },
  ];
  ngOnInit() {
    this.selectedData = {};
    this.activePageIndex = 0;
    this.selectedCardIndex = null;
    this.getJobPreferences();
    this.getworkMode();
    this.getCities();
    this.getyearsofExperience();
    this.getcurrencies();
  }
  selectedCardIndex: number | null = null;

  selectCard(index: number): void {
    this.selectedCardIndex = index;
  }
  cities: any = [];
  getCities() {
    this.service.getCities().subscribe((response) => {
      this.cities = response;
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
  currencies:any = [];
  getcurrencies() {
    this.service.getCurrencies().subscribe((response) => {
      this.currencies = [{country:"Select",currency_code:null},...response];
    });
  }
  yearsOfExperience:any = [];
  getyearsofExperience() {
    this.yearsOfExperience=[];
    for (let i = 0; i <= 30; i++) {
      // Example: From 0 to 30 years of experience
      let data = i == 0 ? { id: i, value: "Fresher" } : { id: i, value: i };
      this.yearsOfExperience.push(data);
    }
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
    if (this.selectedData[6]==null) {
      this.invalidClass = true;
      return;
    }
    this.preparedvisibility = true;
    const selectedJob: any = this.jobRoles.find(
      (data: any) => data.id === this.selectedData[1]
    );
    let processedData = {
      role: selectedJob.jobrole,
      jobrole: selectedJob.id,
      worktype: this.selectedData[2],
      workplace_type: this.selectedData[3],
      locationid: this.selectedData[4],
      experience: this.selectedData[5],
      currency: this.selectedData[6],
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
    this.router.navigate(["/pages/average-salary-estimator"]);
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
