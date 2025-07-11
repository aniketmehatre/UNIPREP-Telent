import { Component, ElementRef, HostListener, OnInit, Pipe, PipeTransform, ViewChild } from "@angular/core"
import { Observable } from "rxjs"
import { ReadQuestion } from "../../../@Models/read-question.model"
import { MenuItem, MessageService } from "primeng/api"
import { ModuleServiceService } from "../../module-store/module-service.service"
import { ModuleStoreService } from "../../module-store/module-store.service"
import { DataService } from "../../../data.service"
import { ActivatedRoute, Router, RouterModule } from "@angular/router"
import { CommonModule, Location } from "@angular/common"
import { DomSanitizer, Meta, SafeResourceUrl, Title } from "@angular/platform-browser"
import { Carousel, CarouselModule } from "primeng/carousel"
import { AuthService } from "src/app/Auth/auth.service"
import { NgxUiLoaderService } from "ngx-ui-loader"
import { PageFacadeService } from "../../page-facade.service"
import { LocationService } from "src/app/location.service"
import { MarkdownService } from "ngx-markdown"
import { DialogModule } from "primeng/dialog"
import { CardModule } from "primeng/card"
import { PaginatorModule } from "primeng/paginator"
import { SkeletonModule } from "primeng/skeleton"
import { TooltipModule } from "primeng/tooltip"
import { ButtonModule } from "primeng/button"
import { MultiSelectModule } from "primeng/multiselect"
import { InputGroupModule } from "primeng/inputgroup"
import { InputGroupAddonModule } from "primeng/inputgroupaddon"
import { StorageService } from "../../../storage.service";
import { SocialShareService } from "src/app/shared/social-share.service"

@Component({
	selector: "uni-question-list",
	templateUrl: "./question-list.component.html",
	styleUrls: ["./question-list.component.scss"],
	providers: [MarkdownService],
	standalone: true,
	imports: [CommonModule, RouterModule, DialogModule, CardModule, PaginatorModule, SkeletonModule, TooltipModule,
		ButtonModule, MultiSelectModule, CarouselModule, InputGroupModule, InputGroupAddonModule],
})
export class QuestionListComponent implements OnInit {
	@ViewChild("carouselVideoElm") carouselVideoElm: any
	@ViewChild("carouselRefElm") carouselRefElm: any
	@ViewChild("carouselPopupVideoElm") carouselPopupVideoElm: any
	@ViewChild("carouselPopupRefElm") carouselPopupRefElm: any
	@ViewChild("videoLinksContainer") videoLinksContainer!: ElementRef
	@ViewChild("refLinksContainer") refLinksContainer!: ElementRef
	@ViewChild("videoFrame") videoFrame: ElementRef | undefined
	readQue$!: Observable<ReadQuestion[]>
	selectedQuestion: number = 0
	selectedQuestionId: number = 0
	selectedModule: number = 0
	selectedSubModule: number = 0
	positionNumber: number = 0
	data: any
	breadCrumb: MenuItem[] = []
	isQuestionAnswerVisible: boolean = false
	isRecommendedLinksVisible: boolean = false
	isRecommendedVideoVisible: boolean = false
	isReviewedByVisible: boolean = false
	isAnswerDialogVisiblePrev: boolean = false
	isAnswerDialogVisibleNext: boolean = false
	responsiveOptions: any[] = []
	message: string = ""
	moduleName: any
	subModuleId: any
	videoLinks: any[] = []
	refLink: any[] = []
	countryId: any
	selectedQuestionData: any
	popUpItemVideoLink: any
	reviewedByOrgList: any
	currentSubModuleSlug: any
	currentModuleName: any
	currentModuleId: any
	currentApiSlug: any
	tooltip: any
	questionListData: any[] = []
	pageno: number = 1
	perpage: number = 25
	totalQuestionCount: any
	oneQuestionContent: any
	planExpired: boolean = false
	isSkeletonVisible: boolean = true
	showVideoPopup: boolean = false
	selectedVideoLink: any | null = null
	allDataSet: any[] = []
	countryFlag: any
	sharedCountry: number = 0
	currentModuleSlug: any
	quizpercentage: any = 0
	howItWorksVideoLink: string = ""
	quizmoduleselectcountryidsetzero: any = 0
	@ViewChild("op", { static: false, read: ElementRef }) elRef: any
	homeCountryLogo: any
	learningHubMainModuleName: any
	learningHubQuizBreadCrumb: any
	@ViewChild('scrollContainer') scrollContainer!: ElementRef;
	@ViewChild('scrollContainerlink') scrollContainerlink!: ElementRef;
	vediolink: any[] = [];
	weblink: any[] = [];
	isHidGlobalRepository: boolean = true;
	private scrollInterval: any;
	constructor(private moduleListService: ModuleServiceService, private mService: ModuleServiceService,
		private moduleStoreService: ModuleStoreService, private dataService: DataService,
		private route: ActivatedRoute, private _location: Location, private _sanitizer: DomSanitizer,
		private router: Router, private ngxService: NgxUiLoaderService, private authService: AuthService,
		private sanitizer: DomSanitizer, private meta: Meta, private toast: MessageService,
		private pageFacade: PageFacadeService, private locationService: LocationService,
		private title: Title, private storage: StorageService,
		private socialShareService: SocialShareService) {
		Carousel.prototype.changePageOnTouch = (e, diff) => { }
		Carousel.prototype.onTouchMove = () => { }
	}

	loopRange = Array.from({ length: 24 })
		.fill(0)
		.map((_, index) => index)
	ngOnInit(): void {

		this.storage.set("modalcountryid", this.quizmoduleselectcountryidsetzero)
		this.countryId = Number(this.storage.get("countryId"))
		this.sharedCountry = Number(this.storage.get("countryId"))
		this.route.params.subscribe((params) => {
			let socialShare: any = document.getElementById("socialSharingList")
			if (socialShare) {
				socialShare.style.display = "none"
			}
			this.loadInit()
			//this.getSubmoduleName(this.countryId);
		})
		this.dataService.homeCountryFlagSource.subscribe((data) => {
			this.homeCountryLogo = data
		})
		this.dataService.countryFlagSource.subscribe((data) => {
			this.countryFlag = data
		})

		this.dataService.countryId.subscribe((data) => {
			if (this.countryId != data) {
				let countryName: any
				this.currentSubModuleSlug = this.route.snapshot.paramMap.get("module_name")
				this.dataService.countryName.subscribe((data) => {
					countryName = data
				})
				switch (this.currentSubModuleSlug) {
					case "pre-admission":
						this.currentModuleId = 1
						this.currentModuleName = "Pre-Admission"
						this.currentApiSlug = "getpreapplicationsubmoduleqcount"
						this.howItWorksVideoLink = "pre-admission"
						break
					case "travel-and-tourism":
						this.currentModuleId = 7
						this.currentModuleName = "Travel-and-Tourism"
						this.currentApiSlug = "getpostapplicationsubmoduleqcount"
						this.howItWorksVideoLink = "travel-and-tourism"
						break
					case "post-admission":
						this.currentModuleId = 3
						this.currentModuleName = "Post-Admission"
						this.currentApiSlug = "getpostadmissionsubmoduleqcount"
						this.howItWorksVideoLink = "post-admission"
						break
					case "career-hub":
						this.currentModuleId = 4
						this.currentModuleName = "Career Hub"
						this.currentApiSlug = "getcareerhubsubmoduleqcount"
						this.howItWorksVideoLink = "career-hub"
						break
					case "university":
						this.currentModuleId = 5
						this.currentModuleName = "University"
						this.currentApiSlug = "getuniversitysubmoduleqcount"
						this.howItWorksVideoLink = "university"
						this.tooltip = ""
						break
					case "skill-mastery":
						this.currentModuleId = 10
						this.currentModuleName = "Skill Mastery"
						this.currentApiSlug = ""
						this.howItWorksVideoLink = "skill-mastery"
						this.tooltip = ""
						break
					case "learning-hub":
						this.currentModuleId = 8
						this.currentModuleName = "Learning Hub"
						this.currentApiSlug = ""
						this.howItWorksVideoLink = "learning-hub"
						this.tooltip = ""
						break
					case "k12-category":
						this.currentModuleId = 14
						this.currentModuleName = "K12"
						this.currentApiSlug = "StudentsSubmoduleQuestions"
						this.howItWorksVideoLink = "k-12"
						this.tooltip = ""
						break
					default:
						this.currentModuleId = 6
						this.currentModuleName = "Life In " + countryName
						this.currentApiSlug = "getlifeincountrysubmoduleqcount"
						this.howItWorksVideoLink = "life-in"
						this.tooltip = ""
						break
				}
				this.subModuleId = this.route.snapshot.paramMap.get("id")
				if (!this.subModuleId.contains("&")) {
					const currentUrl = this.router.url // Get the current URL
					if (currentUrl.includes("pages/module")) {
						this.router.navigateByUrl(`/pages/modules/${this.currentSubModuleSlug}`)
					}
				}
				//this.loadInit();
			}
			this.storage.set("countryId", data)
			// this.questionListData = [];
			//this.isSkeletonVisible = true
			//this.loadInit();
		})
		this.tooltip = "Questions related to the application process are answered"
		this.checkplanExpire()
	}

	loadInit() {
		this.questionListData = []
		this.countryId = Number(this.storage.get("countryId"))
		let countryName: any
		this.subModuleId = this.route.snapshot.paramMap.get("id")
		let question_id = this.route.snapshot.paramMap.get("question_id")
		if (question_id) {
			//this.updateMetaTags();
			// let url = this.subModuleId.split("$");
			this.storage.set("questionId", question_id)
			this.subModuleId = this.subModuleId
		}
		this.currentSubModuleSlug = this.route.snapshot.paramMap.get("module_name")
		this.dataService.countryName.subscribe((data) => {
			countryName = data
		})
		//this.checkplanExpire();
		switch (this.currentSubModuleSlug) {
			case "pre-admission":
				this.currentModuleId = 1
				this.currentModuleName = "Pre-Admission"
				this.currentApiSlug = "getpreapplicationsubmoduleqcount"
				this.howItWorksVideoLink = "pre-admission"
				this.currentModuleSlug = "pre-admission"
				break
			case "travel-and-tourism":
				this.currentModuleId = 7
				this.currentModuleName = "Travel-and-Tourism"
				this.currentApiSlug = "getpostapplicationsubmoduleqcount"
				this.howItWorksVideoLink = "travel-and-tourism"
				this.currentModuleSlug = "travel-and-tourism"
				break
			case "post-admission":
				this.currentModuleId = 3
				this.currentModuleName = "Post-Admission"
				this.currentApiSlug = "getpostadmissionsubmoduleqcount"
				this.howItWorksVideoLink = "post-admission"
				this.currentModuleSlug = "post-admission"
				break
			case "career-hub":
				this.currentModuleId = 4
				this.currentModuleName = "Career Hub"
				this.currentApiSlug = "getcareerhubsubmoduleqcount"
				this.howItWorksVideoLink = "career-hub"
				this.currentModuleSlug = "career-hub"
				break
			case "university":
				this.currentModuleId = 5
				this.currentModuleName = "University"
				this.currentApiSlug = "getuniversitysubmoduleqcount"
				this.howItWorksVideoLink = "university"
				this.currentModuleSlug = "university"
				this.tooltip = ""
				break
			case "learning-hub":
				this.currentModuleId = 8
				this.learningHubMainModuleName = this.storage.get("learningHubMainModuleName")
				this.learningHubQuizBreadCrumb = this.learningHubMainModuleName + " -> " + this.moduleName
				this.storage.set("learningHubQuizBreadCrumb", this.learningHubQuizBreadCrumb)
				this.currentModuleName = "Learning Hub"
				this.currentApiSlug = "getlearninghubsubmoduleqcount"
				this.howItWorksVideoLink = "learning-hub"
				this.currentModuleSlug = "learning-hub"
				this.isHidGlobalRepository = false;
				break
			case "skill-mastery":
				this.currentModuleId = 10
				this.currentModuleName = "Skill Mastery"
				this.currentApiSlug = "getskillmasterysubmoduleqcount"
				this.howItWorksVideoLink = "skill-mastery"
				this.currentModuleSlug = "skill-mastery"
				this.isHidGlobalRepository = false;
				break
			case "k12-category":
				this.currentModuleId = 14
				this.currentModuleName = "K12 Academy"
				this.currentApiSlug = "StudentsSubmoduleQuestions"
				this.howItWorksVideoLink = "k-12"
				this.currentModuleSlug = "k12-category"
				this.tooltip = ""
				break
			default:
				this.currentModuleId = 6
				this.currentModuleName = "Life In " + countryName
				this.currentApiSlug = "getlifeincountrysubmoduleqcount"
				this.howItWorksVideoLink = "life-in"
				this.currentModuleSlug = "life-at-country"
				this.tooltip = ""
				break
		}
		// this.getSubmoduleName(this.countryId);

		this.dataService.currentMessage.subscribe((message) => (this.message = message))
		this.breadCrumb = [
			{
				label: this.currentModuleName,
				command: (event) => this.gotomodulebreadcrump(),
			},
			{ label: this.moduleName, command: (event) => this.goToHomebreadcrump() },
			{ label: "Question" },
		]

		this.responsiveOptions = [
			{
				breakpoint: "1024px",
				numVisible: 3,
				numScroll: 3,
			},
			{
				breakpoint: "768px",
				numVisible: 2,
				numScroll: 2,
			},
			{
				breakpoint: "560px",
				numVisible: 1,
				numScroll: 1,
			},
		]

		//this.listQuestion$ = this.moduleListService.questionList$();
		let data = {
			countryId: this.sharedCountry != 0 ? this.sharedCountry : this.countryId,
			moduleId: this.currentModuleId,
			submoduleId: Number(this.subModuleId),
			page: this.pageno,
			perpage: this.perpage,
		}

		if (this.currentModuleId == 8 || this.currentModuleId == 10 || this.currentModuleId == 14) {
			data.countryId = 0
		}
		this.loadQuestionList(data)

		var data1 = {
			moduleid: this.currentModuleId,
			countryid: this.currentModuleId == 8 || this.currentModuleId == 10 ? 0 : this.countryId,
			submoduleid: this.subModuleId,
		}
		this.moduleListService.checkModuleQuizCompletion(data1).subscribe((res) => {
			this.quizpercentage = res.progress
		})
	}

	updateMetaTags(): void {
		this.title.setTitle("Test question title testing")
		// Updating an existing meta tag or creating if not present
		this.meta.updateTag({ name: "description", content: "This is a dynamic meta description." })

		// Adding a new meta tag
		this.meta.addTag({ name: "author", content: "Angular Developer" })

		// Updating or adding an Open Graph meta tag
		this.meta.updateTag({ property: "og:title", content: "Dynamic Meta Tag Example" })
		this.meta.updateTag({ property: "og:description", content: "Learn how to dynamically update meta tags in Angular." })
	}

	loadQuestionList(data: any) {
		let questionData = { id: this.storage.get("questionId") || "" }
		if (questionData?.id) {
			data.share_link_question_id = questionData?.id
		}

		this.mService.studentsSubmoduleQuestions(data).subscribe((data: any) => {
			this.homeCountryLogo = data.country_flag
			this.questionListData = data?.questions
			this.isSkeletonVisible = false
			this.totalQuestionCount = data?.questioncount
			this.allDataSet = data
			this.moduleName = data.submodule_name
			if (questionData.id) {
				this.viewOneQuestion(data.questions[0])
				this.storage.remove("questionId")
			}
		})
	}
	checkplanExpire(): void {
		if (this.currentModuleId == 8 || this.currentModuleId == 10) {
			if (this.authService._userSubscrition.time_left.plan === "expired" ||
				this.authService._userSubscrition.time_left.plan === "subscription_expired" ||
				this.authService._userSubscrition.subscription_details.subscription_plan === "Student") {
				this.planExpired = true;
			}
			else {
				this.planExpired = false;
			}
		}
		else {
			if (this.authService._userSubscrition.time_left.plan === "expired" ||
				this.authService._userSubscrition.time_left.plan === "subscription_expired") {
				this.planExpired = true;
			}
			else {
				this.planExpired = false;
			}
		}
	}
	goBack() {
		if (this.route.snapshot.paramMap.get("id")) {
			this.router.navigateByUrl(`/pages/modules/${this.currentSubModuleSlug}`)
		} else {
			this._location.back()
		}
	}

	readQuestion(data: any) {
		this.moduleListService.readQuestion(data)
		this.readQue$ = this.moduleListService.readQuestionMessage$()
		this.questionListData = this.questionListData.map((item) => {
			if (item.id === data.questionId) {
				return { ...item, read: 1 }
			}
			return item
		})
	}

	setPage(page: any) {
		let pageNum: number = 0
		if (page.page < 0) {
			pageNum = this.data.length
		} else {
			pageNum = page.page
		}
		this.data.filter((res: any) => {
			if (res.id == pageNum + 1) {
				this.refLink = res.reflink
				this.videoLinks = res.videolink
			}
		})
		this.positionNumber = pageNum + 1
		this.breadCrumb = [
			{
				label: this.currentModuleName,
				command: (event) => this.gotomodulebreadcrump(),
			},
			{ label: this.moduleName, command: (event) => this.goToHomebreadcrump() },
			{ label: `Question ${pageNum + 1}` },
		]
	}

	clickPrevious(carousel: any, event: any) {
		this.isAnswerDialogVisiblePrev = true
		this.isAnswerDialogVisibleNext = true
		if (this.selectedQuestion <= 1) {
			this.isAnswerDialogVisiblePrev = false
		}
		if (this.selectedQuestion <= 0) {
			return
		}
		let selectedData = this.data[this.selectedQuestion - 1]
		let selectedDataReadAnswer = this.data[this.selectedQuestion]
		this.selectedQuestionData = selectedData
		this.selectedModule = selectedData.module_id
		this.selectedSubModule = selectedData.submodule_id
		this.selectedQuestionId = selectedData.id
		this.selectedQuestion = this.selectedQuestion - 1
		this.data.filter((res: any) => {
			if (res.id == selectedData.id) {
				this.refLink = res.reflink
				this.videoLinks = res.videolink
			}
		})
		carousel.navBackward(event, this.selectedQuestion)
		let data = {
			questionId: selectedData.id,
			countryId: this.countryId,
			moduleId: this.currentModuleId,
			submoduleId: Number(this.subModuleId),
		}

		this.readQuestion(data)
	}

	clickNext(carousel: any, event: any) {
		this.isAnswerDialogVisiblePrev = true
		this.isAnswerDialogVisibleNext = true
		if (this.selectedQuestion >= this.data.length - 2) {
			this.isAnswerDialogVisibleNext = false
		}
		if (this.selectedQuestion >= this.data.length - 1) {
			return
		}
		let selectedData = this.data[this.selectedQuestion + 1]
		this.selectedQuestionData = selectedData
		this.selectedModule = selectedData.module_id
		this.selectedSubModule = selectedData.submodule_id
		this.selectedQuestionId = selectedData.id
		this.selectedQuestion = this.selectedQuestion + 1
		this.data.filter((res: any) => {
			if (res.id == selectedData.id) {
				this.refLink = res.reflink
				this.videoLinks = res.videolink
			}
		})
		carousel.navForward(event, this.selectedQuestion)
		let data = {
			questionId: selectedData.id,
			countryId: this.countryId,
			moduleId: this.currentModuleId,
			submoduleId: Number(this.subModuleId),
		}
		this.readQuestion(data)
	}

	onClickRecommendedVideo(data: any) {
		this.isRecommendedVideoVisible = true
		let url = encodeURIComponent(data[0].link)
		this.popUpItemVideoLink = this._sanitizer.bypassSecurityTrustResourceUrl(url)
	}

	onClickRecommendedLinks(data: any) {
		this.isRecommendedLinksVisible = true
	}

	onClickAsk(question: any) {
		this.router.navigateByUrl(`/pages/advisor/` + question)
		//this.dataService.changeChatOpenStatus("open chat window");
	}

	openReport() {
		let data: any = {
			isVisible: true,
			moduleId: this.selectedQuestionData.module_id,
			subModuleId: this.selectedQuestionData.submodule_id,
			questionId: this.selectedQuestionData.id,
			from: "module",
		}
		if (this.currentModuleId == 8) {
			data.reporttype = 8
		}
		this.dataService.openReportWindow(data)
	}

	goToHome(event: any) {
		this.isQuestionAnswerVisible = false
	}
	goToHomebreadcrump() {
		this.isQuestionAnswerVisible = false
	}
	gotomodulebreadcrump() {
		if (this.currentModuleId == 1) {
			this.router.navigate(["/pages/modules/pre-admission"])
		} else if (this.currentModuleId == 7) {
			this.router.navigate(["/pages/modules/travel-and-tourism"])
		} else if (this.currentModuleId == 3) {
			this.router.navigate(["/pages/modules/post-admission"])
		} else if (this.currentModuleId == 4) {
			this.router.navigate(["/pages/modules/career-hub"])
		} else if (this.currentModuleId == 5) {
			this.router.navigate(["/pages/modules/university"])
		} else if (this.currentModuleId == 8) {
			this.router.navigate(["/pages/modules/learning-hub"])
		} else if (this.currentModuleId == 10) {
			this.router.navigate(["/pages/modules/skill-mastery"])
		} else if (this.currentModuleId == 14) {
			this.router.navigate(["/pages/modules/k12"])
		} else {
			this.router.navigate(["/pages/modules/life-at-country"])
		}
	}

	reviewBy() {
		this.reviewedByOrgList = []
		this.isReviewedByVisible = true
		let request = {
			question_id: this.selectedQuestionId,
		}
		this.moduleStoreService.GetReviewedByOrgLogo(request).subscribe((response) => {
			this.reviewedByOrgList = response
		})
	}

	paginatepost(event: any) {
		if (this.planExpired) {
			this.authService.hasUserSubscription$.next(true);
			return
		}
		this.pageno = event.page + 1
		this.perpage = event.rows
		let data = {
			countryId: this.currentModuleId == 8 || this.currentModuleId == 10 || this.currentModuleId == 14 ? 0 : Number(this.storage.get("countryId")),
			moduleId: this.currentModuleId,
			submoduleId: Number(this.subModuleId),
			page: this.pageno,
			perpage: this.perpage,
		}
		// this.moduleListService.loadQuestionList(data);
		// this.moduleListService.questionList$().subscribe((data: any) => {
		//   this.questionListData = data?.questions;
		//   this.totalQuestionCount = data?.questioncount;
		// });
		this.loadQuestionList(data)
	}

	selectedQuestionName: any
	viewOneQuestion(question: any) {
		if (this.planExpired) {
			this.authService.hasUserSubscription$.next(true);
			return
		}

		// this.oneQuestionContent.answer = question.answer;
		let questionData = question
		// let questionData = this.allDataSet[question.id];
		// this.selectedQuestionName = question
		if (questionData == undefined) {
			questionData = []
		}
		// if (question && question?.question) {
		//   questionData = question;
		// }
		// else {
		//   let ques = this.questionListData.find((data: any) => data.id == question.id)
		//   questionData['question'] = ques?.question;
		// }

		// this.meta.updateTag({ name: 'og:title', content: questionData.question });
		// this.meta.updateTag({ property: 'og:url', content: 'https://dev-student.uniprep.ai/pages/modules/pre-admission/question-list/2' });
		// this.meta.updateTag({ property: 'og:type', content: 'summary' });
		// this.meta.updateTag({ property: 'og:description', content: 'summary summary summary summary summary summary' });
		// this.meta.updateTag({ name: 'image', property: 'og:image', content: 'https://api.uniprep.ai/uniprepapi/storage/app/public/country-flags/united-kingdom.svg' });
		// this.cdRef.markForCheck();
		//
		//
		// this.meta.updateTag({ name: 'twitter:card', content: 'summary' });
		// this.meta.updateTag({ name: 'twitter:site', content: '@YourTwitterHandle' });
		// this.meta.updateTag({ property: 'twitter:domain', content: 'dev-student.uniprep.ai' });
		// this.meta.updateTag({ property: 'twitter:url', content: 'https://dev-student.uniprep.ai/pages/modules/pre-admission/question-list/2' });
		// this.meta.updateTag({ name: 'twitter:title', content: 'Your Page Title' });
		// this.meta.updateTag({ name: 'twitter:description', content: 'Your Page Description' });
		// this.meta.updateTag({ name: 'twitter:image', content: 'https://api.uniprep.ai/uniprepapi/storage/app/public/country-flags/united-kingdom.svg' });
		//this.titleService.setTitle(questionData.question);
		// this.meta.addTag(
		//   { property: 'og:title', content:  questionData.question},
		// );
		// this.meta.addTag(
		//   { name: 'title', content:  questionData.question},
		// );

		// this.titleService.setTitle(questionData.question);
		// this.cdRef.markForCheck();
		this.oneQuestionContent = questionData
		this.isQuestionAnswerVisible = true
		this.vediolink = this.oneQuestionContent.videolink
		this.weblink = this.oneQuestionContent.reflink
		// this.getSubmoduleName(questionData.country_id)
		this.breadCrumb = [
			{
				label: this.currentModuleName,
				command: (event) => this.gotomodulebreadcrump(),
			},
			{ label: this.moduleName, command: (event) => this.goToHomebreadcrump() },
			{ label: "Question" },
		]
		let data = {
			questionId: this.oneQuestionContent.id,
			countryId: this.oneQuestionContent.country_id,
			moduleId: this.currentModuleId,
			submoduleId: Number(this.subModuleId),
		}
		this.readQuestion(data)
		this.selectedQuestionData = questionData
	}

	showSocialSharingList() {
		let socialShare: any = document.getElementById("socialSharingList")
		if (socialShare.style.display == "") {
			socialShare.style.display = "block"
		} else {
			socialShare.style.display = socialShare.style.display == "none" ? "block" : "none"
		}
	}

	shareQuestion(type: string) {
		const socialMedias: { [key: string]: string } = this.socialShareService.socialMediaList;
		const url = encodeURI(window.location.href + '/' + this.selectedQuestionData?.id);
		this.meta.updateTag({ property: 'og:url', content: url });
		const shareUrl = socialMedias[type] + encodeURIComponent(url);
		window.open(shareUrl, '_blank');
	}
	copyLink() {
		const textToCopy = encodeURI(window.location.href + '/' + this.selectedQuestionData?.id);
		this.socialShareService.copyQuestion(textToCopy);
	}
	// vedio pop-up code
	openNextPageLink: any
	openVideoPopup(link: any): void {
		const sanitizedLink = this.sanitizer.bypassSecurityTrustResourceUrl(link)
		this.openNextPageLink = link
		// Check if it's a YouTube video link
		if (this.isYoutubeVideoLink(link)) {
			// If it's a YouTube video link, extract the video ID and construct the embeddable URL
			const videoId = this.extractYoutubeVideoId(link)
			const embedUrl = `https://www.youtube.com/embed/${videoId}`
			this.selectedVideoLink = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl)
		} else {
			// If it's not a YouTube video link, use the URL directly
			this.selectedVideoLink = sanitizedLink
		}

		this.showVideoPopup = true
	}

	private isYoutubeVideoLink(link: string): boolean {
		// Check if the link is a YouTube video link based on a simple pattern
		return link.includes("youtube.com") || link.includes("youtu.be")
	}

	private extractYoutubeVideoId(url: string): string {
		const videoIdRegex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([^"'&?\n\s]+)/
		const match = url.match(videoIdRegex)
		return match ? match[1] : ""
	}

	@HostListener("document:keydown", ["$event"])
	onKeyDown(event: KeyboardEvent): void {
		// Check if the pressed key is the Escape key (code 27)
		if (event.code === "Escape") {
			this.closeVideoPopup()
		}
	}
	closeVideoPopup(): void {
		if (this.videoFrame && this.videoFrame.nativeElement) {
			const player = this.videoFrame.nativeElement as HTMLIFrameElement
			player.src = ""
		}
		this.selectedVideoLink = null
		this.showVideoPopup = false
	}
	openNextVideo(): void {
		console.log("Opening next video:", this.openNextPageLink)
		if (this.openNextPageLink) {
			window.open(this.openNextPageLink)
		}
	}
	onShowModal(value: any) {
		let socialShare: any = document.getElementById("socialSharingList")
		socialShare.style.display = "none"
	}
	startQuiz() {
		if (this.planExpired) {
			this.authService.hasUserSubscription$.next(true);
			return
		}
		this.storage.set("learninghubsubmoduleid", this.subModuleId)
		this.storage.set("skillmasteryquizsubmoduleid", this.subModuleId)
		this.storage.set("universityidforquiz", this.subModuleId)
		if (this.currentModuleId == 14) {
			this.router.navigate([`/pages/modules/k12-category/k12-quiz`])
			return
		}
		if (this.currentModuleId == 8) {
			this.router.navigate([`/pages/modules/${this.currentModuleSlug}/learninghubquiz`])
		} else {
			this.router.navigate([`/pages/modules/${this.currentModuleSlug}/quiz`])
		}
	}
	openHowItWorksVideoPopup(videoLink: string) {
		console.log(videoLink, "video link");
		this.pageFacade.openHowitWorksVideoPopup(videoLink)
	}
	// scroll code
	// scrollRightLinks() {
	//     if (this.scrollContainerlink) {
	//         let container = this.scrollContainerlink.nativeElement;
	//         container.scrollBy({ left: 200, behavior: 'smooth' });

	//     }
	// }
	ngAfterViewInit() {
		this.scrollRightLinks();
		this.scrollRight();
	}
	scrollRight() {
		let container = this.scrollContainer.nativeElement;

		this.scrollInterval = setInterval(() => {
			if (container.scrollLeft + container.clientWidth >= container.scrollWidth) {
				// Reset to the start when reaching the end
				container.scrollTo({ left: 0, behavior: 'instant' });
			} else {
				// Scroll right smoothly
				container.scrollBy({ left: 2, behavior: 'smooth' }); // Adjust speed by changing "left" value
			}
		}, 0);
	}
	scrollRightLinks() {
		const container = this.scrollContainerlink.nativeElement;
		this.scrollInterval = setInterval(() => {
			if (container.scrollLeft + container.clientWidth >= container.scrollWidth) {
				// Reset to the start when reaching the end
				container.scrollTo({ left: 0, behavior: 'instant' });
			} else {
				// Scroll right smoothly
				container.scrollBy({ left: 2, behavior: 'smooth' }); // Adjust speed by changing "left" value
			}
		}, 0); // Adjust speed by changing interval time
	}
}
@Pipe({
	name: "safe",
	standalone: false,
})
export class SafePipe implements PipeTransform {
	constructor(private sanitizer: DomSanitizer) { }

	transform(url: string): SafeResourceUrl {
		return this.sanitizer.bypassSecurityTrustResourceUrl(url)
	}

}
