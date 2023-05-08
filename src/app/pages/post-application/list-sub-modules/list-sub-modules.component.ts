import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {SubModuleList} from "../../../@Models/post-application.model";
import {PostApplicationService} from "../post-application.service";
import {Router} from "@angular/router";

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

    constructor(private postApplicationService: PostApplicationService, private router: Router) {
    }

    ngOnInit(): void {
        this.subModules$ = this.postApplicationService.subModuleList$();
        let countryId = Number(localStorage.getItem('countryId'));
        this.postApplicationService.loadSubModules(countryId);
    }

    goToHome(event: any) {
        console.log(event)
    }

    startQuiz() {
        this.isStartQuiz = true;
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
