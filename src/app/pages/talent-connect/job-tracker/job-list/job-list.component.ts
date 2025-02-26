import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'uni-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.scss']
})
export class JobListComponent {
  @ViewChild('tabContainer', { static: false }) tabContainer!: ElementRef;

  tabs = [
    { label: 'All Jobs', active: true },
    { label: 'Job Applied', active: false },
    { label: 'Application Received', active: false },
    { label: 'Shortlisted', active: false }
  ];

  showLeftArrow = false;
  showRightArrow = true;

  ngAfterViewInit() {
    this.checkScroll();
  }

  scrollTabs(direction: 'left' | 'right') {
    const container = this.tabContainer.nativeElement;
    const scrollAmount = 150; // Adjust scroll speed

    if (direction === 'left') {
      container.scrollLeft -= scrollAmount;
    } else {
      container.scrollLeft += scrollAmount;
    }

    setTimeout(() => this.checkScroll(), 300);
  }

  checkScroll() {
    const container = this.tabContainer.nativeElement;
    this.showLeftArrow = container.scrollLeft > 0;
    this.showRightArrow = container.scrollLeft + container.clientWidth < container.scrollWidth;
  }

  selectTab(tab: any) {
    this.tabs.forEach(t => (t.active = false));
    tab.active = true;
  }
  
}
