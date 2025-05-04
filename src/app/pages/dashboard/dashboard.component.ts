import { InputGroupModule } from 'primeng/inputgroup';
import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy, ElementRef } from "@angular/core"
import { DashboardService } from "./dashboard.service"
import { AuthService } from "../../Auth/auth.service"
import { SubSink } from "subsink"
import { Router } from "@angular/router"
import { DataService } from "src/app/data.service"
import { combineLatest, forkJoin, of } from "rxjs"
import { catchError, map, tap } from "rxjs/operators"
import { Carousel } from "primeng/carousel"
import { LocationService } from "src/app/location.service"
import { CommonModule } from "@angular/common"
import { DialogModule } from "primeng/dialog"
import { CarouselModule } from "primeng/carousel"
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms"
import { ButtonModule } from "primeng/button"
import { TooltipModule } from "primeng/tooltip"
import { RouterModule } from "@angular/router"
import { SelectModule } from "primeng/select"
import { StorageService } from "../../storage.service";
import { JobSearchService } from "../job-search/job-search.service"
import { CalendarModule } from "primeng/calendar"
import { DatePickerModule } from "primeng/datepicker"
import { InputTextModule } from "primeng/inputtext"
import { AccordionModule } from "primeng/accordion"
import { TableModule } from "primeng/table"
import { TabViewModule } from "primeng/tabview"
import { MessageService } from "primeng/api"
import { InputGroupAddonModule } from "primeng/inputgroupaddon"
import { SeoManagerComponent } from 'src/app/components/seo-manager/seo-manager.component';
import { PopoverModule } from 'primeng/popover';
import { TextareaModule } from 'primeng/textarea';

@Component({
	selector: "uni-dashboard",
	templateUrl: "./dashboard.component.html",
	styleUrls: ["./dashboard.component.scss"],
	standalone: true,
	imports: [CommonModule, DialogModule, CarouselModule, InputGroupAddonModule, InputGroupModule, FormsModule, ButtonModule,
		TooltipModule, RouterModule, SelectModule,
		CalendarModule, DatePickerModule, InputTextModule, TabViewModule, TableModule, AccordionModule, ReactiveFormsModule,
		PopoverModule, TextareaModule
	],
	providers: [DashboardService, AuthService, DataService, LocationService, SeoManagerComponent],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit, OnChanges, OnDestroy {
	@ViewChild("op") op!: ElementRef<HTMLInputElement>
	private subs = new SubSink()
	userName: any
	responsiveOptions: any
	selectedCountryName: any
	readingProgressings: any
	countryLists: any = []
	quizProgressings: any = []
	continueReading = "none"
	continueQuiz = "none"
	sendInvite: any = ""
	isVideoVisible: boolean = false
	isShareWithSocialMedia: boolean = false
	isViewMoreOrgVisible: boolean = false
	isViewMoreJobApplication: boolean = false;
	partnerTrusterLogo: any
	enableReading!: boolean
	showSkeleton: boolean = false
	planExpired: boolean = false
	ehitlabelIsShow: boolean = true
	imagewhitlabeldomainname: any
	orgnamewhitlabel: any
	orglogowhitelabel: any
	@ViewChild("carousel") carousel!: Carousel
	groupedListFav: any[] = [];
	groupedListFav2: any[] = [];
	date: Date = new Date();
	cvBuilderPercentage: number = 0;
	talentConnectPercentage: number = 0;
	totalPercentage: number = 0;
	isShowingCompletion: boolean = false;
	university: any[] = [
		{
			image: "../../../uniprep-assets/images/icons/university1.svg",
		},
		{
			image: "../../../uniprep-assets/images/icons/university2.svg",
		},
		{
			image: "../../../uniprep-assets/images/icons/university3.svg",
		},
		{
			image: "../../../uniprep-assets/images/icons/university3.svg",
		},
		{
			image: "../../../uniprep-assets/images/icons/university3.svg",
		},
	]
	selectedCountryId: number = 1
	headerFlag!: string
	currentModuleSlug: any
	userData: any
	recentJobApplication: any[] = [];
	currentMonth: number;
	currentYear: number;
	daysInMonth: number[] = [];
	usageData: any[] = [];
	monthName: string = '';
	weekdays: string[] = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
	firstDayIndex: number = 0;
	isNoApplicationsData: boolean = true;
	reportOptionNgModel: number = 21;
	reportType: number = 1
	reportOptionList: any[] = [
		{
			"id": 21,
			"reportoption_name": "General Suggestions",
			"status": 1,
			"reporttype": 1,
			"created_at": null,
			"updated_at": null
		},
	]
	public reportSubmitForm!: FormGroup
	constructor(private dashboardService: DashboardService, private service: AuthService, private router: Router,
		private dataService: DataService, private authService: AuthService, private locationService: LocationService,
		private cdr: ChangeDetectorRef, private storage: StorageService, private jobSearchService: JobSearchService,
		private toastr: MessageService, private seoManagerComponent: SeoManagerComponent, private formBuilder: FormBuilder,
	) {
		this.reportSubmitForm = this.formBuilder.group({
			reportOption: [""],
			comment: ["", []],
		})
		this.responsiveOptions = [
			{
				breakpoint: '1280px',
				numVisible: 4,
				numScroll: 4
			},
			{
				breakpoint: '1024px',
				numVisible: 3,
				numScroll: 3
			},
			{
				breakpoint: '768px',
				numVisible: 2,
				numScroll: 2
			},
			{
				breakpoint: '560px',
				numVisible: 1,
				numScroll: 1
			}
		]
		const today = new Date();
		this.currentMonth = today.getMonth();
		this.currentYear = today.getFullYear();
		this.monthName = today.toLocaleString('default', { month: 'long' });
		this.generateDays();
	}

	fieldsToCheck = ["name", "email", "phone", "home_country_id", "selected_country", "location_id", "last_degree_passing_year", "intake_year_looking", "intake_month_looking", "programlevel_id"]

	ngOnInit(): void {
		// Initialize essential data first
		this.initializeEssentialData();
		this.recentJobs();
		this.getUserTrackin();
		this.loadParallelData();
		this.groupedListFav = this.chunkArray(this.listFav, 4);
		this.groupedListFav2 = this.chunkArray(this.recentJobApplication, 2);
		this.locationService.dashboardLocationList().subscribe((countryList: any) => {
			this.countryLists = countryList
		});
		this.seoManagerComponent.updateDynamicContent('UNIPREP | Your Gateway to International Education, Career Success & Entrepreneurship');
	}

	recentJobs() {
		this.dashboardService.RecentJobApplication().subscribe({
			next: (data: any) => {
				this.recentJobApplication = data.jobs
				this.groupedListFav2 = this.chunkArray(this.recentJobApplication, 2);
				if (this.recentJobApplication.length == 0) {
					this.isNoApplicationsData = true;
				} else {
					this.isNoApplicationsData = false;
				}
				this.cdr.detectChanges();
			},
			error: (error) => {
				console.error('Error fetching job listings:', error);
			}
		});
	}
	chunkArray(array: any[], size: number): any[] {
		const result = [];
		for (let i = 0; i < array.length; i += size) {
			result.push(array.slice(i, i + size));
		}
		return result;
	}

	private initializeEssentialData(): void {
		this.selectedCountryId = Number(this.storage.get("countryId"));
		this.storage.set("currentmodulenameforrecently", "");


		this.cdr.detectChanges();
	}

	private loadParallelData(): void {
		const whitelabelData$ = forkJoin({
			logo: this.locationService.getImage(),
			orgName: this.locationService.getOrgName()
		}).pipe(
			catchError(() => of({ logo: null, orgName: null }))
		);

		const mainData$ = forkJoin({
			partnerLogo: this.dashboardService.getTrustedPartners().pipe(catchError(() => of(null))),
			userData: this.service.getMe().pipe(catchError(() => of(null))),
			countryList: this.locationService.dashboardLocationList().pipe(catchError(() => of([]))),
			planStatus: this.service.getNewUserTimeLeft().pipe(catchError(() => of(null))),
			readProgression: this.dashboardService.getReadProgression({ countryId: this.selectedCountryId }).pipe(catchError(() => of(null))),
			quizCompletion: this.dashboardService.checkModuleQuizCompletion({ countryid: this.selectedCountryId }).pipe(catchError(() => of(null)))
		});

		// Subscribe to whitelabel data
		this.subs.sink = whitelabelData$.subscribe(({ logo, orgName }) => {
			this.orglogowhitelabel = logo;
			this.orgnamewhitlabel = orgName;
			this.cdr.markForCheck();
		});

		// Subscribe to main data

		this.subs.sink = mainData$.subscribe(({
			partnerLogo,
			userData,
			countryList,
			planStatus,
			readProgression,
			quizCompletion
		}) => {
			// Handle partner logo
			this.partnerTrusterLogo = partnerLogo;

			// Handle user data
			if (userData) {
				this.handleUserData(userData);
			}

			// Handle country list
			if (countryList) {
				this.handleCountryList(countryList);
			}

			// Handle plan status
			if (planStatus) {
				this.handlePlanStatus(planStatus);
			}

			// Handle read progression
			if (readProgression && readProgression.success) {
				const percentage = Math.round(readProgression.readpercentage) || 0;
				this.setProgress1(percentage);
				this.progressReading = percentage;
				this.certificatecountstudent = readProgression.certificatecount || 0;
			}

			// Handle quiz completion
			if (quizCompletion) {
				this.quizpercentage = quizCompletion.progress;
			}

			this.cdr.markForCheck();
		});
	}

	private handleUserData(userData: any): void {
		this.userName = userData.userdetails[0].name.toString();
		this.userData = userData.userdetails[0];

		let filledCount = 0;
		const totalCount = this.fieldsToCheck.length;

		this.fieldsToCheck.forEach((field) => {
			if (this.userData[field] != null && this.userData[field] !== undefined && this.userData[field] !== "") {
				filledCount++;
			}
		});

		this.progress = Math.round((filledCount / totalCount) * 100);
		this.setProgress(Math.round((filledCount / totalCount) * 100));
	}

	private handleCountryList(countryList: any[]): void {
		this.carousel.page = 0;
		this.countryLists = countryList;

		// Find selected country
		const selectedCountry = this.countryLists.find((element: any) => element.id == this.selectedCountryId);
		if (selectedCountry) {
			this.selectedCountryName = selectedCountry.country;
			this.headerFlag = selectedCountry.flag;

			// Move selected country to start of list
			this.countryLists = [
				selectedCountry,
				...this.countryLists.filter((item: any) => item.id !== this.selectedCountryId)
			];
		}
	}

	private handlePlanStatus(response: any): void {
		const data = response.time_left;
		this.planExpired = data.plan === "expired" || data.plan === "subscription_expired";
		this.enableReading = !this.planExpired;
	}

	ngOnDestroy(): void {
		this.subs.unsubscribe();
		this.seoManagerComponent.updateDynamicContent("UNIPREP | Your Gateway to International Education, Career Success & Entrepreneurship");
	}

	certificatecountstudent: number = 0
	loadApiData(): void {
		const data = {
			countryId: this.selectedCountryId,
		}

		combineLatest(this.dashboardService.getReadProgression({ countryId: this.selectedCountryId })).subscribe(([readProgression]) => {
			if (readProgression && readProgression.success) {
				const percentage = Math.round(readProgression.readpercentage) || 0;
				this.setProgress1(percentage);
				this.progressReading = percentage;
				this.certificatecountstudent = readProgression.certificatecount || 0;
			}
		});
	}

	closeReading(): void {
		this.continueReading = "none"
	}

	openReading(): void {
		let data = {
			countryId: this.selectedCountryId,
		}

		this.dashboardService.getModuleReadProgression(data).subscribe((response) => {
			this.readingProgressings = response.module
			this.continueReading = "block"
		})
	}

	closeQuiz(): void {
		this.continueQuiz = "none"
	}

	openQuiz(): void {
		// dont remove comments
		if (this.planExpired) {
			this.authService.hasUserSubscription$.next(true);
			return
		}

		this.router.navigate([`pages/modules/quizmodule`])
	}

	selectCountry(selectedId: any): void {
		this.countryLists.forEach((element: any) => {
			if (element.id === selectedId.id) {
				this.selectedCountryName = element.country
			}
		})
		this.countryLists.forEach((item: any, i: any) => {
			if (item.id === selectedId.id) {
				this.countryLists.splice(i, 1)
				this.countryLists.unshift(item)
			}
		})

		this.storage.set("countryId", selectedId.id)
		this.storage.set("selectedCountryId", selectedId.id)
		this.loadApiData()
		this.selectedCountryId = selectedId.id
		this.dataService.changeCountryId(selectedId.id)
		this.dataService.changeCountryFlag(selectedId.flag)
		this.dataService.changeCountryName(selectedId.country)

		// Update the selected country in the dashboard service
		this.dashboardService.updateSelectedCountry(selectedId)
	}

	onClickReadProgression(data: any): void {
		let moduleName = ""
		switch (data.module_id) {
			case 1:
				moduleName = "pre-admission"
				break
			case 7:
				moduleName = "travel-and-tourism"
				break
			case 3:
				moduleName = "post-admission"
				break
			case 4:
				moduleName = "career-hub"
				break
			case 5:
				moduleName = "university"
				break
			case 6:
				moduleName = "life-at-country"
				break
			case 10:
				moduleName = "skill-mastery"
				break
			case 8:
				moduleName = "learning-hub"
				break
			case 9:
				this.router.navigate([`pages/language-hub/`])
				return
				break
			case 14:
				moduleName = "k12"
				break
		}
		this.router.navigate([`pages/modules/${moduleName}/`])
	}

	openCertificate() {
		this.router.navigate([`pages/mycertificate`])
	}

	onClickQuizProgression(data: any): void {
		let moduleName = ""
		switch (data.module_name) {
			case "Pre-Admission":
				moduleName = "pre-admission"
				break
			case "Post-Application":
				moduleName = "post-application"
				break
			case "Post-Admission":
				moduleName = "post-admission"
				break
			case "Career Hub":
				moduleName = "career-hub"
				break
			case "University":
				moduleName = "university"
				break
			case "Travel And Tourism":
				moduleName = "travel-and-tourism"
				break
			case "Life at ":
				moduleName = "life-at"
				break
			case "Skill Mastery":
				moduleName = "skill-mastery"
				break
			case "Learning Hub":
				moduleName = "learning-hub"
				break
			case "Language Hub":
				moduleName = "language-hub"
				break
		}
		this.router.navigate([`pages/${moduleName}/sub-modules/2`])
	}

	openViewMoreOrg(): void {
		this.isViewMoreOrgVisible = true;
	}
	viewMoreOpenJobApplication() {
		if (this.recentJobApplication.length > 0) {
			this.isViewMoreJobApplication = true;
		} else {
			this.isViewMoreJobApplication = false;
			this.toastr.add({ severity: 'error', summary: '', detail: "No Recent Job Applications Yet" });
		}
	}
	quizpercentage: any = 0
	checkquizquestionmodule() {
		var data = {
			countryid: this.selectedCountryId,
		}
		this.dashboardService.checkModuleQuizCompletion(data).subscribe((res) => {
			this.quizpercentage = res.progress
		})
	}

	startQuiz(moduleid: any) {
		if (moduleid == 1) {
			this.currentModuleSlug = "pre-admission"
		} else if (moduleid == 3) {
			this.currentModuleSlug = "post-admission"
		} else if (moduleid == 4) {
			this.currentModuleSlug = "career-hub"
		} else if (moduleid == 6) {
			this.currentModuleSlug = "life-at-country"
		} else if (moduleid == 7) {
			this.currentModuleSlug = "travel-and-tourism"
		}
		this.router.navigate([`/pages/modules/${this.currentModuleSlug}/quiz`])
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

	openMyProfile() {
		this.router.navigate(["/pages/usermanagement"])
	}

	@Input() progress: number = 0
	@Input() progressReading: number = 0

	ngOnChanges(changes: SimpleChanges): void {
		if (changes["progress"]) {
			this.setProgress(this.progress)
		}
		if (changes["progressReading"]) {
			this.setProgress1(this.progressReading)
		}
	}

	setProgress(progress: number) {
		// const circle = document.querySelector(".progress-bar") as SVGCircleElement
		// const radius = circle.r.baseVal.value
		// const circumference = 2 * Math.PI * radius
		// const offset = circumference - (progress / 100) * circumference
		// circle.style.strokeDasharray = `${circumference} ${circumference}`
		// circle.style.strokeDashoffset = `${offset}`

		// be low this.progress is basic profile completion percentage and after that only fuction call. Because that fuction will give other two percentage. then after calculate overall percentage inside of that fuction api call
		this.progress = Math.max(0, Math.min(progress, 100));
		this.profileCompletion();
	}

	setProgress1(progress: number) {
		if (typeof progress !== 'number') {
			progress = 0;
		}

		const circle = document.querySelector('.progress1-ring__circle') as SVGCircleElement;
		if (!circle) {
			// console.warn('Progress ring circle element not found');
			return;
		}

		const radius = circle.r.baseVal.value;
		const circumference = radius * 2 * Math.PI;

		circle.style.strokeDasharray = `${circumference} ${circumference}`;
		circle.style.strokeDashoffset = `${circumference}`;

		const offset = circumference - (progress / 100) * circumference;
		circle.style.strokeDashoffset = offset.toString();
	}

	listFav: any[] = [
		{
			"id": 1,
			"moduleName": "CV Builder",
			"Description": "Craft a standout CV that highlights your skills and experience, ready for any job application.",
			"tooltip": "Craft a standout CV that highlights your skills and experience, ready for any job application.",
			"imageLink": "https://api.uniprep.ai/uniprepapi/storage/app/public/resources-coverimage/CV.png",
			"mode": "cv-builder",
			"url": "/pages/job-tool/cv-builder",
			"module": "Career Tools"
		},
		{
			"id": 2,
			"moduleName": "Learning Hub",
			"Description": "Craft a standout CV that highlights your skills and experience, ready for any job application.",
			"tooltip": "Craft a standout CV that highlights your skills and experience, ready for any job application.",
			"imageLink": "https://api.uniprep.ai/uniprepapi/storage/app/public/resources-coverimage/LearningHub.svg",
			"mode": "cv-builder",
			"url": "/pages/modules/learning-hub",
			"module": ""
		},
		// {
		// 	"id": 3,
		// 	"moduleName": "Job Portal",
		// 	"Description": "Craft a standout CV that highlights your skills and experience, ready for any job application.",
		// 	"tooltip": "Craft a standout CV that highlights your skills and experience, ready for any job application.",
		// 	"imageLink": "https://api.uniprep.ai/uniprepapi/storage/app/public/resources-coverimage/JobPortal.svg",
		// 	"mode": "cv-builder",
		// 	"url": "/pages/job-portal/job-search",
		// 	"module":""
		// },
		{
			"id": 4,
			"moduleName": "Career Planner",
			"Description": "Craft a standout CV that highlights your skills and experience, ready for any job application.",
			"tooltip": "Craft a standout CV that highlights your skills and experience, ready for any job application.",
			"imageLink": "https://api.uniprep.ai/uniprepapi/storage/app/public/resources-coverimage/CareerPlanner.svg",
			"mode": "cv-builder",
			"url": "/pages/job-tool/careerplannercountrywise",
			"module": "Career Tools"
		},
		{
			"id": 5,
			"moduleName": "Employer Test",
			"Description": "Craft a standout CV that highlights your skills and experience, ready for any job application.",
			"tooltip": "Craft a standout CV that highlights your skills and experience, ready for any job application.",
			"imageLink": "https://api.uniprep.ai/uniprepapi/storage/app/public/resources-coverimage/EmployerTest.svg",
			"mode": "cv-builder",
			"url": "/pages/job-tool/list/employer-test/13",
			"module": ""
		},
		{
			"id": 6,
			"moduleName": "Pitch Deck",
			"Description": "Craft a standout CV that highlights your skills and experience, ready for any job application.",
			"tooltip": "Craft a standout CV that highlights your skills and experience, ready for any job application.",
			"imageLink": "https://api.uniprep.ai/uniprepapi/storage/app/public/resources-coverimage/Pitchdeck.svg",
			"mode": "cv-builder",
			"url": "/pages/pitch-deck",
			"module": ""
		},
		{
			"id": 7,
			"moduleName": "UNILEARN",
			"Description": "Craft a standout CV that highlights your skills and experience, ready for any job application.",
			"tooltip": "Craft a standout CV that highlights your skills and experience, ready for any job application.",
			"imageLink": "https://api.uniprep.ai/uniprepapi/storage/app/public/resources-coverimage/UNILEARN.svg",
			"mode": "cv-builder",
			"url": "/pages/unilearn/modules",
			"module": ""
		},
		{
			"id": 8,
			"moduleName": "UNIFINDER",
			"Description": "Craft a standout CV that highlights your skills and experience, ready for any job application.",
			"tooltip": "Craft a standout CV that highlights your skills and experience, ready for any job application.",
			"imageLink": "https://api.uniprep.ai/uniprepapi/storage/app/public/resources-coverimage/UNIFINDER.svg",
			"mode": "cv-builder",
			"url": "/pages/course-list",
			"module": ""
		},
		{
			"id": 9,
			"moduleName": "UNISCHOLAR",
			"Description": "Craft a standout CV that highlights your skills and experience, ready for any job application.",
			"tooltip": "Craft a standout CV that highlights your skills and experience, ready for any job application.",
			"imageLink": "https://api.uniprep.ai/uniprepapi/storage/app/public/resources-coverimage/UNISCHOLAR.svg",
			"mode": "cv-builder",
			"url": "/pages/scholarship-list",
			"module": ""
		},
		{
			"id": 10,
			"moduleName": "Global Repository",
			"Description": "Craft a standout CV that highlights your skills and experience, ready for any job application.",
			"tooltip": "Craft a standout CV that highlights your skills and experience, ready for any job application.",
			"imageLink": "https://api.uniprep.ai/uniprepapi/storage/app/public/resources-coverimage/GlobalRepository.svg",
			"mode": "cv-builder",
			"url": "/pages/global-repo",
			"module": ""
		},
		{
			"id": 11,
			"moduleName": "AI Global Advisor",
			"Description": "Craft a standout CV that highlights your skills and experience, ready for any job application.",
			"tooltip": "Craft a standout CV that highlights your skills and experience, ready for any job application.",
			"imageLink": "https://api.uniprep.ai/uniprepapi/storage/app/public/resources-coverimage/AI Business Advisor.svg",
			"mode": "cv-builder",
			"url": "/pages/advisor",
			"module": ""
		},
		{
			"id": 12,
			"moduleName": "Language Hub",
			"Description": "Craft a standout CV that highlights your skills and experience, ready for any job application.",
			"tooltip": "Craft a standout CV that highlights your skills and experience, ready for any job application.",
			"imageLink": "https://api.uniprep.ai/uniprepapi/storage/app/public/resources-coverimage/LanguageHub.svg",
			"mode": "cv-builder",
			"url": "/pages/language-hub/languages",
			"module": ""
		}
	]

	// navigate Favourites
	selectFav(req: any) {
		this.router.navigateByUrl(req.url);
	}
	redirectToCvBuilder() {
		this.router.navigate(['/pages/job-tool/cv-builder']);
	}
	redirectToTalentConnect() {
		this.router.navigate(['/pages/talent-connect/my-profile']);
	}
	generateDays(): void {
		this.firstDayIndex = new Date(this.currentYear, this.currentMonth, 1).getDay();
		const totalDays = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
		this.daysInMonth = Array.from({ length: totalDays }, (_, i) => i + 1);
	}

	getUsageDataForDay(day: number): any {
		return this.usageData.filter(entry => entry.day === day);
	}

	getStatusClass(day: number): string {
		const usageEntries = this.getUsageDataForDay(day);
		if (usageEntries.some((entry: any) => entry.status === 'high')) return 'high';
		if (usageEntries.some((entry: any) => entry.status === 'medium')) return 'medium';
		if (usageEntries.some((entry: any) => entry.status === 'low')) return 'low';
		return 'nostatus';
	}
	getUserTrackin() {
		this.dashboardService.getUserTracking().subscribe({
			next: (data: any) => {
				data.forEach(((ele: any) => {
					var bindingdata = {
						day: parseInt(ele.date.split("-")[2], 10),
						status: ele.status,
						timeUsage: ele.usage_time
					}
					this.usageData.push(bindingdata)
					this.cdr.detectChanges();
				}))
			},
			error: (error) => {
				console.error('Error fetching job listings:', error);
			}
		});
	}
	sendInviteMail() {
		var data = {
			email: this.sendInvite
		}
		this.dashboardService.sentEmailForInviteUniPrep(data).subscribe({
			next: (data: any) => {
				this.toastr.add({ severity: 'success', summary: 'Success', detail: data.message });
				this.sendInvite = ""
			},
			error: (error) => {
				console.error('Error fetching job listings:', error);
			}
		});
	}
	profileCompletion() {
		this.dashboardService.profileCompletion().subscribe({
			next: (data: any) => {
				this.cvBuilderPercentage = data.cv_builder_completion
				this.talentConnectPercentage = data.talent_connect_completion
				this.totalPercentage = Math.floor((this.cvBuilderPercentage + this.talentConnectPercentage + this.progress) / 3);
				if (this.totalPercentage >= 60 && this.totalPercentage <= 99) {
					this.isShowingCompletion = true;
				} else {
					this.isShowingCompletion = false;
				}
				this.cdr.detectChanges();
			},
			error: (error) => {
				console.error('Error fetching job listings:', error);
			}
		});
	}

	openReportModal(op: any, event: any) {
		// this.reportType = 1
		// this.reportSubmitForm.reset()
		// this.moduleList = []
		// this.subModuleList = []
		// this.questionList = []
		// this.getModuleList()
		// this.getReportOption()
		// this.selectedGenMod = 1
		// this.onChangeModuleList(1)
		// this.onChangeSubModuleList(1)
		// this.moduleQuestionReport = []
		// this.isQuestionVisible = true
		// this.isVisibleModulesMenu = false
		op.toggle(event)
	}

	onSubmit(op: any) {

		let data = {
			reportOption: this.reportSubmitForm.value.reportOption,
			comment: this.reportSubmitForm.value.comment,
		}
		this.reportSubmitForm.patchValue({ comment: null })

		this.locationService.reportFaqQuestion(data).subscribe((res) => {
			if (res.status == 404) {
			}
			this.dataService.showFeedBackPopup(true)
			// this.showReportSuccess = true;
			setTimeout(() => {
				this.dataService.showFeedBackPopup(false)
				op.hide()
				// this.showReportSuccess = false;
			}, 3000)
			// this.locationService.reportFaqQuestionaftersubmit(maildata).subscribe((res) => { })
		})
	}
}
