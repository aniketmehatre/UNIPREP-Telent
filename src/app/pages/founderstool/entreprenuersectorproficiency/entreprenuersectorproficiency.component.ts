import { Component, OnInit } from '@angular/core';
import { FounderstoolService } from '../founderstool.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/Auth/auth.service';
import { LocationService } from 'src/app/location.service';
import { PageFacadeService } from '../../page-facade.service';
import { CommonModule } from "@angular/common";
import { DialogModule } from "primeng/dialog";
import { StorageService } from "../../../storage.service";
@Component({
  selector: 'uni-entreprenuersectorproficiency',
  templateUrl: './entreprenuersectorproficiency.component.html',
  styleUrls: ['./entreprenuersectorproficiency.component.scss'],
  standalone: true,
  imports: [CommonModule, DialogModule, RouterModule]
})
export class EntreprenuersectorproficiencyComponent implements OnInit {
  categoryCount: number = 0;
  moduleID: number = 18;
  planExpired: boolean = false;
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
      this.authService.hasUserSubscription$.next(true);
      return;
    }
    this.storage.set('conditionrevieworquiz', '0');
    this.storage.set('entrpreneursubid', id);
    this.storage.set('submodulename', name);
    this.currentModuleSlug = "entreprenuersectorproficiencytest"
    this.router.navigate([`/pages/founderstool/${this.currentModuleSlug}/entrpreneurquiz`]);
  }
  goBack() {
    this.router.navigate(['/pages/founderstool/founderstoollist']);
  }
  checkplanExpire(): void {
    if (this.authService._userSubscrition.time_left.plan === "expired" ||
      this.authService._userSubscrition.time_left.plan === "subscription_expired") {
      this.planExpired = true;
    }
    else {
      this.planExpired = false;
    }
  }

  review(id: any) {
    this.storage.set('conditionrevieworquiz', '1')
    this.storage.set('entrpreneursubid', id)
    this.currentModuleSlug = "entreprenuersectorproficiencytest"
    this.router.navigate([`/pages/founderstool/${this.currentModuleSlug}/entrpreneurquiz`]);
  }

  openVideoPopup(videoLink: string) {
    this.pageFacade.openHowitWorksVideoPopup(videoLink);
  }
}
