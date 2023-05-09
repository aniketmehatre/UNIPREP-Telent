import {AfterContentChecked, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {Observable} from 'rxjs';
import {SubModuleList} from 'src/app/@Models/post-application.model';
import {ListQuestion} from 'src/app/@Models/question-list.model';
import {PostApplicationService} from '../post-application.service';
import {DataService} from 'src/app/data.service';
import {ActivatedRoute} from '@angular/router';

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
    countryId: any;
    quizData: any [] = [];
    isStartQuiz: boolean = false;
    isQuizSubmit: boolean = false;
    constructor(private postApplicationService: PostApplicationService, private changeDetector: ChangeDetectorRef,
                private dataService: DataService, private route: ActivatedRoute) {
    }

    ngAfterContentChecked(): void {
        this.changeDetector.detectChanges();
    }

    ngOnInit(): void {
        this.quizData = [{
            question: "What is the name of the company?",
            answer: ["Uni Abroad", "Uni Prep", "Uni SOP"]
        },{
            question: "what is status of the application",
            answer: ["Processed", "Hold", "Rejected", "Accepted"]
        }]
        this.countryId = Number(localStorage.getItem('countryId'));

        this.subModuleId = this.route.snapshot.paramMap.get('id');

        this.getSubmoduleName(this.countryId);

        this.dataService.currentMessage.subscribe(message => this.message = message)
        this.breadCrumb = [{label: 'POST Application'}, {label: this.moduleName}, {label: 'Question'}];

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
        this.listQuestion$ = this.postApplicationService.questionList$();
        let data = {
            countryId: Number(localStorage.getItem('countryId')),
            moduleId: 2,
            submoduleId: this.subModuleId
        }
        this.postApplicationService.loadQuestionList(data);

    }

    getSubmoduleName(countryId: number) {
        this.postApplicationService.loadSubModules(countryId);
        this.subModules$ = this.postApplicationService.subModuleList$();
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
        this.breadCrumb = [{label: 'POST Application'}, {label: this.moduleName}, {label: `Question ${id}`}];
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
        this.breadCrumb = [{label: 'POST Application'}, {label: this.moduleName}, {label: `Question ${pageNum + 1}`}];
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


    clickPreviousQuiz(carousel: any, event: any){

    }

    clickNextQuiz(carousel: any, event: any){

    }

    clickSubmitQuiz(event: any){
        this.isStartQuiz = false;
        this.isQuizSubmit = true;
    }

    startQuiz() {
        this.isStartQuiz = true;
    }
}
