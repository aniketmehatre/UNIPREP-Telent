import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SelectModule } from 'primeng/select';
import { LandingPartnerServices } from '../../landing-partner/landing-partner.service';
import { ButtonModule } from 'primeng/button';

interface PricingSlab {
  slab: string;
  range: string;
  cost: string;
  total: string;
}

@Component({
  selector: 'uni-institute-pricing',
  imports: [CommonModule, FormsModule, RouterModule, SelectModule, ButtonModule],
  templateUrl: './institute-pricing.component.html',
  styleUrl: './institute-pricing.component.scss'
})
export class InstitutePricingComponent implements OnInit {
  selectedCountry: 'india' | 'uk' = 'india';
  countryList: { id: string, country: string, flag: string }[] = [
    {
      id: 'india',
      country: 'India',
      flag: 'uniprep-assets/icons/india.png'
    },
    {
      id: 'uk',
      country: 'United Kingdom',
      flag: 'uniprep-assets/icons/united-kingdom.png'
    }
  ];

  pricingSlabs: PricingSlab[] = [];

  pricingSlabsIndia: PricingSlab[] = [
    { slab: 'Slab 1', range: '1 - 500 students', cost: '₹1,500', total: '₹7,50,000 for 500 students' },
    { slab: 'Slab 2', range: '501 - 2,000 students', cost: '₹1,350', total: '₹27,00,000 for 2,000 students' },
    { slab: 'Slab 3', range: '2,000+ students', cost: '₹1,200', total: 'Based on actual volume' }
  ];

  pricingSlabsUk = [
    { slab: 'Slab 1', range: '1 - 500 students', cost: '£50', total: '£25000 for 500 students' },
    { slab: 'Slab 2', range: '501 - 2,000 students', cost: '£50', total: '£80,000 for 2,000 students' },
    { slab: 'Slab 3', range: '2,000+ students', cost: '£30', total: 'Based on actual volume' }
  ];


  benefitsTiers = [
    {
      tier: 'Tier A',
      eligibility: '1 - 500',
      benefits: [
        '1. Student Usage Report (2x Year)',
        '2. 12 Months Access to UNIPREP (including future premium features)'
      ]
    },
    {
      tier: 'Tier B',
      eligibility: '501 - 2,000',
      benefits: [
        '1. All of Tier A',
        '2. Co-Branded UNIPREP Portal'
      ]
    },
    {
      tier: 'Tier C',
      eligibility: '2,000+',
      benefits: [
        '1. All of Tier B',
        '2. Custom features built at no cost'
      ]
    }
  ];

  faqItems = [
    {
      id: 'collapse1',
      title: "Career-Readiness & Student Success at Scale",
      details: [
        "🛠️ 70+ integrated tools for job prep, education, entrepreneurship & certifications",
        "📄 Resume builder, interview prep, language hub, startup kit, mock tests",
        "💬 24×7 support via UNIPREP team & AI Global Advisor",
        "📆 Full 12-month access with future premium upgrades included",
      ],
    },
    {
      id: 'collapse2',
      title: "Employer Connect Feature (Virtual)",
      details: [
        "🌍 Access to 1,000s of verified employers",
        "🔍 Job filters: freshers, internships, hybrid & sector-based roles",
        "🎯 Real-time, tech-driven solution for placements",
      ],
    },
    {
      id: 'collapse3',
      title: "Tailored Feature Development",
      details: [
        "🛠️ Custom features built at no cost on request",
        "🤝 Platform evolves based on your placement/training needs",
        "📌 Personalized control over student experience",
      ],
    },
    {
      id: 'collapse4',
      title: "Biannual Student Usage Reports",
      details: [
        "📆 Two reports per year tracking:",
        "🔍 Student logins, tool usage",
        "🎓 Certifications earned",
        "💼 Job applications submitted",
        "🧠 Enables data-driven planning by your leadership & placement teams",
      ],
    },
    {
      id: 'collapse5',
      title: "High ROI, Low Cost, Zero Infrastructure",
      details: [
        "📦 Tiered pricing becomes more affordable as enrolment scales",
        "⚙️ 100% cloud-based: no hardware, no setup",
        "🔁 All updates & tools included—no extra charges",
        "💥 Delivers 100X value in learning, outcomes, and reputation",
      ],
    },
    {
      id: 'collapse6',
      title: "Increased Student Retention & Satisfaction",
      details: [
        "🎯 Full-lifecycle support improves student satisfaction and retention",
        "📱 From global admissions to career launches—UNIPREP is a one-stop platform",
        "❤️ Creates a meaningful, lifelong value experience for every student",
      ],
    },
  ]

  constructor(private partnerService: LandingPartnerServices, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe((data: any) => {
      if (data?.['country']) {
        this.selectedCountry = data?.country;
        this.pricingSlabs = this.selectedCountry == 'india' ? this.pricingSlabsIndia : this.pricingSlabsUk;
      }
    }
    )
  }

  changeCountry(event: any) {
    this.pricingSlabs = event == 'india' ? this.pricingSlabsIndia : this.pricingSlabsUk;
  }
}
