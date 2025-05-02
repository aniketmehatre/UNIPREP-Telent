import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { AvatarModule } from "primeng/avatar";
import { ButtonModule } from "primeng/button";
import { CommonModule } from "@angular/common";
import { ProgressBar, ProgressBarModule } from "primeng/progressbar";
import { FormsModule } from "@angular/forms";
import { TalentConnectService } from "../../talent-connect.service";
import { Company, CompanyMessage } from 'src/app/@Models/company-connect.model';
import { environment } from '@env/environment';
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
  @ViewChild('messageInput') messageInput: any;
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
  messages: CompanyMessage[] = [];
  userLogo: string = '';
  attachmentFile: File | null = null;

  constructor(private talentConnectService: TalentConnectService,) { }

  ngOnInit(): void {
    this.messageInput.value = '';
    this.messageInput.nativeElement.style.height = 'auto';
    this.getChatMessageForCompanyConnect(this.companyDetails.id);
  }

  ngOnChanges(changes: SimpleChanges): void {
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

  aiRePhraseSummary(content: Record<string, any>, element: HTMLTextAreaElement) {
    this.isLoadingAiSummary = true;
    this.talentConnectService.getCompanyChatAiSummary(content).subscribe({
      next: (response) => {
        this.isLoadingAiSummary = false;
        if (response) {
          element.innerHTML = response?.summary;
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
