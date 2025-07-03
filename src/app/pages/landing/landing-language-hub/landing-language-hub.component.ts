import { CommonModule, Location } from '@angular/common';
import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { Chooseuse, Faq, Howitswork, LandingPage, Whoitsfor } from 'src/app/@Models/landing-page.model';
import { environment } from '@env/environment';
import { AvatarModule } from 'primeng/avatar';
import { landingServices } from '../landing.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HeaderLogoStore } from '../landing-page.store';
import { CarouselModule } from 'primeng/carousel';

@Component({
  selector: 'uni-landing-language-hub',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    AccordionModule,
    ButtonModule,
    AvatarModule,
    CarouselModule
  ],
  templateUrl: './landing-language-hub.component.html',
  styleUrls: ['./landing-language-hub.component.scss']
})
export class LandingLanguageHubComponent implements OnInit, OnDestroy {
  @ViewChild("videoPlayer")
  videoPlayer!: ElementRef
  isPlaying = false;
  public environment = environment;
  landingPageId: string = '';
  selectedStep!: Howitswork;
  faqs: Faq[] = [];
  chooseUsList: Chooseuse[] = [];
  howitsWorks: Howitswork[] = [];
  whoItsFor: Whoitsfor[] = [];
  landingPageData!: LandingPage;
  posterUrl: string = '';
  embedUrl!: SafeResourceUrl;
  isInitialLoadVideo: boolean = true;
  videoUrl: string = '';
  responsiveOptions = [
			{
				breakpoint: '1280px',
				numVisible: 4,
				numScroll: 4
			},
			{
				breakpoint: '1024px',
				numVisible: 3,
				numScroll: 3
			},
			{
				breakpoint: '768px',
				numVisible: 2,
				numScroll: 2
			},
			{
				breakpoint: '560px',
				numVisible: 1,
				numScroll: 1
			}
  ];
  
  constructor(private logoStore: HeaderLogoStore, private sanitizer: DomSanitizer, private route: ActivatedRoute, private landingPageService: landingServices, public location: Location) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params?.['slug']) {
        this.landingPageId = params?.['slug'];
        console.log('Route params:', params);
        this.getLandingPageChooseUs(this.landingPageId);
        this.getLandingPageFAQs(this.landingPageId);
        this.getLandingPageWhoItsFor(this.landingPageId);
        this.getLandingPageHowItsWorks(this.landingPageId);
        this.getLandingPageData(this.landingPageId);
      } else {
        console.warn('No slug parameter found in route');
      }
    });
  }
  
  toggleFaq(faq: any): void {
    faq.isOpen = !faq.isOpen;
  }

  toggleVideo() {
    if (this.isInitialLoadVideo) {
      this.embedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.videoUrl);
      this.isInitialLoadVideo = false;
    }
    this.isPlaying = !this.isPlaying;
  }

  goBack() {
    this.location.back();
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
  getLandingPageChooseUs(landingPageId: string) {
    this.landingPageService.getLandingPageChooseUs(landingPageId).subscribe({
      next: response => {
        this.chooseUsList = response.chooseuses?.chooseuses;
      },
      error: error => {
        console.log(error);
      }
    });
  }

  getLandingPageHowItsWorks(category: string) {
    this.landingPageService.getLandingPageHowItsWorks(category).subscribe({
      next: response => {
        // Store the career cards organized by step
        this.howitsWorks = response?.howitsworks?.howitsworks;
        if (this.howitsWorks)
          this.selectedStep = this.howitsWorks[0];
      },
      error: error => {
        console.log(error);
      }
    });
  }

  getLandingPageWhoItsFor(category: string) {
    this.landingPageService.getLandingPageWhoItsFors(category).subscribe({
      next: response => {
        // Store the career cards organized by step
        this.whoItsFor = response.whoitsfors.whoitsfors;

      },
      error: error => {
        console.log(error);
      }
    });
  }

  getLandingPageFAQs(category: string) {
    this.landingPageService.getLandingPageFAQ(category).subscribe({
      next: response => {
        this.faqs = response.faqs.faqs;
      },
      error: error => {
        console.log(error);
      }
    });
  }

  getLandingPageData(landingPageId: string) {
    console.log('Fetching landing page data for ID:', landingPageId);
    
    // For testing purposes, let's also try with a mock response if the API fails
    const mockResponse = {
      landingpages: {
        id: 1,
        feature_name: 'Language Hub',
        category: 1,
        tag: 'language',
        status: 1,
        icon: '',
        order_no: 1,
        description: 'Language learning hub',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        chooseuses: [],
        whoitsfors: [],
        faqs: [],
        howitsworks: [],
        landingPages: null,
        seo: {
          id: 1,
          landingpage_id: 1,
          seo_title: 'Language Learning Hub - UNI PREP',
          meta_description: 'Master languages with our comprehensive learning tools and resources',
          meta_tag: 'language learning, education, UNI PREP, multilingual',
          meta_author: 'UNI PREP',
          seo_status: 1,
          image: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        herocover: {
          id: 1,
          landingpage_id: 1,
          hero_title: 'Language Hub',
          video_link: 'https://www.youtube.com/embed/Sv8EyWriqV0',
          hero_description: 'Learn languages effectively',
          image_url: 'uniprep-assets/images/landing-page-mock.png',
          status: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        logo: 'uniprep-assets/images/logo.png'
      }
    };
    
    this.landingPageService.getLandingPageData(landingPageId).subscribe({
      next: response => {
        console.log('API Response:', response);
        
        // Set the landing page data first
        this.landingPageData = response.landingpages;
        console.log('Landing page data:', this.landingPageData);
        
        // SEO is now handled statically in index.html
        console.log('SEO Title:', this.landingPageData?.seo?.seo_title);

        // Handle poster image
        const poster = this.landingPageData?.herocover?.image_url;
        if (poster) {
          const img = new Image();
          img.onload = () => {
            this.posterUrl = poster;
          };
          img.onerror = () => {
            this.posterUrl = 'uniprep-assets/images/landing-page-mock.png';
          };
          img.src = poster;
        } else {
          this.posterUrl = 'uniprep-assets/images/landing-page-mock.png';
        }

        // Handle video URL
        this.videoUrl = this.landingPageData?.herocover?.video_link ?
          this.landingPageData.herocover.video_link + '?rel=0&autoplay=1' :
          'https://www.youtube.com/embed/Sv8EyWriqV0?rel=0&autoplay=1';

        // Handle logo
        if (this.landingPageData?.logo) {
          this.logoStore.setLogo(this.landingPageData.logo);
        }
      },
      error: error => {
        console.error('Error fetching landing page data:', error);
        
        // Use mock data as fallback
        console.log('Using mock data as fallback');
        this.landingPageData = mockResponse.landingpages;
        
        // SEO is now handled statically in index.html
        console.log('Using mock data as fallback');
      }
    });
  }

  ngOnDestroy(): void {
    this.logoStore.resetLogo();
  }

}
