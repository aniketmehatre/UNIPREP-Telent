import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionModule } from 'primeng/accordion';
import { RouterModule } from '@angular/router';
import { environment } from '@env/environment';

@Component({
  selector: 'uni-training-program',
  standalone: true,
  imports: [CommonModule, RouterModule, AccordionModule,],
  templateUrl: './training-program.component.html',
  styleUrls: ['./training-program.component.scss']
})
export class TrainingProgramComponent implements OnInit {

  cardItems = [
    {
      icon: "💳",
      text: "Register on the UNIPREP platform and create a professional digital job profile.",
    },
    {
      icon: '⚙',
      text: "Navigate the top UNIPREP features to explore career growth, entrepreneurship, and international education opportunities.",
    },
    {
      icon: "💻",
      text: "Develop effective communication, soft skills, emotional intelligence, and teamwork abilities.",
    },
    {
      icon: "👩‍💻",
      text: "Use AI tools like ChatGPT and Perplexity to enhance productivity, decision-making, and workplace efficiency.",
    },
    {
      icon: "📈",
      text: "Prepare for job interviews and create a strong personal brand to stand out to employers.",
    },
    {
      icon: "🎯",
      text: "Plan and manage time effectively, set SMART goals, and maintain a healthy work-life balance.",
    },
    {
      icon: "💡",
      text: "Apply critical thinking and structured problem-solving in real-world workplace scenarios.",
    },
    {
      icon: "💼",
      text: "Understand professional work ethics, corporate culture, and personal grooming standards.",
    },
    {
      icon: "💰",
      text: "Learn basic financial literacy and develop an entrepreneurial mindset to handle salary responsibly and identify business opportunities.",
    },
     {
      icon: "🏛",
      text: "Institute admins receive training to track student progress, including placements, study abroad, entrepreneurship, and campus hiring processes.",
    },
  ];
  
  discussionImg = environment.imagePath + 'Landing/landing-discussion.jpg';
  constructor() { }

  ngOnInit(): void {
  }

}
