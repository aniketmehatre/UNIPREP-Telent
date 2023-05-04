import {AfterContentChecked, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {ListQuestion} from "../../../@Models/question-list.model";
import {MenuItem} from "primeng/api";
import {DataService} from "../../../data.service";
import {ActivatedRoute} from "@angular/router";
import {CareerHubService} from "../career-hub.service";
import {SubModuleList} from "../../../@Models/career-hub.model";

@Component({
    selector: 'app-question-list',
    templateUrl: './question-list.component.html',
    styleUrls: ['./question-list.component.scss']
})
export class QuestionListComponent implements OnInit, AfterContentChecked {
    subModules$!: Observable<SubModuleList[]>;
    listQuestion$!: Observable<ListQuestion[]>;
    selectedQuestion: number = 0;
    positionNumber: number = 0;
    data: any;
    breadCrumb: MenuItem[] = [];
    isQuestionAnswerVisible: boolean = false;
    isRecommendedLinksVisible: boolean = false;
    isRecommendedVideoVisible: boolean = false;
    responsiveOptions: any[] = [];
    message: string = '';
    moduleName: any;
    subModuleId: any;
    videoLink: any;
    refLink: any;
    countryId: any;

    constructor(private careerHubService: CareerHubService, private changeDetector: ChangeDetectorRef,
                private dataService: DataService, private route: ActivatedRoute) {
    }

    ngAfterContentChecked(): void {
        this.changeDetector.detectChanges();
    }

    ngOnInit(): void {
        this.countryId = Number(localStorage.getItem('countryId'));

        this.subModuleId = this.route.snapshot.paramMap.get('id');

        this.getSubmoduleName(this.countryId);

        this.dataService.currentMessage.subscribe(message => this.message = message)
        this.breadCrumb = [{label: 'Career Hub'}, {label: this.moduleName}, {label: 'Question'}];

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
        this.listQuestion$ = this.careerHubService.questionList$();
        let data = {
            countryId: Number(localStorage.getItem('countryId')),
            moduleId: 4,
            submoduleId: this.subModuleId
        }
        this.careerHubService.loadQuestionList(data);

    }

    getSubmoduleName(countryId: number) {
        this.careerHubService.loadSubModules(countryId);
        this.subModules$ = this.careerHubService.subModuleList$();
        this.subModules$.subscribe(event => {
            event.filter(data => {
                if (data.id == this.subModuleId) {
                    this.moduleName = data.submodule_name;
                }
            })
        })
    }

    onSubModuleClick(id: any) {
        this.listQuestion$.subscribe(event => {
            this.data = event
        });
        this.selectedQuestion = id;
        this.positionNumber = id;
        this.breadCrumb = [{label: 'Career Hub'}, {label: this.moduleName}, {label: `Question ${id}`}];
        this.isQuestionAnswerVisible = true;

    }

    setPage(page: any) {
        let pageNum: number = 0
        if (page.page < 0) {
            pageNum = this.data.length;
        } else {
            pageNum = page.page
        }
        this.positionNumber = pageNum + 1;
        this.breadCrumb = [{label: 'Career Hub'}, {label: this.moduleName}, {label: `Question ${pageNum + 1}`}];
    }

    clickPrevious(carousel: any, event: any) {
        if (this.selectedQuestion < 2) {
            this.selectedQuestion = this.data.length;
            carousel.navBackward(event, this.selectedQuestion);
            return;
        }
        carousel.navBackward(event, --this.selectedQuestion)
    }

    clickNext(carousel: any, event: any) {
        if (this.selectedQuestion > this.data.length) {
            this.selectedQuestion = 0;
            carousel.navForward(event, this.selectedQuestion++)
            return;
        }
        carousel.navForward(event, this.selectedQuestion++)
    }

    onClickRecommendedVideo() {
        this.isRecommendedVideoVisible = true;
        this.data.filter((res: any) => {
            if (res.id == this.selectedQuestion) {
                console.log('res 1', res)
                this.videoLink = res.videolink
            }
        })
    }

    onClickRecommendedLinks() {
        this.isRecommendedLinksVisible = true;
        this.data.filter((res: any) => {
            if (res.id == this.selectedQuestion) {
                console.log('res', res)
                this.refLink = res.reflink
            }
        })
    }

    onClickAsk() {
        this.dataService.changeChatOpenStatus("open chat window");
    }

    goToHome(event: any) {
        this.isQuestionAnswerVisible = false;
    }
}
