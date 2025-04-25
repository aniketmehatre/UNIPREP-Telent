import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from "@angular/core"
import { SalaryConverterService } from "./salary-converter.service"
import { Location } from "@angular/common"
import { Router } from "@angular/router"
import { LocationService } from "../../../location.service"
import { PlanService } from "../../../shared/plan.service"
import { AuthService } from "../../../Auth/auth.service"
import { CommonModule } from "@angular/common"
import { DialogModule } from "primeng/dialog"

import { FormsModule } from "@angular/forms"
import { InputNumberModule } from "primeng/inputnumber"
import { CarouselModule } from "primeng/carousel"
import { ButtonModule } from "primeng/button"
import { SelectModule } from "primeng/select"

@Component({
	selector: "uni-salary-converter",
	templateUrl: "./salary-converter.component.html",
	styleUrls: ["./salary-converter.component.scss"],
	standalone: true,
	imports: [CommonModule, ButtonModule, CarouselModule, DialogModule, FormsModule, InputNumberModule, SelectModule],
	encapsulation: ViewEncapsulation.None,
})
export class SalaryConverterComponent implements OnInit {
	salary: any
	selectedCurrencyCode: string = "INR"
	selectedCountryName: any
	selectedCountryCode: any
	selectedToCurrencyCode: string = "INR"
	selectedToCountryCode: any
	selectedToCountryName: any
	taxData: any
	fromCountry: any
	toCountry: any
	countries: any[] = []
	targetCountries: any[] = []
	sourceCountries: any[] = []
	rates: any
	statementText: any
	inHomeCurrency: any
	isPPPCardVisible: boolean = false
	planExpired: boolean = false
	salaries: { satement: string }[] = [{ satement: "Earning INR 50,000 in the India is equivalent to earning INR 1,78,571.43 in the United Arab Emirates." }, { satement: "Earning INR 70,000 in the India is equivalent to earning INR 2,12,500 in the United Kingdom." }, { satement: "Earning INR 50,000 the India is equivalent to earning INR 16,071.43 in the Canada." }, { satement: "Earning INR 70,000 in the India is equivalent to earning INR 1,90,000 in the France." }, { satement: "Earning INR 1,00,000 in the India is equivalent to earning INR 3,57,142.86 in the United States." }]
	responsiveOptions: { breakpoint: string; numVisible: number; numScroll: number }[]
	get fromValue() {
		return this.taxData[0]
	}
	get toValue() {
		return this.taxData[1]
	}

	constructor(private salaryConverterService: SalaryConverterService, private _location: Location, private authService: AuthService, private router: Router, private locationService: LocationService, private cdr: ChangeDetectorRef) {
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
	}

	ngOnInit(): void {
		this.checkplanExpire()
		this.salaryConverterService.getCountries().subscribe((data) => {
			this.countries = data
			this.sourceCountries = data
			this.targetCountries = data
		})
	}

	isShowPlanExpiredDialog: boolean = false
	convert(): void {

		if (this.planExpired) {
			this.authService.hasUserSubscription$.next(true);
			return
		}
		this.isShowPlanExpiredDialog = false
		if (this.fromCountry && this.toCountry && this.salary) {
			const fromPpp = this.selectedCountryCode
			const toPpp = this.selectedToCountryCode
			let req = {
				codes: `${fromPpp},${toPpp}`,
				amt: this.salary,
			}
			this.salaryConverterService.getTaxData(req).subscribe((resp: any) => {
				this.taxData = resp.data
				this.statementText = resp.statement
				this.inHomeCurrency = resp.inHomeCurrency
				this.isPPPCardVisible = true
			})
		}
	}

	onCountryChange(event: any) {
		this.selectedCountryCode = event.value.countryCode
		this.selectedCurrencyCode = event.value.currencyCode
		this.selectedCountryName = event.value.countryName
		this.isPPPCardVisible = false
		this.taxData = []
		this.targetCountries = this.countries.map(item => ({
			...item,
			disabled: item.countryName === event.value.countryName, // Disable selected city
		}));
	}

	onCountryToChange(event: any) {
		this.selectedToCountryCode = event.value.countryCode
		this.selectedToCurrencyCode = event.value.currencyCode
		this.selectedToCountryName = event.value.countryName
		this.isPPPCardVisible = false
		this.taxData = []
		this.sourceCountries = this.countries.map(item => ({
			...item,
			disabled: item.countryName === event.value.countryName, // Disable selected city
		}));
	}

	onClearCountry(event: Event, type: string) {
		if (type == 'source') {
			this.targetCountries = this.countries;
		} else {
			this.sourceCountries = this.countries;
		}
	}

	goBack() {
		this._location.back()
	}
	checkplanExpire(): void {
		if (this.authService._userSubscrition.time_left.plan === "expired" ||
			this.authService._userSubscrition.time_left.plan === "subscription_expired" ||
			this.authService._userSubscrition.subscription_details.subscription_plan === "Student") {
			this.planExpired = true;
		}
		else {
			this.planExpired = false;
		}
	}

}
