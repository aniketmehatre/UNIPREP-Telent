import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import {ButtonDirective} from "primeng/button";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {ProgressBar} from "primeng/progressbar";
import {Job} from "../../easy-apply/job-view/job-view.component";
import {TalentConnectService} from "../../talent-connect.service";
import {Avatar} from "primeng/avatar";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'uni-chat',
    imports: [
        ButtonDirective,
        NgForOf,
        NgIf,
        ProgressBar,
        Avatar,
        FormsModule,
        NgClass
    ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit {
    @Input() companyDetails!: any;
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

    constructor(private talentConnectService: TalentConnectService,) { }

    ngOnInit(): void {
        this.getChatMessageForCompanyConnect(this.companyDetails.id);
    }


    getChatMessageForCompanyConnect(id: any){
        this.talentConnectService.getChatMessageForCompanyConnect(id).subscribe({
            next: data => {
                console.log(data);
                this.messages = data.message;
            },
            error: err => {

            }
        })
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
}
