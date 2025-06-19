import { Component, Output, EventEmitter } from "@angular/core";
import { Dialog } from "primeng/dialog";
import { Select, SelectModule } from "primeng/select";
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
	imports: [ReactiveFormsModule, JobListComponent, DrawerModule, JobDetailsComponent, JobChatUiComponent, InputNumberModule, MultiSelectModule, CommonModule, RouterModule, SelectModule],
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
	selectedJobId: number  = 0;
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
	currencyList: any[] = [];
	currencies: any[] = [];
	jobListings: any[] = [];

	constructor(private talentConnectService: TalentConnectService, private pageFacade: PageFacadeService) { }

	ngOnInit() { 
		this.getOptionsList();
	}

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
				this.jobListings = response.job;
				this.jobListings = this.jobListings.map((data: any) => ({
					...data,
					salary_per_month: data?.salary_per_month?.replace(/\/Month/i, '').trim()
				}));
				this.currencyList = response.job
					.filter((job: any) => job?.salary_per_month) // optional: skip if salary is null/undefined
					.map((job: any) => ({
						id: job.id,
						salary_per_month: job?.salary_per_month
					}));
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

	getOptionsList() {
		this.talentConnectService.getJobListDropdown().subscribe(data => {
			this.currencies = data?.currencycode;
		});
	}

	onCurrencyExchange(event: any) {
		const convertTo = event.value.currency_code;

		const endDate = new Date(); // today
		const formattedEnd = endDate.toISOString().split("T")[0]; // 'YYYY-MM-DD'

		// Collect unique currencies to convert **from**
		const uniqueCurrencies = [...new Set(
			this.currencyList.map((job: any) => {
				const match = job.salary_per_month.match(/^([A-Z]{3})\s([\d,.]+)/);
				return match ? match[1] : null;
			}).filter(Boolean)
		)];

		uniqueCurrencies.forEach((convertFrom: any) => {
			this.talentConnectService
				.getCurrencyConverter(convertFrom, convertTo, formattedEnd, formattedEnd)
				.subscribe({
					next: (data: any) => {
						this.jobListings = this.jobListings.map((job: any) => {
							const salaryStr = job?.salary_per_month || '';
							const match = salaryStr.match(/^([A-Z]{3})\s([\d,.]+)/);
							if (match) {
								const currencyCode = match[1]; // e.g., "INR"
								const amount = parseFloat(match[2].replace(/,/g, "")); // e.g., 30000.00
								const today = new Date().toISOString().slice(0, 10); // '2025-05-12'
								const ratesForToday = data.rates[today]; // { AED: 0.04157 }
								const currency = Object.keys(ratesForToday)[0]; // 'AED'
								const rate = ratesForToday[currency]; // 0.04157
								if (currencyCode === convertFrom) {
									const convertedAmount = (rate * amount).toFixed(2);
									return {
										...job,
										salary_per_month: `${convertTo} ${convertedAmount}` // set at root
									};
								}
							}
							// Return original job if no match or doesn't match convertFrom
							return job;
						});
						this.jobDetails = this.jobListings[0];
					},
					error: (err) => console.error(`Error fetching rate for ${convertFrom} → ${convertTo}:`, err),
				});
		});
	}

	onClearCurrency(event: Event) {
		this.getJobTrackDetails(this.selectedJobId);
	}
}
