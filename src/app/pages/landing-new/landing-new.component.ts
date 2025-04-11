import { Component, ElementRef, OnInit, ViewChild } from "@angular/core"
import { ThemeService } from "../../theme.service"
import { FormBuilder, FormsModule, ReactiveFormsModule, FormControl, FormGroup, Validators } from "@angular/forms"
import { AuthService } from "../../Auth/auth.service"
import { LocationService } from "../../location.service"
import { environment } from "@env/environment"
import { LocalStorageService } from "ngx-localstorage"
import { Router, RouterModule } from "@angular/router"
import { ScrollTop, ScrollTopModule } from "primeng/scrolltop"
import { CommonModule } from "@angular/common"
import { DialogModule } from "primeng/dialog"
import { MessageService } from "primeng/api"

@Component({
	selector: "uni-landing-new",
	templateUrl: "./landing-new.component.html",
	styleUrls: ["./landing-new.component.scss"],
	standalone: true,
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		DialogModule,
		RouterModule,
		ScrollTop,
		// Empty reducer configuration or actual reducers here
	],
	providers: [MessageService, AuthService],
})
export class LandingNewComponent implements OnInit {
	@ViewChild("videoPlayer")
	videoPlayer!: ElementRef
	isPlaying = false
	isDarkMode: boolean
	displaytandc!: boolean
	displayprivacypolicy!: boolean
	displaycancellationpolicy!: boolean
	displaycontactform!: boolean
	currentImage: string = "/uniprep-assets/images/feature1.webp"
	contactForm: any
	contactSuccess: boolean = false
	welcomevideoLink: string = `https://${environment.domain}/uniprepapi/storage/app/public/Landing/welcome.mp4`

	blogs = [
		{
			featured_img: 'uk.png',
			title: 'United Kingdom',
			date: '12/06/2024',
			desc: 'Benefits of studying in the United Kingdom. UK is the worlds most popular study destination, UK'
		},
		{
			featured_img: 'bathUni.png',
			title: 'Bath Spa University',
			date: '12/06/2024',
			desc: 'Bath Spa University is a public inititutions of higher education and research which offers to enrol in'
		},
		{
			featured_img: 'eur.png',
			title: '5 European Study Destinations',
			date: '12/06/2024',
			desc: 'There seems to be an awful rumour floating all around spreading discouragement that studying.'
		}
	];

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

	stats = [
		{
			icon: "fa-globe",
			number: "28+",
			text: "Countries Covered",
		},
		{
			icon: "fa-gears",
			number: "70+",
			text: "Exclusive Features",
		},
		{
			icon: "fa-earth-americas",
			number: "100+",
			text: "Countries Open for Access",
		},
		{
			icon: "fa-hand-holding-circle-dollar",
			number: "1000+",
			text: "Courses for Upskilling",
		},
		{
			icon: "fa-language",
			number: "25+",
			text: "Languages to Learn",
		},
		{
			icon: "fa-briefcase",
			number: "1000+",
			text: "Business Pitches",
		},
	]

	cardItems = [
		{
			img: "i-search.png",
			text: "Search for roles that match your goals",
			description: "Whether it's your first internship or next career leap"
		},
		{
			img: "i-search.png",
			text: "Access opportunities in your city, your country, or anywhere in the world",
		},
		{
			img: "i-search.png",
			text: "Engage directly with real employers",
			description: "from startups to leading global brands"
		},
		{
			img: "i-search.png",
			text: "Stay organized",
			description: "track every application and keep your job hunt on point"
		},
		{
			img: "i-search.png",
			text: "Get matched to roles based on youyr skills and education",
		},
		{
			img: "i-search.png",
			text: "Build a professional profile",
			description: "that gets noticed by the right people"
		},
	]

	accordionItems = [
		{
			id: "collapseOne",
			title: "Create your profile",
			content: "Craft a profile that showcases your achievements, interests, and readiness",
			image: "uf1.webp",
		},
		{
			id: "collapseTwo",
			title: "Browser Openings",
			content: "Craft Unlimited standout resume with tailored templates and expert tips to land your dream job.",
			image: "uf2.webp",
		},
		{
			id: "collapseThree",
			title: "Connect with Employers",
			content: "Access over 1,000 specialised courses to upskill and get certified.",
			image: "uf3.webp",
		},
		{
			id: "collapseFour",
			title: "Take Your Journey",
			content: "Visualize your next 5 potential career progressions to attain your professional goals.",
			image: "uf4.webp",
		},
		{
			id: "collapseFive",
			title: "Apply seamlessly",
			content: "Prepare for interviews and learn insider tips to shine in your job interviews.",
			image: "uf5.webp",
		}
	]

	changeImage(imageName: string): void {
		this.currentImage = "/uniprep-assets/images/" + imageName
	}

	faqItems = [
		{
			id: "faqcollapseOne",
			question: "What is UNIPREP?",
			answer: "UNIPREP is the world's only all-in-one SaaS platform designed to help students, professionals, and founders achieve success in today's competitive world.",
		},
		{
			id: "faqcollapseTwo",
			question: "Does UNIPREP offer any free version for users?",
			answer: "UNIPREP provides its users with a free 60-minute trial period.",
		},
		{
			id: "faqcollapseThree",
			question: "What if the question I want to ask is not on the UNIPREP platform?",
			answer: "If your question isn't already addressed on the UNIPREP platform, you can utilize our personalized advisory services. We offer tailored responses from global experts to specific user inquiries on a credit-based system.",
		},
		{
			id: "faqcollapseFour",
			question: "Can I apply for jobs through the UNIPREP platform?",
			answer: "Yes, the UNIPREP platform has the employee connect feature with over a million active jobs, granting users access to global job opportunities. This feature enables you to explore and apply for positions worldwide, aligning with your career aspirations",
		},
		{
			id: "faqcollapseFive",
			question: "How does UNIPREP ensure the credibility of its certificates?",
			answer: "Certificates from UNIPREP are accredited by the Global Education Accreditation Council (GEAC), ensuring they meet international educational standards. This accreditation adds credibility and recognition to UNIPREP certifications, making them valuable in academic and professional settings worldwide.",
		},
		{
			id: "faqcollapseSix",
			question: "How will the UNIPREP certificate benefit me?",
			answer: "The certificates accredited by a prominent body will demonstrate your knowledge which can serve as a valuable addition to your CV and job applications.",
		},
		{
			id: "faqcollapseSeven",
			question: "Is UNIPREP updated?",
			answer: "Yes, the information on the platform undergoes quarterly updates to ensure its accuracy.",
		},
		{
			id: "faqcollapseEight",
			question: "What is Learning Hub?",
			answer: "The Learning Hub is a comprehensive platform that provides users with access to over 1000 skill-based learning programs each of which is accompanied by certificates.",
		},
		// Add more FAQs as needed
	]

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

		// Find the element with the given section ID
		const section = document.querySelector(`#${sectionId}`)

		// If the section exists, scroll to it smoothly
		if (section) {
			section.scrollIntoView({ behavior: "smooth" })
		}
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

		// this.service.getFeatBlogs().subscribe((response) => {
		// 	this.blogs = response
		// })

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
}
