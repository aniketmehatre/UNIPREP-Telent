import { CommonModule, Location } from '@angular/common';
import {Component, ElementRef, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { Chooseuse, Faq, Howitswork, LandingPage, Whoitsfor } from 'src/app/@Models/landing-page.model';
import { environment } from '@env/environment';
import { AvatarModule } from 'primeng/avatar';
import { landingServices } from '../landing.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HeaderLogoStore } from '../landing-page.store';
import {MetaService} from "../../../services/meta.service";
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
  private metaService = inject(MetaService)
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
        this.getLandingPageChooseUs(this.landingPageId);
        this.getLandingPageFAQs(this.landingPageId);
        this.getLandingPageWhoItsFor(this.landingPageId);
        this.getLandingPageHowItsWorks(this.landingPageId);
        this.getLandingPageData(this.landingPageId);
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
    this.landingPageService.getLandingPageData(landingPageId).subscribe({
      next: response => {
        console.log(response.landingpages.seo.seo_title)
        let metaReq = {
          title: response.landingpages.seo.seo_title,
          description: response.landingpages.seo.meta_description,
          keywords: response.landingpages.seo.meta_tag,
          url:  window.location.href,
          image:  this.landingPageData?.herocover?.image_url,
        }
        this.metaService.updateMetaTags(metaReq)
        this.landingPageData = response.landingpages;
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
        }
        this.videoUrl = this.landingPageData?.herocover?.video_link ?
          this.landingPageData?.herocover?.video_link + '?rel=0&autoplay=1' :
          'https://www.youtube.com/embed/Sv8EyWriqV0?rel=0&autoplay=1';

        if (this.landingPageData.logo) {
          this.logoStore.setLogo(this.landingPageData.logo);
        }
      },
      error: error => {
        console.log(error);
      }
    });
  }

  ngOnDestroy(): void {
    this.logoStore.resetLogo();
  }

}
