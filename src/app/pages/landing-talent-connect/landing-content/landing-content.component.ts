import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { ScrollTopModule } from 'primeng/scrolltop';
import { TimelineModule } from 'primeng/timeline';
import {environment} from "@env/environment";

@Component({
  selector: 'uni-landing-content',
  imports: [ScrollTopModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    RouterModule,
    TimelineModule

  ],
  templateUrl: './landing-content.component.html',
  styleUrl: './landing-content.component.scss'
})
export class LandingContentComponent implements OnInit, AfterViewInit {
  scrollThresholdPerCard = 150; // How much scroll per card stack
  totalStackScrollHeight = 0;
  @ViewChild('cardStack') cardStackElement!: ElementRef;
  @ViewChild("videoPlayer")
  videoPlayer!: ElementRef;
  welcomevideoLink: string = `https://api.uniprep.ai/uniprepapi/storage/app/public/Landing/welcome.mp4`;
  videoUrl: string = `https://www.youtube.com/embed/Sv8EyWriqV0?rel=0&autoplay=1`;
  embedUrl!: SafeResourceUrl;
  isInitialLoadVideo: boolean = true;
  isPlaying = false;
  steps = [
    {
      id: 1,
      title: 'Sign Up and Build Your Career Profile',
      description: 'Create a professional profile to showcase your skills, experience, and aspirations.',
      icon: 'fa-solid fa-user-pen',
      alignment: 'right',
    },
    {
      id: 2,
      title: 'Discover Local, National & Global-Opportunities',
      description: 'Explore job openings from employers around the world across industries.',
      icon: 'fa-solid fa-globe',
      alignment: 'left',
    },
    {
      id: 3,
      title: 'Apply to Roles that Match Your Goals',
      description: 'Advertise your open positions to a wide pool of candidates at no cost. Post job vacancies effortlessly and start receiving applications immediately.',
      icon: 'fa-solid fa-file-arrow-up',
      alignment: 'right',
    },
    {
      id: 4,
      title: 'Stand Out and Get Shortlisted',
      description: 'Browse through a diverse pool of qualified candidates to find your ideal match. Utilize advanced search filters to narrow down candidates based on your specific needs.',
      icon: 'fa-solid fa-user-check',
      alignment: 'left',
    },
    {
      id: 5,
      title: 'Connect & Interview with Employers',
      description: 'Engage directly with companies through the platform for interviews and assessments.',
      icon: 'fa-solid fa-handshake',
      alignment: 'right',
    },
    {
      id: 6,
      title: 'Secure Your Next Opportunity',
      description: 'Land your ideal role and take the next step in your professional journey.',
      icon: 'fa-solid fa-trophy',
      alignment: 'left',
    },
  ];

  employerTypes = [
    {
      icon: 'fa-thin fa-user-graduate',
      title: 'Students',
      description: 'Looking to kick-start their careers with hands-on experience',
    },
    {
      icon: 'fa-thin fa-user-check',
      title: 'Graduates',
      description: 'Ready to launch their journey into the job market',
    },
    {
      icon: 'fa-thin fa-user-tie',
      title: 'Professionals',
      description: 'Exploring new industries or roles',
    },
    {
      icon: 'fa-thin fa-users',
      title: 'Jobseekers',
      description: 'Who want to stay close to home or explore opportunities abroad',
    },
    {
      icon: 'fa-thin fa-file-contract',
      title: 'Candidates',
      description: 'Looking for remote, hybrid, or flexible roles across sectors',
    },
    {
      icon: 'fa-thin fa-briefcase',
      title: 'Career changers',
      description: 'Aiming to upskill and transition into high-growth fields',
    },
  ];

  features = [
    {
      title: 'Create your profile',
      benefit: 'Craft a profile that showcases your achievements, interests, and readiness',
    },
    {
      title: 'Browse Openings',
      benefit: 'Discover curated job and internship listings tailored to different industries, levels, and locations',
    },
    {
      title: 'Connect with Employers',
      benefit: 'Be seen. Be selected. Be hired.',
    },
    {
      title: 'Apply Seamlessly',
      benefit: 'Submit your profile and documents directly to employers',
    },
    {
      title: 'Get Skill-Matched',
      benefit: 'See roles that align with your strengths without the guesswork',
    },
    {
      title: 'Track Your Journey',
      benefit: 'Know where you stand in the application process, always',
    },
  ];

  templateCardFeatures = [
    {
    icon: 'fa-solid fa-wand-magic-sparkles',
    color: '#f8943f',
    title: 'Skill-Based Hiring with Smart Filters',
    description: [
      'Post jobs with targeted skills',
      'Filter for candidates who truly match your requirements',
      'Skip irrelevant CVs — focus on what matters'
    ],
  },
  {
    icon: 'fa-solid fa-check-double',
    color: '#4dcbc0',
    title: 'Introductory Videos – Optional for Students, Required by Employers 🎥',
    description: [
      'Employers can make video introductions mandatory',
      'See candidates’ communication skills and confidence before interviews',
      'Only those who upload a video can apply (if required)'
    ],
  },
  {
    icon: 'fa-solid fa-graduation-cap',
    color: '#5c6bc0',
    title: 'Free for the First 6 Months 🆓',
    description: [
      'Unlimited job postings',
      'Full access to career tools, dashboards, and support',
      'No commissions, no contracts — try at scale, risk-free'
    ],
  },
  {
    icon: 'fa-solid fa-earth-americas',
    color: '#4dc970',
    title: 'Hire Across All Countries and Role Types',
    description: [
      'Post unlimited roles for remote, onsite, hybrid, or relocation',
      'Full-time, freelance, internships, contractual, or part-time',
      'Reach candidates from 100+ countries'
    ],
  },
  {
    icon: 'fa-solid fa-user-tie',
    color: '#5c6bc0',
    title: 'No Recruiters or Middlemen',
    description: [
      'Direct connection with job seekers',
      'Built-in tools for shortlisting, messaging, and decision-making',
      'No extra costs, no gatekeepers'
    ],
  },
  {
    icon: 'fa-solid fa-users',
    color: '#4dcbc0',
    title: 'Multi-User HR Dashboard with Role-Based Access 👥',
    description: [
      'Add and manage your team with specific roles:',
      'Admin – Full access',
      'Master User – Post jobs and add/manage team',
      'User – Can advertise jobs only',
      'Secure collaboration for growing hiring teams'
    ],
  },
  {
    icon: 'fa-solid fa-filter',
    color: '#f8943f',
    title: 'Filter Global Talent Before They Apply 🌍',
    description: [
      'Use filters to proactively discover candidates by:',
      '💰 Salary expectations',
      '🌎 Country or region',
      '📍 Preferred location or relocation',
      '🗣️ Languages spoken',
      'Perfect for sourcing and shortlisting relevant talent before the job goes live'
    ],
  },
  {
    icon: 'fa-solid fa-folder-open',
    color: '#4dcbc0',
    title: 'Filter Job Applicants After They Apply 🗂️',
    description: [
      'Filter your applicants by:',
      'Skill match',
      'Salary benchmarking',
      'Location and language',
      'Video presence (if required)'
    ],
  },
  {
    icon: 'fa-solid fa-binoculars',
    color: '#4dc970',
    title: 'Talent Tracker – Organize and Revisit Top Candidates',
    description: [
      'Save promising profiles from search',
      'Tag and organize for future roles',
      'Build your long-term global talent pool'
    ],
  },
  {
    icon: 'fa-solid fa-clipboard-check',
    color: '#5c6bc0',
    title: 'Applicant Tracker – Manage All Applications Clearly',
    description: [
      'Track status: New, Shortlisted, Hired, etc.',
      'Add notes, assign reviewers, collaborate with your team',
      'Visibility and structure across all hiring pipelines'
    ],
  },
  {
    icon: 'fa-solid fa-headset',
    color: '#f8943f',
    title: '24×7 Support from the UNIPREP Talent Connect Team 💬',
    description: [
      'Need help posting jobs, filtering candidates, or managing access?',
      'Our global support team is available 24X7',
      'Get answers fast — whenever you need them'
    ],
  },
];

  constructor(private sanitizer: DomSanitizer) { }

  cardPositions: { top: number, left: number, rotate: number, scale: number, zIndex: number }[] = [];
  isStacked = false;
  scrollThreshold = 300;

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.totalStackScrollHeight = this.templateCardFeatures.length * this.scrollThresholdPerCard;
  }



  toggleVideo() {
    if (this.isInitialLoadVideo) {
      this.embedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.videoUrl);
      this.isInitialLoadVideo = false;
    }
    this.isPlaying = !this.isPlaying;
  }

  navigateConnectUrl(url: string) {
    const baseUrl = window.location.origin;
    const isDev = baseUrl.includes('dev') || baseUrl.includes('localhost');
    const targetUrl = isDev ? 'https://dev-student.uniprep.ai' : 'https://uniprep.ai';
    const validUrls = ['about', 'contact-us', 'job-seekers', 'international-students', 'global-travellers', 'entrepreneurs', 'compare/uk', 'blogs', 'certificates', 'register', 'pricing', 'login'];
    if (url === 'home') {
      window.location.href = targetUrl
    } else if (validUrls.includes(url)) {
      window.location.href = targetUrl + `/${url}`
    } else {
      window.location.href = `${environment.domain}/${url}`
    }
  }

}
