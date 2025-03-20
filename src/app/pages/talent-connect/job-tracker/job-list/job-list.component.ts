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
  activeIndex: number = 0;
  first: number = 0;
  page: number = 1;
  jobDetails: any;
  appliedJobList!: any;
  filteredAppliedJob!: any;
  totalAppliedJobs: number = 0;
  pageSize: number = 10;
  tabs = [
    { label: 'All Jobs', active: true }
  ];

  constructor(private talentConnectService: TalentConnectService) { }


  ngOnInit(): void {
    this.getAppliedJobList();
  }

  onClickJobCard(id: number) {
    this.emitId.emit(id);
  }

  selectTab(tab: any) {
    this.tabs.forEach(t => (t.active = false));
    this.tabs[tab].active = true;
    if (this.tabs[tab].label !== 'All Jobs') {
      this.filteredAppliedJob = this.appliedJobList.filter((item: any) => item.hiringstage == this.tabs[tab].label);
    } else {
      this.filteredAppliedJob = this.appliedJobList;
    }
  }

  getAppliedJobList() {
    const data = {
      page: this.page,
      perPage: this.pageSize,
    }
    this.talentConnectService.getAppliedJobList(data).subscribe({
      next: response => {
        this.appliedJobList = response.jobs;
        this.filteredAppliedJob = response.jobs;
        this.totalAppliedJobs = response.totaljobs;
        this.tabs = [
          { label: 'All Jobs', active: true },
          ...response.hiringStages.map((item: any) => ({
            id: item.id,
            label: item.hiringstage,
            active: false
          }))
        ];
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
