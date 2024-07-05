import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'uni-job-search',
  templateUrl: './job-search.component.html',
  styleUrls: ['./job-search.component.scss']
})

export class JobSearchComponent implements OnInit {

  currentEndpoint:string = '';

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.getCurrentEndpoint();
  }

  getCurrentEndpoint(): void {
    const url = this.router.url;
    const urlSegments = url.split('/');
    this.currentEndpoint = urlSegments[urlSegments.length - 1];

    // console.log('Current Endpoint:', this.currentEndpoint);
  }

  headerMenuClick(menuName: string){
    // console.log(menuName);
    this.currentEndpoint = menuName;
    if(menuName == "job-hunt"){
      this.router.navigate(['/pages/job-search/job-hunt']);
    }else if(menuName == "job-board"){
      this.router.navigate(['/pages/job-search/job-board']);
    }else if(menuName == "cv-builder"){
      this.router.navigate(['/pages/job-search/cv-builder']);
    }else if(menuName == "coverletter-builder"){
      this.router.navigate(['/pages/job-search/coverletter-builder']);
    }
  }
}
