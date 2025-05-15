import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TravelToolsComponent } from './travel-tools.component';

const routes: Routes = [
  {
    path: '',
    component: TravelToolsComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./travel-tools-list/travel-tools-list.component').then(m => m.TravelToolsListComponent)
      },
      {
        path: 'travel-cost-estimator',
        loadComponent: () => import('./travel-cost-estimator/travel-cost-estimator.component').then(m => m.TravelCostEstimatorComponent)
      },
      {
        path: 'travel-visa',
        loadComponent: () => import('./global-travel-visa/global-travel-visa.component').then(m => m.GlobalTravelVisaComponent)
      },
      {
        path: 'travel-visa/:countryId/:questionId',
        loadComponent: () => import('./global-travel-visa/global-travel-visa.component').then(m => m.GlobalTravelVisaComponent)
      },
      {
        path: 'travel-visit-planner',
        loadComponent: () => import('./travel-visit-planner/travel-visit-planner.component').then(m => m.TravelVisitPlannerComponent)
      },
      {
        path: 'travel-packing-planner',
        loadComponent: () => import('./travel-packing-planner/travel-packing-planner.component').then(m => m.TravelPackingPlannerComponent)
      },
      {
        path: 'trip-length-finder',
        loadComponent: () => import('./trip-length-finder/trip-length-finder.component').then(m => m.TripLengthFinderComponent)
      },
      {
        path: 'travel-glossary',
        loadComponent: () => import('./travel-glossary/travel-glossary.component').then(m => m.TravelGlossaryComponent)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TravelToolsRoutingModule { }
