import { Component, ElementRef, Output, EventEmitter, OnInit } from '@angular/core';
import { TabPanel, TabView, TabViewModule } from "primeng/tabview";
import { CommonModule, NgClass } from "@angular/common";
import { TalentConnectService } from '../../talent-connect.service';
import { Paginator, PaginatorModule } from 'primeng/paginator';
import { TabsModule } from 'primeng/tabs';

@Component({
  selector: 'uni-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.scss'],
  standalone: true,
  imports: [
    TabsModule,
    TabViewModule,
    PaginatorModule,
    CommonModule
  ]
})
export class JobListComponent implements OnInit {
  @Output() emitId: EventEmitter<number> = new EventEmitter();
  activeIndex: number = 1;
  first: number = 0;
  page: number = 1;
  jobDetails: any;
  appliedJobList!: any;
  totalAppliedJobs: number = 0;
  pageSize: number = 10;
  tabs = [
    { label: 'All Jobs', active: true },
    { label: 'Job Applied', active: false },
    { label: 'Application Received', active: false },
    { label: 'Shortlisted', active: false }
  ];

  constructor(private talentConnectService: TalentConnectService) { }


  ngOnInit(): void {
    this.getAppliedJobList();
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Job Applied': return 'bg-primary text-white';
      case 'Application Received': return 'bg-warning text-dark';
      case 'Shortlisted': return 'bg-success text-white';
      case 'Position Closed': return 'bg-danger text-white';
      default: return 'bg-secondary text-white';
    }
  }


  onClickJobCard(id: number) {
    this.emitId.emit(id);
  }

  selectTab(tab: any) {
    this.tabs.forEach(t => (t.active = false));
    tab.active = true;
  }

  getAppliedJobList() {
    const data = {
      page: this.page,
      perPage: this.pageSize,
    }
    this.talentConnectService.getAppliedJobList(data).subscribe({
      next: response => {
        this.appliedJobList = response.jobs;
        this.totalAppliedJobs = response.totaljobs;
      },
      error: error => {
        console.log(error);
      }
    });
  }

  getJobTrackDetails(id: number) {
    this.talentConnectService.getJobDetails(id).subscribe({
      next: response => {
        this.jobDetails = response.job[0];
      },
      error: error => {
        console.log(error);
      }
    });
  }


  onPageChange(event: any) {
    this.page = event.first / this.pageSize + 1;
    this.pageSize = event.rows;
    this.first = event.first;
    this.getAppliedJobList();
  }

  
}
