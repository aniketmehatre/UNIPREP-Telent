import { Component, OnInit } from '@angular/core';
import { PageFacadeService } from '../page-facade.service';

@Component({
  selector: 'uni-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss']
})
export class CourseListComponent implements OnInit {

  constructor(private pageFacade: PageFacadeService) { }

  ngOnInit(): void {
  }

  openVideoPopup(videoLink: string) {
    this.pageFacade.openHowitWorksVideoPopup(videoLink);
  }
  
  closeGuidelines(){

  }

  buyCredits(){

  }

  exportData(){

  }

  filterBy(){
    
  }

}
