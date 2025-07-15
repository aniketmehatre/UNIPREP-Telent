import { Component, inject, OnInit } from '@angular/core';
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
import { SocialShareService } from 'src/app/shared/social-share.service';
import { Meta } from '@angular/platform-browser';

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
  userId: string = '';

  // Service
  socialShareService = inject(SocialShareService);
  meta = inject(Meta);

  constructor(private activatedRoute: ActivatedRoute, private talentConnectService: TalentConnectService,
    private message: MessageService, private router: Router) { }

  ngOnInit() {
    this.userId = this.activatedRoute.snapshot.params?.['id'];
    if (this.userId) {
      this.getStudentDetails(this.userId);
    }
  }

  getStudentDetails(id: string) {
    this.talentConnectService.getStudentProfilesUsingId(id).subscribe({
      next: response => {
        this.profileData = response.data[0];
      },
      error: error => {
        this.message.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong' });
        this.router.navigateByUrl('/pages/talent-connect/my-profile');
      }
    });
  }
  
  extractFileName(url: string): string {
    if (!url) return '';
    let fileName = url.split('/').pop() || '';
    return fileName;
  }

  hasNoCertificationFiles(): boolean {
    return !this.profileData?.certifications?.some(cert => cert.file_name);
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

  showSocialSharingList() {
    let socialShare: any = document.getElementById("socialSharingList");
    if (socialShare.style.display == "") {
      socialShare.style.display = "block";
    }
    else {
      socialShare.style.display = socialShare.style.display == "none" ? "block" : "none";
    }
  }

  shareQuestion(type: string) {
    const socialMedias: { [key: string]: string } = this.socialShareService.socialMediaList;
    const url = encodeURI(window.location.origin + '/pages/talent-connect/my-profile/' + this.userId);
    this.meta.updateTag({ property: 'og:url', content: url });
    const shareUrl = socialMedias[type] + encodeURIComponent(url);
    window.open(shareUrl, '_blank');
  }

  copyLink() {
    const textToCopy = encodeURI(window.location.origin + '/pages/talent-connect/my-profile/' + this.userId);
    this.socialShareService.copyQuestion(textToCopy);
  }

  getSocialMediaIconName(icon: string) {
    const iconList: { [key: string]: string } = {
      "Facebook": "facebook",
      "Instagram": "instagram",
      "X": "twitter"
    }
    return iconList[icon] || '';
  }

  getArraytoStringData(data: string[]): string {
    if (!data || data.length === 0) {
      return 'Not specified';
    }
    return data.length > 1 ? `${data[0]} +${data.length - 1}` : data[0];
  }
}
