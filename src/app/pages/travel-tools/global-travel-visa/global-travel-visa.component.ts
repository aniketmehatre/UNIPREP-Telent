import { Component, OnInit } from '@angular/core';
import { TravelToolsService } from '../travel-tools.service';
import { Router } from '@angular/router';

@Component({
    selector: 'uni-global-travel-visa',
    templateUrl: './global-travel-visa.component.html',
    styleUrls: ['./global-travel-visa.component.scss'],
    standalone: false
})
export class GlobalTravelVisaComponent implements OnInit {
  recommendations: { id: number, question: string }[] = [
    {
      id: 1,
      question: "Select Your Nationality",
    },
    {
      id: 2,
      question: "Select the country you are looking for",
    },
    {
      id: 3,
      question: "Select your residential status of ",
    }
  ];

  residentStatus: any = [
    { value: null, label: "Select Residential Details" },
    { value: "Resident", label: "Resident" },
    { value: "Non-Resident", label: "Non-Resident" }
  ];
  activePageIndex: number = 0;
  selectedData: { [key: string]: any } = {};
  allCountries: any = [];
  invalidClass: boolean = false;
  title: string = "";
  currentUrl: string = "";
  constructor(private travelToolService: TravelToolsService, private router: Router) {
    // console.log(this.router.url,"current urlsss");
    this.currentUrl = this.router.url;
    let urls = this.currentUrl.split('/');
    let currentEndpoint = urls[urls.length - 1];
    console.log(currentEndpoint, " current link");
    if (currentEndpoint == "travel-visa") {
      this.title = "Global Travel Visa";
    } else if (currentEndpoint == "global-work-visa") {
      this.title = "Global Work Visa";
    } else if (currentEndpoint == "enterpreneur-visa") {
      this.title = "Global Entrepreneur Visa";
    } else if (currentEndpoint == "study-visa") {
      this.title = "Global Study Visa";
    }
  }

  ngOnInit(): void {
    this.getCountriesList();
    // this.getRouterName();
  }

  // getRouterName(){
  //   console.log(this.router.url,"current url");

  // }

  getCountriesList(): void {
    this.travelToolService.getCountriesList().subscribe(response => {
      this.allCountries = response;
    });
  }

  previous() {
    this.invalidClass = false;
    if (this.activePageIndex > 0) {
      this.activePageIndex--;
    }
  }

  next(productId: number) {
    if (productId in this.selectedData) {
      if (this.activePageIndex < this.recommendations.length - 1) {
        this.activePageIndex++;
      }
    } else {
      this.invalidClass = true;
    }
  }

  getRecommendation(productId: number) {

  }

  goBack() {
    switch (this.title) {
      case 'Global Travel Visa':
        this.router.navigateByUrl('/pages/travel-tools');
        break;
      case 'Global Study Visa':
        this.router.navigateByUrl('/pages/education-tools');
        break;
      case 'Global Work Visa':
        this.router.navigateByUrl('/pages/job-tool');
        break;
      case 'Global Entrepreneur Visa':
        this.router.navigateByUrl('/pages/founderstool');
        break;
      default:
        this.router.navigateByUrl('/pages/travel-tools');

    }
  }
}
