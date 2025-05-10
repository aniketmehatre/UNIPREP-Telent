import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { ScrollTopModule } from 'primeng/scrolltop';

@Component({
  selector: 'uni-landing-content',
  imports: [ScrollTopModule,
              CommonModule,
          FormsModule,
          ReactiveFormsModule,
          DialogModule,
          RouterModule,
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
      title: 'Register as an Employer:',
      description: 'Easily sign up to access a vast network of top talent. Begin your recruitment process by creating your employer profile today.',
      icon: 'fas fa-pen-to-square',
      alignment: 'right'
    },
    {
      id: 2,
      title: 'Set Up Your Company Profile',
      description: 'Showcase your company\'s culture and values to attract the right candidates. Create an engaging profile to highlight what makes your organization unique.',
      icon: 'fas fa-building-wheat',
      alignment: 'left'
    },
    {
      id: 3,
      title: 'Post Job Vacancies (Free)',
      description: 'Advertise your open positions to a wide pool of candidates at no cost. Post job vacancies effortlessly and start receiving applications immediately.',
      icon: 'fa-solid fa-magnifying-glass',
      alignment: 'right'
    },
    {
      id: 4,
      title: 'Search Talent on Talent - Connect',
      description: 'Browse through a diverse pool of qualified candidates to find your ideal match. Utilize advanced search filters to narrow down candidates based on your specific needs.',
      icon: 'fa-solid fa-magnifying-glass',
      alignment: 'left'
    },
    {
      id: 5,
      title: 'Skill-Based Shortlisting:',
      description: 'Shortlist candidates based on the exact skills and qualifications you\'re looking for. Streamline your hiring process by focusing on talent that best fits your role.',
      icon: 'fas fa-lightbulb',
      alignment: 'right'
    },
    {
      id: 6,
      title: 'Connect, Interview, and Hire - from Anywhere in the World:',
      description: 'Seamlessly connect, interview, and hire top talent, no matter where they\'re located. Take your recruitment process global with remote interviews and easy hiring options.',
      icon: 'fas fa-earth-africa',
      alignment: 'left'
    }
  ];

  employerTypes = [
    {
      icon: 'fa-thin fa-building',
      title: 'Small & Medium Enterprises (SMEs)',
      description: 'Source the right people while keeping costs low.',
      borderClass: 'border-warning'
    },
    {
      icon: 'fa-thin fa-rocket',
      title: 'Startups',
      description: 'Hire capable teams to grow with your business.',
      borderClass: ''
    },
    {
      icon: 'fa-thin fa-industry',
      title: 'Large Enterprises',
      description: 'Build global teams and streamline recruitment at scale.',
      borderClass: ''
    },
    {
      icon: 'fa-thin fa-bank',
      title: 'Universities & Institutions',
      description: 'Advertise internal roles or research opportunities.',
      borderClass: ''
    },
    {
      icon: 'fa-thin fa-laptop',
      title: 'Recruitment Agencies',
      description: 'Find qualified candidates for your clients quickly and efficiently.',
      borderClass: ''
    },
    {
      icon: 'fa-thin fa-building-user',
      title: 'Multi-national Companies',
      description: 'Build a diverse, global workforce to meet international demands.',
      borderClass: ''
    }
  ];

  features = [
    {
      title: 'Post Job & Internship Opportunities',
      benefit: 'Create detailed listings with qualifications, responsibilities, and deadlines — completely free.'
    },
    {
      title: 'Receive and Review Applications Instantly',
      benefit: 'Get direct access to candidate CVs and profiles the moment they apply.'
    },
    {
      title: 'Smart Filtering Tools',
      benefit: 'Narrow down applicants by skills, salary expectations, location, institute, and experience — all in seconds.'
    },
    {
      title: 'Skill Match Shortlisting',
      benefit: 'Automatically surface the best-fit candidates based on role-specific skills — saving you time and effort.'
    },
    {
      title: 'Create an Employer Profile',
      benefit: 'Showcase your company story and attract high-quality talent.'
    },
    {
      title: 'Access a Global Talent Pool',
      benefit: 'Discover ready-to-hire students, graduates, and professionals from around the world.'
    }
  ];

  chooseUsCards = [
    {
      icon: 'fas fa-gear',
      color: '#f8943f',
      title: 'Skill-Based Hiring With Smart Filters',
      description: [
        'Post Jobs With Targeted Skills',
        'Filter For Candidates Who Truly Match Your Requirements',
        'Skip Irrelevant CVs — Focus On What Matters'
      ]
    },
    {
      icon: 'fas fa-camera-video',
      color: '#a64dff',
      title: 'Introductory Videos – Optional For Students, Required By Employers',
      description: [
        'Employers Can Make Video Introductions Mandatory See Candidates\' Communication Skills And Confidence Before Interviews\
         Only Those Who Upload A Video Can Apply (If Required)'
      ]
    },
  ]
  
  templateCardFeatures = [
    {
      icon: 'fas fa-check-circle',
      color: '#4dcbc0',
      title: 'Free For The First 6 Months',
      description: []
    },
    {
      icon: 'fas fa-globe',
      color: '#4dc970',
      title: 'Hire Across All Countries And Role Types',
      description: []
    },
    {
      icon: 'fas fa-arrow-left-right',
      color: '#5c6bc0',
      title: 'No Recruiters Or Middlemen',
      description: []
    },
    {
      icon: 'fas fa-people',
      color: '#4dcbc0',
      title: 'Multi-User HR Dashboard With Role-Based Access',
      description: []
    },
    {
      icon: 'fas fa-funnel',
      color: '#e74c3c',
      title: 'Filter Global Talent Before They Apply',
      description: []
    },
    {
      icon: 'list-check',
      color: '#5c6bc0',
      title: 'Filter Job Applicants After They Apply',
      description: []
    },
    {
      icon: 'search',
      color: '#f8943f',
      title: 'Talent Tracker – Organize And Revisit Top Candidates',
      description: []
    },
    {
      icon: 'person-check-fill',
      color: '#e74c3c',
      title: 'Applicant Tracker – Manage All Applications Clearly',
      description: []
    },
    {
      icon: 'headset',
      color: '#4dcbc0',
      title: '24×7 Support From The UNIPREP Talent Connect Team',
      description: [
        'Need Help Posting Jobs, Filtering Candidates, Or Managing Access? Our Global Support Team Is Available 24X7',
        'Get Answers Fast — Whenever You Need Them'
      ]
    }
  ];

  cardPositions: { top: number, left: number, rotate: number, scale: number, zIndex: number }[] = [];
  isStacked = false;
  scrollThreshold = 300;

  ngOnInit() {
    this.initializeCardPositions();
  }

  ngAfterViewInit() {
  this.totalStackScrollHeight = this.templateCardFeatures.length * this.scrollThresholdPerCard;
}

initializeCardPositions() {
  this.cardPositions = this.templateCardFeatures.map((_, index) => ({
    top: 0,
    left: 0,
    rotate: 0,
    scale: 1,
    zIndex: this.templateCardFeatures.length - index
  }));
}

@HostListener('window:scroll', ['$event'])
onWindowScroll() {
  if (!this.cardStackElement) return;

  const rect = this.cardStackElement.nativeElement.getBoundingClientRect();
  const scrollPosition = window.scrollY + window.innerHeight;
  const elementTop = rect.top + window.scrollY;
  const scrollDiff = scrollPosition - elementTop;

  const threshold = this.scrollThreshold || 400; // Adjust as needed

  if (scrollDiff > 0) {
    const progress = Math.min(scrollDiff / threshold, 1);
    this.updateCardPositions(progress);
  } else {
    this.initializeCardPositions();
  }
}

updateCardPositions(progress: number) {
  const maxOffset = 40;
  const maxRotation = 6;

  this.cardPositions = this.templateCardFeatures.map((_, index) => {
    const offsetMultiplier = index;
    const offset = progress * maxOffset * offsetMultiplier;
    const rotate = progress * maxRotation * (index % 2 === 0 ? -1 : 1);
    const left = progress * 15 * (index % 2 === 0 ? -1 : 1);
    const scale = 1 - (index * 0.03 * progress);

    return {
      top: offset,
      left: left,
      rotate: rotate,
      scale: scale, 
      zIndex: this.templateCardFeatures.length - index
    };
  });

  this.isStacked = progress === 1;
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
