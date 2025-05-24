import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { landingServices } from '../landing-page.service';
import { PaginatorModule } from 'primeng/paginator';

@Component({
  selector: 'uni-active-jobs',
  imports: [CommonModule, RouterModule, ButtonModule, TooltipModule, DialogModule, PaginatorModule],
  templateUrl: './active-jobs.component.html',
  styleUrl: './active-jobs.component.scss'
})
export class ActiveJobsComponent {
  jobListings: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  displayUnlockFilter: boolean = false;
  currentPage: number = 1;
  itemsPerPage: number = 9;
  first: number = 0;
  totalJobs: number = 500;

  constructor(private landingPageService: landingServices) { }

  ngOnInit(): void {
    // this.loadJobsData();
    // this.totalPages = Math.ceil(this.jobListings.length / this.itemsPerPage);
  }

  // loadJobsData(): void {
  //   this.landingPageService.getJobsList({ page: this.currentPage, perpage: this.itemsPerPage}).subscribe(
  //     (response) => {
  //       this.jobListings = response.jobs;
  //       this.totalTalents = response.totaljobs;
  //       this.totalPages = Math.ceil(this.totalTalents / this.itemsPerPage);
  //     },
  //     (error) => {
  //       console.error('Error fetching activeJobs:', error);
  //     });
  // }

  onPageChange(event: any) {
    this.currentPage = event.page + 1;
    this.itemsPerPage = event.rows;
    this.displayUnlockFilter = true;
  // this.loadTalentsData();
  }
}
