import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { ScrollTopModule } from 'primeng/scrolltop';
import { landingServices } from '../landing.service';

export interface IPAddress {
  ip: string
  city: string
  region: string
  country: string
  loc: string
  org: string
  postal: string
  timezone: string
  readme: string
}

export interface Subscription {
  id: number
  subscription_plan: string
  actual_price: string
  givenprice: string
  discount: string
  validity: number
  currency: string
}

@Component({
  selector: 'uni-pricing',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    RouterModule,
    ScrollTopModule,
  ],
  templateUrl: './pricing.component.html',
  styleUrl: './pricing.component.scss'
})
export class PricingComponent implements OnInit {
  selectedPeriod: 1 | 6 | 12 = 1;
  studentSubscription: Subscription;
  careerSubscription: Subscription;
  entrepreneurSubscription: Subscription;
  countryLocation: string;
  currentLocationCountry: any
  preferredCountry: any

  constructor(private landingPageService: landingServices) { }
  ngOnInit(): void {
    // this.getUserLocation()
    this.getCountry();
  }

  onSelectPeriod(period: 1 | 6 | 12) {
    this.selectedPeriod = period;
    this.getLandingPageSubscriptionList(this.countryLocation, this.selectedPeriod);
  }


  getCountry() {
    this.landingPageService.getCountryName().subscribe({
      next: (response: any) => {
        this.setCountry(response?.country);
        this.getLandingPageSubscriptionList(this.countryLocation, this.selectedPeriod);
      },
      error: error => {

      }
    })
  }

  setCountry(country: string) {
    switch (country) {
      case 'IN':
        this.countryLocation = 'India';
        break;
      case 'UK':
        this.countryLocation = 'United Kingdom';
        break;
      default:
        this.countryLocation = 'India';
    }
  }

  getLandingPageSubscriptionList(country: string, validity: number) {
    const data = {
      country: country,
      validity: validity
    }
    this.landingPageService.getLandingPageSubscriptionList(data).subscribe({
      next: response => {
        if (Array.isArray(response)) {
          this.studentSubscription = response.find(item => item.subscription_plan == 'Student');
          this.careerSubscription = response.find(item => item.subscription_plan == 'Career');
          this.entrepreneurSubscription = response.find(item => item.subscription_plan == 'Entrepreneur');
        }
      },
      error: error => {
        console.error(error.error.message);
      }
    })
  }

  getUserLocation() {
    fetch("https://ipapi.co/json/")
      .then((response) => response.json())
      .then((data) => {
        this.preferredCountry = data.country_code.toLocaleLowerCase()
        console.log(data)
      })
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const longitude = position.coords.longitude
          const latitude = position.coords.latitude
          fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`)
            .then((response) => response.json())
            .then((data) => {
              this.currentLocationCountry = data.address.country
            })
          console.log(this.currentLocationCountry)
          //this.setCountry(this.currentLocationCountry);
          this.getLandingPageSubscriptionList(this.currentLocationCountry, this.selectedPeriod);
        },
        (error) => {
          //if you're not giving the location access get the current country name using IP address
          fetch("https://ipapi.co/json/")
            .then((response) => response.json())
            .then((data) => {
              this.currentLocationCountry = data.country_name
            })
        }
      )
    } else {
      console.log("No support for geolocation")
    }
  }

}
