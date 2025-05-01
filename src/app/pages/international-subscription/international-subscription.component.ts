import {Component, OnInit} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {CommonModule} from "@angular/common";
import {environment} from "@env/environment";

@Component({
  selector: 'uni-international-subscription',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './international-subscription.component.html',
  styleUrl: './international-subscription.component.scss'
})
export class InternationalSubscriptionComponent implements OnInit {

  accordionItems = [
    {
      id: "collapseOne",
      title: "1. Career-Readiness & Student Success at Scale",
      content: [
        "� Network directly with potential employers anywhere in the world to enhance career opportunities.",
        "📄 Resume builder, interview prep, language hub, startup kit, mock tests",
        "💬 24×7 support via UNIPREP team & AI Global Advisor",
          "📆 Full 12-month access with future premium upgrades included"
      ],
      image: "�",
    },
    {
      id: "collapseTwo",
      title: "2. Employer Connect Feature (Virtual)",
      content: [
          "🌍 Access to 1,000s of verified employers",
          "🔍 Job filters: freshers, internships, hybrid & sector-based roles",
          "🎯 Real-time, tech-driven solution for placements"
      ],
      image: "",
    },
    {
      id: "collapseThree",
      title: "3. Employer Connect Expo Pass (On-Site)",
      content: [
          "🎫 1 pass per student to attend exclusive on-ground hiring expos",
          "🏛 Meet 80+ top employers from various sectors"
      ],
      image: "�",
    },
    {
      id: "collapseFour",
      title: "4. Global University Collaborations for Student Progression\n",
      content: [
          "🤝 MoUs with 2 foreign universities",
          "🎯 Strategic collaborations focused on recruitment & admissions",
          "📢 Co-branding & visibility in global academic circles"
      ],
      image: "�",
    },
    {
      id: "collapseFive",
      title: "5. UNICONNECT – India & Global Events",
      content: [
          "🎟 Institutional access to UNICONNECT India & Global Summits",
          "✈️ Global Pass includes travel, visa, hotel for 2 reps",
          "🏛 Position your institute as internationally progressive"
      ],
      image: "",
    },
    {
      id: "collapsesix",
      title: "6. Tailored Feature Development",
      content: [
          "🛠 Custom features built at no cost on request",
          "🤝 Platform evolves based on your placement/training needs",
          "📌 Personalized control over student experience"
      ],
      image: "",
    },
    {
      id: "collapseSeven",
      title: "7. NAAC & NIRF Performance Boost",
      content: [
          "🏷 Co-branded portal strengthens your digital identity",
          "📊 Contributes to NAAC benchmarks: Student Support, Best Practices, Internationalization",
          "📈 Supports NIRF ranking: Graduation Outcomes, Outreach, Perception",
          "🚀 Enhances regional and national standing"
      ],
      image: "",
    },
    {
      id: "collapseEight",
      title: "8. Biannual Student Usage Reports",
      content: [
          "📆 Two reports per year tracking",
          "🧠 Enables data-driven planning by your leadership & placement teams"
      ],
      image: "",
    },
    {
      id: "collapseNine",
      title: "9. High ROI, Low Cost, Zero Infrastructure",
      content: [
          "📦 Tiered pricing becomes more affordable as enrolment scales",
          "⚙️ 100% cloud-based: no hardware, no setup",
          "🔁 All updates & tools included—no extra charges",
          "💥 Delivers 100X value in learning, outcomes, and reputation"
      ],
      image: "",
    },
    {
      id: "collapseTen",
      title: "10. Increased Student Retention & Satisfaction",
      content: [
          "🎯 Full-lifecycle support improves student satisfaction and retention",
          "📱 From global admissions to career launches—UNIPREP is a one-stop platform",
          "️ Creates a meaningful, lifelong value experience for every student"
      ],
      image: "",
    }
  ]
  constructor(
      private router: Router
  ) {}

  ngOnInit() {
    console.log('MMMMM')
  }

  scrollToSection(event: Event, sectionId: string): void {
    // Prevent the default anchor link behavior
    event.preventDefault()
    this.router.navigate([`/`]).then(() => {
      setTimeout(() => {
        const section = document.querySelector(`#${sectionId}`)
        if (section) {
          section.scrollIntoView({ behavior: "smooth" })
        }
      }, 0)
    });
  }
  navigateConnectUrl() {
    window.open(environment.employerDomain, '_blank');
  }
}
