import { Component, ElementRef, HostListener, OnInit, ViewChild } from "@angular/core";
import { ChathistoryService } from "./chat.service";
import { AuthService } from "src/app/Auth/auth.service";
import { ConfirmationService, MessageService } from "primeng/api";
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { PageFacadeService } from "../page-facade.service";
import { Router } from "@angular/router";
import screenfull from "screenfull";
import { Location } from "@angular/common";
import { environment } from "@env/environment";
import { CommonModule } from "@angular/common";
import { DialogModule } from "primeng/dialog";

import { PopoverModule } from 'primeng/popover';
import { ConfirmPopupModule } from "primeng/confirmpopup";
import { ButtonModule } from "primeng/button";
import { SelectModule } from "primeng/select";
import { StorageService } from "../../storage.service";
@Component({
  selector: "uni-chat",
  templateUrl: "./chat.component.html",
  styleUrls: ["./chat.component.scss"],
  standalone: true,
  imports: [CommonModule, DialogModule, FormsModule, ReactiveFormsModule, PopoverModule, ConfirmPopupModule, ButtonModule, SelectModule],
  providers: [ConfirmationService],
})
export class ChatComponent implements OnInit {
  @HostListener("fullscreenchange", ["$event"])
  fullscreenchange(event: any) {
    if (!screenfull.isFullscreen) {
      this.fullscreen = "";
    }
  }
  @ViewChild("fullscreeneditor") editorelement: ElementRef | any;
  fullscreen = "";
  modules = {};
  reportForm: FormGroup;
  messages: any = [];
  reportOptions: any = [];
  planstatus = "";
  planmessage = "";
  canChat = true;
  subscriptioninfo: any;
  planExpired: boolean = false;
  restrict: boolean = false;
  subtext: string = "";
  constructor(private service: ChathistoryService, private authService: AuthService, private toast: MessageService,
    private fb: FormBuilder, private pageService: PageFacadeService, private confirmationService: ConfirmationService,
    private route: Router, private location: Location, private storage: StorageService) {
    this.reportForm = fb.group({
      reportOption: ["", Validators.required],
      comment: ["", Validators.required],
    });
    this.authService.getNewUserTimeLeft().subscribe((res) => {
      let data = res.time_left;
      this.subscriptioninfo = res;
      let subscription_exists_status = res.subscription_details;
      if (subscription_exists_status.subscription_plan == "free_trail") {
        this.planmessage = "Please subscribe and send the message";
        this.planstatus == "freetrail";
        this.canChat = false;
      } else if (subscription_exists_status.subscription_plan != "free_trail") {
        this.planstatus == "expired";
        this.planmessage = "Your question credits are exhausted! Additional credits will be available at 12:00 AM tommorow.";
        this.canChat = false;
      }
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
          emoji: function () { },
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

  // Helper methods for encryption/decryption
  private async getKey(salt: string): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(salt),
      { name: 'PBKDF2' },
      false,
      ['deriveBits', 'deriveKey']
    );

    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: encoder.encode('salt'),
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }

  private async decryptData(encryptedData: string): Promise<any> {
    try {
      const key = await this.getKey(environment.secretKeySalt);
      const encryptedArray = new Uint8Array(
        atob(encryptedData).split('').map(char => char.charCodeAt(0))
      );

      // Extract IV and encrypted data
      const iv = encryptedArray.slice(0, 12);
      const data = encryptedArray.slice(12);

      const decrypted = await crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: iv
        },
        key,
        data
      );

      const decryptedStr = new TextDecoder().decode(decrypted);
      return JSON.parse(decryptedStr);
    } catch (error) {
      console.error('Error decrypting data:', error);
      return null;
    }
  }

  async ngOnInit(): Promise<void> {
    this.getChatHistoryByUserId();
    this.getOptions();
    const encryptedData = this.storage.get("Name");
    if (encryptedData) {
      try {
        this.username = await this.decryptData(encryptedData);
      } catch (error) {
        console.error('Error decrypting username:', error);
        this.username = '';
      }
    }

    this.checkplanExpire();
  }
  checkplanExpire(): void {
    if (this.authService._userSubscrition.time_left.plan === "expired" ||
      this.authService._userSubscrition.time_left.plan === "subscription_expired") {
      this.planExpired = true;
      this.subtext = "Welcome to UNIPREP. You have 1 free question credit. Your personalised questions will be answered by the experts. Each message will be considered as 1 credit.";
    }
    else {
      this.planExpired = false;
      this.subtext = "Welcome to UNIPREP.You have 2 question credits.Your personalised questions will be answered by the experts.Each message will be considered as 1 credit.";
    }
    if (this.authService._userSubscrition.subscription_details.subscription_plan == "free_trail") {
      this.subtext = "Welcome to UNIPREP. You have 1 free question credit. Your personalised questions will be answered by the experts. Each message will be considered as 1 credit.";
    }
  }

  getOptions() {
    this.service.getReportoption().subscribe((response) => {
      this.reportOptions = [];
      this.reportOptions = [{ id: null, reportoption_name: "Select" }, ...response.reportOptions];
    });
  }
  previouspage() {
    window.history.back();
  }
  totalquestionsanswered = 0;
  totalquestionsasked = 0;
  questionsleft = 0;
  totalcredits = 0;
  btnsendmessage = 3;
  async getChatHistoryByUserId() {
    this.service.getChatHistoryByUser().subscribe((response) => {
      this.messages = response.messages;
      this.totalquestionsasked = response?.totalquestionsasked;
      this.totalquestionsanswered = response?.totalquestionsanswered;
      this.questionsleft = response?.questionsleft;
    });

    this.authService.getMe().subscribe(async (response) => {
      const encryptedData = this.storage.get("questions_left");
      if (encryptedData) {
        try {
          this.totalcredits = await this.decryptData(encryptedData);
        } catch (error) {
          console.error('Error decrypting credits:', error);
          this.totalcredits = 0;
        }
      }

      if (this.totalcredits == 0) {
        this.btnsendmessage = 2;
      } else if (this.totalcredits > 0) {
        this.btnsendmessage = 1;
      } else {
        this.btnsendmessage = 3;
      }

      if (this.subscriptioninfo.time_left.plan === "expired" || this.subscriptioninfo.time_left.plan === "subscription_expired") {
        if (this.subscriptioninfo.subscription_details.subscription_plan === "free_trail") {
          this.btnsendmessage = 2;
        } else {
          this.btnsendmessage = 2;
        }
      }
    });
  }
  textMessage: string = "";
  visibility = false;
  textareavisbility = false;
  sendMessage() {
    if (this.totalcredits == 0) {
      this.textareavisbility = false;
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
      country: this.storage.get("countryId"),
    };
    this.service.sendChatMessage(data).subscribe(
      (response) => {
        // this.toast.add({
        //   severity: "success",
        //   summary: "success",
        //   detail: "Message sent successfully",
        // });
        this.visibility = true;
        this.textMessage = "";
        this.textareavisbility = false;
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
      message: "You will be using one of the chat credit to send this message. Do you confirm?",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.sendMessage();
      },
      reject: () => { },
    });
  }
  showReportSuccess = false;
  reportSubmit(op: any) {
    if (this.reportForm.invalid) return;
    this.service.Reportchat(this.reportForm?.value).subscribe(
      (response) => {
        this.showReportSuccess = true;
        this.reportForm.reset();
        op.hide();
      },
      (error) => { }
    );
  }
  getData(questionNumber: any): string {
    return this.messages?.find((data: { questionNumber: any }) => data.questionNumber == questionNumber).message;
  }

  creditspopupVisibility = false;
  openAttachment(url: any) {
    window.open(url);
  }
  canChangeChat() {
    if (this.planExpired) {
      this.authService.hasUserSubscription$.next(true);
      return;
    }
    this.textareavisbility = !this.textareavisbility;
  }

  goBack() {
    this.location.back();
  }
}
