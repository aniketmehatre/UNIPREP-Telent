import { Component } from '@angular/core';

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
  openVideoPopup(link: string) {

  }
}
