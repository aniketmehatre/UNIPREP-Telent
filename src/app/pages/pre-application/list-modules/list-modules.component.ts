import {Component, OnInit} from '@angular/core';
import {PreAppService} from "../pre-app.service";
import {Observable} from "rxjs";
import {SubModuleList} from "../../../@Models/pre-application.model";

@Component({
    selector: 'uni-list-modules',
    templateUrl: './list-modules.component.html',
    styleUrls: ['./list-modules.component.scss']
})
export class ListModulesComponent implements OnInit {
    subModules$!: Observable<SubModuleList[]>;
    selectedSubModule: any;
    subModuleList: any[] = [];

    constructor(private preAppService: PreAppService) {
    }

    ngOnInit(): void {
        this.subModules$ = this.preAppService.subModuleList$();
        let countryId = 2
        this.preAppService.loadSubModules(countryId);
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
