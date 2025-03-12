import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';

interface Job {
  id: number;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  status: 'Job Applied' | 'Application Received' | 'Shortlisted' | 'Position Closed';
  stage: 'Initial Round' | 'HR Round' | 'Selected';
  workLocation?: string;
  position?: string;
  startDate?: string;
  companySize?: string;
  workMode?: string;
  employmentType?: string;
  salaryRange?: string;
  availableVacancies?: number;
  totalApplied?: number;
  overview?: string;
  responsibilities?: string[];
  appliedDate?: string;
}

@Component({
  selector: 'uni-job-details',
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.scss'],
  imports: [ChipModule, ButtonModule, CommonModule],
  standalone: true,
})
export class JobDetailsComponent  implements OnInit{

  @Output() closeInfo: EventEmitter<boolean> = new EventEmitter<boolean>(true);
  @Input() showInfo: boolean = true;
  jobDetails: any = {
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
    totalApplied: 10,
      availableVacancies: 50,
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
  jobs!: any;
  activeIndex: number = 0;
  steps: MenuItem[] = [];
  activeStepIndex: number = 1;

  ngOnInit(): void {
    this.jobs = {
      title: 'Senior UI/UX Designer',
      company: 'UNIABROAD Pvt. Ltd.',
      verified: true,
      appliedOn: '19-02-2025',
      applicationStage: {
        initialRound: { complete: true, number: 1, label: 'Initial Round' },
        hrRound: { complete: false, active: true, number: 2, label: 'HR Round' },
        selected: { complete: false, number: 3, label: 'Selected' }
      },
      workLocation: 'Mysore',
      position: 'UI Designer',
      startDate: '19-02-2025',
      companySize: '0-50',
      workMode: 'Onsite',
      employmentType: 'Full Time',
      salaryRange: '50,000 - 1,00,000',
      availableVacancies: 50,
      totalApplied: 10,
      overview: 'We are looking for a *creative and detail-oriented UI/UX Designer* to join our team at UNIABROAD. The ideal candidate will be responsible for designing user-friendly, engaging, and visually appealing interfaces for our digital platforms, ensuring a seamless user experience for students and stakeholders.',
      keyResponsibilities: [
        'Design and implement intuitive, user-centered interfaces for web and mobile applications.',
        'Conduct user research and usability testing to understand pain points and improve UI/UX designs.',
        'Develop wireframes, prototypes, and mockups that effectively communicate design solutions.',
        'Basic knowledge of motion design and micro-interactions.'
      ],
      requiredSkills: [
        'Bachelor\'s degree in Graphic Design, Interaction Design, Computer Science, or a related field.',
        '2+ years of experience in UI/UX design.',
        'Strong understanding of UX principles, information architecture, and user psychology.',
        'Experience with responsive design, usability testing, and A/B testing methodologies.',
        'Strong portfolio showcasing UI/UX design work.'
      ],
      keySkills: ['Figma', 'Sketch', 'CSS', 'Responsive Design', 'JavaScript', 'Adobe XD', 'HTML'],
      aboutCompany: 'UNIABROAD is a leading ed-tech company specializing in providing international education services. With a presence in multiple countries, our mission is to simplify the study abroad journey for students through innovative digital solutions',
      howToApply: 'Interested candidates can send their resume and portfolio to *[careers@uniabroad.com]* with the subject line *"Application for UI/UX Designer – UNIABROAD',
      benefits: [
        'Competitive salary and benefits package.',
        'Dynamic and innovative work environment.',
        'Professional development and learning opportunities.'
      ]
    };
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
      // this.selectedJob = job;
      this.setActiveStep(job.stage);
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
