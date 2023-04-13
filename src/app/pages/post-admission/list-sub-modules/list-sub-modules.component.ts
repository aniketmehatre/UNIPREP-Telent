import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {SubModuleList} from "../../../@Models/post-admission.model";
import {PostAdmissionService} from "../post-admission.service";

@Component({
    selector: 'uni-list-sub-modules',
    templateUrl: './list-sub-modules.component.html',
    styleUrls: ['./list-sub-modules.component.scss']
})
export class ListSubModulesComponent implements OnInit {
    submodules$!: Observable<SubModuleList[]>;
    selectedSubModule: any;
    subModuleList: any[] = [];

    constructor(private postAdmissionService: PostAdmissionService) {
    }

    ngOnInit(): void {
        this.submodules$ = this.postAdmissionService.subModuleList$();
        console.log(this.submodules$)
        this.postAdmissionService.loadSubModules();
    }

    onSubModuleClick(id: any) {
        this.subModuleList.forEach((element: any) => {
            if (element.id === id) {
                this.selectedSubModule = element.country;
            }
        });
        this.selectedSubModule = id;
    }
}
