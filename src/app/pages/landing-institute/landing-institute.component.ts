import { Component, ElementRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { environment } from '@env/environment';
import { Router } from '@angular/router';
import { LocalStorageService } from 'ngx-localstorage';
import { AuthService } from 'src/app/Auth/auth.service';
import { LocationService } from 'src/app/location.service';
import { ThemeService } from 'src/app/theme.service';

@Component({
  selector: 'uni-landing-institute',
  standalone: false,
  templateUrl: './landing-institute.component.html',
  styleUrl: './landing-institute.component.scss'
})
export class LandingInstituteComponent {
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

  navigateConnectUrl(url: any) {
    //window.open(environment.employerDomain, '_blank');
    const baseUrl = window.location.origin;
    const isDev = baseUrl.includes('dev') || baseUrl.includes('localhost');
    const targetUrl = isDev ? 'https://dev-student.uniprep.ai' : 'https://uniprep.ai';
    const validUrls = ['about', 'contact-us', 'job-seekers', 'international-students', 'global-travellers',
      'entrepreneurs', 'blogs', 'certificates', 'register'];

    if (url === 'home') {
      window.location.href = targetUrl
    } else if (url === 'institute/compare/uk') {
      window.location.href = window.location.href + `/compare/uk`
    } else if (url === 'compare') {
      window.location.href = targetUrl + `/${url}`
    } else if (validUrls.includes(url)) {
      window.location.href = targetUrl + `/${url}`
    } else if (url === 'employer') {
      window.location.href = environment.employerDomain
    } else if (url === 'partner') {
      window.location.href = environment.partnerDomain
      //window.location.href = targetUrl + `/${url}`
    } else if (url === 'institute') {
      window.location.href = environment.instituteDomain
      //window.location.href = targetUrl + `/${url}`
    } else if (url === 'talent') {
      window.location.href = environment.talentDomain
      //window.location.href = targetUrl + `/${url}`
    } else {
      window.location.href = targetUrl + `/${url}`
    }
  }

}


