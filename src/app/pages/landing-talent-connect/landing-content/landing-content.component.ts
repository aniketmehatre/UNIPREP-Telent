import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { ScrollTopModule } from 'primeng/scrolltop';
import { TimelineModule } from 'primeng/timeline';

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

  chooseUsCards = [
    {
      icon: 'fas fa-lightbulb',
      color: '#f8943f',
      title: 'Apply For Jobs In 100+ Countries',
      description: [
        'Explore Roles In The UK, Europe, UAE, Canada, And More',
        'Search By Remote, Hybrid, Onsite, Or Relocation-Ready Options',
        'Apply For Full-Time, Part-Time, Freelance, Or Internships'
      ]
    },
    {
      icon: 'fas fa-video',
      color: '#a64dff',
      title: 'Introductory Videos – Optional For Students, Required By Employers',
      description: [
        'Apply Straight To Employers - No Agents Or Intermediaries',
        'Faster Responses, Real Opportunities',
        'Your Career In Your Hands'
      ]
    },
  ]

  templateCardFeatures = [
    {
      icon: 'fa-solid fa-wand-magic-sparkles',
      color: '#f8943f',
      title: 'Create A Talent Profile With Built-In AI Reviewer',
      description: [],
    },
    {
      icon: 'fa-solid fa-check-double',
      color: '#4dcbc0',
      title: 'Find And Apply For The Right Jobs — Instantly',
      description: [],
    },
    {
      icon: 'fa-solid fa-graduation-cap',
      color: '#5c6bc0',
      title: 'Use 30+ Career Features & Earn Certifications To Strengthen Your Profile',
      description: [],
    },
    {
      icon: 'fa-solid fa-list-check',
      color: '#4dcbc0',
      title: 'Track Applications Using Job Tracker',
      description: [],
    },
    {
      icon: 'fa-solid fa-building',
      color: '#4dc970',
      title: 'Connect With Companies Using Smart Filters + Company Tracker',
      description: [],
    },
    {
      icon: 'fa-solid fa-shield-check',
      color: '#5c6bc0',
      title: 'Simple, Safe, And Always Transparent',
      description: [],
    },
    {
      icon: 'fa-solid fa-headset',
      color: '#f8943f',
      title: '24×7 Support Whenever You Need It',
      description: [
        'Need Help With Applying, Creating Your Profile, Or Using The Platform?',
        'The UNIPREP Team Is Always Here To Support You — Anytime, Anywhere',
      ],
    },
  ];

  cardPositions: { top: number, left: number, rotate: number, scale: number, zIndex: number }[] = [];
  isStacked = false;
  scrollThreshold = 300;

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.totalStackScrollHeight = this.templateCardFeatures.length * this.scrollThresholdPerCard;
  }



  toggleVideo() {
    const video: HTMLVideoElement = this.videoPlayer.nativeElement
    if (video.paused) {
      video.play()
      this.isPlaying = true
    } else {
      video.pause()
      this.isPlaying = false
    }
  }


  constructor() { }
}
