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
  subjectlistdropdown:any[]=[];
  quizpercentagedata: any[] = [];
  countryId: any;
  countryName!: string;
  universityId: any=null;
  subjectid:any=null
  specializationid:any=null
  moduleid:any=null
  universityquizbutton: boolean = true;
  readingmodulestartbutton:boolean = true;
  restrict: boolean = false;
  planExpired: boolean = false;
  certificatesList:any[]=[]
  universityModulescertificate:any[] = [];
  Modulequizlistcertificate:any[] = [];
  constructor(private moduleListService: ModuleServiceService, private router: Router, private dataService: DataService,
    private locationService: LocationService,private authService: AuthService,) { }

  ngOnInit(): void {
    this.dataService.countryNameSource.subscribe((data) => {
      this.countryName = data;
      this.countryId = Number(localStorage.getItem('countryId'));
      this.checkquizquestionmodule();
      this.checkplanExpire();
      this.getFilterUniversityList(this.countryId)
      this.getCertificates()
    });
    this.getSubjectlist()
    this.dataService.countryId.subscribe((data) => {
      this.moduleListService.countryList().subscribe(countryList => {
        console.log(countryList);
        
      });
  });
  }
  getCertificates(){
    this.certificatesList=[]
    this.universityModulescertificate = [];
    this.Modulequizlistcertificate = [];
    var data={
      countryid:this.countryId
    }
    this.moduleListService.getUserCompletedCertificate(data).subscribe((res)=>{
      const modulesToRemove = ["Life at ", "Career Hub","Post Admission","pre-admission"];
      const modulesToRemoveUniversity = ["University"];
      this.certificatesList=res.certificates
      this.universityModulescertificate = this.certificatesList.filter(module => !modulesToRemove.includes(module.module_name));
      this.Modulequizlistcertificate = this.certificatesList.filter(module => !modulesToRemoveUniversity.includes(module.module_name));
    })
  }
  startQuiz(moduleid: any) {
    // if(this.planExpired){
    //   this.restrict=true;
    //   return;
    // }
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
      console.log(this.quizpercentagedata);
      
    })
  }
  startQuizUniversity() {
    // if(this.planExpired){
    //   this.restrict=true;
    //   return;
    // }
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
  readingmoduleid:number=0;
  moduleprogress:number=0;
  arrow:boolean=true;
  changemodule(eve:any){
    this.readingmoduleid=eve.value.id
    this.moduleprogress=eve.value.progress
    if(this.moduleprogress >= 80){
      this.readingmodulestartbutton=true;
      this.arrow=false;
    }else{
      this.readingmodulestartbutton=false; 
      this.arrow=true;
    }
  }
  startModulule(){
    this.startQuiz(this.readingmoduleid)
  }
  downloadCertificate(link:any){
    if(this.planExpired){
      this.restrict=true;
      return;
    }
    window.open(link, '_blank');
  }
  getSubjectlist() {
    var data={
      category_flag :1
    }
    this.moduleListService.getSubjectList(1).subscribe((response) => {
      // this.subjectlistdropdown = response;
    });
  }
}
