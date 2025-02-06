import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'uni-investor-list-guidlines',
    templateUrl: './investor-list-guidlines.component.html',
    styleUrls: ['./investor-list-guidlines.component.scss'],
    standalone: false
})
export class InvestorListGuidlinesComponent implements OnInit {

  constructor(public router: Router) { }

  ngOnInit(): void {
  }

  close(): void {
    this.router.navigate(["/pages/investor-list"]);
  }

}
