import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'uni-job-tool',
  templateUrl: './job-tool.component.html',
  styleUrls: ['./job-tool.component.scss']
})
export class JobToolComponent implements OnInit {
  constructor(private router: Router) { }
  currentEndpoint: string = "";
  ngOnInit(): void {
    this.getCurrentEndpoint();
  }

  getCurrentEndpoint(): void {
    const url = this.router.url;
    const urlSegments = url.split('/');
    this.currentEndpoint = urlSegments[urlSegments.length - 1];
  }

  
}
