import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'uni-travel-tools',
    templateUrl: './travel-tools.component.html',
    styleUrls: ['./travel-tools.component.scss'],
    standalone: true,
    imports: [ CommonModule,RouterModule]
})
export class TravelToolsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
