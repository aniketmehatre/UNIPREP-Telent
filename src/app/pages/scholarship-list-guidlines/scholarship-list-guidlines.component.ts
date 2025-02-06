import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'uni-scholarship-list-guidlines',
    templateUrl: './scholarship-list-guidlines.component.html',
    styleUrls: ['./scholarship-list-guidlines.component.scss'],
    standalone: false
})
export class ScholarshipListGuidlinesComponent implements OnInit {

  constructor(public router: Router) { }

  ngOnInit(): void {
  }

  close(): void {
    this.router.navigate(["/pages/scholarship-list"]);
  }

}
