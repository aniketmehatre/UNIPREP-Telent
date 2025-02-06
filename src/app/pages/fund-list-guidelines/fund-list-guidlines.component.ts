import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'uni-fund-list-guidlines',
    templateUrl: './fund-list-guidlines.component.html',
    styleUrls: ['./fund-list-guidlines.component.scss'],
    standalone: false
})
export class FundListGuidlinesComponent implements OnInit {

  constructor(public router: Router) { }

  ngOnInit(): void {
  }

  close(): void {
    this.router.navigate(["/pages/founderstool/governmentfunds"]);
  }

}
