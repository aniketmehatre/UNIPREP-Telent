import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FounderstoolComponent } from './founderstool.component';
import { FoundersacademyComponent } from './foundersacademy/foundersacademy.component';
import { FounderstoollistComponent } from './founderstoollist/founderstoollist.component';
import { InvestorpitchtrainingComponent } from './investorpitchtraining/investorpitchtraining.component';
import { StartupglossaryComponent } from './startupglossary/startupglossary.component';
import { EntreprenuerskillmoduleComponent } from './entreprenuerskillmodule/entreprenuerskillmodule.component';
import { EntreprenuersectorproficiencyComponent } from './entreprenuersectorproficiency/entreprenuersectorproficiency.component';
import { EntreprenuerquizComponent } from './entreprenuerquiz/entreprenuerquiz.component';
import { WealthleaderslistComponent } from './wealthleaderslist/wealthleaderslist.component';
import { WealthleaderreadansComponent } from './wealthleaderreadans/wealthleaderreadans.component';
import { BusinessPlanGeneratorComponent } from './business-plan-generator/business-plan-generator.component';

const routes: Routes = [
  {
    path: '', component: FounderstoolComponent,
    children: [
      {
        path: 'foundersacademy', component: FoundersacademyComponent
      },
      {
        path: 'founderstoollist', component: FounderstoollistComponent
      },
      {
        path: 'investorpitchtraining', component: InvestorpitchtrainingComponent
      },
      {
        path: 'startupglossary', component: StartupglossaryComponent
      },
      {
        path: 'entrepreneurskillmodule', component: EntreprenuerskillmoduleComponent
      },     
       {
        path: 'entreprenuerproficiencymodule', component: EntreprenuersectorproficiencyComponent
      },     
       {
        path: ':module_name/entrpreneurquiz', component: EntreprenuerquizComponent
      },
      {
        path: 'wealthleaderslist', component: WealthleaderslistComponent
      }, 
      {
        path:'wealthleaderreadanswer/:id',component:WealthleaderreadansComponent
      },
      {
        path: 'business-plan-generator', component: BusinessPlanGeneratorComponent
      }, 
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class foundersToolRountingModule { }