import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { LandingInstituteService } from '../landing-institute.service';
import { Router } from '@angular/router';

interface PricingSlab {
  slab: string;
  range: string;
  cost: string;
  total: string;
}

interface CountryList{
  id: string;
  country: string;
  flag: string
}
@Component({
  selector: 'uni-institute-pricing',
  imports: [CommonModule, FormsModule, RouterModule, SelectModule, ButtonModule,],
  templateUrl: './institute-pricing.component.html',
  styleUrl: './institute-pricing.component.scss'
})
export class InstitutePricingComponent implements OnInit {
  selectedCountry: 'india' | 'uk' = 'india';
  roiInvestmentDescriptionOfIndia = 'UNIPREP is more than a platform—it\'s a future-ready investment that enhances employability, global visibility, student satisfaction, and NAAC/NIRF performance. It delivers 100X value to both students and institutions by combining technology, opportunity, and strategic partnerships.';
  roiInvestmentDescriptionOfUK = 'UNIPREP is more than a platform—it\'s a future-ready investment that enhances employability, global visibility & student satisfaction. \
                                  It delivers 100X value to both students and institutions by combining technology, opportunity, and strategic partnerships.';

  countryList:CountryList[] = [
    { id: 'india', country: 'India', flag: 'https://flagcdn.com/in.svg' },
    { id: 'united-kingdom', country: 'United Kingdom', flag: 'https://flagcdn.com/gb.svg' },
    { id: 'united-states', country: 'United States', flag: 'https://flagcdn.com/us.svg' },
    { id: 'canada', country: 'Canada', flag: 'https://flagcdn.com/ca.svg' },
    { id: 'australia', country: 'Australia', flag: 'https://flagcdn.com/au.svg' },
    { id: 'germany', country: 'Germany', flag: 'https://flagcdn.com/de.svg' },
    { id: 'united-arab-emirates', country: 'United Arab Emirates', flag: 'https://flagcdn.com/ae.svg' },
    { id: 'singapore', country: 'Singapore', flag: 'https://flagcdn.com/sg.svg' },
    { id: 'new-zealand', country: 'New Zealand', flag: 'https://flagcdn.com/nz.svg' },
    { id: 'france', country: 'France', flag: 'https://flagcdn.com/fr.svg' },
    { id: 'ireland', country: 'Ireland', flag: 'https://flagcdn.com/ie.svg' },
    { id: 'japan', country: 'Japan', flag: 'https://flagcdn.com/jp.svg' },
    { id: 'netherlands', country: 'Netherlands', flag: 'https://flagcdn.com/nl.svg' },
    { id: 'sweden', country: 'Sweden', flag: 'https://flagcdn.com/se.svg' },
    { id: 'south-korea', country: 'South Korea', flag: 'https://flagcdn.com/kr.svg' },
    { id: 'switzerland', country: 'Switzerland', flag: 'https://flagcdn.com/ch.svg' },
    { id: 'malaysia', country: 'Malaysia', flag: 'https://flagcdn.com/my.svg' },
    { id: 'qatar', country: 'Qatar', flag: 'https://flagcdn.com/qa.svg' },
    { id: 'norway', country: 'Norway', flag: 'https://flagcdn.com/no.svg' },
    { id: 'finland', country: 'Finland', flag: 'https://flagcdn.com/fi.svg' },
    { id: 'saudi-arabia', country: 'Saudi Arabia', flag: 'https://flagcdn.com/sa.svg' },
    { id: 'denmark', country: 'Denmark', flag: 'https://flagcdn.com/dk.svg' }
  ];

  pricingSlabs: PricingSlab[] = [];

  pricingSlabsIndia: PricingSlab[] = [
    { slab: 'Slab 1', range: '1 - 500 students', cost: '₹3,000', total: '₹15,00,000 for 500 students' },
    { slab: 'Slab 2', range: '501 - 2,000 students', cost: '₹2,500', total: '50,00,000 for 2,000 students' },
    { slab: 'Slab 3', range: '2,000+ students', cost: '₹2,000', total: 'Based on actual volume' }
  ];

  pricingSlabsUk = [
    { slab: 'Slab 1', range: '1 - 500 students', cost: '£70', total: '£35,000 for 500 students' },
    { slab: 'Slab 2', range: '501 - 2,000 students', cost: '£60', total: '£1,20,000 for 2,000 students' },
    { slab: 'Slab 3', range: '2,0001+ students', cost: '£50', total: 'Based on actual volume' }
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

  accordionOfIndia = [
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
      title: "Employer Connect Expo Pass (On-Site)",
      details: [
        "🎫 1 pass per student to attend exclusive on-ground hiring expos",
        "🏛️ Meet 80+ top employers from various sectors",
      ],
    },
    {
      id: 'collapse4',
      title: "Global University Collaborations for Student Progression",
      details: [
        "🤝 MoUs with 2 foreign universities",
        "🎯 Strategic collaborations focused on recruitment & admissions",
        "📢 Co-branding & visibility in global academic circles",
      ],
    },
    {
      id: 'collapse5',
      title: "UNICONNECT – India & Global Events",
      details: [
        "🎟️ Institutional access to UNICONNECT India & Global Summits",
        "✈️ Global Pass includes travel, visa, hotel for 2 reps",
        "🏛️ Position your institute as internationally progressive",
      ],
    },
    {
      id: 'collapse6',
      title: "Tailored Feature Development",
      details: [
        "🛠️ Custom features built at no cost on request",
        "🤝 Platform evolves based on your placement/training needs",
        "📌 Personalized control over student experience",
      ],
    },
    {
      id: 'collapse7',
      title: "NAAC & NIRF Performance Boost",
      details: [
        "🏷️ Co-branded portal strengthens your digital identity",
        "📊 Contributes to NAAC benchmarks: Student Support, Best Practices, Internationalization",
        "📈 Supports NIRF ranking: Graduation Outcomes, Outreach, Perception",
        "🚀 Enhances regional and national standing",
      ],
    },
    {
      id: 'collapse8',
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
      id: 'collapse9',
      title: "High ROI, Low Cost, Zero Infrastructure",
      details: [
        "📦 Tiered pricing becomes more affordable as enrolment scales",
        "⚙️ 100% cloud-based: no hardware, no setup",
        "🔁 All updates & tools included—no extra charges",
        "💥 Delivers 100X value in learning, outcomes, and reputation",
      ],
    },
    {
      id: 'collapse10',
      title: "Increased Student Retention & Satisfaction",
      details: [
        "🎯 Full-lifecycle support improves student satisfaction and retention",
        "📱 From global admissions to career launches—UNIPREP is a one-stop platform",
        "❤️ Creates a meaningful, lifelong value experience for every student",
      ],
    },
  ];

  accordionOfUK = [
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
  ];

  constructor(private instituteService: LandingInstituteService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe((data: any) => {
      if (data?.['country']) {
        this.selectedCountry = data?.country;
        this.pricingSlabs = this.selectedCountry == 'india' ? this.pricingSlabsIndia : this.pricingSlabsUk;
      }
    });
  }

  changeCountry(event: any) {
    this.router.navigate(['../' + event], { relativeTo: this.route });
    // this.router.navigate(['/institute/pricing', event]);
  }

  get getROIAccordionList() {
    return this.selectedCountry == 'uk' ? this.accordionOfUK : this.accordionOfIndia;
  }
}
