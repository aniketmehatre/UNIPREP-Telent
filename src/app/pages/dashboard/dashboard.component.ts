import { InputGroupModule } from 'primeng/inputgroup';
import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy, ElementRef, signal, inject } from "@angular/core"
import { DashboardService } from "./dashboard.service"
import { AuthService } from "../../Auth/auth.service"
import { SubSink } from "subsink"
import { ActivatedRoute, Router } from "@angular/router"
import { DataService } from "src/app/services/data.service"
import { combineLatest, forkJoin, of } from "rxjs"
import { catchError, map, tap } from "rxjs/operators"
import { Carousel } from "primeng/carousel"
import { LocationService } from "src/app/services/location.service"
import { CommonModule } from "@angular/common"
import { DialogModule } from "primeng/dialog"
import { CarouselModule } from "primeng/carousel"
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms"
import { ButtonModule } from "primeng/button"
import { TooltipModule } from "primeng/tooltip"
import { RouterModule } from "@angular/router"
import { SelectModule } from "primeng/select"
import { StorageService } from "../../services/storage.service";
import { JobSearchService } from "../job-search/job-search.service"
import { DatePickerModule } from "primeng/datepicker"
import { InputTextModule } from "primeng/inputtext"
import { AccordionModule } from "primeng/accordion"
import { TableModule } from "primeng/table"
import { TabsModule } from 'primeng/tabs'
import { MessageService } from "primeng/api"
import { InputGroupAddonModule } from "primeng/inputgroupaddon"

import { PopoverModule } from 'primeng/popover';
import { TextareaModule } from 'primeng/textarea';
import { FavouriteList, FeatureFavourite } from './favourites-data';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TalentConnectService } from '../talent-connect/talent-connect.service';
import { LocalStorageService } from 'ngx-localstorage';

@Component({
	selector: "uni-dashboard",
	templateUrl: "./dashboard.component.html",
	styleUrls: ["./dashboard.component.scss"],
	standalone: true,
	imports: [CommonModule, DialogModule, CarouselModule, InputGroupAddonModule, InputGroupModule, FormsModule, ButtonModule,
		TooltipModule, RouterModule, SelectModule, DatePickerModule, InputTextModule,  TableModule, AccordionModule, ReactiveFormsModule,
		PopoverModule, TextareaModule
	],
	providers: [DashboardService, DataService, LocationService],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit, OnChanges, OnDestroy {
	private storage = inject(LocalStorageService);

	@ViewChild("op") op!: ElementRef<HTMLInputElement>
	@ViewChild("carousel") carousel!: Carousel
	@Input() progress: number = 0
	private subs = new SubSink()
	userName: any
	responsiveOptions: any
	responsiveOptions1: any;
	sendInvite: any = ""
	partnerTrusterLogo: any[] = []
	groupedListFav: any[] = [];
	cvBuilderPercentage: number = 0;
	talentConnectPercentage: number = 0;
	totalPercentage: number = 0;
	isShowingCompletion: boolean = false;
	userData: any
	recentJobApplication: any[] = [];
	isNoApplicationsData: boolean = true;
	reportOptionNgModel: number = 21;
	reportSubmitForm!: FormGroup;
	featureList: FeatureFavourite[] = FavouriteList;
	userBasedVideo: any;
	isProfileCreated: boolean = false;
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
	safeSrc: SafeResourceUrl;
	fieldsToCheck = ["name", "email", "phone", "home_country_id", "selected_country", "location_id", "last_degree_passing_year", "intake_year_looking", "intake_month_looking", "programlevel_id"]
	viewAllJobAndCompanies: boolean = false;
	constructor(private dashboardService: DashboardService, private service: AuthService, private router: Router,
		private dataService: DataService, private authService: AuthService, private locationService: LocationService,
		private cdr: ChangeDetectorRef, private toaster: MessageService,
		private formBuilder: FormBuilder, private sanitizer: DomSanitizer, private route: ActivatedRoute, private talentConnectService: TalentConnectService
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
		],
		this.responsiveOptions1 = [
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
				numVisible: 1,
				numScroll: 1
			},
			{
				breakpoint: '560px',
				numVisible: 1,
				numScroll: 1
			}
		]
	}

	jobId: any
	ngOnInit() {
		this.route.queryParamMap.subscribe(params => {
			const token = params.get('token');
			if (token) {
				// Store token somewhere (service, localStorage, etc.)
				console.log('Token from URL:', token);

				// ✅ Remove token from URL without reloading
				this.router.navigate([], {
					relativeTo: this.route,
					queryParams: {},
					replaceUrl: true
				});
			}
			this.jobId = this.storage.get('jobId');
			if (!this.jobId) {
				this.router.navigate([this.storage.get('jobId')], { replaceUrl: true })
			}
		});
		// Initialize essential data first
		this.checkIfProfileCreated();
		this.apiToCheckPartnerOrInstitute()
		this.groupedListFav = this.chunkArray(this.featureList, 4);
		this.recentJobs();
		this.recentCompanies();
		this.handleUserData();
		// SEO is now handled statically in index.html
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
	sourceDomainData: any;

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

	openQuiz(): void {
		this.router.navigate([`pages/modules/quizmodule`]);
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

	openViewMoreOrg(): void {
		if (this.isProfileCreated) {
			this.router.navigate(["/pages/talent-connect/company-connect"]);
		} else {
			this.viewAllJobAndCompanies = true;
		}
	}

	viewMoreOpenJobApplication() {
		if (this.isProfileCreated) {
			this.router.navigate(["/pages/talent-connect/easy-apply"]);
		} else {
			this.viewAllJobAndCompanies = true;
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
	}

	setProgress(progress: number) {
		this.progress = Math.max(0, Math.min(progress, 100));
		this.profileCompletion();
	}
	ngOnDestroy(): void {
		this.subs.unsubscribe();
		// SEO is now handled statically in index.html
	}

	apiToCheckPartnerOrInstitute() {
		this.locationService.getSourceByDomain(window.location.hostname).subscribe((response) => {
			// if (response.source == 'Institute') {
			// 	this.userBasedVideo = 'https://www.youtube.com/embed/42B2CeFKC3U?si=RXhsz-ipwODqBY1E'
			// } else if (response.source == 'Partner') {
			// 	this.userBasedVideo = 'https://www.youtube.com/embed/uWcCcFtEKs0?si=Foe4DmyoqDwndpy5'
			// } else {
			// 	this.userBasedVideo = 'https://www.youtube.com/embed/AAXUZ0z5bl0?si=xAFiTKSQGhHrQ9iE'
			// }
			this.userBasedVideo = 'https://www.youtube.com/embed/opXvLo1OS_o?si=m4-GWVTIIk1yXwuK'
			this.safeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(this.userBasedVideo);
		})
	}
	checkIfProfileCreated() {
		if(this.talentConnectService._employerProfileData?.profile_completion_flag) {
			this.isProfileCreated = true;
		}
	}
	redirectEmployerProfile() {
		this.router.navigate(["/pages/talent-connect/my-profile"]);
	}
}
