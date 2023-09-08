import { AfterContentChecked, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from "rxjs";
import { MenuItem } from "primeng/api";
import { DataService } from 'src/app/data.service';
import { ActivatedRoute } from "@angular/router";
import {Location} from '@angular/common';
import {ModuleListSub} from "../../../@Models/module.model";
import {ReadQuestion} from "../../../@Models/read-question.model";
import {ListQuestion} from "../../../@Models/question-list.model";
import {ModuleServiceService} from "../../module-store/module-service.service";
import {DomSanitizer} from "@angular/platform-browser";
import {ModuleStoreService} from "../../module-store/module-store.service";

@Component({
    selector: 'uni-question-list',
    templateUrl: './question-list.component.html',
    styleUrls: ['./question-list.component.scss']
})
export class QuestionListComponent implements OnInit, AfterContentChecked {
    @ViewChild('carouselVideoElm') carouselVideoElm: any;
    @ViewChild('carouselRefElm') carouselRefElm: any;
    @ViewChild('carouselPopupVideoElm') carouselPopupVideoElm: any;
    @ViewChild('carouselPopupRefElm') carouselPopupRefElm: any;

    subModules$!: Observable<ModuleListSub[]>;
    readQue$!: Observable<ReadQuestion[]>;
    listQuestion$!: Observable<ListQuestion[]>;
    selectedQuestion: number = 0;
    selectedQuestionId: number = 0;
    selectedModule: number = 0;
    selectedSubModule: number = 0;
    selectedVideo: number = 0;
    selectedRefLink: number = 0;
    positionNumber: number = 0;
    data: any;
    breadCrumb: MenuItem[] = [];
    isQuestionAnswerVisible: boolean = false;
    isRecommendedLinksVisible: boolean = false;
    isRecommendedVideoVisible: boolean = false;
    isReviewedByVisible: boolean = false;
    responsiveOptions: any[] = [];
    message: string = '';
    moduleName: any;
    subModuleId: any;
    videoLinks: any;
    refLink: any;
    countryId: any;
    selectedQuestionData: any;
    popUpItemVideoLink: any;
    reviewedByOrgList: any;

    constructor(private moduleListService: ModuleServiceService, private moduleStoreService: ModuleStoreService,
                private changeDetector: ChangeDetectorRef,
        private dataService: DataService, private route: ActivatedRoute, private _location: Location,
                private _sanitizer: DomSanitizer) {
    }

    ngAfterContentChecked(): void {
        // this.changeDetector.detectChanges();
    }

    ngOnInit(): void {

        this.countryId = Number(localStorage.getItem('countryId'));

        this.subModuleId = this.route.snapshot.paramMap.get('id');

        this.getSubmoduleName(this.countryId);

        this.dataService.currentMessage.subscribe(message => this.message = message)
        this.breadCrumb = [{ label: 'Pre Application' }, { label: this.moduleName }, { label: 'Question' }];

        this.responsiveOptions = [
            {
                breakpoint: '1199px',
                numVisible: 1,
                numScroll: 1
            },
            {
                breakpoint: '991px',
                numVisible: 2,
                numScroll: 1
            },
            {
                breakpoint: '767px',
                numVisible: 1,
                numScroll: 1
            }
        ];
        this.listQuestion$ = this.moduleListService.questionList$();
        let data = {
            countryId: Number(localStorage.getItem('countryId')),
            moduleId: 1,
            submoduleId: this.subModuleId
        }
        this.moduleListService.loadQuestionList(data);
    }

    goBack(){
        this._location.back();
    }

    getSubmoduleName(countryId: number) {
        let data = {
            countryId: countryId,
            api_module_name: 'getpreapplicationsubmoduleqcount'
        }
        this.moduleListService.loadSubModules(data);
        this.subModules$ = this.moduleListService.subModuleList$();
        this.subModules$.subscribe(event => {
            if(event){
                event.filter(data => {
                    if (data.id == this.subModuleId) {
                        this.moduleName = data.submodule_name;
                    }
                })
            }
        })
    }

    onQuestionClick(selectedData: any) {
        this.listQuestion$.subscribe(event => {
            this.data = event
        })
        this.selectedQuestionData = selectedData;
        this.selectedModule = selectedData.module_id;
        this.selectedSubModule = selectedData.submodule_id;
        this.selectedQuestionId = selectedData.id;
        this.selectedQuestion = this.selectedQuestion - 1;
        let index = this.data.findIndex((x: any) => x.id === selectedData.id);
        this.selectedQuestion = index; 
        this.positionNumber = index;
        this.breadCrumb = [{ label: 'Pre Application' }, { label: this.moduleName }, { label: `Question ${index + 1}` }];
        this.isQuestionAnswerVisible = true;
        this.data.filter((res: any) => {
            if (res.id == selectedData.id) {
                this.refLink = res.reflink;
                this.videoLinks = res.videolink;
            }
        });
        let data = {
            questionId: selectedData.id,
            countryId: this.countryId
        }

        this.readQuestion(data);
    }

    readQuestion(data: any){
        this.moduleListService.readQuestion(data);
        this.readQue$ = this.moduleListService.readQuestionMessage$();
        let data1 = {
            countryId: Number(localStorage.getItem('countryId')),
            moduleId: 1,
            submoduleId: this.subModuleId
        }
        this.moduleListService.loadQuestionList(data1);
        this.listQuestion$ = this.moduleListService.questionList$();
    }

    setPage(page: any) {
        let pageNum: number = 0
        if (page.page < 0) {
            pageNum = this.data.length;
        } else {
            pageNum = page.page
        }
        this.data.filter((res: any) => {
            if (res.id == pageNum + 1) {
                this.refLink = res.reflink;
                this.videoLinks = res.videolink;
            }
        });
        this.positionNumber = pageNum + 1;
        this.breadCrumb = [{ label: 'Pre Application' }, { label: this.moduleName }, { label: `Question ${pageNum + 1}` }];
    }

    clickPrevious(carousel: any, event: any) {
        if (this.selectedQuestion <= 0) {
            return;
        }
        let selectedData = this.data[this.selectedQuestion-1];
        this.selectedQuestionData = selectedData;
        this.selectedModule = selectedData.module_id;
        this.selectedSubModule = selectedData.submodule_id;
        this.selectedQuestionId = selectedData.id;
        this.selectedQuestion = this.selectedQuestion - 1;
        this.data.filter((res: any) => {
            if (res.id == selectedData.id) {
                this.refLink = res.reflink;
                this.videoLinks = res.videolink;
            }
        });
        carousel.navBackward(event, this.selectedQuestion);
        let data = {
            questionId: selectedData.id,
            countryId: this.countryId
        }

        this.readQuestion(data);
    }

    clickNext(carousel: any, event: any) {
        if (this.selectedQuestion >= this.data.length - 1) {
            return;
        }
        let selectedData = this.data[this.selectedQuestion+1];
        this.selectedQuestionData = selectedData;
        this.selectedModule = selectedData.module_id;
        this.selectedSubModule = selectedData.submodule_id;
        this.selectedQuestionId = selectedData.id;
        this.selectedQuestion = this.selectedQuestion + 1;
        this.data.filter((res: any) => {
            if (res.id == selectedData.id) {
                this.refLink = res.reflink;
                this.videoLinks = res.videolink;
            }
        });
        carousel.navForward(event, this.selectedQuestion)
        let data = {
            questionId: selectedData.id,
            countryId: this.countryId
        }
        this.readQuestion(data);
    }

    clickPreviousVideo(event: any) {
        if (this.selectedVideo <= 0) {
            return;
        }
        this.selectedVideo = this.selectedVideo - 1;

        this.carouselVideoElm.navBackward(event, this.selectedVideo)
    }  

    clickNextVideo(event: any) {
        if (this.selectedVideo > (this.videoLinks.length / 2) - 1) {
            return;
        }
        this.selectedVideo += 1;

        this.carouselVideoElm.navForward(event, this.selectedVideo)
    }

    clickPreviousRef(event: any) {
        if (this.selectedRefLink <= 0) {
            return;
        }
        this.selectedRefLink = this.selectedRefLink - 1;

        this.carouselRefElm.navBackward(event, this.selectedRefLink)
    }

    clickNextRef(event: any) {
        if (this.selectedRefLink >= (this.refLink.length/2) - 1) {
            return;
        }
        this.selectedRefLink += 1;

        this.carouselRefElm.navForward(event, this.selectedRefLink)
    }

    onClickRecommendedVideo(data: any) {
        this.isRecommendedVideoVisible = true;
        let url = encodeURIComponent(data[0].link);
        this.popUpItemVideoLink = this._sanitizer.bypassSecurityTrustResourceUrl(url);
    }

    onClickRecommendedLinks(data: any) {
        this.isRecommendedLinksVisible = true;
    }

    onClickAsk() {
        this.dataService.changeChatOpenStatus("open chat window");
    }

    openReport() {
        let data = {
            isVisible: true,
            moduleId: this.selectedQuestionData.module_id,
            subModuleId: this.selectedQuestionData.submodule_id,
            questionId: this.selectedQuestionData.id,
        }
        this.dataService.openReportWindow(data);
    }


    goToHome(event: any) {
        this.isQuestionAnswerVisible = false;
    }

    // popup video prev
    clickPreviousVideoPopup(data: any) {
        if (this.selectedVideo <= 0) {
            return;
        }
        this.selectedVideo = this.selectedVideo - 1;

        this.carouselPopupRefElm.navBackward(event, this.selectedVideo)
    }

    // popup video next
    clickNextVideoPopup(data: any) {
        if (this.selectedVideo >= this.videoLinks.length - 1) {
            return;
        }
        console.log(this.selectedVideo);
        let vdoLinks = this.videoLinks.find((x : any) => x.id == this.selectedVideo)
        this.popUpItemVideoLink = this._sanitizer.bypassSecurityTrustResourceUrl(data[0].link);

        this.selectedVideo += 1;

        this.carouselPopupRefElm.navForward(event, this.selectedVideo)
    }

    clickPreviousRefPopup(data: any) {
        if (this.selectedRefLink <= 0) {
            return;
        }
        this.selectedRefLink = this.selectedRefLink - 1;

        this.carouselPopupRefElm.navBackward(event, this.selectedRefLink)
    }

    clickNextRefPopup(data: any) {
        if (this.selectedRefLink >= this.refLink.length - 1) {
            return;
        }
        this.selectedRefLink += 1;

        this.carouselPopupRefElm.navForward(event, this.selectedRefLink)
    }

    reviewBy(){
        this.reviewedByOrgList = [];
        this.isReviewedByVisible = true;
        let request = {
            question_id: this.selectedQuestionId
        }
        this.moduleStoreService.GetReviewedByOrgLogo(request).subscribe((response) => {
            this.reviewedByOrgList = response;
        })
    }
}
