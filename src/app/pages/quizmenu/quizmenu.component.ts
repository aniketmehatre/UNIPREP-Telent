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
  languagedropdownlist:any[]=[];
  languagedropdownlisttype:any[]=[];
  specializationlist:any[]=[];
  skillsmasteryList:any[]=[];
  quizpercentagedata: any[] = [];
  countryId: any;
  countryName!: string;
  universityId: any=null;
  laguageid:any=[];
  contrydropdownid:any=[]
  preaddimissioncontrydropdownid:any=[];
  postadmiisioncontrydropdownid:any=[];
  lifeatcontrydropdownid:any=[];
  careerhubcontrydropdownid:any=[];
  unversitycontrydropdownid:any=[];
  laguagetypeid:any=[];
  subjectid:any=[];
  specializationid:any=null;
  moduleid:any=null;
  universityquizbutton: boolean = true;
  skillunivertybutton:boolean=true;
  learningHubQuiz:boolean=true;
  languageHubQuiz:boolean=true;
  readingmodulestartbutton:boolean = true;
  restrict: boolean = false;
  planExpired: boolean = false;
  certificatesList:any[]=[]
  universityModulescertificate:any[] = [];
  Modulequizlistcertificate:any[] = [];
  learningHubCirtificates:any[]=[];
  languageHubCirtificates:any[]=[];
  skillMasteryCirtificates:any[]=[];
  countrydropdownlist:any[]=[];
  skillsmasteryId:any=null;
  constructor(private moduleListService: ModuleServiceService, private router: Router, private dataService: DataService,
    private locationService: LocationService,private authService: AuthService,) { }

  ngOnInit(): void {
    this.dataService.countryNameSource.subscribe((data) => {
      this.countryName = data;
      this.countryId = Number(localStorage.getItem('countryId'));
      this.contrydropdownid=this.countryId;
      this.preaddimissioncontrydropdownid=this.countryId;
      this.postadmiisioncontrydropdownid=this.countryId;
      this.lifeatcontrydropdownid=this.countryId;
      this.careerhubcontrydropdownid=this.countryId;
      this.unversitycontrydropdownid=this.countryId;
      // this.checkquizquestionmodule();
      this.checkplanExpire();
      this.getFilterUniversityList(this.unversitycontrydropdownid)
      // this.getCertificates()
      this.preAdmissionCountryListId(this.preaddimissioncontrydropdownid);
      this.postAdmissionCountryListId(this.postadmiisioncontrydropdownid);
      this.lifeAtCountryListId(this.lifeatcontrydropdownid);
      this.careerHubCountryListId(this.careerhubcontrydropdownid);
    });
    this.getLaguageList();
    this.getSubjectlist();
    this.countryDropdown();
    this.skillMastery();
  }
  countryDropdown(){
    this.moduleListService.countryList().subscribe((countryList:any) => {
      this.countrydropdownlist=countryList
    });
  }
  // getCertificates(){
  //   this.certificatesList=[]
  //   this.universityModulescertificate = [];
  //   this.Modulequizlistcertificate = [];
  //   var data={
  //     countryid:this.countryId
  //   }
  //   this.moduleListService.getUserCompletedCertificate(data).subscribe((res)=>{
  //     const modulesToRemove = ["Life at ", "Career Hub","Post Admission","pre-admission"];
  //     const modulesToRemoveUniversity = ["University"];
  //     this.certificatesList=res.certificates
  //     this.universityModulescertificate = this.certificatesList.filter(module => !modulesToRemove.includes(module.module_name));
  //     this.Modulequizlistcertificate = this.certificatesList.filter(module => !modulesToRemoveUniversity.includes(module.module_name));
  //   })
  //   var data1={
  //     countryid:0,
  //     moduleid :8
  //   }
  //   this.moduleListService.getUserCompletedCertificate(data1).subscribe((res)=>{
  //     this.learningHubCirtificates=res.certificates
  //   })
  //   var data2={
  //     countryid:0,
  //     moduleid :9
  //   }
  //   this.moduleListService.getUserCompletedCertificate(data2).subscribe((res)=>{
  //     this.languageHubCirtificates=res.certificates
  //   })
  //   var data3={
  //     countryid:0,
  //     moduleid :10
  //   }
  //   this.moduleListService.getUserCompletedCertificate(data3).subscribe((res)=>{
  //     this.skillMasteryCirtificates=res.certificates
  //   })
  // }

  startModululeSkillmastery(){
    this.currentModuleSlug = "skill-mastery"
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
  // checkquizquestionmodule() {
  //   this.quizpercentagedata = []
  //   var data = {
  //     countryid: this.countryId
  //   }
  //   this.moduleListService.getQuizCompletion(data).subscribe((res) => {
  //     this.quizpercentagedata = res.modules.filter((obj: any) => obj.module_name !== "Travel And Tourism")
      
  //   })
  // }
  startQuizUniversity() {
    // if(this.planExpired){
    //   this.restrict=true;
    //   return;
    // }
    localStorage.setItem("modalcountryid",this.unversitycontrydropdownid)
    this.currentModuleSlug="university"
    this.router.navigate([`/pages/modules/${this.currentModuleSlug}/quiz`]);
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
  // readingmoduleid:number=0;
  // moduleprogress:number=0;
  // arrow:boolean=true;
  // changemodule(eve:any){
  //   this.readingmoduleid=eve.value.id
  //   this.moduleprogress=eve.value.progress
  //   if(this.moduleprogress >= 90){
  //     this.readingmodulestartbutton=true;
  //     this.arrow=false;
  //   }else{
  //     this.readingmodulestartbutton=false; 
  //     this.arrow=true;
  //   }
  // }
  startModulule(eve:any){
    this.startQuiz(eve)
  }
  startQuiz(moduleid: any) {
    // if(this.planExpired){
    //   this.restrict=true;
    //   return;
    // }
    if (moduleid == 1) {
      this.currentModuleSlug = "pre-admission"
      localStorage.setItem("modalcountryid",this.preaddimissioncontrydropdownid)
    } else if (moduleid == 3) {
      this.currentModuleSlug = "post-admission"
      localStorage.setItem("modalcountryid",this.postadmiisioncontrydropdownid)
    } else if (moduleid == 4) {
      this.currentModuleSlug = "career-hub"
      localStorage.setItem("modalcountryid",this.lifeatcontrydropdownid)
    } else if (moduleid == 6) {
      this.currentModuleSlug = "life-at-country"
      localStorage.setItem("modalcountryid",this.careerhubcontrydropdownid)
    }
    this.router.navigate([`/pages/modules/${this.currentModuleSlug}/quiz`]);
  }
  downloadCertificate(link:any){
    if(this.planExpired){
      this.restrict=true;
      return;
    }
    window.open(link, '_blank');
  }
  getSubjectlist() {
    this.moduleListService.getSubjectList().subscribe((response) => {
      this.subjectlistdropdown = response.data;
    });
  }
  specializationList(){
    this.specializationlist=[];
   var data={
    // category_flag:1,
    category_id:this.subjectid
   }
   localStorage.setItem("learningsubjectidforquiz",this.subjectid);
   this.moduleListService.getSpecializationLists(data).subscribe((response) => {
    this.specializationlist = response.data;
  });
  }
  quizpercentage:number=0
  specializationdata(){
    var data={
      moduleid:8,
      countryid: 0,
      submoduleid:this.specializationid,
    }
    this.moduleListService.checkModuleQuizCompletion(data).subscribe((res) => {
      this.quizpercentage=res.progress
    })
    if (this.specializationid != null) {
      localStorage.setItem("learninghubsubmoduleid",this.specializationid);
      this.learningHubQuiz=false;
    }else{
      this.learningHubQuiz=true;
    }
  }
  StartLearningHubQuiz(){
    this.currentModuleSlug="learning-hub"
    this.router.navigate([`/pages/modules/${this.currentModuleSlug}/learninghubquiz`]);
  }
  getLaguageList() {
    this.languagedropdownlist=[];
    this.moduleListService.getLanguageist().subscribe((response) => {
      this.languagedropdownlist = response.data;
    });
  }
  getLaguageListType() {
    this.languagedropdownlisttype=[];
    var data={
      languageid:this.laguageid
    }
    this.moduleListService.getLanguageistType(data).subscribe((response) => {
      this.languagedropdownlisttype = response.data;
    });
  }
  languageselectdrpodown:number=0;
  languageselecttypedrpodown:number=0;
  quizlanguguageprogress:number=0
  languageListId(){
    localStorage.setItem("languageidforquiz",this.laguageid)
    this.languageselectdrpodown=1;
    this.getLaguageListType()
  }
  languagrTypeId(){
    localStorage.setItem("languagetypeidforquiz",this.laguagetypeid)
    this.languageselecttypedrpodown=1;
    if(this.languageselectdrpodown==this.languageselecttypedrpodown){
   
      var data={
        moduleid:9,
        languageId: this.laguageid,
        languagetype:this.laguagetypeid,
      }
      this.moduleListService.checklanguageQuizCompletion(data).subscribe((res) => {
        this.quizlanguguageprogress=res.progress
        if(this.quizlanguguageprogress<=89){
          this.languageHubQuiz=false;
        }
      })
    }else{
      this.languageHubQuiz=true;
    }
  }
  StartLanguageHubQuiz(){
    this.currentModuleSlug="language-hub"
    this.router.navigate([`/pages/modules/${this.currentModuleSlug}/languagehubquiz`]);
  }
  preadmissionpercentage:number=0;
  postadmissionpercentage:number=0;
  lifeatcountrypercentage:number=0;
  careerhubpercentage:number=0;
  preAdmissionCountryListId(event:any){
    this.checkplanExpire();
    var data={
      moduleid:1,
      countryid: this.preaddimissioncontrydropdownid,
    }
    this.moduleListService.checkModuleQuizCompletion(data).subscribe((res) => {
      this.preadmissionpercentage=res.progress
      console.log(this.preadmissionpercentage);
      
    })
  }
  postAdmissionCountryListId(event:any){
    this.checkplanExpire();
    var data={
      moduleid:3,
      countryid: this.postadmiisioncontrydropdownid,
    }
    this.moduleListService.checkModuleQuizCompletion(data).subscribe((res) => {
      this.postadmissionpercentage=res.progress
      console.log(this.postadmissionpercentage);
    })
  }
  lifeAtCountryListId(event:any){
    this.checkplanExpire();
    var data={
      moduleid:6,
      countryid: this.lifeatcontrydropdownid,
    }
    this.moduleListService.checkModuleQuizCompletion(data).subscribe((res) => {
      this.lifeatcountrypercentage=res.progress
      console.log(this.lifeatcountrypercentage);
    })
  }
  careerHubCountryListId(event:any){
       this.checkplanExpire();
    var data={
      moduleid:4,
      countryid: this.careerhubcontrydropdownid,
    }
    this.moduleListService.checkModuleQuizCompletion(data).subscribe((res) => {
      this.careerhubpercentage=res.progress
      console.log(this.careerhubpercentage);
    })
  }
  // CountryListId(event:any){
  //   const countryname = this.countrydropdownlist.find(item => item.id === event);
  //   this.countryName=countryname.country
  //   this.countryId=this.contrydropdownid
  //   // this.checkquizquestionmodule();
 
  //   this.getFilterUniversityList(this.countryId)
  //   // this.getCertificates()
  // }
  skillMastery(){
    this.skillsmasteryList=[];
    var data={
     // category_flag:1,
     country_id:0,
     module_id :10
    }
    this.moduleListService.getSkillMasteryLists(data).subscribe((response) => {
     this.skillsmasteryList = response;
   });
   }
   skillmasteryquizpercentage:number=0
   skillMasteryButtonVisible(eve:any){
    var data={
      moduleid:10,
      countryid: 0,
      submoduleid:eve.value,
    }
    this.moduleListService.checkModuleQuizCompletion(data).subscribe((res) => {
      this.skillmasteryquizpercentage=res.progress
    })
    if (this.skillsmasteryId != null) {
      this.skillunivertybutton = false;
      localStorage.setItem('skillmasteryquizsubmoduleid',eve.value)  
    } else {
      this.skillunivertybutton = true;
    }
   }
   universityidcheck:[]=[]
   universityquizpercentagecompletion:number=0;
   universityButtonVisible() {
    var data={
      moduleid:5,
      countryid: this.unversitycontrydropdownid,
      submoduleid:this.universityId,
    }
    this.moduleListService.checkModuleQuizCompletion(data).subscribe((res) => {
      this.universityquizpercentagecompletion=res.progress;
      if (this.universityquizpercentagecompletion <=89) {
         this.universityquizbutton = false;
         localStorage.setItem('universityidforquiz', this.universityId)
       } else {
         this.universityquizbutton = true;
       }
    })
   }
}
