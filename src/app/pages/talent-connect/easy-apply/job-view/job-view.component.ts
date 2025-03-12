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
  jobDetails = {
    title: 'Senior UI/UX Designer',
    company: 'UNIABROAD Pvt. Ltd.',
    verified: true,
    skillMatch: {
      matched: 3,
      total: 4,
      skills: ['UI Design', 'Graphic Design', 'UX Design', 'Motion Design']
    },
    postedDate: '19-02-2025',
    companySize: '0-50',
    position: 'UI Designer',
    startDate: '19-02-2025',
    workLocation: 'Mysore',
    workMode: 'Onsite',
    employmentType: 'Full Time',
    salaryRange: '50,000 - 1,00,000',
    dueDate: '25-02-2025',
    total_applied: 10,
    available_vacancies: 50,
    experienceLevel: 'Mid Level',
    educationalDegree: 'Bachelor\'s Degree',
    industry: 'Tech Industry',
    overview: 'We are looking for a *creative and detail-oriented UI/UX Designer* to join our team at UNIABROAD. The ideal candidate will be responsible for designing user-friendly, engaging, and visually appealing interfaces for our digital platforms, ensuring a seamless user experience for students and stakeholders.',
    responsibilities: [
      'Design and implement intuitive, user-centered interfaces for web and mobile applications.',
      'Conduct user research and usability testing to understand pain points and improve UI/UX designs.',
      'Develop wireframes, prototypes, and mockups that effectively communicate design ideas.',
      'Collaborate with developers, product managers, and marketing teams to ensure seamless design integration'
    ],
    technicalProficiency: 'We are looking for a creative and detail-oriented UI/UX Designer to join our team. The ideal candidate will be responsible for designing user-centered digital experiences, creating',
    languageProficiency: [
      { language: 'Kannada', level: 'Native' },
      { language: 'Hindi', level: 'Beginner' },
      { language: 'English', level: 'Advanced' }
    ],
    compensationStructure: ['Performance-Based Bonuses', 'Profit-Sharing', 'Freelance/Contract-Based Pay'],
    benefits: ['Training & Certifications', 'Flexible Hours', 'Health Insurance'],
    softSkills: ['Creativity & Problem-Solving', 'Communication Skills', 'Attention to Detail'],
    hiringProcess: {
      stages: ['Onboarding & Orientation', 'Interview Process', 'Initial Screening & Phone Interview', 'Resume Screening & Shortlisting'],
      timeframe: '2-4 Weeks',
      format: 'Traditional Interview Format'
    }
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
        console.log(response);
        // this.jobDetails = response;
      },
      error: error => {
        console.log(error);
      }
    });
  }

  applyJob(id: number) {
    this.talentConnectService.applyJob(id).subscribe({
      next: response => {
        console.log(response);
        // this.jobDetails = response;
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

