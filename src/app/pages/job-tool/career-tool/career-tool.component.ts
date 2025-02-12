import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router, RouterModule} from '@angular/router';
import {environment} from '@env/environment';
import {EmployerGlobalService} from "../employer-global.service";
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';
@Component({
    selector: 'uni-career-tool',
    templateUrl: './career-tool.component.html',
    styleUrls: ['./career-tool.component.scss'],
    standalone: true,
    imports: [CommonModule, RouterModule, TooltipModule]
})

export class CareerToolComponent implements OnInit {
  currentEndpoint: string = "";
  currentRoute: any
  modulesList: any = [
    {
      id: 1,
      moduleName: "CV Builder",
      Description: "Craft a standout CV that highlights your skills and experience, ready for any job application.",
      tooltip: "Craft a standout CV that highlights your skills and experience, ready for any job application.",
      imageLink: "https://api.uniprep.ai/uniprepapi/storage/app/public/resources-coverimage/cv.svg",
      refLink: "https://novoresume.com/",
      mode: "cv-builder",
      launch_soon: false
    },
    {
      id: 2,
      moduleName: "Cover Letter Builder",
      Description: "Generate a cover letter that strengthens your job application.",
      tooltip: "Generate a cover letter that strengthens your job application.",
      imageLink: "https://api.uniprep.ai/uniprepapi/storage/app/public/resources-coverimage/CoverLetter.svg",
      refLink: "https://resumaker.ai/cover-letter/",
      mode: "coverletter-builder",
      launch_soon: false
    },
    {
      id: 3,
      moduleName: "Career Planner",
      Description: "Plan your career path by exploring job opportunities worldwide",
      tooltip: "Plan your career path by exploring job opportunities worldwide.",
      imageLink: "https://api.uniprep.ai/uniprepapi/storage/app/public/resume_icons/careerplanner.svg",
      refLink: "",
      mode: "career-planner",
      launch_soon: false
    },
    // {
    //   id: 4,
    //   moduleName: "Cost Of Living Comparision",
    //   Description: "Compare living expenses across countries to make informed decisions.",
    //   tooltip: "Compare the cost of living across different cities and countries to plan your financial needs.",
    //   imageLink: "https://api.uniprep.ai/uniprepapi/storage/app/public/resume_icons/cost-of-living.svg",
    //   refLink: "",
    //   mode: "cost-of-living"
    // },
    {
      id: 5,
      moduleName: "Global Salary Converter",
      Description: "Calculate your salary across different countries.",
      tooltip: "Convert and compare salaries globally to understand the value of potential job offers.",
      imageLink: "https://api.uniprep.ai/uniprepapi/storage/app/public/resume_icons/salaryconverter.svg",
      refLink: "",
      mode: "salary-converter",
      launch_soon: false
    },
    {
      id: 6,
      moduleName: "Company List",
      Description: "Access a comprehensive database with detailed information of over 100,000 companies.",
      tooltip: "Access a curated list of companies by industry and location to target your job search effectively.",
      imageLink: "https://api.uniprep.ai/uniprepapi/storage/app/public/resume_icons/companylist.svg",
      refLink: "",
      mode: "company-list",
      launch_soon: false
    },
    {
      id: 7,
      moduleName: "Psychometric Test",
      Description: "Measure cognitive abilities and personality traits using standardized psychometric testing.",
      tooltip: "Evaluate your aptitudes and personality traits with tests to find careers that best suit your profile.",
      imageLink: environment.production === false ? "https://api.uniprep.ai/uniprepapi/storage/app//public/icon/modules/psychometrictest.svg" : "https://uniprep.ai/uniprepapi/storage/app/public/icon/modules/psychometrictest.svg",
      refLink: "",
      mode: "psychometric-test",
      launch_soon: false
    },
    {
      id: 8,
      moduleName: "Personality Test",
      Description: "Utilize personality assessments to analyze and understand individual traits and behaviors.",
      tooltip: "Discover more about your personality and how it aligns with various career paths.",
      imageLink: environment.production === false ? "https://api.uniprep.ai/uniprepapi/storage/app//public/icon/modules/personalitytest.svg" : "https://uniprep.ai/uniprepapi/storage/app/public/icon/modules/personalitytest.svg",
      refLink: "",
      mode: "personality-test",
      launch_soon: false
    },
    {
      id: 9,
      moduleName: "Employer Test",
      Description: "Prepare for employment with specific company-focused tests designed to assess job readiness and fit.",
      tooltip: "Prepare for potential employer assessments with practice tests and study guides.",
      imageLink: environment.production === false ? "https://api.uniprep.ai/uniprepapi/storage/app//public/icon/modules/employertest.svg" : "https://uniprep.ai/uniprepapi/storage/app/public/icon/modules/employertest.svg",
      refLink: "",
      mode: "employer-test",
      launch_soon: false
    },
    {
      id: 10,
      moduleName: "Job Interview Preparation",
      Description: "Prepare effectively with role-focused guidance and company-centric tips",
      tooltip: "Prepare effectively with role-focused guidance and company-centric tips",
      imageLink: environment.production === false ? "https://api.uniprep.ai/uniprepapi/storage/app//public/icon/modules/job-interview.svg" : "https://uniprep.ai/uniprepapi/storage/app/public/icon/modules/job-interview.svg",
      refLink: "",
      mode: "job-role",
      launch_soon: false
    },
    {
      id: 10,
      moduleName: "Career Growth Checker",
      Description: "Get insight into your next 5 career growth oppurtunity.",
      tooltip: "Track your professional development and set goals with our career progression tool.",
      imageLink: environment.production === false ? "https://api.uniprep.ai/uniprepapi/storage/app//public/icon/modules/growth.svg" : "https://uniprep.ai/uniprepapi/storage/app/public/icon/modules/growth.svg",
      refLink: "",
      mode: "career-growth-checker",
      launch_soon: false
    },
    {
      id: 11,
      moduleName: "Average Salary Estimator",
      Description: "Estimate the average salary for your role based on industry and location trends.",
      tooltip: "Discover salary benchmarks and plan your career with our reliable salary estimation tool.",
      imageLink: environment.production === false ? "https://api.uniprep.ai/uniprepapi/storage/app//public/icon/modules/avgsest.png" : "https://uniprep.ai/uniprepapi/storage/app/public/icon/modules/avgsest.png",
      refLink: "",
      mode: "average-salary-estimator",
      launch_soon: true
    },
    {
      id: 12,
      moduleName: "Global Work Visas",
      Description: "Get insight into your next 5 career growth oppurtunity.",
      tooltip: "Track your professional development and set goals with our career progression tool.",
      imageLink: environment.production === false ? "https://api.uniprep.ai/uniprepapi/storage/app//public/icon/modules/growth.svg" : "https://uniprep.ai/uniprepapi/storage/app/public/icon/modules/growth.svg",
      refLink: "",
      mode: "global-work-visa",
      launch_soon: true

    },
    {
      id: 13,
      moduleName: "Job Offer Comparison Tool",
      Description: "Compare multiple job offers to make informed career decisions.",
      tooltip: "Evaluate and weigh job offers based on salary, benefits, and growth opportunities.",
      imageLink: environment.production === false ? "https://api.uniprep.ai/uniprepapi/storage/app//public/icon/modules/joc.png" : "https://uniprep.ai/uniprepapi/storage/app/public/icon/modules/joc.png",
      refLink: "",
      mode: "job-offer-comparison",
      launch_soon: true
    },
    {
      id: 15,
      moduleName: "Salary Negotiation Hacks",  
      Description: "Unlock the secrets to negotiating better pay, maximizing your earnings, and achieving financial growth in your career.",  
      tooltip: "Master the art of salary negotiation and take control of your financial future.",
      imageLink: environment.production === false ? "https://api.uniprep.ai/uniprepapi/storage/app//public/icon/modules/snh.png" : "https://uniprep.ai/uniprepapi/storage/app/public/icon/modules/snh.png",
      refLink: "",
      mode: "salary-hacks",
      launch_soon: false
    },
    {
      id: 16,
      moduleName: "Job Seeker Success Stories",  
      Description: "Get inspired by real-life stories of job seekers who overcame challenges to achieve their dream roles.",  
      tooltip: "Learn from the experiences of successful job seekers and gain insights to land your ideal job.",
      imageLink: environment.production === false ? "https://api.uniprep.ai/uniprepapi/storage/app//public/icon/modules/jsss.png" : "https://uniprep.ai/uniprepapi/storage/app/public/icon/modules/jsss.png",
      refLink: "",
      mode: "job-seeker-success-stories",
      launch_soon: false
    },
    {
      id: 17,
      moduleName: "Fortune Companies",
      Description: "Explore insights, trends, and success strategies from top Fortune companies across industries.",
      tooltip: "Gain valuable knowledge about Fortune companies to enhance your career and business decisions.",
      imageLink: environment.production === false ? "https://api.uniprep.ai/uniprepapi/storage/app//public/icon/modules/fc.png" : "https://uniprep.ai/uniprepapi/storage/app/public/icon/modules/fc.png",
      refLink: "",
      mode: "fortune-companies",
      launch_soon: false
    },
    {
      id: 18,
      moduleName: "Career Hacks",  
      Description: "Access actionable tips and strategies to accelerate your career growth and achieve your goals.",  
      tooltip: "Unleash your potential with proven career hacks designed to fast-track your success.",
      imageLink: environment.production === false ? "https://api.uniprep.ai/uniprepapi/storage/app//public/icon/modules/chacks.png" : "https://uniprep.ai/uniprepapi/storage/app/public/icon/modules/chacks.png",
      refLink: "",
      mode: "career-hacks",
      launch_soon: false
    },
    {
      id: 19,
      moduleName: "Global Employment Insights",  
      Description: "Access actionable tips and strategies to accelerate your career growth and achieve your goals.",  
      tooltip: "Unleash your potential with proven career hacks designed to fast-track your success.",
      imageLink: environment.production === false ? "https://api.uniprep.ai/uniprepapi/storage/app//public/icon/modules/Global-Employement-Insights.svg" : "https://uniprep.ai/uniprepapi/storage/app/public/icon/modules/Global-Employement-Insights.svg",
      refLink: "",
      mode: "global-employment-insights",
      launch_soon: true
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
    // {
    //   id: 22,
    //   moduleName: "Market Analysis",
    //   Description: "Access actionable tips and strategies to accelerate your career growth and achieve your goals.",
    //   tooltip: "Unleash your potential with proven career hacks designed to fast-track your success.",
    //   imageLink: environment.production === false ? "https://api.uniprep.ai/uniprepapi/storage/app//public/icon/modules/chacks.png" : "https://uniprep.ai/uniprepapi/storage/app/public/icon/modules/chacks.png",
    //   refLink: "",
    //   mode: "market-analysis",
    //   launch_soon: true
    // }
  ]

  constructor(private router: Router, private employerGlobalService: EmployerGlobalService) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.url;
        if (this.currentRoute.includes('career-tool')) {
          localStorage.setItem('MainTitleCareerTool', '');
          localStorage.setItem("employerName", '');
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
    switch (mode) {
      case "cv-builder":
        this.router.navigate(['/pages/job-tool/cv-builder']);
        break;
      case "coverletter-builder":
        this.router.navigate(['/pages/job-tool/coverletter-builder']);
        break;
      case "career-planner":
        this.router.navigate(['/pages/job-tool/careerplannerlist']);
        break;
      case "cost-of-living":
        this.router.navigate(['/pages/job-tool/cost-of-living']);
        break;
      case "salary-converter":
        this.router.navigate(['/pages/job-tool/salary-converter']);
        break;
      case "company-list":
        this.router.navigate(['/pages/job-tool/company-list']);
        break;
      case "psychometric-test":
        this.router.navigate(['/pages/job-tool/list/psychometric-test/11']);
        break;
      case "personality-test":
        this.router.navigate(['/pages/job-tool/list/personality-test/12']);
        break;
      case "job-role":
        this.router.navigate(['/pages/interviewprep']);
        break;
      case "career-growth-checker":
        this.router.navigate(['/pages/job-tool/career-growth-checker']);
        break;
      case "average-salary-estimator":
        this.router.navigate(['/pages/average-salary-estimator']);
        break;
      case "job-offer-comparison":
        this.router.navigate(['/pages/job-offer-comparison']);
        break;
      case "global-work-visa":
        this.router.navigate(['/pages/job-tool/global-work-visa']);
        break;
      case "career-hacks":
        this.router.navigate(['/pages/career-hacks']);
        break;
      case "salary-hacks":
        this.router.navigate(['/pages/salary-hacks']);
        break;
      case "job-seeker-success-stories":
        this.router.navigate(['/pages/job-seeker-success-stories']);
        break;
      default:
        this.router.navigate(['/pages/job-tool/list/employer-test/13']);
        break;
    }
  }
}
