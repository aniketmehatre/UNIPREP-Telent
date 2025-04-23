import { Component, OnInit } from '@angular/core';


interface CareerCard {
	id: number;
	title: string;
	description: string;
	icon: string;
}

@Component({
  selector: 'app-job-seekers-landing',
  standalone: true,
  templateUrl: './job-seekers-landing.component.html',
  styleUrls: ['./job-seekers-landing.component.scss']
})
export class JobSeekersLandingComponent implements OnInit {
	steps = [
		{
			id: 1,
			title: 'Plan',
			subtitle: 'Discover Your Direction & Define Career Goals',
			icon: 'compass'
		},
		{
			id: 2,
			title: 'Prepare',
			subtitle: 'Build Skills & Get Application-Ready',
			icon: 'tools'
		},
		{
			id: 3,
			title: 'Act',
			subtitle: 'Apply Smart & Explore Global Opportunities',
			icon: 'tools'
		},
		{
			id: 4,
			title: 'Grow',
			subtitle: 'Build Long-Term Career Value',
			icon: 'tools'
		}
	];

	careerCards: CareerCard[] = [
		{
			id: 1,
			title: 'Career Planner',
			description: 'Receive AI-powered career guidance based on your specialization and target country. Explore the best job markets, trending roles, salary insights, and strategic paths forward.',
			icon: 'target'
		},
		{
			id: 2,
			title: 'Learning Hub',
			description: 'Receive AI-powered career guidance based on your specialization and target country. Explore the best job markets, trending roles, salary insights, and strategic paths forward.',
			icon: 'books'
		},
		{
			id: 3,
			title: 'Skill Mastery',
			description: 'Master key competencies with structured learning paths, assessments, and validation checkpoints — in an engaging, interactive format that rewards you with certificates.',
			icon: 'book'
		},
		{
			id: 4,
			title: 'Personality Test',
			description: 'Understand your personality traits and how they align with specific work environments, job types, and industries. Get role recommendations based on who you naturally are.',
			icon: 'brain'
		},
		{
			id: 5,
			title: 'Psychometric Test',
			description: 'Evaluate your aptitude, behavioral tendencies, and decision-making style. Gain deeper career clarity and choose roles that fit your mental strengths.',
			icon: 'pen'
		},
		{
			id: 6,
			title: 'Employer Test',
			description: 'Practice real-world hiring assessments modeled after tests used by global employers — boost your job-readiness, confidence, and performance.',
			icon: 'pen'
		},
		{
			id: 7,
			title: 'AMCAT',
			description: 'Prepare with AMCAT-style mock tests to enhance your visibility on top recruitment platforms and improve test-based selection outcomes.',
			icon: 'pen'
		},
		{
			id: 8,
			title: 'Career Growth Checker',
			description: 'Map your professional journey with AI-supported insights into role-by-role growth, required skill upgrades, and long-term progression opportunities.',
			icon: 'chart'
		},
		{
			id: 9,
			title: 'Global Employment Insights',
			description: 'Stay ahead with deep insights into industry trends, hiring patterns, and employment opportunities from 40+ global job markets.',
			icon: 'globe'
		},
		{
			id: 10,
			title: 'CV Builder',
			description: 'Create unlimited, ATS-compliant CVs using elegant templates and AI-generated summaries that spotlight your strengths.',
			icon: 'file'
		},
		{
			id: 11,
			title: 'Cover Letter Builder',
			description: 'Instantly generate personalized cover letters powered by AI — tailored to your job role, industry, and experience level.',
			icon: 'mail'
		},
		{
			id: 12,
			title: 'Job Interview Preperation',
			description: 'Practice AI-enhanced mock interviews, refine your responses, and learn advanced techniques to deliver with impact and confidence.',
			icon: 'video'
		},
		{
			id: 13,
			title: 'Career Hacks',
			description: 'Access thousands of expert-written resources, covering resume writing, job search strategy, personal branding, and workplace success across 40+ countries.',
			icon: 'puzzle'
		},
		{
			id: 14,
			title: 'Company List',
			description: 'Explore a curated directory of millions of companies worldwide and instantly access their official websites and career pages.',
			icon: 'building'
		},
		{
			id: 15,
			title: 'Global Work Visa',
			description: 'Get step-by-step visa support with detailed documentation guidelines, timelines, and processes for 40+ countries.',
			icon: 'globe'
		},
		{
			id: 16,
			title: 'Salary Negotiation Hacks',
			description: 'Learn how to confidently negotiate offers with tips and real-world techniques sourced from professionals in 40+ markets.',
			icon: 'message'
		},
		{
			id: 17,
			title: 'Global Salary Converter',
			description: 'Compare salaries across countries with PPP adjustments, tax insights, and cost-of-living breakdowns to make informed financial choices.',
			icon: 'calculator'
		},
		{
			id: 18,
			title: 'Average Salary Estimator',
			description: 'Get realistic salary forecasts based on your role, experience level, industry, and geographic location — backed by AI-generated market data.',
			icon: 'chart'
		},
		{
			id: 19,
			title: 'Job Offers Comparision Tool',
			description: 'Compare multiple job offers side-by-side — evaluate compensation, benefits, growth potential, and company culture before making a decision.',
			icon: 'flag'
		},
		{
			id: 20,
			title: 'Employer Connect',
			description: 'Connect directly with verified employers and recruiters around the world — no middlemen, just real opportunities.',
			icon: 'user'
		},
		{
			id: 21,
			title: 'Jobseeker Success Stories',
			description: 'Get inspired by real UNIPREP users who\'ve landed top roles across the globe — read their stories and learn from their journey.',
			icon: 'trophy'
		},
		{
			id: 22,
			title: 'Fortune Companies',
			description: 'Explore in-depth profiles of 5,000+ global organizations. Learn what they look for, how they hire, and how you can stand out from the crowd.',
			icon: 'building'
		}
	];

	benefits = [
		{
			title: 'Learn smart',
			description: 'Master skills that matter with interactive learning and real certifications.',
			icon: 'search'
		},
		{
			title: 'Apply smart',
			description: 'Use AI-driven tools to personalize applications and compare job opportunities.',
			icon: 'user'
		},
		{
			title: 'Grow smart',
			description: 'Visualize long-term career trajectories with growth mapping and employer insights.',
			icon: 'trophy'
		},
		{
			title: 'Win with confidence',
			description: 'From CV to visa, from interview prep to final offer — we\'re with you every step of the way.',
			icon: 'user'
		}
	];

	getCardsForStep(stepId: number): CareerCard[] {
		const stepRanges = {
			1: [1, 9],
			2: [10, 13],
			3: [14, 20],
			4: [21, 22]
		};

		const range = stepRanges[stepId as keyof typeof stepRanges];
		return this.careerCards.filter(card => card.id >= range[0] && card.id <= range[1]);
	}
  constructor() { }

  ngOnInit() {
  }



}
