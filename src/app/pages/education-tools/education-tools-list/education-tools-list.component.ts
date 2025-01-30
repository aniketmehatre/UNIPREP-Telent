import { Component, OnInit } from '@angular/core';
import { EducationToolsData } from './education-tools-list-data';

@Component({
  selector: 'uni-education-tools-list',
  templateUrl: './education-tools-list.component.html',
  styleUrls: ['./education-tools-list.component.scss']
})
export class EducationToolsListComponent implements OnInit {

  EducationToolsList = EducationToolsData;
  isLaunchingSoon: true;
  constructor() { }

  ngOnInit(): void {
  }

}
