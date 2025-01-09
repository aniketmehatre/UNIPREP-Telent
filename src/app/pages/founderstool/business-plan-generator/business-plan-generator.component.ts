import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'uni-business-plan-generator',
  templateUrl: './business-plan-generator.component.html',
  styleUrls: ['./business-plan-generator.component.scss']
})
export class BusinessPlanGeneratorComponent implements OnInit {

  stage: number = 1;
  activePageIndex: number =0;
  recommendations: any [] = [{}]
  constructor() { }

  ngOnInit(): void {
  }

  next(id:string) {

  }
  previous() {

  }
}
