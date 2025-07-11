import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { landingServices } from '../../landing.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'uni-talent-invite-card',
  standalone: true,
  imports: [CommonModule ],
  templateUrl: './talent-invite-card.component.html',
  styleUrl: './talent-invite-card.component.scss'
})
export class TalentInviteCardComponent implements OnInit {
  data: any = null;
  uuid: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private landingService: landingServices
  ) {}

  ngOnInit(): void {
    this.uuid = this.route.snapshot.paramMap.get('uuid');
    console.log('Talent UUID from route:', this.uuid);

    if (this.uuid) {
      this.landingService.getTalentInviteDetails(this.uuid).subscribe({
        next: (response: any) => {
          console.log('✅ Received from talent API:', response);
          this.data = response?.data?.[0]; // confirm structure
        },
        error: (err: any) => {
          console.error('❌ Error fetching talent details:', err);
        }
      });
    }
  }
}
