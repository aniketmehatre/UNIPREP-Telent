import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { environment } from '@env/environment';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'uni-landing-footer',
  imports: [CommonModule, RouterModule, DialogModule],
  exportAs: 'uni-landing-footer',
  templateUrl: './landing-footer.component.html',
  styleUrl: './landing-footer.component.scss'
})
export class LandingFooterComponent {
  currentYear = new Date().getFullYear()
  displaycancellationpolicy: boolean = false;
  displaytandc: boolean = false;
  displayprivacypolicy: boolean = false;
  displayCookiePolicy: boolean = false;
  displayRefundPolicy: boolean = false;

  socialLinks = [
    { icon: "facebook", url: "https://www.facebook.com/uniprepindia" },
    { icon: "instagram", url: "https://www.instagram.com/uniprepglobal" },
    { icon: "linkedin", url: "https://www.linkedin.com/company/uniprep-global/" },
    { icon: "youtube", url: "https://www.youtube.com/@UNIPREPGlobal" },
    { icon: "twitter", url: "https://x.com/uniprepglobal?s=21" },
  ]

  aboutLinks = [{ text: "About UNIPREP", url: "/about" }]

  featureLinks = [
    { text: "For Job Seekers", url: '/job-seekers' },
    { text: "For International Students", url: "/international-students" },
    { text: "For Global Travellers", url: "/global-travellers" },
    { text: "For Entrepreneurs", url: "/entrepreneurs" },
  ]

  exploreLinks = [
    { text: "For Employers", url: environment.employerDomain },
    { text: "For Talents", url: environment.talentDomain },
    { text: "For Institutions", url: environment.instituteDomain },
    { text: "For Partners", url: environment.partnerDomain },
  ]

  resourceLinks = [
    { text: "Blogs", url: "/blogs" },
    { text: "Certificates", url: "/certificates" },
  ]

  otherLinks = [
    { text: "Privacy Policy", url: "/privacy-policy", type: 'privacy' },
    { text: "Terms & Conditions", url: "/terms-conditions", type: 'terms' },
    { text: "Cancellation Policy", url: "/cancellation-policy", type: 'cancellation' },
    { text: "Refund Policy", url: "/refund-policy", type: 'refund' },
    { text: "Cookie Policy", url: "", type: 'cookie' },
  ]

  contactInfo = {
    phone: [
      { country: "in", number: "+91 63627 16586" },
      { country: "gb", number: "+44 78647 16295" },
    ],
    email: "info@uniprep.ai",
  }

  onClickPolicies(type: string) {
    switch (type) {
      case 'privacy':
        this.displayprivacypolicy = true;
        break;
      case 'terms':
        this.displaytandc = true;
        break;
      case 'cancellation':
        this.displaycancellationpolicy = true;
        break;
      case 'refund':
        // window.open('/refund-policy', '_blank');
        this.displayRefundPolicy = true;
        break;
      case 'cookie':
        // window.open('/refund-policy', '_blank');
        this.displayCookiePolicy = true;
        break;
      default:
        break;
    }
  }
}
