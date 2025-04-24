import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MenuItem } from "primeng/api";
import { ModuleServiceService } from "../../module-store/module-service.service";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { DataService } from "../../../data.service";
import { AuthService } from "../../../Auth/auth.service";
import { LocationService } from "../../../location.service";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { PageFacadeService } from "../../page-facade.service";
import { Meta, Title } from "@angular/platform-browser";
import { filter } from "rxjs";
import { Location } from "@angular/common";
import { state } from "@angular/animations";
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { SkeletonModule } from 'primeng/skeleton';
import { StorageService } from "../../../storage.service";
import { RestrictionDialogComponent } from 'src/app/shared/restriction-dialog/restriction-dialog.component';
@Component({
  selector: 'uni-k12-subject',
  templateUrl: './k12-subject.component.html',
  styleUrls: ['./k12-subject.component.scss'],
  providers: [ConfirmationService],
  standalone: true,
  imports: [CommonModule, DialogModule, SkeletonModule, RestrictionDialogComponent]
})
export class K12SubjectComponent implements OnInit {

  answeredCorrect: number = 0;
  totalPercentage: number = 0;
  percentageValue: string = '';
  subModuleList: any[] = [];
  isStartQuiz: boolean = false;
  isReviewVisible: boolean = false;
  quizData: any[] = [];
  moduleList: any[] = [];
  selectedQuiz: number = 1;
  positionNumber: number = 0;
  breadCrumb: MenuItem[] = [];
  answerOptionClicked: boolean = true
  isInstructionVisible: boolean = false
  currentModuleSlug: any;
  currentModuleName: any;
  currentModuleId: any
  currentCountryId: any
  currentApiSlug: any;
  infoMessage!: string;
  unlockMessage!: string;
  aboutModule!: string;
  moduleDetails!: string;
  upgradePlanMsg!: string;
  selectedModule!: string;
  planExpired!: boolean;
  countryName!: string;
  isSkeletonVisible: boolean = true;
  countryId: any;
  canShowQuestionList: boolean = false;
  howItWorksVideoLink: string = "";
  quizmoduleselectcountryidsetzero: any = 0;
  selectSubmoduleName: string = "";
  ehitlabelIsShow: boolean = true;
  imagewhitlabeldomainname: any
  orgnamewhitlabel: any;
  orglogowhitelabel: any;
  classId: any;
  boardName: any;
  className: any;
  stateName: any;
  constructor(private moduleListService: ModuleServiceService, private router: Router, private dataService: DataService,
    private authService: AuthService, private _location: Location,
    private locationService: LocationService, private route: ActivatedRoute, private ngxService: NgxUiLoaderService,
    private pageFacade: PageFacadeService,
    private meta: Meta, private storage: StorageService,
    private titleService: Title,) {
    this.countryId = Number(this.storage.get('countryId'));
    this.boardName = this.storage.get('board-name');
    this.stateName = this.storage.get('state-name');
    this.className = this.storage.get('class-name');
    this.classId = this.route.snapshot.paramMap.get("class_id");

    this.dataService.countryIdSource.subscribe((data) => {
      if (this.countryId != data) {
        this.ngOnInit();
      }

      this.dataService.countryNameSource.subscribe((data) => {
        this.countryName = data;
      });
    });
  }
  updateMetaTags() {
    this.titleService.setTitle(`Uniprep | Question modules`);
    this.meta.updateTag({ name: 'description', content: `Uniprep Question list modules. more that 100000 questions` });
    this.meta.updateTag({ name: 'og:type', content: `website` });
    this.meta.updateTag({ name: 'og:image', content: `https://dev-student.uniprep.ai/uniprep-assets/images/f1.png` });
    this.meta.updateTag({ name: 'og:logo', content: `https://dev-student.uniprep.ai/uniprep-assets/images/f1.png` });
  }


  allSearchedResult: any[] = []
  loopRange = Array.from({ length: 24 }).fill(0).map((_, index) => index);
  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateMetaTags();
    });

    // Initial update
    this.updateMetaTags();

    this.storage.set("modalcountryid", this.quizmoduleselectcountryidsetzero);
    this.init();
    this.moduleListService.getSubmodulesAndSpecialization().subscribe((res: any) => {
      this.allSearchedResult = res
    })
  }
  init() {
    this.currentCountryId = Number(this.storage.get('countryId'));
    this.currentModuleSlug = this.router.url.split('/').pop();
    this.dataService.countryNameSource.subscribe((data) => {
      this.countryName = data;
    });
    this.currentModuleId = 14;
    this.currentModuleName = 'K12 Academy';
    this.currentApiSlug = 'getcareertoolcategorylist';
    this.infoMessage = 'Upgrade to access the K12',
      this.unlockMessage = 'Unlock the power of success with our exclusive k12!',
      this.upgradePlanMsg = 'Upgrade your plan now to gain instant access.';
    this.aboutModule = 'Explore a vast database of Q&A about:',
      this.moduleDetails = 'Scholarships, document checklist, Education loan, letter of Recommendation and many more!'
    this.howItWorksVideoLink = "https://www.youtube.com/embed/n9ECpsB6IoI?si=4coiypva6WZfr3NL";

    /*FU
    // if (this.currentModuleId == 5) {
    //   return;
    // } */
    this.storage.set("currentmodulenameforrecently", this.currentModuleName);
    this.loadModuleAndSubModule();
    this.checkplanExpire();
    this.checkquizquestionmodule();
  }

  loadModuleAndSubModule() {
    this.currentCountryId = Number(this.storage.get('countryId'));
    let data: any = {
      moduleId: this.currentModuleId,
      parent_category_id: Number(this.classId),
      parent_category_order: 2,
      country_id: 0
    }
    this.locationService.GetQuestionsCount(data).subscribe(data => {
      this.isSkeletonVisible = false;
      this.subModuleList = data;
    });
    this.locationService.getUniPerpModuleList().subscribe((data: any) => {
      this.moduleList = data.modules;
      this.ngxService.stopBackground();
    });
  }

  restrict = false;

  onSubModuleClick(id: any, submodule: any) {
    this.storage.set('subject-name', submodule.category)
    this.router.navigate([`/pages/modules/k12-chapter/${submodule.category_id}`]);
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
  goBack() {
    this._location.back()
  }
  clearRestriction() {
    this.restrict = false;
  }
  quizpercentage: any = 0
  checkquizquestionmodule() {
    var data = {
      moduleid: this.currentModuleId,
      countryid: this.currentCountryId
    }
    this.moduleListService.checkModuleQuizCompletion(data).subscribe((res) => {
      this.quizpercentage = res.progress
    })
  }

  openVideoPopup(videoLink: string) {
    this.pageFacade.openHowitWorksVideoPopup(videoLink);
  }

  protected readonly state = state;
}
