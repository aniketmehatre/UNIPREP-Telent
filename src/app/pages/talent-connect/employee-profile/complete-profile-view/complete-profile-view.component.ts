import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { ProgressBarModule } from 'primeng/progressbar';
import { TooltipModule } from 'primeng/tooltip';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { UserProfile } from 'src/app/@Models/user-profile.model';
import { TalentConnectService } from '../../talent-connect.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-complete-profile-view',
  standalone:true,
  imports: [    
    CommonModule,
    RouterModule,
    ButtonModule,
    ProgressBarModule,
    RatingModule,
    CardModule,
    DividerModule,
    FormsModule,
    ProgressBarModule,
    TooltipModule],
  templateUrl: './complete-profile-view.component.html',
  styleUrls: ['./complete-profile-view.component.scss']
})
export class CompleteProfileViewComponent implements OnInit {
  profileData!: UserProfile;
  id: string = '';
  constructor(private activatedRoute:ActivatedRoute, private talentConnectService: TalentConnectService, private message: MessageService, private router: Router) { }

  ngOnInit() {
    // this.profileData = {
    //   id: 71,
    //   user_id: 2,
    //   full_name: "Vaisagh D",
    //   date_of_birth: "2025-04-08",
    //   gender: "Male",
    //   dp_image: "https://api.uniprep.ai/uniprepapi/storage/app/public/uploads/student_profile/71/1744118511_dp.svg",
    //   profile_completion: 57,
    //   linkedin_profile:
    //     "https://www.google.com/search?q=employer&rlz=1C1CHBD_enIN1124IN1124&oq=employer&gs_lcrp=EgZjaHJvbWUyEQgAEEUYORhGGPkBGLEDGIAEMhAIARAAGJECGIsDGIAEGIoFMhAIAhAAGJECGIsDGIAEGIoFMg0IAxAAGIMBGLEDGIAEMg0IBBAAGIMBGLEDGIAEMgYIBRBFGD0yBggGEEUYPTIGCAcQRRg90gEJMTQ4MDVqMWo5qAIAsAIB&sourceid=chrome&ie=UTF-8",
    //   personal_website: null,
    //   total_years_of_experience: "3",
    //   overall_years_experience: "Fresher",
    //   status: 1,
    //   careerPreference: {
    //     id: 51,
    //     student_id: 71,
    //     career_status: "Fresher / Recent Graduate",
    //     preferred_employment_type: '["Any"]',
    //     preferred_workplace_type: '["On-Site Work"]',
    //     willingness_to_relocate: "Yes",
    //     currency_id: 2,
    //     expected_salary: "INR 12323.00 /Month",
    //     set_industry_apart: null,
    //     real_world_challenge: null,
    //     leadership_experience: null,
    //     admired_quality: null,
    //     cv_filename:
    //       "https://api.uniprep.ai/uniprepapi/storage/app/public/uploads/student_profile/71/1744119959_cv_letter.pdf",
    //     portfolio_upload_link: null,
    //     video_link: null,
    //     notes: null,
    //     preferred_work_location: null,
    //     job_title: null,
    //     career_interest_name: null,
    //     soft_skill_name: null,
    //     professional_strength: null,
    //   },
    //   nationality_name: "Afghan",
    //   current_location: "Andhra Pradesh, Alluri Sitharama Raju",
    //   work_experience: [],
    //   education: [
    //     {
    //       id: 57,
    //       student_id: 71,
    //       university_name: "tesd",
    //       course_name: "test",
    //       graduation_year_id: 3,
    //       gpa_percentage: "233",
    //       created_at: "2025-04-08T13:45:59.000000Z",
    //       updated_at: "2025-04-08T13:45:59.000000Z",
    //       qualification_name: "Postgraduate Diploma",
    //       field_of_study: null,
    //       graduation_year_name: "1981",
    //     },
    //   ],
    //   certifications: [
    //     {
    //       id: 93,
    //       student_id: 71,
    //       name: null,
    //       file_name: null,
    //       type: "Certificate",
    //       status: 1,
    //     },
    //     {
    //       id: 94,
    //       student_id: 71,
    //       name: null,
    //       file_name: null,
    //       type: "Achievement",
    //       status: 1,
    //     },
    //   ],
    //   references: [
    //     {
    //       id: 39,
    //       student_id: 71,
    //       college_name: null,
    //       reference_name: null,
    //       designation: null,
    //       phone_number: null,
    //       email: null,
    //     },
    //   ],
    //   professional_references: [],
    //   languages: [
    //     {
    //       id: 35,
    //       student_id: 71,
    //       proficiency: "Intermediate",
    //       hobby_id: 0,
    //       status: 1,
    //       language_name: "Assamese",
    //     },
    //   ],
    //   networking: [],
    // }
    this.id = this.activatedRoute.snapshot.params?.['id'];
    if(this.id) {
      this.getStudentDetails(this.id);
    }
  }

  extractFileName(url: string): string {
    if (!url) return '';
    let fileName = url.split('/').pop() || ''; // "1742015348_cv_letter.pdf"
    return fileName;
  }
  hasNoCertificationFiles(): boolean {
    return !this.profileData?.certifications?.some(cert => cert.file_name);
  }
  getStudentDetails(id: string) {
		this.talentConnectService.getStudentProfilesUsingId(id).subscribe({
      next: response => {
        this.profileData = response.data[0];
			},
			error: error => {
        this.message.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Something went wrong'
        });
        this.router.navigateByUrl('/pages/talent-connect/my-profile');
				console.log(error);
			}
		});
	}

  getProficiencyRating(proficiency: string): number {
    // Convert proficiency text to a rating number
    switch (proficiency) {
      case "Beginner":
        return 1
      case "Elementary":
        return 2
      case "Intermediate":
        return 3
      case "Advanced":
        return 4
      case "Fluent":
        return 5
      default:
        return 3 // Default to intermediate
    }
  }

  openView(url: string) {
    window.open(url, '_blank');
  }
}
