import { Component, OnInit } from "@angular/core";
import { ChathistoryService } from "./chat.service";
import { AuthService } from "src/app/Auth/auth.service";
import { ConfirmationService, MessageService } from "primeng/api";
import { FormBuilder, FormGroup } from "@angular/forms";
import { PageFacadeService } from "../page-facade.service";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { Router } from "@angular/router";
@Component({
  selector: "uni-chat",
  templateUrl: "./chat.component.html",
  styleUrls: ["./chat.component.scss"],
  providers: [ConfirmationService],
})
export class ChatComponent implements OnInit {
  filterForm: FormGroup;
  messages: any = [];
  reportOptions=[];
  constructor(
    private service: ChathistoryService,
    private authService: AuthService,
    private toast: MessageService,
    private fb: FormBuilder,
    private pageService: PageFacadeService,
    private confirmationService: ConfirmationService,
    private route:Router
  ) {
    this.filterForm = fb.group({
      reportOption: [""],
      comment: [""],
    });
  }
  username: string = "";
  ngOnInit(): void {
    if (localStorage.getItem("guidlineAccepted")) {
      if (Number(localStorage.getItem("guidlineAccepted")) == 0) {
        this.route.navigate(['/pages/guideline']);
      }
    }
    this.getChatHistoryByUserId();
    this.getOptions();
    this.username = localStorage.getItem("Name") || "";
  }
  getOptions() {
    this.service.getReportoption().subscribe((response) => {
      this.reportOptions = [];
      this.reportOptions = response.reportOptions;
    });
  }
  previouspage() {
    window.history.back();
  }
  totalquestionsanswered = 0;
  totalquestionsasked = 0;
  questionsleft = 0;
  totalcredits = 0;
  getChatHistoryByUserId() {
    this.service.getChatHistoryByUser().subscribe((response) => {
      this.messages = response.messages;
      this.totalquestionsasked = response?.totalquestionsasked;
      this.totalquestionsanswered = response?.totalquestionsanswered;
      this.questionsleft = response?.questionsleft;
      this.totalcredits = Number(localStorage.getItem("questions_left"));
    });
  }
  textMessage: string = "";
  visibility = false;
  sendMessage() {
    if (this.textMessage == null || this.textMessage == "") {
      this.toast.add({
        severity: "warn",
        summary: "Warn",
        detail: "Not allowed to send empty message",
      });
      return;
    }
    let data = {
      message: this.textMessage,
      country: 2,
    };
    this.service.sendChatMessage(data).subscribe(
      (response) => {
        this.toast.add({
          severity: "success",
          summary: "success",
          detail: "Message sent successfully",
        });
        this.visibility = true;
        this.textMessage = "";
        this.getChatHistoryByUserId();
      },
      (error) => {
        this.toast.add({
          severity: "warn",
          summary: "Warn",
          detail: error?.message,
        });
      }
    );
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

  filtersubmit() {
    if (this.filterForm.invalid) return;
    this.service.Reportchat(this.filterForm?.value).subscribe(
      (response) => {
        this.toast.add({
          severity: "success",
          summary: "success",
          detail: "Reported successfully",
        });
        this.filterForm.reset();
      },
      (error) => {
       
      }
    );
  }
  getmessage(){
    this.visibility = !this.visibility;
    this.ngOnInit();
  }
}
