import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { environment } from '@env/environment';

@Component({
  selector: 'uni-landing-footer',
  imports: [CommonModule, RouterModule],
  exportAs: 'uni-landing-footer',
  templateUrl: './landing-footer.component.html',
  styleUrl: './landing-footer.component.scss'
})
export class LandingFooterComponent {
  currentYear = new Date().getFullYear()

  @Output() openTermsAndCondition: EventEmitter<boolean> = new EventEmitter(true);
  @Output() openPrivacyPolicy: EventEmitter<boolean> = new EventEmitter(true);
  @Output() openCancellationPolicy: EventEmitter<boolean> = new EventEmitter(true);
  @Output() openRefundPolicy: EventEmitter<boolean> = new EventEmitter(true);

  socialLinks = [
    { icon: "facebook", url: "https://facebook.com" },
    { icon: "instagram", url: "https://instagram.com" },
    { icon: "linkedin", url: "https://linkedin.com" },
    { icon: "youtube", url: "https://youtube.com" },
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
    { text: "For Talents", url: "/talent-connect" },
    { text: "For Institutions", url: "/institute" },
    { text: "For Partners", url: "/partners" },
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
  ]

  contactInfo = {
    phone: [
      { country: "in", number: "+91 99807 88380" },
      { country: "gb", number: "+44 99009 00990" },
    ],
    email: "info@uniprep.ai",
  }

  onClickPolicies(type: string) {
    switch (type) {
      case 'privacy':
        this.openPrivacyPolicy.emit(true);
        break;
      case 'terms':
        this.openTermsAndCondition.emit(true);
        break;
      case 'cancellation':
        this.openCancellationPolicy.emit(true);
        break;
      case 'refund':
        window.open('/refund-policy', '_blank');
        break;
      default:
        break;
    }
  }
}
