import {AfterContentChecked, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {PreAppService} from "../pre-app.service";
import {ListQuestion} from "../../../@Models/question-list.model";
import {MenuItem} from "primeng/api";
import {DataService} from 'src/app/data.service';
import {ActivatedRoute} from "@angular/router";
import {SubModuleList} from "../../../@Models/pre-application.model";

@Component({
    selector: 'uni-question-list',
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

    constructor(private preAppService: PreAppService, private changeDetector: ChangeDetectorRef,
                private dataService: DataService, private route: ActivatedRoute) {
    }

    ngAfterContentChecked(): void {
        this.changeDetector.detectChanges();
    }

    ngOnInit(): void {
        let countryId = 2
        this.preAppService.loadSubModules(countryId);
        this.subModules$ = this.preAppService.subModuleList$();
        this.subModuleId = this.route.snapshot.paramMap.get('id');

        this.subModules$.subscribe(event => {
            event.filter(data => {
                if (data.id == this.subModuleId) {
                    this.moduleName = data.submodule_name;
                }
            })
        })
        this.dataService.currentMessage.subscribe(message => this.message = message)
        this.breadCrumb = [{label: 'Pre Application'}, {label: 'Career Prospectus'}, {label: 'Question'}];

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
        this.listQuestion$ = this.preAppService.questionList$();
        let data = {
            countryId: 2,
            moduleId: 1,
            submoduleId: this.subModuleId
        }
        this.preAppService.loadQuestionList(data);

    }

    onSubModuleClick(id: any) {
        this.listQuestion$.subscribe(event => {
            this.data = event
        });
        this.selectedQuestion = id;
        this.positionNumber = id;
        this.breadCrumb = [{label: 'Pre Application'}, {label: 'Career Prospectus'}, {label: `Question ${id}`}];
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
        this.breadCrumb = [{label: 'Pre Application'}, {label: 'Career Prospectus'}, {label: `Question ${pageNum + 1}`}];

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
        this.dataService.changeMessage("Hello from Second Component hi hi hihi")
    }

    goToHome(event: any) {
        this.isQuestionAnswerVisible = false;
    }

}
