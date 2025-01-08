import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TravelToolsListComponent } from './travel-tools-list/travel-tools-list.component';
import { TravelCostEstimatorComponent } from './travel-cost-estimator/travel-cost-estimator.component';
import { TravelToolsComponent } from './travel-tools.component';
import { GlobalTravelVisaComponent } from './global-travel-visa/global-travel-visa.component';
import { TravelPackingPlannerComponent } from './travel-packing-planner/travel-packing-planner.component';
import { TravelVisitPlannerComponent } from './travel-visit-planner/travel-visit-planner.component';

const routes: Routes = [
  {
    path: '', component: TravelToolsComponent,
    children: [
      {
        path: '', component: TravelToolsListComponent
      },
      {
        path: 'travel-cost-estimator', component: TravelCostEstimatorComponent
      },
      {
        path: 'travel-visa', component: GlobalTravelVisaComponent
      },
      {
        path: 'travel-visit-planner', component: TravelVisitPlannerComponent
      },
      {
        path: 'travel-packing-planner', component: TravelPackingPlannerComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TravelToolsRoutingModule { }
