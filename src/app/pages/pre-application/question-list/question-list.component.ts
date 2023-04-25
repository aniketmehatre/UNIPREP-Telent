import {AfterContentChecked, ChangeDetectorRef, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Observable} from "rxjs";
import {PreAppService} from "../pre-app.service";
import {ListQuestion} from "../../../@Models/question-list.model";
import {MenuItem} from "primeng/api";
import {ModalComponent} from "../../../components/modal/modal.component";
import { DataService } from 'src/app/data.service';

@Component({
    selector: 'uni-question-list',
    templateUrl: './question-list.component.html',
    styleUrls: ['./question-list.component.scss']
})
export class QuestionListComponent implements OnInit, AfterContentChecked {
    listQuestion$!: Observable<ListQuestion[]>;
    selectedQuestion: number = 0;
    data: any;
    breadCrumb: MenuItem[] = [];
    isQuestionAnswerVisible: boolean = false;
    isRecommendedLinksVisible: boolean = false;
    isRecommendedVideoVisible: boolean = false;
    responsiveOptions: any[] = [];
    message: string = '';
    constructor(private preAppService: PreAppService, private changeDetector: ChangeDetectorRef,
                private dataService: DataService) {
    }

    ngAfterContentChecked(): void {
        this.changeDetector.detectChanges();
    }

    ngOnInit(): void {
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
            submoduleId: 1
        }
        this.preAppService.loadQuestionList(data);

    }

    onSubModuleClick(id: any) {
        this.listQuestion$.subscribe(event => {
            this.data = event
        });
        this.selectedQuestion = id;
        this.breadCrumb = [{ label: 'Pre Application' }, { label: 'Career Prospectus' }, { label: `Question ${id}` }];
        this.isQuestionAnswerVisible = true;

    }

    setPage(page: any) {
        let pageNum: number = 0
        if (page.page < 0) {
            pageNum = this.data.length;
        } else {
            pageNum = page.page
        }
        this.breadCrumb = [{label: 'Pre Application'}, {label: 'Career Prospectus'}, {label: `Question ${pageNum+1}`}];

    }

    onClickRecommendedVideo() {
        this.isRecommendedVideoVisible = true;
    }

    onClickRecommendedLinks() {
        this.isRecommendedLinksVisible = true;
    }

    onClickAsk() {
        this.dataService.changeMessage("Hello from Second Component hi hi hihi")
    }

}
