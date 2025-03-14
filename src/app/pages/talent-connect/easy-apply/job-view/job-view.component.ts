import { Component } from '@angular/core';
import {NgClass} from "@angular/common";
import { ActivatedRoute } from '@angular/router';
import { TalentConnectService } from '../../talent-connect.service';

export interface Job {
  isChecked: number
  id: number
  experience_level: string
  job_overview: string
  key_responsibilities: string
  technical_proficiency: any
  language_proficiency: any
  start_date: string
  due_date: string
  available_vacancies: number
  hiring_timeframe: string
  created_at: string
  interview_format: string
  position: string
  work_location: string
  comapany_name: string
  industry_name: string
  company_size: number
  compensation_structure: string
  work_mode: string
  employment_type: string
  benefits_perks: string
  soft_skills: string
  hiring_stages: string
  total_applied: number
  company_logo_url: string
  educational_degree: string
  salary_range: number;
  stage: string | null;
}

interface Message {
  sender: string;
  content: string;
  time: string;
  type: 'text' | 'file' | 'button';
}

@Component({
  selector: 'uni-job-view',
  templateUrl: './job-view.component.html',
  styleUrls: ['./job-view.component.scss'],
  standalone: false,
})
export class JobViewComponent {
  id!: number;
  jobDetails: Job = {
    isChecked: 0,
    id: 1,
    experience_level: "Mid-Level",
    job_overview: "We are looking for a skilled Software Developer to join our team.",
    key_responsibilities: "Develop, test, and maintain web applications.",
    technical_proficiency: ["JavaScript", "Angular", "Node.js"],
    language_proficiency: ["English", "Spanish"],
    start_date: "2025-04-01",
    due_date: "2025-06-30",
    available_vacancies: 3,
    hiring_timeframe: "2 months",
    created_at: "2025-03-10",
    interview_format: "Virtual",
    position: "Software Developer",
    work_location: "Remote",
    comapany_name: "Tech Solutions Inc.",
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

  isShowApplyChat: boolean = false;


  currentView: 'initial' | 'conversation' = 'initial';
  
  messages: Message[] = [
    {
      sender: 'johndoe',
      content: 'I am a passionate UI/UX designer dedicated to crafting intuitive, user-centered experiences. With a keen eye for aesthetics and functionality, I specialize in wireframing, prototyping, and interaction design. My goal is to create seamless digital journeys that enhance usability, accessibility, and engagement, blending creativity with data-driven decision-making.',
      time: '12:00',
      type: 'text'
    },
    {
      sender: 'johndoe',
      content: 'Cover Letter.pdf',
      time: '12:00',
      type: 'file'
    },
    {
      sender: 'uniabroad',
      content: 'Click here to track your Job Application',
      time: '12:00',
      type: 'button'
    }
  ];
  showMessages: boolean = false;

  constructor(private activatedRoute: ActivatedRoute, private talentConnectService: TalentConnectService) { }

  ngOnInit(): void {
    this.id = this.activatedRoute?.snapshot?.params?.['id'] as number;
    if (this.id) {
      this.getJobDetails(Number(this.id));
    }
    // Initialize or fetch messages if needed
  }

  switchToConversationView(): void {
    this.currentView = 'conversation';
  }

  getJobDetails(id: number) {
    this.talentConnectService.getJobDetails(id).subscribe({
      next: response => {
        this.jobDetails = response.job[0];
      },
      error: error => {
        console.log(error);
      }
    });
  }

  applyJob(id: number) {
    this.talentConnectService.applyJob(id).subscribe({
      next: response => {
        if (response.success) {

        }
        this.jobDetails = response.job;
      },
      error: error => {
        console.log(error);
      }
    });
  }

  sendMessage(message: string): void {
    if (message.trim()) {
      // If sending message from initial view, switch to conversation view
      if (this.currentView === 'initial') {
        this.switchToConversationView();
      }
      
      this.messages.push({
        sender: 'johndoe',
        content: message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'text'
      });
    }
  }
}

