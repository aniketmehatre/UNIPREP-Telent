import { Component } from '@angular/core';



interface ChatMessage {
  id: number;
  sender: string;
  senderAvatar?: string;
  message: string;
  time: string;
  isUser: boolean;
}

@Component({
  selector: 'uni-job-tracker',
  templateUrl: './job-tracker.component.html',
  styleUrls: ['./job-tracker.component.scss']
})
export class JobTrackerComponent {
  isSkeletonVisible: boolean = false;
  ehitlabelIsShow: boolean = false;
  restrict: boolean = false;
  howItWorksVideoLink: string = '';
  selectedJobId: number | null = null;
  openVideoPopup(link: string) {

  }

  totalJobs: number = 100; // As shown in the UI

  activeTab: string = 'All Jobs';
  tabs = ['All Jobs', 'Job Applied', 'Application Received', 'Shortlisted'];
  currentPage: number = 1;
  itemsPerPage: number = 10;

  steps = [
    { label: 'Initial Round' },
    { label: 'HR Round' },
    { label: 'Selected' }
  ];

  showInfo: boolean = true;
  messages: ChatMessage[] = [];
  newMessage: string = '';

  constructor() { }

  ngOnInit(): void {  
  }

  toggleInfo(): void {
    this.showInfo = !this.showInfo;
  }

  onClickJobId(event: number) {
    this.showInfo = true;
    this.selectedJobId = event;
  }
}
