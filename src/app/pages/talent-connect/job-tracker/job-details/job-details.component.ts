import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output, Input, SimpleChanges, OnChanges } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { TalentConnectService } from '../../talent-connect.service';
import { StepsModule } from 'primeng/steps';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';

interface Job {
  isChecked: number;
  id: number;
  matching_skills: string;
  experience_level: string;
  job_overview: string;
  key_responsibilities: string; // Changed from array to string as per real data
  technical_proficiency: string; // Changed from array to string as per real data
  language_proficiency: string | Array<{ language: string; level: string }>;
  start_date: string;
  due_date: string;
  available_vacancies: number;
  hiring_timeframe: string;
  created_at: string;
  interview_format: string;
  position: string;
  work_location?: string;
  worklocation?: string;
  company_name: string;
  company_size: number;
  compensation_structure: string[] | string;
  work_mode: string[] | string;
  employment_type: string[] | string;
  benefits_perks: string[] | string;
  soft_skills: string[] | string;
  hiring_stages: any[];
  total_applied: number;
  company_logo_url: string;
  stage: string | null;
  salary_range?: number;
  salary_offer?: number;
  currency_code?: string;
  languages:LangProficiency[];
}

interface LangProficiency {
  lang: string;
  level: string
}
@Component({
  selector: 'uni-job-details',
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.scss'],
  imports: [ChipModule, ButtonModule, StepsModule, CommonModule, RatingModule, FormsModule],
  standalone: true,
})
export class JobDetailsComponent implements OnInit, OnChanges {

  @Output() closeInfo: EventEmitter<boolean> = new EventEmitter<boolean>(true);
  @Output() openChat: EventEmitter<boolean> = new EventEmitter<boolean>(true);
  @Input() showInfo: boolean = false;
  @Input() jobDetails: Job = {} as Job;
  @Input() showChat: boolean = false;
  activeIndex: number = 0;
  steps: MenuItem[] = [];
  activeStepIndex: number = 0; // Changed to start from 0
  public array = Array;

  constructor(private talentConnectService: TalentConnectService) { }

  ngOnInit(): void {
    this.initJobData();
    this.setActiveStep(this.jobDetails?.stage || undefined);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['jobDetails'] && !changes['jobDetails'].firstChange) {
      this.initJobData();
      if (this.jobDetails?.stage) {
        this.setActiveStep(this.jobDetails.stage);
      }
    }
  }

  // Job list methods
  initJobData(): void {
    // Initialize steps based on hiring_stages from real data
    if (this.jobDetails && this.jobDetails.hiring_stages) {
      this.steps = this.jobDetails.hiring_stages.map(stage => {
        return {
          label: stage.name
        };
      });
    } else {
      // Fallback steps if hiring_stages is not available
      this.steps = [
        { label: 'Resume Screening' },
        { label: 'Interview' },
        { label: 'Selection' }
      ];
    }
  }

  selectJob(job: Job): void {
    if (job?.stage) {
      this.setActiveStep(job?.stage);
    }
  }

  setActiveStep(stage: string | undefined): void {
    if (!stage) return;

    // Convert stage to number and set activeIndex based on 0-indexed value
    const stageNum = parseInt(stage);
    if (!isNaN(stageNum)) {
      this.activeIndex = stageNum - 1; // Adjust for 0-indexed steps array
    }
  }

  getProficiencyRating(proficiency: string): number {
    const ratings: { [key: string]: number } = {
      Beginner: 1,
      Elementary: 2,
      Intermediate: 3,
      Advanced: 4,
      Fluent: 5,
    };
    return ratings[proficiency] ?? 1;
  }
}
