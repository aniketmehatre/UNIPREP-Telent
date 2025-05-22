import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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

@Component({
  selector: 'uni-landing-content',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    RouterModule,
    ScrollTopModule,
  ],
  templateUrl: './landing-content.component.html',
  styleUrls: ['./landing-content.component.scss']
})
export class LandingContentComponent implements OnInit {
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
  welcomevideoLink: string = `https://${environment.domain}/uniprepapi/storage/app/public/Landing/welcome.mp4`;
  videoUrl: string = `https://www.youtube.com/embed/Sv8EyWriqV0?rel=0&autoplay=1`;
  embedUrl!: SafeResourceUrl;
  isInitialLoadVideo: boolean = true;

  stats = [
    {
      icon: "fa-users",
      number: "10,000+",
      text: "Talents Registered",
    },
    {
      icon: "fa-briefcase",
      number: "1000+",
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
      question: "What is UNIPREP Talent Connect?",
      answer: "UNIPREP Talent Connect is a global talent discovery platform that helps students and graduates build job-ready profiles and connect directly with verified employers worldwide — without intermediaries or placement fees.",
    },
    {
      id: "faqcollapse2",
      question: "How does Talent Connect help job seekers?",
      answer: "Talent Connect offers 30+ career features like resume building, AI reviews, skill assessments, and global job applications — empowering you to become job-ready and visible to top employers.",
    },
    {
      id: "faqcollapse3",
      question: "How does Employer Connect benefit companies?",
      answer: "Employer Connect allows verified companies to post jobs for free, discover pre-screened talent, and use smart filters to connect with the most relevant candidates globally.",
    },
    {
      id: "faqcollapse4",
      question: "Can students apply to universities directly through UNIPREP?",
      answer: "Yes. Students can search from over 100,000 global programs and apply directly to universities without using agents. The platform also provides SOP support and scholarship access.",
    },
    {
      id: "faqcollapse5",
      question: "Is UNIPREP available outside India?",
      answer: "Yes. UNIPREP is accessible in 195+ countries, supporting global users including students, job seekers, digital nomads, and institutions worldwide.",
    },
    {
      id: "faqcollapse6",
      question: "How secure is my data on UNIPREP?",
      answer: "Your data is protected with enterprise-level encryption and privacy controls. We follow global data compliance standards and do not share personal data without consent.",
    },
    {
      id: "faqcollapse7",
      question: "How do I register as an employer on UNIPREP?",
      answer: "It’s simple — just sign up, complete your company profile, and start posting jobs. You’ll get instant access to 10,000+ verified talents and a smart dashboard to manage applicants.",
    },
    {
      id: "faqcollapse8",
      question: "What is an AI Profile Score on Talent Connect?",
      answer: "The AI Profile Score indicates how job-ready a candidate is based on resume quality, skill match, certifications, and profile completeness — helping employers shortlist fast",
    },
    {
      id: "faqcollapse9",
      question: "How does UNIPREP support fresh graduates?",
      answer: "Freshers can access guided career planning, mock interviews, resume building, and employer-specific tests — all designed to boost placement success.",
    },
    {
      id: "faqcollapse10",
      question: "How often is the data updated?",
      answer: "All listings, courses, and data on the platform undergoes quarterly updates to ensure its accuracy.",
    },
    {
      id: "faqcollapse11",
      question: "Can I connect with companies before applying?",
      answer: "Yes. Talents can view company profiles, follow them for updates, and even initiate interest or connect directly when employers enable it.",
    },
    {
      id: "faqcollapse12",
      question: "How will the UNIPREP certificate benefit me?",
      answer: "The certificates accredited by a prominent body will demonstrate your knowledge which can serve as a valuable addition to your CV and job applications.",
    },
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

  constructor(private sanitizer: DomSanitizer, private themeService: ThemeService, private formbuilder: FormBuilder, private service: LocationService, private storage: LocalStorageService, private router: Router, private authService: AuthService) {
    // Initialize the isDarkMode property with the value from the service
    this.isDarkMode = this.themeService.getInitialSwitchState()
  }

  changeImage(imageName: string): void {
    this.currentImage = "/uniprep-assets/images/" + imageName
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

  toggleTheme() {
    this.themeService.toggleTheme()
    // After toggling, update the isDarkMode property to reflect the new state
    this.isDarkMode = this.themeService.isDarkMode()
  }

}
