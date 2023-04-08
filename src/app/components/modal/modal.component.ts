import {AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild} from "@angular/core";
import {ModalService} from "./modal.service";
import {ScrollToBottomDirective} from "./scroll-to-bottom.directive";
import {MessageService} from "primeng/api";
import {SubSink} from "subsink";
import {AuthService} from "../../Auth/auth.service";

@Component({
    selector: "app-modal",
    templateUrl: "./modal.component.html",
    styleUrls: ["./modal.component.scss"],
})
export class ModalComponent implements OnInit {


    @Output() closeModal: EventEmitter<any> = new EventEmitter<any>();
    @Output() togleSidebar = new EventEmitter();
    @ViewChild(ScrollToBottomDirective) scrollMe!: ScrollToBottomDirective;
    details: any [] = [];
    private subs = new SubSink();

    title = 'socketrv';
    content = '';
    received: any [] = [];
    sent: any [] = [];
    isModalVisible: any = 'none';
    issueType: any [] = [];
    questionLeft = '';
    textareaValue = '';
    isReportChanged: boolean = false


    visible: boolean = true;

    showDialog() {
        this.visible = true;
    }
    constructor(private modalService: ModalService, private toast: MessageService,
                private service: AuthService) {
        // WebsocketService.messages.subscribe(msg => {
        //     this.received.push(msg);
        //     console.log("Response from websocket: " + msg);
        // });
        this.issueType = [
            {label: 'Response delayed', name: 'Response delayed'},
            {label: 'Unsatisfactory answer', name: 'Unsatisfactory answer'},
            {label: 'Others', name: 'Others'},
        ];
    }

    ngOnInit() {
        this.questionLeft = '0';
        //this.questionLeft =
        this.subs.sink = this.service.selectLogInData$().subscribe(data => {
            if (data) {
                console.log(data)
                 this.questionLeft = '0';
            }
        });
        this.init();
    }

    init() {
        this.modalService.getChatHistoryForTheUser().subscribe((res: any) => {
            if (res.status === 404) {
                return;
            }
            this.details = res.messages;
        }, err => {
            console.log('err', err);
        });
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
        const data = {
            message: msg,
            user_id: 2
        }
        this.modalService.sendChatMessage(data).subscribe((res: any) => {
            if (res.status === 404) {
                return;
            }
            this.toast.add({severity: 'info', summary: 'Alert', detail: res.message});
            this.init();
        }, err => {
            console.log('err', err);
            this.toast.add({severity: 'info', summary: 'Alert', detail: err});
        });
    }

    close(event: any) {
        this.closeModal.emit(event);
    }

    issueTypeOnChange(event: any){
        console.log(event.selected)
        this.isReportChanged = true
    }
    reportAction(){
        this.isModalVisible = 'block';
    }

}
