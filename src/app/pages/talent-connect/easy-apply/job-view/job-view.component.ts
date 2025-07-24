import { Component, Input, OnInit } from "@angular/core";
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
import { Job } from "src/app/@Models/employee-connect-job.model";
import { CardModule } from "primeng/card";
import { SocialShareService } from "src/app/services/social-share.service";
import { Meta } from "@angular/platform-browser";
import { environment } from "@env/environment";

@Component({
	selector: "uni-job-view",
	templateUrl: "./job-view.component.html",
	styleUrls: ["./job-view.component.scss"],
	standalone: true,
	imports: [CommonModule, ButtonModule, DrawerModule, TooltipModule, FormsModule, JobChatUiComponent, RouterLink, RatingModule, CardModule],
})
export class JobViewComponent implements OnInit {
	@Input() showInfo: boolean = true;
	jobId!: number;
	visible: boolean = false;
	public Array = Array;
	appliedId: number = NaN;
	attachmentFileName: string = "";
	isApplied: boolean = false;
	attachmentFile!: File | null;
	jobDetails: Job | null = null;
	isShowApplyChat: boolean = false;
	currentView: "initial" | "conversation" = "initial";

	constructor(private route: ActivatedRoute, private talentConnectService: TalentConnectService,
		private message: MessageService, private router: Router, private socialShareService: SocialShareService, private meta: Meta) { }

	ngOnInit(): void {
		this.checkIfProfileCreated();
		this.jobId = Number(this.route.snapshot.paramMap.get("id"));
		if (this.jobId) {
			this.getJobDetails(this.jobId);
		}
	}

	checkIfProfileCreated() {
		if (!this.talentConnectService._employerProfileData?.profile_completion_flag) {
			this.router.navigate(["/pages/talent-connect/list"]);
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
					// Parse string arrays if they come as comma-separated strings
					this.jobDetails = {
						...jobData,
						interview_format: this.getArrayFormat(jobData?.interview_format),
						technical_proficiency: this.parseArrayData(jobData.technical_proficiency),
						language_proficiency: this.parseLanguageProficiency(jobData.language_proficiency),
						compensation_structure: this.getArrayFormat(jobData?.compensation_structure),
						work_mode: this.getArrayFormat(jobData?.work_mode),
						employment_type: this.getArrayFormat(jobData?.employment_type),
						benefits_perks: this.getArrayFormat(jobData?.benefits_perks),
						soft_skills: this.getArrayFormat(jobData?.soft_skills),
						hiring_stages: this.getArrayFormat(jobData?.hiring_stages)
					};
					if (response?.applied_jobid) {
						this.appliedId = response?.applied_jobid;
					}
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

	getArrayFormat(data: any) {
		return data ? (Array.isArray(data) ? data : [data]) : [];
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
					this.message.add({ severity: "error", summary: "Error", detail: response.message });
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

	showSocialSharingList(cardId: string) {
		let socialShare: any = document.getElementById(cardId);
		if (socialShare.style.display == "") {
			socialShare.style.display = "block";
		}
		else {
			socialShare.style.display = socialShare.style.display == "none" ? "block" : "none";
		}
	}

	shareQuestion(type: string) {
		const socialMedias: { [key: string]: string } = this.socialShareService.socialMediaList;
		const url = environment.jobDomain + '/view/' + this.jobDetails?.uuid;
		const encodedUrl = encodeURIComponent(url);
		const title = encodeURIComponent('UNIPREP | ' + this.jobDetails?.position + ' | ' + this.jobDetails?.company_name);
		this.meta.updateTag({ property: 'og:url', content: url });
		this.meta.updateTag({ property: 'og:title', content: title });
		let shareUrl = '';
		switch (type) {
			case 'Whatsapp':
				shareUrl = `${socialMedias[type]}${title}%0A${encodedUrl}`;
				break;
			case 'Mail':
				shareUrl = `${socialMedias[type]}${title}%0A${encodedUrl}`;
				break;
			case 'LinkedIn':
				shareUrl = `${socialMedias[type]}${encodedUrl}&title=${title}`;
				break;
			case 'Twitter':
				shareUrl = `${socialMedias[type]}${encodedUrl}&text=${title}`;
				break;
			case 'Facebook':
				shareUrl = `${socialMedias[type]}${encodedUrl}`;
				break;
			case 'Instagram':
				shareUrl = `${socialMedias[type]}${encodedUrl}`;
				break;
			default:
				shareUrl = `${socialMedias[type]}${encodedUrl}`;
		}
		window.open(shareUrl, '_blank');
	}

	copyLink() {
		const textToCopy = encodeURI(environment.jobDomain + '/view/' + this.jobDetails?.uuid);
		this.socialShareService.copyQuestion(textToCopy, 'Job Link copied successfully');
	}
}
