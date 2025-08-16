import { Component, OnInit, ViewChild } from "@angular/core"
import { AuthService } from "src/app/Auth/auth.service"
import { SubscriptionService } from "./subscription.service"
import { WindowRefService } from "./window-ref.service"
import { MessageService } from "primeng/api"
import { Billinginfo, OrderHistory, Subscription, SubscriptionPlan, SubscriptionSuccess } from "../../@Models/subscription"
import { Observable } from "rxjs"
import { DataService } from "src/app/services/data.service"
import { environment } from "@env/environment"
import { DashboardService } from "../dashboard/dashboard.service"
import { NgxStripeModule, StripePaymentElementComponent, StripeService } from "ngx-stripe"
import { StripeCardElementOptions, StripeElementsOptions } from "@stripe/stripe-js"
// import CryptoJS from "crypto-js"
import { NgxUiLoaderService } from "ngx-ui-loader"
import { CommonModule } from "@angular/common"
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import { DialogModule } from "primeng/dialog"
import { SubscriptionHistoryComponent } from "./subscription-history/subscription-history.component"
import { SubscriptionDataComponent } from "./subscription-data/subscription-data.component"
import { SubscriptionListComponent } from "./subscription-list/subscription-list.component"
import { SubscriptionBillingComponent } from "./subscription-billing/subscription-billing.component"
import { SubscriptionSuccessComponent } from "./subscription-success/subscription-success.component"
import { StorageService } from "../../services/storage.service";
import { LocationService } from "src/app/services/location.service"
import { CollegeSubscriptionDataComponent } from "./clg-subscription-data/clg-subscription-data.component"
import { PageFacadeService } from "../page-facade.service"
@Component({
	selector: "uni-subscription",
	templateUrl: "./subscription.component.html",
	styleUrls: ["./subscription.component.scss"],
	standalone: true,
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		DialogModule,
		SubscriptionHistoryComponent,
		CollegeSubscriptionDataComponent,
		SubscriptionDataComponent,
		SubscriptionListComponent,
		SubscriptionBillingComponent,
		SubscriptionSuccessComponent,
		NgxStripeModule
	],
})
export class SubscriptionComponent implements OnInit {
	stage = 1
	subscriptions$!: Observable<SubscriptionPlan[]>
	orderLoading$!: Observable<boolean>
	selectedSubscription!: SubscriptionPlan | null
	selectedQuestionCredit!: any | null
	showPayLoading = false
	orderHistory$!: Observable<OrderHistory[]>
	subscriptionDetail$!: Observable<Subscription | null>
	billingInfo$!: Observable<Billinginfo | null>
	success!: SubscriptionSuccess
	user: any
	countryList: any
	userName: any
	isSubOrQuestion: number = 1
	subscribedCountryList: any[] = []
	subscribedHistoryData: any[] = []
	userSubscription: any = []
	subscriptionDetails: any
	accountBillingData: any[] = []
	loadingSubscriptionHistory: boolean = false
	loadingExistingSubscription: boolean = false
	showSubscriptionedData: boolean = false
	showPlanBtn: boolean = false
	showHistoryBtn: boolean = false
	currentCountry: string = ""
	education_level: string = "HigherEducation"
	studentType: number = 0
	homeCountryName: any
	phone: string = ''
	email: string = ''
	isCollegeStudent: boolean = true;

	constructor(private subscriptionService: SubscriptionService, private winRef: WindowRefService,
		private authService: AuthService, private toastr: MessageService,
		private dataService: DataService, private dashboardService: DashboardService,
		private stripeService: StripeService, private ngxService: NgxUiLoaderService,
		private storage: StorageService, private locationService: LocationService,
		private pageFacade: PageFacadeService
	) {
	}
	async ngOnInit(): Promise<void> {
		//why premium whatsapp message trigger
		this.pageFacade.sendWhatsappMessage(); 
		try {
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
			// 		}
			// 	} catch (decryptError) {
			// 		console.warn("Failed to decrypt home country data:", decryptError);
			// 	}
			// }

			// let phone = null;
			let phone = this.storage.get("phone");
			// if (encPhone) {
			// 	try {
			// 		const decryptedPhone = await this.authService.decryptData(encPhone);
			// 		if (decryptedPhone && typeof decryptedPhone === 'string') {
			// 			phone = decryptedPhone;
			// 		}
			// 	} catch (error) {
			// 		console.warn("Failed to decrypt phone data:", error);
			// 	}
			// }

			let email = this.storage.get("email");
			// if (encEmail) {
			// 	try {
			// 		const decryptedEmail = await this.authService.decryptData(encEmail);
			// 		if (decryptedEmail && typeof decryptedEmail === 'string') {
			// 			email = decryptedEmail;
			// 		}
			// 	} catch (error) {
			// 		console.warn("Failed to decrypt email data:", error);
			// 	}
			// }

			this.currentCountry = homeCountryName ? String(homeCountryName).trim() : "";
			this.phone = phone || '';
			this.email = email || '';

			this.user = this.authService.user;
			this.education_level = this.user?.education_level?.replace(/[\s\u00A0]/g, "").trim() || "HigherEducation";
			this.studentType = this.user?.student_type_id || 0;

			this.ngxService.startBackground();
			this.locationService.getCountry().subscribe(
				(data) => {
					this.ngxService.stopBackground();
					this.countryList = data;
					this.getSubscriptionList();
					this.getSubscriptionTopupList();
				},
				(error) => {
					this.ngxService.stopBackground();
					console.error("Error fetching country data:", error);
				}
			);
		} catch (error) {
			console.error("Error in subscription initialization:", error);
			this.currentCountry = "";
			this.ngxService.stopBackground();
		}

		if (this.dashboardService.isinitialstart) {
			window.location.reload();
		}

		this.authService.getNewUserTimeLeft().subscribe((res) => {
			this.dashboardService.updatedata(res.time_left);
			let data = res.time_left;
			if (data.plan === "expired" || data.plan === "subscription_expired") {
				this.showPlanBtn = true;
			} else {
				this.showPlanBtn = false;
			}
		});

		if (!this.authService?.user?.subscription) {
			this.stage = 1;
			return;
		}
		// this.loadSubData();

	}

	start() {
		this.showPayLoading = false
		this.stage = 1
		// this.loadSubscriptions();
	}

	loadSubData() {
		this.loadSubscriptionHistory()
		this.loadExistingSubscription()
	}

	loadSubDetails() {
		this.orderHistory$ = this.subscriptionService.getOrderHistory()
		this.subscriptionDetail$ = this.subscriptionService.getSubscriptionDetail()
		this.subscriptionDetail$.subscribe((data) => { })

		this.billingInfo$ = this.subscriptionService.getBillingInfo()
		//this.subscriptionService.loadSubDetails();
	}
	loadSubscriptions() {
		this.subscriptions$ = this.subscriptionService.getSubscriptionList()
		this.subscriptions$.subscribe((data) => { })
		this.orderLoading$ = this.subscriptionService.getLoading()
		this.subscriptionService.loadSubscriptionList()
		this.subscriptionService.getOrderID().subscribe((order) => {
			if (!order) {
				return
			}
			this.payWithRazor(order)
		})
	}
	onSelectSubscription(event: any) {
		let selectedPlanData = { ...event.event }
		selectedPlanData.country = event.selectedCountryList
		selectedPlanData.price = Number(selectedPlanData.price) + (event.selectedCountryList.length - 1) * 699

		this.selectedSubscription = selectedPlanData
		this.stage = 3
	}
	onSelectQuestionCredit(event: any) {
		this.selectedQuestionCredit = event
		this.stage = 3
	}
	changePlan() {
		this.selectedSubscription = null
		this.isSubOrQuestion = 1
		this.stage = 2
	}

	changeQuestionCreditPlan() {
		this.selectedQuestionCredit = null
		this.isSubOrQuestion = 2
		this.stage = 2
	}
	payusingstripe(value: any) {
		this.stripdata = value
		this.selectedcost = this.stripdata.finalPrice
		this.subscriptionService.createPaymentIntent(this.stripdata).subscribe((pi) => {
			this.currencyType = pi.currency
			this.elementsOptions.clientSecret = pi.client_secret as string
			this.stripdata.clientSecret = pi.client_secret as string
			this.cardvisibility = true
		})
	}
	currencyType: any
	pay(value: any) {
		this.subscriptionDetails = value
		this.showPayLoading = true
		if (value.subscriptionId) {
			if (value.type == "razorpay") {
				this.subscriptionService.placeSubscriptionOrder(value).subscribe((data) => {
					this.payWithRazor(data.orderid)
					this.currencyType = data.currency
					if (data.success == false) {
						this.toastr.add({
							severity: "error",
							summary: "Error",
							detail: data.message,
						})
						return
					}
				})
			} else {
				this.payusingstripe(value)
			}
		} else {
			this.subscriptionService.placeTopupSubscriptionOrder(value).subscribe((data) => {
				this.payWithRazor(data.orderid)
			})
		}
	}

	payQuestionCredit() {
		this.showPayLoading = true
		let data = {
			user_id: 2,
			questioncredits_id: this.selectedQuestionCredit?.id,
		}

		this.subscriptionService.placeQuestionCreditOrder(data).subscribe((data) => {
			this.payWithRazor(data.orderid)
		})
	}
	payWithRazor(orderid: any) {
		let razorKey = "rzp_live_YErYQVqDIrZn1D"
		if (environment.domain == "api.uniprep.ai") {
			razorKey = "rzp_test_Crpr7YkjPaCLEr"
		}
		let phone = this.storage.get("phone")
		// if (encPhone) {
		// 	// const bytes = CryptoJS.AES.decrypt(encPhone, environment.secretKeySalt)
		// 	const bytes = this.authService.decryptData(encPhone)
		// 	phone = JSON.parse(bytes.toString())
		// }

		let email = this.storage.get("email")
		// if (encEmail) {
		// 	// const bytes = CryptoJS.AES.decrypt(encEmail, environment.secretKeySalt)
		// 	const bytes = this.authService.decryptData(encEmail)
		// 	email = JSON.parse(bytes.toString())
		// }
		const options: any = {
			key: razorKey,
			amount: this.subscriptionDetails?.finalPrice * 100, // amount should be in paise format to display Rs 1255 without decimal point
			currency: "INR",
			name: "UNIPREP", // company name or product name
			description: "UNIPREP Subscription", // product description
			image: "https://uniprep.ai/uniprep-assets/images/icon-light.svg", // company logo or product image
			order_id: orderid, // order_id created by you in backend

			prefill: {
				name: this.selectedSubscription?.subscription,
				email: email,
				contact: phone === null || phone === "" ? "9876543210" : phone,
			},
			notes: {
				address: " 165/1,Opp Brahmasthana Kalyana Mantapa Sahukar Chenniah Road, TK Layout, Mysuru - 570023",
			},
			modal: {
				// We should prevent closing of the form when esc key is pressed.
				escape: false,
			},
			theme: {
				color: "var(--p-primary-500)",
			},
		}

		options.handler = (response: any, error: any) => {
			options.response = response
			var paymentdata = {
				orderid: response?.razorpay_order_id,
				paymentid: response?.razorpay_payment_id,
			}
			setTimeout(() => {
				this.authService.updateSubscriptionName(this.selectedSubscription?.subscription || "")
				if (this.subscriptionDetails?.subscriptionId) {
					this.subscriptionService.PaymentComplete(paymentdata).subscribe(
						(res: any) => {
							this.success = res
							this.subscriptionService.doneLoading()
							this.loadSubData()
							window.location.reload()
						},
						(error: any) => {
							// this.toastr.warning(error.error.message);
							this.subscriptionService.doneLoading()
							this.loadSubData()
							window.location.reload()
						}
					)
				} else {
					let data = {
						order_id: response?.razorpay_order_id,
						payment_reference_id: response?.razorpay_payment_id,
					}
					this.subscriptionService.topupPaymentComplete(data).subscribe(
						(res: any) => {
							this.success = res
							this.subscriptionService.doneLoading()
							this.loadSubData()
							window.location.reload()
						},
						(error: any) => {
							// this.toastr.warning(error.error.message);
							this.subscriptionService.doneLoading()
							this.loadSubData()
							window.location.reload()
						}
					)
				}
			}, 0)
		}
		options.modal.ondismiss = () => {
			this.toastr.add({
				severity: "error",
				summary: "Error",
				detail: "Transaction cancelled",
			})
		}
		const rzp = new this.winRef.nativeWindow.Razorpay(options)
		rzp.open()
	}

	loadSubscriptionHistory() {
		this.subscriptionService.getSubscriptionHistory().subscribe((response: any) => {
			this.subscribedHistoryData = response.subscriptionhistory
			this.accountBillingData = response.accountbillings

			this.accountBillingData.map(function (currentelement, index, arrayobj) {
				let noofFreeAddOn = arrayobj.filter((item) => item.product == "Free Add On")
				if (currentelement.product == "Free Add On" && noofFreeAddOn.length > 1) {
					arrayobj.splice(index, 1)
				}
			})

			if (this.subscribedHistoryData.length > 0 && this.accountBillingData.length > 0) {
				this.loadingSubscriptionHistory = true
				this.loadSubscriptionedData()
			}
		})
		this.dataService.showPopup(true)
	}

	loadExistingSubscription() {
		this.subscriptionService.getExistingSubscription().subscribe((response: any) => {
			this.userSubscription = response.subscription
			if (typeof this.userSubscription == "object" && this.userSubscription.countryName != null) {
				this.loadingExistingSubscription = true
				this.loadSubscriptionedData()
				return
			}
			// if(this.userSubscription.length > 0) {
			this.loadingExistingSubscription = true
			this.loadSubscriptionedData()
			// }
		})
	}

	loadSubscriptionedData() {
		if (this.loadingSubscriptionHistory && this.loadingExistingSubscription) {
			this.showHistoryBtn = true
			this.stage = 5
		} else {
			this.stage = 1
		}
	}

	showPlan($event: any) {
		this.stage = 1
	}

	showHistory($event: any) {
		this.stage = 5
	}
	@ViewChild(StripePaymentElementComponent) card!: StripePaymentElementComponent;
	cardOptions: StripeCardElementOptions = {
		iconStyle: "solid",
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
					this.toastr.add({
						severity: "error",
						summary: "Error",
						detail: "Transaction cancelled",
					})
				} else {
					if (result.paymentIntent.status === "succeeded") {
						this.subscriptionService.doneLoading()
						this.cardvisibility = false
						this.toastr.add({
							severity: "success",
							summary: "Success",
							detail: "Purchase Completed",
						})
						window.location.reload()
					}
				}
			})
	}

	getSubscriptionList() {
		// This method should be implemented based on your requirements
		// For now, we'll leave it empty to fix the linter error
	}

	getSubscriptionTopupList() {
		// This method should be implemented based on your requirements
		// For now, we'll leave it empty to fix the linter error
	}
}
