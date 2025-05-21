import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Country } from 'ngx-intl-tel-input/lib/model/country.model';
import { SelectModule } from 'primeng/select';
import { LocationService } from 'src/app/location.service';
import { LandingInstituteService } from '../landing-institute/landing-institute.service';

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

  constructor(private locationService: LocationService, private partnerService: LandingInstituteService) { }

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
