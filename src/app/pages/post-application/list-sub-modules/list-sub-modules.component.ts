import { Component, OnInit } from '@angular/core';
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

  constructor(private postApplicationService: PostApplicationService, private router: Router) {
  }

  ngOnInit(): void {
    this.subModules$ = this.postApplicationService.subModuleList$();
    let countryId = 2;
    this.postApplicationService.loadSubModules(countryId);
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
