import { Component, ElementRef, OnInit, ViewChild, AfterViewInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '@env/environment';
import { Router, RouterModule } from '@angular/router';
import { LocalStorageService } from 'ngx-localstorage';
import { AuthService } from 'src/app/Auth/auth.service';
import { LocationService } from 'src/app/location.service';
import { ThemeService } from 'src/app/theme.service';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ScrollTopModule } from 'primeng/scrolltop';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { UuidInviteCardComponent } from './uuid-invite-card/uuid-invite-card.component';

@Component({
  selector: 'uni-landing-content',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    RouterModule,
    ScrollTopModule,
    UuidInviteCardComponent
  ],
  templateUrl: './landing-content.component.html',
  styleUrls: ['./landing-content.component.scss']
})
export class LandingContentComponent implements OnInit, AfterViewInit {
  @ViewChild('homeSection', { static: true }) homeSectionRef!: ElementRef;
  @ViewChild("videoPlayer")
  videoPlayer!: ElementRef
  isPlaying = false
  isDarkMode: boolean
  currentImage: string = "/uniprep-assets/images/feature1.webp"
  blogs: any
  welcomevideoLink: string = `https://${environment.domain}/uniprepapi/storage/app/public/Landing/welcome.mp4`;
  videoUrl: string = `https://www.youtube.com/embed/AAXUZ0z5bl0?si=fkMUZWejNm7qfSTs?rel=0&autoplay=1`;
  embedUrl!: SafeResourceUrl;
  isInitialLoadVideo: boolean = true;

  stats = [
    {
      icon: "fa-users",
      number: "100,000+",
      text: "Talents Registered",
    },
    {
      icon: "fa-briefcase",
      number: "10,000+",
      text: "Employers Connected",
    },
    {
      icon: "fa-globe",
      number: "195",
      text: "Countries Supported",
    },
    {
      icon: "fa-cogs",
      number: "70+",
      text: "Premium Features",
    },
    {
      icon: "fa-earth-americas",
      number: "40+",
      text: "Countries Covered",
    },
  ];

  cardItems = [
    {
      icon: "fa-thin fa-handshake",
      text: "You want to connect with potential employers.",
    },
    {
      icon: "fa-thin fa-user-graduate",
      text: "You are exploring opportunities to study abroad.",
    },
    {
      icon: "fa-thin fa-lightbulb-on",
      text: "You are unsure about career preparation and want to upskill.",
    },
    {
      icon: "fa-thin fa-briefcase",
      text: "You are planning to start your own business.",
    },
    {
      icon: "fa-thin fa-language",
      text: "You are interested in learning new languages.",
    },
    {
      icon: "fa-thin fa-earth",
      text: "You are eager to travel the world.",
    },
    {
      icon: "fa-thin fa-search",
      text: "You want to hire skilled, job-ready candidates.",
    },
    {
      icon: "fa-thin fa-users",
      text: "You are looking to build a strong talent pipeline.",
    },
    {
      icon: "fa-thin fa-sack-dollar",
      text: "You are looking to reduce recruitment costs.",
    },
  ];

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
  ];

  userCategories = [
    {
      icon: '💼',
      title: 'For Job Seekers',
      description: 'Access 30+ premium career features to land your dream job.',
      url: '/job-seekers'
    },
    {
      icon: '👨🏻‍🎓',
      title: 'For International Students',
      description: 'Use 15+ education tools to unlock your study abroad goals.',
      url: '/international-students'
    },
    {
      icon: '📦',
      title: 'For Global Travellers',
      description: 'Make smart moves with 10+ travel resources for that perfect vacation.',
      url: '/global-travellers'
    },
    {
      icon: '🚀',
      title: 'For Entrepreneurs',
      description: 'Kickstart your startup journey with 20+ business-building resources.',
      url: '/entrepreneurs'
    }
  ];

  faqItems = [
    {
      id: "faqcollapse1",
      question: "Is UNIPREP free to use?",
      answer: "Yes — you get full access for 60 minutes absolutely free. After that, you can choose to continue with a plan that suits your needs.",
    },
    {
      id: "faqcollapse2",
      question: "How do I apply for internships or jobs abroad?",
      answer: "For jobs or internships, simply create an account on employer connect and apply for vacancies created by verified employers.",
    },
    {
      id: "faqcollapse3",
      question: "Is the information on the platform verified?",
      answer: "Yes — we verify and update all listings quarterly to ensure accuracy and trustworthiness.",
    },
    {
      id: "faqcollapse4",
      question: "Are the job and internship listings verified?",
      answer: "Yes — every opportunity is checked and approved through our secure employer network to keep scams away and quality high.",
    },
    {
      id: "faqcollapse5",
      question: "What if I need help using UNIPREP?",
      answer: "We’re here for you! Reach us anytime: <br><br>📞 India: +91 6362716586 <br><br>🌍 International: +44 7864716295 <br><br>📧 Email: info@uniprep.ai",
    },
    {
      id: "faqcollapse6",
      question: "How is UNIPREP different from LinkedIn, Indeed, and other platforms?",
      answer: "UNIPREP focuses on skill-building, career readiness, and guided student support—unlike LinkedIn or Indeed, which are primarily job search platforms.",
    },
    {
      id: "faqcollapse7",
      question: "How do I get started?",
      answer: "It’s simple — sign up, set up your profile, and start exploring jobs, internships, or universities right away!",
    },
    {
      id: "faqcollapse8",
      question: "Does UNIPREP partner with other institutions or companies?",
      answer: "Yes — we actively partner with trusted universities, employers, and education networks worldwide to bring you verified opportunities and exclusive offers.",
    }
  ];

  uuid: string | null = null;
  isFromUUID = false;
  uuidCardData: any = null;

  constructor(private sanitizer: DomSanitizer, private themeService: ThemeService,
    private formbuilder: FormBuilder, private service: LocationService,
    private storage: LocalStorageService, private router: Router,
    private authService: AuthService, private route: ActivatedRoute, private renderer: Renderer2) {
    // Initialize the isDarkMode property with the value from the service
    this.isDarkMode = this.themeService.getInitialSwitchState()
  }


  toggleVideo() {
    if (this.isInitialLoadVideo) {
      this.embedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.videoUrl);
      this.isInitialLoadVideo = false;
    }
    this.isPlaying = !this.isPlaying;
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
  timeLeftInfoCard: any;

  ngOnInit() {
    if (this.authService.isTokenValid()) {
      this.router.navigate(["/pages/dashboard"]) // Redirect to dashboard
    }

    this.uuid = this.route.snapshot.paramMap.get('uuid');
    this.isFromUUID = !!this.uuid;

    if (this.isFromUUID) {
      this.uuidCardData = {
        companyLogo: '',
        title: 'Senior UI/UX Designer',
        postedDate: '19–02–2025',
        vacancies: 50,
        applied: 10,
        video: 'Not Mandatory',
        startDate: '19–02–2025',
        deadline: '25–02–2025',
        location: 'Mysore, India',
        workMode: 'Onsite',
        experience: '0–50',
        position: 'UI Designer',
        salary: '₹50,000/mo',
        level: 'Mid Level',
        degree: "Bachelor's",
        industry: 'Tech Industry',
        overview: `We are looking for a creative and detail-oriented UI/UX Designer to join our team at UNIABROAD. The ideal candidate will be responsible for designing user-friendly, engaging, and visually appealing interfaces for our digital platforms, ensuring a seamless user experience for students and stakeholders.`,
        responsibilities: [
          'Design and implement intuitive, user-centered interfaces for web and mobile applications.',
          'Conduct user research and usability testing to understand pain points and improve UI/UX designs.',
          'Develop wireframes, prototypes, and mockups that effectively communicate design ideas.'
        ]
      };

      return;
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
      this.blogs = response.slice(0, 8)
    })

    this.timeLeftInfoCard = "24 Hours"
    // Any additional initialization can go here
    this.currentImage = "/uniprep-assets/images/uf1.webp"
  }

  ngAfterViewInit(): void {
    // Re-enable right click ONLY inside the #home section
    const section = this.homeSectionRef.nativeElement;

    this.renderer.listen(section, 'contextmenu', (event: MouseEvent) => {
      event.stopPropagation(); // Prevent global blockers
    });

    section.oncontextmenu = () => true; // Restore native behavior
  }

  toggleTheme() {
    this.themeService.toggleTheme()
    // After toggling, update the isDarkMode property to reflect the new state
    this.isDarkMode = this.themeService.isDarkMode()
  }

}
