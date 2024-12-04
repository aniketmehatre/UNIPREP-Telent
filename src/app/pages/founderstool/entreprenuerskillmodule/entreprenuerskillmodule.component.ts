import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { FounderstoolService } from '../founderstool.service';
import { AuthService } from 'src/app/Auth/auth.service';
import { LocationService } from 'src/app/location.service';
import { PageFacadeService } from '../../page-facade.service';

@Component({
  selector: 'uni-entreprenuerskillmodule',
  templateUrl: './entreprenuerskillmodule.component.html',
  styleUrls: ['./entreprenuerskillmodule.component.scss']
})
export class EntreprenuerskillmoduleComponent implements OnInit {
  categoryCount:number=0;
  moduleID:number=17;
  planExpired: boolean = false;
  restrict: boolean = false;
  orgnamewhitlabel:any;
  orglogowhitelabel:any;
  imagewhitlabeldomainname:any
  ehitlabelIsShow:boolean=true;
  currentModuleSlug:any;
  constructor(private service: FounderstoolService,private sanitizer: DomSanitizer,private router:Router, private authService: AuthService,
    private locationService: LocationService,private pageFacade: PageFacadeService
  ) { }
  ngOnInit(): void {
    this.locationService.getImage().subscribe(imageUrl => {
      this.orglogowhitelabel = imageUrl;
    });
    this.locationService.getOrgName().subscribe(orgname => {
      this.orgnamewhitlabel = orgname;
    });
  this.imagewhitlabeldomainname=window.location.hostname;
  if (this.imagewhitlabeldomainname === "dev-student.uniprep.ai" || this.imagewhitlabeldomainname === "uniprep.ai" || this.imagewhitlabeldomainname === "localhost") {
    this.ehitlabelIsShow=true;
  }else{
    this.ehitlabelIsShow=false;
  }
    var data={
      page:1,
      perpage:10000,
      module_id :this.moduleID
    }
    this.getEntreprenuer(data);
    this.checkplanExpire()
  }
  etreprenuertestlists: any[] = [];
  getEntreprenuer(data:any){
    this.service.getEntreprenuerTest(data).subscribe((response) => {
      this.etreprenuertestlists = [];
      this.etreprenuertestlists = response.data;
      this.categoryCount = response.count;
    });
  }
  openQuiz(id:any,name:string){
    if(this.planExpired){
      this.restrict=true;
      return;
    }
    localStorage.setItem('conditionrevieworquiz','0')
    localStorage.setItem('entrpreneursubid',id)
    localStorage.setItem('submodulename',name);
    this.currentModuleSlug = "Entreprenuer Skill Test"
    this.router.navigate([`/pages/founderstool/${this.currentModuleSlug}/entrpreneurquiz`]);
  }
  goBack(){
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
  review(id:any){
    localStorage.setItem('conditionrevieworquiz','1')
    localStorage.setItem('entrpreneursubid',id)
    this.currentModuleSlug = "Entreprenuer Skill Test"
    console.log(localStorage.getItem("entrpreneursubid"));
    console.log(localStorage.getItem("conditionrevieworquiz"));
    
    this.router.navigate([`/pages/founderstool/${this.currentModuleSlug}/entrpreneurquiz`]);  
  }

  openVideoPopup(videoLink: string) {
    this.pageFacade.openHowitWorksVideoPopup(videoLink);
  }
}
