import { Component, OnInit } from '@angular/core';
import { CommonModule } from "@angular/common";
import { ActivatedRoute } from '@angular/router';
import { TalentConnectService } from '../../talent-connect.service';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { FormsModule } from '@angular/forms';

export interface Job {
  isChecked: number;
  id: number;
  experience_level: string;
  job_overview: string;
  key_responsibilities: string | string[];
  technical_proficiency: string | string[];
  language_proficiency: string | Array<{ language: string, level: string }>;
  start_date: string;
  due_date: string;
  available_vacancies: number;
  hiring_timeframe: string;
  created_at: string;
  interview_format: string;
  position: string;
  work_location: string;
  company_name: string;
  industry_name: string;
  company_size: number;
  compensation_structure: string | string[];
  work_mode: string | string[];
  employment_type: string | string[];
  benefits_perks: string | string[];
  soft_skills: string | string[];
  hiring_stages: string | Array<{ id: number, name: string }>;
  total_applied: number;
  company_logo_url: string;
  educational_degree: string;
  salary_range: number;
  stage: string | null;
}

interface Message {
  sender: string; // Changed from isSender to sender for clarity
  content: string;
  time: string;
  type: 'text' | 'file' | 'button';
}

@Component({
  selector: 'uni-job-view',
  templateUrl: './job-view.component.html',
  styleUrls: ['./job-view.component.scss'],
  standalone: true,
  imports: [CommonModule, ButtonModule, TooltipModule, FormsModule]
})
export class JobViewComponent implements OnInit {
  id!: number;
  public Array = Array;
  jobDetails: Job = {
    isChecked: 0,
    id: 1,
    experience_level: "Mid-Level",
    job_overview: "We are looking for a skilled Software Developer to join our team.",
    key_responsibilities: "Develop, test, and maintain web applications.",
    technical_proficiency: ["JavaScript", "Angular", "Node.js"],
    language_proficiency: [{ "language": "English", "level": "High" }, { "language": "Spanish", "level": "Medium" }],
    start_date: "2025-04-01",
    due_date: "2025-06-30",
    available_vacancies: 3,
    hiring_timeframe: "2 months",
    created_at: "2025-03-10",
    interview_format: "Virtual",
    position: "Software Developer",
    work_location: "Remote",
    company_name: "Tech Solutions Inc.", // Fixed typo from comapany_name
    industry_name: "IT & Software",
    company_size: 500,
    compensation_structure: ["Annual Salary", "Performance Bonus"],
    work_mode: "Hybrid",
    employment_type: "Full-Time",
    benefits_perks: ["Health insurance", "Flexible hours"],
    soft_skills: ["Teamwork", "Communication"],
    hiring_stages: [{ "id": 1, "name": "Resume screening" }, { "id": 2, "name": "Technical interview" }, { "id": 3, "name": "HR interview" }],
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

  constructor(private activatedRoute: ActivatedRoute, private talentConnectService: TalentConnectService) { }

  ngOnInit(): void {
    this.id = this.activatedRoute?.snapshot?.params?.['id'] as number;
    if (this.id) {
      this.getJobDetails(Number(this.id));
    }
  }

  switchToConversationView(): void {
    this.currentView = 'conversation';
  }

  getJobDetails(id: number) {
    this.talentConnectService.getJobDetails(id).subscribe({
      next: response => {
        // Process the response data to match our Job interface
        if (response.job && response.job[0]) {
          const jobData = response.job[0];

          // Parse string arrays if they come as comma-separated strings
          this.jobDetails = {
            ...jobData,
            technical_proficiency: this.parseArrayData(jobData.technical_proficiency),
            key_responsibilities: this.parseArrayData(jobData.key_responsibilities),
            language_proficiency: this.parseLanguageProficiency(jobData.language_proficiency),
            compensation_structure: Array.isArray(jobData.compensation_structure) ?
              jobData.compensation_structure : [jobData.compensation_structure],
            work_mode: Array.isArray(jobData.work_mode) ?
              jobData.work_mode : [jobData.work_mode],
            employment_type: Array.isArray(jobData.employment_type) ?
              jobData.employment_type : [jobData.employment_type],
            benefits_perks: Array.isArray(jobData.benefits_perks) ?
              jobData.benefits_perks : [jobData.benefits_perks],
            soft_skills: Array.isArray(jobData.soft_skills) ?
              jobData.soft_skills : [jobData.soft_skills],
            hiring_stages: Array.isArray(jobData.hiring_stages) ?
              jobData.hiring_stages : [jobData.hiring_stages],
            company_name: jobData.company_name || jobData.comapany_name,
            work_location: jobData.work_location || jobData.worklocation
          };

          if (this.jobDetails.stage) {
            this.isShowApplyChat = true;
            this.getMessages(id);
          }
        }
      },
      error: error => {
        console.log(error);
      }
    });
  }

  // Helper method to parse string data into arrays
  private parseArrayData(data: any): string[] {
    if (Array.isArray(data)) {
      return data;
    } else if (typeof data === 'string') {
      return data.split(',').map(item => item.trim());
    }
    return [data.toString()];
  }

  // Helper method to parse language proficiency data
  private parseLanguageProficiency(data: any): Array<{ language: string, level: string }> {
    if (Array.isArray(data)) {
      return data;
    } else if (typeof data === 'string') {
      // Parse string format like "[English,High],[Tamil,High]"
      try {
        const matches = data.match(/\[([^\]]+)\]/g);
        if (matches) {
          return matches.map(match => {
            const parts = match.replace(/[\[\]]/g, '').split(',');
            return { language: parts[0], level: parts[1] };
          });
        }
      } catch (e) {
        console.error('Error parsing language proficiency', e);
      }
    }
    return [{ language: data?.toString() || 'English', level: 'Basic' }];
  }

  applyJob(id: number) {
    this.talentConnectService.applyJob(id).subscribe({
      next: response => {
        if (response.success) {
          this.isShowApplyChat = true;
        }
        if (response.job && response.job[0]) {
          this.jobDetails = response.job[0];
        }
      },
      error: error => {
        console.log(error);
      }
    });
  }

  getMessages(job_id: number) {
    this.talentConnectService.getMessage({ job_id: job_id }).subscribe({
      next: response => {
        if (Array.isArray(response)) {
          // Handle array response
          this.messages = response.map(item => {
            return {
              sender: item.isEmployeer ? 'uniabroad' : 'johndoe',
              content: item.chat,
              time: new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              type: 'text'
            };
          });
        } else {
          // Handle object response
          console.log('Message response:', response);
        }
      },
      error: error => {
        console.log(error);
      }
    });
  }

  sendMessage(message: string): void {
    if (!message.trim()) return;

    // Add message to local array immediately for better UX
    this.messages.push({
      sender: 'johndoe',
      content: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'text'
    });

    this.talentConnectService.sendMessage({ job_id: this.id, chat: message }).subscribe({
      next: response => {
        console.log('Message sent:', response);
        // If there's a response message from the server, add it
        if (response.message) {
          this.messages.push({
            sender: 'uniabroad',
            content: response.message,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: 'text'
          });
        }
      },
      error: error => {
        console.log('Error sending message:', error);
      }
    });
  }
}