import { Component, OnInit } from '@angular/core';
import { PageFacadeService } from '../../page-facade.service';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/Auth/auth.service';
import { LocationService } from 'src/app/location.service';
import { FoundersToolsData } from './founders-tool-list-data';
import { CommonModule } from "@angular/common";
import { DialogModule } from "primeng/dialog";
import { SharedModule } from 'src/app/shared/shared.module';
import { StorageService } from 'src/app/storage.service';
import { RestrictionDialogComponent } from 'src/app/shared/restriction-dialog/restriction-dialog.component';
@Component({
  selector: 'uni-founderstoollist',
  templateUrl: './founderstoollist.component.html',
  styleUrls: ['./founderstoollist.component.scss'],
  standalone: true,
  imports: [CommonModule, DialogModule, RouterModule, SharedModule, RestrictionDialogComponent]
})
export class FounderstoollistComponent implements OnInit {
  founderToolsList = FoundersToolsData;
  ehitlabelIsShow: boolean = true;
  imagewhitlabeldomainname: any
  orgnamewhitlabel: any;
  orglogowhitelabel: any;
  restrict: boolean = false;
  planExpired: boolean = false;

  constructor(private pageFacade: PageFacadeService, private router: Router, private locationService: LocationService,
    private storage: StorageService, private authService: AuthService,) { }

  ngOnInit(): void {
    this.checkplanExpire()
  }

  get filteredFoundersTool(): any[] {
    if (this.storage.get('home_country_name') === 'India') {
      return this.founderToolsList;
    } else {
      const excludedTitles = [
        'Global Entrepreneur Visa'
      ];
      return this.founderToolsList.filter(tool => !excludedTitles.includes(tool.title));
    }
  }
  openVideoPopup(videoLink: string) {
    this.pageFacade.openHowitWorksVideoPopup(videoLink);
  }
  openAcademy() {
    if (this.planExpired) {
      this.restrict = true;
      return;
    }
    this.router.navigate(['/pages/founderstool/foundersacademy']);
  }
  openInvestorTraining() {
    if (this.planExpired) {
      this.restrict = true;
      return;
    }
    this.router.navigate(['/pages/founderstool/investorpitchtraining']);
  }
  openStartUpGlossary() {
    if (this.planExpired) {
      this.restrict = true;
      return;
    }
    this.router.navigate(['/pages/founderstool/startupglossary']);
  }
  openEntreprenuerSkill() {
    if (this.planExpired) {
      this.restrict = true;
      return;
    }
    this.router.navigate(['/pages/founderstool/entrepreneurskillmodule']);
  }
  openEntreprenuerSector() {
    if (this.planExpired) {
      this.restrict = true;
      return;
    }
    this.router.navigate(['/pages/founderstool/entreprenuerproficiencymodule']);
  }

  openGovernmentFundsOpportunity() {
    if (this.planExpired) {
      this.restrict = true;
      return;
    }
    this.router.navigate(['/pages/founderstool/governmentfunds']);
  }

  openMarketingAnaylsis() {
    if (this.planExpired) {
      this.restrict = true;
      return;
    }
    this.router.navigate(['/pages/founderstool/marketing-anaylsis']);
  }

  openInvestorList() {
    this.router.navigate(['/pages/investor-list']);
  }

  checkplanExpire(): void {
    this.authService.getNewUserTimeLeft().subscribe((res) => {
      let data = res.time_left;
      let subscription_exists_status = res.subscription_details;
      if (data.plan === "expired" || data.plan === 'subscription_expired' || subscription_exists_status.subscription_plan == "Student" || subscription_exists_status.subscription_plan == "Career") {
        this.planExpired = true;
      } else {
        this.planExpired = false;
      }
    })
  }
  upgradePlan(): void {
    this.router.navigate(["/pages/subscriptions"]);
  }
  clearRestriction() {
    this.restrict = false;
  }

  navigateSubModule(url: string, launch_soon: any) {
    if (launch_soon) {
      return launch_soon;
    }
    // if (this.planExpired) {
    //   this.restrict = true;
    //   return;
    // }
    this.router.navigateByUrl(url);
  }
}
