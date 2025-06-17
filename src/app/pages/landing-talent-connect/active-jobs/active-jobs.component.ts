import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { PaginatorModule } from 'primeng/paginator';
import { LandingTalentService } from '../landing-page.service';

@Component({
  selector: 'uni-active-jobs',
  imports: [CommonModule, RouterModule, ButtonModule, TooltipModule, DialogModule, PaginatorModule],
  templateUrl: './active-jobs.component.html',
  styleUrl: './active-jobs.component.scss'
})
export class ActiveJobsComponent implements OnInit {
  jobListings: string[] = [];
  displayUnlockFilter: boolean = false;
  currentPage: number = 1;
  isShowEmpty: boolean = false;
  itemsPerPage: number = 9;
  first: number = 0;
  totalJobs: string = "1,02,004";

  constructor(private landingTalentService: LandingTalentService) { }

  ngOnInit(): void {
    this.getStaticCardByType();
  }

  getStaticCardByType() {
    this.landingTalentService.getStaticCardsByType('job').subscribe({
      next: response => {
        this.jobListings = response.data;
        if (this.jobListings && this.jobListings.length < 0) {
          this.isShowEmpty = true;
        }
      },
      error: error => {
        this.isShowEmpty = true;
        console.error(error.error.message);
      }
    })
  }

  onPageChange(event: any) {
    this.currentPage = event.page + 1;
    this.itemsPerPage = event.rows;
    this.displayUnlockFilter = true;
  // this.loadTalentsData();
  }
}
