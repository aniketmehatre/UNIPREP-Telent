import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { ScrollTopModule } from 'primeng/scrolltop';
import { TimelineModule } from 'primeng/timeline';
import { environment } from "@env/environment";

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
export class LandingContentComponent implements OnInit {
  @ViewChild('cardStack') cardStackElement!: ElementRef;
  @ViewChild("videoPlayer")
  videoPlayer!: ElementRef;
  welcomevideoLink: string = `https://api.uniprep.ai/uniprepapi/storage/app/public/Landing/welcome.mp4`;
  videoUrl: string = `https://www.youtube.com/embed/AAXUZ0z5bl0?si=U4BmozIZJvUnmUlr?rel=0&autoplay=1`;
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
      title: 'Explore opportunities across local, national, and global employers',
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
      title: 'Get noticed and shortlisted by hiring companies',
      description: 'Browse through a diverse pool of qualified candidates to find your ideal match. Utilize advanced search filters to narrow down candidates based on your specific needs.',
      icon: 'fa-solid fa-user-check',
      alignment: 'left',
    },
    {
      id: 5,
      title: 'Connect, interview, and step into your next role',
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
      title: 'Apply for Jobs in 100+ Countries',
      description: [
        'Explore roles in the UK, Europe, UAE, Canada, and more',
        'Search by remote, hybrid, onsite, or relocation-ready options',
        'Apply for full-time, part-time, freelance, or internships'
      ],
    },
    {
      icon: 'fa-solid fa-check-double',
      color: '#4dcbc0',
      title: 'Get Hired Directly – No Middlemen',
      description: [
        'Apply straight to employers — no agents or intermediaries',
        'Faster responses, real opportunities',
        'Your career in your hands'
      ],
    },
    {
      icon: 'fa-solid fa-graduation-cap',
      color: '#5c6bc0',
      title: 'Create a Talent Profile with Built-in AI Reviewer',
      description: [
        'Add your skills, experience, education, certifications & preferences',
        'Upload your CV and intro video',
        '<div>\
         <h6>AI Reviewer gives you:</h6>\
          <ul style="list-style: none; padding-left: 0;">\
            <li style="margin-bottom: 10px;">✅ ATS Score</li>\
            <li style="margin-bottom: 10px;">✅ Profile Score</li>\
           <li style="margin-bottom: 10px;">✅ Personalized tips to become job-ready</li>\
          </ul>\
        </div>'
      ],
    },
    {
      icon: 'fa-solid fa-earth-americas',
      color: '#4dc970',
      title: 'Add an Introductory Video to Boost Visibility',
      description: [
        'Let employers see you before the interview',
        'Highlight your communication skills and confidence',
        'Stand out in people-facing and international roles'
      ],
    },
    {
      icon: 'fa-solid fa-user-tie',
      color: '#5c6bc0',
      title: 'Find and Apply for the Right Jobs — Instantly',
      description: [
        '<div>\
         <h6>Use smart filters to search by:</h6>\
          <ul style="list-style: none; padding-left: 0;">\
            <li style="margin-bottom: 10px;">💰 Salary</li>\
            <li style="margin-bottom: 10px;">🌎 Country or region</li>\
            <li style="margin-bottom: 10px;">📍 Remote, hybrid, or onsite roles</li>\
           <li style="margin-bottom: 10px;">🗣️ Language preferences</li>\
          </ul>\
        </div>',
        'Apply in one click — no long forms or uploads every time'
      ],
    },
    {
      icon: 'fa-solid fa-users',
      color: '#4dcbc0',
      title: 'Use 30+ Career Features & Earn Certifications to Strengthen Your Profile',
      description: [
        'Access a wide range of tools to boost your global employability',
        'Take quizzes in English, aptitude, job readiness, and more',
        'Earn certificates and showcase them directly on your profile',
        'Get noticed by top employers faster',
      ],
    },
    {
      icon: 'fa-solid fa-ballot-check', 
      color: '#f8943f',
      title: 'Track Applications Using Job Tracker',
      description: [
        'Know exactly when your job application is viewed, shortlisted, or selected',
        'Organise your job search in one place',
        'Track progress for every role you apply to'
      ],
    },
    {
      icon: 'fa-solid fa-folder-open',
      color: '#4dcbc0',
      title: 'Connect with Companies Using Smart Filters + Company Tracker',
      description: [
        'Find companies by sector, country, or job type',
        'Save and follow your favorite employers',
        'Track updates and stay visible to hiring brands',
      ],
    },
    {
      icon: 'fa-solid fa-binoculars',
      color: '#4dc970',
      title: 'Simple, Safe, and Always Transparent',
      description: [
        'No ads, no fake listings, no random calls',
        'Only verified opportunities — and your profile is shared only when you apply',
        'Your data is private, secure, and in your control'
      ],
    },
    {
      icon: 'fa-solid fa-headset',
      color: '#f8943f',
      title: '24×7 Support Whenever You Need It',
      description: [
        'Need help with applying, creating your profile, or using the platform?',
        'The UNIPREP team is always here to support you — anytime, anywhere',
      ],
    },
  ];

  constructor(private sanitizer: DomSanitizer) { }

  cardPositions: { top: number, left: number, rotate: number, scale: number, zIndex: number }[] = [];
  isStacked = false;
  scrollThreshold = 300;

  ngOnInit() {

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
