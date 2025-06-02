import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { LocationService } from 'src/app/location.service';
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
    this.locationService.getSourceByDomainName().subscribe((data: any) => {
      this.orgLogo = data.logo
      this.orgName = data.name;
    })
    this.whiteLabelName = window.location.hostname;
    if (this.whiteLabelName === "*.uniprep.ai" || this.whiteLabelName === "dev-student.uniprep.ai" || this.whiteLabelName === "uniprep.ai" || this.whiteLabelName === "localhost") {
      this.isWhiteLabelVisible = false;
    } else {
      this.isWhiteLabelVisible = true;
    }
  }

  upgradePlan(): void {
    this.closeRestrictModal.emit(false);
    this.router.navigate(["/pages/subscriptions"]);
  }

}