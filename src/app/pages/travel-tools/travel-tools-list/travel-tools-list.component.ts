import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'uni-travel-tools-list',
  templateUrl: './travel-tools-list.component.html',
  styleUrls: ['./travel-tools-list.component.scss']
})
export class TravelToolsListComponent implements OnInit {

    travelToolsList: any[] = [
      {
        title: "Gloabal Travel Visa",
        description:'This tool lets you get a global travel visa with the help of few easy steps',
        image: "https://api.uniprep.ai/uniprepapi/storage/app//public/icon/modules/job-interview.svg",
        url: "/pages/travel-tools/travel-visa",
      },
      {
        title: "Travel Cost Estimator",
        description:'This tool lets you get a global travel visa with the help of few easy steps',
        image: "https://api.uniprep.ai/uniprepapi/storage/app//public/icon/modules/job-interview.svg",
        url: "/pages/travel-tools/travel-cost-estimator",
      },
      {
        title: "Travel Visit Planner",
        description:'This tool lets you get a global travel visa with the help of few easy steps',
        image: "https://api.uniprep.ai/uniprepapi/storage/app//public/icon/modules/job-interview.svg",
        url: "/pages/travel-tools/travel-visit-planner",
      },
      {
        title: "Travel Packing Planner",
        description:'This tool lets you get a global travel visa with the help of few easy steps',
        image: "https://api.uniprep.ai/uniprepapi/storage/app//public/icon/modules/job-interview.svg",
        url: "/pages/travel-tools/travel-packing-planner",
      },
      {
        title: "Trip Length Finder",
        description:'This tool lets you get a global travel visa with the help of few easy steps',
        image: "https://api.uniprep.ai/uniprepapi/storage/app//public/icon/modules/job-interview.svg",
        url: "/pages/travel-tools/travel-cost-estimator",
      },
      {
        title: "Travel Glossary",
        description:'This tool lets you get a global travel visa with the help of few easy steps',
        image: "https://api.uniprep.ai/uniprepapi/storage/app//public/icon/modules/job-interview.svg",
        url: "/pages/travel-tools/travel-cost-estimator",
      },
    ];

    loopRange = [0, 1, 2, 3, 4, 5];

  constructor() { }

  ngOnInit(): void {
  }

}
