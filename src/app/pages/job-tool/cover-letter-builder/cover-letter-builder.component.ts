import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from "@angular/core"
import { ConfirmationService, MenuItem, MessageService } from "primeng/api"
import { FormBuilder, FormGroup, Validators, AbstractControl } from "@angular/forms"
import { CourseListService } from "../../course-list/course-list.service"
import { LocationService } from "../../../location.service"
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
import { PaginatorModule } from "primeng/paginator"
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import { CarouselModule } from "primeng/carousel"
import { ButtonModule } from "primeng/button"
import { MultiSelectModule } from "primeng/multiselect"
import { SelectModule } from "primeng/select"
import { InputGroupModule } from "primeng/inputgroup"
import { InputTextModule } from "primeng/inputtext"
import { InputGroupAddonModule } from "primeng/inputgroupaddon"
import { TextareaModule } from "primeng/textarea"
import { EditorModule } from "primeng/editor"
import { SkeletonModule } from "primeng/skeleton"
import { PdfViewerModule } from "ng2-pdf-viewer";
import { ConfirmPopup } from "primeng/confirmpopup";
import { DropdownModule } from "primeng/dropdown"
import { AveragesalaryestimatorService } from "../../averagesalaryestimator/averagesalaryestimator.service"
import { maxWordsValidator } from "src/app/@Supports/max-word-validator";

declare const pdfjsLib: any;

interface ResumeHistory {
	id: number;
	pdf_name: string;
	created_time: string;
}


interface JobTitle {
	id: number | null; // null for custom job titles
	jobrole: string;
}
interface City {
	city_id: number
	city_name: string
	country_name: string
	flag: string
	label?: string;
}

@Component({
	selector: "uni-cover-letter-builder",
	templateUrl: "./cover-letter-builder.component.html",
	styleUrls: ["./cover-letter-builder.component.scss"],
	standalone: true,
	imports: [CommonModule, ConfirmPopup, EditorModule, DialogModule, SidebarModule, SkeletonModule, PdfViewerModule, RouterModule, CardModule, PaginatorModule, FormsModule, ReactiveFormsModule, CarouselModule, ButtonModule, MultiSelectModule, SelectModule, InputGroupModule, InputTextModule, InputGroupAddonModule, TextareaModule, DropdownModule],
	providers: [ConfirmationService, TooltipModule],
})
export class CoverLetterBuilderComponent implements OnInit, AfterViewInit {
	@ViewChild("pdfViewer") pdfViewer: any
	items!: MenuItem[]
	selectedResumeLevel: string = ""
	activePageIndex: number = 0
	resumeFormInfoData: FormGroup
	fullScreenVisible: boolean = false
	isButtonDisabledSelectTemplate: boolean = false
	submitted: boolean = false
	moduleActiveIndex: number = 0
	selectedThemeColor: string = "#172a99"
	selectedColorCode: number = 1
	planExpired: boolean = false
	previewImage: string = ""
	coverHistories: any = []
	currentDate: Date = new Date()
	// isButtonDisabled: boolean = false
	generateDesBtnDisable: boolean = true;
	rephraseDesBtnDisable: boolean = false;
	generateConBtnDisable: boolean = true;
	rephraseconBtnDisable: boolean = false;
	resumeHistory: any = [];
	pdfThumbnails: { [key: string]: string } = {};
	filteredLocations: any = [];
	orgLocation: any = [];
	cities: City[] = [];
	// filterJobRole: any[] = [];
	// filterJobRolePostionApplied: any[] = [];
	resumeSlider: any = [
		{
			id: 1,
			templateName: "Traditional",
			imageLink: "./../../../uniprep-assets/coverletter-images/traditional.svg",
		},
		{
			id: 2,
			templateName: "Modern",
			imageLink: "../../../../uniprep-assets/coverletter-images/modern.svg",
		},
		{
			id: 3,
			templateName: "Academic",
			imageLink: "../../../../uniprep-assets/coverletter-images/academic.svg",
		},
		{
			id: 4,
			templateName: "Creative",
			imageLink: "../../../../uniprep-assets/coverletter-images/creative.svg",
		},
		{
			id: 5,
			templateName: "Functional",
			imageLink: "../../../../uniprep-assets/coverletter-images/functional.svg",
		},
		{
			id: 6,
			templateName: "Traditional",
			imageLink: "./../../../uniprep-assets/coverletter-images/traditional.svg",
		},
		{
			id: 7,
			templateName: "Modern",
			imageLink: "../../../../uniprep-assets/coverletter-images/modern.svg",
		},
		{
			id: 8,
			templateName: "Academic",
			imageLink: "../../../../uniprep-assets/coverletter-images/academic.svg",
		},
		{
			id: 9,
			templateName: "Creative",
			imageLink: "../../../../uniprep-assets/coverletter-images/creative.svg",
		},
		{
			id: 10,
			templateName: "Functional",
			imageLink: "../../../../uniprep-assets/coverletter-images/functional.svg",
		},
		{
			id: 11,
			templateName: "Traditional",
			imageLink: "./../../../uniprep-assets/coverletter-images/traditional.svg",
		},
		{
			id: 12,
			templateName: "Modern",
			imageLink: "../../../../uniprep-assets/coverletter-images/modern.svg",
		},
		{
			id: 13,
			templateName: "Academic",
			imageLink: "../../../../uniprep-assets/coverletter-images/academic.svg",
		},
		{
			id: 14,
			templateName: "Creative",
			imageLink: "../../../../uniprep-assets/coverletter-images/creative.svg",
		},
		{
			id: 15,
			templateName: "Functional",
			imageLink: "../../../../uniprep-assets/coverletter-images/functional.svg",
		},
		{
			id: 16,
			templateName: "Traditional",
			imageLink: "./../../../uniprep-assets/coverletter-images/traditional.svg",
		},
		{
			id: 17,
			templateName: "Modern",
			imageLink: "../../../../uniprep-assets/coverletter-images/modern.svg",
		},
		{
			id: 18,
			templateName: "Academic",
			imageLink: "../../../../uniprep-assets/coverletter-images/academic.svg",
		},
		{
			id: 19,
			templateName: "Creative",
			imageLink: "../../../../uniprep-assets/coverletter-images/creative.svg",
		},
		{
			id: 20,
			templateName: "Functional",
			imageLink: "../../../../uniprep-assets/coverletter-images/functional.svg",
		},
		{
			id: 21,
			templateName: "Traditional",
			imageLink: "./../../../uniprep-assets/coverletter-images/traditional.svg",
		},
		{
			id: 22,
			templateName: "Modern",
			imageLink: "../../../../uniprep-assets/coverletter-images/modern.svg",
		},
		{
			id: 23,
			templateName: "Academic",
			imageLink: "../../../../uniprep-assets/coverletter-images/academic.svg",
		},
		{
			id: 24,
			templateName: "Creative",
			imageLink: "../../../../uniprep-assets/coverletter-images/creative.svg",
		},
		{
			id: 25,
			templateName: "Functional",
			imageLink: "../../../../uniprep-assets/coverletter-images/functional.svg",
		},
		{
			id: 26,
			templateName: "Traditional",
			imageLink: "./../../../uniprep-assets/coverletter-images/traditional.svg",
		},
		{
			id: 27,
			templateName: "Modern",
			imageLink: "../../../../uniprep-assets/coverletter-images/modern.svg",
		},
		{
			id: 28,
			templateName: "Academic",
			imageLink: "../../../../uniprep-assets/coverletter-images/academic.svg",
		},
		{
			id: 29,
			templateName: "Creative",
			imageLink: "../../../../uniprep-assets/coverletter-images/creative.svg",
		},
		{
			id: 30,
			templateName: "Functional",
			imageLink: "../../../../uniprep-assets/coverletter-images/functional.svg",
		},
	]
	editorModules: any
	swiper!: Swiper
	pdfLoadError: boolean = false
	pdfUrl: string = ""
	countryCodeList: any[] = [];
	// jobTitleList: any[] = [];
	chatGptButtonLoader: boolean = false;
	chatGptButtonLoaderSummary: boolean = false;
	userSummaryWordCount: number = 0;
	constructor(
		private toaster: MessageService,
		private fb: FormBuilder,
		private resumeService: CourseListService,
		private authService: AuthService,
		private router: Router,
		private confirmService: ConfirmationService,
		private cvBuilderService: CvBuilderService,
		private service: AveragesalaryestimatorService,
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
		this.getJobRoles();
		this.onChangesFormValues();
	}

	ngAfterViewInit() {
		if (this.pdfViewer) {
			this.pdfViewer.refresh()
		}
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

	onError(error: any) {
		console.error("PDF loading error:", error)
		this.pdfLoadError = true
	}

	getLocationsList() {
		this.cvBuilderService.getLocationList().subscribe((res: any) => {
			this.cities = res;
		});
	}

	onFocusOut() {
		this.inputValuesEditOrNot();
		setTimeout(() => {
			this.filteredLocations = [];
			this.orgLocation = [];
		}, 200); // Delay clearing the dropdown by 200 milliseconds
	}
	onFocusOutJob() {
		this.inputValuesEditOrNot();
	}

	selectLocation(city: any, mode: string) {
		if (mode === "user_location") {
			this.resumeFormInfoData.patchValue({
				user_location: city.country_name,
			});
			this.filteredLocations = [];
		} else if (mode === "org_location") {
			this.resumeFormInfoData.patchValue({
				org_location: city.country_name,
			});
			this.orgLocation = [];
		}
	}

	pdfViewLoader() {
		try {
			if (!this.pdfUrl) {
				throw new Error("No PDF URL provided")
			}

			const encodedUrl = encodeURI(this.pdfUrl)
			if (this.pdfViewer) {
				this.pdfViewer.pdfSrc = encodedUrl
				this.pdfViewer.refresh()
			}
		} catch (error) {
			console.error("Error loading PDF:", error)
			this.pdfLoadError = true
		}
	}

	ngOnInit(): void {
		let userDetails = this.authService._user;
		let location = userDetails?.district + ', ' + userDetails?.state;
		this.resumeFormInfoData.patchValue({
			user_name: userDetails?.name,
			user_email: userDetails?.email,
			// user_location: location,
			user_phone: userDetails?.phone,
			country_code: userDetails?.country_code,
		});
		// Load PDF.js library dynamically
		if (!document.getElementById('pdfjs-script')) {
			const script = document.createElement('script');
			script.id = 'pdfjs-script';
			script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
			script.onload = () => {
				// Set worker source
				pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
				// Load resumes after PDF.js is ready
				this.previousResumes();
			};
			document.body.appendChild(script);
		} else {
			this.previousResumes();
		}

		this.ngAfterViewInit();
		this.editorModules = {
			toolbar: [
				["bold", "italic", "underline"],
				[{ list: "ordered" }, { list: "bullet" }],
				["clean"],
			],
		}
		this.items = [{ label: "Personal Information" }, { label: "Organisation Details" }, { label: "Letter Area" }]
		// this.hideHeader()
		this.getCountryCodeList();
		this.getLocationsList();
		this.checkplanExpire()
	}

	getCountryCodeList() {
		this.cvBuilderService.getCountryCodes().subscribe({
			next: response => {
				this.countryCodeList = response;
			}
		})
	}

	loadPdfThumbnail(pdfUrl: string): void {
		if (this.pdfThumbnails[pdfUrl]) {
			return; // Already loaded
		}

		// Create canvas and load PDF
		const canvas = document.createElement('canvas');
		const context = canvas.getContext('2d');
		if (!context) {
			console.error('Could not get canvas context');
			return;
		}

		// Load the PDF document
		pdfjsLib.getDocument(pdfUrl).promise.then((pdf: any) => {
			pdf.getPage(1).then((page: any) => {
				const viewport = page.getViewport({ scale: 0.5 });
				canvas.height = viewport.height;
				canvas.width = viewport.width;

				page.render({
					canvasContext: context,
					viewport: viewport
				}).promise.then(() => {
					this.pdfThumbnails[pdfUrl] = canvas.toDataURL('image/jpeg');
				}).catch((error: Error) => {
					console.error('Error rendering PDF page:', error);
					this.pdfLoadError = true;
				});
			}).catch((error: Error) => {
				console.error('Error getting PDF page:', error);
				this.pdfLoadError = true;
			});
		}).catch((error: Error) => {
			console.error('Error loading PDF:', error);
			this.pdfLoadError = true;
		});
	}

	previousResumes() {
		this.resumeService.getCoverLetterHistories().subscribe((res: ResumeHistory[]) => {
			this.resumeHistory = res;
			// Load thumbnails for all PDFs immediately
			this.resumeHistory.forEach((resume: ResumeHistory) => {
				if (resume.pdf_name) {
					this.loadPdfThumbnail(resume.pdf_name);
				}
			});
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
			this.submitted = false
			this.nextStage()
		}
	}

	getVisibleFormControls(): AbstractControl[] {
		// form validation
		const controls: AbstractControl[] = []
		let controlNames: any = []
		if (this.moduleActiveIndex === 0) {
			controlNames = ["user_name", "user_job_title", "user_email", "user_location", "user_phone", "org_name", "org_location", "user_summary"]
		}
		// else if (this.moduleActiveIndex === 1) {
		// 	controlNames = ["org_name", "org_location", "jobposition"]
		// } else if (this.moduleActiveIndex === 2) {
		// 	controlNames = ["user_summary"]
		// }
		controlNames.forEach((controlName: any) => {
			const control = this.resumeFormInfoData.get(controlName)
			if (control) {
				controls.push(control)
			}
		})
		return controls
	}

	nextStage() {
		// if (this.moduleActiveIndex < 2) {
		// 	this.moduleActiveIndex++
		// 	return
		// } else {
		// 	this.activePageIndex++
		// }
		this.activePageIndex++
	}

	prevStage() {
		if (this.moduleActiveIndex > 0) {
			this.moduleActiveIndex--
			return
		}
	}

	// hideHeader() {
	// 	if (this.activePageIndex == 2) {
	// 		this.resumeService.setData(true)
	// 	} else {
	// 		this.resumeService.setData(false)
	// 	}
	// }

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
			this.ngAfterViewInit()
		}
	}

	next() {
		if (this.authService.isInvalidSubscription('career_tools')) {
			this.authService.hasUserSubscription$.next(true);
			return;
		}
		this.activePageIndex++
		if (this.activePageIndex == 1) {
			this.ngAfterViewInit()
		}
	}

	downloadResume() {
		if (this.planExpired) {
			this.authService.hasUserSubscription$.next(true);
			return
		}
		let formData = this.resumeFormInfoData.value
		const userSummary = formData.user_summary;
		//this user summary contains &nbsp; when we edit the content so removed the &nbsp; manually.
		const cleanedContent = cleanHtmlContent(userSummary);

		function cleanHtmlContent(html: string): string {
			return html
				.replace(/<p>(&nbsp;|\s)*<\/p>/g, '') // remove empty or space-only paragraphs
				.replace(/&nbsp;/g, ' ')              // convert non-breaking spaces to regular spaces
				.trim();
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
			this.ngAfterViewInit()
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
	chatGptValueSave: any
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
			if (mode == 'generate_description') {
				// this.resumeFormInfoData.patchValue({
				// 	job_description: "",
				// })
				this.rephraseDesBtnDisable = true;
				this.generateDesBtnDisable = false;
				this.chatGptButtonLoader = true;
			} else if (mode == 'rephrase_description') {
				this.rephraseDesBtnDisable = false;
				this.generateDesBtnDisable = true;
				this.chatGptButtonLoader = true;
			} else if (mode == 'generate_summary') {
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

					if (mode == 'generate_description' || mode == 'rephrase_description') {
						// this.resumeFormInfoData.patchValue({
						// 	job_description: GPTResponse,
						// })
					} else if (mode == 'generate_summary' || mode == 'rephrase_summary') {
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
		// this.hideHeader()
		this.selectedResumeLevel = templateName
		this.imgOnclick(templateName)
	}

	imgOnclick(resumeLevel: any) {
		this.isButtonDisabledSelectTemplate = true
		this.selectedResumeLevel = resumeLevel
	}
	// searchJob(event: Event): void {
	// 	const input = event.target as HTMLInputElement;
	// 	const query = input.value.toLowerCase().trim();
	// 	if (query && query.length > 3) {
	// 		const mockJobs = this.jobRoles;
	// 		// Filter jobs that include the query
	// 		this.filterJobRole = mockJobs.filter((job: any) =>
	// 			job.jobrole.toLowerCase().includes(query)
	// 		);
	// 		if(this.filterJobRole.length === 0){
	// 			this.filterJobRole.unshift({
	// 				id: 0, // Use 0 or -1 to indicate it's a custom/new item
	// 				jobrole: query
	// 			});
	// 		}else{
	// 			// Sort the filtered jobs to prioritize exact matches
	// 			this.filterJobRole.sort((a: any, b: any) => {
	// 				const aJob = a.jobrole.toLowerCase();
	// 				const bJob = b.jobrole.toLowerCase();
	// 				if (aJob === query && bJob !== query) {
	// 					return -1; // a comes first
	// 				} else if (aJob !== query && bJob === query) {
	// 					return 1; // b comes first
	// 				} else if (aJob.startsWith(query) && !bJob.startsWith(query)) {
	// 					return -1; // a comes first if it starts with the query
	// 				} else if (!aJob.startsWith(query) && bJob.startsWith(query)) {
	// 					return 1; // b comes first if it starts with the query
	// 				} else {
	// 					return 0; // Keep original order for other cases
	// 				}
	// 			});
	// 		}
	// 	} else if (query.length < 1) {
	// 		this.filterJobRole = [];
	// 	}
	// }
	jobRoles: JobTitle[] = [];
	getJobRoles() {
		this.cvBuilderService.getJobList().subscribe({
			next: (response: any) => {
				this.jobRoles = response;
			}
		})
	}
	// setJobtitle(jobRoleId: number, jobRoleLabel: string) {
	// 	// this.selectedData[1] = jobRoleId;
	// 	this.resumeFormInfoData.patchValue({
	// 		user_job_title: jobRoleLabel
	// 	})
	// 	this.filterJobRole = [];
	// }
	// searchJobPosition(event: Event): void {
	// 	const input = event.target as HTMLInputElement;
	// 	const query = input.value.toLowerCase().trim();
	// 	if (query && query.length > 3) {
	// 		const mockJobs = this.jobRoles;

	// 		// Filter jobs that include the query
	// 		this.filterJobRolePostionApplied = mockJobs.filter((job: any) =>
	// 			job.jobrole.toLowerCase().includes(query)
	// 		);

	// 		// Sort the filtered jobs to prioritize exact matches
	// 		this.filterJobRolePostionApplied.sort((a: any, b: any) => {
	// 			const aJob = a.jobrole.toLowerCase();
	// 			const bJob = b.jobrole.toLowerCase();
	// 			if (aJob === query && bJob !== query) {
	// 				return -1; // a comes first
	// 			} else if (aJob !== query && bJob === query) {
	// 				return 1; // b comes first
	// 			} else if (aJob.startsWith(query) && !bJob.startsWith(query)) {
	// 				return -1; // a comes first if it starts with the query
	// 			} else if (!aJob.startsWith(query) && bJob.startsWith(query)) {
	// 				return 1; // b comes first if it starts with the query
	// 			} else {
	// 				return 0; // Keep original order for other cases
	// 			}
	// 		});
	// 	} else if (query.length < 1) {
	// 		this.filterJobRolePostionApplied = [];
	// 	}
	// }
	// setJobtitlePositiApplied(jobRoleId: number, jobRoleLabel: string) {
	// 	this.resumeFormInfoData.patchValue({
	// 		jobposition: jobRoleLabel
	// 	})
	// 	this.filterJobRolePostionApplied = [];
	// }
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
			this.toaster.add({
				severity: 'warn',
				summary: 'Empty',
				detail: `Please Type Something..!`
			});
			return;
		}
		const customValue = input.value.trim();
		const exists = this.jobRoles.some(
			(job: any) => job.jobrole.toLowerCase() === customValue.toLowerCase()
		);
		if (exists) {
			this.toaster.add({
				severity: 'warn',
				summary: 'Duplicate',
				detail: `Job title "${customValue}" already exists`
			});
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

		this.toaster.add({
			severity: 'success',
			summary: 'Added',
			detail: `Job title "${customValue}" added`
		});
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
