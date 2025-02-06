import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PageFacadeService } from '../../page-facade.service';

@Component({
    selector: 'uni-carrerplannerlist',
    templateUrl: './carrerplannerlist.component.html',
    styleUrls: ['./carrerplannerlist.component.scss'],
    standalone: false
})
export class CarrerplannerlistComponent implements OnInit {
  listcreerplaner:any=[];
  constructor(private router: Router,private pageFacade: PageFacadeService,) { }

  ngOnInit(): void {
    this.listcreerplaner=[]
  }
  goToCareetPlanerSpecializations(){
    this.router.navigate(['/pages/job-tool/career-planner']);
  }
  goToCareetPlanerCountryWise(){
    this.router.navigate(['/pages/job-tool/careerplannercountrywise']);
  }
  goBackCareerTool(){
    this.router.navigate(['/pages/job-tool/careerplannercountrywise']);
  }
  openVideoPopup(videoLink: string) {
    this.pageFacade.openHowitWorksVideoPopup(videoLink);
  }
}
