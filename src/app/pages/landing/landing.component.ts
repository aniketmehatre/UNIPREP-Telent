import { Component, OnDestroy, OnInit } from "@angular/core"
import { ThemeService } from "../../theme.service"
import { AuthService } from "../../Auth/auth.service"
import { environment } from "@env/environment"
import { ActivatedRoute, Router } from "@angular/router"
import { HeaderLogoStore } from "./landing-page.store"

@Component({
    selector: "uni-landing",
    standalone: false,
    templateUrl: "./landing.component.html",
    styleUrls: ["./landing.component.scss"],
})
export class LandingComponent implements OnInit, OnDestroy {
    isDarkMode: boolean
    logoUrl$ = this.logoStore.logoUrl$;

    constructor(
        private logoStore: HeaderLogoStore, 
        private themeService: ThemeService,
        private router: Router, 
        private authService: AuthService, 
        private route: ActivatedRoute
    ) {
        // Initialize the isDarkMode property with the value from the service
        this.isDarkMode = this.themeService.getInitialSwitchState()
    }

    uuid: any
    ngOnInit() {
        // The SEO manager component already handles SEO tags globally
        // We don't need to call setDefaultSeoTags here as it might conflict
        
        // this.uuid = this.route.snapshot.paramMap.get('uuid');
        // if (this.authService.isTokenValid()) {
        //     if (this.uuid) {
        //         console.log('uuid', this.uuid);
        //     } else {
        //         console.log('no uuid', this.uuid);
        //         this.router.navigate(["/pages/dashboard"]) // Redirect to dashboard
        //     }
        // }
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

        // this.timeLeftInfoCard = "24 Hours"
        // // Any additional initialization can go here
        // this.currentImage = "/uniprep-assets/images/uf1.webp"
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

    toggleTheme() {
        this.themeService.toggleTheme()
        // After toggling, update the isDarkMode property to reflect the new state
        this.isDarkMode = this.themeService.isDarkMode()
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
        const validUrls = ['about', 'contact-us', 'job-seekers', 'international-students', 'global-travellers', 'entrepreneurs', 'compare/uk', 'blogs', 'certificates', 'register'];
        if (url === 'home') {
            window.location.href = targetUrl
        } else if (validUrls.includes(url)) {
            window.location.href = targetUrl + `/${url}`
        } else if (url === 'employer') {
            window.location.href = environment.employerDomain
        } else if (url === 'partner') {
            window.location.href = environment.partnerDomain
            //window.location.href = targetUrl + `/${url}`
        } else if (url === 'institute') {
            window.location.href = environment.instituteDomain
            // window.location.href = targetUrl + `/${url}`
        } else if (url === 'talent') {
            window.location.href = environment.talentDomain
            //window.location.href = targetUrl + `/${url}`
        } else {
            window.location.href = `${environment.domain}/${url}`
        }
    }

    navigatePartnerPage() {
        //this.router.navigate(['/partner']);
        window.open(environment.partnerDomain, '_blank');
    }

    ngOnDestroy() {
        localStorage.clear();
    }
}
