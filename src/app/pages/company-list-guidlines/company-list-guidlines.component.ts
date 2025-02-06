import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';

@Component({
    selector: 'uni-company-list-guidlines',
    templateUrl: './company-list-guidlines.component.html',
    styleUrls: ['./company-list-guidlines.component.scss'],
    standalone: false
})
export class CompanyListGuidlinesComponent implements OnInit {

  constructor(public router:Router) { }

  ngOnInit(): void {
  }

  close(): void {
    this.router.navigate(["/pages/company-list"]);
  }

}
