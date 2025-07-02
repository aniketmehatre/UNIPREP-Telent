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
@Component({
  selector: 'uni-founderstoollist',
  templateUrl: './founderstoollist.component.html',
  styleUrls: ['./founderstoollist.component.scss'],
  standalone: true,
  imports: [CommonModule, DialogModule, RouterModule, SharedModule]
})
export class FounderstoollistComponent implements OnInit {
  founderToolsList = FoundersToolsData;
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
  openAcademy() {
    if (this.planExpired) {
      this.authService.hasUserSubscription$.next(true);
      return;
    }
    this.router.navigate(['/pages/founderstool/foundersacademy']);
  }
  openInvestorTraining() {
    if (this.planExpired) {
      this.authService.hasUserSubscription$.next(true);
      return;
    }
    this.router.navigate(['/pages/founderstool/investorpitchtraining']);
  }
  openStartUpGlossary() {
    if (this.planExpired) {
      this.authService.hasUserSubscription$.next(true);
      return;
    }
    this.router.navigate(['/pages/founderstool/startupglossary']);
  }
  openEntreprenuerSkill() {
    if (this.planExpired) {
      this.authService.hasUserSubscription$.next(true);
      return;
    }
    this.router.navigate(['/pages/founderstool/entrepreneurskillmodule']);
  }
  openEntreprenuerSector() {
    if (this.planExpired) {
      this.authService.hasUserSubscription$.next(true);
      return;
    }
    this.router.navigate(['/pages/founderstool/entreprenuerproficiencymodule']);
  }

  openGovernmentFundsOpportunity() {
    if (this.planExpired) {
      this.authService.hasUserSubscription$.next(true);
      return;
    }
    this.router.navigate(['/pages/founderstool/governmentfunds']);
  }

  openMarketingAnaylsis() {
    if (this.planExpired) {
      this.authService.hasUserSubscription$.next(true);
      return;
    }
    this.router.navigate(['/pages/founderstool/marketing-anaylsis']);
  }

  openInvestorList() {
    this.router.navigate(['/pages/investor-list']);
  }

  checkplanExpire(): void {
    if (this.authService._userSubscrition.time_left.plan === "expired" ||
      this.authService._userSubscrition.time_left.plan === "subscription_expired" ||
      this.authService._userSubscrition.subscription_details.subscription_plan === "Student" ||
      this.authService._userSubscrition.subscription_details.subscription_plan === "Career") {
      this.planExpired = true;
    }
    else {
      this.planExpired = false;
    }
  }

  navigateSubModule(url: string, launch_soon: any) {
    if (launch_soon) {
      return launch_soon;
    }
    this.router.navigateByUrl(url);
  }
}
