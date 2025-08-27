import { Component, inject, OnInit, signal } from "@angular/core";
import { LocationService } from "./services/location.service";
import { NgxUiLoaderModule } from "ngx-ui-loader";
import { ToastModule } from "primeng/toast";
import { NavigationEnd, Router, RouterModule } from "@angular/router";
import { MessageService } from "primeng/api";
import { SocialShareService } from "./services/social-share.service";
import { ScrollTopModule } from "primeng/scrolltop";
import { BrandColorService } from "./services/brand-color.service";
import { LastRouteService } from "./services/last-route.service";
import { filter } from "rxjs";
import { TalentConnectService } from "./pages/talent-connect/talent-connect.service";

@Component({
	selector: "app-root",
	template: ` <router-outlet></router-outlet>
		<p-scrolltop class="position-absolute" [threshold]="100" icon="pi pi-arrow-up" [buttonProps]="{ raised: true, rounded: true }"></p-scrolltop>
		<p-toast position="top-right"></p-toast>
		<ngx-ui-loader overlayColor="rgba(0,0,0,0.8)" logoUrl="uniprep-assets/images/icon-loader.svg" [bgsSize]="40" bgsType="three-bounce" [bgsOpacity]="1" bgsColor="var(--p-secondary-500)" fgsOpacity="1" fgsColor="var(--p-secondary-500)" [hasProgressBar]="false"></ngx-ui-loader>`,
	standalone: true,
	imports: [NgxUiLoaderModule, ToastModule, RouterModule, ScrollTopModule],
	providers: [MessageService, SocialShareService],
})
export class AppComponent implements OnInit {
	constructor(
		private whiteLabelService: LocationService,
		private router: Router,
		private brandColorService: BrandColorService, // Inject the service,
		private lastRouteService: LastRouteService,
		private talentConnectService: TalentConnectService,
	) { }

	isPageHidden = false;
	domainNameCondition: string;
	domainName: string = "main";
	whiteLabelDomainName: any;
	private locationService = inject(LocationService);
	private isInstitute = signal(false);

	ngOnInit() {
		this.router.events
			.pipe(filter(event => event instanceof NavigationEnd))
			.subscribe((event: any) => {
				const profileData = this.talentConnectService._employerProfileData;
				console.log("Profile Data in App Component:", this.talentConnectService._employerProfileData);
				if (!profileData || profileData?.profile_completion_flag === 0) {

					// 👇 Block only `/pages/subscriptions`
					if (event.url.startsWith('/pages/subscriptions')) {
						this.router.navigate(['/pages/talent-connect/my-profile'], { replaceUrl: true });
					}
				}
			});
		// Apply palettes from localStorage on app startup
		this.brandColorService.applyPalettesFromLocalStorage();
		this.apiToCheckPartnerOrInstitute();
		if (this.isInstitute()) {
			if (window.location.href.includes("/register")) {
				this.router.navigate(["/login"], { replaceUrl: true });
			}
		}
		this.domainNameCondition = window.location.hostname;
		// this.domainName = this.isDomainMain() ? "main" : "sub";
		// if (this.domainName === "sub") {
		//     this.router.navigate(["/main"], { replaceUrl: true });
		// }
		document.addEventListener("visibilitychange", () => {
			this.isPageHidden = document.hidden;
		});
	}

	private isDomainMain(): boolean {
		return this.domainNameCondition === "dev-institutes.uniprep.ai" || this.domainNameCondition === "institutes.uniprep.ai" || this.domainNameCondition === "partners.uniprep.ai" || this.domainNameCondition === "talent.uniprep.ai" || this.domainNameCondition === "dev-student.uniprep.ai" || this.domainNameCondition === "*.uniprep.ai" || this.domainNameCondition === "uniprep.ai" || this.domainNameCondition === "localhost";
	}

	apiToCheckPartnerOrInstitute() {
		let req = {
			domain: window.location.hostname,
		};
		this.locationService.getSourceByDomain(window.location.hostname).subscribe((response) => {
			if (response.source == "Institute") {
				this.isInstitute.set(true);
			}
		});
	}
}
