import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core"
import { SubscriptionService } from "../subscription.service"
import { Router } from "@angular/router"
import { AuthService } from "src/app/Auth/auth.service"
import { MenuItem, MessageService } from "primeng/api"
import { Subscription } from "rxjs"
import { OrderHistory } from "src/app/@Models/subscription"
import { environment } from "@env/environment"
import { CommonModule } from "@angular/common"
import { DialogModule } from "primeng/dialog"
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
import { TableModule } from "primeng/table"
@Component({
	selector: "uni-subscription-history",
	templateUrl: "./subscription-history.component.html",
	styleUrls: ["./subscription-history.component.scss"],
	standalone: true,
	imports: [CommonModule, DialogModule, TableModule, RouterModule, CardModule, PaginatorModule, FormsModule, ReactiveFormsModule, CarouselModule, ButtonModule, MultiSelectModule, SelectModule, InputGroupModule, InputTextModule, InputGroupAddonModule],
})
export class SubscriptionHistoryComponent implements OnInit {
	@Input() userSubscription: any
	@Input() subscribedHistoryList: any
	@Input() subscribedCountryList: any
	@Input() accountBillingList: any
	selectedButton: any
	countryList: any
	breadCrumb: MenuItem[] = []
	selectedCountry: any[] = [2, 3]
	isInstructionVisible: boolean = false
	@Input() billing!: any | null
	@Input() subscriptions!: Subscription | null
	@Input() history: OrderHistory[] = []
	@Output() upgrade = new EventEmitter()
	@Output() subscriptionPlan = new EventEmitter()
	basesubscription = true
	topupcountries = false
	topupvalidity = false
	subscriptionList: any = []

	subscriptionTopupList: any = []
	couponInput: string = ""
	subscriptionTotal: any = "0.00"
	invalidCoupon: boolean = false
	selectedSubscriptionDetails: any
	selectedTopupCountryDetails: any
	showCheckout: boolean = true

	@Output() showPlan = new EventEmitter()
	@Input() showPlanBtn: any

	constructor(private router: Router, private subscriptionService: SubscriptionService, private authService: AuthService, private toast: MessageService) {}

	ngOnInit(): void {	
	}

	get URL() {
		return `${environment.ApiUrl}/downloadinvoice`
	}
	buttonclicked1(): void {
		this.basesubscription = true
		this.topupcountries = false
		this.topupvalidity = false
	}
	buttonclicked2(): void {
		this.basesubscription = false
		this.topupcountries = true
		this.topupvalidity = false
	}
	buttonclicked3(): void {
		this.basesubscription = false
		this.topupcountries = false
		this.topupvalidity = true
	}
	closeAllHome(): void {
		this.isInstructionVisible = false
	}
	moreabout(): void {
		this.isInstructionVisible = true
	}

	getSubscriptionList(): void {
		let data = {
			page: 1,
			perpage: 1000,
			studenttype: 1,
		}
		this.subscriptionService.getSubscriptions(data).subscribe((response) => {
			this.subscriptionList = response.subscriptions
			this.subscriptionList.forEach((item: any) => {
				item.country = item.country.split(",").map(Number)
				let filteredCountryIds = item.country
				item.selected = false
				item.selectedCoutry = {}
				item.filteredCountryList = this.countryList.filter((data: any) => filteredCountryIds.includes(data.id))
			})
		})
	}

	getSubscriptionTopupList(): void {
		this.subscriptionService.getSubscriptionTopups().subscribe((response) => {
			this.subscriptionTopupList = response.topups
			this.subscriptionTopupList.forEach((item: any) => {
				item.price = Number(item.price)
				item.countries = item.countries.split(",").map(Number)
				let filteredCountryIds = item.countries
				item.selected = false
				item.selectedCoutriesList = []
				item.filteredCountryList = this.countryList.filter((data: any) => filteredCountryIds.includes(data.id))
			})
		})
	}

	removeCountry(subId: number, selectedId: number): void {
		this.subscriptionTopupList.forEach((item: any) => {
			if (subId == item.id) {
				item.selectedCoutriesList = item.selectedCoutriesList.filter((data: any) => data.id !== selectedId)
			}
		})
	}

	selectedSubscriptionPlan(sub: any): void {
		this.showCheckout = false
		this.subscriptionList.forEach((item: any) => {
			item.selected = false
			if (sub.id == item.id) {
				item.selected = true
			}
		})
		this.selectedSubscriptionDetails = sub
		this.subscriptionTotal = sub.givenprice
	}

	selectedTopupCountryPlan(sub: any): void {
		if (sub?.selectedCoutriesList?.length > 0) {
			this.showCheckout = false
			this.subscriptionTopupList.forEach((item: any) => {
				item.selected = false
				if (sub.id == item.id) {
					item.selected = true
				}
			})
			this.selectedTopupCountryDetails = sub
			this.subscriptionTotal = sub.finalamount * sub.selectedCoutriesList.length
		} else {
			this.toast.add({ severity: "warn", summary: "Warn", detail: "Please Choose a country" })
		}
	}

	applyCoupon(): void {
		if (this.couponInput) {
			let data = {
				couponCode: this.couponInput,
				checkoutTotal: this.subscriptionTotal,
			}
			this.subscriptionService.applyCoupon(data).subscribe((response) => {
				if (response.status === true) {
					this.subscriptionTotal = Number(this.subscriptionTotal) - response.data.discountPrice
				} else {
					this.invalidCoupon = true
				}
			})
		}
	}

	checkout(): void {
		if (this.basesubscription && this.selectedSubscriptionDetails) {
			let data = {
				subscriptionId: this.selectedSubscriptionDetails.id,
				countryId: this.selectedSubscriptionDetails.selectedCoutry.id,
				finalPrice: this.subscriptionTotal,
				couponApplied: this.couponInput ? 1 : 0,
				coupon: this.couponInput,
			}
			this.subscriptionPlan.emit(data)
		} else {
			if (this.selectedTopupCountryDetails) {
				let data = {
					topupid: this.selectedTopupCountryDetails.id,
					countryId: this.selectedTopupCountryDetails.selectedCoutriesList.map((item: any) => item.id).toString(),
					finalPrice: this.subscriptionTotal,
					couponApplied: this.couponInput ? 1 : 0,
					coupon: this.couponInput,
				}
				this.subscriptionPlan.emit(data)
			} else {
				this.toast.add({ severity: "warn", summary: "Warn", detail: "Please Choose a plan" })
			}
		}
	}

	downloadInvoice(id: number): void {
		let data: any = {
			user_subscription_id: id,
		}
		let creditObj = this.accountBillingList.find((item: any) => item.product == "Credit")

		if (creditObj?.id == id) {
			data.payment_type = creditObj.payment_type
		}
		this.subscriptionService.downloadInvoice(data).subscribe((response) => {
			window.open(response, "_blank")
		})
	}

	gotoPlan() {
		this.showPlan.emit(true)
	}
	upgradePlan() {
		this.router.navigate(["pages/subscriptions/upgrade-subscription"])
	}
}
