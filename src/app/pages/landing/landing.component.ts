import { Component, ElementRef, OnInit, ViewChild } from "@angular/core"
import { ThemeService } from "../../theme.service"
import { FormBuilder, FormsModule, ReactiveFormsModule, FormControl, FormGroup, Validators } from "@angular/forms"
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
export class LandingComponent implements OnInit {
	@ViewChild("videoPlayer")
	videoPlayer!: ElementRef
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
			text: "You want to connect with potential employers.",
		},
		{
			text: "You're unsure about career preparation and want to upskill.",
		},
		{
			text: "You're interested in learning new languages.",
		},
		{
			text: "You're seeking education abroad.",
		},
		{
			text: "You're planning to start your own business.",
		},
		{
			text: "You're eager to travel the world.",
		},
	]

	accordionItems = [
		{
			id: "collapseOne",
			title: "Employer Connect",
			content: "Network directly with potential employers anywhere in the world to enhance career opportunities.",
			image: "uf1.webp",
		},
		{
			id: "collapseTwo",
			title: "CV Builder",
			content: "Craft Unlimited standout resume with tailored templates and expert tips to land your dream job.",
			image: "uf2.webp",
		},
		{
			id: "collapseThree",
			title: "Learning Hub",
			content: "Access over 1,000 specialised courses to upskill and get certified.",
			image: "uf3.webp",
		},
		{
			id: "collapseFour",
			title: "Career Planner",
			content: "Visualize your next 5 potential career progressions to attain your professional goals.",
			image: "uf4.webp",
		},
		{
			id: "collapseFive",
			title: "Job Interview Preparation",
			content: "Prepare for interviews and learn insider tips to shine in your job interviews.",
			image: "uf5.webp",
		},
		{
			id: "collapseSix",
			title: "Average Salary Estimator",
			content: "Get updated salary data to negotiate confidently and plan your career path.",
			image: "uf6.webp",
		},
		{
			id: "collapseSeven",
			title: "Language Hub",
			content: "Learn over 25 languages through interactive lessons and practical exercises.",
			image: "uf7.webp",
		},
		{
			id: "collapseEight",
			title: "Cost of Living Comparison",
			content: "Compare living costs across locations to make informed decisions about where to live and work.",
			image: "uf8.webp",
		},
		// Add more items as needed
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

	steps = [
		{
			id: 1,
			title: 'Plan',
			subtitle: 'Discover Your Direction & Define Career Goals',
			icon: 'compass'
		},
		{
			id: 2,
			title: 'Prepare',
			subtitle: 'Build Skills & Get Application-Ready',
			icon: 'tools'
		},
		{
			id: 3,
			title: 'Act',
			subtitle: 'Apply Smart & Explore Global Opportunities',
			icon: 'tools'
		},
		{
			id: 4,
			title: 'Grow',
			subtitle: 'Build Long-Term Career Value',
			icon: 'tools'
		}
	];

	careerCards: CareerCard[] = [
		{
			id: 1,
			title: 'Career Planner',
			description: 'Receive AI-powered career guidance based on your specialization and target country. Explore the best job markets, trending roles, salary insights, and strategic paths forward.',
			icon: 'target'
		},
		{
			id: 2,
			title: 'Learning Hub',
			description: 'Receive AI-powered career guidance based on your specialization and target country. Explore the best job markets, trending roles, salary insights, and strategic paths forward.',
			icon: 'books'
		},
		{
			id: 3,
			title: 'Skill Mastery',
			description: 'Master key competencies with structured learning paths, assessments, and validation checkpoints — in an engaging, interactive format that rewards you with certificates.',
			icon: 'book'
		},
		{
			id: 4,
			title: 'Personality Test',
			description: 'Understand your personality traits and how they align with specific work environments, job types, and industries. Get role recommendations based on who you naturally are.',
			icon: 'brain'
		},
		{
			id: 5,
			title: 'Psychometric Test',
			description: 'Evaluate your aptitude, behavioral tendencies, and decision-making style. Gain deeper career clarity and choose roles that fit your mental strengths.',
			icon: 'pen'
		},
		{
			id: 6,
			title: 'Employer Test',
			description: 'Practice real-world hiring assessments modeled after tests used by global employers — boost your job-readiness, confidence, and performance.',
			icon: 'pen'
		},
		{
			id: 7,
			title: 'AMCAT',
			description: 'Prepare with AMCAT-style mock tests to enhance your visibility on top recruitment platforms and improve test-based selection outcomes.',
			icon: 'pen'
		},
		{
			id: 8,
			title: 'Career Growth Checker',
			description: 'Map your professional journey with AI-supported insights into role-by-role growth, required skill upgrades, and long-term progression opportunities.',
			icon: 'chart'
		},
		{
			id: 9,
			title: 'Global Employment Insights',
			description: 'Stay ahead with deep insights into industry trends, hiring patterns, and employment opportunities from 40+ global job markets.',
			icon: 'globe'
		},
		{
			id: 10,
			title: 'CV Builder',
			description: 'Create unlimited, ATS-compliant CVs using elegant templates and AI-generated summaries that spotlight your strengths.',
			icon: 'file'
		},
		{
			id: 11,
			title: 'Cover Letter Builder',
			description: 'Instantly generate personalized cover letters powered by AI — tailored to your job role, industry, and experience level.',
			icon: 'mail'
		},
		{
			id: 12,
			title: 'Job Interview Preperation',
			description: 'Practice AI-enhanced mock interviews, refine your responses, and learn advanced techniques to deliver with impact and confidence.',
			icon: 'video'
		},
		{
			id: 13,
			title: 'Career Hacks',
			description: 'Access thousands of expert-written resources, covering resume writing, job search strategy, personal branding, and workplace success across 40+ countries.',
			icon: 'puzzle'
		},
		{
			id: 14,
			title: 'Company List',
			description: 'Explore a curated directory of millions of companies worldwide and instantly access their official websites and career pages.',
			icon: 'building'
		},
		{
			id: 15,
			title: 'Global Work Visa',
			description: 'Get step-by-step visa support with detailed documentation guidelines, timelines, and processes for 40+ countries.',
			icon: 'globe'
		},
		{
			id: 16,
			title: 'Salary Negotiation Hacks',
			description: 'Learn how to confidently negotiate offers with tips and real-world techniques sourced from professionals in 40+ markets.',
			icon: 'message'
		},
		{
			id: 17,
			title: 'Global Salary Converter',
			description: 'Compare salaries across countries with PPP adjustments, tax insights, and cost-of-living breakdowns to make informed financial choices.',
			icon: 'calculator'
		},
		{
			id: 18,
			title: 'Average Salary Estimator',
			description: 'Get realistic salary forecasts based on your role, experience level, industry, and geographic location — backed by AI-generated market data.',
			icon: 'chart'
		},
		{
			id: 19,
			title: 'Job Offers Comparision Tool',
			description: 'Compare multiple job offers side-by-side — evaluate compensation, benefits, growth potential, and company culture before making a decision.',
			icon: 'flag'
		},
		{
			id: 20,
			title: 'Employer Connect',
			description: 'Connect directly with verified employers and recruiters around the world — no middlemen, just real opportunities.',
			icon: 'user'
		},
		{
			id: 21,
			title: 'Jobseeker Success Stories',
			description: 'Get inspired by real UNIPREP users who\'ve landed top roles across the globe — read their stories and learn from their journey.',
			icon: 'trophy'
		},
		{
			id: 22,
			title: 'Fortune Companies',
			description: 'Explore in-depth profiles of 5,000+ global organizations. Learn what they look for, how they hire, and how you can stand out from the crowd.',
			icon: 'building'
		}
	];

	benefits = [
		{
			title: 'Learn smart',
			description: 'Master skills that matter with interactive learning and real certifications.',
			icon: 'search'
		},
		{
			title: 'Apply smart',
			description: 'Use AI-driven tools to personalize applications and compare job opportunities.',
			icon: 'user'
		},
		{
			title: 'Grow smart',
			description: 'Visualize long-term career trajectories with growth mapping and employer insights.',
			icon: 'trophy'
		},
		{
			title: 'Win with confidence',
			description: 'From CV to visa, from interview prep to final offer — we\'re with you every step of the way.',
			icon: 'user'
		}
	];

	getCardsForStep(stepId: number): CareerCard[] {
		const stepRanges = {
			1: [1, 9],
			2: [10, 13],
			3: [14, 20],
			4: [21, 22]
		};

		const range = stepRanges[stepId as keyof typeof stepRanges];
		return this.careerCards.filter(card => card.id >= range[0] && card.id <= range[1]);
	}
}
