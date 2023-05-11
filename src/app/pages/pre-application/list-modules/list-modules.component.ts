import {Component, OnInit} from '@angular/core';
import {PreAppService} from "../pre-app.service";
import {Observable} from "rxjs";
import {SubModuleList} from "../../../@Models/pre-application.model";
import {Router} from "@angular/router";
import {MenuItem} from "primeng/api";

@Component({
    selector: 'uni-list-modules',
    templateUrl: './list-modules.component.html',
    styleUrls: ['./list-modules.component.scss']
})
export class ListModulesComponent implements OnInit {
    subModules$!: Observable<SubModuleList[]>;
    selectedSubModule: any;
    subModuleList: any[] = [];
    isStartQuiz: boolean = false;
    isQuizSubmit: boolean = false;
    responsiveOptions: any[] = [];
    quizData: any [] = [];
    selectedQuestion: number = 0;
    positionNumber: number = 0;
    breadCrumb: MenuItem[] = [];

    constructor(private preAppService: PreAppService, private router: Router) {
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
    }

    ngOnInit(): void {
        this.quizData = [{
            question: "What is the name of the company?",
            answer: ["Uni Abroad", "Uni Prep", "Uni SOP"]
        },{
            question: "what is status of the application",
            answer: ["Processed", "Hold", "Rejected", "Accepted"]
        }]
        this.subModules$ = this.preAppService.subModuleList$();
        let countryId = Number(localStorage.getItem('countryId'));
        this.preAppService.loadSubModules(countryId);
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
    goToHome(event: any){

    }

    setPage(page: any) {
        let pageNum: number = 0
        if (page.page < 0) {
            pageNum = this.quizData.length;
        } else {
            pageNum = page.page
        }
        this.positionNumber = pageNum + 1;
        this.breadCrumb = [{label: 'POST Application'}, {label: 'test modules'}, {label: `Question ${pageNum + 1}`}];
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
}
