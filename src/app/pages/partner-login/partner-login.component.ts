import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SelectModule } from 'primeng/select';
import { LocationService } from 'src/app/location.service';
import { LandingPartnerServices } from '../landing-partner/landing-partner.service';
interface Country 
{  id: number; 
   country: string;
   flag: string
}

@Component({
  selector: 'uni-partner-login',
  standalone: true,
  imports: [CommonModule, RouterModule, SelectModule],
  templateUrl: './partner-login.component.html',
  styleUrls: ['./partner-login.component.scss']
})
export class PartnerLoginComponent implements OnInit {
  imageUrlWhiteLabel = signal<string | null>(null);
  countryList: Country[] = [];

  constructor(private locationService: LocationService, private partnerService: LandingPartnerServices) { }

  ngOnInit() {
    this.getWhiteLabel();
    this.getCountryList();
  }

  getWhiteLabel() {
    this.locationService.getImage().subscribe((imageUrl) => {
			this.imageUrlWhiteLabel.set(imageUrl);
		});
  }

    getCountryList() {
    this.partnerService.getCountryList().subscribe({
      next: response => {
        this.countryList = response;
      },
      error: error => {
        console.error(error);
      }
    })
  }

}
