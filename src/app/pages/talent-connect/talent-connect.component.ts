import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'uni-talent-connect',
  templateUrl: './talent-connect.component.html',
  styleUrls: ['./talent-connect.component.scss']
})
export class TalentConnectComponent {
  isSkeletonVisible: boolean = false;
  ehitlabelIsShow: boolean = false;
  restrict: boolean = false;
  howItWorksVideoLink: string = '';

  constructor(private router: Router) { }
  openVideoPopup(link: string) {

  }

  navigateJobTracker() {
    this.router.navigate(['/pages/talent-connect/job-tracker']);
  }
}
