import { Component, inject, Input, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
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
	languages: LangProficiency[];
}

interface LangProficiency {
	lang: string;
	level: string
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
	private toast = inject(MessageService)
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


	constructor(private route: ActivatedRoute, private talentConnectService: TalentConnectService,
		private message: MessageService, private router: Router) { }

	ngOnInit(): void {
		this.checkIfProfileCreated()
		this.jobId = Number(this.route.snapshot.paramMap.get("id"));
		if (this.jobId) {
			this.getJobDetails(this.jobId);
		}
	}

	checkIfProfileCreated() {
		this.talentConnectService.getMyProfileData().subscribe({
			next: response => {
				console.log('resp', response);

				if (response && response.count > 0 && response.data[0].profile_completion_flag) {
				}
				else {
					this.router.navigate(["/pages/talent-connect/list"])
				}
			},
			error: error => {
				this.toast.add({ severity: "error", summary: "Error", detail: 'Please create your profile first.' })
				this.router.navigate(["/pages/talent-connect/list"])
			}
		});
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
					// this.isApplied = response?.isapplied;
					this.isApplied = true;
					if (this.isApplied) {
						this.isShowApplyChat = this.isApplied;
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

	getProficiencyRating(proficiency: string) {
		const proficiencyList: { [key: string]: number } = {
			"Beginner": 2,
			"Fluent": 3,
			"Proficient": 4,
			"Native": 5
		}
		return proficiencyList[proficiency] || 0;
	}

}
