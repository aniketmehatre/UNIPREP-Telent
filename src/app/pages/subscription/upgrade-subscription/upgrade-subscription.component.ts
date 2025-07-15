import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core"
import { Billinginfo, OrderHistory, Subscription, SubscriptionSuccess } from "../../../@Models/subscription"
import { environment } from "@env/environment.prod"
import { AuthService } from "src/app/Auth/auth.service"
import { ConfirmationService, MenuItem, MessageService } from "primeng/api"
import { SubscriptionService } from "../subscription.service"
import { User } from "src/app/@Models/user.model"
import { Store } from "@ngrx/store"
import { SubscriptionState } from "../store/reducer"
import { selectPlans, selectLoading } from "../store/selectors"

import { LocalStorageService } from "ngx-localstorage"
import { NgxUiLoaderService } from "ngx-ui-loader"
import { Router } from "@angular/router"
import { WindowRefService } from "../window-ref.service"
import { HttpClient } from "@angular/common/http"
import { StripeCardElementOptions, StripeElementsOptions, StripePaymentElementOptions } from "@stripe/stripe-js"
import { injectStripe, NgxStripeModule, StripeCardComponent, StripePaymentElementComponent, StripeService } from "ngx-stripe"
import { switchMap } from "rxjs"
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
import { ConfirmDialogModule } from "primeng/confirmdialog"
import { ToastModule } from "primeng/toast"
import { TabViewModule } from "primeng/tabview"
import { log } from "node:console"
import { landingServices } from '../../landing/landing.service';
import { LocationService } from "src/app/location.service"
@Component({
	selector: "uni-upgrade-subscription",
	templateUrl: "./upgrade-subscription.component.html",
	styleUrls: ["./upgrade-subscription.component.scss"],
	standalone: true,
    imports: [CommonModule,TabViewModule, DialogModule, RouterModule, CardModule, PaginatorModule, FormsModule, ReactiveFormsModule, CarouselModule, ButtonModule, MultiSelectModule, SelectModule, InputGroupModule, InputTextModule, InputGroupAddonModule, ConfirmDialogModule, ToastModule,NgxStripeModule],
})
export class UpgradeSubscriptionComponent implements OnInit {
	selectedButton: any
	countryList: any
	breadCrumb: MenuItem[] = []
	isInstructionVisible: boolean = false
	topupcountries = false
	topupvalidity = false
	subscriptionList: any = []
	showPayLoading = false
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
	studentType: number = 0
	loadingUserDetails: boolean = false
	discountAmount: any
	discountAmountEnable!: boolean
	usedCouponId: number = 0
	confirmModal: boolean = false
	plansLoaded: boolean = false
	user!: User | null
	subscriptionDetails: any
	success!: SubscriptionSuccess
	discountPercentage: any
	existingSubscription: any[] = []
	showCross: boolean = false
	iscouponReadonly: boolean = false
	isPlanExpired: boolean = false
	currentCountry: string = "India"
	continent: string = "Asia"
	currency: string = ""
	monthlyPlan: number = 1
	activeTabIndex: number = 0
	education_level: string = ""
	activeButton: number = 1
	constructor(private authService: AuthService, private subscriptionService: SubscriptionService, private storage: LocalStorageService, private toast: MessageService, private ngxService: NgxUiLoaderService, private router: Router, private winRef: WindowRefService, private store: Store<SubscriptionState>, private http: HttpClient, private confirmationService: ConfirmationService, private messageService: MessageService, private stripeService: StripeService,private landingPageService: landingServices, private locationService: LocationService) {}
	timeLeftInfoCard: any
	userName: any
	phone: any
	email: any
	couponTab: boolean = false
	async ngOnInit(): Promise<void> {
		try {
			// Handle userName decryption with better error handling
			this.userName = this.storage.get("Name");
			// if (encryptedName) {
			// 	try {
			// 		const decryptedText = await this.authService.decryptData(encryptedName);
			// 		if (decryptedText && decryptedText.trim() !== "") {
			// 			try {
			// 				if (decryptedText.startsWith("{") || decryptedText.startsWith("[") || decryptedText.startsWith('"')) {
			// 					this.userName = JSON.parse(decryptedText);
			// 				} else {
			// 					this.userName = decryptedText;
			// 				}
			// 			} catch (parseError) {
			// 				console.warn("Failed to parse decrypted name:", parseError);
			// 				this.userName = decryptedText;
			// 			}
			// 		}
			// 	} catch (error) {
			// 		console.warn("Failed to decrypt name:", error);
			// 	}
			// }

			this.phone = this.storage.get("phone");
			// if (encPhone) {
			// 	try {
			// 		const decryptedPhone = await this.authService.decryptData(encPhone);
			// 		this.phone = decryptedPhone;
			// 	} catch (error) {
			// 		console.warn("Failed to decrypt phone:", error);
			// 	}
			// }

			this.email = this.storage.get("email");
			// if (encEmail) {
			// 	try {
			// 		const decryptedEmail = await this.authService.decryptData(encEmail);
			// 		this.email = decryptedEmail;
			// 	} catch (error) {
			// 		console.warn("Failed to decrypt email:", error);
			// 	}
			// }

			this.timeLeftInfoCard = this.storage.get("time_card_info")
			this.currentCountry = this.storage.get("home_country_name") || "India"
			this.discountAmountEnable = false
			this.user = this.authService.user
			this.education_level = this.user?.education_level?.replace(/[\s\u00A0]/g, "").trim() || "HigherEducation"
			this.studentType = this.user?.student_type_id || 0

			// Load existing subscription which will then load the subscription plans
			this.loadExistingSubscription()

			// Load country list
			this.ngxService.startBackground()
			this.locationService.getCountry().subscribe({
				next: (data) => {
					this.countryList = data
					this.ngxService.stopBackground()
				},
				error: (error) => {
					console.error("Error fetching country data:", error)
					this.toast.add({
						severity: "error",
						summary: "Error",
						detail: "Failed to load country list",
					})
					this.ngxService.stopBackground()
				},
			})
		} catch (error) {
			console.error("Error in upgrade subscription initialization:", error)
			// Set safe fallback values
			this.currentCountry = "India"
			this.userName = "User"
			this.education_level = "HigherEducation"
			this.studentType = 0
			this.user = this.authService.user
			this.ngxService.stopBackground()

			// Still try to load essential data
			this.loadExistingSubscription()
		}
	}
	get URL() {
		return `${environment.ApiUrl}/downloadinvoice`
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

	async getSubscriptionList(canChangeSubscription: string) {
		await this.getCurrentLoction();
		this.ngxService.startBackground()
		if(this.activeButton ==1){
			this.monthlyPlan=1;
		}else if(this.activeButton ==2){
			this.monthlyPlan=6;
		}else{
			this.monthlyPlan=12;
		}
		const data = {
			page: 1,
			perpage: 1000,
			studenttype: this.studentType,
			country: this.currentCountry,
			continent: this.continent,
			monthly_plan: this.monthlyPlan,
			study_level: this.user?.education_level,
		}
		this.subscriptionService.getSubscriptions(data).subscribe({
			next: (response) => {
				// Sort and organize subscription data
				const mostPopularOnes = response.subscriptions.filter((item: any) => item.popular === 1)
				const filteredData = response.subscriptions.filter((item: any) => item.popular !== 1)
				filteredData.splice(1, 0, ...mostPopularOnes)

				this.subscriptionList = filteredData
				this.subscriptionList.map((item: any) => (this.currency = item.currency))
				this.plansLoaded = true

				// Get plan expiry status
				this.getPlanexpire()
				this.ngxService.stopBackground()
			},
			error: (error) => {
				console.error("Error loading subscription plans:", error)
				this.toast.add({
					severity: "error",
					summary: "Error",
					detail: "Failed to load subscription plans",
				})
				this.ngxService.stopBackground()
			},
		})
	}

	// getSubscriptionTopupList() {
	//   this.subscriptionService.getSubscriptionTopups().subscribe((response) => {
	//     this.subscriptionTopupList = response.topups;
	//     this.subscriptionTopupList.forEach((item: any) => {
	//       item.price = Number(item.price);
	//       item.countries = item.countries.split(',').map(Number);
	//       let filteredCountryIds = item.countries;
	//       item.selected = false;
	//       item.selectedCoutriesList = [];
	//       item.filteredCountryList = this.countryList.filter((data: any) => filteredCountryIds.includes(data.id));
	//       item.isActive = item.popular == 1 ? true : false;
	//     });
	//   });
	// }

	// removeCountry(subId: number, selectedId: number) {
	//   this.subscriptionTopupList.forEach((item: any) => {
	//     if (subId == item.id) {
	//       item.selectedCoutriesList = item.selectedCoutriesList.filter((data: any) => data.id !== selectedId);
	//     }
	//   });
	// }

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

	// selectedTopupCountryPlan(sub: any) {
	//   if (sub?.selectedCoutriesList?.length > 0) {
	//     this.showCheckout = false;
	//     this.checkoutTotal = '';
	//     this.subscriptionTopupList.forEach((item: any) => {
	//       item.selected = false;
	//       item.isActive = false;
	//       if (sub.id == item.id) {
	//         item.selected = true;
	//         item.isActive = true;
	//       }
	//     });
	//     this.selectedTopupCountryDetails = sub;

	//     this.subscriptionTotal = sub.finalamount * sub.selectedCoutriesList.length;

	//   }
	//   else {
	//     this.toast.add({ severity: 'warn', summary: 'Warn', detail: 'Please Choose a country' });
	//   }

	// }

	loadExistingSubscription() {
		this.ngxService.startBackground()
		this.subscriptionService.getExistingSubscription().subscribe({
			next: (response: any) => {
				this.existingSubscription = response.subscription
				this.existingSubscription.map((plan) => (plan.subscriptionDays = plan.remainingdays.split("-")[0].trim().replace(/\D/g, "")))	
				// Set monthly plan based on subscription days
				if (this.existingSubscription[0].subscriptionDays == 30) {
					this.existingSubscription[0].monthlyPlan = 1
					this.setActiveButton(1)
				} else if (this.existingSubscription[0].subscriptionDays == 180) {
					this.existingSubscription[0].monthlyPlan = 6
					// this.activeTabIndex = 0
					this.setActiveButton(2)
				} else {
					this.existingSubscription[0].monthlyPlan = 12
					// this.activeTabIndex = 1
					this.setActiveButton(3)
				}
				// Get subscription list with proper parameters
			},
			error: (error) => {
				console.error("Error loading existing subscription:", error)
				this.toast.add({
					severity: "error",
					summary: "Error",
					detail: "Failed to load existing subscription",
				})
				this.ngxService.stopBackground()
			},
		})
	}
	getPlanexpire() {
		this.authService.getNewUserTimeLeft().subscribe((res) => {
			this.isPlanExpired = res.time_left.plan == "subscription_expired" ? true : false
			if (this.isPlanExpired) {
				this.subscriptionList.map((item: any) => (item.available = true))
			} else {
				this.subscriptionList.forEach((item: any) => {
					item.selected = false
					item.isActive = item.popular == 1 ? true : false
					item.available = false
					if (this.existingSubscription[0]?.plan == "Student") {
						item.available = true
					}
					if (this.existingSubscription[0]?.plan == "Career" && item.subscription_plan != "Student") {
						item.available = true
					}
				})
			}
		})
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
			this.showCross = true
			this.iscouponReadonly = true
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

	checkout(event: Event, type: any) {
		this.confirmModal = false
		if (this.existingSubscription[0]?.monthlyPlan > this.monthlyPlan) {
			this.confirmSubscription(event, "Are you sure you want to upgrade to the new " + this.monthlyPlan + " month " + this.selectedSubscriptionDetails.subscription_plan + " plan? Please note that your current " + this.existingSubscription[0].monthlyPlan + " month " + this.existingSubscription[0].plan + " plan will expire upon upgrading")
		} else {
			this.subscribe(type)
		}
	}
	subscribe(type: any) {
		this.subscriptionService.getExtendedToken().subscribe(
			(response) => {
				if (response?.token) {
					this.storage.set(environment.tokenKey, response.token)
				}

				if (this.selectedSubscriptionDetails) {
					let data = {
						subscriptionId: this.selectedSubscriptionDetails.id,
						countryId: Number(this.user?.interested_country_id),
						finalPrice: this.checkoutTotal == "" ? this.subscriptionTotal : this.checkoutTotal,
						couponApplied: this.iscouponReadonly ? 1 : 0,
						coupon: this.iscouponReadonly ? this.couponInput : "",
						coupon_id: this.usedCouponId,
						subscription_plan_id: this.selectedSubscriptionDetails?.subscription_plan_id,
					}
					this.pay(data, type)
				}
				// else {
				//   if (this.selectedTopupCountryDetails) {
				//     let data = {
				//       topupid: this.selectedTopupCountryDetails.id,
				//       countryId: this.selectedTopupCountryDetails.selectedCoutriesList.map((item: any) => item.id).toString(),
				//       finalPrice: this.checkoutTotal,
				//       couponApplied: this.couponInput ? 1 : 0,
				//       coupon: this.couponInput,
				//     }
				//     this.pay(data);
				//   }
				//   else {
				//     this.toast.add({ severity: 'warn', summary: 'Warn', detail: 'Please Choose a plan' });
				//   }
				// }
			},
			(error) => {
				if (this.selectedSubscriptionDetails) {
					let data = {
						subscriptionId: this.selectedSubscriptionDetails.id,
						countryId: Number(this.user?.interested_country_id),
						finalPrice: this.checkoutTotal,
						couponApplied: this.couponInput ? 1 : 0,
						coupon: this.couponInput,
						subscription_plan_id: this.selectedSubscriptionDetails?.subscription_plan_id,
					}
					if (this.checkoutTotal == "") {
						data.finalPrice = this.subscriptionTotal
					}
					this.pay(data, type)
				}
				// else {
				//   if (this.selectedTopupCountryDetails) {
				//     let data = {
				//       topupid: this.selectedTopupCountryDetails.id,
				//       countryId: this.selectedTopupCountryDetails.selectedCoutriesList.map((item: any) => item.id).toString(),
				//       finalPrice: this.checkoutTotal,
				//       couponApplied: this.couponInput ? 1 : 0,
				//       coupon: this.couponInput,
				//     }
				//     this.pay(data);
				//   }
				//   else {
				//     this.toast.add({ severity: 'warn', summary: 'Warn', detail: 'Please Choose a plan' });
				//   }
				// }
			}
		)
	}
	confirmSubscription(event: Event, message: string) {
		this.confirmationService.confirm({
			target: event.target as EventTarget,
			message: message,
			header: "Confirmation",
			acceptIcon: "none",
			rejectIcon: "none",
			rejectButtonStyleClass: "p-button-text",
			accept: () => {
				//this.subscribe();
			},
			reject: () => {
				this.messageService.add({
					severity: "error",
					summary: "Rejected",
					detail: "You have rejected",
				})
			},
		})
	}
	payusingstripe() {
		// this.showPayLoading = true;
		this.stripdata = this.subscriptionDetails
		this.selectedcost = this.stripdata.finalPrice
		this.subscriptionService.createPaymentIntent(this.stripdata).subscribe((pi) => {
			this.elementsOptions.clientSecret = pi.client_secret as string
			this.stripdata.clientSecret = pi.client_secret as string
			this.currencyType = pi.currency
			this.cardvisibility = true
		})
		return
	}
	currencyType: any
	pay(value: any, type: any) {
		if (value.subscriptionId) {
			if (type == "razorpay") {
				this.subscriptionService.placeSubscriptionOrder(value).subscribe((data) => {
					this.currencyType = data.currency
					if (data.success == false) {
						this.toast.add({
							severity: "error",
							summary: "Error",
							detail: data.message,
						})
						return
					}
					this.subscriptionDetails = value
					this.payWithRazor(data.orderid)
				})
			} else {
				this.subscriptionDetails = value
				this.payusingstripe()
			}
		}
		// else {
		//     this.subscriptionService.placeTopupSubscriptionOrder(value).subscribe((data) => {
		//         this.payWithRazor(data.orderid);
		//     });
		// }
	}
	payWithRazor(orderid: any) {
		let razorKey = "rzp_live_YErYQVqDIrZn1D"
		if (environment.domain == "api.uniprep.ai") {
			razorKey = "rzp_test_Crpr7YkjPaCLEr"
		}
		// let phone
		let phone = this.storage.get("phone")
		// if (encPhone) {
		// 	const bytes = this.authService.decryptData(encPhone)
		// 	//const bytes = CryptoJS.AES.decrypt(encPhone, environment.secretKeySalt);
		// 	phone = JSON.parse(bytes.toString())
		// }
		let email = this.storage.get("email")
		// if (encEmail) {
		// 	const bytes = this.authService.decryptData(encEmail)
		// 	// const bytes = CryptoJS.AES.decrypt(encEmail, environment.secretKeySalt);
		// 	email = JSON.parse(bytes.toString())
		// }
		const options: any = {
			key: razorKey,
			amount: this.subscriptionDetails?.finalPrice * 100,
			currency: "INR",
			name: "UNIPREP",
			description: "UNIPREP Subscription",
			image: "https://uniprep.ai/uniprep-assets/images/icon-light.svg",
			order_id: orderid,

			prefill: {
				name: this.selectedSubscriptionDetails?.subscription,
				email: email,
				// contact: this.storage.get("phone"),
				contact: phone === null || phone === "" ? "9876543210" : phone,
			},
			notes: {
				address: " 165/1,Opp Brahmasthana Kalyana Mantapa Sahukar Chenniah Road, TK Layout, Mysuru - 570023 ",
			},
			modal: {
				escape: false,
			},
			theme: {
				color: "#3f4c83",
			},
		}

		options.handler = (response: any, error: any) => {
			options.response = response
			var paymentdata = {
				orderid: response?.razorpay_order_id,
				paymentid: response?.razorpay_payment_id,
			}

			this.authService.updateSubscriptionName(this.selectedSubscriptionDetails?.subscription || "")

			if (this.subscriptionDetails?.subscriptionId) {
				this.subscriptionService.PaymentComplete(paymentdata).subscribe(
					(res: any) => {
						this.success = res
						this.subscriptionService.doneLoading()
						this.gotoHistory()
					},
					(error: any) => {
						this.subscriptionService.doneLoading()
						this.gotoHistory()
					}
				)
			}
			// else {
			//     let data = {
			//         order_id: response?.razorpay_order_id,
			//         payment_reference_id: response?.razorpay_payment_id,
			//     }
			//     this.subscriptionService.topupPaymentComplete(data).subscribe(
			//         (res: any) => {
			//             this.success = res;
			//             this.subscriptionService.doneLoading();
			//             this.loadSubData();
			//             window.location.reload();
			//         },
			//         (error: any) => {
			//             // this.toastr.warning(error.error.message);
			//             this.subscriptionService.doneLoading();
			//             this.loadSubData();
			//             window.location.reload();
			//         }
			//     );
			// }
		}
		options.modal.ondismiss = () => {
			this.toast.add({
				severity: "error",
				summary: "Error",
				detail: "Transaction cancelled",
			})
		}
		const rzp = new this.winRef.nativeWindow.Razorpay(options)
		rzp.open()
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
		this.router.navigate(["pages/subscriptions"])
		setTimeout(() => {
			window.location.reload()
		}, 500)
	}
	getLocation(): void {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					const longitude = position.coords.longitude
					const latitude = position.coords.latitude
					this.findCountry(longitude, latitude)
				},
				(error) => {
					this.loadExistingSubscription()
					console.log("location access blocked")
				}
			)
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
				this.loadExistingSubscription()
			},
			(error) => {
				console.error("Error:", error)
				this.continent = "Error"
			}
		)
	}
	// changeMonthlyPlan(event: any) {
	// 	let tabIndex = event.index
	// 	let data = ""
	// 	if (tabIndex == 0) {
	// 		this.monthlyPlan = 6
	// 	} else if (tabIndex == 1) {
	// 		this.monthlyPlan = 12
	// 	}
	// 	if (this.monthlyPlan > this.existingSubscription[0]?.monthlyPlan) {
	// 		data = "canSubscribeAll"
	// 	} else if (this.monthlyPlan == this.existingSubscription[0]?.monthlyPlan) {
	// 		this.loadExistingSubscription()
	// 		return
	// 	} else {
	// 		data = "canSubscribeSome"
	// 	}
	// 	this.getSubscriptionList(data)
	// }

	protected readonly localStorage = localStorage

	@ViewChild(StripePaymentElementComponent) card: StripePaymentElementComponent

	cardOptions: StripeCardElementOptions = {
		iconStyle: "solid",
		hideIcon: false,
		style: {
			base: {
				color: "var(--p-neutral-950)",
			},
			invalid: {
				color: "red",
			},
		},
	}
	elementsOptions: StripeElementsOptions = {
		locale: "en",
		appearance: {
			theme: "stripe",
			labels: "floating",
			variables: {
				colorPrimary: "#673ab7",
			},
		},
	}
	cardvisibility = false
	stripdata: any
	selectedcost = 0
	paywithstripe() {
		if (!this.stripdata) {
			return
		}
		this.stripeService
			.confirmPayment({
				elements: this.card.elements,
				confirmParams: {
					payment_method_data: {
						billing_details: {
							name: this.userName,
						},
					},
				},
				redirect: "if_required",
			})
			.subscribe((result: any) => {
				console.log("Payment Status:", result)
				if (result.error) {
					console.log(result.error.message)
					this.toast.add({
						severity: "error",
						summary: "Error",
						detail: "Transaction cancelled",
					})
				} else {
					if (result.paymentIntent.status === "succeeded") {
						this.cardvisibility = false
						this.subscriptionService.doneLoading()
						this.toast.add({
							severity: "success",
							summary: "Success",
							detail: "Purchase Completed",
						})
						this.gotoHistory()
					}
				}
			})
	}

	loadSubscriptionPlans() {
		console.log("UpgradeSubscription: Starting to load subscription plans")
		this.ngxService.startBackground()

		// Dispatch the action to load plans
		this.subscriptionService.loadSubscriptionList()
		console.log("UpgradeSubscription: Dispatched loadSubscriptionList action")

		// Subscribe to the plans selector
		this.store.select(selectPlans).subscribe({
			next: (data) => {
				console.log("UpgradeSubscription: Received plans data:", data)
				if (data) {
					this.subscriptionList = data
					this.plansLoaded = true
					console.log("UpgradeSubscription: Plans loaded successfully")
				}
				this.ngxService.stopBackground()
			},
			error: (error) => {
				console.error("UpgradeSubscription: Error loading plans:", error)
				this.ngxService.stopBackground()
				// Show error toast
				this.messageService.add({
					severity: "error",
					summary: "Error",
					detail: "Failed to load subscription plans. Please try again.",
				})
			},
		})

		// Subscribe to loading state to handle the loader
		this.store.select(selectLoading).subscribe({
			next: (loading) => {
				console.log("UpgradeSubscription: Loading state changed:", loading)
				if (loading) {
					this.ngxService.startBackground()
				} else {
					this.ngxService.stopBackground()
				}
			},
			error: (error) => {
				console.error("UpgradeSubscription: Error in loading state:", error)
				this.ngxService.stopBackground()
			},
		})
	}
	button1Style = {
		"background-color": "#FFFFFF",
		border: "1px solid var(--p-primary-500)",
		color: "var(--p-neutral-950)",
	}

	button2Style = {
		"background-color": "#FFFFFF",
		border: "1px solid var(--p-primary-500)",
		color: "var(--p-neutral-950)",
	}
	button3Style = {
		"background-color": "#FFFFFF",
		border: "1px solid var(--p-primary-500)",
		color: "var(--p-neutral-950)",
	}
	setActiveButtonUpgrade(buttonNumber:number){
		this.couponTab = false
		let tabIndex = buttonNumber
		let data = ""
		if (tabIndex == 1) {
			this.monthlyPlan = 1
			this.couponTab = true
		} else if (tabIndex == 2) {
			this.monthlyPlan = 6
		} else if (tabIndex == 3) {
			this.monthlyPlan = 12
		}
		if (this.monthlyPlan > this.existingSubscription[0]?.monthlyPlan) {
			data = "canSubscribeAll"
		} else if (this.monthlyPlan == this.existingSubscription[0]?.monthlyPlan) {
			this.loadExistingSubscription()
			return
		} else {
			data = "canSubscribeSome"
		}
		this.setActiveButton(tabIndex)
	}
	setActiveButton(buttonNumber: number): void {
		this.button1Style = {
			"background-color": "#FFFFFF",
			border: "1px solid var(--p-primary-500)",
			color: "var(--p-neutral-950)",
		}

		this.button2Style = {
			"background-color": "#FFFFFF",
			border: "1px solid var(--p-primary-500)",
			color: "var(--p-neutral-950)",
		}
		this.button3Style = {
			"background-color": "#FFFFFF",
			border: "1px solid var(--p-primary-500)",
			color: "var(--p-neutral-950)",
		}

		// Set styles for the clicked button
		if (buttonNumber === 1) {
			this.activeButton = 1
			this.button1Style = {
				"background-color": "var(--p-primary-500)",
				border: "1px solid var(--p-primary-500)",
				color: "#FFFFFF",
			}
		} else if (buttonNumber === 2) {
			this.activeButton = 2
			this.button2Style = {
				"background-color": "var(--p-primary-500)",
				border: "1px solid var(--p-primary-500)",
				color: "#FFFFFF",
			}
		} else if (buttonNumber === 3) {
			this.activeButton = 3
			this.button3Style = {
				"background-color": "var(--p-primary-500)",
				border: "1px solid var(--p-primary-500)",
				color: "#FFFFFF",
			}
		}
		this.getSubscriptionList("initial")
	}
}
