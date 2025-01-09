import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TravelToolsRoutingModule } from './travel-tools-routing.module';
import { TooltipModule } from 'primeng/tooltip';
import { CarouselModule } from 'primeng/carousel';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TravelCostEstimatorComponent } from './travel-cost-estimator/travel-cost-estimator.component';
import { TravelToolsListComponent } from './travel-tools-list/travel-tools-list.component';
import { TravelToolsComponent } from './travel-tools.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { GlobalTravelVisaComponent } from './global-travel-visa/global-travel-visa.component';
import { TravelPackingPlannerComponent } from './travel-packing-planner/travel-packing-planner.component';
import { TravelVisitPlannerComponent } from './travel-visit-planner/travel-visit-planner.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { TripLengthFinderComponent } from './trip-length-finder/trip-length-finder.component';
import { TravelGlossaryComponent } from './travel-glossary/travel-glossary.component';

@NgModule({
  declarations: [
    TravelToolsComponent, 
    TravelCostEstimatorComponent, 
    TravelToolsListComponent, 
    GlobalTravelVisaComponent, 
    TravelPackingPlannerComponent, 
    TravelVisitPlannerComponent, 
    TripLengthFinderComponent, 
    TravelGlossaryComponent
  ],
  imports: [
    CommonModule,
    TravelToolsRoutingModule,
    FormsModule,
    TooltipModule,
    CarouselModule,
    ButtonModule,
    DropdownModule,
    InputTextModule,
    InputNumberModule,
    MultiSelectModule
  ]
})
export class TravelToolsModule { }
