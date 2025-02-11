import {Component, Input, OnInit} from '@angular/core';
import {PlanService} from "../plan.service";
import {Router, RouterModule} from "@angular/router";
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';

@Component({
    selector: 'uni-restriction-dialog',
    templateUrl: './restriction-dialog.component.html',
    styleUrls: ['./restriction-dialog.component.scss'],
    standalone: true,
    imports: [CommonModule, RouterModule, DialogModule]
})
export class RestrictionDialogComponent implements OnInit {
  @Input() isWhiteLabelVisible: boolean = false
  @Input() orgName: any
  @Input() restrict: boolean = false
  @Input() planExpired: boolean = false

  constructor(private planService: PlanService, private router: Router) {}

  ngOnInit(): void {
    // this.planService.checkPlanIsExpired().subscribe((isExpired) => {
    //   this.planExpired = isExpired;
    //   this.restrict = isExpired;
    // });
  }

  upgradePlan(): void {
    this.router.navigate(["/pages/subscriptions"]);
  }

  clearRestriction(): void {
    this.restrict = false;
  }

}
