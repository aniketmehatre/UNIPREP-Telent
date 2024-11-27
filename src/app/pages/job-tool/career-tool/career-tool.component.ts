import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {environment} from '@env/environment';
import {EmployerGlobalService} from "../employer-global.service";

@Component({
  selector: 'uni-career-tool',
  templateUrl: './career-tool.component.html',
  styleUrls: ['./career-tool.component.scss']
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
      mode: "cv-builder"
    },
    {
      id: 2,
      moduleName: "Cover Letter Builder",
      Description: "Generate a cover letter that strengthens your job application.",
      tooltip: "Generate a cover letter that strengthens your job application.",
      imageLink: "https://api.uniprep.ai/uniprepapi/storage/app/public/resources-coverimage/CoverLetter.svg",
      refLink: "https://resumaker.ai/cover-letter/",
      mode: "coverletter-builder"
    },
    {
      id: 3,
      moduleName: "Career Planner",
      Description: "Plan your career path by exploring job opportunities worldwide",
      tooltip: "Plan your career path by exploring job opportunities worldwide.",
      imageLink: "https://api.uniprep.ai/uniprepapi/storage/app/public/resume_icons/careerplanner.svg",
      refLink: "",
      mode: "career-planner"
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
      mode: "salary-converter"
    },
    {
      id: 6,
      moduleName: "Company List",
      Description: "Access a comprehensive database with detailed information of over 100,000 companies.",
      tooltip: "Access a curated list of companies by industry and location to target your job search effectively.",
      imageLink: "https://api.uniprep.ai/uniprepapi/storage/app/public/resume_icons/companylist.svg",
      refLink: "",
      mode: "company-list"
    },
    {
      id: 7,
      moduleName: "Psychometric Test",
      Description: "Measure cognitive abilities and personality traits using standardized psychometric testing.",
      tooltip: "Evaluate your aptitudes and personality traits with tests to find careers that best suit your profile.",
      imageLink: environment.production === false ? "https://api.uniprep.ai/uniprepapi/storage/app//public/icon/modules/psychometrictest.svg" : "https://uniprep.ai/uniprepapi/storage/app/public/icon/modules/psychometrictest.svg",
      refLink: "",
      mode: "psychometric-test"
    },
    {
      id: 8,
      moduleName: "Personality Test",
      Description: "Utilize personality assessments to analyze and understand individual traits and behaviors.",
      tooltip: "Discover more about your personality and how it aligns with various career paths.",
      imageLink: environment.production === false ? "https://api.uniprep.ai/uniprepapi/storage/app//public/icon/modules/personalitytest.svg" : "https://uniprep.ai/uniprepapi/storage/app/public/icon/modules/personalitytest.svg",
      refLink: "",
      mode: "personality-test"
    },
    {
      id: 9,
      moduleName: "Employer Test",
      Description: "Prepare for employment with specific company-focused tests designed to assess job readiness and fit.",
      tooltip: "Prepare for potential employer assessments with practice tests and study guides.",
      imageLink: environment.production === false ? "https://api.uniprep.ai/uniprepapi/storage/app//public/icon/modules/employertest.svg" : "https://uniprep.ai/uniprepapi/storage/app/public/icon/modules/employertest.svg",
      refLink: "",
      mode: "employer-test"
    },
    {
      id: 10,
      moduleName: "Job Interview Preparation",
      Description: "Prepare effectively with role-focused guidance and company-centric tips",
      tooltip: "Prepare effectively with role-focused guidance and company-centric tips",
      imageLink: environment.production === false ? "https://api.uniprep.ai/uniprepapi/storage/app//public/icon/modules/job-interview.svg" : "https://uniprep.ai/uniprepapi/storage/app/public/icon/modules/job-interview.svg",
      refLink: "",
      mode: "job-role"
    },
    {
      id: 10,
      moduleName: "Career Growth Checker",
      Description: "Get insight into your next 5 career growth oppurtunity.",
      tooltip: "Track your professional development and set goals with our career progression tool.",
      imageLink: environment.production === false ? "https://api.uniprep.ai/uniprepapi/storage/app//public/icon/modules/growth.svg" : "https://uniprep.ai/uniprepapi/storage/app/public/icon/modules/growth.svg",
      refLink: "",
      mode: "career-growth-checker"
    }
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


  chooseOneOption(mode: string) {
    this.currentEndpoint = mode;
    if (mode == "cv-builder") {
      this.router.navigate(['/pages/job-tool/cv-builder']);
    } else if (mode == "coverletter-builder") {
      this.router.navigate(['/pages/job-tool/coverletter-builder']);
    } else if (mode == "career-planner") {
      this.router.navigate(['/pages/job-tool/career-planner']);
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
      this.router.navigate(['/pages/jobroles']);
    } else if (mode == "career-growth-checker") {
      this.router.navigate(['/pages/job-tool/career-growth-checker']);
    } else {
      this.router.navigate(['/pages/job-tool/list/employer-test/13']);
    }
  }
  // openSalaryConverter(){
  //   this.router.navigate(['/pages/job-tool/salary-converter']);
  // }
}
