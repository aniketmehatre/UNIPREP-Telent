import { Component, inject, Input, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { DialogModule } from 'primeng/dialog';
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
import { SalaryhacksCountryListsComponent } from "./salary-hack-countries/salaryhackcountries.component";
import { SalaryhacksListsComponent } from "./salaryhackslists/salaryhackslists.component";
import { MessageService } from 'primeng/api';
import { AuthService } from "src/app/Auth/auth.service";
import { PageFacadeService } from "../page-facade.service";
import { SalaryHacksService } from "./salaryhacks.service";

@Component({
  selector: "uni-salary-hacks",
  templateUrl: "./salaryhacks.component.html",
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    DialogModule,
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
    SalaryhacksCountryListsComponent,
    SalaryhacksListsComponent
  ],
  providers: [
    MessageService,
    PageFacadeService,
    SalaryHacksService
  ]
})
export class SalaryhacksComponent implements OnInit {
  @Input() prepData: any = {};
  componentswitch: number = 1;
  route = inject(ActivatedRoute);

  ngOnInit(): void {
    const countryId = this.route.snapshot.paramMap.get('countryId');
    const questionId = this.route.snapshot.paramMap.get('questionId');
    if (questionId) {
      this.prepData = {
        country_id: countryId,
        question_id: questionId,
        countryName: ''
      }
      this.componentswitch = 2;
    }
    // Initialize with default value if not set
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
