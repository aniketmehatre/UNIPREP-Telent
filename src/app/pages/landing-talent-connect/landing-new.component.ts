import {
	Component,
	ElementRef,
	ViewChild,
} from "@angular/core"
import { Router } from "@angular/router"
import { trigger, state, style, animate, transition } from "@angular/animations"
import { environment } from "@env/environment";
import { FormBuilder, Validators } from "@angular/forms";
import { ThemeService } from "src/app/services/theme.service";
import { LocationService } from "src/app/services/location.service";
import { AuthService } from "src/app/Auth/auth.service";
import { LocalStorageService } from "ngx-localstorage";
import { HeaderLogoStore } from "../landing/landing-page.store";


@Component({
	selector: "uni-landing-new",
	standalone: false,
	templateUrl: "./landing-new.component.html",
	styleUrls: ["./landing-new.component.scss"],
})
export class LandingNewComponent {
	logo = '/uniprep-assets/images/employer-connect.svg';
	isDarkMode: boolean;
	isPlaying = false


	constructor(private themeService: ThemeService, private logoStore: HeaderLogoStore,
		private formbuilder: FormBuilder, private service: LocationService,
		private storage: LocalStorageService, private router: Router, private authService: AuthService) {
		// Initialize the isDarkMode property with the value from the service
		this.isDarkMode = this.themeService.getInitialSwitchState()
	}

	ngOnDestroy() {
		localStorage.clear();
	}


	scrollToSection(event: Event, sectionId: string): void {
		// Prevent the default anchor link behavior
		event.preventDefault()
		this.router.navigate([`/`]).then(() => {
			setTimeout(() => {
				const section = document.querySelector(`#${sectionId}`)
				if (section) {
					section.scrollIntoView({ behavior: "smooth" })
				}
			}, 0)
		});
	}
	timeLeftInfoCard: any
	ngOnInit() {

	}

	toggleTheme() {
		this.themeService.toggleTheme()
		// After toggling, update the isDarkMode property to reflect the new state
		this.isDarkMode = this.themeService.isDarkMode()
	}


	navigateConnectUrl(url: string) {
		const baseUrl = window.location.origin;
				const isDev = baseUrl.includes('dev') || baseUrl.includes('localhost');
		const talentUrl = 'https://talent.uniprep.ai';
		const targetUrl = isDev ? 'https://dev-student.uniprep.ai' : 'https://uniprep.ai';
		const validUrls = ['about', 'contact-us', 'job-seekers', 'international-students', 'global-travellers', 'entrepreneurs', 'compare/uk', 'blogs', 'certificates', 'register', 'pricing', 'login'];
		if (url === 'home') {
			window.location.href = targetUrl;
		} else if (url === 'active-jobs' || url === 'employers') {
			this.router.navigateByUrl(url);
		}
		else if (validUrls.includes(url)) {
			window.location.href = targetUrl + `/${url}`;
		} else {
			window.location.href = `${environment.studentDomain}/${url}`
		}
	}
}
