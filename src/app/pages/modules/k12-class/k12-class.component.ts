import { Component, OnInit } from '@angular/core';
import { filter, Observable } from "rxjs";
import { ConfirmationService, MenuItem } from "primeng/api";
import { ModuleServiceService } from "../../module-store/module-service.service";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { DataService } from "../../../data.service";
import { AuthService } from "../../../Auth/auth.service";
import { LocationService } from "../../../location.service";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { PageFacadeService } from "../../page-facade.service";
import { Meta, Title } from "@angular/platform-browser";
import { Location } from "@angular/common";
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { SkeletonModule } from 'primeng/skeleton';
import { StorageService } from "../../../storage.service";
@Component({
    selector: 'uni-k12-class',
    templateUrl: './k12-class.component.html',
    styleUrls: ['./k12-class.component.scss'],
    providers: [ConfirmationService],
    standalone: true,
    imports: [CommonModule, DialogModule, SkeletonModule]
})
export class K12ClassComponent implements OnInit {
    subModuleList: any[] = [];
    quizData: any[] = [];
    moduleList: any[] = [];
    selectedQuiz: number = 1;
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
    planExpired!: boolean;
    countryName!: string;
    isSkeletonVisible: boolean = true;
    countryId: any;
    howItWorksVideoLink: string = "";
    quizmoduleselectcountryidsetzero: any = 0;
    selectSubmoduleName: string = "";
    boardId: any;
    boardName: any;
    stateName: any;
    constructor(private moduleListService: ModuleServiceService, private router: Router, private dataService: DataService, private authService: AuthService,
        private locationService: LocationService, private route: ActivatedRoute, private ngxService: NgxUiLoaderService,
        private confirmationService: ConfirmationService, private pageFacade: PageFacadeService,
        private meta: Meta, private _location: Location,
        private titleService: Title,
        private activatedRoute: ActivatedRoute, private storage: StorageService) {
        this.countryId = Number(this.storage.get('countryId'));
        this.boardName = this.storage.get('board-name');
        this.stateName = this.storage.get('state-name');
        this.boardId = this.route.snapshot.paramMap.get("board_id");

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
    }

    loadModuleAndSubModule() {
        this.currentCountryId = Number(this.storage.get('countryId'));
        let data: any = {
            moduleId: this.currentModuleId,
            parent_category_id: Number(this.boardId),
            parent_category_order: 1,
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
        this.storage.set('selectedClass', id)
        this.storage.set('class-name', submodule.category)
        this.router.navigate([`/pages/modules/k12-subject/${submodule.category_id}`]);
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
        this._location.back();
    }

    quizpercentage: any = 0

    openVideoPopup(videoLink: string) {
        this.pageFacade.openHowitWorksVideoPopup(videoLink);
    }
}
