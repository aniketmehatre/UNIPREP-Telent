import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { ScrollTop } from 'primeng/scrolltop';
import { LandingLanguageHubComponent } from '../landing-language-hub/landing-language-hub.component';
import { landingServices } from '../landing.service';

interface CareerCard {
	id: number;
	feature_name: string;
	feature_urlslug: string | null;
	category: string;
	tag: string;
	status: number;
	icon: string;
	order_no: number;
	description: string;
	created_at: string | null;
	updated_at: string | null;
	Status: number;
	title?: string;
}

@Component({
  selector: 'app-job-seekers-landing',
  standalone: true,
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		DialogModule,
		RouterModule,
	],
  templateUrl: './job-seekers-landing.component.html',
  styleUrls: ['./job-seekers-landing.component.scss']
})
export class JobSeekersLandingComponent implements OnInit {
	steps: any = [];
	category: number = NaN;
	categorySlug: string = '';
	categoryName: string = '';
	careerCards: { [key: string]: CareerCard[] } = {};

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

	constructor(private landingService: landingServices, private route: ActivatedRoute) { }

	ngOnInit() {
		this.steps = [
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

		this.route.params.subscribe(params => {
			if (params?.['category']) {
				this.categorySlug = params?.['category'];
				switch (params?.['category']) {
					case 'job-seekers':
						this.category = 1;
						break;
					case 'international-students':
						this.category = 2;
						break;
					case 'global-travellers':
						this.category = 3;
						break;
					case 'entrepreneurs':
						this.category = 4;
						break;
				}
				this.getLandingPageDetailBasedOnCategory(this.category);
			}
		});

	}

	getLandingPageDetailBasedOnCategory(category: number) {
		this.landingService.getLandingPageBasedOnCategory(category).subscribe({
			next: response => {
				// Store the career cards organized by step
				this.careerCards = response.landingpages;
				this.categoryName = response.category;
				// Sort each step's cards by order_no
				Object.keys(this.careerCards).forEach(step => {
					this.careerCards[step].sort((a, b) => a.order_no - b.order_no);
				});
			},
			error: error => {
				console.log(error);
			}
		});
	}

	getCardsForStep(stepId: number): CareerCard[] {
		const stepKey = `Step ${stepId}`;
		return this.careerCards[stepKey] || [];
  }

}