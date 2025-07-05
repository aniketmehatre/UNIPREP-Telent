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

    // if (this.uuid) {
    //   this.landingService.getCompanyInviteDetails(this.uuid).subscribe({
    //     next: (response: any) => {
    //       this.dataDetails = response.dataDetails[0];  
    //     },
    //     error: (err: any) => {
    //       console.error('❌ Error fetching job details:', err);
    //     }
    //   });
    // }

    if (this.uuid) {
      this.dataDetails = {
        founded: "2019",
        companyName: "Swiggy",
        companyLogo: "https://uniprep.ai/uniprepapi/storage/app/public/CompanyConnectIcons/Swiggy.png",
        industryType: "Food & Beverage Services (Restaurants, Cafés)",
        companySize: "10,001-25,000",
        headquarters: "Bengaluru, India",
        globalPresence: "India, United Kingdom, Singapore, Ireland, Poland",
        department: "IT",
        website: "https://www.swiggy.com/",
        linkedinLink: "https://www.linkedin.com/company/swiggy-in/",
        aboutCompany: `Swiggy, founded in 2014 and headquartered in Bengaluru, India, has rapidly emerged as a leading food delivery service in the country. 
        With a workforce of over 10,000 employees, the company has established itself as a pivotal player in the Indian food tech landscape, 
        revolutionizing the way consumers experience dining.
    
        With a commitment to quality and customer satisfaction, Swiggy offers a seamless platform for users to order from a diverse range of restaurants. 
        Its innovative approach to logistics and technology ensures timely deliveries, making it a preferred choice for millions across India who seek 
        convenience and variety in their food options.`
      };
    }
  }

}
