import { Component, OnInit } from '@angular/core';
import { TravelToolsService } from '../travel-tools.service';

@Component({
  selector: 'uni-global-travel-visa',
  templateUrl: './global-travel-visa.component.html',
  styleUrls: ['./global-travel-visa.component.scss']
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
    { value : "Resident" },
    { value : "Non-Resident"}
  ];
  activePageIndex: number = 0;
  selectedData: { [key: string]: any } = {};
  allCountries: any = [];
  invalidClass: boolean = false;
  constructor(private travelToolService: TravelToolsService) { }

  ngOnInit(): void {
    this.getCountriesList();
  }

  getCountriesList(): void{
    this.travelToolService.getCountriesList().subscribe( response => {
      this.allCountries = response;
      console.log(response);
    });
  }

  previous(){
    this.invalidClass = false;
    if (this.activePageIndex > 0) {
      this.activePageIndex--;
    }
  }

  next(productId: number){
    if (productId in this.selectedData) {
      if (this.activePageIndex < this.recommendations.length - 1) {
        this.activePageIndex++;
      }
    } else {
      this.invalidClass = true;
    }
  }

  getRecommendation(productId: number){

  }
}
