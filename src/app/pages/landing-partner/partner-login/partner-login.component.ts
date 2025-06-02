import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SelectModule } from 'primeng/select';
import { LocationService } from 'src/app/location.service';
import { LandingPartnerServices } from '../landing-partner.service';
import { Router } from '@angular/router';
interface Country 
{  id: number; 
   country: string;
   flag: string
}

interface Partner {
  id: number;
  country: string;
  partnername: string;
  domainname: string;
  mitypename: string;
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
  partnersList: Partner[] = [];

  constructor(private locationService: LocationService, private partnerService: LandingPartnerServices, private router: Router) { }

  ngOnInit() {
    this.getWhiteLabel();
    this.getCountryList();
  }

  getWhiteLabel() {
    this.locationService.getSourceByDomain(window.location.hostname).subscribe((data: any) => {
      this.imageUrlWhiteLabel = data.logo
    })
    
  }

    getCountryList() {
    this.partnerService.getCountryList().subscribe({
      next: response => {
        this.countryList = response.data;
      },
      error: error => {
        console.error(error);
      }
    })
  }
  getPartnersListById(id: number) {
    this.partnerService.getPartnersListById(id, 'Partner').subscribe({
      next: response => {
        this.partnersList = response.data;
      },
      error: error => {
        console.error(error);
      }
    })
  }

  routeDomain(domain: number) {
    const selectedPartner = this.partnersList.find(p => p.id === domain);
    if (selectedPartner?.domainname) {
      window.open(`https://${selectedPartner.domainname}`, '_blank');
    }
  }
}
