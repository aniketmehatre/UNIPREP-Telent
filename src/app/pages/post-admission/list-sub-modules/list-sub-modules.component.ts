import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {SubModuleList} from "../../../@Models/post-admission.model";
import {PostAdmissionService} from "../post-admission.service";
import {Router} from "@angular/router";

@Component({
    selector: 'uni-list-sub-modules',
    templateUrl: './list-sub-modules.component.html',
    styleUrls: ['./list-sub-modules.component.scss']
})
export class ListSubModulesComponent implements OnInit {
    submodules$!: Observable<SubModuleList[]>;
    selectedSubModule: any;
    subModuleList: any[] = [];

    constructor(private postAdmissionService: PostAdmissionService, private router: Router) {
    }

    ngOnInit(): void {
        this.submodules$ = this.postAdmissionService.subModuleList$();
        let countryId = 2
        this.postAdmissionService.loadSubModules(countryId);
    }

    onSubModuleClick(id: any) {
        this.subModuleList.forEach((element: any) => {
            if (element.id === id) {
                this.selectedSubModule = element.country;
            }
        });
        this.selectedSubModule = id;
        this.router.navigate([`/pages/post-admission/question-list/${this.selectedSubModule}`]);

    }
}
