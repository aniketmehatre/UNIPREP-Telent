import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { environment } from '@env/environment';
import { LandingInstituteService } from '../landing-institute.service';
import { Country } from 'src/app/@Models/country.model';
import { SelectModule } from 'primeng/select';

interface LandingSection {
  title: string;
  subTitle: string;
  features: string[];
  image: string; // Optional image property
  imageAlt: string; 
  placeholderText?: string;
  isRight: boolean 
}

interface InstituteCategory {
  title: string;
  emoji: string; 
}

@Component({
  selector: 'uni-landing-institute-content',
  imports: [CommonModule, RouterModule, SelectModule],
  templateUrl: './landing-institute-content.component.html',
  styleUrl: './landing-institute-content.component.scss'
})
export class LandingInstituteContentComponent {
@ViewChild("videoPlayer")
  videoPlayer!: ElementRef
  isPlaying = false;
  countries: Country;
  selectedCountry: string = 'Select Country';
  welcomevideoLink: string = `https://${environment.domain}/uniprepapi/storage/app/public/Landing/welcome.mp4`

  whyPartnerParagraph1: string = 'UNIPREP isn\'t just a platform—it\'s your bridge to growth. Offer real value to your audience, grow your revenue, and connect learners with opportunity.';
  whyPartnerParagraph2: string = 'Launch fast. Empower users. Earn more.';

  wantToKnowMoreTitle: string = 'WANT TO KNOW MORE?';
  wantToKnowMoreLead: string = 'REQUEST A DEMO OR JOIN THE UNIPREP NETWORK TODAY.';
  joinNowButtonText: string = 'Join Now';

 landingSections: LandingSection[] = [
  {
    title: 'Virtual Campus Hiring & Employer Connect',
    subTitle: 'Transform your placement process with a real-time virtual ecosystem:',
    features: [
      'Access to 1,000+ verified global and local employers',
      'Job listings across sectors, including internships, part-time, and full-time roles',
      'Smart filters and AI-powered job matching',
      'Smart filters to match students with the right roles',
    ],
    image: 'uniprep-assets/images/landing-institutes/institute1.jpg', // Assuming a naming convention based on the order
    imageAlt: 'A person using a virtual platform to connect with potential employers',
     isRight: true,
  },
  {
    title: 'End-to-End Student Career Tools',
    subTitle: 'Equip your students with the skills and resources they need to succeed.',
    features: [
      'Resume builder, mock interview prep, and job readiness tests',
      'Startup kit for entrepreneurship and business launch basics',
      'Language Hub with 25+ global languages',
      'Future upgrades and new tools automatically included',
    ],
    image: 'uniprep-assets/images/landing-institutes/institute2.jpg', // Assuming a naming convention
    imageAlt: 'A student confidently walking with a laptop and coffee',
    isRight: false,
  },
  {
    title: 'Co-Branded Platform Experience',
    subTitle: 'Promote your institution while delivering top-tier digital services:',
    features: [
      'A co-branded portal that reflects your college or university’s identity',
      'Customized interface with your logo, name, and colour theme',
      'Strengthens trust and visibility for both students and external stakeholders',
      'Accessed via your own unique link or subdomain',
      'Ideal for showcasing innovation, student services, and placement readiness',
    ],
    image: 'uniprep-assets/images/landing-institutes/institute3.jpg', // Assuming a naming convention based on the order
    imageAlt: 'Two professionals shaking hands, representing a co-branded partnership',
    isRight: true,
  },
  {
    title: 'Built Around Your Needs',
    subTitle: 'Every institute is different. UNIPREP adapts accordingly',
    features: [
      'Custom feature development available at no additional cost',
      'Designed to support placement cells, training teams, and career services departments',
      'Simple, guided onboarding with dedicated support',
    ],
    image: 'uniprep-assets/images/landing-institutes/institute4.jpg', // Assuming a naming convention based on the order
    imageAlt: 'Two colleagues collaborating on a computer, highlighting customized support',
    isRight: false,
  },
  {
    title: 'Insights for Better Planning',
    subTitle: 'Stay informed about student activity and progress with:',
    features: [
      'Biannual usage reports tracking logins, tool use, certifications, and job applications',
      'Engagement insights to support placement decisions and academic planning',
      'Engagement insights to support placement decisions and academic planning',
    ],
    image: 'uniprep-assets/images/landing-institutes/institute5.jpg', // Assuming a naming convention based on the order
    imageAlt: 'A person analyzing data on a computer screen for better planning',
    isRight: true,
  },
  {
    title: 'No Setup. No Hardware. Scales with You.',
    subTitle: 'Launch Instantly. Scale Easily.',
    features: [
      'Fully cloud-based—no servers, no physical infrastructure required',
      'Affordable for institutions of all sizes with tiered access models',
      'Continuous upgrades and all features included without extra charges',
    ],
    image: 'uniprep-assets/images/landing-institutes/institute6.jpg', // Assuming a naming convention based on the order
    imageAlt: 'A professional working on a laptop, emphasizing ease of setup and scalability',
    isRight: false,
  },
];

  instituteCategories: InstituteCategory[] = [
    { title: 'Undergraduate Institutes', emoji: '🎓' },
    { title: 'Postgraduate Institutes', emoji: '🎓' },
    { title: 'Engineering & Technical Institutes', emoji: '👷' },
    { title: 'Management Institutes', emoji: '👨‍💼' },
    { title: 'Medical Institutes', emoji: '⚕️' },
    { title: 'Law Institutes', emoji: '👩‍⚖️' },
    { title: 'Arts & Science Institutes', emoji: '🔬' },
    { title: 'Polytechnic Institutes', emoji: '💻' },
    { title: 'Professional Certification Institutes', emoji: '🚀' },
    { title: 'Business Institutes', emoji: '💼' },
    { title: 'Agriculture Institutes', emoji: '🧑‍🌾' },
    { title: 'Design & Architecture Institutes', emoji: '📐' },
    { title: 'Hospitality & Tourism Institutes', emoji: '🧑‍🍳' },
    { title: 'Research Institutes', emoji: '🔬' },
    { title: 'Online and Distance Learning Institutes', emoji: '🌐' },
  ];


  constructor(private landingInstituteService: LandingInstituteService) { }

  selectCountry(country: string): void {
    this.selectedCountry = country;
  }

  ngOnInit(): void {
    this.getCountryList();
  }

  getCountryList() {
    this.landingInstituteService.getCountryList().subscribe({
      next: response => {
        this.countries = response;
      },
      error: error => {
        console.error(error);
      }
    })
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

}
