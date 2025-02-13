import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PageFacadeService } from '../../page-facade.service';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { SidebarModule } from 'primeng/sidebar';
import { PdfJsViewerModule } from "ng2-pdfjs-viewer"
import { RouterModule } from '@angular/router';
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
@Component({
    selector: 'uni-carrerplannerlist',
    templateUrl: './carrerplannerlist.component.html',
    styleUrls: ['./carrerplannerlist.component.scss'],
    standalone: true,
    imports: [CommonModule,DialogModule, SidebarModule,PdfJsViewerModule, RouterModule, CardModule, PaginatorModule, FormsModule, ReactiveFormsModule, CarouselModule, ButtonModule, MultiSelectModule, SelectModule, InputGroupModule, InputTextModule, InputGroupAddonModule]
})
export class CarrerplannerlistComponent implements OnInit {
  listcreerplaner:any=[];

  constructor(private router: Router,private pageFacade: PageFacadeService,) { }

  ngOnInit(): void {
    this.listcreerplaner=[]
  }
  goToCareetPlanerSpecializations(){
    this.router.navigate(['/pages/job-tool/career-planner']);
  }
  goToCareetPlanerCountryWise(){
    this.router.navigate(['/pages/job-tool/careerplannercountrywise']);
  }
  goBackCareerTool(){
    this.router.navigate(['/pages/job-tool/careerplannercountrywise']);
  }
  openVideoPopup(videoLink: string) {
    this.pageFacade.openHowitWorksVideoPopup(videoLink);
  }
}
