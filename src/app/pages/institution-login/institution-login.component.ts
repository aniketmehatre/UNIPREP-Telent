import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Country } from 'ngx-intl-tel-input/lib/model/country.model';
import { SelectModule } from 'primeng/select';
import { LocationService } from 'src/app/location.service';
import { LandingInstituteService } from '../landing-institute/landing-institute.service';
interface Institute {
  id: number;
  country: string;
  institutename: string;
  domainname: string;
  mitypename: string;
}

@Component({
  selector: 'uni-institution-login',
  standalone: true,
  imports: [CommonModule, RouterModule, SelectModule],
  templateUrl: './institution-login.component.html',
  styleUrls: ['./institution-login.component.scss']
})
export class InstitutionLoginComponent implements OnInit {
  imageUrlWhiteLabel = signal<string | null>(null);
  countryList: Country[] = [];
  instituteList: Institute[] = [];
  constructor(private locationService: LocationService, private partnerService: LandingInstituteService) { }

  ngOnInit() {
    this.getWhiteLabel();
    this.getCountryList();
  }

  getWhiteLabel() {
    this.locationService.getSourceByDomainName().subscribe((data: any) => {
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
    this.partnerService.getPartnersListById(id, 'College').subscribe({
      next: response => {
        this.instituteList = response.data;
      },
      error: error => {
        console.error(error);
      }
    })
  }

  routeDomain(domain: number) {
    const selectedPartner = this.instituteList.find(p => p.id === domain);
    if (selectedPartner?.domainname) {
      window.open(`https://${selectedPartner.domainname}`, '_blank');
    }
  }

}
