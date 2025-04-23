import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-landing-language-hub',
  standalone: true,
  imports: [
    CommonModule,
    AccordionModule,
    ButtonModule
  ],
  templateUrl: './landing-language-hub.component.html',
  styleUrls: ['./landing-language-hub.component.scss']
})
export class LandingLanguageHubComponent implements OnInit {
  faqs = [
    {
      question: 'Are the certificates actually useful when applying for jobs?',
      answer: '',
      isOpen: false
    },
    {
      question: 'Do I need any prior experience to start?',
      answer: 'Not at all. The Learning Hub offers courses for all levels — whether you\'re a beginner or looking to upgrade your current skill set.',
      isOpen: true
    },
    {
      question: 'Can I learn at my own pace?',
      answer: '',
      isOpen: false
    },
    {
      question: 'How do I know which course or specialization to choose?',
      answer: '',
      isOpen: false
    }
  ];

  steps = [
    {
      number: 1,
      title: 'Create Your Free Account',
      icon: '📱'
    },
    {
      number: 2,
      title: 'Watch the Demo Video',
      icon: '📹'
    },
    {
      number: 3,
      title: 'Pick a Course',
      icon: '📋'
    },
    {
      number: 4,
      title: 'Start Learning',
      icon: '📚'
    },
    {
      number: 5,
      title: 'Complete the Quiz & Earn Your Certificate',
      icon: '🏆'
    }
  ];

  userTypes = [
    {
      title: 'Students',
      description: 'Get career-ready before graduation',
      image: 'uniprep-assets/images/screenshot3.png'
    },
    {
      title: 'Freshers',
      description: 'Stand out in a competitive job market',
      image: 'uniprep-assets/images/screenshot3.png'
    },
    {
      title: 'Working Professionals',
      description: 'Upskill or switch career paths',
      image: 'uniprep-assets/images/screenshot3.png'
    },
    {
      title: 'Institutions',
      description: 'Support student success with practical learning tools',
      image: 'uniprep-assets/images/screenshot3.png'
    }
  ];

  toggleFaq(faq: any): void {
    faq.isOpen = !faq.isOpen;
  }

  constructor() { }

  ngOnInit() {
  }

}
