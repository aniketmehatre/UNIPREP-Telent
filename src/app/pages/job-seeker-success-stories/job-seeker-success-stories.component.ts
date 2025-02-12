import { Component, Input, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { SeekercountriesComponent } from "./job-seeker-success-stories-countries/seekercountries.component";
import { SeekerListsComponent } from "./job-seeker-success-stories-lists/seekerlists.component";

@Component({
  selector: "uni-job-seeker-success-stories",
  templateUrl: "./job-seeker-success-stories.component.html",
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule,
    SeekercountriesComponent,
    SeekerListsComponent
  ],
})
export class JobSeekersComponent implements OnInit {
  @Input() prepData: any;
  componentswitch = 1;

  ngOnInit(): void {
    console.log('JobSeekersComponent initialized');
  }

  windowChange(data: any) {
    console.log('Window change event:', data);
    this.prepData = data;
    this.componentswitch = data.stage;
  }
}
