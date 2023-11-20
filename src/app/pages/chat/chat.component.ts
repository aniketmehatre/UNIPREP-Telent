import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { ChathistoryService } from "./chat.service";
import { AuthService } from "src/app/Auth/auth.service";
import { ConfirmationService, MessageService } from "primeng/api";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { PageFacadeService } from "../page-facade.service";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { Router } from "@angular/router";
import screenfull from "screenfull";
@Component({
  selector: "uni-chat",
  templateUrl: "./chat.component.html",
  styleUrls: ["./chat.component.scss"],
  providers: [ConfirmationService],
})
export class ChatComponent implements OnInit {
  @ViewChild("fullscreeneditor") editorelement: ElementRef | any;
  fullscreen = "";
  modules = {};
  reportForm: FormGroup;
  messages: any = [];
  reportOptions: any = [];
  constructor(
    private service: ChathistoryService,
    private authService: AuthService,
    private toast: MessageService,
    private fb: FormBuilder,
    private pageService: PageFacadeService,
    private confirmationService: ConfirmationService,
    private route: Router
  ) {
    this.reportForm = fb.group({
      reportOption: ["", Validators.required],
      comment: ["", Validators.required],
    });

    this.modules = {
      toolbar: {
        container: [
          // ['bold', 'italic', 'underline', 'strike'], // toggled buttons
          // ['blockquote', 'code-block'],

          // [{ header: 1 }, { header: 2 }], // custom button values
          // [{ list: 'ordered' }, { list: 'bullet' }],
          // [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
          // [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
          // [{ direction: 'rtl' }], // text direction
          // [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
          // [
          //     {
          //         size: [
          //             '8px',
          //             '10px',
          //             '12px',
          //             '14px',
          //             '16px',
          //             '18px',
          //             '20px',
          //             '22px',
          //             '24px',
          //             '32px',
          //             '64px',
          //             '72px',
          //         ],
          //     },
          // ],
          // [{ header: [1, 2, 3, 4, 5, 6, false] }],

          // [{ color: [] }, { background: [] }], // dropdown with defaults from theme
          // [
          //     {
          //         font: [
          //             'verdana',
          //             'sans-serif',
          //             'roboto',
          //             'cursive',
          //             'fantasy',
          //             'monospace',
          //         ],
          //     },
          // ],
          // [{ align: [] }],

          // ['clean'], // remove formatting button

          // ['link', 'image', 'video'], // link and image, video
          ["fullscreen"],
        ],
        handlers: {
          emoji: function () {},
          fullscreen: () => {
            if (screenfull.isEnabled) {
              this.fullscreen = this.fullscreen ? "" : "fullscreen";
              screenfull.toggle(this.editorelement.nativeElement);
            }
          },
        },
      },
    };
  }
  username: string = "";
  ngOnInit(): void {
    if (localStorage.getItem("guidlineAccepted")) {
      if (Number(localStorage.getItem("guidlineAccepted")) == 0) {
        this.route.navigate(["/pages/guideline"]);
      }
    }
    this.getChatHistoryByUserId();
    this.getOptions();
    this.username = localStorage.getItem("Name") || "";
  }
  getOptions() {
    this.service.getReportoption().subscribe((response) => {
      this.reportOptions = [];
      this.reportOptions = [
        { id: null, reportoption_name: "Select" },
        ...response.reportOptions,
      ];
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
    });
    this.authService.getMe().subscribe((response) => {
      this.totalcredits = Number(localStorage.getItem("questions_left"));
    });
  }
  textMessage: string = "";
  visibility = false;
  sendMessage() {
    if (this.totalcredits == 0) {
      this.creditspopupVisibility = true;
      return;
    }
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
      country: localStorage.getItem('selectedcountryId'),
    };
    console.log
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

  reportSubmit() {
    if (this.reportForm.invalid) return;
    this.service.Reportchat(this.reportForm?.value).subscribe(
      (response) => {
        this.toast.add({
          severity: "success",
          summary: "success",
          detail: "Reported successfully",
        });
        window.location.reload();
        this.reportForm.reset();
      },
      (error) => {}
    );
  }
  getData(questionNumber: any): string {
    return this.messages?.find(
      (data: { questionNumber: any }) => data.questionNumber == questionNumber
    ).message;
  }

  creditspopupVisibility = false;
}
