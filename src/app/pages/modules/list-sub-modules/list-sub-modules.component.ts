import { ChangeDetectorRef, Component, OnInit } from "@angular/core"
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from "@angular/router"
import { filter, Observable } from "rxjs"
import { ModuleListSub } from "../../../@Models/module.model"
import { ConfirmationService, MenuItem } from "primeng/api"
import { ModuleServiceService } from "../../module-store/module-service.service"
import { DataService } from "../../../data.service"
import { LocationService } from "../../../location.service"
import { AuthService } from "src/app/Auth/auth.service"
import { NgxUiLoaderService } from "ngx-ui-loader"
import { PageFacadeService } from "../../page-facade.service"
import { Meta, Title } from "@angular/platform-browser"
import { CommonModule, Location } from "@angular/common"
import { DialogModule } from "primeng/dialog"
import { CarouselModule } from "primeng/carousel"
import { TooltipModule } from "primeng/tooltip"
import { SkeletonModule } from "primeng/skeleton"
import { ButtonModule } from "primeng/button"
import { MultiSelectModule } from "primeng/multiselect"
import { InputGroupModule } from "primeng/inputgroup"
import { InputGroupAddonModule } from "primeng/inputgroupaddon"
import { SelectModule } from "primeng/select"
import { StorageService } from "../../../storage.service"
import { InputTextModule } from "primeng/inputtext"
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import { ProgressBar } from "primeng/progressbar";
import { Breadcrumb } from "primeng/breadcrumb";
import { RestrictionDialogComponent } from "src/app/shared/restriction-dialog/restriction-dialog.component"
@Component({
	selector: "uni-list-sub-modules",
	templateUrl: "./list-sub-modules.component.html",
	styleUrls: ["./list-sub-modules.component.scss"],
	providers: [ConfirmationService],
	standalone: true,
	imports: [CommonModule, RouterModule, DialogModule, FormsModule, ReactiveFormsModule, InputTextModule,
		CarouselModule, TooltipModule, SkeletonModule, ButtonModule, MultiSelectModule, InputGroupModule,
		InputGroupAddonModule, SelectModule, ProgressBar, Breadcrumb, RestrictionDialogComponent],
})
export class ListSubModulesComponent implements OnInit {
	subModules$!: Observable<ModuleListSub[]>
	quizList$!: Observable<any>
	selectedSubModule: any
	answeredCorrect: number = 0
	totalPercentage: number = 0
	percentageValue: string = ""
	subModuleList: any[] = []
	subModuleMainList: any[] = []
	isStartQuiz: boolean = false
	isQuizSubmit: boolean = false
	isReviewVisible: boolean = false
	responsiveOptions: any[] = []
	quizData: any[] = []
	moduleList: any[] = []
	selectedQuiz: number = 1
	selectedOptNumber: number = 1
	selectedOptValue: string = ""
	positionNumber: number = 0
	breadCrumb: MenuItem[] = []
	answerOptionClicked: boolean = true
	isInstructionVisible: boolean = false
	selectedClassId: any
	currentModuleSlug: any
	currentModuleName: any
	currentModuleId: any
	currentCountryId: any
	currentApiSlug: any
	infoMessage!: string
	unlockMessage!: string
	aboutModule!: string
	moduleDetails!: string
	upgradePlanMsg!: string
	selectedModule!: string
	planExpired!: boolean
	countryName!: string
	isSkeletonVisible: boolean = true
	countryId: any = 4
	canShowQuestionList: boolean = false
	howItWorksVideoLink: string = ""
	quizmoduleselectcountryidsetzero: any = 0
	selectSubmoduleName: string = ""
	ehitlabelIsShow: boolean = true
	imagewhitlabeldomainname: any
	orgnamewhitlabel: any
	orglogowhitelabel: any
	learningModuleHeading: string = ""
	description: any
	allSearchedResult: any[] = []
	loopRange = Array.from({ length: 24 })
		.fill(0)
		.map((_, index) => index)
	originalSubModuleList: any[] = []
	countryLists: any[] = []
	selectedCountryId: any = 4
	selectedCountryName: any

	constructor(private moduleListService: ModuleServiceService, private router: Router, private dataService: DataService,
		public authService: AuthService, private locationService: LocationService, private route: ActivatedRoute,
		private ngxService: NgxUiLoaderService, private confirmationService: ConfirmationService,
		private pageFacade: PageFacadeService, private meta: Meta, private cdRef: ChangeDetectorRef,
		private titleService: Title, private storage: StorageService, private location: Location,) {
		this.countryId = Number(this.storage.get("countryId"))

		this.dataService.countryIdSource.subscribe((data) => {
			if (this.countryId != data) {
				this.ngOnInit()
			}
			//this.storage.set('countryId', data);
			//this.isSkeletonVisible = true
			this.dataService.countryNameSource.subscribe((data) => {
				this.countryName = data
				if (data && this.currentModuleId == 6) {
					this.currentModuleName = "Life In " + this.countryName
				}
			})
		})
		this.responsiveOptions = [
			{
				breakpoint: "1199px",
				numVisible: 1,
				numScroll: 1,
			},
			{
				breakpoint: "991px",
				numVisible: 2,
				numScroll: 1,
			},
			{
				breakpoint: "767px",
				numVisible: 1,
				numScroll: 1,
			},
		]
	}

	updateMetaTags() {
		// Get the route parameters

		// Update title and meta description
		this.titleService.setTitle(`Uniprep | Question modules`)
		this.meta.updateTag({
			name: "description",
			content: `Uniprep Question list modules. more that 100000 questions`,
		})
		this.meta.updateTag({ name: "og:type", content: `website` })
		this.meta.updateTag({ name: "og:image", content: `https://dev-student.uniprep.ai/uniprep-assets/images/f1.png` })
		this.meta.updateTag({ name: "og:logo", content: `https://dev-student.uniprep.ai/uniprep-assets/images/f1.png` })
	}

	ngOnInit() {
		this.locationService.dashboardLocationList().subscribe((countryList: any) => {
			this.countryLists = countryList
			const storedCountryId = Number(this.storage.get("countryId")) || 0

			// Set the selectedCountryId after the API call
			this.selectedCountryId = storedCountryId

			// To make sure the dropdown updates, you might need to manually trigger change detection
			this.cdRef.detectChanges()
		})
		this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
			this.updateMetaTags()
		})

		// Initial update
		this.updateMetaTags()
		this.storage.set("modalcountryid", this.quizmoduleselectcountryidsetzero)
		this.init()
		this.moduleListService.getSubmodulesAndSpecialization().subscribe((res: any) => {
			this.allSearchedResult = res
		})
		this.originalSubModuleList = [...this.subModuleList]
	}

	selectCountry(selectedId: any): void {
		this.countryLists.forEach((element: any) => {
			if (element.id === selectedId) {
				this.selectedCountryName = element.country
				this.storage.set("countryId", element.id)
				this.storage.set("selectedcountryId", element.id)
				this.selectedCountryId = element.id
				this.dataService.changeCountryId(element.id)
				this.dataService.changeCountryFlag(element.flag)
				this.dataService.changeCountryName(element.country)
			}
		})
		this.countryLists.forEach((item: any, i: any) => {
			if (item.id === selectedId) {
				this.countryLists.splice(i, 1)
				this.countryLists.unshift(item)
			}
		})
	}

	init() {
		this.storage.set("QuizModuleName", "")
		this.currentCountryId = Number(this.storage.get("countryId"))
		this.currentModuleSlug = this.router.url.split("/").pop()

		switch (this.currentModuleSlug) {
			case "pre-admission":
				this.currentModuleId = 1
				this.currentModuleName = "Pre-Admission"
				this.currentApiSlug = "SubmoduleListForStudents"
					; (this.infoMessage = "Upgrade to access the Pre-admission section"), (this.unlockMessage = "Unlock the power of success with our exclusive Pre-admission!"), (this.upgradePlanMsg = "Upgrade your plan now to gain instant access.")
					; (this.aboutModule = "Explore a vast database of Q&A about:"), (this.moduleDetails = "Scholarships, document checklist, Education loan, letter of Recommendation and many more!")
				this.howItWorksVideoLink = "https://www.youtube.com/embed/aR06d8kMeio?si=-5Ivte_5ZgdcndS-"
				this.description = "Prepare effectively for college with information on entrance requirements, application tips, and more."
				break
			case "travel-and-tourism":
				this.currentModuleId = 7
				this.currentModuleName = "Travel-and-Tourism"
				this.currentApiSlug = "SubmoduleListForStudents"
					; (this.infoMessage = "Upgrade to access the travel-and-tourism"), (this.unlockMessage = "Unlock the power of success with our exclusive travel-and-tourism!"), (this.upgradePlanMsg = "Upgrade your plan now to gain instant access.")
					; (this.aboutModule = "Explore a vast database of Q&A about:"), (this.moduleDetails = "Visa, departure, healthcare, tuition fees and many more!")
				this.howItWorksVideoLink = "https://www.youtube.com/embed/PZERtrH1zh8?si=zKQ80B27zz6V9-mk"
				this.description = "Discover travel destinations, tips, and essential travel information."
				break
			case "post-admission":
				this.currentModuleId = 3
				this.currentModuleName = "Post-Admission"
				this.currentApiSlug = "SubmoduleListForStudents"
					; (this.infoMessage = "Upgrade to access the post-admission"), (this.unlockMessage = "Unlock the power of success with our exclusive post-admission!"), (this.upgradePlanMsg = "Upgrade your plan now to gain instant access.")
					; (this.aboutModule = "Post-admission offers information about:"), (this.moduleDetails = " Arrival, student discounts, banking, full time jobs, post study work and many more!")
				this.howItWorksVideoLink = "https://www.youtube.com/embed/g_KWlnmOEtc?si=KFpkpjdYMwkCIOV1"
				this.description = "Find guidance on navigating your new academic environment after securing admission."
				break
			case "career-hub":
				this.currentModuleId = 4
				this.currentModuleName = "Career Hub"
				this.currentApiSlug = "SubmoduleListForStudents"
					; (this.infoMessage = "Upgrade to access the Career Hub"), (this.unlockMessage = ""), (this.upgradePlanMsg = "Upgrade your plan now to gain instant access.")
					; (this.aboutModule = "Explore a vast database of Q&A about:"), (this.moduleDetails = " Arrival, student discounts, banking, full time jobs, post study work and many more!")
				this.howItWorksVideoLink = "https://www.youtube.com/embed/dBNASRavBk0?si=M2WtoOTl3ahORz8V"
				this.description = "Discover career opportunities and get resources to help you plan your professional path."
				break
			case "university":
				this.currentModuleId = 5
				this.currentModuleName = "University"
				this.currentApiSlug = "SubmoduleListForStudents"
				this.selectedModule = "university"
				this.howItWorksVideoLink = "https://www.youtube.com/embed/6mukBsCTgtw?si=aFBa9JMWI2k2QuzP"
				this.description = "Explore detailed profiles of universities worldwide, including programs, campus life, and application processes."
				break
			case "skill-mastery":
				this.currentModuleId = 10
				this.currentModuleName = "Skill Mastery"
				this.currentApiSlug = "SubmoduleListForStudents"
					; (this.infoMessage = "Upgrade to access the Skill Mastery"), (this.unlockMessage = " "), (this.upgradePlanMsg = "Upgrade your plan now to gain instant access.")
					; (this.aboutModule = "Explore a vast database of Q&A about:"), (this.moduleDetails = " Arrival, student discounts, banking, full time jobs, post study work and many more!")
				this.howItWorksVideoLink = "https://www.youtube.com/embed/mzyfeeL1b4Y?si=SYUFI6bW4xU-QZbT"
				this.description = "Enhance your expertise in soft skills through targeted courses and assessments."
				break
			case "learning-hub":
				this.currentModuleId = 8
				this.currentModuleName = "Learning Hub"
				this.currentApiSlug = "SubmoduleListForStudents"
					; (this.infoMessage = "Upgrade to access the Learning Hub"), (this.unlockMessage = "Unlock the power of success with our exclusive Learning Hub!"), (this.upgradePlanMsg = "Upgrade your plan now to gain instant access.")
					; (this.aboutModule = "Explore a vast database of Q&A about:"), (this.moduleDetails = "Scholarships, document checklist, Education loan, letter of Recommendation and many more!")
				this.howItWorksVideoLink = "https://www.youtube.com/embed/prvvJsgnya8?si=QSAeOB9qPMF-ya-D"
				this.description = "Upskill with over 1000 specializations across various industries"
				break
			case "k12-category":
				this.currentModuleId = 14
				this.currentModuleName = "K12"
				this.currentApiSlug = "SubmoduleListForStudents"
					; (this.infoMessage = "Upgrade to access the K12"), (this.unlockMessage = "Unlock the power of success with our exclusive k12!"), (this.upgradePlanMsg = "Upgrade your plan now to gain instant access.")
					; (this.aboutModule = "Explore a vast database of Q&A about:"), (this.moduleDetails = "Scholarships, document checklist, Education loan, letter of Recommendation and many more!")
				this.howItWorksVideoLink = "https://www.youtube.com/embed/Zh4pPEZ160c?si=i8vkRTgh70TuoqDn"
				this.description = "Explore curriculum-focused content and resources for students in Grades 9 through 12."
				break
			default:
				this.currentModuleId = 6
				this.currentModuleName = "Life In " + this.countryName
				this.currentApiSlug = "SubmoduleListForStudents"
					; (this.infoMessage = "Upgrade to access information about life in your chosen destination"), (this.unlockMessage = "Unlock the power of success with our exclusive destination"), (this.upgradePlanMsg = "Upgrade your plan now to gain instant access.")
					; (this.aboutModule = "Explore a vast database of Q&A about:"), (this.moduleDetails = "Festivals, events, currency, budget, housing and many more!"), (this.selectedModule = "life-at-country")
				this.howItWorksVideoLink = "https://www.youtube.com/embed/7VFZp47tfLU?si=GPLVjR5vKlNno-cZ"
				this.description = `Explore insights and tips about daily life and cultural nuances in ${this.countryName}`
				break
		}
		/*FU
		// if (this.currentModuleId == 5) {
		//   return; 
		// } */
		this.storage.set("currentmodulenameforrecently", this.currentModuleName)
		this.loadModuleAndSubModule()
		if (this.route.snapshot.paramMap.get("id") == "2") {
			this.startQuiz()
		}
		this.checkplanExpire()
		this.checkquizquestionmodule()
	}

	loadModuleAndSubModule() {
		this.selectedClassId = Number(this.storage.get("selectedClass"))
		this.currentCountryId = Number(this.storage.get("countryId"))
		//this.isSkeletonVisible = true;
		//this.subModules$ = this.moduleListService.subModuleList$();
		let data: any = {
			moduleId: this.currentModuleId,
		}
		if (this.currentModuleId == 8) {
			data.category_flag = 1
		} else if (this.currentModuleId == 10) {
			data.country_id = 0
		} else if (this.currentModuleId == 14) {
			data.category_flag = 1
			data.country_id = 0
			data.parent_category_id = Number(this.storage.get("selectedClass"))
		} else {
			data.country_id = this.currentCountryId
			data.api_module_name = this.currentApiSlug
		}
		let req = {
			module_id: this.currentModuleId,
			api_module_name: "getcareertoolcategorylist",
		}

		this.locationService.getK12MainCategory(req).subscribe((data) => {
			this.isSkeletonVisible = false
			this.subModuleMainList = data.data
		})
		//this.moduleListService.loadSubModules(data);
		this.locationService.GetQuestionsCount(data).subscribe((data) => {
			this.isSkeletonVisible = false
			this.subModuleList = data
			if (this.currentModuleId == 8) {
				this.subModuleList.map((list) => (list.submodule_name = list.category))
			}
		})
		// this.subModules$.subscribe(event => {
		//   this.subModuleList = event;
		// });
		this.locationService.getUniPerpModuleList().subscribe((data: any) => {
			this.moduleList = data.modules
			this.ngxService.stopBackground()
		})
	}

	getQuizData() {
		let data = {
			countryId: this.currentCountryId,
			moduleId: this.currentModuleId,
			submoduleId: 1,
		}
		this.moduleListService.quizList(data)
		this.quizList$ = this.moduleListService.quizList$()

		this.quizList$.subscribe((data) => {
			if (data) {
				this.quizData = data.map((val: any) => {
					let moduleData = this.moduleList.filter((ind) => ind.id == val.module_id)[0]!.module_name
					let subModuleName = this.subModuleList.filter((ind) => ind.id == val.submodule_id)[0]!.submodule_name
					let number = 1
					let dd = { ...val }
					dd.module_name = moduleData
					dd.sub_module_name = subModuleName
					dd.otp1 = dd.option1 + dd.id + number++
					dd.otp2 = dd.option2 + dd.id + number++
					dd.otp3 = dd.option3 + dd.id + number++
					dd.otp4 = dd.option4 + dd.id + number++
					return dd
				})
			}
		})
	}

	nextModule() {
		this.router.navigateByUrl(`/pages/modules/${this.currentModuleSlug}/question-list`)
	}

	runQuiz() {
		this.isInstructionVisible = false
		this.isStartQuiz = true
		let cName = ""
		this.dataService.countryNameSource.subscribe((countryName) => {
			cName = countryName
		})
		this.breadCrumb = [{ label: cName }, { label: this.quizData[0]!.module_name }, { label: this.quizData[0]!.sub_module_name }]
	}

	clickPreviousQuiz(carouselQuiz: any, event: any) {
		if (this.selectedQuiz <= 1) {
			return
		}
		let singleQuizData = this.quizData[this.selectedQuiz - 2]
		this.quizData.map((data: any) => {
			let dd = { ...data }

			if (dd.id == singleQuizData.id) {
				this.selectedOptNumber = dd.user_answered
				if (dd.user_answered_value != "") {
					this.answerOptionClicked = false
					dd.user_answered = this.selectedQuiz
				}
				return dd
			}
		})
		this.selectedQuiz = this.selectedQuiz - 1
		let cName = ""
		this.dataService.countryNameSource.subscribe((countryName) => {
			cName = countryName
		})
		this.breadCrumb = [{ label: cName }, { label: singleQuizData.module_name }, { label: singleQuizData.sub_module_name }]
		carouselQuiz.navBackward(event, this.selectedQuiz)
	}

	clickNextQuiz(carouselQuiz: any, event: any) {
		if (this.selectedQuiz > this.quizData.length - 1) {
			return
		}

		let singleQuizData = this.quizData[this.selectedQuiz - 1]
		this.quizData = this.quizData.map((data: any) => {
			let dat = { ...data }
			if (dat.id == singleQuizData.id) {
				if (!dat.user_answered_value) {
					dat.user_answered = this.selectedOptNumber
					dat.user_answered_value = this.selectedOptValue
					this.answerOptionClicked = true
				} else {
					this.answerOptionClicked = false
				}
				return dat
			}
			return dat
		})
		let sing = this.quizData[this.selectedQuiz]
		if (!sing.user_answered_value) {
			this.answerOptionClicked = true
		}
		this.selectedQuiz = this.selectedQuiz + 1

		let cName = ""
		this.dataService.countryNameSource.subscribe((countryName) => {
			cName = countryName
		})

		this.breadCrumb = [{ label: cName }, { label: singleQuizData.module_name }, { label: singleQuizData.sub_module_name }]
		carouselQuiz.navForward(event, this.selectedQuiz)
	}

	restrict = false

	clickSubmitQuiz() {
		this.quizData.forEach((data) => {
			if (data.answer == data.user_answered) {
				this.answeredCorrect++
			}
		})
		this.totalPercentage = (this.answeredCorrect / this.quizData.length) * 100
		if (this.totalPercentage < 40) {
			this.percentageValue = "Average"
		} else if (this.totalPercentage >= 40 && this.totalPercentage <= 80) {
			this.percentageValue = "Good"
		} else {
			this.percentageValue = "Excellent"
		}
		this.isStartQuiz = false
		this.isQuizSubmit = true
	}

	closeAllHome() {
		this.isStartQuiz = false
		this.isInstructionVisible = false
		this.isQuizSubmit = false
	}

	closeQuiz() {
		this.confirmationService.confirm({
			message: "Are you sure you want to Quit, All your current progress will be lost.",
			header: "Confirmation",
			icon: "fa-solid fa-circle-exclamation",
		})
	}

	quitQuiz(cd: any) {
		this.isStartQuiz = false
		this.isInstructionVisible = false
		this.isQuizSubmit = false
		cd.accept()
	}

	startQuiz() {
		if (this.planExpired) {
			this.restrict = true
			return
		}
		this.router.navigate([`/pages/modules/${this.currentModuleSlug}/quiz`])
		// let cName = "";
		// this.dataService.countryNameSource.subscribe(countryName => {
		//   cName = countryName;
		// });
		// this.quizData = [];
		// this.loadModuleAndSubModule();
		// this.getQuizData();
		// this.selectedQuiz = 1;
		// this.positionNumber = 1;
		// this.isInstructionVisible = true;
	}

	setPage(page: any) {
		let pageNum: number = 0
		if (page.page < 0) {
			pageNum = this.quizData.length
		} else {
			pageNum = page.page
		}
		this.positionNumber = pageNum + 1
	}

	onSubModuleClick(id: any, submodule: any) {
		this.selectSubmoduleName = submodule.submodule_name
		// if(this.planExpired){
		//   this.restrict=true;
		//   return;
		// }
		if (this.currentModuleId == 5) {
			this.storage.set("QuizModuleName", submodule.submodule_name)
		}
		if (this.currentModuleId == 14) {
			if (submodule.submodule_name) {
				this.currentModuleSlug = "k12-category"
				this.router.navigate([`/pages/modules/${this.currentModuleSlug}/question-list/${submodule.submodule_id}`])
				return
			}
			let data: any = {
				moduleId: this.currentModuleId,
				category_id: submodule.category_id,
				country_id: 0,
			}
			this.isSkeletonVisible = true
			this.locationService.GetQuestionsCount(data).subscribe((data) => {
				this.isSkeletonVisible = false
				this.subModuleList = data
			})
			this.canShowQuestionList = true
			return
		}
		if (this.currentModuleId == 8 && !this.canShowQuestionList) {
			let data: any = {
				moduleId: this.currentModuleId,
				category_id: this.subModuleList.find((list) => list.submodule_id == id)?.category_id,
			}
			this.storage.set("learningHubMainModuleName", submodule.category)
			this.isSkeletonVisible = true
			this.locationService.GetQuestionsCount(data).subscribe((data) => {
				this.isSkeletonVisible = false
				this.subModuleList = data
			})
			this.canShowQuestionList = true
			return
		}
		this.learningModuleHeading = submodule.submodule_name
		this.subModuleList.forEach((element: any) => {
			if (element.id === id) {
				this.selectedSubModule = element.country
			}
		})
		this.storage.set("QuizModuleName", submodule.submodule_name)
		this.selectedSubModule = id
		this.router.navigate([`/pages/modules/${this.currentModuleSlug}/question-list/${this.selectedSubModule}`])
	}

	selectAnswer(selectedOption: any, singleData: any, optNumber: number) {
		this.answerOptionClicked = false
		this.selectedOptNumber = optNumber
		this.selectedOptValue = selectedOption
		let mappedQuiz = this.quizData.map((data: any) => {
			let dat = { ...data }
			if (dat.id == singleData.id) {
				dat.user_answered = optNumber
				dat.user_answered_value = selectedOption
				return dat
			}
			return dat
		})
		this.quizData = mappedQuiz
	}

	openReviewPopup() {
		this.isQuizSubmit = false
		this.isReviewVisible = true
	}

	checkplanExpire(): void {
		this.authService.getNewUserTimeLeft().subscribe((res) => {
			let data = res.time_left
			let subscription_exists_status = res.subscription_details
			if (data.plan === "expired" || data.plan === "subscription_expired") {
				this.planExpired = true
			} else {
				this.planExpired = false
			}
		})
	}

	retryQuiz() {
		this.isReviewVisible = false
		this.isQuizSubmit = false
		this.totalPercentage = 0
		this.percentageValue = ""
		this.quizData = []
		this.getQuizData()
		this.selectedQuiz = 1
		this.positionNumber = 1
		this.isInstructionVisible = true
	}

	upgradePlan(): void {
		this.router.navigate(["/pages/subscriptions"])
	}

	goBack() {
		this.isSkeletonVisible = true
		this.loadModuleAndSubModule()
		this.canShowQuestionList = false
	}

	goBackNew() {
		this.router.navigateByUrl('pages/global-repo')
	}

	clearRestriction() {
		this.restrict = false
	}

	quizpercentage: any = 0

	checkquizquestionmodule() {
		var data = {
			moduleid: this.currentModuleId,
			countryid: this.currentCountryId,
		}
		this.moduleListService.checkModuleQuizCompletion(data).subscribe((res) => {
			this.quizpercentage = res.progress
		})
	}

	openVideoPopup(videoLink: string) {
		this.pageFacade.openHowitWorksVideoPopup(videoLink)
	}

	searchLearning: any
	searchUniversity: any
	filteredData: any[] = []

	performSearch() {
		if (this.searchLearning) {
			this.filteredData = this.allSearchedResult
				.filter((item: any) => item.submodule_name.toLowerCase().includes(this.searchLearning.toLowerCase()) || item.category_name.toLowerCase().includes(this.searchLearning.toLowerCase()))
				.map((item) => ({
					title: item.category_name,
					subtitle: item.submodule_name,
					category_id: item.category_id,
					submodule_id: item.submodule_id,
				}))
		} else if (this.searchUniversity) {
			//const searchData = [...this.allSearchedResult];
			const searchData = [...this.subModuleList]
			this.filteredData = searchData
				.filter((item: any) => item.submodule_name?.toLowerCase().includes(this.searchUniversity.toLowerCase()))
				.map((item) => ({
					title: item.submodule_name,
					subtitle: `Question Count: ${item.questioncount}`,
					category_id: item.category_id || "",
					submodule_id: item.submodule_id,
				}))
		} else {
			this.filteredData = []
		}
	}
	selectSearchResult(selectedItem: any) {
		const selectedModule = this.subModuleList.find((item) => item.submodule_id === selectedItem.submodule_id || item.submodule_name === selectedItem.title)
		if (selectedModule) {
			this.subModuleList = [selectedModule]
		}
		this.searchUniversity = ""
		this.filteredData = []
	}

	takeMeToQuestion(data: any) {
		this.router.navigate([`/pages/modules/learning-hub/question-list/${data.submodule_id}`])
	}

	clearSearch() {
		this.searchLearning = ""
		this.searchUniversity = ""
		this.filteredData = []
	}

	// onStatusChange(event: any){
	//     this.storage.set('selectedClass', event.value)
	//     let data = {
	//         moduleId: this.currentModuleId,
	//         category_flag: 1,
	//         country_id: 0,
	//         parent_category_id: Number(this.storage.get('selectedClass'))
	//     }
	//     this.locationService.GetQuestionsCount(data).subscribe(data => {
	//         this.isSkeletonVisible = false;
	//         this.subModuleList = data;
	//         if (this.currentModuleId == 8) {
	//             this.subModuleList.map(list => list.submodule_name = list.category);
	//         }

	//     });
	// }
	countryList: any
}
