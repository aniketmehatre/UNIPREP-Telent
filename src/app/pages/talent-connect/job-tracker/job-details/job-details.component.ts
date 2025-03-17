import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { TalentConnectService } from '../../talent-connect.service';
import { Job } from '../../easy-apply/job-view/job-view.component';
import { StepsModule } from 'primeng/steps';

@Component({
  selector: 'uni-job-details',
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.scss'],
  imports: [ChipModule, ButtonModule, StepsModule, CommonModule],
  standalone: true,
})
export class JobDetailsComponent  implements OnInit{

  @Output() closeInfo: EventEmitter<boolean> = new EventEmitter<boolean>(true);
  @Input() showInfo: boolean = true;
  @Input() jobDetails: Job = {
    isChecked: 0,
    id: 1,
    experience_level: "Mid-Level",
    job_overview: "We are looking for a skilled Software Developer to join our team.",
    key_responsibilities: "Develop, test, and maintain web applications.",
    technical_proficiency: ["JavaScript", "Angular", "Node.js"],
    language_proficiency: [{ language: "English", level: 'High' }],
    start_date: "2025-04-01",
    due_date: "2025-06-30",
    available_vacancies: 3,
    hiring_timeframe: "2 months",
    created_at: "2025-03-10",
    interview_format: "Virtual",
    position: "Software Developer",
    work_location: "Remote",
    company_name: "Tech Solutions Inc.",
    industry_name: "IT & Software",
    company_size: 500,
    compensation_structure: "Annual Salary",
    work_mode: "Hybrid",
    employment_type: "Full-Time",
    benefits_perks: "Health insurance, Flexible hours",
    soft_skills: "Teamwork, Communication",
    hiring_stages: "Resume screening, Technical interview, HR interview",
    total_applied: 25,
    company_logo_url: "https://example.com/logo1.png",
    educational_degree: 'B.sc',
    salary_range: 100000,
    stage: null
  };
  jobs!: any;
  activeIndex: number = 0;
  steps: MenuItem[] = [];
  activeStepIndex: number = 1;

  constructor(private talentConnectService: TalentConnectService) { }
  ngOnInit(): void {
    this.steps = [
      {
        label: this.jobs.applicationStage.initialRound.label
      },
      {
        label: this.jobs.applicationStage.hrRound.label
      },
      {
        label: this.jobs.applicationStage.selected.label
      }
    ];
  }


    // Job list methods
    initJobData(): void {

    }
  
    selectJob(job: Job): void {
      if (job?.stage) {
        this.setActiveStep(job?.stage);
      }
    }


    setActiveStep(stage: string | undefined): void {
      if (!stage) return;
      
      switch (stage) {
        case 'Initial Round': this.activeStepIndex = 0; break;
        case 'HR Round': this.activeStepIndex = 1; break;
        case 'Selected': this.activeStepIndex = 2; break;
      }
    }
}
