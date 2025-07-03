import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'uni-compare-uni',
  imports: [CommonModule, RouterModule, SelectModule, FormsModule],
  templateUrl: './compare-uni.component.html',
  styleUrls: ['./compare-uni.component.scss'],
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
export class CompareUniComponent implements OnInit {
  selectedCountry: 'uk' | 'india' = 'uk';
  // countryList: { id: string, country: string, flag: string }[] = [
  //   {
  //     id: 'india',
  //     country: 'India',
  //     flag: 'uniprep-assets/icons/india.png'
  //   },
  //   {
  //     id: 'uk',
  //     country: 'United Kingdom',
  //     flag: 'uniprep-assets/icons/united-kingdom.png'
  //   }
  // ];
  platforms: any = [];
  // platformsInIndia = [
  //   {
  //     name: 'Student circle',
  //     logo: 'uniprep-assets/brands/studentcircus.webp',
  //     features: {
  //       inbuiltHiring: false,
  //       careerPrep: false,
  //       entrepreneurship: false,
  //       globalEducation: false,
  //       coBranding: true
  //     }
  //   },
  //   {
  //     name: 'Handshake',
  //     logo: 'uniprep-assets/brands/handshake.webp',
  //     features: {
  //       inbuiltHiring: false,
  //       careerPrep: false,
  //       entrepreneurship: false,
  //       globalEducation: false,
  //       coBranding: true
  //     }
  //   },
  //   {
  //     name: 'Symplicity',
  //     logo: 'uniprep-assets/brands/symplicity.webp',
  //     features: {
  //       inbuiltHiring: false,
  //       careerPrep: false,
  //       entrepreneurship: false,
  //       globalEducation: false,
  //       coBranding: false
  //     }
  //   },
  //   {
  //     name: 'Target Connect',
  //     logo: 'uniprep-assets/brands/targetconnect.webp',
  //     features: {
  //       inbuiltHiring: true,
  //       careerPrep: false,
  //       entrepreneurship: false,
  //       globalEducation: false,
  //       coBranding: true
  //     }
  //   },
  //   {
  //     name: 'LinkedIn',
  //     logo: 'uniprep-assets/brands/linkedin.webp',
  //     features: {
  //       inbuiltHiring: true,
  //       careerPrep: true,
  //       entrepreneurship: false,
  //       globalEducation: true,
  //       coBranding: false
  //     }
  //   },
  //   {
  //     name: 'UNIPREP',
  //     logo: 'uniprep-assets/brands/uniprep.webp',
  //     features: {
  //       inbuiltHiring: true,
  //       careerPrep: true,
  //       entrepreneurship: true,
  //       globalEducation: true,
  //       coBranding: true
  //     }
  //   }
  // ];

  platformsInUK = [
    {
      name: 'UNIPREP',
      logo: 'uniprep-assets/brands/uniprep.webp',
      features: {
        inbuiltHiring: true,
        careerPrep: true,
        entrepreneurship: true,
        globalEducation: true,
        coBranding: true
      }
    },
    {
      name: 'Superset',
      logo: 'uniprep-assets/brands/superset.webp',
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
      logo: 'uniprep-assets/brands/handshake.webp',
      features: {
        inbuiltHiring: false,
        careerPrep: false,
        entrepreneurship: false,
        globalEducation: false,
        coBranding: true
      }
    },
    {
      name: 'StudentCircus',
      logo: 'uniprep-assets/brands/studentcircus.webp',
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
      logo: 'uniprep-assets/brands/symplicity.webp',
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
      logo: 'uniprep-assets/brands/targetconnect.webp',
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
      logo: 'uniprep-assets/brands/linkedin.webp',
      features: {
        inbuiltHiring: true,
        careerPrep: true,
        entrepreneurship: false,
        globalEducation: true,
        coBranding: false
      }
    }
  ];

  featureList = [
    { key: 'inbuiltHiring', label: 'Inbuilt Hiring Platform' },
    { key: 'careerPrep', label: 'Career Preparation Tools' },
    { key: 'entrepreneurship', label: 'Entrepreneurship Tools' },
    { key: 'globalEducation', label: 'Global Education Tools' },
    { key: 'coBranding', label: 'Co Branding to Institutes' }
  ];

  benefits = [
    {
      title: 'Comprehensive Career Ecosystem',
      icon: '💼',
      description: 'From skill-building and CV optimization to mock interviews, job discovery, and employer outreach — everything is integrated into one seamless platform.'
    },
    {
      title: 'Built-in Direct Hiring Hub',
      icon: '💻',
      description: 'Employers can directly post jobs, filter top talent, schedule interviews, and extend offers — no need for external tools or third-party platforms.'
    },
    {
      title: 'Smart AI-Powered Career Tools',
      icon: '🤖',
      description: 'Includes intelligent tools like CV Reviewer, Career Planner, Average Salary Estimator, and more — tailored to enhance every student\'s career journey.'
    },
    {
      title: '70+ Premium Features in One Platform',
      icon: '⚙️',
      description: 'Purpose-built to support Career Growth, Skill Development, Entrepreneurship, and Global Education Access — all under a unified system.'
    },
    {
      title: 'Cost-Effective & Scalable: Just £30 per student/year',
      icon: '💰',
      description: 'Replaces 4-5 standalone legacy systems — saving time, cost, and administrative effort.'
    },
    {
      title: 'Globally Compatible & Institution-Friendly',
      icon: '🌍',
      description: 'Designed for institutions across regions and industries — adaptable, intuitive, and ready to scale.'
    }
  ];

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    // this.route.params.subscribe((data: any) => {
    //   if (data?.['country']) {
    //     this.selectedCountry = data?.country;
        // this.platforms = this.selectedCountry == 'india' ? this.platformsInIndia : this.platformsInUK;
        this.platforms = this.platformsInUK;
    //   }
    // });
  }

  // changeCountry(event: any) {
  //   this.router.navigate(['../' + event], { relativeTo: this.route });
  //   //this.router.navigate(['/institute/compare', event]);
  // }

  get getPlatformList() {
    return this.platforms;
  }

  // Helper method to determine if a platform has a specific feature
  hasFeature(platform: any, feature: string): boolean {
    return platform.features[feature];
  }
}