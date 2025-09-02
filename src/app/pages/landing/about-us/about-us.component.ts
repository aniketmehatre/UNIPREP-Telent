import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, OnInit, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { environment } from '@env/environment';
import { TimelineModule } from 'primeng/timeline';
interface TimelineItem {
  icon?: string;
  year: string;
  title: string;
  subtitle: string;
  points?: string[];
  position: 'left' | 'right';
}

interface WhyUniprepCard {
  title: string;
  icon: string;
  description: string;
}

interface MissionCard {
  badge: string;
  description: string;
}

interface CallToActionCard {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

@Component({
  selector: 'app-about-us',
  imports: [CommonModule, RouterModule, TimelineModule],
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent implements OnInit {
  isPlaying: boolean = false;
  @ViewChild('timelineContainer') timelineContainer!: ElementRef;
  @ViewChild('scrollCursor') scrollCursor!: ElementRef;
  @ViewChildren('timelineItem') timelineItems!: QueryList<ElementRef>;
  @ViewChildren('stepDot') stepDots!: QueryList<ElementRef>;
  fillHeight = 0;
  activeIndex = -1;
  @HostListener('window:scroll', [])
  onScroll(): void {
    const container = this.timelineContainer?.nativeElement;
    const cursor = this.scrollCursor?.nativeElement;
    if (!container || !cursor) return;

    const rect = container.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    const isInView = rect.top < windowHeight && rect.bottom > 0;
    if (!isInView) {
      cursor.style.opacity = '0';
      return;
    }

    this.calculateDotPositions();

    // Get center of viewport
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const containerOffsetTop = scrollTop + rect.top;
    const viewportCenter = scrollTop + window.innerHeight / 2;

    const relativeY = viewportCenter - containerOffsetTop;

    // Find the closest dot to center of viewport
    let closestIndex = 0;
    let closestDistance = Infinity;
    this.dotPositions.forEach((pos, index) => {
      const distance = Math.abs(pos - relativeY);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    // Set the active index
    this.activeIndex = closestIndex;

    // Move the cursor to the center of the active dot
    const activeDotY = this.dotPositions[this.activeIndex];
    cursor.style.top = `${activeDotY - cursor.offsetHeight / 2}px`;
    cursor.style.opacity = '1';

    // Update the orange fill line height up to the active dot
    this.fillHeight =
      (this.dotPositions[this.activeIndex] /
        this.timelineContainer.nativeElement.getBoundingClientRect().height) *
      100;

    // Update filled dot state
    this.updateDotStates();
  }

  currentStepIndex = 0;
  scrolling = false;
  dotPositions: number[] = [];

  calculateDotPositions(): void {
    if (!this.timelineItems) return;

    this.dotPositions = this.timelineItems.map((el) => {
      const rect = el.nativeElement.getBoundingClientRect();
      const containerTop = this.timelineContainer.nativeElement.getBoundingClientRect().top;
      return rect.top - containerTop + rect.height / 2; // center of each block relative to container
    });
  }

  updateDotStates(): void {
    if (!this.stepDots || !this.scrollCursor) return;

    const cursorRect = this.scrollCursor.nativeElement.getBoundingClientRect();
    const cursorYCenter = cursorRect.top + cursorRect.height / 2;

    this.activeIndex = -1;

    this.stepDots.forEach((dot, i) => {
      const dotRect = dot.nativeElement.getBoundingClientRect();
      const dotYCenter = dotRect.top + dotRect.height / 2;

      if (cursorYCenter >= dotYCenter) {
        this.activeIndex = i;
      }
    });
  }

  // @ViewChild('videoPlayer') videoPlayer!: ElementRef;
  // welcomeVideoLink: string = 'https://uniprepapi.storage.googleapis.com/Landing/welcome.mp4';
  welcomeVideoLink: string = `https://${environment.domain}/uniprepapi/storage/app/public/Landing/welcome.mp4`;
  videoUrl: string = `https://www.youtube.com/embed/FOPErdSv9AQ?si=Dnawlh7RFlpupy3d?rel=0&autoplay=1`;
  embedUrl!: SafeResourceUrl;
  isInitialLoadVideo: boolean = true;
  timelineData: TimelineItem[] = [
    {
      icon: 'fa-light fa-arrow-down',
      year: '2021',
      title: 'Spark of Career Empowerment',
      subtitle: 'We began with a simple, yet powerful idea: What if every professional could take full control of their career growth, and job search, without depending on anyone else?',
      points: [
        'Our mission: Build a platform that provides the tools, connections, and visibility needed for career advancement — enabling users to showcase their skills, strengthen their portfolios, and secure the right opportunities.',
        'Action: We created UNIPREP, offering self–driven resources, portfolio enhancement tools, and a global network to help talents independently navigate their career paths and land the right job based on their skills.',
      ],
      position: 'right',
    },
    {
      year: '2022',
      title: 'Learning from Our Own Career Journeys',
      subtitle: '',
      points: [
        'The Process: Drawing from our own struggles and insights in job hunting and career growth, we began shaping a platform rooted in real-world hiring experiences.',
        'Our Goal: To create the kind of career resource we wished we had when navigating the competitive job market ourselves.',
        'Research & Development: We explored the challenges professionals face worldwide in showcasing their skills, building credible portfolios, and connecting with the right employers — and designed UNIPREP to address them.',
        'Outcome: A platform that puts you in control of your career, equipping you with tools and visibility to stand out — without relying on middlemen or traditional recruitment barriers.'],
      position: 'right',
    },
    {
      year: '2023',
      title: 'Expanding Possibilities',
      subtitle: '',
      points: [
        'Growth: By 2023, UNIPREP was scaling rapidly, and so was the power of self-driven career preparation.',
        'New Features: We rolled out advanced hiring tools, global job access, and enhanced portfolio capabilities — giving professionals more ways to showcase their skills and stand out to employers.',
        'Global Reach: From discovering the right opportunities to applying directly and building a verified, impactful profile, job seekers could now take charge of every career step — without intermediaries.',
      ],
      position: 'right',
    },
    {
      year: '2024',
      title: 'Advanced Career Tools & AI Integration',
      subtitle: '',
      points: [
        'Innovation: In 2024, we took UNIPREP to the next level by integrating AI-driven career guidance, enabling users to discover personalized career paths based on their skills, interests, and market demand.',
        '50+ New Features: We introduced AI-powered tools for career growth — including tailored job recommendations, skill gap analysis, portfolio optimization, and interview preparation — helping professionals stand out in a competitive market.',
        'Outcome: With intelligent insights and data-backed recommendations, users can now take control of their careers with confidence, making smarter moves and accelerating their journey to success.'
      ],
      position: 'right',
    },
    {
      year: '2025',
      title: 'Direct Connections, Global Opportunities',
      subtitle: '',
      points: [
        'Focus: In 2025, we doubled down on building direct, meaningful connections between employers and top talent.',
        '70+ Features: We launched over 70 tools designed to bridge the gap between job seekers and employers — including Talent Connect, making it easier for professionals to find the perfect role and for employers to discover standout candidates.',
        'Global Reach & Direct Applications: Talents can now apply directly to opportunities worldwide, while employers can engage with candidates without recruiters or intermediaries.',
        'Goal: To reshape the job market into a transparent, dynamic, and global network where talent and opportunity meet on their own terms.'
      ],
      position: 'right',
    },
    {
      icon: ' ',
      year: 'Looking <br> Ahead',
      title: 'Future Features & Easy Connections',
      subtitle: 'As we continue our journey in 2025, we are excited to announce that we are working on advanced features to make it even easier for employers and talents to connect and grow.',
      points: [
        'Advanced Features Coming Soon: Our team is developing tools to enhance user experience with simpler, quicker connections, and even more intelligent AI features.',
        'The Vision: In the coming months, we\'ll make it even easier to connect employers and talents globally, ensuring the right opportunities are accessible to the right people, whenever and wherever they need them.'
      ],
      position: 'right',
    },
  ];

  whyUniprepData: WhyUniprepCard[] = [
    {
      title: 'Self-Preparation',
      icon: '💼',
      description: 'Whether you\’re applying to universities, planning your career path, or launching a startup, UNIPREP provides you with all the essential tools and guidance.',
    },
    {
      title: 'Independence',
      icon: '💻',
      description: 'No need to depend on agents or intermediaries — just the right resources and support to help you progress confidently at your own pace.',
    },
    {
      title: 'Global Access',
      icon: '🔓',
      description: 'From searching for scholarships to applying for jobs, everything you need is available directly to you, anytime and anywhere around the world.',
    },
  ];

  missionData: MissionCard = {
    badge: 'Our Mission',
    description: 'At UNIPREP, we empower individuals to build impactful professional portfolios, connect with verified employers, and apply to countless job opportunities across industries and geographies. By combining skill-readiness and a global employer network, we help every talent find not just any job - but the right job.',
  };

  callToActionData: CallToActionCard = {
    title: 'WANT TO KNOW MORE?',
    description: 'JOIN UNIPREP TODAY AND EXPLORE 70+ PREMIUM FEATURES.',
    buttonText: 'Join Now',
    buttonLink: '/register', // Replace with the actual link
  };

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
  }

  toggleVideo() {
    if (this.isInitialLoadVideo) {
      this.embedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.videoUrl);
      this.isInitialLoadVideo = false;
    }
    this.isPlaying = !this.isPlaying;
  }
}