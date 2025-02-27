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

  openVideoPopup(link: string) {

  }
 
  totalJobs: number = 100; // As shown in the UI
  
  // Job list filtering
  activeTab: string = 'All Jobs';
  tabs = ['All Jobs', 'Job Applied', 'Application Received', 'Shortlisted'];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  
  // Progress steps
  steps = [
    { label: 'Initial Round' },
    { label: 'HR Round' },
    { label: 'Selected' }
  ];
  
  // UI states
  showInfo: boolean = true;
  
  // Chat data
  messages: ChatMessage[] = [];
  newMessage: string = '';

  constructor() { }

  ngOnInit(): void {
    // Initialize mock data
    this.initChatData();
  
  }
  


  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'Job Applied': return 'bg-primary text-white';
      case 'Application Received': return 'bg-warning text-dark';
      case 'Shortlisted': return 'bg-success text-white';
      case 'Position Closed': return 'bg-danger text-white';
      default: return 'bg-secondary text-white';
    }
  }
  
  // Job detail methods

  
  toggleInfo(): void {
    this.showInfo = !this.showInfo;
  }
  
  // Chat methods
  initChatData(): void {
    this.messages = [
      {
        id: 1,
        sender: '@johndoe',
        message: 'We can meet at my House near st.89 🏠',
        time: '12:00',
        isUser: true
      },
      {
        id: 2,
        sender: '@uniabroad',
        senderAvatar: 'assets/recruiter-avatar.jpg',
        message: 'Where do you want to meet guys? ✨',
        time: '12:00',
        isUser: false
      },
      {
        id: 3,
        sender: '@johndoe',
        message: 'We can meet at my House near st.89 🏠',
        time: '12:00',
        isUser: true
      },
      {
        id: 4,
        sender: '@johndoe',
        message: 'We can meet at my House near st.89 🏠',
        time: '12:00',
        isUser: true
      }
    ];
  }
  
  sendMessage(): void {
    if (!this.newMessage.trim()) return;
    
    const newMessage: ChatMessage = {
      id: this.messages.length + 1,
      sender: '@johndoe',
      message: this.newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isUser: true
    };
    
    this.messages.push(newMessage);
    this.newMessage = '';
    
    // Scroll to bottom of chat
    setTimeout(() => {
      const chatContainer = document.querySelector('.chat-messages');
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }, 100);
  }
}
