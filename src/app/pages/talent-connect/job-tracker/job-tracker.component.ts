import { Component, Output, EventEmitter } from "@angular/core";
import { Dialog } from "primeng/dialog";
import { Select } from "primeng/select";
import { JobListComponent } from "./job-list/job-list.component";
import { CommonModule } from "@angular/common";
import { TalentConnectService } from "../talent-connect.service";
import { Job } from "../easy-apply/job-view/job-view.component";
import { RouterModule } from "@angular/router";
import { JobDetailsComponent } from "./job-details/job-details.component";
import { JobChatUiComponent } from "./job-chat-ui/job-chat-ui.component";
import { MultiSelectModule } from "primeng/multiselect";
import { InputNumberModule } from "primeng/inputnumber";
import { ReactiveFormsModule } from "@angular/forms";
import { DrawerModule } from "primeng/drawer";
import { PageFacadeService } from "../../page-facade.service";

interface ChatMessage {
	id: number;
	sender: string;
	senderAvatar?: string;
	message: string;
	time: string;
	isUser: boolean;
}

@Component({
	selector: "uni-job-tracker",
	templateUrl: "./job-tracker.component.html",
	styleUrls: ["./job-tracker.component.scss"],
	standalone: true,
	imports: [ReactiveFormsModule, JobListComponent, DrawerModule, JobDetailsComponent, JobChatUiComponent, InputNumberModule, MultiSelectModule, CommonModule, RouterModule],
})
export class JobTrackerComponent {
	orgnamewhitlabel: any;
	displayModal: boolean = false;
	visible: boolean = false;
	visiblechat: boolean = false;
	isSkeletonVisible: boolean = false;
	ehitlabelIsShow: boolean = false;
	restrict: boolean = false;
	howItWorksVideoLink: string = "";
	selectedJobId: number | null = null;
	totalJobs: number = 100; // As shown in the UI
	activeTab: string = "All Jobs";
	tabs = ["All Jobs", "Job Applied", "Application Received", "Shortlisted"];
	currentPage: number = 1;
	itemsPerPage: number = 10;
	steps = [{ label: "Initial Round" }, { label: "HR Round" }, { label: "Selected" }];
	showInfo: boolean = false;
	showChat: boolean = false;
	messages: ChatMessage[] = [];
	newMessage: string = "";
	jobDetails: Job;
	
	constructor(private talentConnectService: TalentConnectService, private pageFacade: PageFacadeService) { }

	ngOnInit() { }

	toggleInfo(): void {
		this.showInfo = !this.showInfo;
	}

	onClickJobId(event: number) {
		if (event) {
			this.selectedJobId = event;
			this.getJobTrackDetails(this.selectedJobId);
		} else {
			this.showChat = false;
			this.showInfo = false;
		}
	}

	getJobTrackDetails(id: number) {
		this.talentConnectService.getJobTrackerDetail(id).subscribe({
			next: (response) => {
				this.jobDetails = response.job[0];
				this.showInfo = true;
			},
			error: (error) => {
				console.log(error);
			},
		});
	}

	showFilterModal() {
		this.displayModal = true;
	}

	openVideoPopup(videoLink: string) {
		this.pageFacade.openHowitWorksVideoPopup(videoLink)
	}
}
