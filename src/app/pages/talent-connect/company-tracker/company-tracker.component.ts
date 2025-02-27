import { Component } from '@angular/core';

@Component({
  selector: 'uni-company-tracker',
  templateUrl: './company-tracker.component.html',
  styleUrls: ['./company-tracker.component.scss']
})
export class CompanyTrackerComponent {
  isSkeletonVisible: boolean = false;
  ehitlabelIsShow: boolean = false;
  restrict: boolean = false;
  howItWorksVideoLink: string = '';
  selectedJobId: number | null = null;
  openVideoPopup(link: string) {

  }

  currentPage: number = 1;
  itemsPerPage: number = 10;

  steps = [
    { label: 'Initial Round' },
    { label: 'HR Round' },
    { label: 'Selected' }
  ];

  showChat: boolean = false;

  constructor() { }

  ngOnInit(): void {  
  }

  toggleInfo(): void {
    this.showChat = !this.showChat;
  }

  onClickJobId(event: number) {
    this.showChat = false;
    this.selectedJobId = event;
  }
}
