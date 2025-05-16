import { Component } from '@angular/core';
import { Job } from 'src/app/pages/talent-connect/easy-apply/job-view/job-view.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { PipesModule } from '@pipes/pipes.module';
import { landingServices } from '../landing-page.service';

@Component({
  selector: 'uni-active-jobs',
  imports: [CommonModule, RouterModule, ButtonModule, TooltipModule, DialogModule, PipesModule],
  templateUrl: './active-jobs.component.html',
  styleUrl: './active-jobs.component.scss'
})
export class ActiveJobsComponent {
jobListings: Job[] = [];
displayUnlockFilter: boolean = false;
  filteredTalents: Job[] = [];
  totalTalents: number = 0;
  currentPage: number = 1;
  itemsPerPage: number = 9;
  totalPages: number = 0;

  constructor(private landingPageService: landingServices) { }

  ngOnInit(): void {
    this.loadJobsData();
    this.totalPages = Math.ceil(this.jobListings.length / this.itemsPerPage);
  }

  loadJobsData(): void {
    this.landingPageService.getJobsList({ page: this.currentPage, perpage: this.itemsPerPage}).subscribe(
      (response) => {
        this.jobListings = response.jobs;
        this.totalTalents = response.totaljobs;
        this.totalPages = Math.ceil(this.totalTalents / this.itemsPerPage);
      },
      (error) => {
        console.error('Error fetching activeJobs:', error);
      });
  }


  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadJobsData();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.changePage(this.currentPage - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.changePage(this.currentPage + 1);
    }
  }
}
