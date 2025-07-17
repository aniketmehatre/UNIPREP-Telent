import { Component, OnInit } from '@angular/core';
import { EducationToolsData } from './education-tools-list-data';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { CarouselModule } from 'primeng/carousel';
import { PaginatorModule } from 'primeng/paginator';
import { FluidModule } from 'primeng/fluid';
import { SharedModule } from 'src/app/shared/shared.module';
import { StorageService } from 'src/app/services/storage.service';
@Component({
  selector: 'uni-education-tools-list',
  templateUrl: './education-tools-list.component.html',
  styleUrls: ['./education-tools-list.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule, SkeletonModule, CarouselModule, PaginatorModule, FluidModule,
    SharedModule
  ]
})
export class EducationToolsListComponent implements OnInit {

  educationToolsList = EducationToolsData;
  
  constructor(private storage: StorageService) { }

  ngOnInit(): void {
  }

  get filteredEducationTools(): any[] {
    if (this.storage.get('home_country_name') === 'India') {
      return this.educationToolsList;
    } else {
      const excludedTitles = [
        'UNILOAN',
        'Executive Education',
        'Distance Learning Education'
      ];
      return this.educationToolsList.filter(tool => !excludedTitles.includes(tool.title));
    }
  }
}
