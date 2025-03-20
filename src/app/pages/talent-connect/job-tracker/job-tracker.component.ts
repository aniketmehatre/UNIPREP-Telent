import { Component } from '@angular/core';
import { Dialog } from 'primeng/dialog';
import { Select } from 'primeng/select';
import { JobListComponent } from './job-list/job-list.component';
import { CommonModule } from '@angular/common';
import { TalentConnectService } from '../talent-connect.service';
import { Job } from '../easy-apply/job-view/job-view.component';
import { RouterModule } from '@angular/router';
import { JobDetailsComponent } from './job-details/job-details.component';
import { JobChatUiComponent } from './job-chat-ui/job-chat-ui.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputNumberModule } from 'primeng/inputnumber';
interface DropdownOption {
  label: string;
  value: string;
}
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
  styleUrls: ['./job-tracker.component.scss'],
  standalone: true,
  imports: [Select, Dialog, JobListComponent, JobDetailsComponent, JobChatUiComponent, InputNumberModule, MultiSelectModule, CommonModule, RouterModule]
})
export class JobTrackerComponent {
  displayModal: boolean = false;
  orgnamewhitlabel: any
  industries: any[] = [];
  locations: any[] = [];
  workModes: any[] = [];
  employmentTypes: any[] = [];
  experienceLevels: any[] = [];

  constructor(private talentConnectService: TalentConnectService) { }

  ngOnInit() { }

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
  jobDetails: Job;

  toggleInfo(): void {
    this.showInfo = !this.showInfo;
  }

  onClickJobId(event: number) {
    this.showInfo = true;
    this.selectedJobId = event;
    this.getJobTrackDetails(this.selectedJobId);
  }

  getJobTrackDetails(id: number) {
    this.talentConnectService.getJobTrackerDetail(id).subscribe({
      next: response => {
        this.jobDetails = response.job[0];
        this.showInfo = true;
      },
      error: error => {
        console.log(error);
      }
    });
  }


  private generateYears(): DropdownOption[] {
    const currentYear = new Date().getFullYear();
    const years: DropdownOption[] = [];

    for (let i = currentYear; i >= 1900; i--) {
      years.push({ label: i.toString(), value: i.toString() });
    }

    return years;
  }

  showFilterModal() {
    this.displayModal = true;
  }

  applyFilter() {
    console.log('Applying filters');
    this.displayModal = false;
  }

  resetFilter() {
    console.log('Resetting filters');
  }

  upgradePlan(){

  }
}
