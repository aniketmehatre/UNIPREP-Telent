import { Component, HostListener, OnInit } from "@angular/core";
import { LocationService } from "./location.service";
import { environment } from "@env/environment";
import { LocalStorageService } from "ngx-localstorage";
import { NgxUiLoaderModule } from "ngx-ui-loader";
import { ToastModule } from "primeng/toast";
import { Router, RouterModule } from "@angular/router";
import { MessageService } from "primeng/api";
import { SeoManagerComponent } from "./components/seo-manager/seo-manager.component";
import { SocialShareService } from "./shared/social-share.service";
import { ScrollTopModule } from "primeng/scrolltop";

@Component({
	selector: "app-root",
	template: ` <app-seo-manager></app-seo-manager>
		<router-outlet></router-outlet>
		<p-scrolltop class="position-absolute" [threshold]="100" icon="pi pi-arrow-up" [buttonProps]="{ raised: true, rounded: true }" />
		<p-toast position="top-right"></p-toast>
		<ngx-ui-loader overlayColor="rgba(0,0,0,0.8)" logoUrl="uniprep-assets/images/icon-loader.svg" [bgsSize]="40" bgsType="three-bounce" [bgsOpacity]="1" bgsColor="#f0780e" fgsOpacity="1" fgsColor="#f0780e" hasProgressBar="false"></ngx-ui-loader>`,
	standalone: true,
	imports: [NgxUiLoaderModule, ToastModule, RouterModule, ScrollTopModule, SeoManagerComponent],
	providers: [MessageService, SocialShareService],
})
export class AppComponent implements OnInit {
	constructor(private storage: LocalStorageService, private whitelabelservice: LocationService, private router: Router) { }
	private isPageHidden = false;
	domainNameCondition: string;
	domainname: string = "main";

	ngOnInit() {
		this.domainNameCondition = window.location.hostname;
		this.domainname = this.isDomainMain() ? "main" : "sub";
		if (this.domainname === "sub") {
			this.router.navigate(["/main"], { replaceUrl: true });
		}
		this.getImageWhitelabel();
		document.addEventListener("visibilitychange", () => {
			this.isPageHidden = document.hidden;
		});
	}

	private isDomainMain(): boolean {
		return this.domainNameCondition === "dev-institutes.uniprep.ai"
			|| this.domainNameCondition === "dev-student.uniprep.ai" || this.domainNameCondition === "*.uniprep.ai" || this.domainNameCondition === "uniprep.ai" || this.domainNameCondition === "localhost";
	}

	@HostListener("window:beforeunload", ["$event"])
	unloadHandler(event: BeforeUnloadEvent) {
		return;

		if (window.location.href.includes("localhost")) {
			return;
		}
		if (window.location.href.includes("subscriptions") || window.location.href.includes("upgrade-subscription")) {
			return;
		}
		if (window.location.href.includes("login")) {
			return;
		}
		if (window.location.href.includes("register")) {
			return;
		}
		if (window.location.href.includes("certificates")) {
			return;
		}
		if (window.location.href.includes("forgot-password")) {
			return;
		}
		if (window.location.href.includes("termsandcondition")) {
			console.log("yyttt");
			return;
		}
		if (window.location.href.includes("privacypolicy")) {
			return;
		}
		if (window.location.href.includes("refundpolicy")) {
			return;
		}
		if (window.location.href.includes("cancellationpolicy")) {
			return;
		}
		const token = this.storage.get<string>("token");
		const sessionData = {
			token: token,
		};

		// Use fetch with keepalive to send data
		fetch(`${environment.ApiUrl}/updatetracking`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(sessionData),
			keepalive: true,
		});

		if (this.isPageHidden) {
			console.log("Tab closed");
		} else {
			console.log(window.location);
			console.log("Tab refreshed or navigated away");
		}
		if (window.location.href.includes("login")) {
			return;
		}
		if (window.location.href.includes("register")) {
			return;
		}
		if (window.location.href.includes("forgot-password")) {
			return;
		}
		if (window.location.href.includes("termsandcondition")) {
			console.log("sasdf");
			return;
		}
		if (window.location.href.includes("privacypolicy")) {
			return;
		}
		if (window.location.href.includes("refundpolicy")) {
			return;
		}
		if (window.location.href.includes("cancellationpolicy")) {
			return;
		}
		event.preventDefault();
		event.returnValue = "";
	}

	imagewhitlabeldomainname: any;
	getImageWhitelabel() {
		this.imagewhitlabeldomainname = window.location.hostname;
		var data = {
			domainname: this.imagewhitlabeldomainname,
		};
		this.whitelabelservice.getWhitlabelData(data).subscribe((res) => { });
	}
}
