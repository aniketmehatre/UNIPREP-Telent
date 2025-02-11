import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { CarouselModule } from 'primeng/carousel';
import { PaginatorModule } from 'primeng/paginator';
import { FluidModule } from 'primeng/fluid';
@Component({
    selector: 'uni-education-tools',
    templateUrl: './education-tools.component.html',
    styleUrls: ['./education-tools.component.scss'],
    standalone: true,
    imports: [CommonModule, RouterModule, ButtonModule, SkeletonModule, CarouselModule, PaginatorModule, FluidModule]
})
export class EducationToolsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
