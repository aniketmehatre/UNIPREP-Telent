import { Component, OnInit, ChangeDetectorRef } from "@angular/core"
import { ConfirmationService, MessageService } from "primeng/api"
import { FormBuilder, FormGroup, Validators, AbstractControl } from "@angular/forms"
import { CourseListService } from "../../course-list/course-list.service"
import { AuthService } from "../../../Auth/auth.service"
import { Router } from "@angular/router"
import Swiper from "swiper"
import { CvBuilderService } from "../cv-builder/cv-builder.service"
import { CommonModule } from "@angular/common"
import { DialogModule } from "primeng/dialog"
import { SidebarModule } from "primeng/sidebar"
import { TooltipModule } from 'primeng/tooltip';
import { RouterModule } from "@angular/router"
import { CardModule } from "primeng/card"
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import { ButtonModule } from "primeng/button"
import { MultiSelectModule } from "primeng/multiselect"
import { SelectModule } from "primeng/select"
import { InputGroupModule } from "primeng/inputgroup"
import { InputTextModule } from "primeng/inputtext"
import { InputGroupAddonModule } from "primeng/inputgroupaddon"
import { TextareaModule } from "primeng/textarea"
import { EditorModule } from "primeng/editor"
import { SkeletonModule } from "primeng/skeleton"
import { ConfirmPopup } from "primeng/confirmpopup";
import { DropdownModule } from "primeng/dropdown"
import { maxWordsValidator } from "src/app/@Supports/max-word-validator";
import { coverLetterSliders, ResumeHistory, JobTitle } from "../cv-builder/cv-builder.data";

@Component({
	selector: "uni-cover-letter-builder",
	templateUrl: "./cover-letter-builder.component.html",
	styleUrls: ["./cover-letter-builder.component.scss"],
	standalone: true,
	imports: [CommonModule, ConfirmPopup, EditorModule, DialogModule, SidebarModule, SkeletonModule, RouterModule, CardModule, FormsModule, ReactiveFormsModule, ButtonModule, MultiSelectModule, SelectModule, InputGroupModule, InputTextModule, InputGroupAddonModule, TextareaModule, DropdownModule],
	providers: [ConfirmationService, TooltipModule],
})
export class CoverLetterBuilderComponent implements OnInit {
	selectedResumeLevel: string = ""
	activePageIndex: number = 0
	resumeFormInfoData: FormGroup
	fullScreenVisible: boolean = false
	isButtonDisabledSelectTemplate: boolean = false
	submitted: boolean = false
	selectedThemeColor: string = "#172a99"
	selectedColorCode: number = 1
	planExpired: boolean = false
	generateConBtnDisable: boolean = true;
	rephraseconBtnDisable: boolean = false;
	resumeHistory: ResumeHistory[] = [];
	cities: any[] = [];
	resumeSlider: { id: number, templateName: string, imageLink: string } = coverLetterSliders;
	editorModules: any
	swiper!: Swiper
	countryCodeList: any[] = [];
	chatGptButtonLoader: boolean = false;
	chatGptButtonLoaderSummary: boolean = false;
	userSummaryWordCount: number = 0;
	jobRoles: JobTitle[] = [];
	chatGptValueSave: any

	constructor(
		private toaster: MessageService,
		private fb: FormBuilder,
		private resumeService: CourseListService,
		private authService: AuthService,
		private router: Router,
		private confirmService: ConfirmationService,
		private cvBuilderService: CvBuilderService,
		private cdr: ChangeDetectorRef,
	) {
		this.resumeFormInfoData = this.fb.group({
			user_name: ["", [Validators.required]],
			user_job_title: ["", [Validators.required]],
			user_email: ["", [Validators.required, Validators.email]],
			user_location: ["", [Validators.required]],
			user_phone: ["", [Validators.required, Validators.pattern("^\\+?[1-9]\\d{1,14}$")]],
			country_code: ["", [Validators.required]],
			user_summary: ["", [Validators.required, maxWordsValidator(1100)]],
			org_name: ["", [Validators.required]],
			org_location: ["", [Validators.required]],
		})
		this.onChangesFormValues();
	}

	ngOnInit(): void {
		let userDetails = this.authService._user;
		this.resumeFormInfoData.patchValue({
			user_name: userDetails?.name,
			user_email: userDetails?.email,
			user_phone: userDetails?.phone,
			country_code: userDetails?.country_code,
		});
		this.previousResumes();

		this.onLoadCarousal();
		this.editorModules = {
			toolbar: [
				["bold", "italic", "underline"],
				[{ list: "ordered" }, { list: "bullet" }],
				["clean"],
			],
		}
		this.getCountryCodeList();
		this.getJobRoles();
		this.getLocationsList();
		this.checkplanExpire();
	}

	onLoadCarousal() {
		setTimeout(() => {
			this.swiper = new Swiper(".swiper", {
				direction: "horizontal",
				loop: true,
				centeredSlides: true,
				allowTouchMove: false,
				slideToClickedSlide: true,
				breakpoints: {
					640: {
						slidesPerView: 2,
						spaceBetween: 20,
					},
					768: {
						slidesPerView: 3,
						spaceBetween: 40,
					},
					1024: {
						slidesPerView: 4,
						spaceBetween: 50,
					},
					1366: {
						slidesPerView: 5,
						spaceBetween: 50,
					},
				},
			})
		}, 500)
		setTimeout(() => {
			const nextButton = document.querySelector(".swiper-next")
			const prevButton = document.querySelector(".swiper-prev")
			if (nextButton) {
				nextButton.addEventListener("click", () => {
					this.swiper.slideNext()
				})
			}
			if (prevButton) {
				prevButton.addEventListener("click", () => {
					this.swiper.slidePrev()
				})
			}
		}, 200)
	}

	getLocationsList() {
		this.cvBuilderService.getLocationList().subscribe((res: any) => {
			this.cities = res.worklocations;
		});
	}

	getCountryCodeList() {
		this.cvBuilderService.getCountryCodes().subscribe({
			next: response => {
				this.countryCodeList = response;
			}
		})
	}

	previousResumes() {
		this.resumeService.getCoverLetterHistories().subscribe((res: ResumeHistory[]) => {
			this.resumeHistory = res;
		});
	}

	downloadOldResume(resumeLink: string) {
		try {
			const encodedUrl = encodeURI(resumeLink)
			window.open(encodedUrl, "_blank")
		} catch (error) {
			console.error("Error downloading PDF:", error)
			this.toaster.add({ severity: "error", summary: "Error", detail: "Error downloading PDF file." })
		}
	}

	confirm(event: Event, resumeLink: string, resumeId: number) {
		this.confirmService.confirm({
			target: event.target as EventTarget,
			message: "Are you sure that you want to proceed?",
			icon: "pi pi-exclamation-triangle",
			accept: () => {
				const data = {
					resumeLink: resumeLink,
					resumeId: resumeId,
				}
				this.resumeService.deleteCoverLetter(data).subscribe((res) => {
					this.previousResumes()
					this.toaster.add({ severity: res.status, summary: res.status, detail: res.message })
				})
			},
			reject: () => {
				this.toaster.add({ severity: "error", summary: "Error", detail: "you declined." })
			},
		})
	}

	resumeFormSubmit() {
		const visibleFormControls = this.getVisibleFormControls()
		if (!visibleFormControls.every((control) => control.valid)) {
			this.submitted = true
			this.toaster.add({ severity: "error", summary: "Error", detail: "Please fill all the required fields." })
			visibleFormControls.forEach((control) => control.markAsTouched())
		} else {
			//this will remove the &nbsp; in the user summary data.
			const user_summary = this.resumeFormInfoData.value.user_summary;
			let convertedText = user_summary.replace(/&nbsp;/g, ' ');
			this.resumeFormInfoData.patchValue({ user_summary:convertedText });

			this.submitted = false
			this.nextStage()
		}
	}

	getVisibleFormControls(): AbstractControl[] {
		// form validation
		const controls: AbstractControl[] = []
		let controlNames: any = []
		controlNames = ["user_name", "user_job_title", "user_email", "user_location", "user_phone", "org_name", "org_location", "user_summary"]
		controlNames.forEach((controlName: any) => {
			const control = this.resumeFormInfoData.get(controlName)
			if (control) {
				controls.push(control)
			}
		})
		return controls
	}

	nextStage() {
		this.activePageIndex++
	}

	toggleFullScreen() {
		this.fullScreenVisible = !this.fullScreenVisible
	}

	selectColor(selectedColor: string, selectedColorCode: number) {
		this.selectedThemeColor = selectedColor
		this.selectedColorCode = selectedColorCode
	}

	get f() {
		return this.resumeFormInfoData.controls
	}

	previous() {
		this.activePageIndex--
		if (this.activePageIndex <= 1) {
			this.onLoadCarousal()
		}
	}

	next() {
		this.activePageIndex++
		if (this.activePageIndex == 1) {
			this.onLoadCarousal()
		}
	}

	downloadResume() {
		let formData = this.resumeFormInfoData.value
		const userSummary = formData.user_summary;
		//this user summary contains &nbsp; when we edit the content so removed the &nbsp; manually.
		const cleanedContent = cleanHtmlContent(userSummary);

		function cleanHtmlContent(html: string): string {
			if (!html) return '';

			// Decode HTML entities and special characters
			const decoded = html
				.replace(/&amp;/g, '&')
				.replace(/&quot;/g, '"')
				.replace(/&apos;/g, "'")
				.replace(/&#39;/g, "'")
				.replace(/&nbsp;/g, ' ');

			// Clean HTML tags and normalize text
			let cleaned = decoded
				.replace(/<[^>]+>/g, '')
				.replace(/\s+/g, ' ')
				.replace(/,\s*$/, '')
				.trim();

			return cleaned;
		}

		let data = {
			...formData,
			user_summary: cleanedContent,
			cover_name: this.selectedResumeLevel,
			selectedThemeColor: this.selectedThemeColor,
		}
		this.resumeService.downloadCoverletter(data).subscribe((res) => {
			this.previousResumes()
			const parts = res.split("/")
			const lastPart = parts[parts.length - 1]
			this.cvBuilderService.downloadPdf(res, lastPart)
			this.toaster.add({ severity: "success", summary: "Success", detail: "File Download Successfully." })
			this.activePageIndex = 0
			this.onLoadCarousal()
			window.open(res, "_blank")
			this.selectedResumeLevel = ""
		})
	}

	getVisibleFormControlsChatGptRespons(mode: any): AbstractControl[] {
		// form validation
		const controls: AbstractControl[] = []
		let controlNames: any = []
		if (mode == 'generate_description') {
			controlNames = ["user_job_title"]
		}
		if (mode == 'generate_summary') {
			controlNames = ["user_name", "user_job_title", "user_email", "user_location", "user_phone", "org_name", "org_location"]
		}
		controlNames.forEach((controlName: any) => {
			const control = this.resumeFormInfoData.get(controlName)
			if (control) {
				controls.push(control)
			}
		})
		return controls
	}
	// 1st chatgpt response after convert into refrase button , then any changes will in inuput or dropdown that button need to change ai genarate,That why save 1st response for checking
	chatGPTIntegration(mode: string) {
		if (this.authService._creditCount === 0) {
			this.toaster.add({ severity: "error", summary: "Error", detail: "Please Buy some Credits...!" });
			this.router.navigateByUrl('/pages/export-credit')
			return;
		}
		const visibleFormControls = this.getVisibleFormControlsChatGptRespons(mode);
		// condition for required field for chatgpt
		if (!visibleFormControls.every((control) => control.valid)) {
			if (mode == 'generate_description') {
				this.submitted = false;
				this.toaster.add({ severity: "error", summary: "Errorr", detail: "Your Job Title Required." })
			} else {
				this.submitted = true
				this.toaster.add({ severity: "error", summary: "Error", detail: "Please fill all the required fields." })
			}
			visibleFormControls.forEach((control) => control.markAsTouched())
		} else {
			const formData = this.resumeFormInfoData.value
			formData.mode = "cover_letter"
			formData.inner_mode = mode
			formData.max_tokens = 1500
			if (mode == 'generate_summary') {
				this.resumeFormInfoData.patchValue({
					user_summary: "",
				})
				this.generateConBtnDisable = false;
				this.rephraseconBtnDisable = true;
				this.chatGptButtonLoaderSummary = true;
			} else if (mode == 'rephrase_summary') {
				this.generateConBtnDisable = true;
				this.rephraseconBtnDisable = false;
				this.chatGptButtonLoaderSummary = true;
			}
			this.cvBuilderService.openAiIntegration(formData).subscribe((res) => {
				if (res.response && res.response.length > 0) {
					let GPTResponse = res.response.trim()
					GPTResponse = GPTResponse.split("</p>")
						.filter((part: any) => part.trim() !== "")
						.map((part: any) => part + "</p><br>")
						.join("")

					if (mode == 'generate_summary' || mode == 'rephrase_summary') {
						this.resumeFormInfoData.patchValue({
							user_summary: GPTResponse,
						})
						this.chatGptValueSave = this.cleanObject(this.resumeFormInfoData.value);
					}
					this.chatGptButtonLoader = false;
					this.chatGptButtonLoaderSummary = false;
					this.authService.aiCreditCount$.next(true);
				} else {
					console.error("Unexpected response structure:", res)
				}
			})
		}
	}

	checkplanExpire(): void {
		if (this.authService._userSubscrition.time_left.plan === "expired" ||
			this.authService._userSubscrition.time_left.plan === "subscription_expired") {
			this.planExpired = true;
		}
		else {
			this.planExpired = false;
		}
	}

	selectResumeTemplate(templateName: string) {
		this.activePageIndex++
		this.selectedResumeLevel = templateName
		this.imgOnclick(templateName)
	}

	imgOnclick(resumeLevel: any) {
		this.isButtonDisabledSelectTemplate = true
		this.selectedResumeLevel = resumeLevel
	}
	getJobRoles() {
		this.cvBuilderService.getJobList().subscribe({
			next: (response: any) => {
				this.jobRoles = response;
			}
		})
	}

	historyPage() {
		this.activePageIndex = 0;
	}
	// fuction for check input values edit or not
	inputValuesEditOrNot() {
		if (this.isFormChanged()) {
			this.generateConBtnDisable = false;
			this.rephraseconBtnDisable = true;
		} else {
			this.generateConBtnDisable = true;
			this.rephraseconBtnDisable = false;
		}
	}

	isFormChanged(): boolean {
		const current = this.cleanObject(this.resumeFormInfoData.value);
		const saved = this.cleanObject(this.chatGptValueSave);
		return JSON.stringify(current) === JSON.stringify(saved);
	}

	cleanObject(obj: any): any {
		const cleaned: any = {};
		if (obj) {
			Object.keys(obj).forEach(key => {
				let val = obj[key];
				if (typeof val === 'string') {
					val = val.trim();
				}
				if (val !== undefined) {
					cleaned[key] = val;
				}
			});
		}
		return cleaned;
	}

	focusInput(input: HTMLInputElement) {
		setTimeout(() => {
			input.focus()
		}, 0)
	}

	addCustomJobTitle(input: HTMLInputElement) {
		if (!input.value) {
			this.toaster.add({ severity: 'warn', summary: 'Empty', detail: `Please Type Something..!` });
			return;
		}
		const customValue = input.value.trim();
		const exists = this.jobRoles.some(
			(job: any) => job.jobrole.toLowerCase() === customValue.toLowerCase()
		);
		if (exists) {
			this.toaster.add({ severity: 'warn', summary: 'Duplicate', detail: `Job title "${customValue}" already exists` });
			input.value = '';
			return;
		}

		const newJobTitle: JobTitle = {
			id: null,
			jobrole: customValue
		};
		this.jobRoles = [...this.jobRoles, newJobTitle]
		this.resumeFormInfoData.get('user_job_title')?.setValue(customValue);
		input.value = '';
		this.cdr.detectChanges();
		this.toaster.add({ severity: 'success', summary: 'Added', detail: `Job title "${customValue}" added` });
	}

	onChangesFormValues() {
		this.resumeFormInfoData.get('user_summary')?.valueChanges.subscribe(value => {
			this.updateWordCount(value);
		});
	}

	updateWordCount(content: string) {
		const parser = new DOMParser();
		const doc = parser.parseFromString(content, 'text/html');
		const plainText = doc.body.textContent || '';
		this.userSummaryWordCount = (plainText.match(/\b\w+\b/g) || []).length;
	}
}
