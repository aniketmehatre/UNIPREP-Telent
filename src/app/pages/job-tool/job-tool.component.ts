import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { Location } from '@angular/common';

@Component({
  selector: 'uni-job-tool',
  templateUrl: './job-tool.component.html',
  styleUrls: ['./job-tool.component.scss']
})
export class JobToolComponent implements OnInit {
  currentRoute: string = '';
  title: string = 'Career Tools';
  items:string[]=[" ₹ INR", "$ Dollers"];
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.getCurrentEndpoint();
    this.currentRoute = this.router.url;
    this.changeTitle();
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
    }
    else if (this.currentRoute.includes("cost-of-living")) {
      this.title = "Cost of living";
    } else if (this.currentRoute.includes("cv-builder")) {
      this.title = "CV Builder";
    } else if (this.currentRoute.includes("salary-converter")) {
      this.title = "Global Salary Converter";
    } else {
      this.title = "Coverletter Builder";
    }
  }
  goBack() {
    if (window.history.length > 1) {
      this.location.back()
    } else {
      this.router.navigate(['/pages/job-tool/career-tool'])
    }
  }
  currentEndpoint: string = "";

  getCurrentEndpoint(): void {
    const url = this.router.url;
    const urlSegments = url.split('/');
    this.currentEndpoint = urlSegments[urlSegments.length - 1];
  }


}
