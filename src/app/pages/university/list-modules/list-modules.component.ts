import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs";
import {SubModuleList} from "../../../@Models/pre-application.model";
import {ConfirmationService, MenuItem} from "primeng/api";
import {ActivatedRoute, Router} from "@angular/router";
import {DataService} from "../../../data.service";
import {LocationService} from "../../../location.service";
import {UniversityService} from "../university.service";

@Component({
  selector: 'uni-list-modules',
  templateUrl: './list-modules.component.html',
  styleUrls: ['./list-modules.component.scss'],
  providers: [ConfirmationService]
})
export class ListModulesComponent implements OnInit {
  subModules$!: Observable<SubModuleList[]>;
  selectedSubModule: any;
  answeredCorrect: number = 0;
  totalPercentage: number = 0;
  percentageValue: string = '';
  subModuleList: any[] = [];
  isReviewVisible: boolean = false;
  responsiveOptions: any[] = [];
  moduleList: any [] = [];
  positionNumber: number = 0;
  breadCrumb: MenuItem[] = [];
  answerOptionClicked: boolean = true
  isInstructionVisible: boolean = false
  countryName: string = ''

  constructor(private universityService: UniversityService, private router: Router, private dataService: DataService,
              private locationService: LocationService, private route: ActivatedRoute,
              private confirmationService: ConfirmationService) {
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
    this.loadModuleAndSubModule();
  }

  loadModuleAndSubModule() {
    this.subModules$ = this.universityService.subModuleList$();
    let countryId = Number(localStorage.getItem('countryId'));
    this.universityService.loadSubModules(countryId);
    this.subModules$.subscribe(event => {
      this.subModuleList = event;
    });
    this.locationService.getUniPerpModuleList().subscribe((data: any) => {
      this.moduleList = data.modules;
    });
  }

  onSubModuleClick(id: any) {
    this.subModuleList.forEach((element: any) => {
      if (element.id === id) {
        this.selectedSubModule = element.country;
      }
    });
    this.selectedSubModule = id;
    this.router.navigate([`/pages/university/question-list/${this.selectedSubModule}`]);
  }

}
