import { Component, OnInit } from "@angular/core"
import { PageFacadeService } from "../page-facade.service"
import { CourseListService } from "./course-list.service"
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms"
import { MessageService } from "primeng/api"
import { Router, RouterModule } from "@angular/router"
import { AuthService } from "src/app/Auth/auth.service"
import { UserManagementService } from "../user-management/user-management.service"
import { LocationService } from "src/app/services/location.service"
import { environment } from "src/environments/environment"
import { CommonModule } from "@angular/common"
import { DialogModule } from "primeng/dialog"
import { MultiSelectModule } from "primeng/multiselect"
import { CarouselModule } from "primeng/carousel"
import { ButtonModule } from "primeng/button"
import { PaginatorModule } from "primeng/paginator"
@Component({
	selector: "uni-course-list",
	templateUrl: "./course-list.component.html",
	styleUrls: ["./course-list.component.scss"],
	standalone: true,
	imports: [CommonModule, DialogModule, MultiSelectModule, FormsModule, ReactiveFormsModule, CarouselModule, ButtonModule, RouterModule, PaginatorModule],
})
export class CourseListComponent implements OnInit {
	page: number = 1
	perPage: number = 50
	courseListData: any
	totalCourseCount: number = 0
	favCourseCount: number = 0
	isFilterVisible: string = "none"
	filterForm: FormGroup
	selectAllCheckboxes = false
	selectedCourses: number = 0
	countryList: any = []
	locationList: any = []
	allLocations: any = []
	courseNameList: any = []
	subjectNameList: any = []
	universityNameList: any = []
	allUniversityList: any = []
	durationList: any = []
	monthList: any = [
		{ id: "Jan", name: "January" },
		{ id: "Feb", name: "February" },
		{ id: "Mar", name: "March" },
		{ id: "Apr", name: "April" },
		{ id: "May", name: "May" },
		{ id: "Jun", name: "June" },
		{ id: "Jul", name: "July" },
		{ id: "Aug", name: "August" },
		{ id: "Sep", name: "September" },
		{ id: "Oct", name: "October" },
		{ id: "Nov", name: "November" },
		{ id: "Dec", name: "December" },
	]
	recMonthList: any = this.monthList
	studyLevel: any = [
		{ id: 3, label: "Bachelors" },
		{ id: 6, label: "Masters" },
		{ id: 2, label: "Diploma" },
		{ id: 4, label: "PG Diploma" },
	]
	worldRank: any = [
		{ id: 100, value: "Top 100" },
		{ id: 200, value: "Top 200" },
		{ id: 500, value: "Top 500" },
		{ id: "any", value: "All Range" },
	]
	campusList: any = []
	guidelinesDiv: boolean = true
	viewFavourites: boolean = false
	buyCreditsCount: number = 0
	exportDataIds: any = []
	currentPlan: string = ""
	stayBackList: any = []
	PersonalInfo!: any
	ehitlabelIsShow: boolean = true
	imagewhitlabeldomainname: any
	orgnamewhitlabel: any
	orglogowhitelabel: any
	enableModule: boolean = false
	activePageIndex: number = 0
	zeroData!: boolean
	recommendations: any = [
		{
			id: 1,
			question: "Which country would you like to study in?",
		},
		{
			id: 2,
			question: "What are the subjects you're interested in studying?",
		},
		{
			id: 3,
			question: "What is your preferred study level?",
		},
		{
			id: 4,
			question: "When would you prefer to start your studies?",
		},
		{
			id: 5,
			question: "Which pre-requisite exam are you planning to take?",
		},
		{
			id: 6,
			question: "What is your preferred university's world rank?",
		},
	]
	invalidClass: boolean = false
	selectedData: { [key: string]: any } = {}
	studyLevelCubes: any = [
		{ id: 3, label: "Bachelors" },
		{ id: 6, label: "Masters" },
		{ id: 2, label: "Diploma" },
		{ id: 4, label: "PG Diploma" },
		{ id: "any", label: "Select All" },
	]
	worldRankCubes: any = [
		{ id: 100, value: "Top 100" },
		{ id: 200, value: "Top 200" },
		{ id: 500, value: "Top 500" },
		{ id: "any", value: "Select All" },
	]
	preRequisite: any = [
		{ id: 1, value: "English Test Waiver" },
		{ id: 2, value: "Duolingo Accepted" },
		{ id: 3, value: "IELTS Mandatory" },
	]

	constructor(private pageFacade: PageFacadeService, private locationService: LocationService, private userManagementService: UserManagementService, private courseList: CourseListService, private fb: FormBuilder, private toastr: MessageService, private router: Router, private authService: AuthService) {
		this.filterForm = this.fb.group({
			course_keyword: [""],
			study_level: [""],
			college_name: [""],
			country: [""],
			campus: [""],
			subject: [""],
			duration: [""],
			intake_months: [""],
			pre_requisite: [""],
			stay_back: [""],
			world_rank: [""],
		})
	}

	ngOnInit(): void {
		// this.getCourseLists();
		this.getRecommendationList()
		this.GetPersonalProfileData()
		// let anyMonthArray:any= {
		//   id: null,
		//   name: "Any Month"
		// };
		// this.recMonthList.unshift(anyMonthArray);
	}
	GetPersonalProfileData() {
		this.userManagementService.GetUserPersonalInfo().subscribe((data) => {
			this.PersonalInfo = data
		})
	}
	bookmarkQuestion(courseId: any, isFav: any) {
		isFav = isFav != "1" ? true : false
		this.favCourseCount = isFav == true ? this.favCourseCount + 1 : this.favCourseCount - 1
		this.courseList.bookmarkCourseData(courseId, this.PersonalInfo.user_id, isFav).subscribe((response) => {
			let courseListData = this.courseListData.find((item: any) => item.id == courseId)
			isFav == true ? (courseListData.favourite = 1) : (courseListData.favourite = null)
			this.toastr.add({
				severity: "success",
				summary: "Success",
				detail: response.message,
			})
		})
	}
	openVideoPopup() {
		this.pageFacade.openHowitWorksVideoPopup("unifinder")
	}

	getRecommendationList() {
		this.courseList.getCourseRecommendation().subscribe((res) => {
			if (res.status) {
				this.enableModule = true
				this.recommendationBasedCourses(res.data)
			} else {
				this.enableModule = false
			}
			this.getSelectBoxValues()
			setTimeout(() => {
				this.countrySelect()
			}, 2000)
		})
	}

	getSelectBoxValues() {
		this.courseList.loadDropdownValues().subscribe((res) => {
			this.countryList = res.country
			this.allLocations = res.locations
			this.allUniversityList = res.university_name
			this.stayBackList = res.stay_back
			this.universityNameList = this.allUniversityList
			this.subjectNameList = res.subject
			this.durationList = res.duration
			this.monthList = this.monthList
		})
	}

	countrySelect() {
		let selectedCountry = this.filterForm.value.country
		if (selectedCountry.length != 0) {
			this.locationList = this.allLocations.filter((item: any) => {
				return selectedCountry.includes(item.country_id)
			})
			this.universityNameList = this.allUniversityList.filter((item: any) => {
				return selectedCountry.includes(item.country_id)
			})
		} else {
			this.locationList = this.allLocations
			this.universityNameList = this.allUniversityList
		}
	}

	locationSelect() {
		let selectedLocation = this.filterForm.value.campus
		if (selectedLocation.length != 0) {
			this.universityNameList = this.allUniversityList.filter((item: any) => {
				return selectedLocation.includes(item.location_id)
			})
		} else {
			let selectedCountry = this.filterForm.value.country
			this.universityNameList = this.allUniversityList.filter((item: any) => {
				return selectedCountry.includes(item.country_id)
			})
		}
	}

	getCourseLists() {
		let formValues = this.filterForm.value
		let data: any = []
		if (!this.viewFavourites) {
			data = {
				course_keyword: formValues.course_keyword ? formValues.course_keyword : "",
				study_level: formValues.study_level ? formValues.study_level : "",
				college_name: formValues.college_name ? formValues.college_name : "",
				country: formValues.country ? formValues.country : "",
				campus: formValues.campus ? formValues.campus : "",
				subject: formValues.subject ? formValues.subject : "",
				duration: formValues.duration ? formValues.duration : "",
				pre_requisite: formValues.pre_requisite ? formValues.pre_requisite : "",
				intake_months: formValues.intake_months ? formValues.intake_months : "",
				stay_back: formValues.stay_back ? formValues.stay_back : "",
				world_rank: formValues.world_rank ? formValues.world_rank : "",
				page: this.page,
				perPage: this.perPage,
			}
		} else {
			data = {
				favourites: this.viewFavourites ? this.viewFavourites : "",
				page: this.page,
				perPage: this.perPage,
			}
		}

		this.courseList.getListOfCourses(data).subscribe((response) => {
			this.courseListData = response.data
			this.totalCourseCount = response.total_count
			this.buyCreditsCount = response.credit_count
			this.favCourseCount = response.fav_count
			if (response && response.total_count == 0) {
				this.zeroData = true
			} else {
				this.zeroData = false
			}
		})
	}

	submitFilter() {
		let formValues = this.filterForm.value
		if (!formValues.course_name && !formValues.college_name && !formValues.country && !formValues.campus && !formValues.subject && !formValues.duration && !formValues.intake_months && !formValues.stay_back && !formValues.world_rank && !formValues.course_keyword) {
			this.toastr.add({ severity: "error", summary: "Error", detail: "Please make sure you have some filter!" })
			return
		}
		this.getCourseLists()
		this.isFilterVisible = "none"
	}

	pageChange(event: any) {
		if (this.authService.isInvalidSubscription('uni_finder')) {
			this.authService.hasUserSubscription$.next(true);
			return;
		}
		this.selectAllCheckboxes = false
		this.selectedCourses = 0
		this.page = event.page + 1
		this.perPage = event.rows
		this.getCourseLists()
	}

	closeGuidelines() {
		this.guidelinesDiv = !this.guidelinesDiv
	}

	exportData() {
		if (this.authService.isInvalidSubscription('uni_finder')) {
			this.authService.hasUserSubscription$.next(true);
			return;
		}
		if (this.buyCreditsCount == 0) {
			if (this.imagewhitlabeldomainname === "*.uniprep.ai" || this.imagewhitlabeldomainname === "dev-student.uniprep.ai" || this.imagewhitlabeldomainname === "uniprep.ai" || this.imagewhitlabeldomainname === "localhost") {
				this.toastr.add({ severity: "error", summary: "error", detail: "Please Buy Some Credits." })
				setTimeout(() => {
					this.router.navigate(["/pages/export-credit"])
				}, 300)
			} else {
				this.authService.hasUserSubscription$.next(true);
			}
		} else {
			this.exportDataIds = []
			this.courseListData.forEach((item: any) => {
				if (item.isChecked == 1) {
					this.exportDataIds.push(item.id)
				}
			})
			if (this.exportDataIds.length == 0) {
				this.toastr.add({ severity: "error", summary: "error", detail: "Select Some data for export!." })
				return
			}

			if (this.imagewhitlabeldomainname === "*.uniprep.ai" || this.imagewhitlabeldomainname === "dev-student.uniprep.ai" || this.imagewhitlabeldomainname === "uniprep.ai" || this.imagewhitlabeldomainname === "localhost") {
				if (this.buyCreditsCount < this.exportDataIds.length) {
					this.toastr.add({ severity: "error", summary: "error", detail: "insufficient credits.Please Buy Some Credits." })
					setTimeout(() => {
						this.router.navigate(["/pages/export-credit"])
					}, 300)
					return
				}
			} else {
				if (this.buyCreditsCount < this.exportDataIds.length) {
					this.toastr.add({ severity: "error", summary: "error", detail: "To download additional data beyond your free credits, please upgrade your plan." })
					this.authService.hasUserSubscription$.next(true);
					return
				}
			}
			let data = {
				module_id: 4,
				export_id: this.exportDataIds,
			}

			this.courseList.exportSelectedData(data).subscribe((response) => {
				window.open(response.link, "_blank")
				this.selectAllCheckboxes = false
				this.selectedCourses = 0
				this.getCourseLists()
			})
		}
	}

	filterBy() {
		if (this.authService.isInvalidSubscription('uni_finder')) {
			this.authService.hasUserSubscription$.next(true);
			return;
		}
		this.isFilterVisible = "block"
	}

	handleClick(event: Event) {
		event.preventDefault() // Prevent the default action of the anchor tag
		if (this.authService.isInvalidSubscription('uni_finder')) {
			this.authService.hasUserSubscription$.next(true);
			return;
		}
	}

	buyCredits() {
		if (this.authService.isInvalidSubscription('uni_finder')) {
			this.authService.hasUserSubscription$.next(true);
			return;
		}
		this.router.navigate(["/pages/export-credit"])
	}

	getHref(jobSiteURL: string): string {
		const url = jobSiteURL
		return !url.startsWith("http://") && !url.startsWith("https://") ? "http://" + url : url
	}

	clearFilter() {
		this.filterForm.reset()
		this.universityNameList = []
		this.locationList = []
		this.getCourseLists()
		this.getSelectBoxValues()
	}

	selectAllCheckbox() {
		this.selectedCourses = 0
		this.selectAllCheckboxes = !this.selectAllCheckboxes
		if (this.selectAllCheckboxes) {
			this.courseListData.forEach((item: any) => {
				item.isChecked = 1
				this.selectedCourses += 1
			})
		} else {
			this.courseListData.forEach((item: any) => {
				item.isChecked = 0
			})
		}
	}

	onCheckboxChange(event: any) {
		const isChecked = (event.target as HTMLInputElement).checked
		this.selectedCourses = isChecked ? this.selectedCourses + 1 : this.selectedCourses - 1

		if (isChecked == false) {
			if (this.selectedCourses) {
				this.selectAllCheckboxes = false
			}
		} else {
			if (this.courseListData.length == this.selectedCourses) {
				this.selectAllCheckboxes = true
			}
		}
	}

	viewFav() {
		if (this.authService.isInvalidSubscription('uni_finder')) {
			this.authService.hasUserSubscription$.next(true);
			return;
		}
		this.viewFavourites = !this.viewFavourites
		this.getCourseLists()
	}

	previous(): void {
		this.invalidClass = false
		if (this.activePageIndex > 0) {
			this.activePageIndex--
		}
	}

	next(productId: number): void {
		if (this.authService.isInvalidSubscription('uni_finder')) {
			this.authService.hasUserSubscription$.next(true);
			return;
		}
		this.invalidClass = false
		if (productId in this.selectedData) {
			if (this.activePageIndex < this.recommendations.length - 1) {
				this.activePageIndex++
			}
		} else {
			this.invalidClass = true
		}
	}

	selectCube(key: number, id: number | string) {
		if (id === "any") {
			if (this.selectedData[key]?.includes("any")) {
				this.selectedData[key] = []
			} else {
				this.selectedData[key] = (key === 3 ? this.studyLevelCubes : this.worldRankCubes).map((cube: any) => cube.id)
				// this.selectedData[key].push("any");
			}
		} else {
			if (!Array.isArray(this.selectedData[key])) {
				this.selectedData[key] = []
			}

			const index = this.selectedData[key].indexOf(id)
			if (index > -1) {
				this.selectedData[key].splice(index, 1)
			} else {
				this.selectedData[key].push(id)
			}
		}
	}

	getRecommendation() {
		if (this.authService.isInvalidSubscription('uni_finder')) {
			this.authService.hasUserSubscription$.next(true);
			return;
		}
		let keyMapping: any = { "1": "country", "2": "subject", "3": "study_level", "4": "intake_months", "5": "pre_requisite", "6": "world_rank" }

		let newData = Object.fromEntries(
			Object.entries(this.selectedData).map(([key, value]) => {
				let mappedKey = keyMapping[key] || key
				// if (Array.isArray(value)) {
				//   value = value.filter(item => item !== "any");
				// }else{
				//   value = value == "any" ? '' : value
				// }
				return [mappedKey, value]
			})
		)
		this.enableModule = true
		this.recommendationBasedCourses(newData)
		this.getSelectBoxValues()
		this.courseList.storeCourseRecommendation(newData).subscribe()
		setTimeout(() => {
			this.countrySelect()
		}, 2000)
	}

	recommendationBasedCourses(data: any) {
		this.filterForm.patchValue(data)
		this.courseList.getListOfCourses(data).subscribe((response) => {
			this.courseListData = response.data
			this.totalCourseCount = response.total_count
			this.buyCreditsCount = response.credit_count
			this.favCourseCount = response.fav_count
			if (response && response.total_count == 0) {
				this.zeroData = true
			} else {
				this.zeroData = false
			}
		})
	}

	resetRecommendation() {
		this.courseList.resetCourseRecommendation().subscribe((res) => {
			this.zeroData = false
			this.enableModule = false
			this.activePageIndex = 0
			this.getSelectBoxValues()
			this.filterForm.reset()
			this.selectedData = {}
		})
	}

	applyToUniversity(countryId: any, universityId: any, intakeMonth: any, programLevel: any, courseName: any, courseLink: any) {
		this.courseList.getUserDetails().subscribe((response) => {
			var userdetails = response.userdetails[0]
			var data = {
				email: userdetails.email,
				interested_country_id: userdetails.interested_country_id,
				name: userdetails.name,
				location_id: userdetails.location_id,
				phone: userdetails.phone,
				programlevel_id: userdetails.programlevel_id,
				gender: userdetails.gender,
			}

			this.courseList.registerUniapply(data).subscribe((response) => {
				if (response.email != null) {
					const email = encodeURIComponent(response.email)
					const password = encodeURIComponent(response.password)
					var url = `${environment.uniApplyUrl}&countryId=${countryId}&universityId=${universityId}&intakeMonth=${intakeMonth}&programLevel=${programLevel}&courseName=${courseName}&courseLink=${courseLink}&email=${email}&password=${password}`
				} else {
					url = `${environment.uniApplyUrl}&countryId=${countryId}&universityId=${universityId}&intakeMonth=${intakeMonth}&programLevel=${programLevel}&courseName=${courseName}&courseLink=${courseLink}`
				}
				window.open(url, "_blank")
			})
		})
	}
}
