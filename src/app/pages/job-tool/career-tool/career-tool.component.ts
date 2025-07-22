import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { environment } from '@env/environment';
import { EmployerGlobalService } from "../employer-global.service";
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';
import { StorageService } from "../../../services/storage.service";
import { SharedModule } from 'src/app/shared/shared.module';
export interface CareerTools {
  id: number
  moduleName: string
  tooltip: string
  imageLink: string
  refLink: string
  mode: string
  launch_soon: boolean
  is_ai: boolean
}

@Component({
  selector: 'uni-career-tool',
  templateUrl: './career-tool.component.html',
  styleUrls: ['./career-tool.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, TooltipModule, SharedModule]
})

export class CareerToolComponent implements OnInit {
  currentEndpoint: string = "";
  currentRoute: any;
  domainUrl: string = `https://${environment.domain}/uniprepapi/storage/app/public/ToolIcons/career-tools/`;
  modulesList: CareerTools[] = [
    {
      id: 1,
      moduleName: "CV Builder",
      tooltip: "Craft a standout CV that highlights your skills and experience, ready for any job application.",
      imageLink: `https://${environment.domain}/uniprepapi/storage/app/public/resources-coverimage/cv.svg`,
      refLink: "https://novoresume.com/",
      mode: "cv-builder",
      launch_soon: false,
      is_ai: true,
    },
    {
      id: 2,
      moduleName: "Cover Letter Builder",
      tooltip: "Generate a cover letter that strengthens your job application.",
      imageLink: `https://${environment.domain}/uniprepapi/storage/app/public/resources-coverimage/CoverLetter.svg`,
      refLink: "https://resumaker.ai/cover-letter/",
      mode: "coverletter-builder",
      is_ai: true,
      launch_soon: false
    },
    {
      id: 3,
      moduleName: "Career Planner - Specialization Wise",
      tooltip: "Plan your career path by exploring job opportunities worldwide.",
      imageLink: `../../../uniprep-assets/images/icons/careerspecialization.svg`,
      refLink: "",
      mode: "career-planner-specialization",
      is_ai: false,
      launch_soon: false
    },
    {
      id: 4,
      moduleName: "Career Planner - Country Wise",
      tooltip: "Compare the cost of living across different cities and countries to plan your financial needs.",
      imageLink: `../../../uniprep-assets/images/icons/careercountry.svg`,
      refLink: "",
      mode: "career-planner-country",
      is_ai: true,
      launch_soon: false
    },
    {
      id: 5,
      moduleName: "Global Salary Converter",
      tooltip: "Convert and compare salaries globally to understand the value of potential job offers.",
      imageLink: `https://${environment.domain}/uniprepapi/storage/app/public/resume_icons/salaryconverter.svg`,
      refLink: "",
      mode: "salary-converter",
      is_ai: false,
      launch_soon: false
    },
    {
      id: 6,
      moduleName: "Company List",
      tooltip: "Access a curated list of companies by industry and location to target your job search effectively.",
      imageLink: `https://${environment.domain}/uniprepapi/storage/app/public/resume_icons/companylist.svg`,
      refLink: "",
      mode: "company-list",
      is_ai: false,
      launch_soon: false
    },
    {
      id: 7,
      moduleName: "Psychometric Test",
      tooltip: "Evaluate your aptitudes and personality traits with tests to find careers that best suit your profile.",
      imageLink: `https://${environment.domain}/uniprepapi/storage/app//public/icon/modules/psychometrictest.svg`,
      refLink: "",
      mode: "psychometric-test",
      is_ai: false,
      launch_soon: false
    },
    {
      id: 8,
      moduleName: "Personality Test",
      tooltip: "Discover more about your personality and how it aligns with various career paths.",
      imageLink: `https://${environment.domain}/uniprepapi/storage/app//public/icon/modules/personalitytest.svg`,
      refLink: "",
      mode: "personality-test",
      is_ai: false,
      launch_soon: false
    },
    {
      id: 9,
      moduleName: "Employer Test",
      tooltip: "Prepare for potential employer assessments with practice tests and study guides.",
      imageLink: `https://${environment.domain}/uniprepapi/storage/app//public/icon/modules/employertest.svg`,
      refLink: "",
      mode: "employer-test",
      is_ai: false,
      launch_soon: false
    },
    {
      id: 10,
      moduleName: "Job Interview Preparation",
      tooltip: "Prepare effectively with role-focused guidance and company-centric tips",
      imageLink: `https://${environment.domain}/uniprepapi/storage/app//public/icon/modules/job-interview.svg`,
      refLink: "",
      mode: "job-role",
      is_ai: true,
      launch_soon: false
    },
    {
      id: 10,
      moduleName: "Career Growth Checker",
      tooltip: "Track your professional development and set goals with our career progression tool.",
      imageLink: `https://${environment.domain}/uniprepapi/storage/app//public/icon/modules/growth.svg`,
      refLink: "",
      mode: "career-growth-checker",
      is_ai: false,
      launch_soon: false
    },
    {
      id: 11,
      moduleName: "Average Salary Estimator",
      tooltip: "Discover salary benchmarks and plan your career with our reliable salary estimation tool.",
      imageLink: this.domainUrl + "AverageSalaryEstimator.svg",
      refLink: "",
      mode: "average-salary-estimator",
      is_ai: true,
      launch_soon: false
    },
    {
      id: 12,
      moduleName: "Global Work Visas",
      tooltip: "Track your professional development and set goals with our career progression tool.",
      imageLink: this.domainUrl + "GlobalWorkVisa.svg",
      refLink: "",
      mode: "global-work-visa",
      is_ai: false,
      launch_soon: false
    },
    {
      id: 13,
      moduleName: "Job Offer Comparison Tool",
      tooltip: "Evaluate and weigh job offers based on salary, benefits, and growth opportunities.",
      imageLink: this.domainUrl + "JobOfferComparisonTool.svg",
      refLink: "",
      mode: "job-offer-comparison",
      is_ai: true,
      launch_soon: true
    },
    {
      id: 15,
      moduleName: "Salary Negotiation Hacks",
      tooltip: "Master the art of salary negotiation and take control of your financial future.",
      imageLink: `https://${environment.domain}/uniprepapi/storage/app//public/icon/modules/snh.png`,
      refLink: "",
      mode: "salary-hacks",
      is_ai: false,
      launch_soon: false
    },
    {
      id: 16,
      moduleName: "Job Seeker Success Stories",
      tooltip: "Learn from the experiences of successful job seekers and gain insights to land your ideal job.",
      imageLink: `https://${environment.domain}/uniprepapi/storage/app//public/icon/modules/jsss.png`,
      refLink: "",
      mode: "job-seeker-success-stories",
      is_ai: false,
      launch_soon: false
    },
    {
      id: 17,
      moduleName: "Fortune Companies",
      tooltip: "Gain valuable knowledge about Fortune companies to enhance your career and business decisions.",
      imageLink: this.domainUrl + "FortuneCompanies.svg",
      refLink: "",
      mode: "fortune-companies",
      is_ai: false,
      launch_soon: false
    },
    {
      id: 18,
      moduleName: "Career Hacks",
      tooltip: "Unleash your potential with proven career hacks designed to fast-track your success.",
      imageLink: `https://${environment.domain}/uniprepapi/storage/app//public/icon/modules/chacks.png`,
      refLink: "",
      mode: "career-hacks",
      is_ai: false,
      launch_soon: false
    },
    {
      id: 19,
      moduleName: "Global Employment Insights",
      tooltip: "Unleash your potential with proven career hacks designed to fast-track your success.",
      imageLink: this.domainUrl + "GlobalEmployementInsights.svg",
      refLink: "",
      mode: "global-employment-insights",
      is_ai: false,
      launch_soon: false
    },
    {
      id: 20,
      moduleName: "Video Mock Interview – Job",
      tooltip: "Unleash your potential with proven career hacks designed to fast-track your success.",
      imageLink: this.domainUrl + "videomockinterviewjob.svg",
      refLink: "",
      mode: "market-analysis",
      launch_soon: true,
      is_ai: false,
    },
    {
      id: 21,
      moduleName: "AMCAT Test",
      tooltip: "Provides AMCAT-style aptitude assessments designed to enhance job seekers' visibility on leading job portals and prepare them for standardized pre-employment screening.",
      imageLink: this.domainUrl + "amcat.webp",
      refLink: "",
      mode: "market-analysis",
      launch_soon: true,
      is_ai: false,
    },
    {
      id: 22,
      moduleName: "Skill Gap Analyzer",
      tooltip: "Skill Gap Analyzer helps identify the difference between the skills a person currently has and the skills required for a specific role. It enables targeted upskilling by highlighting areas for improvement based on job requirements.",
      imageLink: this.domainUrl + "skill_gap_analyzer.svg",
      refLink: "",
      mode: "market-analysis",
      launch_soon: true,
      is_ai: false,
    },
    {
      id: 23,
      moduleName: "Mentor Connect",
      tooltip: "Matches users with experienced mentors based on industry, expertise, and location to provide personalized academic and professional guidance.",
      imageLink: this.domainUrl + "mentor_connect.svg",
      refLink: "",
      mode: "market-analysis",
      launch_soon: true,
      is_ai: false,
    },
    {
      id: 24,
      moduleName: "Virtual Internship",
      tooltip: "Recommends virtual internships tailored to users’ academic backgrounds, career interests, and skill levels — including role descriptions and required competencies.",
      imageLink: this.domainUrl + "virtual_internship.svg",
      refLink: "",
      mode: "market-analysis",
      launch_soon: true,
      is_ai: false,
    },
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
    } else if (mode == "career-planner-specialization") {
      // this.router.navigate(['/pages/job-tool/career-planner']);
      this.router.navigate(['/pages/job-tool/career-planner']);
    } else if (mode == "career-planner-country") {
      this.router.navigate(['/pages/job-tool/careerplannercountrywise']);
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
    else if (mode == "average-salary-estimator") {
      this.router.navigate(['/pages/average-salary-estimator']);
    }
    else if (mode == "job-offer-comparison") {
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

  get filteredModulesList(): CareerTools[] {
    if (this.storage.get('home_country_name') === 'India') {
      return this.modulesList;
    } else {
      return this.modulesList.filter(m => ![12].includes(m.id));
    }
  }
}
