import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { AvatarModule } from "primeng/avatar";
import { ButtonModule } from "primeng/button";
import { CommonModule } from "@angular/common";
import { ProgressBar, ProgressBarModule } from "primeng/progressbar";
import { FormsModule } from "@angular/forms";
import { TalentConnectService } from "../../talent-connect.service";
import { Company, CompanyMessage } from 'src/app/@Models/company-connect.model';
import { environment } from '@env/environment';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { CourseListService } from 'src/app/pages/course-list/course-list.service';
import { AuthService } from 'src/app/Auth/auth.service';
declare global {
  interface Window {
    Pusher: any;
  }
}
@Component({
  selector: 'uni-chat',
  imports: [
    ButtonModule,
    ProgressBar,
    AvatarModule,
    FormsModule,
    CommonModule,
    ProgressBarModule
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit, OnChanges {
  @Input() companyDetails!: Company;
  @Output() openInfo: EventEmitter<boolean> = new EventEmitter<boolean>(true);
  @Output() closeChat: EventEmitter<boolean> = new EventEmitter<boolean>(true);
  @Input() showInfo: boolean = true;
  isLoadingAiSummary: boolean = false;
  organizationName: string = 'UNIABROAD';
  organizationStatus: string = 'Active';
  currentStage: number = 2;
  stages: Array<{ number: number, name: string, completed: boolean }> = [
    { number: 1, name: 'Initial Round', completed: true },
    { number: 2, name: 'HR Round', completed: false },
    { number: 3, name: 'Selected', completed: false }
  ];
  message: string = '';
  messages: CompanyMessage[] = [];
  userLogo: string = '';
  attachmentFile: File | null = null;
  aiGenerateChatDetails: any;
  private echo!: Echo<any>;
  studentId: any
 @Output() visible = new EventEmitter<void>();
  private observer!: IntersectionObserver;
  constructor(private talentConnectService: TalentConnectService, private courcelist: AuthService) { }

  ngOnInit(): void {

    this.courcelist.getMe().subscribe((res: any) => {
      this.studentId = res.employee_user_id
      window.Pusher = Pusher;
      this.echo = new Echo({
        broadcaster: 'pusher',
        key: '5b1022406406fbdcc0f9',
        cluster: 'ap2',
        forceTLS: true,
      });
      this.echo.channel(`company-connect-employer-chat-${this.studentId}`)
        .listen('CompanyConnectMessageSentEmployer', (event: any) => {
          console.log('Received broadcast:', event);
          if (event) {
            const hasMatchingStudentId = this.studentId === event.tc_student_id;
            if (hasMatchingStudentId) {
              this.messages.push({
                added_by: event.added_by,
                chat: event.chat,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                attachment_url: event.attachment ? event.attachment : "",
                attachment: event.attachment ? event.attachment.name : '',
                icon: event.icon
              });
              this.attachmentFile = null;
            }
          }
        });
    })

  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes['companyDetails']);

    if (changes['companyDetails'] && this.companyDetails) {
      this.getChatMessageForCompanyConnect(this.companyDetails.id);
    }
  }


  getChatMessageForCompanyConnect(id: any) {
    this.talentConnectService.getChatMessageForCompanyConnect(id).subscribe({
      next: data => {
        this.messages = data.message;
        if (this.messages.length > 0) {
          this.userLogo = this.messages[0].icon;
        }
        this.aiGenerateChatDetails = {
          job_id: this.companyDetails?.id,
          companyName: this.companyDetails?.company_name,
          studentName: data?.message[0]?.userName,
          createdAt: data.created_at
        };
        console.log(this.aiGenerateChatDetails);
      },
      error: err => {

      }
    })
  }

  sendMessage(message: string): void {
    if (!message.trim() && !this.attachmentFile) return;
    let req: any = {
      company_id: this.companyDetails.id,
      chat: message,
    }
    if (this.attachmentFile) {
      req.attachment = this.attachmentFile;
    }
    this.talentConnectService.sendCompanyConnectUserMessage(req).subscribe({
      next: response => {
        // this.getChatMessageForCompanyConnect(this.companyDetails.id);

        // If there's a response message from the server, add it
        if (response.message) {
          this.messages.push({
            added_by: 'Student',
            chat: this.linkedFy(message) ?? '',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            attachment_url: this.attachmentFile ? `https://${environment.domain}/uniprepapi/storage/app/public/CompanyConnectAttachment/${this.attachmentFile.name}` : '',
            attachment: this.attachmentFile ? this.attachmentFile.name : '',
            icon: this.userLogo
          });
        }
        this.attachmentFile = null;
      },
      error: error => {
        console.log('Error sending message:', error);
      }
    });
  }

  autoGrow(element: HTMLTextAreaElement): void {
    element.style.height = 'auto';
    element.style.height = (element.scrollHeight) + 'px';
  }

  aiGenerateSummary(mode: string, content: Record<string, any>, element: HTMLTextAreaElement) {
    this.isLoadingAiSummary = true;
    this.talentConnectService.getCompanyConnectAiSummary({ mode: mode, ...content }).subscribe({
      next: (response) => {
        this.isLoadingAiSummary = false;
        if (response) {
          element.innerHTML = response?.response;
          this.autoGrow(element);
        }
      },
      error: (error) => {
        this.isLoadingAiSummary = false;
        console.error(error)
      },
    })

  }

  uploadFilesChat(event: any) {
    this.attachmentFile = event.target.files[0];
  }

  linkedFy(text: string) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, function (url) {
      return '<a href="' + url + '" target="_blank" class="chat-link">' + url + '</a>';
    });
  }
}
