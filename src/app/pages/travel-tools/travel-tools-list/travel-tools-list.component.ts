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
import { RouterModule } from '@angular/router';
import { environment } from "@env/environment";
import { SharedModule } from 'src/app/shared/shared.module';
import { StorageService } from 'src/app/services/storage.service';

export interface TravelToolsMain {
  title: string,
  image: string,
  url: string,
  launch_soon: boolean,
  is_ai: boolean,
}

@Component({
  selector: 'uni-travel-tools-list',
  templateUrl: './travel-tools-list.component.html',
  styleUrls: ['./travel-tools-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    SkeletonModule,
    FluidModule,
    InputTextModule,
    TooltipModule,
    ButtonModule,
    MultiSelectModule,
    CarouselModule,
    InputGroupModule,
    InputGroupAddonModule,
    FormsModule,
    ReactiveFormsModule,
    SelectModule,
    RouterModule,
    SharedModule
  ]
})
export class TravelToolsListComponent implements OnInit {
  isLaunchingSoon = false;
  domainUrl: string = `https://${environment.domain}/uniprepapi/storage/app/public/ToolIcons/travel-tools/`;
  travelToolsList: TravelToolsMain[] = [
    {
      title: "Global Travel Visa",
      image: this.domainUrl + "GlobalTravelVisa.svg",
      url: "/pages/travel-tools/travel-visa",
      launch_soon: false,
      is_ai: false,
    },
    {
      title: "Travel Cost Estimator",
      image: this.domainUrl + "TravelCostEstimator.svg",
      url: "/pages/travel-tools/travel-cost-estimator",
      launch_soon: false,
      is_ai: true,
    },
    {
      title: "Travel Visit Planner",
      image: this.domainUrl + "TravelVisitPlanner.svg",
      url: "/pages/travel-tools/travel-visit-planner",
      launch_soon: false,
      is_ai: true,
    },
    {
      title: "Travel Packing Planner",
      image: this.domainUrl + "TravelPackingPlanner.svg",
      url: "/pages/travel-tools/travel-packing-planner",
      launch_soon: false,
      is_ai: true,
    },
    {
      title: "Trip Length Finder",
      image: this.domainUrl + "TripLengthFinder.svg",
      url: "/pages/travel-tools/trip-length-finder",
      launch_soon: false,
      is_ai: true,
    },
    {
      title: "Travel Glossary",
      image: this.domainUrl + "TravelGlossary.svg",
      url: "/pages/travel-tools/travel-glossary",
      launch_soon: false,
      is_ai: false,
    },
    {
      title: "Cost of Living Comparision",
      image: this.domainUrl + "CostOfLiving.svg",
      url: "/pages/job-tool/cost-of-living",
      launch_soon: false,
      is_ai: false,
    },
    {
      title: "TravelApply",
      image: this.domainUrl + "travelapply.svg",
      url: "/pages/job-tool/cost-of-living",
      launch_soon: true,
      is_ai: false,
    },
  ];

  loopRange = [0, 1, 2, 3, 4, 5];

  constructor(private storage: StorageService) { }

  ngOnInit(): void {
  }


  get filteredTravelTools(): any[] {
    if (this.storage.get('home_country_name') === 'India') {
      return this.travelToolsList;
    } else {
      const excludedTitles = [
        'Global Travel Visa'
      ];
      return this.travelToolsList.filter(tool => !excludedTitles.includes(tool.title));
    }
  }

}
