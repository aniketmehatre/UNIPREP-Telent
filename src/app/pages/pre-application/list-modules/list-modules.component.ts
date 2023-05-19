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
    selectedSubModule: any;
    subModuleList: any[] = [];
    isStartQuiz: boolean = false;
    isQuizSubmit: boolean = false;
    responsiveOptions: any[] = [];
    quizData: any[] = [];
    selectedQuiz: number = 1;
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
        this.quizData = [{
            id: 1,
            country_id: 2,
            module_id: 1,
            question: "test 1",
            option1: "test fda",
            option2: "test asdf ",
            option3: "test dsfg",
            option4: "test dgh",
            answer: 2,
            status: 1,
            created_at: "2023-03-06T13:42:39.000000Z",
            updated_at: "2023-03-06T13:42:39.000000Z",
            submodule_id: 1
        }, {
            id: 2,
            country_id: 2,
            module_id: 1,
            question: "a sdf asdf asdf asdf asdf",
            option1: "what is ",
            option2: "test asdf",
            option3: "wer df",
            option4: "agffgasdf",
            answer: 2,
            status: 1,
            created_at: "2023-03-06T13:42:39.000000Z",
            updated_at: "2023-03-06T13:42:39.000000Z",
            submodule_id: 1
        }, {
            id: 3,
            country_id: 2,
            module_id: 1,
            question: "test w ebsdgwehggsh",
            option1: "test4vert",
            option2: "test",
            option3: "test",
            option4: "test",
            answer: 2,
            status: 1,
            created_at: "2023-03-06T13:42:39.000000Z",
            updated_at: "2023-03-06T13:42:39.000000Z",
            submodule_id: 1
        }, {
            id: 4,
            country_id: 2,
            module_id: 1,
            question: "test wert wetg wer",
            option1: "test asdf",
            option2: "testasdf",
            option3: "testgh",
            option4: "testwet",
            answer: 2,
            status: 1,
            created_at: "2023-03-06T13:42:39.000000Z",
            updated_at: "2023-03-06T13:42:39.000000Z",
            submodule_id: 1
        }, {
            id: 5,
            country_id: 2,
            module_id: 1,
            question: "test  mryjrtyh ethge",
            option1: "ghj",
            option2: "tetrtyust",
            option3: "ghj f jgf",
            option4: "djh dgh",
            answer: 2,
            status: 1,
            created_at: "2023-03-06T13:42:39.000000Z",
            updated_at: "2023-03-06T13:42:39.000000Z",
            submodule_id: 1
        }, ];
        this.subModules$ = this.preAppService.subModuleList$();
        let countryId = Number(localStorage.getItem('countryId'));
        this.preAppService.loadSubModules(countryId);
        let cName = "";
        this.dataService.countryNameSource.subscribe(countryName => {
            cName = countryName;
        });
        this.breadCrumb = [{label: cName}, {label: `Quiz ${this.positionNumber + 1}`}];
    }

    clickPreviousQuiz(carouselQuiz: any, event: any) {
        if (this.selectedQuiz <= 1) {
            return;
        }
        this.selectedQuiz = this.selectedQuiz - 1;
        let cName = "";
        this.dataService.countryNameSource.subscribe(countryName => {
            cName = countryName;
        });
        this.breadCrumb = [{label: cName}, {label: `Quiz ${this.selectedQuiz}`}];
        carouselQuiz.navBackward(event, this.selectedQuiz)
    }

    clickNextQuiz(carouselQuiz: any, event: any) {
        if (this.selectedQuiz > this.quizData.length - 1) {
            return;
        }
        this.selectedQuiz += 1;
        let cName = "";
        this.dataService.countryNameSource.subscribe(countryName => {
            cName = countryName;
        });
        this.breadCrumb = [{label: cName}, {label: `Quiz ${this.selectedQuiz}`}];
        carouselQuiz.navForward(event, this.selectedQuiz);
    }

    clickSubmitQuiz(event: any) {
        this.isStartQuiz = false;
        this.isQuizSubmit = true;
    }

    startQuiz() {
        this.isStartQuiz = true;
    }

    goToHome(event: any) {
        this.isStartQuiz = false;
    }

    openReport(event: any) {
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

    selectAnswer(selectedOption: any, data: any) {
        console.log(selectedOption, data);
    }

    selectAnswer1(selectedOption: any, data: any) {
        console.log(selectedOption, data);
    }

    selectAnswer2(selectedOption: any, data: any) {
        console.log(selectedOption, data);
    }

    selectAnswer3(selectedOption: any, data: any) {
        console.log(selectedOption, data);
    }

}
