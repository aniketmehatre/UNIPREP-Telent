import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from "@angular/core"
import { ModalService } from "./modal.service"
import { MessageService } from "primeng/api"
import { SubSink } from "subsink"
import { AuthService } from "../../Auth/auth.service"
import { interval } from "rxjs"
import { ScrollToBottomDirective } from "src/app/shared/directives/scroll-to-bottom.directive"
import { CommonModule } from "@angular/common"
import { DialogModule } from "primeng/dialog"
import { SelectModule } from 'primeng/select';

@Component({
	selector: "app-modal",
	templateUrl: "./modal.component.html",
	styleUrls: ["./modal.component.scss"],
	standalone: true,
	imports: [CommonModule, DialogModule, SelectModule],
})
export class ModalComponent implements OnInit {
	@Output() closeModal: EventEmitter<any> = new EventEmitter<any>()
	@Output() togleSidebar = new EventEmitter()
	@ViewChild(ScrollToBottomDirective)
	scroll!: ScrollToBottomDirective

	details: any[] = []
	private subs = new SubSink()

	comment: string = ""
	title = "socketrv"
	content = ""
	issueType: any[] = []
	questionLeft = ""
	isReportChanged: boolean = false
	visible: boolean = true
	showReportSuccess: boolean = false
	reportValueSelected: any
	message: string = ""

	constructor(private modalService: ModalService, private toast: MessageService, private service: AuthService) {
		this.subs.sink = interval(5000).subscribe((x) => {
			this.getChatHistoryData()
		})
	}

	ngOnInit() {
		this.questionLeft = "0"
		this.subs.sink = this.service.selectLogInData$().subscribe((data) => {
			if (data) {
				this.questionLeft = data.questions_left
			}
		})
		this.init()
	}

	init() {
		this.getChatHistoryData()
		this.modalService.getChatReportOptions().subscribe(
			(res: any) => {
				if (res.status === 404) {
					return
				}
				this.issueType = res.reportOptions
			},
			(err) => {
				this.toast.add({ severity: "error", summary: "Error", detail: err })
			}
		)
	}

	getChatHistoryData() {
		this.modalService.getChatHistoryForTheUser().subscribe(
			(res: any) => {
				if (res.status === 404) {
					return
				}
				this.details = res.messages
			},
			(err) => {
				this.toast.add({ severity: "error", summary: "Error", detail: err })
			}
		)
	}

	sendMsg() {
		// let message = {
		//     source: '',
		//     content: ''
		// };
		// message.source = 'localhost';
		// message.content = this.content;
		//
		// this.sent.push(msg);
		//this.WebsocketService.messages.next(message);

		let userInfo = this.service.user
		const data = {
			message: this.message,
			user_id: userInfo!.id,
		}
		this.modalService.sendChatMessage(data).subscribe(
			(res: any) => {
				if (res.status === 404) {
					return
				}
				this.message = ""
				this.toast.add({
					severity: "success",
					summary: "Info",
					detail: res.message,
				})
				this.init()
			},
			(err) => {
				this.toast.add({ severity: "info", summary: "Alert", detail: err })
			}
		)
	}

	issueTypeOnChange(event: any) {
		this.reportValueSelected = event.selected
		this.isReportChanged = true
	}

	reportSubmit(event: any) {
		let data = {
			reportOption: this.reportValueSelected,
			comment: this.comment,
		}
		this.modalService.postReportChat(data).subscribe(
			(res: any) => {
				if (res.status === 404) {
					return
				}
				//event.hide()
				this.showReportSuccess = true
			},
			(err) => {
				event.hide()
				this.toast.add({ severity: "info", summary: "Alert", detail: err })
			}
		)
	}
	ngOnDestroy() {
		this.subs.unsubscribe()
	}
}
