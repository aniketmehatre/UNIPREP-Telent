import { Component, EventEmitter, HostListener, Input, OnInit, Output } from "@angular/core"
import { Billinginfo, OrderHistory, Subscription } from "../../../@Models/subscription"
import { environment } from "@env/environment.prod"
import { AuthService } from "src/app/Auth/auth.service"
import { MenuItem, MessageService } from "primeng/api"
import { SubscriptionService } from "../subscription.service"
import { User } from "src/app/@Models/user.model"

import { LocalStorageService } from "ngx-localstorage"
import { NgxUiLoaderService } from "ngx-ui-loader"
import { HttpClient } from "@angular/common/http"
// import CryptoJS from "crypto-js";
import { CommonModule } from "@angular/common";
import { DialogModule } from "primeng/dialog";
import { RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { PaginatorModule } from 'primeng/paginator';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { landingServices } from '../../landing/landing.service';
import { LocationService } from "src/app/location.service"
@Component({
	selector: "uni-subscription-data",
	templateUrl: "./subscription-data.component.html",
	styleUrls: ["./subscription-data.component.scss"],
	standalone: true,
	imports: [CommonModule, DialogModule, RouterModule, CardModule, PaginatorModule, FormsModule, ReactiveFormsModule, CarouselModule, ButtonModule, MultiSelectModule, SelectModule, InputGroupModule, InputTextModule, InputGroupAddonModule],
})
export class SubscriptionDataComponent implements OnInit {
	selectedButton: any
	countryList: any
	breadCrumb: MenuItem[] = []
	selectedCountry: any[] = [2, 3]
	isInstructionVisible: boolean = false
	@Input() billing!: any | null
	@Input() subscriptions!: Subscription | null
	@Input() history: OrderHistory[] = []
	@Output() upgrade = new EventEmitter()
	basesubscription = true
	topupcountries = false
	topupvalidity = false
	subscriptionList: any = []

	subscriptionTopupList: any = []
	couponInput: any = ""
	subscriptionTotal: any = "0.00"
	checkoutTotal: any = ""
	currentlyUsedCoupon: any = ""
	invalidCoupon: boolean = false
	selectedSubscriptionDetails: any
	selectedTopupCountryDetails: any
	showCheckout: boolean = true
	subscriptionAmt: any = "0.00"
	@Output() subscriptionPlan = new EventEmitter()
	studentType: number = 0
	loadingUserDetails: boolean = false
	discountAmount: any
	discountAmountEnable!: boolean
	usedCouponId: number = 0
	confirmModal: boolean = false
	user!: User | null
	discountPercentage: any
	@Output() showHistory = new EventEmitter()
	@Input() showHistoryBtn: any
	showCross: boolean = false
	iscouponReadonly: boolean = false
	currentCountry: string = ""
	continent: string = ""
	currency: string = ""
	monthlyPlan: number = 1
	education_level: string = ""
	activeButton: number = 1
	timeLeftInfoCard: any
	couponTab: boolean = false
	currentLocationCountry: any
	constructor(private authService: AuthService, private subscriptionService: SubscriptionService, 
		private storage: LocalStorageService, private toast: MessageService, private ngxService: NgxUiLoaderService, 
		private http: HttpClient,private landingPageService: landingServices, private locationService: LocationService) {}

	async ngOnInit(): Promise<void> {
		try {
			// let homeCountryName = null;
			let homeCountryName = this.storage.get("home_country_name");
			// if (encHomeCountryName) {
			// 	try {
			// 		const decryptedText = await this.authService.decryptData(encHomeCountryName);
			//
			// 		if (decryptedText && typeof decryptedText === 'string') {
			// 			// If it looks like JSON, try to parse it
			// 			if (decryptedText.trim().startsWith('{') || decryptedText.trim().startsWith('[')) {
			// 				try {
			// 					homeCountryName = JSON.parse(decryptedText);
			// 				} catch (parseError) {
			// 					// If JSON parsing fails, use the string as-is
			// 					homeCountryName = decryptedText;
			// 				}
			// 			} else {
			// 				// Use the decrypted text directly if it's not JSON formatted
			// 				homeCountryName = decryptedText;
			// 			}
			// 		} else {
			// 			console.warn("Decrypted text is empty or invalid");
			// 		}
			// 	} catch (decryptError) {
			// 		console.warn("Failed to decrypt home country data:", decryptError);
			// 	}
			// }

			this.timeLeftInfoCard = this.storage.get("time_card_info");
			this.discountAmountEnable = false;
			this.currentCountry = homeCountryName ? String(homeCountryName).trim() : "";
			this.user = this.authService.user;
			this.education_level = this.user?.education_level?.replace(/[\s\u00A0]/g, "").trim() || "HigherEducation";
			this.studentType = this.user?.student_type_id || 0;

			this.ngxService.startBackground();
			this.locationService.getCountry().subscribe(
				(data) => {
					this.ngxService.stopBackground();
					this.countryList = data;
					this.setActiveButton(this.activeButton)
					this.getSubscriptionTopupList();
				},
				(error) => {
					this.ngxService.stopBackground();
					console.error("Error fetching country data:", error);
				}
			);
		} catch (error) {
			console.error("Error in subscription-data initialization:", error);
			this.currentCountry = "";
			this.ngxService.stopBackground();
		}
	}
	get URL() {
		return `${environment.ApiUrl}/downloadinvoice`
	}

	buttonclicked1() {
		this.basesubscription = true
		this.topupcountries = false
		this.topupvalidity = false
	}
	buttonclicked2() {
		this.basesubscription = false
		this.topupcountries = true
		this.topupvalidity = false
	}
	buttonclicked3() {
		this.basesubscription = false
		this.topupcountries = false
		this.topupvalidity = true
	}
	closeAllHome() {
		this.isInstructionVisible = false
	}
	moreabout() {
		this.isInstructionVisible = true
	}

	getCurrentLoction(): Promise<void> {
		return new Promise((resolve) => {
			this.landingPageService.getCountryName().subscribe({
				next: (response: any) => {
					this.currentCountry = response.country_name;
					resolve();
				},
				error: error => {
					this.currentCountry = "India"; // If failed, use default
					resolve();
				}
			});
		});
	}

 


	async  getSubscriptionList() {
		 await this.getCurrentLoction();
		if(this.activeButton ==1){
			this.monthlyPlan=1;
		}else if(this.activeButton ==2){
			this.monthlyPlan=6;
		}else{
			this.monthlyPlan=12;
		}
		let data = {
			page: 1,
			perpage: 1000,
			studenttype: this.studentType,
			country: this.currentCountry,
			continent: this.continent,
			monthly_plan: this.studentType == 2 ? 12 : this.monthlyPlan,
			study_level: this.user?.education_level,
		}
		this.subscriptionService.getSubscriptions(data).subscribe((response) => {
			const mostPopularOnes = response.subscriptions.filter((item: any) => item.popular === 1)
			const filteredData = response.subscriptions.filter((item: any) => item.popular !== 1)
			filteredData.splice(1, 0, ...mostPopularOnes)
			this.subscriptionList = filteredData
			this.subscriptionList.forEach((item: any) => {
				item.country = item.country.split(",").map(Number)
				let filteredCountryIds = item.country
				item.selected = false
				item.selectedCountry = {}
				// item.filteredCountryList = this.countryList.filter((data: any) => filteredCountryIds.includes(data.id));
				item.filteredCountryList = this.countryList
				item.selectedCountry = this.countryList.find((country: any) => country.id === Number(this.user?.interested_country_id))
				item.isActive = item.popular == 1 ? true : false
				this.currency = item.currency
			})
		})
	}

	getSubscriptionTopupList() {
		this.subscriptionService.getSubscriptionTopups().subscribe((response) => {
			this.subscriptionTopupList = response.topups
			this.subscriptionTopupList.forEach((item: any) => {
				item.price = Number(item.price)
				item.countries = item.countries.split(",").map(Number)
				let filteredCountryIds = item.countries
				item.selected = false
				item.selectedCoutriesList = []
				item.filteredCountryList = this.countryList.filter((data: any) => filteredCountryIds.includes(data.id))
				item.isActive = item.popular == 1 ? true : false
			})
		})
	}

	removeCountry(subId: number, selectedId: number) {
		this.subscriptionTopupList.forEach((item: any) => {
			if (subId == item.id) {
				item.selectedCoutriesList = item.selectedCoutriesList.filter((data: any) => data.id !== selectedId)
			}
		})
	}

	selectedSubscriptionPlan(sub: any) {
		this.showCheckout = false
		this.checkoutTotal = ""
		this.subscriptionList.forEach((item: any) => {
			item.selected = false
			item.isActive = false
			if (sub.id == item.id) {
				item.selected = true
				item.isActive = true
			}
		})
		this.selectedSubscriptionDetails = sub
		this.subscriptionAmt = sub.givenprice
		this.subscriptionTotal = this.subscriptionAmt
	}

	getWholePricePerMonth(price: number, months: number): number {
		return Math.floor(price / months);
	}

	selectedTopupCountryPlan(sub: any) {
		if (sub?.selectedCoutriesList?.length > 0) {
			this.showCheckout = false
			this.checkoutTotal = ""
			this.subscriptionTopupList.forEach((item: any) => {
				item.selected = false
				item.isActive = false
				if (sub.id == item.id) {
					item.selected = true
					item.isActive = true
				}
			})
			this.selectedTopupCountryDetails = sub

			this.subscriptionTotal = sub.finalamount * sub.selectedCoutriesList.length
		} else {
			this.toast.add({
				severity: "warn",
				summary: "Warn",
				detail: "Please Choose a country",
			})
		}
	}

	applyCoupon() {
		if (this.showCheckout) {
			this.toast.add({
				severity: "error",
				summary: "Error",
				detail: "Please select the Plan!",
			})
			return
		}

		// if (this.subscriptionService.usedCoupon == this.couponInput && this.invalidCoupon) {
		//   this.toast.add({ severity: 'error', summary: 'Error', detail: 'Invalid Coupon Code' });
		//   return;
		// }
		// if (this.subscriptionService.usedCoupon == this.couponInput) {
		//   this.toast.add({ severity: 'error', summary: 'Error', detail: 'Coupon already used' });
		//   return;
		// }

		if (this.couponInput) {
			this.iscouponReadonly = true
			this.showCross = true
			this.subscriptionService.usedCoupon = this.couponInput
			let data = {
				couponCode: this.couponInput,
				checkoutTotal: this.subscriptionTotal,
				subscriptioncouponstatus: this.selectedSubscriptionDetails?.couponcode,
				subscription_id: this.selectedSubscriptionDetails?.id,
				subscription_plan_id: this.selectedSubscriptionDetails?.subscription_plan_id,
			}

			this.subscriptionService.applyCoupon(data).subscribe((response) => {
				if (response.success) {
					this.checkoutTotal = Number(this.subscriptionTotal) - response.discountPrice
					this.discountAmount = response.discountPrice
					this.discountPercentage = response.discountPercentage
					this.discountAmountEnable = true
					this.usedCouponId = response.coupon_id
					this.toast.add({
						severity: "success",
						summary: "Success",
						detail: "Coupon applied",
					})
				} else {
					this.toast.add({
						severity: "error",
						summary: "Error",
						detail: response.message,
					})
					this.invalidCoupon = true
					this.checkoutTotal = this.subscriptionTotal
					this.discountAmountEnable = false
					this.couponInput = ""
					this.showCross = false
					this.iscouponReadonly = false
				}
			})
		} else {
			this.toast.add({
				severity: "error",
				summary: "Error",
				detail: "Please make sure you have some Coupon Code!",
			})
		}
	}

	checkout(type: any) {
		this.confirmModal = false
		this.subscriptionService.getExtendedToken().subscribe(
			(response) => {
				if (response.token) {
					this.storage.set(environment.tokenKey, response.token)
				}
				if (this.basesubscription && this.selectedSubscriptionDetails) {
					let data = {
						subscriptionId: this.selectedSubscriptionDetails.id,
						countryId: this.selectedSubscriptionDetails?.selectedCountry?.id,
						finalPrice: this.checkoutTotal,
						couponApplied: this.iscouponReadonly ? 1 : 0,
						coupon: this.iscouponReadonly ? this.couponInput : "",
						coupon_id: this.usedCouponId,
						subscription_plan_id: this.selectedSubscriptionDetails?.subscription_plan_id,
						type: "",
					}
					data.type = type
					if (this.checkoutTotal == "") {
						data.finalPrice = this.subscriptionTotal
					}
					this.subscriptionPlan.emit(data)
				} else {
					if (this.selectedTopupCountryDetails) {
						let data = {
							topupid: this.selectedTopupCountryDetails.id,
							countryId: this.selectedTopupCountryDetails.selectedCoutriesList.map((item: any) => item.id).toString(),
							finalPrice: this.checkoutTotal,
							couponApplied: this.couponInput ? 1 : 0,
							coupon: this.couponInput,
							subscription_plan_id: this.selectedSubscriptionDetails?.subscription_plan_id,
							type: "",
						}
						data.type = type
						this.subscriptionPlan.emit(data)
					} else {
						this.toast.add({
							severity: "warn",
							summary: "Warn",
							detail: "Please Choose a plan",
						})
					}
				}
			},
			(error) => {
				if (this.basesubscription && this.selectedSubscriptionDetails) {
					let data = {
						subscriptionId: this.selectedSubscriptionDetails.id,
						countryId: this.selectedSubscriptionDetails.selectedCountry.id,
						finalPrice: this.checkoutTotal,
						couponApplied: this.couponInput ? 1 : 0,
						coupon: this.couponInput,
						subscription_plan_id: this.selectedSubscriptionDetails?.subscription_plan_id,
					}
					if (this.checkoutTotal == "") {
						data.finalPrice = this.subscriptionTotal
					}
					this.subscriptionPlan.emit(data)
				} else {
					if (this.selectedTopupCountryDetails) {
						let data = {
							topupid: this.selectedTopupCountryDetails.id,
							countryId: this.selectedTopupCountryDetails.selectedCoutriesList.map((item: any) => item.id).toString(),
							finalPrice: this.checkoutTotal,
							couponApplied: this.couponInput ? 1 : 0,
							coupon: this.couponInput,
							subscription_plan_id: this.selectedSubscriptionDetails?.subscription_plan_id,
						}
						this.subscriptionPlan.emit(data)
					} else {
						this.toast.add({
							severity: "warn",
							summary: "Warn",
							detail: "Please Choose a plan",
						})
					}
				}
			}
		)
	}

	onInput(event: any) {
		this.invalidCoupon = false
	}
	clearCoupon() {
		this.toast.add({
			severity: "error",
			summary: "Error",
			detail: "Coupon Removed",
		})
		this.subscriptionTotal = this.subscriptionAmt
		this.checkoutTotal = this.subscriptionTotal
		this.discountAmountEnable = false
		this.showCross = false
		this.iscouponReadonly = false
		this.couponInput = ""
	}

	gotoHistory() {
		this.showHistory.emit(true)
	}

	copyCoupon() {
		let offerDiv: any = document.getElementById("offerId")
		navigator.clipboard.writeText(offerDiv?.textContent)
	}
	getLocation(): void {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition((position) => {
				const longitude = position.coords.longitude
				const latitude = position.coords.latitude
				this.findCountry(longitude, latitude)
			})
		} else {
			console.log("No support for geolocation")
		}
	}

	findCountry(longitude: number, latitude: number): void {
		const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
		this.http.get<any>(url).subscribe(
			(data: any) => {
				this.currentCountry = data?.address?.country
				this.findContinent(this.currentCountry)
			},
			(error: any) => {
				console.log("Error fetching location:", error)
			}
		)
	}
	findContinent(countryName: string) {
		this.http.get(`https://restcountries.com/v3.1/name/${countryName}`).subscribe(
			(data: any) => {
				if (data?.length > 0) {
					this.continent = data[data?.length - 1].continents[0]
				} else {
					this.continent = "Not found"
				}
			},
			(error) => {
				console.error("Error:", error)
				this.continent = "Error"
			}
		)
	}
	// changeMonthlyPlan(event: any) {
	// 	let tabIndex = event.index
	// 	if (tabIndex == 0) {
	// 		this.monthlyPlan = 6
	// 	} else {
	// 		this.monthlyPlan = 12
	// 	}
	// 	this.getSubscriptionList()
	// }
		// Button styles
		button1Style = {
			"background-color": "#FFFFFF",
			border: "1px solid var(--uniprep-primary)",
			color: "#000000",
		}
	
		button2Style = {
			"background-color": "#FFFFFF",
			border: "1px solid var(--uniprep-primary)",
			color: "#000000",
		}
		button3Style = {
			"background-color": "#FFFFFF",
			border: "1px solid var(--uniprep-primary)",
			color: "#000000",
		}
	setActiveButton(buttonNumber: number): void {
		this.button1Style = {
			"background-color": "#FFFFFF",
			border: "1px solid var(--uniprep-primary)",
			color: "#000000",
		}

		this.button2Style = {
			"background-color": "#FFFFFF",
			border: "1px solid var(--uniprep-primary)",
			color: "#000000",
		}
		this.button3Style = {
			"background-color": "#FFFFFF",
			border: "1px solid var(--uniprep-primary)",
			color: "#000000",
		}
		this.couponTab = false
		// Set styles for the clicked button
		if (buttonNumber === 1) {
			this.activeButton = 1
			this.button1Style = {
				"background-color": "var(--uniprep-primary)",
				border: "1px solid var(--uniprep-primary)",
				color: "#FFFFFF",
			}
			this.couponTab = true
		} else if (buttonNumber === 2) {
			this.activeButton = 2
			this.button2Style = {
				"background-color": "var(--uniprep-primary)",
				border: "1px solid var(--uniprep-primary)",
				color: "#FFFFFF",
			}
		} else if (buttonNumber === 3) {
			this.activeButton = 3
			this.button3Style = {
				"background-color": "var(--uniprep-primary)",
				border: "1px solid var(--uniprep-primary)",
				color: "#FFFFFF",
			}
		}
		this.getSubscriptionList();
	}

 
}
