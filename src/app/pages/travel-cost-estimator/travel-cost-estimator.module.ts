import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TravelCostEstimatorRoutingModule } from './travel-cost-estimator-routing.module';
import { TravelCostEstimatorComponent } from './travel-cost-estimator.component';
import { TooltipModule } from 'primeng/tooltip';
import { CarouselModule } from 'primeng/carousel';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';


@NgModule({
  declarations: [
    TravelCostEstimatorComponent
  ],
  imports: [
    CommonModule,
    TravelCostEstimatorRoutingModule,
    FormsModule,
    TooltipModule,
    CarouselModule,
    ButtonModule,
    DropdownModule,
    InputTextModule
  ]
})
export class TravelCostEstimatorModule { }
