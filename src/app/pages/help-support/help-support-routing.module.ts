import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HelpSupportComponent } from './help-support.component';
import { SupportDescriptionComponent } from './support-description/support-description.component';
import { SupportQueryComponent } from './support-query/support-query.component';
import { SupportCardComponent } from './support-card/support-card.component';

const routes: Routes = [
  {
    path: '', component: HelpSupportComponent,
    children:[
      {
        path: 'support-help', component: SupportCardComponent,
      },
      {
        path: 'description', component: SupportDescriptionComponent,
      },
      {
        path: 'query', component: SupportQueryComponent,
      },
      { path: '', redirectTo: 'support-help', pathMatch: 'full'}
    ]
    
    
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HelpSupportRoutingModule { }
