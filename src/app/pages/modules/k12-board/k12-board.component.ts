import { Component, OnInit } from '@angular/core';
import { filter, subscribeOn } from "rxjs";
import { ConfirmationService, MenuItem } from "primeng/api";
import { ModuleServiceService } from "../../module-store/module-service.service";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { DataService } from "../../../services/data.service";
import { AuthService } from "../../../Auth/auth.service";
import { LocationService } from "../../../services/location.service";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { PageFacadeService } from "../../page-facade.service";
import { Meta, Title } from "@angular/platform-browser";
import { Location } from "@angular/common";
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { SkeletonModule } from 'primeng/skeleton';
import { StorageService } from "../../../services/storage.service";
@Component({
    selector: 'uni-k12-board',
    templateUrl: './k12-board.component.html',
    styleUrls: ['./k12-board.component.scss'],
    providers: [ConfirmationService],
    standalone: true,
    imports: [CommonModule, DialogModule, SkeletonModule]
})
export class K12BoardComponent implements OnInit {
    answeredCorrect: number = 0;
    totalPercentage: number = 0;
    percentageValue: string = '';
    subModuleList: any[] = [];
    isStartQuiz: boolean = false;
    isQuizSubmit: boolean = false;
    isReviewVisible: boolean = false;
    responsiveOptions: any[] = [];
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
    allSearchedResult: any[] = []
    loopRange = Array.from({ length: 3 }).fill(0).map((_, index) => index);
    quizpercentage: any = 0


    constructor(private moduleListService: ModuleServiceService, private router: Router, private dataService: DataService,
        private authService: AuthService, private _location: Location,
        private locationService: LocationService, private route: ActivatedRoute,
        private ngxService: NgxUiLoaderService, private storage: StorageService,
        private confirmationService: ConfirmationService, private pageFacade: PageFacadeService,
        private meta: Meta,
        private titleService: Title,) {
        this.countryId = Number(this.storage.get('countryId'));
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
        this.meta.updateTag({
            name: 'description',
            content: `Uniprep Question list modules. more that 100000 questions`
        });
        this.meta.updateTag({ name: 'og:type', content: `website` });
        this.meta.updateTag({ name: 'og:image', content: `https://dev-student.uniprep.ai/uniprep-assets/images/f1.png` });
        this.meta.updateTag({ name: 'og:logo', content: `https://dev-student.uniprep.ai/uniprep-assets/images/f1.png` });
    }

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
        this.storage.set("currentmodulenameforrecently", this.currentModuleName);
        this.loadModuleAndSubModule();
        this.checkplanExpire();
        this.checkquizquestionmodule();
    }

    loadModuleAndSubModule() {
        this.currentCountryId = Number(this.storage.get('countryId'));
        let data: any = {
            moduleId: this.currentModuleId,
        }
        data.module_id = this.currentModuleId
        data.api_module_name = this.currentApiSlug;
        this.locationService.getK12MainCategory(data).subscribe(data => {
            this.isSkeletonVisible = false;
            this.subModuleList = data.data;
        });
        this.locationService.getUniPerpModuleList().subscribe((data: any) => {
            this.moduleList = data.modules;
            this.ngxService.stopBackground();
        });
    }


    onSubModuleClick(id: any, submodule: any) {
        this.storage.set('board-name', submodule.category);
        if (submodule.category == 'State' || submodule.category == 'state' || submodule.category == 'STATE') {
            this.router.navigate([`/pages/modules/k12-state/${id}`]);
        } else {
            this.storage.set('selectedClass', id)
            this.storage.set('state-name', '')
            this.router.navigate([`/pages/modules/k12-class/${id}`]);
        }
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

    goBack() {
        this._location.back()
    }

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
}