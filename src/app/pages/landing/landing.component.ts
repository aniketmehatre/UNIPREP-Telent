import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from "@angular/core"
import { ThemeService } from "../../theme.service"
import { FormBuilder, Validators } from "@angular/forms"
import { AuthService } from "../../Auth/auth.service"
import { LocationService } from "../../location.service"
import { environment } from "@env/environment"
import { LocalStorageService } from "ngx-localstorage"
import { Router } from "@angular/router"


interface CareerCard {
	id: number;
	title: string;
	description: string;
	icon: string;
}

@Component({
	selector: "uni-landing",
	standalone: false,
	templateUrl: "./landing.component.html",
	styleUrls: ["./landing.component.scss"],
})
export class LandingComponent implements OnInit, OnDestroy {
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

	constructor(private themeService: ThemeService, private formbuilder: FormBuilder, private service: LocationService, private storage: LocalStorageService, private router: Router, private authService: AuthService) {
		// Initialize the isDarkMode property with the value from the service
		this.isDarkMode = this.themeService.getInitialSwitchState()
	}

	currentYear = new Date().getFullYear()


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
		if (this.authService.isTokenValid()) {
			this.router.navigate(["/pages/dashboard"]) // Redirect to dashboard
		}
		// const token = this.storage.get<string>('token');
		// let req = {
		//   token: token
		// }
		// console.log('token', token)
		// this.service.getValidateToken(req).subscribe((data) => {
		//   console.log('data', data)

		//   if (data.message == 'valid token') {
		//     console.log('come')
		//     this.router.navigateByUrl('/login');
		//   } else {
		//     this.router.navigateByUrl('/');
		//   }
		// });

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
		const whatsappSupportNumber = environment.whatsappSupportNumber;
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

	navigateConnectUrl() {
		window.open(environment.employerDomain, '_blank');
	}
}
