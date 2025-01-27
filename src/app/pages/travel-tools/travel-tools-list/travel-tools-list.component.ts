import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'uni-travel-tools-list',
  templateUrl: './travel-tools-list.component.html',
  styleUrls: ['./travel-tools-list.component.scss']
})
export class TravelToolsListComponent implements OnInit {
    isLaunchingSoon = false;
    travelToolsList: any[] = [
      {
        title: "Gloabal Travel Visa",
       
        image: "https://api.uniprep.ai/uniprepapi/storage/app//public/icon/modules/job-interview.svg",
        url: "/pages/travel-tools/travel-visa",
        launch_soon: false
      },
      {
        title: "Travel Cost Estimator",
       
        image: "https://api.uniprep.ai/uniprepapi/storage/app//public/icon/modules/job-interview.svg",
        url: "/pages/travel-tools/travel-cost-estimator",
        launch_soon: false
      },
      {
        title: "Travel Visit Planner",
       
        image: "https://api.uniprep.ai/uniprepapi/storage/app//public/icon/modules/job-interview.svg",
        url: "/pages/travel-tools/travel-visit-planner",
        launch_soon: false
      },
      {
        title: "Travel Packing Planner",
       
        image: "https://api.uniprep.ai/uniprepapi/storage/app//public/icon/modules/job-interview.svg",
        url: "/pages/travel-tools/travel-packing-planner",
        launch_soon: false
      },
      {
        title: "Trip Length Finder",
        image: "https://api.uniprep.ai/uniprepapi/storage/app//public/icon/modules/job-interview.svg",
        url: "/pages/travel-tools/trip-length-finder",
        launch_soon: false
      },
      {
        title: "Travel Glossary",
       
        image: "https://api.uniprep.ai/uniprepapi/storage/app//public/icon/modules/job-interview.svg",
        url: "/pages/travel-tools/travel-glossary",
        launch_soon: false
      },
      {
        title: "Cost of Living Comparision",
       
        image: "https://api.uniprep.ai/uniprepapi/storage/app//public/icon/modules/job-interview.svg",
        url: "/pages/job-tool/cost-of-living",
        launch_soon: false
      },
    ];

    loopRange = [0, 1, 2, 3, 4, 5];

  constructor() { }

  ngOnInit(): void {
  }

}
