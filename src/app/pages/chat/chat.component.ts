import { Component, OnInit } from "@angular/core";
import { ChathistoryService } from "./chat.service";
import { AuthService } from "src/app/Auth/auth.service";
import { ConfirmationService, MessageService } from "primeng/api";
import { FormBuilder } from "@angular/forms";
import { PageFacadeService } from "../page-facade.service";

@Component({
  selector: "uni-chat",
  templateUrl: "./chat.component.html",
  styleUrls: ["./chat.component.scss"],
  providers: [ConfirmationService],
})
export class ChatComponent implements OnInit {
  messages: any = [];
  constructor(
    private service: ChathistoryService,
    private authService: AuthService,
    private toast: MessageService,
    private fb: FormBuilder,
    private pageService: PageFacadeService,
    private confirmationService: ConfirmationService
  ) {}
  username: string = "";
  ngOnInit(): void {
    this.getChatHistoryByUserId(Number(localStorage.getItem("UserID")));
    this.username = localStorage.getItem("Name") || "";
  }
  totalquestionsanswered = 0;
  totalquestionsasked = 0;
  questionsleft = 0;
  getChatHistoryByUserId(id: number) {
    this.service
      .getChatHistoryByUser({ chatuserid: id })
      .subscribe((response) => {
        console.log(response)
        this.messages = response.messages;
        this.totalquestionsasked = response?.totalquestionsasked;
        this.totalquestionsanswered = response?.totalquestionsanswered;
        this.questionsleft = response?.questionsleft;
      });
  }
  textMessage: string = "";
  sendMessage() {
    if(this.textMessage==null || this.textMessage==""){
        this.toast.add({severity: 'warn', summary: 'Warn', detail: "Not allowed to send empty message"});
    return;
    }
    let data = {
      message: this.textMessage,
      country: "1",
      module: "1",
    };
    this.service.sendChatMessage(data).subscribe((response) => {
      this.textMessage = "";
      this.getChatHistoryByUserId(Number(localStorage.getItem("UserID")));
    });
  }
  confirm(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message:
        "You will be using one of the chat credit to send this message. Do you confirm?",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.sendMessage();
      },
      reject: () => {},
    });
  }
}
