import { Component } from '@angular/core';

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
  styleUrls: ['./job-tracker.component.scss']
})
export class JobTrackerComponent {
  displayModal: boolean = false;

  industryTypes: DropdownOption[] = [];
  companySizes: DropdownOption[] = [];
  locations: DropdownOption[] = [];
  globalPresence: DropdownOption[] = [];
  foundedYears: DropdownOption[] = [];
  companyTypes: DropdownOption[] = [];

  constructor() { }

  ngOnInit() {
    // Populate dropdown options
    this.industryTypes = [
      { label: 'Technology', value: 'tech' },
      { label: 'Healthcare', value: 'healthcare' },
      { label: 'Finance', value: 'finance' },
      { label: 'Manufacturing', value: 'manufacturing' },
      { label: 'Retail', value: 'retail' }
    ];

    this.companySizes = [
      { label: 'Small (1-50)', value: 'small' },
      { label: 'Medium (51-250)', value: 'medium' },
      { label: 'Large (251-1000)', value: 'large' },
      { label: 'Enterprise (1000+)', value: 'enterprise' }
    ];

    this.locations = [
      { label: 'North America', value: 'na' },
      { label: 'Europe', value: 'eu' },
      { label: 'Asia Pacific', value: 'apac' },
      { label: 'Latin America', value: 'latam' },
      { label: 'Middle East & Africa', value: 'mea' }
    ];

    this.globalPresence = [
      { label: 'Global', value: 'global' },
      { label: 'Regional', value: 'regional' },
      { label: 'Local', value: 'local' }
    ];

    this.foundedYears = this.generateYears();

    this.companyTypes = [
      { label: 'Public', value: 'public' },
      { label: 'Private', value: 'private' },
      { label: 'Non-profit', value: 'nonprofit' },
      { label: 'Government', value: 'government' }
    ];
  }

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

  toggleInfo(): void {
    this.showInfo = !this.showInfo;
  }

  onClickJobId(event: number) {
    this.showInfo = true;
    this.selectedJobId = event;
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
}
