import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from "../../data.service";
import { CommonModule, Location } from "@angular/common";
import { PageFacadeService } from '../page-facade.service';
import { AuthService } from "src/app/Auth/auth.service";
import { DialogModule } from 'primeng/dialog';
import { RouterModule } from '@angular/router';
import { StorageService } from "../../storage.service";
import { RestrictionDialogComponent } from 'src/app/shared/restriction-dialog/restriction-dialog.component';
@Component({
  selector: 'uni-job-search',
  templateUrl: './job-search.component.html',
  styleUrls: ['./job-search.component.scss'],
  standalone: true,
  imports: [CommonModule, DialogModule, RouterModule, RestrictionDialogComponent],
})

export class JobSearchComponent implements OnInit {

  currentEndpoint: string = 'Job-listing';

  constructor(private router: Router, private _location: Location, private storage: StorageService,
    private route: ActivatedRoute, private authService: AuthService, private dataService: DataService,
    private pageFacade: PageFacadeService,) {
    this.route.params.subscribe(params => {
      const url = this.router.url;
      const urlSegments = url.split('/');
      this.currentEndpoint = urlSegments[urlSegments.length - 1];
    });
  }

  ngOnInit(): void {
    this.getCurrentEndpoint();
    this.checkplanExpire();
    this.dataService.jobGroupButtonHandled$.subscribe((data) => {
      this.currentEndpoint = data;
    });
  }
  planExpired: boolean = false;
  restrict: boolean = false;
  ehitlabelIsShow: boolean = true;
  orgnamewhitlabel: any;
  orglogowhitelabel: any;
  imagewhitlabeldomainname: any
  getCurrentEndpoint(): void {
    const url = this.router.url;
    const urlSegments = url.split('/');
    this.currentEndpoint = urlSegments[urlSegments.length - 1];

    // console.log('Current Endpoint:', this.currentEndpoint);
  }

  headerMenuClick(menuName: string) {
    if (this.planExpired) {
      this.restrict = true;
      return;
    }
    this.currentEndpoint = menuName
    this.dataService.setJobGroupButtonHandled(this.currentEndpoint)
    if (this.currentEndpoint == "job-search" || this.currentEndpoint == 'job-listing') {
      if (this.getFilterData()) {
        this.router.navigate(['/pages/job-portal/job-listing']);
        return
      }
      this.router.navigate(['/pages/job-portal/job-search']);
    } else if (this.currentEndpoint == "job-tracker") {
      this.router.navigate(['/pages/job-portal/job-tracker']);
    }
    // else if(menuName == "cv-builder"){
    //   this.router.navigate(['/pages/job-portal/cv-builder']);
    // }else if(menuName == "coverletter-builder"){
    //   this.router.navigate(['/pages/job-portal/coverletter-builder']);
    // }
  }

  onClickAddManually() {
    this.dataService.changeManualAdd(true)
  }

  getFilterData(): any {
    const storedData = this.storage.get('filterFormData');
    if (storedData) {
      return JSON.parse(storedData);
    }
    return null;
  }

  goBack() {
    this._location.back()
  }


  openVideoPopup(videoLink: string) {
    this.pageFacade.openHowitWorksVideoPopup(videoLink);
  }
  checkplanExpire(): void {
    this.authService.getNewUserTimeLeft().subscribe((res) => {
      let data = res.time_left;
      let subscription_exists_status = res.subscription_details;
      if (data.plan === "expired" || data.plan === 'subscription_expired' || subscription_exists_status.subscription_plan == "Student") {
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
}
