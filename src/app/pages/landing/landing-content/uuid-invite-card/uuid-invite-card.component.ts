import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {landingServices} from '../../landing.service';
import {Rating, RatingModule} from 'primeng/rating';
import {ChipModule} from 'primeng/chip';
import {ButtonModule} from 'primeng/button';
import {StepsModule} from 'primeng/steps';
import {FormsModule} from '@angular/forms';
import {AuthService} from "../../../../Auth/auth.service";
import { LocalStorageService } from "ngx-localstorage"
import {StorageService} from "../../../../services/storage.service";
@Component({
    selector: 'app-uuid-invite-card',
    standalone: true,
    imports: [ChipModule, ButtonModule, StepsModule, CommonModule, RatingModule, FormsModule],
    templateUrl: './uuid-invite-card.component.html',
    styleUrls: ['./uuid-invite-card.component.scss']
})
export class UuidInviteCardComponent implements OnInit {
    private service = inject(AuthService);
    data: any = null;
    uuid: string | null = null;

    constructor(
        private route: ActivatedRoute,
        private landingService: landingServices,
        private router: Router,
        private storageService: StorageService,
        private storage: LocalStorageService
    ) {
    }

    ngOnInit() {
        this.uuid = this.route.snapshot.paramMap.get('uuid');
        console.log('UUID from route:', this.uuid);

        if (this.uuid) {
            this.landingService.getJobInviteDetails(this.uuid).subscribe({
                next: (response: any) => {
                    console.log('✅ Received from backend:', response);
                    this.data = response.data[0]; // once format is confirmed, map if needed
                },
                error: (err: any) => {
                    console.error('❌ Error fetching job details:', err);
                }
            });
        }


        if (this.uuid) {
            this.data = {
                companyLogo: '',
                title: 'Senior UI/UX Designer',
                postedDate: '19–02–2025',
                vacancies: 50,
                applied: 10,
                video: 'Not Mandatory',
                startDate: '19–02–2025',
                deadline: '25–02–2025',
                location: 'Mysore, India',
                workMode: 'Onsite',
                experience: '0–50',
                position: 'UI Designer',
                salary: '₹50,000/mo',
                level: 'Mid Level',
                degree: "Bachelor's",
                industry: 'Tech Industry',
                overview: `We are looking for a creative and detail-oriented UI/UX Designer to join our team at UNIABROAD. The ideal candidate will be responsible for designing user-friendly, engaging, and visually appealing interfaces for our digital platforms, ensuring a seamless user experience for students and stakeholders.`,
                responsibilities: [
                    'Design and implement intuitive, user-centered interfaces for web and mobile applications.',
                    'Conduct user research and usability testing to understand pain points and improve UI/UX designs.',
                    'Develop wireframes, prototypes, and mockups that effectively communicate design ideas.'
                ]
            };
        }
    }

    getProficiencyRating(proficiency: string) {
        const proficiencyList: { [key: string]: number } = {
            "Beginner": 2,
            "Fluent": 3,
            "Proficient": 4,
            "Native": 5
        }
        return proficiencyList[proficiency] || 0;
    }

    onClickApply(jobId: any) {
        this.storage.set('jobId', `/pages/talent-connect/easy-apply/${jobId}`)
        this.storage.set('position', this.data.position)
        console.log(this.storage.get('position'))
        if (this.service.isTokenValid()) {
            this.router.navigate([`/pages/talent-connect/easy-apply/${jobId}`])
        } else {
            this.router.navigate([`/login`])
        }
    }
}
