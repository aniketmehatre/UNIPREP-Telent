import { Component, OnInit } from '@angular/core';
import { environment } from "@env/environment";

@Component({
  selector: 'uni-travel-tools-list',
  templateUrl: './travel-tools-list.component.html',
  styleUrls: ['./travel-tools-list.component.scss']
})
export class TravelToolsListComponent implements OnInit {
    isLaunchingSoon = false;
    domainUrl:string = `https://${environment.domain}/uniprepapi/storage/app/public/ToolIcons/travel-tools/`;  
    travelToolsList: any[] = [
      {
        title: "Global Travel Visa",
       
        image: this.domainUrl+"GlobalTravelVisa.svg",
        url: "/pages/travel-tools/travel-visa",
        launch_soon: true
      },
      {
        title: "Travel Cost Estimator",
       
        image: this.domainUrl+"TravelCostEstimator.svg",
        url: "/pages/travel-tools/travel-cost-estimator",
        launch_soon: true
      },
      {
        title: "Travel Visit Planner",
       
        image: this.domainUrl+"TravelVisitPlanner.svg",
        url: "/pages/travel-tools/travel-visit-planner",
        launch_soon: false
      },
      {
        title: "Travel Packing Planner",
       
        image: this.domainUrl+"TravelPackingPlanner.svg",
        url: "/pages/travel-tools/travel-packing-planner",
        launch_soon: true
      },
      {
        title: "Trip Length Finder",
        image: this.domainUrl+"TripLengthFinder.svg",
        url: "/pages/travel-tools/trip-length-finder",
        launch_soon: false
      },
      {
        title: "Travel Glossary",
       
        image: this.domainUrl+"TravelGlossary.svg",
        url: "/pages/travel-tools/travel-glossary",
        launch_soon: true
      },
      {
        title: "Cost of Living Comparision",
       
        image: this.domainUrl+"CostOfLiving.svg",
        url: "/pages/job-tool/cost-of-living",
        launch_soon: false
      },
    ];

    loopRange = [0, 1, 2, 3, 4, 5];

  constructor() { }

  ngOnInit(): void {
  }

}
