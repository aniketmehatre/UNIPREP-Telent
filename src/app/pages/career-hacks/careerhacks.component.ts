import { Component, Input, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { DialogModule } from "primeng/dialog";
import { CardModule } from 'primeng/card';
import { PaginatorModule } from 'primeng/paginator';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { CHCountryListsComponent } from "./career-countries/careercountries.component";
import { CareerListsComponent } from "./career-lists/careerlists.component";
import { CareerJobHacksService } from "./careerhacks.service";
import { PageFacadeService } from "../page-facade.service";

@Component({
  selector: "uni-career-hacks",
  templateUrl: "./careerhacks.component.html",
  standalone: true,
  imports: [
    RouterModule, 
    DialogModule, 
    CommonModule,
    CardModule,
    PaginatorModule,
    FormsModule,
    ReactiveFormsModule,
    CarouselModule,
    ButtonModule,
    MultiSelectModule,
    SelectModule,
    InputGroupModule,
    InputTextModule,
    InputGroupAddonModule,
    CHCountryListsComponent,
    CareerListsComponent
  ],
  providers: [
    CareerJobHacksService,
    PageFacadeService
  ]
})
export class CareerhacksComponent implements OnInit {
  @Input() prepData: any = {};
  componentswitch: number = 1;

  ngOnInit(): void {
    if (!this.componentswitch) {
      this.componentswitch = 1;
    }
  }

  windowChange(data: any) {
    if (data && typeof data.stage === 'number') {
      this.prepData = { ...this.prepData, ...data };
      this.componentswitch = data.stage;
    }
  }
}
