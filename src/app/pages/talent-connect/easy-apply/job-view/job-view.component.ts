import { Component, Input, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { TalentConnectService } from "../../talent-connect.service";
import { ButtonModule } from "primeng/button";
import { TooltipModule } from "primeng/tooltip";
import { FormsModule } from "@angular/forms";
import { JobChatUiComponent } from "../../job-tracker/job-chat-ui/job-chat-ui.component";
import { MessageService } from "primeng/api";
import { RatingModule } from "primeng/rating";
import { DrawerModule } from "primeng/drawer";

export interface Job {
	isChecked: number;
	id: number;
	experience_level: string;
	job_overview: string;
	key_responsibilities: string | string[];
	technical_proficiency: string | string[];
	language_proficiency: string | Array<{ language: string; level: string }>;
	start_date: string;
	due_date: string;
	available_vacancies: number;
	hiring_timeframe: string;
	created_at: string;
	interview_format: string[];
	position: string;
	work_location: string;
	company_name: string;
	industry_name: string;
	company_size: number;
	compensation_structure: string | string[];
	work_mode: string | string[];
	employment_type: string | string[];
	benefits_perks: string | string[];
	soft_skills: string | string[];
	hiring_stages: string | Array<{ id: number; name: string }>;
	total_applied: number;
	company_logo_url: string;
	educational_degree: string;
	salary_range: number;
	matching_skills: string;
	stage: string | null;
	company_logo?: string;
	jobsoftskills: JobSoftSkills[];
}

export interface JobSoftSkills {
	id: number;
	softskill: string;
	ismatch: number;
}

interface Message {
	sender: boolean; // Changed from isSender to sender for clarity
	content: string;
	time: string;
	markAsRead?: boolean;
	profile_image?: string;
	type: "text" | "file" | "button";
	attachment?: string | null;
	attachment_url?: any | null;
}

@Component({
	selector: "uni-job-view",
	templateUrl: "./job-view.component.html",
	styleUrls: ["./job-view.component.scss"],
	standalone: true,
	imports: [CommonModule, ButtonModule, DrawerModule, TooltipModule, FormsModule, JobChatUiComponent, RouterLink, RatingModule],
})
export class JobViewComponent implements OnInit {
	jobId!: number;
	visible: boolean = false;
	public Array = Array;
	appliedId: number = NaN;
	attachmentFileName: string = "";
	isApplied: boolean = false;
	@Input() showInfo: boolean = true;
	attachmentFile!: File | null;
	jobDetails: Job;

	isShowApplyChat: boolean = false;
	currentView: "initial" | "conversation" = "initial";

	messages: Message[] = [];

	constructor(private route: ActivatedRoute, private talentConnectService: TalentConnectService, private message: MessageService) { }

	ngOnInit(): void {
		this.jobId = Number(this.route.snapshot.paramMap.get("id"));
		if (this.jobId) {
			this.getJobDetails(this.jobId);
		}
	}

	switchToConversationView(): void {
		this.currentView = "conversation";
	}

	getJobDetails(id: number) {
		this.talentConnectService.getJobDetails(id).subscribe({
			next: (response) => {
				// Process the response data to match our Job interface
				if (response.job && response.job[0]) {
					const jobData = response.job[0];
					console.log(jobData);
					// Parse string arrays if they come as comma-separated strings
					this.jobDetails = {
						...jobData,
						interview_format: Array.isArray(jobData.interview_format) ? jobData.interview_format : [jobData.interview_format],
						technical_proficiency: this.parseArrayData(jobData.technical_proficiency),
						key_responsibilities: jobData.key_responsibilities, // ✅ keep as-is since it's HTML
						language_proficiency: this.parseLanguageProficiency(jobData.language_proficiency),
						compensation_structure: Array.isArray(jobData.compensation_structure) ? jobData.compensation_structure : [jobData.compensation_structure],
						work_mode: Array.isArray(jobData.work_mode) ? jobData.work_mode : [jobData.work_mode],
						employment_type: Array.isArray(jobData.employment_type) ? jobData.employment_type : [jobData.employment_type],
						benefits_perks: Array.isArray(jobData.benefits_perks) ? jobData.benefits_perks : [jobData.benefits_perks],
						soft_skills: Array.isArray(jobData.soft_skills) ? jobData.soft_skills : [jobData.soft_skills],
						hiring_stages: Array.isArray(jobData.hiring_stages) ? jobData.hiring_stages : [jobData.hiring_stages],
						company_name: jobData.company_name || jobData.company_name,
						company_logo: jobData.company_logo_url || jobData.company_logo,
						work_location: jobData.work_location || jobData.worklocation,
					};
					if (response?.applied_jobid) {
						this.appliedId = response?.applied_jobid;
					}
					this.isApplied = response?.isapplied;
					if (response?.isapplied) {
						this.isShowApplyChat = response?.isapplied;
						this.getMessages();
					}
				}
			},
			error: (error) => {
				console.log(error);
			},
		});
	}

	// Helper method to parse string data into arrays
	private parseArrayData(data: any): string[] {
		if (Array.isArray(data)) {
			return data;
		} else if (typeof data === "string") {
			return data.split(",").map((item) => item.trim());
		}
		return [data?.toString()];
	}

	// Helper method to parse language proficiency data
	private parseLanguageProficiency(data: any): Array<{ language: string; level: string }> {
		if (Array.isArray(data)) {
			return data;
		} else if (typeof data === "string") {
			// Parse string format like "[English,High],[Tamil,High]"
			try {
				const matches = data.match(/\[([^\]]+)\]/g);
				if (matches) {
					return matches.map((match) => {
						const parts = match.replace(/[\[\]]/g, "").split(",");
						return { language: parts[0], level: parts[1] };
					});
				}
			} catch (e) {
				console.error("Error parsing language proficiency", e);
			}
		}
		return [{ language: data?.toString() || "English", level: "Basic" }];
	}

	applyJob(id: number) {
		this.talentConnectService.applyJob(id).subscribe({
			next: (response) => {
				if (response.success) {
					this.isShowApplyChat = true;
					this.isApplied = true;
					this.appliedId = response.id;
				} else {
					this.message.add({
						severity: "error",
						summary: "Error",
						detail: response.message,
					});
				}
				if (response.job && response.job[0]) {
					this.jobDetails = response.job[0];
				}
			},
			error: (error) => {
				console.log(error);
			},
		});
	}

	uploadFilesChat($event: any) {
		this.attachmentFile = $event.target.files[0];
		this.attachmentFileName = $event.target.files[0]?.name;
	}

	getProficiencyRating(proficiency: string): number {
		const ratings: { [key: string]: number } = {
			Beginner: 1,
			Elementary: 2,
			Intermediate: 3,
			Advanced: 4,
			Fluent: 5,
		};
		return ratings[proficiency] ?? 3;
	}

	getMessages() {
		if (this.appliedId) {
			this.talentConnectService.getMessage({ job_id: this.appliedId }).subscribe({
				next: (response) => {
					if (Array.isArray(response?.messages)) {
						// Handle array response
						this.messages = response?.messages.map((item: any) => {
							return {
								sender: item.employer == 0 ? false : true,
								content: item.chat,
								markAsRead: item?.markasread == 0 ? false : true,
								time: new Date(item.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
								type: item.attachment ? "file" : "text",
							};
						});
					} else {
						// Handle object response
						console.log("Message response:", response);
					}
				},
				error: (error) => {
					console.log(error);
				},
			});
		}
	}

	sendMessage(message: string): void {
		if (!message.trim()) return;
		const formData = new FormData();
		if (this.attachmentFile) {
			formData.append("attachment", this.attachmentFile);
		}
		formData.append("chat", message);
		formData.append("job_id", this.appliedId.toString());
		this.talentConnectService.sendMessage(formData).subscribe({
			next: (response) => {
				// If there's a response message from the server, add it
				if (response.message) {
					this.messages.push({
						sender: true,
						content: message,
						time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
						type: !this.attachmentFile ? "text" : "file",
						attachment: this.attachmentFileName ? this.attachmentFileName : null,
						attachment_url: this.attachmentFile ? this.attachmentFile : null,
					});
				}
				this.attachmentFile = null;
				this.attachmentFileName = "";
			},
			error: (error) => {
				console.log("Error sending message:", error);
			},
		});
	}
}
