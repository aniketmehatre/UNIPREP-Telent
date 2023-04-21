import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CareerHubService } from '../career-hub.service';
import { SubModuleList } from 'src/app/@Models/career-hub.model';

@Component({
  selector: 'app-list-sub-modules',
  templateUrl: './list-sub-modules.component.html',
  styleUrls: ['./list-sub-modules.component.scss']
})
export class ListSubModulesComponent implements OnInit {
  subModules$!: Observable<SubModuleList[]>;
  selectedSubModule: any;
  subModuleList: any[] = [];

  constructor(private careerHubService: CareerHubService) {
  }

  ngOnInit(): void {
    this.subModules$ = this.careerHubService.subModuleList$();
    let countryId = 2;
    this.careerHubService.loadSubModules(countryId);
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
