import { EmployerGlobalService } from './employer-global.service';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { PageFacadeService } from '../page-facade.service';
import { filter } from 'rxjs';
import { Location, CommonModule } from '@angular/common';
import { CourseListService } from '../course-list/course-list.service';
import { TooltipModule } from 'primeng/tooltip';
import {StorageService} from "../../storage.service";
@Component({
    selector: 'uni-job-tool',
    templateUrl: './job-tool.component.html',
    styleUrls: ['./job-tool.component.scss'],
    standalone: true,
    imports: [CommonModule, RouterModule, TooltipModule]
})
export class JobToolComponent implements OnInit {
  currentRoute: string = '';
  title: string = 'Career Tools';
  items: string[] = [" ₹ INR", "$ Dollers"];
  hideTitleForPreviewPage: boolean = false;
  tooltip: any;
  employerName: any;
  mainTitle: any;
  howItWorksVideo: string = "";
  constructor(
    private router: Router, 
    private employerGlobalService: EmployerGlobalService,
    private location: Location,
    private resumeService: CourseListService,
    private pageFacade: PageFacadeService, 
    private storage: StorageService
  ) {
    this.currentRoute = this.router.url;
    this.router.events.subscribe(event => {
      this.mainTitle = this.storage.get('MainTitleCareerTool');
      this.employerName = this.storage.get("employerName");
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.url;
        if (this.currentRoute.includes('career-tool')){
          this.mainTitle = "";
          this.employerName = "";
          this.storage.set('MainTitleCareerTool', '');
          this.storage.set("employerName", '');
          this.employerGlobalService.clearAll()
        }
        this.changeTitle()
      }
    });
  }

  ngOnInit(): void {
    console.log('job tool')
    this.currentRoute = this.router.url;
    this.changeTitle();
    // if (!this.currentRoute.includes("career-tool")&&!this.currentRoute.includes("psychometric") && !this.currentRoute.includes("personality") && !this.currentRoute.includes("employer") && !this.currentRoute.includes("cost-of-living")) {
      // console.log("job tool components");
      this.hideHeaderForPreviewPage();
    // }
    this.router
      .events.pipe(
        filter(event => event instanceof NavigationEnd),
      ).subscribe((ttl: any) => {
        this.currentRoute = ttl.url;
        this.changeTitle()
      });
  }
  changeTitle() {
    if (this.currentRoute.includes("career-tool")) {
      this.title = "Career Tools";
      this.tooltip = "Enhance your employability with tools to create resumes, cover letters, and prepare for interviews."
      this.hideTitleForPreviewPage = false;
      this.howItWorksVideo = 'not_required';
    } else if (this.currentRoute.includes("cost-of-living")) {
      this.title = "Travel Tools > Cost of living";
      this.tooltip = "Compare the cost of living across different cities and countries to plan your financial needs."
      this.howItWorksVideo = "cost-of-living";
    } else if (this.currentRoute.includes("cv-builder")) {
      this.title = "Career Tools > CV Builder";
      this.howItWorksVideo = "cv-builder";
    } else if (this.currentRoute.includes("salary-converter")) {
      this.title = "Career Tools > Global Salary Converter";
      this.tooltip = "Convert and compare salaries globally to understand the value of potential job offers."
      this.howItWorksVideo = "global-salary";
    } else if (this.currentRoute.includes("company-list")) {
      // this.title = "Career Tools -> company-list";
      this.title = "not_required";
      this.tooltip = "Access a curated list of companies by industry and location to target your job search effectively."
      this.howItWorksVideo = "company-list";
    } else if (this.currentRoute.includes("coverletter-builder")) {
      this.title = "Career Tools > Coverletter-Builder";
      this.tooltip = ""
      this.howItWorksVideo = "cover-letter";
    } else if (this.currentRoute.includes("career-planner")) {
      // this.title = "Career Tools -> career-planner";
      this.title = "not_required";
      this.tooltip = ""
      this.howItWorksVideo = "career-planner";
    }
    else if (this.currentRoute.includes("psychometric")) {
      this.title = "Career Tools > Psychometric Test";
      this.tooltip = "Evaluate your aptitudes and personality traits with tests to find careers that best suit your profile."
      this.hideTitleForPreviewPage = false;
      this.howItWorksVideo = "phsycometric-test";
    } else if (this.currentRoute.includes("personality")) {
      this.title = "Career Tools > Personality Test";
      this.tooltip = "Discover more about your personality and how it aligns with various career paths."
      this.hideTitleForPreviewPage = false;
      this.howItWorksVideo = "personality-test";
    } else if (this.currentRoute.includes("career-growth-checker")) {
      this.title = "Career Tools > Career Growth Checker";
      this.tooltip = "Track your professional development and set goals with our career progression tool."
      this.hideTitleForPreviewPage = false;
      this.howItWorksVideo = "career-growth-checker";
    } else if (this.currentRoute.includes("careerplannerlist")) {
      this.title = "Career Tools > Career Planner";
      this.tooltip = "Plan your career path by exploring job opportunities worldwide."
      this.hideTitleForPreviewPage = false;
      this.howItWorksVideo = "career-planner";
    } 
    else if (this.currentRoute.includes("careerplannercountrywise")) {
      // console.log("hi");
      this.title = "not_required";
      this.tooltip = "Plan your career path by exploring job opportunities worldwide."
      this.hideTitleForPreviewPage = true;
      this.howItWorksVideo = "career-planner";
    } 
    else if (this.currentRoute.includes("global-work-visa")) {
      this.title = "not_required";
      // this.tooltip = "Plan your career path by exploring job opportunities worldwide."
      // this.hideTitleForPreviewPage = false;
    }
    else {
      this.title = "Career Tools -> Employer Test";
      this.tooltip = "Prepare for potential employer assessments with practice tests and study guides."
      this.hideTitleForPreviewPage = false;
      this.howItWorksVideo = "employer-test";
    }
  }

  openVideoPopup(moduleName: string) {
    this.pageFacade.openHowitWorksVideoPopup(moduleName);
  }

  goBack() {
    if (this.currentRoute.includes("careerplannerlist")){
      this.router.navigate(['/pages/job-tool/career-tool'])
      return;
    }
    if (window.history.length > 1) {
      this.location.back()
      this.employerGlobalService.removeItem(this.employerGlobalService.getItems().length - 1)
    } else {
      this.employerGlobalService.removeItem(this.employerGlobalService.getItems().length - 1)
      this.router.navigate(['/pages/job-tool/career-tool'])
    }
  }

  hideHeaderForPreviewPage() {
    this.resumeService.data$.subscribe(data => {
      if (!this.currentRoute.includes("salary-converter")) {
        this.hideTitleForPreviewPage = data;
      }
    });
  }

  isCostOfLivingRoute(): boolean {
    // console.log(this.currentRoute.includes('cost-of-living')) 
    return this.currentRoute.includes('cost-of-living') || this.currentRoute.includes('salary-converter') || this.currentRoute.includes('psychometric') || this.currentRoute.includes('employer') || this.currentRoute.includes('personality');
  }
}
