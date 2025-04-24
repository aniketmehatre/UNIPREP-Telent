import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { landingServices } from '../landing.service';

interface TeamMember {
  name: string;
  designation: string;
  image: string;
  linkedin_url: string;
}

@Component({
  selector: 'uni-management-team',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './management-team.component.html',
  styleUrls: ['./management-team.component.scss']
})
export class ManagementTeamComponent {
  pageTitle = 'Management Team';
  mainHeading = 'From Skill-Building to Global Career Success';
  description = 'UNIPREP guides jobseekers through every stage of their professional journey — from identifying strengths and mastering skills, to securing global opportunities and growing with purpose. Whether you\'re just starting out or scaling up, we\'re with you every step of the way.';
  
  page: number = 1;
  perpage: number = 10;

  teamMembers: TeamMember[] = [];

  constructor(private landingPageService: landingServices, public location: Location) { 
    this.getTeamMembers();
  }
  

  getTeamMembers() {
    const data = {
      page: this.page,
      perpage: this.perpage,
    }
    this.landingPageService.getManagementTeamMembersList(data).subscribe({
      next: response => {
        if(response.success) {
          this.teamMembers = response.managements;
        }
      },
      error: error => {
        console.log(error);
      }
    });
  }

  goBack(): void {
    // Implement navigation logic here
    this.location.back();
  }
}