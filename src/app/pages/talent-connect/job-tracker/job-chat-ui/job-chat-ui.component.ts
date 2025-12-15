import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { AvatarModule } from "primeng/avatar";
import { CommonModule } from "@angular/common";
import { ChipModule } from 'primeng/chip';
import { ButtonModule } from 'primeng/button';
import { TalentConnectService } from '../../talent-connect.service';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Auth/auth.service';
import { EmployeeConnectProfile } from 'src/app/@Models/employee-connect-profile';
import { MessageService } from 'primeng/api';
import { Job } from 'src/app/@Models/employee-connect-job.model';
import { DialogModule } from 'primeng/dialog';
import { environment } from '@env/environment';
import { PageFacadeService } from 'src/app/pages/page-facade.service';
import { LocalStorageService } from 'ngx-localstorage';

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

@Component({
  selector: 'uni-job-chat-ui',
  templateUrl: './job-chat-ui.component.html',
  styleUrls: ['./job-chat-ui.component.scss'],
  standalone: true,
  imports: [FormsModule, AvatarModule, CommonModule, ChipModule, ButtonModule, RouterModule, DialogModule]
})
export class JobChatUiComponent implements OnInit, OnChanges {
  @Input() jobDetails!: Job;
  @Input() jobId!: number;
  @Input() showInfo: boolean = true;
  @Input() isJobApplied: boolean = true;
  @Output() openInfo: EventEmitter<boolean> = new EventEmitter<boolean>(true);
  @Output() closeChat: EventEmitter<boolean> = new EventEmitter<boolean>(true);

  isLoadingAiSummary: boolean = false;
  messages: ChatMessage[] = [];
  attachmentFile: any;
  message: string = '';
  userActiveStatus: string = '';
  profileData: EmployeeConnectProfile | null = null;
  giftImage: string = `${environment.imagePath}tutorial-coverimage/premium-plan.webp`;
  whyPremium: boolean = false;
  applyBtnDisable: boolean = true;

  //Inject Service
  private toast = inject(MessageService);
  private pageFacade = inject(PageFacadeService);
  constructor(public talentConnectService: TalentConnectService, private authService: AuthService,
    private router: Router, private storage: LocalStorageService,private toastService: MessageService,) { }

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
     if (!this.talentConnectService._employerProfileData?.profile_completion_flag) {
      this.toast.add({ severity: "error", summary: "Error", detail: 'Please Complete Your Job Profile' });
      return;
    }
    console.log('jobDetails', this.getRemainingDays(this.jobDetails.due_date));
    this.storage.set('daysRemaining', this.getRemainingDays(this.jobDetails.due_date));
    //upgrade to premium and why premium popup trigger
    if (this.jobDetails.premium_users === 1) { // if the job is only premium users or all users.
      if (this.authService._user.current_plan_detail.account_status !== "Subscription Active") { // if the subscription is not exist
        // this.showPremimumPopup = true;
        this.router.navigate(['/pages/subscriptions']);
        this.talentConnectService.openModal();
        this.pageFacade.sendWhatsappMessage(this.jobDetails?.position, this.jobDetails?.company_name);
        return;
      }
    }
    if (!message.trim()) {
      this.toast.add({ severity: "error", summary: "Error", detail: 'Please enter a short message to continue' });
      return;
    }


    this.talentConnectService.applyJob(this.jobDetails?.id).subscribe({
      next: (response) => {
         if (response.success === true) {
        this.jobId = response.id;
        this.isJobApplied = true;
        this.sendMessage(message);
            this.toastService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Job applied successfully'
          });
          this.router.navigate(['/pages/talent-connect/easy-apply']);
        }
          else {
          this.toastService.add({
            severity: 'warn',
            summary: 'Already Applied',
            detail: response.message
          });
        }
      },
       error: () => {
        this.toastService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Something went wrong'
        });
      }
    });
  }
  getRemainingDays(dueDateStr?: string): number | null {
    if (!dueDateStr) {
      console.error("Due date string is missing!");
      return null; // or return 0 depending on your use case
    }

    // Split dd-MM-yyyy format
    const [day, month, year] = dueDateStr.split('-').map(Number);

    // If parsing failed
    if (!day || !month || !year) {
      console.error("Invalid date format. Expected dd-MM-yyyy, got:", dueDateStr);
      return null;
    }

    const dueDate = new Date(year, month - 1, day);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffTime = dueDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  autoGrow(element: HTMLTextAreaElement): void {
    // if (this.message.length === 0 || !this.talentConnectService._employerProfileData?.profile_completion_flag) {
    if (this.message.length === 0) {
      this.applyBtnDisable = true;
    } else {
      this.applyBtnDisable = false;
    }
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
    });

  }

  convertHtmlToPlainText(html: string): string {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    tempDiv.querySelectorAll('br').forEach(br => br.replaceWith('\n'));
    return tempDiv.textContent || '';
  }
}
