import { Component, Input, OnInit, ViewChild, ElementRef } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { PageFacadeService } from "../page-facade.service";
import { InterviewPreparationService } from "./interviewpreparation.service";
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
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
import { JobPreparedListComponent } from './preparedlist/preparedlist.component';
import { AuthService } from "src/app/Auth/auth.service";
@Component({
  selector: "uni-job-prep",
  templateUrl: "./interviewpreparation.component.html",
  styleUrls: ["./interviewpreparation.component.scss"],
  standalone: true,
  imports: [CommonModule, RouterModule, TooltipModule, DialogModule, CardModule, PaginatorModule, FormsModule, ReactiveFormsModule, CarouselModule, ButtonModule, MultiSelectModule, SelectModule, InputGroupModule, InputTextModule, InputGroupAddonModule, JobPreparedListComponent]
})
export class JobPreparationComponent implements OnInit {
  @ViewChild('jobRoleInput') JobRoleInput: ElementRef;

  constructor(
    private router: Router,
    private pageFacade: PageFacadeService,
    private service: InterviewPreparationService,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {

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
      question: "What is your desired Job role or position?",
    },
    {
      id: 2,
      question: "Which soft skills do you consider your strongest?",
    },
    {
      id: 3,
      question: "Which professional skills do you consider your strongest?",
    },
    {
      id: 4,
      question: "How many years of job experience do you have?",
    },
    {
      id: 5,
      question: "What is your primary reason for transitioning to this specific role?",
    },
    {
      id: 6,
      question: "What industry does your job role align with?",
    },
    {
      id: 7,
      question: "What is your preferred work environment?",
    },
  ];
  ngOnInit() {
    if (this.route.snapshot.queryParamMap.get('questionid')) { //Question share
      this.prepData = {
        questionid: this.route.snapshot.queryParamMap.get('questionid'),
        role: this.route.snapshot.queryParamMap.get('role'),
        jobrole: this.route.snapshot.queryParamMap.get('jobrole'),
        softskill: this.route.snapshot.queryParamMap.get('softskill'),
        techskill: this.route.snapshot.queryParamMap.get('techskill'),
        experience: this.route.snapshot.queryParamMap.get('experience'),
        reason: this.route.snapshot.queryParamMap.get('reason'),
        job_preference: this.route.snapshot.queryParamMap.get('job_preference'),
        industry: this.route.snapshot.queryParamMap.get('industry')
      }
      this.preparedvisibility = true;
      return;
    }
    this.selectedData = {};
    this.activePageIndex = 0;
    this.selectedCardIndex = null;
    this.getJobRoles();
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
    if (this.authService.isInvalidSubscription('career_tools')) {
      this.authService.hasUserSubscription$.next(true);
      return;
    }
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
      industry: this.selectedData[6]
    };
    this.prepData = processedData;
  }
  windowChange(data: any) {
    if (this.route.snapshot.queryParamMap.get('questionid')) { // remove question share query params
      this.router.navigate(['/pages/interviewprep']);
      this.getJobRoles();
      this.getsoftSkills();
      this.getJobExperience();
      this.getJoiningReasons();
      this.getJobPreferences();
      this.getIndustries();
    }
    this.preparedvisibility = data;
    this.selectedData = {};
    this.activePageIndex = 0;
    this.selectedCardIndex = null;
  }
  openVideoPopup(videoLink: string) {
    this.pageFacade.openHowitWorksVideoPopup(videoLink);
  }
  goBack() {
    this.router.navigate(["/pages/job-tool/career-tool"]);
  }
  searchJob(event: Event): void {
    const input = event.target as HTMLInputElement;
    const query = input.value.toLowerCase().trim();
    if (query && query.length > 3) {
      const mockJobs = this.jobRoles;

      // Filter jobs that include the query
      this.filterJobRole = mockJobs.filter((job: any) => job.jobrole.toLowerCase().includes(query));

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
