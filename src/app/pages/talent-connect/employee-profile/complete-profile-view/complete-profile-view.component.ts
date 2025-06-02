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
  standalone: true,
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
  constructor(private activatedRoute: ActivatedRoute, private talentConnectService: TalentConnectService, private message: MessageService, private router: Router) { }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.params?.['id'];
    if (this.id) {
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
      }
    });
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

  openView(url: string) {
    window.open(url, '_blank');
  }

  routingToPage(pageUrl: string) {
    const url = window.location.origin + pageUrl;
    window.open(url, "_blank");
  }
}
