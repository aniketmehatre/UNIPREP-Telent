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
  title: string;
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
  // @ViewChild('scrollCursor') scrollCursor!: ElementRef;
  // @ViewChild('timelineContainer') timelineContainer!: ElementRef;

  // @HostListener('window:scroll', [])
  // onScroll(): void {
  //   const container = this.timelineContainer?.nativeElement;
  //   const cursor = this.scrollCursor?.nativeElement;
  //   if (!container || !cursor) return;

  //   const rect = container.getBoundingClientRect();

  //   const isInView = rect.top < window.innerHeight && rect.bottom > 0;

  //   if (isInView) {
      // const scrollTop = window.scrollY || document.documentElement.scrollTop;
      // const progress = (scrollTop + window.innerHeight / 2 - (scrollTop + rect.top)) / rect.height;
      // const clampedProgress = Math.min(Math.max(progress, 0), 1);
      // const cursorTop = clampedProgress * rect.height;

      // cursor.style.top = `${cursorTop}px`;
  //     cursor.style.opacity = '1'; // show when active
  //   } else {
  //     cursor.style.opacity = '0'; // hide when out of view
  //   }
  // }

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

  // Only activate when timeline is in view
  const isInView = rect.top < windowHeight && rect.bottom > 0;
  if (!isInView) {
    cursor.style.opacity = '0';
    return;
  }

  // --- Use center-of-viewport based progress ---
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const containerOffsetTop = scrollTop + rect.top;
  const viewportCenter = scrollTop + window.innerHeight / 2;

  const progress = (viewportCenter - containerOffsetTop) / rect.height;
  const clampedProgress = Math.min(Math.max(progress, 0), 1);
  const cursorTop = Math.min(clampedProgress * rect.height, rect.height - cursor.offsetHeight);

  cursor.style.top = `${cursorTop}px`;
  cursor.style.opacity = '1'; // Show when in view

  // --- Continue to calculate fill height for progress line ---
  this.fillHeight = clampedProgress * 100;

  // Update dots
  this.calculateDotPositions();
  this.updateDotStates();
}

currentStepIndex = 0;
scrolling = false;

@HostListener('wheel', ['$event'])
onWheelScroll(event: WheelEvent): void {
  const container = this.timelineContainer?.nativeElement;
  if (!container || this.scrolling || !this.dotPositions.length) return;

  const rect = container.getBoundingClientRect();
  const isInView = rect.top < window.innerHeight && rect.bottom > 0;
  if (!isInView) return;

  event.preventDefault();

  this.scrolling = true;

  const direction = event.deltaY > 0 ? 1 : -1;

  // Clamp index change to 1 step only
  let nextIndex = this.currentStepIndex + direction;

  // Enforce valid range
  nextIndex = Math.max(0, Math.min(this.dotPositions.length - 1, nextIndex));

  if (nextIndex !== this.currentStepIndex) {
    this.currentStepIndex = nextIndex;

    const containerTop = container.getBoundingClientRect().top + window.scrollY;
    const targetY = containerTop + this.dotPositions[this.currentStepIndex] - window.innerHeight / 2;

    // Scroll to center the selected dot
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  }

  // Lock further scrolls briefly
  setTimeout(() => {
    this.scrolling = false;
  }, 600); // Reduce delay if scroll feels unresponsive
}


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
      title: 'The Spark of Self-Reliance',
      subtitle: 'We began with a simple, yet powerful idea: What if everyone could take full control of their education, career, and entrepreneurial journey, without relying on anyone else?',
      points: [
        'Our mission: Build a platform that provides the tools and resources needed for self-preparation, allowing users to independently navigate their paths.',
        'Action: We created UNIPREP, offering self-guided resources for education, careers, and entrepreneurship.',
      ],
      position: 'right',
    },
    {
      year: '2022',
      title: 'Learning from Our Own Experience',
      subtitle: '',
      points: [
        'The Process: Drawing from our own struggles and insights, we started building a platform based on real-world experiences. Our goal was to offer something that we, as individuals, wished we had when we were navigating these journeys ourselves.',
        'Research & Development: We dug deep into the challenges people face globally in accessing education and career opportunities and designed UNIPREP with these real-world insights in mind.',
        'Outcome: A platform that empowers you to take control of your journey, offering resources tailored to self-preparation—no dependency on external agents or intermediaries.',
      ],
      position: 'right',
    },
    {
      year: '2023',
      title: 'Expanding Possibilities',
      subtitle: 'By 2023, UNIPREP was growing, and so was the power of self-guided preparation.',
      points: [
        '10 Global Education Features: launched, making it easier for students to explore, apply, and plan their education and career journeys independently.',
        'Global Reach: From finding the right university to applying for scholarships and planning careers, users could now take charge every step of the way, without intermediaries.',
      ],
      position: 'right',
    },
    {
      year: '2024',
      title: 'Advanced Career Tools & AI Integration',
      subtitle: 'In 2024, we enhanced UNIPREP by integrating AI-driven career guidance, helping users explore personalized career paths based on their skills, interests, and market trends.',
      points: [
        '50+ New Features: The platform expanded with AI-backed tools for career growth, including personalized advice, skill assessments, and learning path recommendations, empowering users to make smarter career decisions.',
        'Outcome: With these intelligent tools, users are now better equipped to take control of their career journey, using AI insights to guide their education, career choices, and professional growth',
      ],
      position: 'right',
    },
    {
      year: '2025',
      title: 'Direct Connections Between Employers & Talent',
      subtitle: 'In 2025, the focus shifted even more toward creating direct connections between employers and talent.',
      points: [
        '70+ Features: We launched over 70 features aimed at connecting employers and talents directly. Tools like Talent Connect make it easier for job seekers to find the perfect role and for employers to discover top talent.',
        'Global Reach & Direct Applications: Now, talents can apply directly to job opportunities, and employers can connect with the right candidates—without the need for recruiters or intermediaries.',
        'Goal: To restructure the job market by creating a global network that allows employers and talents to connect on their own terms, fostering a more dynamic and transparent employment ecosystem.',
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
        'The Vision: In the coming months, we\'ll make it even easier to connect employers and talents globally, ensuring the right opportunities are accessible to the right people, whenever and wherever they need them.',
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
    title: 'At UNIPREP, we believe that everyone should have the power to shape their future.',
    description: 'Our mission is to empower individuals by providing the right tools for self-guided success. From education to career planning to entrepreneurship, we aim to make the journey independent, accessible, and achievable for everyone.',
  };

  callToActionData: CallToActionCard = {
    title: 'WANT TO KNOW MORE?',
    description: 'REQUEST A DEMO OR JOIN THE UNIPREP NETWORK TODAY.',
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