import { Component, OnInit } from '@angular/core';
import { RouteListService } from '../route-list.service';
import {JsonPipe, NgForOf} from "@angular/common";

@Component({
  selector: 'app-route-list',
  templateUrl: './route-list.component.html',
  styleUrls: ['./route-list.component.scss'],
  standalone: true,
  imports: [
    NgForOf, JsonPipe
  ]
})
export class RouteListComponent implements OnInit {
  allRoutes: any[] = [];

  constructor(private routeExplorer: RouteListService) {}

  ngOnInit() {
    setTimeout(() => {
      this.allRoutes = this.routeExplorer.getAllFlattenedRoutes();
      console.log(this.allRoutes)
    }, 1000); // Wait a moment to ensure lazy routes are preloaded
  }
}
