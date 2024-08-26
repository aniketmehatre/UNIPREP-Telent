import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { Location } from '@angular/common';
import { CourseListService } from '../course-list/course-list.service';
@Component({
  selector: 'uni-job-tool',
  templateUrl: './job-tool.component.html',
  styleUrls: ['./job-tool.component.scss']
})
export class JobToolComponent implements OnInit {
  currentRoute: string = '';
  title: string = 'Career Tools';
  items:string[]=[" ₹ INR", "$ Dollers"];
  hideTitleForPreviewPage: boolean = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private resumeService: CourseListService
  ) {
    this.currentRoute = this.router.url;
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.url;
        this.changeTitle()
      }
    });
  }

  ngOnInit(): void {
    this.currentRoute = this.router.url;
    this.changeTitle();
    this.hideHeaderForPreviewPage();
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
    } else if (this.currentRoute.includes("cost-of-living")) {
      this.title = "Cost of living";
    } else if (this.currentRoute.includes("cv-builder")) {
      this.title = "CV Builder";
    } else if (this.currentRoute.includes("salary-converter")) {
      this.title = "Global Salary Converter";
    } else if (this.currentRoute.includes("company-list")) {
      this.title = "company-list";
    } else if(this.currentRoute.includes("coverletter-builder")){
      this.title = "Coverletter-Builder";
    } else if(this.currentRoute.includes("career-planner")){
      this.title = "career-planner";
    }
  }
  goBack() {
    if (window.history.length > 1) {
      this.location.back()
    } else {
      this.router.navigate(['/pages/job-tool/career-tool'])
    }
  }

  hideHeaderForPreviewPage(){
    this.resumeService.data$.subscribe(data => {
      if (!this.currentRoute.includes("salary-converter")) {
        this.hideTitleForPreviewPage = data;
      }
    });
  }

  isCostOfLivingRoute(): boolean {
    // console.log(this.currentRoute.includes('cost-of-living')) 
    return this.currentRoute.includes('cost-of-living');
  }
}
