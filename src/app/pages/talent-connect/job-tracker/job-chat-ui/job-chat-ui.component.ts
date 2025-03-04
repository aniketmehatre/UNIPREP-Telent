import { Component, EventEmitter, Input, Output } from '@angular/core';
import {FormsModule} from "@angular/forms";
import {Avatar} from "primeng/avatar";
import {NgClass} from "@angular/common";
import {ProgressBar} from "primeng/progressbar";

interface ChatMessage {
  sender: string;
  content: string;
  timestamp: string;
  avatar?: string;
  isCurrentUser: boolean;
}

@Component({
  selector: 'uni-job-chat-ui',
  templateUrl: './job-chat-ui.component.html',
  styleUrls: ['./job-chat-ui.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    Avatar,
    NgClass,
    ProgressBar
  ]
})
export class JobChatUiComponent {
  organizationName: string = 'UNIABROAD';
  organizationStatus: string = 'Active';
  @Output() openInfo: EventEmitter<boolean> = new EventEmitter<boolean>(true);
  @Output() closeChat: EventEmitter<boolean> = new EventEmitter<boolean>(true);
  @Input() showInfo: boolean = true;
  currentStage: number = 2;
  stages: Array<{number: number, name: string, completed: boolean}> = [
    { number: 1, name: 'Initial Round', completed: true },
    { number: 2, name: 'HR Round', completed: false },
    { number: 3, name: 'Selected', completed: false }
  ];
  
  messages: ChatMessage[] = [];
  newMessage: string = '';
  currentUser: string = '@uniabroad';
  
  constructor() { }
  
  ngOnInit(): void {
    this.loadSampleMessages();
  }
  
  loadSampleMessages(): void {
    this.messages = [
      {
        sender: '@johndoe',
        content: 'We can meet at my House near st.89 🏠',
        timestamp: '12:00',
        isCurrentUser: false
      },
      {
        sender: '@uniabroad',
        content: 'Where do you want to meet guys? 👀',
        timestamp: '12:00',
        isCurrentUser: true
      },
      {
        sender: '@johndoe',
        content: 'We can meet at my House near st.89 🏠',
        timestamp: '12:00',
        isCurrentUser: false
      },
      {
        sender: '@johndoe',
        content: 'We can meet at my House near st.89 🏠',
        timestamp: '12:00',
        isCurrentUser: false
      }
    ];
  }
  
  sendMessage(): void {
    if (this.newMessage.trim()) {
      const message: ChatMessage = {
        sender: this.currentUser,
        content: this.newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isCurrentUser: true
      };
      
      this.messages.push(message);
      this.newMessage = '';
    }
  }
}
