import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, RouterModule } from '@angular/router';
import { FounderstoolService } from '../founderstool.service';
import { AuthService } from 'src/app/Auth/auth.service';
import { LocationService } from 'src/app/location.service';
import { PageFacadeService } from '../../page-facade.service';
import { CommonModule } from "@angular/common";
import { DialogModule } from "primeng/dialog";
import { StorageService } from "../../../storage.service";
import { RestrictionDialogComponent } from 'src/app/shared/restriction-dialog/restriction-dialog.component';
@Component({
  selector: 'uni-entreprenuerskillmodule',
  templateUrl: './entreprenuerskillmodule.component.html',
  styleUrls: ['./entreprenuerskillmodule.component.scss'],
  standalone: true,
  imports: [CommonModule, DialogModule, RouterModule, RestrictionDialogComponent]
})
export class EntreprenuerskillmoduleComponent implements OnInit {
  categoryCount: number = 0;
  moduleID: number = 17;
  planExpired: boolean = false;
  restrict: boolean = false;
  orgnamewhitlabel: any;
  orglogowhitelabel: any;
  imagewhitlabeldomainname: any
  ehitlabelIsShow: boolean = true;
  currentModuleSlug: any;
  constructor(private service: FounderstoolService, private sanitizer: DomSanitizer, private router: Router, private authService: AuthService,
    private locationService: LocationService, private pageFacade: PageFacadeService, private storage: StorageService
  ) { }
  ngOnInit(): void {

    var data = {
      page: 1,
      perpage: 10000,
      module_id: this.moduleID
    }
    this.getEntreprenuer(data);
    this.checkplanExpire()
  }
  etreprenuertestlists: any[] = [];
  getEntreprenuer(data: any) {
    this.service.getEntreprenuerTest(data).subscribe((response) => {
      this.etreprenuertestlists = [];
      this.etreprenuertestlists = response.data;
      this.categoryCount = response.count;
    });
  }
  openQuiz(id: any, name: string) {
    if (this.planExpired) {
      this.restrict = true;
      return;
    }
    this.storage.set('conditionrevieworquiz', '0')
    this.storage.set('entrpreneursubid', id)
    this.storage.set('submodulename', name);
    this.currentModuleSlug = "Entreprenuer Skill Test"
    this.router.navigate([`/pages/founderstool/${this.currentModuleSlug}/entrpreneurquiz`]);
  }
  goBack() {
    this.router.navigate(['/pages/founderstool/founderstoollist']);
  }
  checkplanExpire(): void {
    this.authService.getNewUserTimeLeft().subscribe((res) => {
      let data = res.time_left;
      let subscription_exists_status = res.subscription_details;
      if (data.plan === "expired" || data.plan === 'subscription_expired') {
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
  review(id: any) {
    this.storage.set('conditionrevieworquiz', '1')
    this.storage.set('entrpreneursubid', id)
    this.currentModuleSlug = "Entreprenuer Skill Test"
    this.router.navigate([`/pages/founderstool/${this.currentModuleSlug}/entrpreneurquiz`]);
  }

  openVideoPopup(videoLink: string) {
    this.pageFacade.openHowitWorksVideoPopup(videoLink);
  }
}
