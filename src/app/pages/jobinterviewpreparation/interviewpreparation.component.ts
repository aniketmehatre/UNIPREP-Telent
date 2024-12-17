import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Router } from "@angular/router";
import { PageFacadeService } from "../page-facade.service";
import { InterviewPreparationService } from "./interviewpreparation.service";

@Component({
  selector: "uni-job-prep",
  templateUrl: "./interviewpreparation.component.html",
  styleUrls: ["./interviewpreparation.component.scss"],
})
export class JobPreparationComponent implements OnInit {
  constructor(
    private router: Router,
    private pageFacade: PageFacadeService,
    private service: InterviewPreparationService
  ) {
    this.getJobRoles();
  }
  @Input() prepData: any;
  enableModule: boolean = false;
  activePageIndex: number = 0;
  invalidClass: boolean = false;
  selectedData: { [key: string]: any } = {};
  recommendations: any = [
    {
      id: 1,
      question: "Select your Role/Position",
    },
    {
      id: 2,
      question: "Select your Soft Skills",
    },
    {
      id: 3,
      question: "Select your Technical Skills",
    },
    {
      id: 4,
      question: "Select your Job Experience",
    },
    {
      id: 5,
      question: "Select your Reason for Joining the Role",
    },
    {
      id: 6,
      question: "Select your Industry",
    },
    {
      id: 7,
      question: "Select your Job Preference",
    },
  ];
  ngOnInit() {
    this.selectedData={};
    this.activePageIndex=0;
    this.selectedCardIndex=null
    this.getsoftSkills();
    this.getJobExperience();
    this.getJoiningReasons();
    this.getJobPreferences();
    this.getIndustries();
  }
  selectedCardIndex: number | null = null;

  selectCard(index: number): void {
    this.selectedCardIndex = index;
  }
  industries: any = [];
  getIndustries() {
    this.service.getIndustries().subscribe((response) => {
      this.industries = response;
    });
  }
  jobPreferences: any = [];
  getJobPreferences() {
    this.service.getJobPreferences().subscribe((response) => {
      this.jobPreferences = response;
    });
  }
  joiningReasons = [];
  getJoiningReasons() {
    this.service.getJoiningReasons().subscribe((response) => {
      this.joiningReasons = response;
    });
  }
  jobExperience = [];
  getJobExperience() {
    this.service.getJobExperience().subscribe((response) => {
      this.jobExperience = response;
    });
  }
  jobRoles = [];
  getJobRoles() {
    this.service.getJobRoles().subscribe((response) => {
      this.jobRoles = response;
    });
  }
  softSkills = [];
  getsoftSkills() {
    this.service.getsoftSkills().subscribe((response) => {
      this.softSkills = response;
    });
  }
  hardSkills = [];
  gethardSkills(roleid: any) {
    this.service
      .gethardSkills({ jobroleid: roleid })
      .subscribe((response: any) => {
        this.hardSkills = response;
      });
  }
  previous(): void {
    this.invalidClass = false;
    if (this.activePageIndex > 0) {
      this.activePageIndex--;
    }
  }

  next(productId: number): void {
    if (productId == 2) {
      this.gethardSkills(this.selectedData[1]);
    }
    this.invalidClass = false;
    if (this.selectedData[productId]?.length == 0) {
      this.invalidClass = true;
      return;
    }
    if (this.selectedData[productId]?.length > 2) {
      this.invalidClass = true;
      return;
    }
    if (productId in this.selectedData) {
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
    if (this.selectedCardIndex == null) {
      this.invalidClass = true;
      return;
    }
    this.preparedvisibility = true;
    const selectedJob: any = this.jobRoles.find(
      (data: any) => data.id === this.selectedData[1]
    );
    let processedData = {
      role: selectedJob.jobrole,
      jobrole: selectedJob.slug,
      softskill: this.selectedData[2].join(','),
      techskill: this.selectedData[3].join(','),
      experience: this.selectedData[4],
      reason: this.selectedData[5],
      job_preference: this.selectedCardIndex + 1,
      industry:this.selectedData[6]
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
    this.router.navigate(["/pages/job-tool/career-tool"]);
  }
}
