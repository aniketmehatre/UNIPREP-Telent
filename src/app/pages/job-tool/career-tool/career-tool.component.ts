import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router, RouterModule} from '@angular/router';
import {environment} from '@env/environment';
import {EmployerGlobalService} from "../employer-global.service";
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';
import {StorageService} from "../../../storage.service";
@Component({
    selector: 'uni-career-tool',
    templateUrl: './career-tool.component.html',
    styleUrls: ['./career-tool.component.scss'],
    standalone: true,
    imports: [CommonModule, RouterModule, TooltipModule]
})

export class CareerToolComponent implements OnInit {
  currentEndpoint: string = "";
  currentRoute: any;
  domainUrl:string = `https://${environment.domain}/uniprepapi/storage/app/public/ToolIcons/career-tools/`; 
  modulesList: any = [
    {
      id: 1,
      moduleName: "CV Builder",
    //  Description: "Craft a standout CV that highlights your skills and experience, ready for any job application.",
      tooltip: "Craft a standout CV that highlights your skills and experience, ready for any job application.",
      imageLink: `https://${environment.domain}/uniprepapi/storage/app/public/resources-coverimage/cv.svg`,
      refLink: "https://novoresume.com/",
      mode: "cv-builder",
      launch_soon: false
    },
    {
      id: 2,
      moduleName: "Cover Letter Builder",
     // Description: "Generate a cover letter that strengthens your job application.",
      tooltip: "Generate a cover letter that strengthens your job application.",
      imageLink: `https://${environment.domain}/uniprepapi/storage/app/public/resources-coverimage/CoverLetter.svg`,
      refLink: "https://resumaker.ai/cover-letter/",
      mode: "coverletter-builder",
      launch_soon: false
    },
    {
      id: 3,
      moduleName: "Career Planner",
     // Description: "Plan your career path by exploring job opportunities worldwide",
      tooltip: "Plan your career path by exploring job opportunities worldwide.",
      imageLink: `https://${environment.domain}/uniprepapi/storage/app/public/resume_icons/careerplanner.svg`,
      refLink: "",
      mode: "career-planner",
      launch_soon: false
    },
    // {
    //   id: 4,
    //   moduleName: "Cost Of Living Comparision",
    //   Description: "Compare living expenses across countries to make informed decisions.",
    //   tooltip: "Compare the cost of living across different cities and countries to plan your financial needs.",
    //   imageLink: `https://${environment.domain}/uniprepapi/storage/app/public/resume_icons/cost-of-living.svg",
    //   refLink: "",
    //   mode: "cost-of-living"
    // },
    {
      id: 5,
      moduleName: "Global Salary Converter",
      //Description: "Calculate your salary across different countries.",
      tooltip: "Convert and compare salaries globally to understand the value of potential job offers.",
      imageLink: `https://${environment.domain}/uniprepapi/storage/app/public/resume_icons/salaryconverter.svg`,
      refLink: "",
      mode: "salary-converter",
      launch_soon: false
    },
    {
      id: 6,
      moduleName: "Company List",
      //Description: "Access a comprehensive database with detailed information of over 100,000 companies.",
      tooltip: "Access a curated list of companies by industry and location to target your job search effectively.",
      imageLink: `https://${environment.domain}/uniprepapi/storage/app/public/resume_icons/companylist.svg`,
      refLink: "",
      mode: "company-list",
      launch_soon: false
    },
    {
      id: 7,
      moduleName: "Psychometric Test",
     // Description: "Measure cognitive abilities and personality traits using standardized psychometric testing.",
      tooltip: "Evaluate your aptitudes and personality traits with tests to find careers that best suit your profile.",
      imageLink: `https://${environment.domain}/uniprepapi/storage/app//public/icon/modules/psychometrictest.svg`,
      refLink: "",
      mode: "psychometric-test",
      launch_soon: false
    },
    {
      id: 8,
      moduleName: "Personality Test",
    //  Description: "Utilize personality assessments to analyze and understand individual traits and behaviors.",
      tooltip: "Discover more about your personality and how it aligns with various career paths.",
      imageLink: `https://${environment.domain}/uniprepapi/storage/app//public/icon/modules/personalitytest.svg`,
      refLink: "",
      mode: "personality-test",
      launch_soon: false
    },
    {
      id: 9,
      moduleName: "Employer Test",
     // Description: "Prepare for employment with specific company-focused tests designed to assess job readiness and fit.",
      tooltip: "Prepare for potential employer assessments with practice tests and study guides.",
      imageLink: `https://${environment.domain}/uniprepapi/storage/app//public/icon/modules/employertest.svg`,
      refLink: "",
      mode: "employer-test",
      launch_soon: false
    },
    {
      id: 10,
      moduleName: "Job Interview Preparation",
    //  Description: "Prepare effectively with role-focused guidance and company-centric tips",
      tooltip: "Prepare effectively with role-focused guidance and company-centric tips",
      imageLink: `https://${environment.domain}/uniprepapi/storage/app//public/icon/modules/job-interview.svg`,
      refLink: "",
      mode: "job-role",
      launch_soon: false
    },
    {
      id: 10,
      moduleName: "Career Growth Checker",
    //  Description: "Get insight into your next 5 career growth oppurtunity.",
      tooltip: "Track your professional development and set goals with our career progression tool.",
      imageLink: `https://${environment.domain}/uniprepapi/storage/app//public/icon/modules/growth.svg`,
      refLink: "",
      mode: "career-growth-checker",
      launch_soon: false
    },
    {
      id: 11,
      moduleName: "Average Salary Estimator",
    //  Description: "Estimate the average salary for your role based on industry and location trends.",
      tooltip: "Discover salary benchmarks and plan your career with our reliable salary estimation tool.",
      imageLink: this.domainUrl+"AverageSalaryEstimator.svg",
      refLink: "",
      mode: "average-salary-estimator",
      launch_soon: false
    },
    {
      id: 12,
      moduleName: "Global Work Visas",
    //  Description: "Get insight into your next 5 career growth oppurtunity.",
      tooltip: "Track your professional development and set goals with our career progression tool.",
      imageLink: this.domainUrl+"GlobalWorkVisa.svg",
      refLink: "",
      mode: "global-work-visa",
      launch_soon: false

    },
    {
      id: 13,
      moduleName: "Job Offer Comparison Tool",
    //  Description: "Compare multiple job offers to make informed career decisions.",
      tooltip: "Evaluate and weigh job offers based on salary, benefits, and growth opportunities.",
      imageLink: this.domainUrl+"JobOfferComparisonTool.svg",
      refLink: "",
      mode: "job-offer-comparison",
      launch_soon: false
    },
    {
      id: 15,
      moduleName: "Salary Negotiation Hacks",  
    //  Description: "Unlock the secrets to negotiating better pay, maximizing your earnings, and achieving financial growth in your career.",  
      tooltip: "Master the art of salary negotiation and take control of your financial future.",
      imageLink: `https://${environment.domain}/uniprepapi/storage/app//public/icon/modules/snh.png`,
      refLink: "",
      mode: "salary-hacks",
      launch_soon: false
    },
    {
      id: 16,
      moduleName: "Job Seeker Success Stories",  
    //  Description: "Get inspired by real-life stories of job seekers who overcame challenges to achieve their dream roles.",  
      tooltip: "Learn from the experiences of successful job seekers and gain insights to land your ideal job.",
      imageLink: `https://${environment.domain}/uniprepapi/storage/app//public/icon/modules/jsss.png`,
      refLink: "",
      mode: "job-seeker-success-stories",
      launch_soon: false
    },
    {
      id: 17,
      moduleName: "Fortune Companies",
    //  Description: "Explore insights, trends, and success strategies from top Fortune companies across industries.",
      tooltip: "Gain valuable knowledge about Fortune companies to enhance your career and business decisions.",
      imageLink: this.domainUrl+"FortuneCompanies.svg",
      refLink: "",
      mode: "fortune-companies",
      launch_soon: false
    },
    {
      id: 18,
      moduleName: "Career Hacks",  
    //  Description: "Access actionable tips and strategies to accelerate your career growth and achieve your goals.",  
      tooltip: "Unleash your potential with proven career hacks designed to fast-track your success.",
      imageLink: `https://${environment.domain}/uniprepapi/storage/app//public/icon/modules/chacks.png`,
      refLink: "",
      mode: "career-hacks",
      launch_soon: false
    },
    {
      id: 19,
      moduleName: "Global Employment Insights",  
    //  Description: "Access actionable tips and strategies to accelerate your career growth and achieve your goals.",  
      tooltip: "Unleash your potential with proven career hacks designed to fast-track your success.",
      imageLink: this.domainUrl+"GlobalEmployementInsights.svg",
      refLink: "",
      mode: "global-employment-insights",
      launch_soon: false
    },
    // {
    //   id: 20,
    //   moduleName: "Modules-enterprenuer tools",
    //   Description: "Access actionable tips and strategies to accelerate your career growth and achieve your goals.",
    //   tooltip: "Unleash your potential with proven career hacks designed to fast-track your success.",
    //   imageLink: environment.production === false ? "https://api.uniprep.ai/uniprepapi/storage/app//public/icon/modules/chacks.png" : "https://uniprep.ai/uniprepapi/storage/app/public/icon/modules/chacks.png",
    //   refLink: "",
    //   mode: "modules-enterprenuer-tools",
    //   launch_soon: true
    // },
    // {
    //   id: 21,
    //   moduleName: "Virtual Incubation Center",
    //   Description: "Access actionable tips and strategies to accelerate your career growth and achieve your goals.",
    //   tooltip: "Unleash your potential with proven career hacks designed to fast-track your success.",
    //   imageLink: environment.production === false ? "https://api.uniprep.ai/uniprepapi/storage/app//public/icon/modules/chacks.png" : "https://uniprep.ai/uniprepapi/storage/app/public/icon/modules/chacks.png",
    //   refLink: "",
    //   mode: "virtual-incubation-center",
    //   launch_soon: true
    // },
    {
      id: 22,
      moduleName: "Market Analysis",
      Description: "Access actionable tips and strategies to accelerate your career growth and achieve your goals.",
      tooltip: "Unleash your potential with proven career hacks designed to fast-track your success.",
      imageLink: environment.production === false ? "https://api.uniprep.ai/uniprepapi/storage/app//public/icon/modules/chacks.png" : "https://uniprep.ai/uniprepapi/storage/app/public/icon/modules/chacks.png",
      refLink: "",
      mode: "market-analysis",
      launch_soon: false
    }
  ]

  constructor(private router: Router, private employerGlobalService: EmployerGlobalService,
              private storage: StorageService) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.url;
        if (this.currentRoute.includes('career-tool')) {
          this.storage.set('MainTitleCareerTool', '');
          this.storage.set("employerName", '');
          this.employerGlobalService.clearAll()
        }
      }
    });
  }

  ngOnInit(): void {
  }

  chooseOneOption(mode: string, launch_soon: any) {
    if (launch_soon) {
      return;
    }
    
    this.currentEndpoint = mode;
    if (mode == "cv-builder") {
      this.router.navigate(['/pages/job-tool/cv-builder']);
    } else if (mode == "coverletter-builder") {
      this.router.navigate(['/pages/job-tool/coverletter-builder']);
    } else if (mode == "career-planner") {
      // this.router.navigate(['/pages/job-tool/career-planner']);
      this.router.navigate(['/pages/job-tool/careerplannerlist']);
    } else if (mode == "cost-of-living") {
      this.router.navigate(['/pages/job-tool/cost-of-living']);
    } else if (mode == "salary-converter") {
      this.router.navigate(['/pages/job-tool/salary-converter']);
    } else if (mode == "company-list") {
      this.router.navigate(['/pages/job-tool/company-list']);
    } else if (mode == "psychometric-test") {
      this.router.navigate(['/pages/job-tool/list/psychometric-test/11']);
    } else if (mode == "personality-test") {
      this.router.navigate(['/pages/job-tool/list/personality-test/12']);
    } else if (mode == "job-role") {
      this.router.navigate(['/pages/interviewprep']);
    } else if (mode == "career-growth-checker") {
      this.router.navigate(['/pages/job-tool/career-growth-checker']);
    }
    else if(mode=="average-salary-estimator") {
      this.router.navigate(['/pages/average-salary-estimator']);
    }
    else if(mode=="job-offer-comparison") {
      this.router.navigate(['/pages/job-offer-comparison']);
    }
    else if (mode == "global-work-visa") {
      this.router.navigate(['/pages/global-work-visa']);
    }
    else if (mode == "career-hacks") {
      this.router.navigate(['/pages/career-hacks']);
    }
    else if (mode == "salary-hacks") {
      this.router.navigate(['/pages/salary-hacks']);
    }
    else if (mode == "job-seeker-success-stories") {
      this.router.navigate(['/pages/job-seeker-success-stories']);
    }
    else if (mode == "fortune-companies") {
      this.router.navigate(['/pages/fortune-companies']);
    }
    else if (mode == "global-employment-insights") {
      this.router.navigate(['/pages/global-employment-insights']);
    }
    else {
      this.router.navigate(['/pages/job-tool/list/employer-test/13']);
    }
  }
}
