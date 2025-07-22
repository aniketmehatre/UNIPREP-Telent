import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModuleServiceService } from '../module-store/module-service.service';
import { LocationService } from 'src/app/services/location.service';
import { DataService } from 'src/app/services/data.service';
import { AuthService } from 'src/app/Auth/auth.service';
import { PageFacadeService } from '../page-facade.service';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { StorageService } from "../../services/storage.service";
@Component({
  selector: 'uni-quizmenu',
  templateUrl: './quizmenu.component.html',
  styleUrls: ['./quizmenu.component.scss'],
  standalone: true,
  imports: [CommonModule, DialogModule, FormsModule, ReactiveFormsModule, SelectModule],

})
export class QuizmenuComponent implements OnInit {
  tooltip: any;
  currentModuleSlug: any;
  filterUniversityList: any[] = [];
  subjectlistdropdown: any[] = [];
  languagedropdownlist: any[] = [];
  languagedropdownlisttype: any[] = [];
  specializationlist: any[] = [];
  skillsmasteryList: any[] = [];
  quizpercentagedata: any[] = [];
  countryId: any;
  countryName!: string;
  universityId: any = null;
  laguageid: any = [];
  contrydropdownid: any = []
  preaddimissioncontrydropdownid: any = [];
  postadmiisioncontrydropdownid: any = [];
  lifeatcontrydropdownid: any = [];
  careerhubcontrydropdownid: any = [];
  unversitycontrydropdownid: any = [];
  laguagetypeid: any = [];
  subjectid: any = [];
  specializationid: any = null;
  moduleid: any = null;
  universityquizbutton: boolean = true;
  skillunivertybutton: boolean = true;
  learningHubQuiz: boolean = true;
  languageHubQuiz: boolean = true;
  readingmodulestartbutton: boolean = true;
  planExpired: boolean = false;
  StudentplanRestrict: boolean = false;
  certificatesList: any[] = []
  universityModulescertificate: any[] = [];
  Modulequizlistcertificate: any[] = [];
  learningHubCirtificates: any[] = [];
  languageHubCirtificates: any[] = [];
  skillMasteryCirtificates: any[] = [];
  countrydropdownlist: any[] = [];
  skillsmasteryId: any = null;
  constructor(private moduleListService: ModuleServiceService, private router: Router, private dataService: DataService,
    private locationService: LocationService, private authService: AuthService, private pageFacade: PageFacadeService,
    private storage: StorageService) { }

  ngOnInit(): void {
    this.dataService.countryNameSource.subscribe((data) => {
      this.countryName = data;
      this.countryId = Number(this.storage.get('countryId'));
      this.contrydropdownid = this.countryId;
      this.preaddimissioncontrydropdownid = this.countryId;
      this.postadmiisioncontrydropdownid = this.countryId;
      this.lifeatcontrydropdownid = this.countryId;
      this.careerhubcontrydropdownid = this.countryId;
      this.unversitycontrydropdownid = this.countryId;
      // this.checkquizquestionmodule();
      // this.getCertificates()
      this.checkplanExpire();
      this.getFilterUniversityList(this.unversitycontrydropdownid)
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
  countryDropdown() {
    this.locationService.getCountry().subscribe((countryList: any) => {
      this.countrydropdownlist = countryList
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

  startModululeSkillmastery() {
    if (this.StudentplanRestrict) {
      this.authService.hasUserSubscription$.next(true);
      return;
    }
    //this.storage.set('QuizModuleName', '')
    this.currentModuleSlug = "skill-mastery"
    this.router.navigate([`/pages/modules/${this.currentModuleSlug}/quiz`]);
  }
  getFilterUniversityList(value: any) {
    var data = {
      country_id: value
    }
    this.moduleListService.getUniversity(data).subscribe((response) => {
      this.filterUniversityList = response;
      this.universityquizbutton = true;
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
    if (this.planExpired) {
      this.authService.hasUserSubscription$.next(true);
      return;
    }
    this.storage.set("modalcountryid", this.unversitycontrydropdownid)
    this.currentModuleSlug = "university"
    this.router.navigate([`/pages/modules/${this.currentModuleSlug}/quiz`]);
  }
  checkplanExpire(): void {
    if (this.authService._userSubscrition.time_left.plan === "expired" ||
      this.authService._userSubscrition.time_left.plan === "subscription_expired") {
      this.planExpired = true;
    }
    else {
      this.planExpired = false;
    }
    if (this.authService._userSubscrition.time_left.plan === "expired" ||
      this.authService._userSubscrition.time_left.plan === "subscription_expired" ||
      this.authService._userSubscrition.subscription_details.subscription_plan === "Student") {
      this.StudentplanRestrict = true;
    }
    else {
      this.StudentplanRestrict = false;
    }

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
  startModulule(eve: any) {
    this.startQuiz(eve)
  }
  startQuiz(moduleid: any) {
    if (this.planExpired) {
      this.authService.hasUserSubscription$.next(true);
      return;
    }
    if (moduleid == 1) {
      this.currentModuleSlug = "pre-admission"
      this.storage.set("modalcountryid", this.preaddimissioncontrydropdownid)
    } else if (moduleid == 3) {
      this.currentModuleSlug = "post-admission"
      this.storage.set("modalcountryid", this.postadmiisioncontrydropdownid)
    } else if (moduleid == 4) {
      this.currentModuleSlug = "career-hub"
      this.storage.set("modalcountryid", this.careerhubcontrydropdownid)
    } else if (moduleid == 6) {
      this.currentModuleSlug = "life-at-country"
      this.storage.set("modalcountryid", this.lifeatcontrydropdownid)
    }
    this.router.navigate([`/pages/modules/${this.currentModuleSlug}/quiz`]);
  }
  downloadCertificate(link: any) {
    if (this.planExpired) {
      this.authService.hasUserSubscription$.next(true);
      return;
    }
    window.open(link, '_blank');
  }
  getSubjectlist() {
    this.moduleListService.getSubjectList().subscribe((response) => {
      this.subjectlistdropdown = response.data;
    });
  }
  specializationList(event: any) {
    this.storage.set('QuizModuleName', '')
    this.storage.set('learningHubQuizBreadCrumb', '')
    this.storage.set('QuizModuleName', event.value.category)
    this.specializationlist = [];
    var data = {
      // category_flag:1,
      category_id: this.subjectid.category_id
    }
    this.storage.set("learningsubjectidforquiz", this.subjectid.category_id);
    this.moduleListService.getSpecializationLists(data).subscribe((response) => {
      this.specializationlist = response.data;
      this.learningHubQuiz = true;
    });
  }
  quizpercentage: number = 0
  specializationdata(event: any) {
    this.storage.set('QuizModuleName', this.storage.get('QuizModuleName') + ' -> ' + event.value.submodule_name)
    var data = {
      moduleid: 8,
      countryid: 0,
      submoduleid: this.specializationid.submodule_id,
    }
    this.moduleListService.checkModuleQuizCompletion(data).subscribe((res) => {
      this.quizpercentage = res.progress
    })
    if (this.specializationid.submodule_id != null) {
      this.storage.set("learninghubsubmoduleid", this.specializationid.submodule_id);
      this.learningHubQuiz = false;
    } else {
      this.learningHubQuiz = true;
    }
  }
  StartLearningHubQuiz() {
    if (this.StudentplanRestrict) {
      this.authService.hasUserSubscription$.next(true);
      return;
    }
    console.log(this.storage.get('QuizModuleName'))
    this.currentModuleSlug = "learning-hub"
    this.router.navigate([`/pages/modules/${this.currentModuleSlug}/learninghubquiz`]);
  }
  getLaguageList() {
    this.languagedropdownlist = [];
    this.moduleListService.getLanguageist().subscribe((response) => {
      this.languagedropdownlist = response.data;
    });
  }
  getLaguageListType() {
    this.languagedropdownlisttype = [];
    var data = {
      languageid: this.laguageid.id
    }
    this.moduleListService.getLanguageistType(data).subscribe((response) => {
      this.languagedropdownlisttype = response.data;
      this.languageHubQuiz = true;
    });
  }
  languageselectdrpodown: number = 0;
  languageselecttypedrpodown: number = 0;
  quizlanguguageprogress: number = 0
  languageListId(event: any) {
    this.storage.set('QuizModuleName', event.value.language)
    this.storage.set("languageidforquiz", this.laguageid.id)
    this.languageselectdrpodown = 1;
    this.getLaguageListType()
  }
  languagrTypeId(event: any) {
    this.storage.set('QuizModuleName', this.storage.get('QuizModuleName') + ' -> ' + event.value.type)
    this.storage.set("languagetypeidforquiz", this.laguagetypeid.id)
    this.languageselecttypedrpodown = 1;
    if (this.languageselectdrpodown == this.languageselecttypedrpodown) {

      var data = {
        moduleid: 9,
        languageId: this.laguageid.id,
        languagetype: this.laguagetypeid.id,
      }
      this.moduleListService.checklanguageQuizCompletion(data).subscribe((res) => {
        this.quizlanguguageprogress = res.progress
        if (this.quizlanguguageprogress <= 89) {
          this.languageHubQuiz = false;
        }
      })
    } else {
      this.languageHubQuiz = true;
    }
  }
  StartLanguageHubQuiz() {
    if (this.planExpired) {
      this.authService.hasUserSubscription$.next(true);
      return;
    }
    this.currentModuleSlug = "language-hub"
    this.router.navigate([`/pages/modules/${this.currentModuleSlug}/languagehubquiz`]);
  }
  preadmissionpercentage: number = 0;
  postadmissionpercentage: number = 0;
  lifeatcountrypercentage: number = 0;
  careerhubpercentage: number = 0;
  preAdmissionCountryListId(event: any) {
    this.checkplanExpire();
    var data = {
      moduleid: 1,
      countryid: this.preaddimissioncontrydropdownid,
    }
    this.moduleListService.checkModuleQuizCompletion(data).subscribe((res) => {
      this.preadmissionpercentage = res.progress
    })
  }
  postAdmissionCountryListId(event: any) {
    this.checkplanExpire();
    var data = {
      moduleid: 3,
      countryid: this.postadmiisioncontrydropdownid,
    }
    this.moduleListService.checkModuleQuizCompletion(data).subscribe((res) => {
      this.postadmissionpercentage = res.progress
    })
  }
  lifeAtCountryListId(event: any) {
    this.checkplanExpire();
    var data = {
      moduleid: 6,
      countryid: this.lifeatcontrydropdownid,
    }
    this.moduleListService.checkModuleQuizCompletion(data).subscribe((res) => {
      this.lifeatcountrypercentage = res.progress
    })
  }
  careerHubCountryListId(event: any) {
    this.checkplanExpire();
    var data = {
      moduleid: 4,
      countryid: this.careerhubcontrydropdownid,
    }
    this.moduleListService.checkModuleQuizCompletion(data).subscribe((res) => {
      this.careerhubpercentage = res.progress
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
  skillMastery() {
    this.skillsmasteryList = [];
    var data = {
      // category_flag:1,
      country_id: 0,
      module_id: 10
    }
    this.moduleListService.getSkillMasteryLists(data).subscribe((response) => {
      this.skillsmasteryList = response;
    });
  }
  skillmasteryquizpercentage: number = 0
  skillMasteryButtonVisible(eve: any) {
    this.storage.set('QuizModuleName', eve.value.submodule_name)
    var data = {
      moduleid: 10,
      countryid: 0,
      submoduleid: eve.value.id,
    }
    this.moduleListService.checkModuleQuizCompletion(data).subscribe((res) => {
      this.skillmasteryquizpercentage = res.progress
    })
    if (this.skillsmasteryId != null) {
      this.skillunivertybutton = false;
      this.storage.set('skillmasteryquizsubmoduleid', eve.value.id)
    } else {
      this.skillunivertybutton = true;
    }
  }
  universityquizpercentagecompletion: number = 0;
  universityButtonVisible(event: any) {
    this.storage.set("QuizModuleName", event.value.submodule_name)
    var data = {
      moduleid: 5,
      countryid: this.unversitycontrydropdownid,
      submoduleid: this.universityId.id,
    }
    this.moduleListService.checkModuleQuizCompletion(data).subscribe((res) => {
      this.universityquizpercentagecompletion = res.progress;
      if (this.universityquizpercentagecompletion <= 89) {
        this.universityquizbutton = false;
        this.storage.set('universityidforquiz', this.universityId.id)
      } else {
        this.universityquizbutton = true;
      }
    })
  }

  onChangeCountry(event: any) {

  }

  openVideoPopup(videoLink: string) {
    this.pageFacade.openHowitWorksVideoPopup(videoLink);
  }
}
