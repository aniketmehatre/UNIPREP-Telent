import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'uni-carrerplannerlist',
  templateUrl: './carrerplannerlist.component.html',
  styleUrls: ['./carrerplannerlist.component.scss']
})
export class CarrerplannerlistComponent implements OnInit {
  listcreerplaner:any=[];
  constructor(private router: Router) { }

  ngOnInit(): void {
    this.listcreerplaner=[]
  }
  goToCareetPlanerSpecializations(){
    this.router.navigate(['/pages/job-tool/career-planner']);
  }
  goToCareetPlanerCountryWise(){
    this.router.navigate(['/pages/job-tool/careerplannercountrywise']);
  }
}
