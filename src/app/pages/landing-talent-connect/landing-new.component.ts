import {
	Component,
	ElementRef,
	ViewChild,
} from "@angular/core"
import { Router } from "@angular/router"
import { trigger, state, style, animate, transition } from "@angular/animations"
import { environment } from "@env/environment";
import { FormBuilder, Validators } from "@angular/forms";
import { ThemeService } from "src/app/theme.service";
import { LocationService } from "src/app/location.service";
import { AuthService } from "src/app/Auth/auth.service";
import { LocalStorageService } from "ngx-localstorage";
import { HeaderLogoStore } from "../landing/landing-page.store";


@Component({
	selector: "uni-landing-new",
	standalone: false,
	templateUrl: "./landing-new.component.html",
	styleUrls: ["./landing-new.component.scss"],
	animations: [
		trigger("cardAnimation", [
			state(
				"hidden",
				style({
					opacity: 0,
					transform: "translateY(100px)",
				}),
			),
			state(
				"visible",
				style({
					opacity: 1,
					transform: "translateY(0)",
				}),
			),
			transition("hidden => visible", animate("400ms ease-in")),
		]),
	],
})
export class LandingNewComponent {
	logoUrl$ = this.logoStore.logoUrl$;
	@ViewChild("videoPlayer")
	videoPlayer!: ElementRef;
	hovered1: 'wa' | null = null;
	isPlaying = false
	isDarkMode: boolean
	displaytandc!: boolean
	displayprivacypolicy!: boolean
	displaycancellationpolicy!: boolean
	displaycontactform!: boolean;
	displayLearningHubpage: boolean = false;
	displayJobSeekerPage: boolean = true;
	currentImage: string = "/uniprep-assets/images/feature1.webp"
	contactForm: any
	blogs: any
	contactSuccess: boolean = false
	welcomevideoLink: string = `https://${environment.domain}/uniprepapi/storage/app/public/Landing/welcome.mp4`

	showTandC() {
		this.displaytandc = true
	}

	showprivacypolicy() {
		this.displayprivacypolicy = true
	}

	showcancellationpolicy() {
		this.displaycancellationpolicy = true
	}

	showcontactform() {
		this.displaycontactform = true
	}

	constructor(private themeService: ThemeService, private logoStore: HeaderLogoStore,
		private formbuilder: FormBuilder, private service: LocationService,
		private storage: LocalStorageService, private router: Router, private authService: AuthService) {
		// Initialize the isDarkMode property with the value from the service
		this.isDarkMode = this.themeService.getInitialSwitchState()
	}

	ngOnDestroy() {
		localStorage.clear();
	}

	toggleVideo() {
		const video: HTMLVideoElement = this.videoPlayer.nativeElement
		if (video.paused) {
			video.play()
			this.isPlaying = true
		} else {
			video.pause()
			this.isPlaying = false
		}
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
		this.service.getFeatBlogs().subscribe((response) => {
			this.blogs = response
		})

		this.timeLeftInfoCard = "24 Hours"
		// Any additional initialization can go here
		this.currentImage = "/uniprep-assets/images/uf1.webp"

		this.contactForm = this.formbuilder.group({
			name: ["", Validators.required],
			email: ["", Validators.required],
			subject: ["", Validators.required],
			phone: ["", Validators.required],
			message: ["", Validators.required],
		})
	}

	toggleTheme() {
		this.themeService.toggleTheme()
		// After toggling, update the isDarkMode property to reflect the new state
		this.isDarkMode = this.themeService.isDarkMode()
	}

	submitForm() {
		// alert("subit");

		let contactData = {
			name: this.contactForm.value.name,
			email: this.contactForm.value.email,
			phone: this.contactForm.value.phone,
			subject: this.contactForm.value.subject,
			message: this.contactForm.value.message,
		}
		this.themeService.storeContatForm(contactData).subscribe((response) => {
			// this.toastr.add({severity: 'success', summary: 'Success', detail: "Organization Added"});
			// this.getOrgList();
			// this.reviewOrg.reset()
			// alert("Thank You, we will get back to you at the earliest.")
			this.contactSuccess = true
			setTimeout(() => {
				this.contactSuccess = false
				this.displaycontactform = false
			}, 2000)
		})
	}

	navigateWhatsappCall() {
		const whatsappSupportNumber = environment;
		const whatsappUrl = `https://wa.me/${whatsappSupportNumber}`;
		window.open(whatsappUrl, '_blank');
	}

	toggleMobileSubmenu(event: Event): void {
		// This is only needed if you want custom dropdown behavior
		// If using Bootstrap's built-in dropdown, you can remove this
		event.preventDefault();
		const target = event.currentTarget as HTMLElement;
		const dropdownMenu = target.nextElementSibling as HTMLElement;

		if (target.getAttribute('aria-expanded') === 'true') {
			target.setAttribute('aria-expanded', 'false');
			dropdownMenu.classList.remove('show');
		} else {
			target.setAttribute('aria-expanded', 'true');
			dropdownMenu.classList.add('show');
		}
	}

	navigateConnectUrl(url: string) {
		const baseUrl = window.location.origin;
		const isDev = baseUrl.includes('dev') || baseUrl.includes('localhost');
		const targetUrl = isDev ? 'http://localhost:4200' : 'https://uniprep.ai';
		const validUrls = ['about', 'contact-us', 'job-seekers', 'international-students', 'global-travellers', 'entrepreneurs', 'compare/uk', 'blogs', 'certificates', 'register', 'pricing', 'login'];
		if (url === 'home') {
			window.location.href = targetUrl
		} else if (validUrls.includes(url)) {
			window.location.href = targetUrl + `/${url}`
		} else {
			window.location.href = `${environment.studentDomain}/${url}`
		}
	}
}
