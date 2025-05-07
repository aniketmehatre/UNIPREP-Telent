import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'uni-comparison',
  imports: [CommonModule, RouterModule],
  templateUrl: './comparison.component.html',
  styleUrls: ['./comparison.component.scss'],
  animations: [
    trigger('fadeAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ opacity: 0 }))
      ])
    ]),
    trigger('slideAnimation', [
      transition(':enter', [
        style({ transform: 'translateY(20px)', opacity: 0 }),
        animate('400ms ease-out', style({ transform: 'translateY(0)', opacity: 1 })),
      ]),
      transition(':leave', [
        animate('400ms ease-in', style({ transform: 'translateY(20px)', opacity: 0 }))
      ])
    ])
  ]
})
export class ComparisonComponent implements OnInit {
  selectedCountry: 'uk' | 'india' = 'uk';
  platforms: any = [];
  platformsInIndia = [
    {
      name: 'Student circle',
      logo: 'uniprep-assets/images/student-circle.png',
      features: {
        inbuiltHiring: false,
        careerPrep: false,
        entrepreneurship: false,
        globalEducation: false,
        coBranding: true
      }
    },
    {
      name: 'Handshake',
      logo: 'uniprep-assets/images/student-circle.png',
      features: {
        inbuiltHiring: false,
        careerPrep: false,
        entrepreneurship: false,
        globalEducation: false,
        coBranding: true
      }
    },
    {
      name: 'Symplicity',
      logo: 'uniprep-assets/images/student-circle.png',
      features: {
        inbuiltHiring: false,
        careerPrep: false,
        entrepreneurship: false,
        globalEducation: false,
        coBranding: false
      }
    },
    {
      name: 'Target Connect',
      logo: 'uniprep-assets/images/student-circle.png',
      features: {
        inbuiltHiring: true,
        careerPrep: false,
        entrepreneurship: false,
        globalEducation: false,
        coBranding: true
      }
    },
    {
      name: 'LinkedIn',
      logo: 'uniprep-assets/images/student-circle.png',
      features: {
        inbuiltHiring: true,
        careerPrep: true,
        entrepreneurship: false,
        globalEducation: true,
        coBranding: false
      }
    },
    {
      name: 'UNIPREP',
      logo: 'uniprep-assets/images/student-circle.png',
      features: {
        inbuiltHiring: true,
        careerPrep: true,
        entrepreneurship: true,
        globalEducation: true,
        coBranding: true
      }
    }
  ];

  platformsInUK = [
    {
      name: 'Superset',
      logo: 'uniprep-assets/images/student-circle.png',
      features: {
        inbuiltHiring: true,
        careerPrep: false,
        entrepreneurship: false,
        globalEducation: false,
        coBranding: true
      }
    },
    {
      name: 'Handshake',
      logo: 'uniprep-assets/images/student-circle.png',
      features: {
        inbuiltHiring: false,
        careerPrep: false,
        entrepreneurship: false,
        globalEducation: false,
        coBranding: true
      }
    },
    {
      name: 'Symplicity',
      logo: 'uniprep-assets/images/student-circle.png',
      features: {
        inbuiltHiring: false,
        careerPrep: false,
        entrepreneurship: false,
        globalEducation: false,
        coBranding: false
      }
    },

    {
      name: 'Target Connect',
      logo: 'uniprep-assets/images/student-circle.png',
      features: {
        inbuiltHiring: true,
        careerPrep: false,
        entrepreneurship: false,
        globalEducation: false,
        coBranding: true
      }
    },
    {
      name: 'LinkedIn',
      logo: 'uniprep-assets/images/student-circle.png',
      features: {
        inbuiltHiring: true,
        careerPrep: true,
        entrepreneurship: false,
        globalEducation: true,
        coBranding: false
      }
    },
    {
      name: 'UNIPREP',
      logo: 'uniprep-assets/images/student-circle.png',
      features: {
        inbuiltHiring: true,
        careerPrep: true,
        entrepreneurship: true,
        globalEducation: true,
        coBranding: true
      }
    }
  ];

  benefits = [
    {
      title: 'Comprehensive Career Ecosystem',
      icon: 'pi pi-briefcase',
      description: 'From skill-building and CV optimization to mock interviews, job discovery, and employer outreach — everything is integrated into one seamless platform.'
    },
    {
      title: 'Built-in Direct Hiring Hub',
      icon: 'pi pi-pc-display',
      description: 'Employers can directly post jobs, filter top talent, schedule interviews, and extend offers — no need for external tools or third-party platforms.'
    },
    {
      title: 'Smart AI-Powered Career Tools',
      icon: 'pi pi-robot',
      description: 'Includes intelligent tools like CV Reviewer, Career Planner, Average Salary Estimator, and more — tailored to enhance every student\'s career journey.'
    },
    {
      title: '70+ Premium Features in One Platform',
      icon: 'pi pi-gear',
      description: 'Purpose-built to support Career Growth, Skill Development, Entrepreneurship, and Global Education Access — all under a unified system.'
    },
    {
      title: 'Cost-Effective & Scalable: Just £30 per student/year',
      icon: 'pi pi-currency-pound',
      description: 'Replaces 4-5 standalone legacy systems — saving time, cost, and administrative effort.'
    },
    {
      title: 'Globally Compatible & Institution-Friendly',
      icon: 'pi pi-globe',
      description: 'Designed for institutions across regions and industries — adaptable, intuitive, and ready to scale.'
    }
  ];

  constructor() { }

  ngOnInit(): void {
    this.platforms = this.platformsInUK;
  }

  toggleCountry(): void {
    debugger;
    this.selectedCountry = this.selectedCountry === 'uk' ? 'india' : 'uk';
    if(this.selectedCountry === 'uk')
      this.platforms == this.platformsInIndia;
   else 
     this.platforms = this.platformsInUK;
  }

  get getPlatformList() {
    return this.platforms;
  }

  // Helper method to determine if a platform has a specific feature
  hasFeature(platform: any, feature: string): boolean {
    return platform.features[feature];
  }
}