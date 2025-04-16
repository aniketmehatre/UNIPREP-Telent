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

  EducationToolsList = EducationToolsData;
  isLaunchingSoon: true;
  constructor() { }

  ngOnInit(): void {
  }

}
