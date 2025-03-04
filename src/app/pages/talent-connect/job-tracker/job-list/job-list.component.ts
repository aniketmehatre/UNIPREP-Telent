import { Component, ElementRef, Output, EventEmitter } from '@angular/core';
import {TabPanel, TabView} from "primeng/tabview";
import {NgClass} from "@angular/common";

@Component({
  selector: 'uni-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.scss'],
  standalone: true,
  imports: [
    TabView,
    TabPanel,
    NgClass

  ]
})
export class JobListComponent {
  @Output() emitId: EventEmitter<number> = new EventEmitter();
  activeIndex: number = 1;
  tabs = [
    { label: 'All Jobs', active: true },
    { label: 'Job Applied', active: false },
    { label: 'Application Received', active: false },
    { label: 'Shortlisted', active: false }
  ];

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
  
}
