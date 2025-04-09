import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Avatar } from "primeng/avatar";
import { ButtonDirective } from "primeng/button";
import { CommonModule, NgClass, NgForOf, NgIf } from "@angular/common";
import { ProgressBar, ProgressBarModule } from "primeng/progressbar";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TalentConnectService } from "../../talent-connect.service";
import { Company, CompanyMessage } from 'src/app/@Models/company-connect.model';
import { environment } from '@env/environment';
interface ChatMessage {
  sender: string;
  content: string;
  timestamp: string;
  avatar?: string;
  isCurrentUser: boolean;
}
@Component({
  selector: 'uni-chat',
  imports: [
    Avatar,
    ButtonDirective,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    FormsModule,
    NgClass,
    CommonModule,
    ProgressBarModule
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit {
  @Input() companyDetails!: Company;
  @Input() id!: any;

  organizationName: string = 'UNIABROAD';
  organizationStatus: string = 'Active';
  @Output() openInfo: EventEmitter<boolean> = new EventEmitter<boolean>(true);
  @Output() closeChat: EventEmitter<boolean> = new EventEmitter<boolean>(true);
  @Input() showInfo: boolean = true;
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
    this.getChatMessageForCompanyConnect(this.id);
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
            chat: message ?? '',
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

  uploadFilesChat(event: any) {
    this.attachmentFile = event.target.files[0];
  }

}
