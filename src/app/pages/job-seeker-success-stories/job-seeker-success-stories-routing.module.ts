import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { JobSeekersComponent } from "./job-seeker-success-stories.component";
import { SeekerListsComponent } from "./job-seeker-success-stories-lists/seekerlists.component";
import { SeekercountriesComponent } from "./job-seeker-success-stories-countries/seekercountries.component";

const routes: Routes = [
  {
    path: '', component: JobSeekersComponent,
    children: [
      { path: 'lists', component: SeekerListsComponent },
      { path: 'countrylist', component: SeekercountriesComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobSeekerRoutingModule { }
