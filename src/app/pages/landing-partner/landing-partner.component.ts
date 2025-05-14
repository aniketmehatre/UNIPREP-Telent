import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { environment } from '@env/environment';
import { LocalStorageService } from 'ngx-localstorage';
import { AuthService } from 'src/app/Auth/auth.service';
import { LocationService } from 'src/app/location.service';
import { ThemeService } from "../../theme.service"
import { LandingFooterComponent } from "../landing/landing-footer/landing-footer.component";

@Component({
  selector: 'uni-landing-partner',
  standalone: false,
  templateUrl: './landing-partner.component.html',
  styleUrl: './landing-partner.component.scss'
})
export class LandingPartnerComponent {
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

  navigateConnectUrl() {
    window.open(environment.employerDomain, '_blank');
  }
}
