import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TravelToolsListComponent } from './travel-tools-list/travel-tools-list.component';
import { TravelCostEstimatorComponent } from './travel-cost-estimator/travel-cost-estimator.component';
import { TravelToolsComponent } from './travel-tools.component';
import { GlobalTravelVisaComponent } from './global-travel-visa/global-travel-visa.component';

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
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TravelToolsRoutingModule { }
