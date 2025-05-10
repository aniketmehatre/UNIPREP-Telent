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

  userCategories = [
    {
      icon: '💼',
      title: 'For Job Seekers',
      description: 'Access 30+ premium career features to land your dream job.'
    },
    {
      icon: '👨🏻‍🎓',
      title: 'For International Students',
      description: 'Use 15+ education tools to unlock your study abroad goals.'
    },
    {
      icon: '📦',
      title: 'For Global Travellers',
      description: 'Make smart moves with 10+ travel resources for that perfect vacation.'
    },
    {
      icon: '🚀',
      title: 'For Entrepreneurs',
      description: 'Kickstart your startup journey with 20+ business-building resources.'
    }
  ];

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
        this.blogs = response.slice(0, 8)
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


  
}
