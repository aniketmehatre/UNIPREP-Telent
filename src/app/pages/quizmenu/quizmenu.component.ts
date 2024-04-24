import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModuleServiceService } from '../module-store/module-service.service';
import { LocationService } from 'src/app/location.service';
import { DataService } from 'src/app/data.service';
import { AuthService } from 'src/app/Auth/auth.service';
@Component({
  selector: 'uni-quizmenu',
  templateUrl: './quizmenu.component.html',
  styleUrls: ['./quizmenu.component.scss'],
})
export class QuizmenuComponent implements OnInit {
  tooltip: any;
  currentModuleSlug: any;
  filterUniversityList: any[] = [];
  quizpercentagedata: any[] = []
  countryId: any;
  countryName!: string;
  universityId: any=null;
  universityquizbutton: boolean = true;
  restrict: boolean = false;
  planExpired: boolean = false;
  constructor(private moduleListService: ModuleServiceService, private router: Router, private dataService: DataService,
    private locationService: LocationService,private authService: AuthService) { }

  ngOnInit(): void {
    this.dataService.countryNameSource.subscribe((data) => {
      this.countryName = data;
      this.countryId = Number(localStorage.getItem('countryId'));
      this.checkquizquestionmodule();
      this.checkplanExpire();
      this.getFilterUniversityList(this.countryId)
    });

  }
  startQuiz(moduleid: any) {
    if(this.planExpired){
      this.restrict=true;
      return;
    }
    if (moduleid == 1) {
      this.currentModuleSlug = "pre-admission"
    } else if (moduleid == 3) {
      this.currentModuleSlug = "post-admission"
    } else if (moduleid == 4) {
      this.currentModuleSlug = "career-hub"
    } else if (moduleid == 6) {
      this.currentModuleSlug = "life-at-country"
    }
    this.router.navigate([`/pages/modules/${this.currentModuleSlug}/quiz`]);
  }
  getFilterUniversityList(value: any) {
    var data={
      country_id:value
    }
    this.moduleListService.getUniversity(data).subscribe((response) => {
      this.filterUniversityList = response;
    });
  }
  checkquizquestionmodule() {
    this.quizpercentagedata = []
    var data = {
      countryid: this.countryId
    }
    this.moduleListService.getQuizCompletion(data).subscribe((res) => {
      this.quizpercentagedata = res.modules.filter((obj: any) => obj.module_name !== "Travel And Tourism")
    })
  }
  startQuizUniversity() {
    if(this.planExpired){
      this.restrict=true;
      return;
    }
    this.currentModuleSlug="university"
    this.router.navigate([`/pages/modules/${this.currentModuleSlug}/quiz`]);
  }
  universityidcheck:[]=[]
  universityButtonVisible() {
    if (this.universityId != null) {
      this.universityquizbutton = false;
      localStorage.setItem('universityidforquiz', this.universityId)
      console.log(this.universityId);
      
    } else {
      this.universityquizbutton = true;
    }
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
}
