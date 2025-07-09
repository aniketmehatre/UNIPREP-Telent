import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { landingServices } from '../../landing.service';
import { StorageService } from 'src/app/storage.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'uni-company-invite-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './company-invite-card.component.html',
  styleUrl: './company-invite-card.component.scss'
})
export class CompanyInviteCardComponent  implements OnInit {

  dataDetails: any = null;
  uuid: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private landingService: landingServices,
    private router: Router,
    private storage: StorageService
  ) { }

  ngOnInit(): void {
    this.uuid = this.route.snapshot.paramMap.get('uuid');
  
    if (this.uuid) {
      this.landingService.getCompanyInviteDetails(this.uuid).subscribe({
        next: (response: any) => {
          const data = response.dataDetails?.[0];
  
          if (data) {
            this.dataDetails = {
              founded: data.founded_year,
              companyName: data.company_name,
              companyLogo: data.company_logo,
              industryType: data.industry_type,
              companySize: data.size || data.company_size,
              headquarters: `${data.HQ_city}, ${data.HQ_country}`,
              globalPresence: data.global_presence,
              website: data.website,
              linkedinLink: data.linkedin_link,
              aboutCompany: data.insight
            };
          }
        },
        error: (err: any) => {
          console.error('❌ Error fetching company details:', err);
        }
      });
    }
  }

  openUrl(url: string) {
    if (url && !url.startsWith('http')) {
      url = 'https://' + url;
    }
    window.open(url, '_blank');
  }
  
}
