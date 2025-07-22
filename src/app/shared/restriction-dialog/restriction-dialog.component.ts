import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { LocationService } from 'src/app/services/location.service';
@Component({
  selector: 'uni-restriction-dialog',
  templateUrl: './restriction-dialog.component.html',
  styleUrls: ['./restriction-dialog.component.scss'],
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule]
})
export class RestrictionDialogComponent implements OnInit {

  @Input() isShowRestrict: boolean = false;
  @Output() closeRestrictModal: EventEmitter<boolean> = new EventEmitter<boolean>(false);

  isWhiteLabelVisible: boolean = false;
  whiteLabelName: string = '';
  orgName: string | null = '';
  orgLogo: string | null = '';

  constructor(private locationService: LocationService, private router: Router) { }

  ngOnInit() {
    this.locationService.getSourceByDomain(window.location.hostname).subscribe((data: any) => {
      this.orgLogo = data.logo
      this.orgName = data.name;
      this.whiteLabelName = data.source
      if (this.whiteLabelName === "Uniprep" ||
      this.whiteLabelName === "Partner" ) {
      this.isWhiteLabelVisible = false;
    } else {
      this.isWhiteLabelVisible = true;
    }
    })
  }

  upgradePlan(): void {
    this.closeRestrictModal.emit(false);
    this.router.navigate(["/pages/subscriptions"]);
  }

}