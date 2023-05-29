import {Component, OnInit} from '@angular/core';
import {PreAppService} from "../pre-app.service";
import {Observable} from "rxjs";
import {SubModuleList} from "../../../@Models/pre-application.model";
import {Router} from "@angular/router";
import {MenuItem} from "primeng/api";
import {DataService} from "../../../data.service";

@Component({
    selector: 'uni-list-modules',
    templateUrl: './list-modules.component.html',
    styleUrls: ['./list-modules.component.scss']
})
export class ListModulesComponent implements OnInit {
    subModules$!: Observable<SubModuleList[]>;
    quizList$!: Observable<any>;
    selectedSubModule: any;
    answeredCorrect: number = 0;
    totalPercentage: number = 0;
    subModuleList: any[] = [];
    isStartQuiz: boolean = false;
    isQuizSubmit: boolean = false;
    isReviewVisible: boolean = false;
    responsiveOptions: any[] = [];
    quizData: any [] = [];
    selectedQuiz: number = 1;
    selectedOptNumber: number = 1;
    selectedOptValue: number = 1;
    positionNumber: number = 0;
    breadCrumb: MenuItem[] = [];

    constructor(private preAppService: PreAppService, private router: Router, private dataService: DataService) {
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
                numScroll: 1,
            }
        ];
    }

    ngOnInit(): void {
        this.subModules$ = this.preAppService.subModuleList$();
        let countryId = Number(localStorage.getItem('countryId'));
        this.preAppService.loadSubModules(countryId);
        let cName = "";
        this.dataService.countryNameSource.subscribe(countryName => {
            cName = countryName;
        });
        this.breadCrumb = [{label: cName}, {label: `Quiz ${this.positionNumber + 1}`}];
        this.getQuizData();
    }

    getQuizData() {
        let data = {
            countryId: Number(localStorage.getItem('countryId')),
            moduleId: 1,
            submoduleId: 1
        }
        this.quizList$ = this.preAppService.quizList$();
        this.preAppService.quizList(data);
        this.quizList$.subscribe((data) => {
            let rotData = data;
            this.quizData = rotData.map((val: any) => {
                let number = 1;
                let dd = {...val};
                dd.otp1 = dd.option1 + dd.id + number++;
                dd.otp2 = dd.option2 + dd.id + number++;
                dd.otp3 = dd.option3 + dd.id + number++;
                dd.otp4 = dd.option4 + dd.id + number++;
                number = 1;
                return dd;
            })
        });
    }

    clickPreviousQuiz(carouselQuiz: any, event: any) {
        if (this.selectedQuiz <= 1) {
            return;
        }

        let data = this.quizData[this.selectedQuiz];
        this.quizData.map((data: any) => {
            let dd = {...data};
            if (dd.id == this.selectedQuiz) {
                this.selectedOptNumber = dd.user_answered;
                dd.user_answered = this.selectedQuiz;
                return dd;
            }
        });
        this.selectedQuiz = this.selectedQuiz - 1;
        let cName = "";
        this.dataService.countryNameSource.subscribe(countryName => {
            cName = countryName;
        });
        this.breadCrumb = [{label: cName}, {label: `Quiz ${this.selectedQuiz}`}];
        carouselQuiz.navBackward(event, this.selectedQuiz)
    }

    clickNextQuiz(carouselQuiz: any, event: any) {
        if (this.selectedQuiz) {

        }
        if (this.selectedQuiz > this.quizData.length - 1) {
            return;
        }
        this.quizData = this.quizData.map((data: any) => {
            let dat = {...data}
            if (dat.id == this.selectedQuiz) {
                dat.user_answered = this.selectedOptNumber;
                dat.user_answered_value = this.selectedOptValue;
                return dat;
            }
            return dat;
        });
        this.selectedQuiz = this.selectedQuiz + 1;

        let cName = "";
        this.dataService.countryNameSource.subscribe(countryName => {
            cName = countryName;
        });
        this.breadCrumb = [{label: cName}, {label: `Quiz ${this.selectedQuiz}`}];

        carouselQuiz.navForward(event, this.selectedQuiz);
    }

    clickSubmitQuiz(event: any) {

        this.quizData.forEach((data) => {
            if (data.answer == data.user_answered) {
                this.answeredCorrect++;
            }
        })
        this.totalPercentage = (this.answeredCorrect / this.quizData.length) * 100;
        this.isStartQuiz = false;
        this.isQuizSubmit = true;
    }

    closeAllHome(event: any) {
        this.isStartQuiz = false;
        this.isQuizSubmit = false;
    }

    startQuiz() {
        this.quizData = [];
        this.getQuizData();
        this.selectedQuiz = 1;
        this.positionNumber = 1;
        this.isStartQuiz = true;
    }

    goToHome(event: any) {
        this.isStartQuiz = false;
    }

    openReport(event: any) {
        this.dataService.openReportWindow(true);
    }

    setPage(page: any) {
        let pageNum: number = 0
        if (page.page < 0) {
            pageNum = this.quizData.length;
        } else {
            pageNum = page.page
        }
        this.positionNumber = pageNum + 1;

    }

    onSubModuleClick(id: any) {
        this.subModuleList.forEach((element: any) => {
            if (element.id === id) {
                this.selectedSubModule = element.country;
            }
        });
        this.selectedSubModule = id;
        this.router.navigate([`/pages/pre-application/question-list/${this.selectedSubModule}`]);

    }

    selectAnswer(selectedOption: any, singleData: any, optNumber: number) {
        this.selectedOptNumber = optNumber;
        this.selectedOptValue = selectedOption;
        let mappedQuiz = this.quizData.map((data: any) => {
            let dat = {...data}
            if (dat.id == singleData.id) {

                dat.user_answered = optNumber;
                dat.user_answered_value = selectedOption;
                return dat;
            }
            return dat;
        });
        this.quizData = mappedQuiz;
    }

    openReviewPopup() {
        this.isQuizSubmit = false;
        this.isReviewVisible = true;
    }

    retryQuiz() {
        this.quizData = [];
        this.getQuizData();
        this.selectedQuiz = 1;
        this.positionNumber = 1;
        this.isStartQuiz = true;
    }
}
