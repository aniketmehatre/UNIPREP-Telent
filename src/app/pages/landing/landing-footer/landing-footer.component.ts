import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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

  socialLinks = [
    { icon: "facebook", url: "https://facebook.com" },
    { icon: "instagram", url: "https://instagram.com" },
    { icon: "linkedin", url: "https://linkedin.com" },
    { icon: "youtube", url: "https://youtube.com" },
  ]

  aboutLinks = [{ text: "About UNIPREP", url: "/about" }]

  featureLinks = [
    { text: "For Job Seekers", url: "/landing/explore/job-seekers" },
    { text: "For International Students", url: "/landing/explore/international-students" },
    { text: "For Global Travellers", url: "/landing/explore/global-travellers" },
    { text: "For Entrepreneurs", url: "/landing/explore/entrepreneurs" },
  ]

  exploreLinks = [
    { text: "For Employers", url: environment.employerDomain },
    { text: "For Talents", url: "/landing/talent-connect" },
    { text: "For Institutions", url: "/explore/institutions" },
    { text: "For Partners", url: "/explore/partners" },
  ]

  resourceLinks = [
    { text: "Blogs", url: "/blogs" },
    { text: "Certificates", url: "/certificates" },
  ]

  otherLinks = [
    { text: "Privacy Policy", url: "/privacy-policy" },
    { text: "Terms & Conditions", url: "/terms-conditions" },
    { text: "Cancellation Policy", url: "/cancellation-policy" },
    { text: "Refund Policy", url: "/refund-policy" },
  ]

  contactInfo = {
    phone: [
      { country: "in", number: "+91 99807 88380" },
      { country: "gb", number: "+44 99009 00990" },
    ],
    email: "info@uniprep.ai",
  }
}
