import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { AvatarModule } from "primeng/avatar";
import { CommonModule } from "@angular/common";
import { ChipModule } from 'primeng/chip';
import { ButtonModule } from 'primeng/button';
import { TalentConnectService } from '../../talent-connect.service';
import { Job } from '../../easy-apply/job-view/job-view.component';
import { RouterModule } from '@angular/router';
import { AuthService } from 'src/app/Auth/auth.service';
import { EmployeeConnectProfile } from 'src/app/@Models/employee-connect-profile';
import { MessageService } from 'primeng/api';

interface ChatMessage {
  sender: boolean; // Changed from isSender to sender for clarity
  content: string;
  time: string;
  markAsRead?: boolean;
  profile_image?: string;
  type: 'text' | 'file' | 'button';
  attachment_url?: string | null;
  attachment?: string | null;
}

interface AiGenerateChatDetails {
  job_id: number;
  companyName: string;
  positionName: string;
  studentName: string;
  createdAt: string;
}

@Component({
  selector: 'uni-job-chat-ui',
  templateUrl: './job-chat-ui.component.html',
  styleUrls: ['./job-chat-ui.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    AvatarModule,
    CommonModule,
    ChipModule,
    ButtonModule,
    RouterModule
  ]
})
export class JobChatUiComponent implements OnInit, OnChanges {
  organizationName: string = 'UNIABROAD';
  organizationStatus: string = 'Active';
  @Input() jobDetails!: Job;
  @Input() jobId!: number;
  @Output() openInfo: EventEmitter<boolean> = new EventEmitter<boolean>(true);
  @Output() closeChat: EventEmitter<boolean> = new EventEmitter<boolean>(true);
  @Input() showInfo: boolean = true;
  isLoadingAiSummary: boolean = false;
  currentStage: number = 2;
  id: number = NaN;
  stages: Array<{ number: number, name: string, completed: boolean }> = [
    { number: 1, name: 'Initial Round', completed: true },
    { number: 2, name: 'HR Round', completed: false },
    { number: 3, name: 'Selected', completed: false }
  ];

  messages: ChatMessage[] = [];
  newMessage: string = '';
  currentUser: string = '@uniabroad';
  attachmentFile: any;
  message: string = '';
  userActiveStatus: string = '';
  profileData: EmployeeConnectProfile | null = null;
  @Input() isJobApplied: boolean = true;

  //Inject Service
  private toast = inject(MessageService);
  constructor(private talentConnectService: TalentConnectService, private authService: AuthService) { }

  ngOnInit(): void {
    this.profileData = this.talentConnectService._employerProfileData;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.['jobId']) {
      this.message = '';
      this.messages = [];
      if (this.jobId) {
        this.getMessages(this.jobId);
      }
    }
  }

  getMessages(job_id: number) {
    this.talentConnectService.getMessage({ job_id: job_id }).subscribe({
      next: response => {
        this.userActiveStatus = response.employer_status;
        if (Array.isArray(response?.messages)) {
          this.messages = response?.messages.map((item: any) => {
            return {
              sender: item.employer == 0 ? false : true,
              content: item.chat,
              markAsRead: item?.markasread == 0 ? false : true,
              time: new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              type: item.attachment_url ? 'file' : 'text',
              attachment: item.attachment ?? null,
              attachment_url: item.attachment_url ?? null,
              company_logo: item.company_logo ?? null,
              profile_image: item.profile_image ?? null,
            };
          });
        }
      },
      error: error => {
        console.log(error);
      }
    });
  }

  uploadFilesChat($event: any) {
    this.attachmentFile = $event.target.files[0];
  }

  onEnterMsg(inputElement: HTMLTextAreaElement) {
    if (this.isJobApplied) {
      this.sendMessage(this.message);
    } else {
      this.applyJob(inputElement.value);
    }
    this.autoGrow(inputElement);
  }

  sendMessage(message: string): void {
    if (!message.trim() && !this.attachmentFile) return;
    const formData = new FormData();
    if (this.attachmentFile) {
      formData.append('attachment', this.attachmentFile)
    }
    formData.append('chat', message);
    formData.append('job_id', this.jobId.toString());
    this.talentConnectService.sendMessage(formData).subscribe({
      next: response => {
        // If there's a response message from the server, add it
        if (response.message) {
          this.messages.push({
            sender: true,
            content: message,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: this.attachmentFile ? 'file' : 'text',
            attachment_url: this.attachmentFile ? URL.createObjectURL(this.attachmentFile) : null,
            attachment: this.attachmentFile ? this.attachmentFile.name : null
          });
        }
        this.attachmentFile = null;
      },
      error: error => {
        console.log('Error sending message:', error);
      }
    });
  }

  applyJob(message: string) {
    if (!message.trim()) {
      this.toast.add({ severity: "error", summary: "Error", detail: 'Please enter a short message to continue' });
      return;
    }
    this.talentConnectService.applyJob(this.jobDetails?.id).subscribe({
      next: (response) => {
        this.jobId = response.id;
        this.isJobApplied = true;
        this.sendMessage(message);
      }
    });
  }

  autoGrow(element: HTMLTextAreaElement): void {
    element.style.height = 'auto';
    element.style.height = (element.scrollHeight) + 'px';
  }

  aiGenerateSummary(mode: string, content: Record<string, any>, element: HTMLTextAreaElement, type: string) {
    this.isLoadingAiSummary = true;
    this.talentConnectService.getJobAiSummary({ mode: mode, ...content, type: type, student_name: this.profileData?.full_name }).subscribe({
      next: (response) => {
        this.isLoadingAiSummary = false;
        if (response) {
          this.message = this.convertHtmlToPlainText(response?.response);
          setTimeout(() => {
            this.autoGrow(element);
          }, 100);
          this.authService.aiCreditCount$.next(true);
        }
      },
      error: (error) => {
        this.isLoadingAiSummary = false;
        console.error(error)
      },
    })

  }

  convertHtmlToPlainText(html: string): string {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    tempDiv.querySelectorAll('br').forEach(br => br.replaceWith('\n'));
    return tempDiv.textContent || '';
  }
}
