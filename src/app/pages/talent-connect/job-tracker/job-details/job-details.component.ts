import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { MenuItem } from 'primeng/api';

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
  standalone: true,
})
export class JobDetailsComponent  implements OnInit{

  @Output() closeInfo: EventEmitter<boolean> = new EventEmitter<boolean>(true);
  @Input() showInfo: boolean = true;

  jobDetails: any | undefined;
  jobs: Job[] = [
    {
      id: 1,
      title: 'Senior UI/UX Designer',
      company: 'UNIABROAD Pvt. Ltd.',
      companyLogo: 'assets/uniabroad-logo.png',
      location: 'Bangalore, India',
      status: 'Job Applied',
      stage: 'HR Round',
      workLocation: 'Mysore',
      position: 'UI Designer',
      startDate: '19-02-2025',
      companySize: '0-50',
      workMode: 'Onsite',
      employmentType: 'Full Time',
      salaryRange: '50,000 - 1,00,000',
      availableVacancies: 50,
      totalApplied: 10,
      overview: 'We are looking for a "creative and detail-oriented UI/UX Designer" to join our team at UNIABROAD. The ideal candidate will be responsible for designing user-friendly, engaging, and visually appealing interfaces for our digital platforms, ensuring a seamless user experience for students and stakeholders.',
      responsibilities: [
        'Design and implement intuitive, user-centered interfaces for web and mobile applications.',
        'Conduct user research and usability testing to understand pain points and improve UI/UX designs.',
        'Develop wireframes, prototypes, and mockups that effectively communicate design concepts.'
      ],
      appliedDate: '19-02-2025'
    },
    {
      id: 2,
      title: 'Senior UI/UX Designer',
      company: 'UNIABROAD Pvt. Ltd.',
      companyLogo: 'assets/uniabroad-logo.png',
      location: 'Bangalore, India',
      status: 'Application Received',
      stage: 'HR Round'
    },
    {
      id: 3,
      title: 'Senior UI/UX Designer',
      company: 'UNIABROAD Pvt. Ltd.',
      companyLogo: 'assets/uniabroad-logo.png',
      location: 'Bangalore, India',
      status: 'Shortlisted',
      stage: 'HR Round'
    },
    {
      id: 4,
      title: 'Senior UI/UX Designer',
      company: 'UNIABROAD Pvt. Ltd.',
      companyLogo: 'assets/uniabroad-logo.png',
      location: 'Bangalore, India',
      status: 'Position Closed',
      stage: 'HR Round'
    }
  ];
  activeIndex: number = 0;
  steps: MenuItem[] = [];
  activeStepIndex: number = 1;

  ngOnInit(): void {
    this.jobDetails = {
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
        label: this.jobDetails.applicationStage.initialRound.label
      },
      {
        label: this.jobDetails.applicationStage.hrRound.label
      },
      {
        label: this.jobDetails.applicationStage.selected.label
      }
    ];


    // // Select the first job by default
    // this.selectedJob = this.jobs[0];

    // this.setActiveStep(this.selectedJob?.stage);
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
