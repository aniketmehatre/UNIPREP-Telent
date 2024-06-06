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
  quizpercentagedata: any[] = [];
  countryId: any;
  countryName!: string;
  universityId: any=null;
  laguageid:any=[];
  contrydropdownid:any=[]
  laguagetypeid:any=[];
  subjectid:any=[];
  specializationid:any=null;
  moduleid:any=null;
  universityquizbutton: boolean = true;
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
  countrydropdownlist:any[]=[];
  constructor(private moduleListService: ModuleServiceService, private router: Router, private dataService: DataService,
    private locationService: LocationService,private authService: AuthService,) { }

  ngOnInit(): void {
    this.dataService.countryNameSource.subscribe((data) => {
      this.countryName = data;
      this.countryId = Number(localStorage.getItem('countryId'));
      this.contrydropdownid=this.countryId
      this.checkquizquestionmodule();
      this.checkplanExpire();
      this.getFilterUniversityList(this.countryId)
      this.getCertificates()
    });
    this.getLaguageList();
    this.getSubjectlist();
    this.getLaguageListType();
    this.countryDropdown();
  }
  countryDropdown(){
    this.moduleListService.countryList().subscribe((countryList:any) => {
      this.countrydropdownlist=countryList
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
    var data1={
      countryid:0,
      moduleid :8
    }
    this.moduleListService.getUserCompletedCertificate(data1).subscribe((res)=>{
      this.learningHubCirtificates=res.certificates
    })
    var data2={
      countryid:0,
      moduleid :9
    }
    this.moduleListService.getUserCompletedCertificate(data2).subscribe((res)=>{
      this.languageHubCirtificates=res.certificates
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
    if(this.moduleprogress >= 90){
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
    this.moduleListService.getSubjectList().subscribe((response) => {
      this.subjectlistdropdown = response.data;
    });
  }
  specializationList(){
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
    this.moduleListService.getLanguageist().subscribe((response) => {
      this.languagedropdownlist = response.data;
    });
  }
  getLaguageListType() {
    this.moduleListService.getLanguageistType().subscribe((response) => {
      this.languagedropdownlisttype = response.data;
    });
  }
  languageselectdrpodown:number=0;
  languageselecttypedrpodown:number=0;
  quizlanguguageprogress:number=0
  languageListId(){
    localStorage.setItem("languageidforquiz",this.laguageid)
    this.languageselectdrpodown=1;
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
  CountryListId(event:any){
    console.log(event);
    const countryname = this.countrydropdownlist.find(item => item.id === event);
    this.countryName=countryname.country
    this.countryId=this.contrydropdownid
    this.checkquizquestionmodule();
    this.checkplanExpire();
    this.getFilterUniversityList(this.countryId)
    this.getCertificates()
  }
}
