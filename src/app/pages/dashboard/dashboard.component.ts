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
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms"
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
import { FavouriteList, FeatureFavourite } from './favourites-data';

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
	providers: [DashboardService, DataService, LocationService, SeoManagerComponent],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit, OnChanges, OnDestroy {
	@ViewChild("op") op!: ElementRef<HTMLInputElement>
	@ViewChild("carousel") carousel!: Carousel
	@Input() progress: number = 0
	@Input() progressReading: number = 0
	private subs = new SubSink()
	userName: any
	responsiveOptions: any
	selectedCountryName: any
	readingProgress: any
	countryLists: any = []
	continueReading = "none"
	sendInvite: any = ""
	partnerTrusterLogo: any[]=[]
	planExpired: boolean = false
	orgNameWhiteLabel: any
	orgLogoWhiteLabel: any
	groupedListFav: any[] = [];
	cvBuilderPercentage: number = 0;
	talentConnectPercentage: number = 0;
	totalPercentage: number = 0;
	isShowingCompletion: boolean = false;
	selectedCountryId: number = 1
	headerFlag!: string
	userData: any
	recentJobApplication: any[] = [];
	isNoApplicationsData: boolean = true;
	reportOptionNgModel: number = 21;
	certificatesCountStudent: number = 0
	quizPercentage: any = 0
	reportSubmitForm!: FormGroup;
	featureList: FeatureFavourite[] = FavouriteList;
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
	fieldsToCheck = ["name", "email", "phone", "home_country_id", "selected_country", "location_id", "last_degree_passing_year", "intake_year_looking", "intake_month_looking", "programlevel_id"]

	constructor(private dashboardService: DashboardService, private service: AuthService, private router: Router,
		private dataService: DataService, private authService: AuthService, private locationService: LocationService,
		private cdr: ChangeDetectorRef, private storage: StorageService, private jobSearchService: JobSearchService,
		private toaster: MessageService, private seoManagerComponent: SeoManagerComponent, private formBuilder: FormBuilder,
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
	}


	ngOnInit(): void {
		// Initialize essential data first
		this.groupedListFav = this.chunkArray(this.featureList, 4);
		this.initializeEssentialData();
		this.recentJobs();
		this.handleUserData();
		this.loadParallelData();
		this.recentCompanies();
		
		this.locationService.dashboardLocationList().subscribe((countryList: any) => {
			this.countryLists = countryList
		});
		this.seoManagerComponent.updateDynamicContent('UNIPREP | Your Gateway to International Education, Career Success & Entrepreneurship');
	}

	recentJobs() {
		this.dashboardService.RecentJobApplication().subscribe({
			next: (data: any) => {
				this.recentJobApplication = data.recent_jobs
				if (this.recentJobApplication.length == 0) {
					this.isNoApplicationsData = true;
				} else {
					this.isNoApplicationsData = false;
				}
				this.cdr.detectChanges();
			},
			error: (error) => {
				// console.error('Error fetching job listings:', error);
			}
		});
	}
	recentCompanies() {
		this.dashboardService.RecentCompanies().subscribe({
			next: (data: any) => {
				this.partnerTrusterLogo = data.companies
				this.cdr.detectChanges();
			},
			error: (error) => {
				// console.error('Error fetching job listings:', error);
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
	initializeEssentialData() {
		this.selectedCountryId = Number(this.storage.get("countryId"));
		this.storage.set("currentmodulenameforrecently", "");
		this.cdr.detectChanges();
	}
	sourceDomainData: any;
	loadParallelData() {
		// don't remove this code below commented 
		this.locationService.getSourceByDomain(window.location.hostname).subscribe((data:any) => {
            this.sourceDomainData = data
			console.log(this.sourceDomainData.logo);
			
            this.cdr.markForCheck()
        })
		const whiteLabelData$ = forkJoin({
			logo:  this.sourceDomainData.logo,
			orgName: this.sourceDomainData.name
		}).pipe(
			catchError(() => of({ logo: null, orgName: null }))
		);

		const mainData$ = forkJoin({
			partnerLogo: this.dashboardService.getTrustedPartners().pipe(catchError(() => of(null))),
			countryList: this.locationService.dashboardLocationList().pipe(catchError(() => of([]))),
			readProgression: this.dashboardService.getReadProgression({ countryId: this.selectedCountryId }).pipe(catchError(() => of(null))),
			quizCompletion: this.dashboardService.checkModuleQuizCompletion({ countryid: this.selectedCountryId }).pipe(catchError(() => of(null)))
		});

		// Subscribe to white label data
		this.subs.sink = whiteLabelData$.subscribe(({ logo, orgName }) => {
			this.orgLogoWhiteLabel = logo;
			this.orgNameWhiteLabel = orgName;
			this.cdr.markForCheck();
		});

		// Subscribe to main data

		this.subs.sink = mainData$.subscribe(({
			partnerLogo,
			countryList,
			readProgression,
			quizCompletion
		}) => {

			// Handle country list
			if (countryList) {
				this.handleCountryList(countryList);
			}

			// Handle read progression
			if (readProgression && readProgression.success) {
				const percentage = Math.round(readProgression.readpercentage) || 0;
				this.setProgress1(percentage);
				this.progressReading = percentage;
				this.certificatesCountStudent = readProgression.certificatecount || 0;
			}

			// Handle quiz completion
			if (quizCompletion) {
				this.quizPercentage = quizCompletion.progress;
			}

			this.cdr.markForCheck();
		});
	}

	handleUserData() {
		this.userName = this.authService._user?.name.toString();
		this.userData = this.authService._user;
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

	loadApiData(): void {
		const data = {
			countryId: this.selectedCountryId,
		}
		combineLatest([this.dashboardService.getReadProgression(data)]).subscribe(([readProgression]) => {
			if (readProgression && readProgression.success) {
				const percentage = Math.round(readProgression.readpercentage) || 0;
				this.setProgress1(percentage);
				this.progressReading = percentage;
				this.certificatesCountStudent = readProgression.certificatecount || 0;
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
			this.readingProgress = response.module
			this.continueReading = "block"
		})
	}
	openQuiz(): void {
		// dont remove comments
		if (this.planExpired) {
			this.authService.hasUserSubscription$.next(true);
			return;
		}
		this.router.navigate([`pages/modules/quizmodule`]);
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

	openCertificate() {
		this.router.navigate([`pages/mycertificate`])
	}

	onClickReadProgression(data: any): void {
		if (data.module_id === 9) {
			this.router.navigate(['pages/language-hub/']);
			return;
		}
		const moduleMap: { [key: number]: string } = {
			1: 'pre-admission',
			7: 'travel-and-tourism',
			3: 'post-admission',
			4: 'career-hub',
			5: 'university',
			6: 'life-at-country',
			10: 'skill-mastery',
			8: 'learning-hub',
			14: 'k12'
		};
		const moduleName = moduleMap[data.module_id];
		if (moduleName) {
			this.router.navigate([`pages/modules/${moduleName}/`]);
		}
	}

	onClickQuizProgression(data: any) {
		const moduleMap: { [key: string]: string } = {
			"Pre-Admission": "pre-admission",
			"Post-Application": "post-application",
			"Post-Admission": "post-admission",
			"Career Hub": "career-hub",
			"University": "university",
			"Travel And Tourism": "travel-and-tourism",
			"Life at ": "life-at",
			"Skill Mastery": "skill-mastery",
			"Learning Hub": "learning-hub",
			"Language Hub": "language-hub",
		};
		const moduleName = moduleMap[data.module_name] || '';
		this.router.navigate([`pages/${moduleName}/sub-modules/2`]);
	}

	openViewMoreOrg(): void {
		this.router.navigate(["/pages/talent-connect/company-connect"]);
	}

	viewMoreOpenJobApplication() {
		this.router.navigate(["/pages/talent-connect/easy-apply"]);
	}

	checkquizquestionmodule() {
		var data = {
			countryid: this.selectedCountryId,
		}
		this.dashboardService.checkModuleQuizCompletion(data).subscribe((res) => {
			this.quizPercentage = res.progress
		})
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

	sendInviteMail() {
		var data = {
			email: this.sendInvite
		}
		this.dashboardService.sentEmailForInviteUniPrep(data).subscribe({
			next: (data: any) => {
				this.toaster.add({ severity: 'success', summary: 'Success', detail: data.message });
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
			setTimeout(() => {
				this.dataService.showFeedBackPopup(false)
				op.hide()
			}, 3000)
		})
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes["progress"]) {
			this.setProgress(this.progress)
		}
		if (changes["progressReading"]) {
			this.setProgress1(this.progressReading)
		}
	}

	setProgress(progress: number) {
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

	ngOnDestroy(): void {
		this.subs.unsubscribe();
		this.seoManagerComponent.updateDynamicContent("UNIPREP | Your Gateway to International Education, Career Success & Entrepreneurship");
	}
}
