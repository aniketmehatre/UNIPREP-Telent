import {Component, Input, OnInit} from '@angular/core';
import {PlanService} from "../plan.service";
import {Router} from "@angular/router";

@Component({
    selector: 'uni-restriction-dialog',
    templateUrl: './restriction-dialog.component.html',
    styleUrls: ['./restriction-dialog.component.scss'],
    standalone: false
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
