import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import {FormsModule} from "@angular/forms";
import { Avatar, AvatarModule } from "primeng/avatar";
import { CommonModule, NgClass } from "@angular/common";
import {ProgressBar} from "primeng/progressbar";
import { Chip, ChipModule } from 'primeng/chip';
import { Button, ButtonModule } from 'primeng/button';
import { TalentConnectService } from '../../talent-connect.service';
import { Job } from '../../easy-apply/job-view/job-view.component';

interface ChatMessage {
  sender: boolean; // Changed from isSender to sender for clarity
  content: string;
  time: string;
  markAsRead?: boolean;
  profile_image?: string;
  type: 'text' | 'file' | 'button';
  attachment_url?: string | null;
}

@Component({
  selector: 'uni-job-chat-ui',
  templateUrl: './job-chat-ui.component.html',
  styleUrls: ['./job-chat-ui.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    AvatarModule,
    ProgressBar,
    CommonModule,
    ChipModule,
    ButtonModule
  ]
})
export class JobChatUiComponent implements OnChanges {
  organizationName: string = 'UNIABROAD';
  organizationStatus: string = 'Active';
  @Input() jobDetails!: Job;
  @Output() openInfo: EventEmitter<boolean> = new EventEmitter<boolean>(true);
  @Output() closeChat: EventEmitter<boolean> = new EventEmitter<boolean>(true);
  @Input() showInfo: boolean = true;
  currentStage: number = 2;
  id: number = NaN;
  stages: Array<{number: number, name: string, completed: boolean}> = [
    { number: 1, name: 'Initial Round', completed: true },
    { number: 2, name: 'HR Round', completed: false },
    { number: 3, name: 'Selected', completed: false }
  ];
  
  messages: ChatMessage[] = [];
  newMessage: string = '';
  currentUser: string = '@uniabroad';
  attachmentFile: any;

  constructor(private talentConnectService: TalentConnectService) { }
  
  ngOnInit(): void {
    this.loadSampleMessages();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.getMessages(this.jobDetails.id);
  }

  loadSampleMessages(): void {
    this.messages = [];
  }

  getMessages(job_id: number) {
    this.talentConnectService.getMessage({ job_id: job_id }).subscribe({
      next: response => {
        if (Array.isArray(response?.messages)) {
          // Handle array response
          this.messages = response?.messages.map((item: any) => {
            return {
              sender: item.employer == 0 ? false : true,
              content: item.chat,
              markAsRead: item?.markasread == 0 ? false : true,
              time: new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              type: item.attachment ? 'file' : 'text'
            };
          });
        } else {
          // Handle object response
          console.log('Message response:', response);
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

  sendMessage(message: string): void {
    if (!message.trim()) return;
    const formData = new FormData();
    if (this.attachmentFile) {
      formData.append('attachment', this.attachmentFile)
    }
    formData.append('chat', message);
    formData.append('job_id', this.jobDetails.id.toString());
    this.talentConnectService.sendMessage(formData).subscribe({
      next: response => {
        console.log('Message sent:', response);
        // If there's a response message from the server, add it
        if (response.message) {
          this.messages.push({
            sender: true,
            content: message,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: this.attachmentFile ? 'text' : 'file',
            attachment_url: this.attachmentFile ? this.attachmentFile : null
          });
        }
        this.attachmentFile = null;
      },
      error: error => {
        console.log('Error sending message:', error);
      }
    });
  }
}
