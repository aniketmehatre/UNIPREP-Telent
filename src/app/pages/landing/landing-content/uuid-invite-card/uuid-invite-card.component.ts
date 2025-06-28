import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { landingServices } from '../../landing.service';  

@Component({
  selector: 'app-uuid-invite-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './uuid-invite-card.component.html',
  styleUrls: ['./uuid-invite-card.component.scss']
})
export class UuidInviteCardComponent implements OnInit {
  data: any = null;
  uuid: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private landingService: landingServices
  ) {}

  ngOnInit(): void {
    this.uuid = this.route.snapshot.paramMap.get('uuid');

    // if (this.uuid) {
    //   this.landingService.getJobInviteDetails(this.uuid).subscribe({
    //     next: (response: any) => {
    //       console.log('✅ Received from backend:', response);
    //       this.data = response; // once format is confirmed, map if needed
    //     },
    //     error: (err: any) => {
    //       console.error('❌ Error fetching job details:', err);
    //     }
    //   });
    // }


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
}
