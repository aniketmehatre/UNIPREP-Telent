import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { ModalService } from "./modal.service";
import { ScrollToBottomDirective } from "./scroll-to-bottom.directive";
import { MessageService } from "primeng/api";
import { SubSink } from "subsink";
import { AuthService } from "../../Auth/auth.service";
import { interval } from "rxjs";
import { log } from "console";

@Component({
  selector: "app-modal",
  templateUrl: "./modal.component.html",
  styleUrls: ["./modal.component.scss"],
})
export class ModalComponent implements OnInit {
  @Output() closeModal: EventEmitter<any> = new EventEmitter<any>();
  @Output() togleSidebar = new EventEmitter();
  @ViewChild(ScrollToBottomDirective) scrollMe!: ScrollToBottomDirective;
  details: any[] = [];
  private subs = new SubSink();

  comment: string = "";
  title = "socketrv";
  content = "";
  received: any[] = [];
  sent: any[] = [];
  isModalVisible: any = "none";
  issueType: any[] = [];
  questionLeft = "";
  isReportChanged: boolean = false;
  visible: boolean = true;
  showReportSuccess: boolean = false;
  isShowFreeTrailStart: boolean = false;
  reportValueSelected: any;
  message: any;

  constructor(
    private modalService: ModalService,
    private toast: MessageService,
    private service: AuthService
  ) {
    // WebsocketService.messages.subscribe(msg => {
    //     this.received.push(msg);
    //     console.log("Response from websocket: " + msg);
    // });
    // this.issueType = [
    //     {label: 'Response delayed', name: 'Response delayed'},
    //     {label: 'Unsatisfactory answer', name: 'Unsatisfactory answer'},
    //     {label: 'Others', name: 'Others'},
    // ];
  }


  ngOnInit() {
    this.questionLeft = "0";
    //this.questionLeft =
    this.subs.sink = this.service.selectLogInData$().subscribe((data) => {
      if (data) {
        this.questionLeft = data.questions_left;
      }
    });
    this.init();
  }

  init() {
    this.getChatHistoryData();
    this.modalService.getChatReportOptions().subscribe(
      (res: any) => {
        if (res.status === 404) {
          return;
        }
        this.issueType = res.reportOptions;
      },
      (err) => {
        console.log("err", err);
      }
    );
  }

  getChatHistoryData() {
    this.modalService.getChatHistoryForTheUser().subscribe(
      (res: any) => {
        if (res.status === 404) {
          return;
        }
        console.log(res.message);
        this.details = res.messages;
      },
      (err) => {
        console.log("err", err);
      }
    );
  }

  sendMsg(msg: any) {
    // let message = {
    //     source: '',
    //     content: ''
    // };
    // message.source = 'localhost';
    // message.content = this.content;
    //
    // this.sent.push(msg);
    //this.WebsocketService.messages.next(message);
    let userInfo = this.service.user;
    const data = {
      message: msg.value,
      user_id: userInfo!.id,
    };
    this.modalService.sendChatMessage(data).subscribe(
      (res: any) => {
        if (res.status === 404) {
          return;
        }
        this.toast.add({
          severity: "info",
          summary: "Alert",
          detail: res.message,
        });
        this.init();
      },
      (err) => {
        console.log("err", err);
        this.toast.add({ severity: "info", summary: "Alert", detail: err });
      }
    );
    this.subs.sink = interval(5000).subscribe((x) => {
      this.getChatHistoryData();
    });
    
  }

  issueTypeOnChange(event: any) {
    this.reportValueSelected = event.selected;
    this.isReportChanged = true;
  }

  reportSubmit(event: any) {
    let data = {
      reportOption: this.reportValueSelected,
      comment: this.comment,
    };
    this.modalService.postReportChat(data).subscribe(
      (res: any) => {
        if (res.status === 404) {
          return;
        }
        //event.hide()
        this.showReportSuccess = true;
        this.toast.add({
          severity: "success",
          summary: "Info",
          detail: res.message,
        });
      },
      (err) => {
        event.hide();
        this.toast.add({ severity: "info", summary: "Alert", detail: err });
      }
    );
  }
  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
