import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { environment } from '@env/environment';
import { LandingPartnerServices } from '../landing-partner.service';
import { } from 'primeng/api';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';

interface LandingSection {
  title: string;
  subTitle: string;
  features: string[];
  image: string; // Optional image property
  imageAlt: string; 
  placeholderText?: string;
  isRight: boolean 
}

interface Partner {
  id: number;
  country: string;
  partner: string;
  domain: string;
}

interface PartnerCategory {
  title: string;
  emoji: string; 
}

@Component({
  selector: 'app-landing-partner-content',
  imports: [CommonModule, RouterModule, SelectModule, FormsModule],
  standalone: true,
  templateUrl: './landing-partner-content.component.html',
  styleUrls: ['./landing-partner-content.component.scss']
})
export class LandingPartnerContentComponent implements OnInit {
  @ViewChild("videoPlayer")
  videoPlayer!: ElementRef
  isPlaying = false;
  countries: string[] = ['United States', 'Canada', 'United Kingdom', 'Australia', 'India', 'Singapore', 'Germany'];
  selectedCountry: string = 'Select Country';
  welcomevideoLink: string = `https://${environment.domain}/uniprepapi/storage/app/public/Landing/welcome.mp4`

  whyPartnerParagraph1: string = 'UNIPREP isn\'t just a platform—it\'s your bridge to growth. Offer real value to your audience, grow your revenue, and connect learners with opportunity.';
  whyPartnerParagraph2: string = 'Launch fast. Empower users. Earn more.';

  wantToKnowMoreTitle: string = 'WANT TO KNOW MORE?';
  wantToKnowMoreLead: string = 'REQUEST A DEMO OR JOIN THE UNIPREP NETWORK TODAY.';
  joinNowButtonText: string = 'Join Now';

  partnerCategories: PartnerCategory[] = [
    { title: 'Study Abroad Consultants', emoji: '🌍' },
    { title: 'Local Admission Consultants', emoji: '🏛️' },
    { title: 'Test Prep & Coaching Centers', emoji: '🧑‍🎓' },
    { title: 'Career Counseling Centers', emoji: '💼' },
    { title: 'Immigration Consultants', emoji: '🛂' },
    { title: 'Language Training Institutes', emoji: '📖' },
    { title: 'Skill Development Centers', emoji: '⚙️' },
    { title: 'Online Education Platforms', emoji: '💻' },
    { title: 'Project Centers', emoji: '🧪' },
    { title: 'EdTech Companies', emoji: '💡' },
    { title: 'HR & Recruitment Firms', emoji: '👥' },
    { title: 'Student Loan & Financial Aid Providers', emoji: '💰' }
  ];

  landingSections: LandingSection[] = [
    {
      title: 'Employer Connect & Talent Access',
      subTitle: 'Bring Verified Job Opportunities to Your Users',
      features: [
        'Access to 1,000+ verified global and local employers',
        'Curated listings for internships, part-time, and full-time jobs',
        'Smart filters and AI-powered job matching',
        'Real-time visibility into hiring trends and employer needs',
      ],
      image: 'uniprep-assets/images/landing-partners/partner1.jpg', // Assuming a naming convention based on the order
      imageAlt: 'A network of interconnected people',
      isRight: true
    },
    {
      title: 'All-in-One Career Toolkit',
      subTitle: 'Offer Job Readiness, Entrepreneurship, and Global Skills',
      features: [
        'Resume builder, mock interviews, and job readiness tests',
        'Startup Kit for launching businesses or freelance careers',
        'Language Hub with 25+ international and regional languages',
        'Future tools and upgrades included at no extra cost',
      ],
      image: 'uniprep-assets/images/landing-partners/partner2.jpg', // Assuming a naming convention based on the order
      imageAlt: 'Two professionals shaking hands in a meeting',
      isRight: false
    },
    {
      title: 'Co-Branded Platform Experience',
      subTitle: 'Your Brand. Our Tech. One Seamless Ecosystem.',
      features: [
        'Fully white-labeled experience on yourcompany.uniprep.ai',
        'Includes your logo, colors, and company identity',
        'Boosts trust, retention, and perceived value',
        'Perfect for training firms, edtechs, consultancies, or HR platforms',
      ],
      image: 'uniprep-assets/images/landing-partners/partner3.jpg', // Assuming a naming convention based on the order
      imageAlt: 'A person working on a co-branded platform on a laptop',
      isRight: true
    },
    {
      title: 'Built for Your Company\'s Needs',
      subTitle: 'Flexible. Customizable. Scalable.',
      features: [
        'Features customized to your workflow and target audience',
        'No coding or setup required—fully cloud-based',
        'Dedicated partner support for onboarding, integration, and co-branding',
      ],
      image: 'uniprep-assets/images/landing-partners/partner4.jpg', // Assuming a naming convention based on the order
      imageAlt: 'A team discussing data on a computer screen',
      isRight: false
    },
    {
      title: 'Insight-Driven Growth',
      subTitle: 'Data That Drives Retention & ROI',
      features: [
        'Biannual reports on logins, certifications, and job applications',
        'Engagement analytics to refine offerings and increase conversions',
        'Know what your users need—and deliver it smarter and faster',
      ],
      image: 'uniprep-assets/images/landing-partners/partner5.jpg', // Assuming a naming convention based on the order
      imageAlt: 'A hand interacting with a data growth chart on a laptop',
      isRight: true
    },
    {
      title: 'Zero Setup Cost. Fully Cloud-Based.',
      subTitle: 'Launch Instantly. Scale Easily.',
      features: [
        'No servers, installations, or hardware required',
        'Start with just your logo and brand colors',
        'All updates and new features included, always',
      ],
      image: 'uniprep-assets/images/landing-partners/partner6.jpg', // Assuming a naming convention based on the order
      imageAlt: 'A person happily working on a laptop',
      isRight: false
    },
  ];
  partnersList: Partner[] = [];
  filteredPartnerList: Partner[] = [];
  searchWord: string = '';
  constructor(private landingPartnerService: LandingPartnerServices) { }

  selectCountry(country: string): void {
    this.selectedCountry = country;
  }

  ngOnInit(): void {
    this.getCountryList();
  }

  getCountryList() {
    this.landingPartnerService.getCountryList().subscribe({
      next: response => {
        this.countries = response.data;
      },
      error: error => {
        console.error(error);
      }
    })
  }

  getPartnersListById(id: number) {
    this.landingPartnerService.getPartnersListById(id).subscribe({
      next: response => {
        this.partnersList = response.data;
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

  onSearchPartner(event: string) {
    this.filteredPartnerList = this.partnersList.filter((item) => item.partner.includes(this.searchWord));
  }


}
