import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '@env/environment';
import { LocalStorageService } from 'ngx-localstorage';
import { AuthService } from 'src/app/Auth/auth.service';
import { LocationService } from 'src/app/location.service';
import { ThemeService } from "../../theme.service"

@Component({
  selector: 'uni-landing-partner',
  standalone: false,
  templateUrl: './landing-partner.component.html',
  styleUrl: './landing-partner.component.scss'
})
export class LandingPartnerComponent {
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
  contactSuccess: boolean = false;
  timeLeftInfoCard: any
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

  changeImage(imageName: string): void {
    this.currentImage = "/uniprep-assets/images/" + imageName
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

  ngOnInit() {
    if (this.authService.isTokenValid()) {
      this.router.navigate(["/pages/dashboard"]) // Redirect to dashboard
    }

    this.service.getFeatBlogs().subscribe((response) => {
      this.blogs = response
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

  navigateConnectUrl(url: string) {
    const baseUrl = window.location.origin;
    let targetUrl = '';

    // Define valid URLs
    const validUrls = [
      'about', 'contact-us', 'job-seekers', 'international-students',
      'global-travellers', 'entrepreneurs', 'compare/uk', 'pricing',
      'blogs', 'certificates', 'register'
    ];

    // Handle localhost case
    if (baseUrl.includes('localhost')) {
      window.location.href = `${baseUrl}/${url}`;
      return;
    }

    // Determine environment-based target URL
    if (baseUrl.includes('dev')) {
      targetUrl = 'https://dev-student.uniprep.ai';
    } else {
      targetUrl = 'https://uniprep.ai';
    }

    // Handle routing based on URL
    switch (url) {
      case 'home':
        window.location.href = targetUrl;
        break;
      case 'employer':
        window.location.href = environment.employerDomain;
        break;
      case 'partner':
        //window.location.href = `${targetUrl}/${url}`;
        window.location.href = environment.partnerDomain;
        break;
      case 'institute':
        //window.location.href = `${targetUrl}/${url}`;
        window.location.href = environment.instituteDomain;
        break;
      case 'talent':
        //window.location.href = `${targetUrl}/${url}`;
        window.location.href = environment.talentDomain;
        break;
      default:
        if (validUrls.includes(url)) {
          window.location.href = `${targetUrl}/${url}`;
        } else {
          window.location.href = `${environment.domain}/${url}`;
        }
    }
  }

}
