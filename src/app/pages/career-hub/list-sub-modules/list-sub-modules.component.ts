import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {CareerHubService} from '../career-hub.service';
import {SubModuleList} from 'src/app/@Models/career-hub.model';
import {Router} from '@angular/router';

@Component({
    selector: 'app-list-sub-modules',
    templateUrl: './list-sub-modules.component.html',
    styleUrls: ['./list-sub-modules.component.scss']
})
export class ListSubModulesComponent implements OnInit {
    subModules$!: Observable<SubModuleList[]>;
    selectedSubModule: any;
    subModuleList: any[] = [];

    constructor(private careerHubService: CareerHubService, private router: Router) {
    }

    ngOnInit(): void {
        this.subModules$ = this.careerHubService.subModuleList$();
        let countryId = Number(localStorage.getItem('countryId'));
        this.careerHubService.loadSubModules(countryId);
    }

    onSubModuleClick(id: any) {
        this.selectedSubModule = id;
        this.router.navigate([`/pages/career-hub/question-list/${this.selectedSubModule}`]);

    }
}
