import { Component, OnInit } from "@angular/core";
import { SeoService } from "../../services/seo.service";

@Component({
	selector: "app-seo-manager",
	template: "",
	standalone: true,
})
export class SeoManagerComponent implements OnInit {
	constructor(private seoService: SeoService) {}

	ngOnInit() {
    this.updateDynamicContent("UNIPREP | Your Gateway to International Education, Career Success & Entrepreneurship")
	}

  updateDynamicContent(title: string) {
    this.seoService.updateMetaTags({
			// Basic Meta Tags
			title: title,
			author: "UNIPREP",
			canonicalUrl: "https://uniprep.ai/home",
			alternateUrl: "https://uniprep.ai/home",
			robots: "index,follow",
			language: "English",
			description: "UNIPREP is a virtual Placement Assistance Platform crafted to offer students affordable access to world-class educational resources, essential career tools, and entrepreneurial resources.",
			keywords: "UNIPREP,Career Development,Professional Certification,Interview Preparation,Resume Building,Employer Connect,Job placements",

			// Facebook Meta Tags
			ogTitle: "UNIPREP | Your Gateway to International Education, Career Success & Entrepreneurship",
			ogDescription: "UNIPREP is a virtual Placement Assistance Platform crafted to offer students affordable access to world-class educational resources, essential career tools, and entrepreneurial resources.",
			ogUrl: "https://uniprep.ai",
			ogImage: "https://uniprep.ai/uniprep-assets/images/uniprep_banner.jpg",
			ogImageHeight: "1200",
			ogImageWidth: "1200",
			ogType: "website",

			// Twitter Meta Tags
			twitterCard: "summary_large_image",
			twitterSite: "uniprepindia",
			twitterTitle: "UNIPREP | Your Gateway to International Education, Career Success & Entrepreneurship",
			twitterDescription: "UNIPREP is a virtual Placement Assistance Platform crafted to offer students affordable access to world-class educational resources, essential career tools, and entrepreneurial resources.",
			twitterImage: "https://uniprep.ai/uniprep-assets/images/uniprep_banner.jpg",

			// Schema.org Data
			schema: {
				name: "UNIPREP",
				url: "https://uniprep.ai",
				logo: "https://uniprep.ai/uniprep-assets/images/uniprep_banner.jpg",
				sameAs: ["https://www.facebook.com/uniprepindia", "https://www.instagram.com/uniprepindia/", "https://www.linkedin.com/company/uniprep-india/", "https://www.youtube.com/@UNIPREPGlobal"],
			},
		});
  }
}
