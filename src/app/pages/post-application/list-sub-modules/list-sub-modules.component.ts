import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {SubModuleList} from "../../../@Models/post-application.model";
import {PostApplicationService} from "../post-application.service";
import {Router} from "@angular/router";
import {MenuItem} from "primeng/api";

@Component({
    selector: 'app-list-sub-modules',
    templateUrl: './list-sub-modules.component.html',
    styleUrls: ['./list-sub-modules.component.scss']
})
export class ListSubModulesComponent implements OnInit {
    subModules$!: Observable<SubModuleList[]>;
    selectedSubModule: any;
    subModuleList: any[] = [];
    isStartQuiz: boolean = false;
    responsiveOptions: any[] = [];
    selectedQuestion: any;
    quizData: any [] = [];
    breadCrumb: MenuItem[] = [];
    positionNumber: any;
    constructor(private postApplicationService: PostApplicationService, private router: Router) {
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
        this.subModules$ = this.postApplicationService.subModuleList$();
        let countryId = Number(localStorage.getItem('countryId'));
        this.postApplicationService.loadSubModules(countryId);
    }

    goToHome(event: any) {
        console.log(event)
    }



    setPage(page: any) {
        let pageNum: number = 0
        if (page.page < 0) {
            pageNum = this.quizData.length;
        } else {
            pageNum = page.page
        }
        this.positionNumber = pageNum + 1;
        this.breadCrumb = [{label: 'POST Application'}, {label: 'asdfasdfasdfasdfasdfasdfasdfasdf'}, {label: `Question ${pageNum + 1}`}];
    }

    onSubModuleClick(id: any) {
        this.subModuleList.forEach((element: any) => {
            if (element.id === id) {
                this.selectedSubModule = element.country;
            }
        });
        this.selectedSubModule = id;
        this.router.navigate([`/pages/post-application/question-list/${this.selectedSubModule}`]);

    }


}
