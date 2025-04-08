import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Avatar} from "primeng/avatar";
import {ButtonDirective} from "primeng/button";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {ProgressBar} from "primeng/progressbar";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TalentConnectService} from "../../talent-connect.service";
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
    ProgressBar,
    ReactiveFormsModule,
    FormsModule,
    NgClass
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit {
  @Input() companyDetails!: any;
  @Input() id!: any;

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

  messages: any[] = [];
  newMessage: string = '';
  attachmentFile: any;

  constructor(private talentConnectService: TalentConnectService,) { }

  ngOnInit(): void {
    console.log(this.companyDetails)
    //this.loadSampleMessages();
    this.getChatMessageForCompanyConnect(this.id);
  }


  getChatMessageForCompanyConnect(id: any){
    this.talentConnectService.getChatMessageForCompanyConnect(id).subscribe({
      next: data => {
        this.messages = data.message;
      },
      error: err => {

      }
    })
  }

  sendMessage(): void {
    console.log(this.companyDetails);
    if (this.newMessage.trim()) {
      let req = {
        company_id: this.companyDetails.id,
        chat: this.newMessage,
        attachment: this.selectedFile
      }
      this.talentConnectService.sendCompanyConnectUserMessage(req).subscribe({
        next: data => {
          console.log(data)
          this.getChatMessageForCompanyConnect(this.companyDetails.id)
        },
        error: err => {

        }
      })
      // const message: ChatMessage = {
      //   sender: this.currentUser,
      //   content: this.newMessage,
      //   timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      //   isCurrentUser: true
      // };
      //
      // this.messages.push(message);
      this.newMessage = '';
    }
  }

  selectedFile: File | null = null;
  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      console.log("Selected File:", this.selectedFile);
    }
  }

  uploadFilesChat($event: any) {
    this.attachmentFile = $event.target.files[0];
  }

  sendMessageNew(message: string): void {
    if (!message.trim() && !this.attachmentFile) return;
    const formData = new FormData();
    if (this.attachmentFile) {
      formData.append('attachment', this.attachmentFile)
    }
    formData.append('chat', message);
    formData.append('company_id', this.companyDetails.id.toString());
    this.talentConnectService.sendCompanyConnectUserMessage(formData).subscribe({
      next: response => {
        // If there's a response message from the server, add it
        if (response.message) {
          this.messages.push({
            // sender: true,
            // content: message,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: this.attachmentFile ? 'file' : 'text',
            attachment_url: this.attachmentFile ? this.attachmentFile : null,
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
}
