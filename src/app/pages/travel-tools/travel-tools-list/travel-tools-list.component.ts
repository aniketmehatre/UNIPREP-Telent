import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';
import { FluidModule } from 'primeng/fluid';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
import { CarouselModule } from 'primeng/carousel';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';


@Component({
    selector: 'uni-travel-tools-list',
    templateUrl: './travel-tools-list.component.html',
    styleUrls: ['./travel-tools-list.component.scss'],
    standalone: true,
    imports: [CommonModule,SkeletonModule,FluidModule,InputTextModule,TooltipModule,ButtonModule,MultiSelectModule,CarouselModule,InputGroupModule,InputGroupAddonModule,FormsModule,ReactiveFormsModule,InputTextModule,SelectModule]
})
export class TravelToolsListComponent implements OnInit {
    isLaunchingSoon = false;
    travelToolsList: any[] = [
      {
        title: "Global Travel Visa",
       
        image: "https://api.uniprep.ai/uniprepapi/storage/app//public/icon/modules/job-interview.svg",
        url: "/pages/travel-tools/travel-visa",
        launch_soon: true
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
