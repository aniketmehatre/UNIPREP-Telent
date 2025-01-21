import { Component, OnInit } from '@angular/core';
import { PageFacadeService } from '../../page-facade.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Auth/auth.service';
import { LocationService } from 'src/app/location.service';
import { FoundersToolsData } from './founders-tool-list-data';

@Component({
  selector: 'uni-founderstoollist',
  templateUrl: './founderstoollist.component.html',
  styleUrls: ['./founderstoollist.component.scss']
})
export class FounderstoollistComponent implements OnInit {
  founderToolsList = FoundersToolsData;
  ehitlabelIsShow: boolean = true;
  imagewhitlabeldomainname: any
  orgnamewhitlabel: any;
  orglogowhitelabel: any;
  restrict: boolean = false;
  planExpired: boolean = false;

  constructor(  private pageFacade: PageFacadeService, private router:Router,private locationService: LocationService, private authService: AuthService,) { }

  ngOnInit(): void {
    this.checkplanExpire()
    this.locationService.getImage().subscribe(imageUrl => {
      this.orglogowhitelabel = imageUrl;
    });
    this.locationService.getOrgName().subscribe(orgname => {
      this.orgnamewhitlabel = orgname;
    });
    this.imagewhitlabeldomainname = window.location.hostname;
    if (this.imagewhitlabeldomainname === "dev-student.uniprep.ai" || this.imagewhitlabeldomainname === "uniprep.ai" || this.imagewhitlabeldomainname === "localhost") {
      this.ehitlabelIsShow = true;
    } else {
      this.ehitlabelIsShow = false;
    }
  }
  openVideoPopup(videoLink: string) {
    this.pageFacade.openHowitWorksVideoPopup(videoLink);
  }
  openAcademy(){
    if (this.planExpired) {
      this.restrict = true;
      return;
    }
    this.router.navigate(['/pages/founderstool/foundersacademy']);
  }
  openInvestorTraining(){
    if (this.planExpired) {
      this.restrict = true;
      return;
    }
    this.router.navigate(['/pages/founderstool/investorpitchtraining']);
  }
  openStartUpGlossary(){
    if (this.planExpired) {
      this.restrict = true;
      return;
    }
    this.router.navigate(['/pages/founderstool/startupglossary']);
  }
  openEntreprenuerSkill(){
    if (this.planExpired) {
      this.restrict = true;
      return;
    }
    this.router.navigate(['/pages/founderstool/entrepreneurskillmodule']);
  }
  openEntreprenuerSector(){
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

  openInvestorList(){
    this.router.navigate(['/pages/investor-list']);
  }

  checkplanExpire(): void {
    this.authService.getNewUserTimeLeft().subscribe((res) => {
      let data = res.time_left;
      let subscription_exists_status = res.subscription_details;
      if (data.plan === "expired" || data.plan === 'subscription_expired'  ||   subscription_exists_status.subscription_plan=="Student"  ||   subscription_exists_status.subscription_plan == "Career") {
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

  navigateSubModule(url:string) {
    // if (this.planExpired) {
    //   this.restrict = true;
    //   return;
    // }
    this.router.navigateByUrl(url);
  }
}
