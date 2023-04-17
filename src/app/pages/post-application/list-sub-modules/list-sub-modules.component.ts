import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs";
import {SubModuleList} from "../../../@Models/post-application.model";
import {PostApplicationService} from "../post-application.service";

@Component({
  selector: 'app-list-sub-modules',
  templateUrl: './list-sub-modules.component.html',
  styleUrls: ['./list-sub-modules.component.css']
})
export class ListSubModulesComponent implements OnInit {
  subModules$!: Observable<SubModuleList[]>;
  selectedSubModule: any;
  subModuleList: any[] = [];

  constructor(private postApplicationService: PostApplicationService) {
  }

  ngOnInit(): void {
    this.subModules$ = this.postApplicationService.subModuleList$();
    this.postApplicationService.loadSubModules();
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
