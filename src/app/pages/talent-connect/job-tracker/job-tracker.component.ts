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
import { ButtonModule } from "primeng/button";

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
	imports: [ReactiveFormsModule, JobListComponent, DrawerModule, JobDetailsComponent, JobChatUiComponent, InputNumberModule, MultiSelectModule, CommonModule, RouterModule, 
		ButtonModule
	],
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
	jobTotalCount: number = 0;
	isAppliedFilter: boolean = false;
	
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

	openVideoPopup() {
		this.pageFacade.openHowitWorksVideoPopup("company-connect")
	}

	getJobTotalCount(data: any) {
		this.jobTotalCount = data?.jobCount;
		this.isAppliedFilter = data?.appliedFilter;
		this.selectedJobId = null;
	}
}
