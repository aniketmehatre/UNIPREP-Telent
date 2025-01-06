import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TravelCostEstimatorComponent } from './travel-cost-estimator.component';

const routes: Routes = [
  {
    path: '', component: TravelCostEstimatorComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TravelCostEstimatorRoutingModule { }
