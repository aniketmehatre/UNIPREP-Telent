import { Component, OnInit } from '@angular/core';
import { PageFacadeService } from '../page-facade.service';
import { CourseListService } from './course-list.service';

@Component({
  selector: 'uni-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss']
})
export class CourseListComponent implements OnInit {

  page:number = 1;
  perPage: number = 50;
  courseListData: any;
  totalCourseCount: number = 0;

  constructor(private pageFacade: PageFacadeService, private courseList: CourseListService) { }

  ngOnInit(): void {
    this.getCourseLists();
  }

  openVideoPopup(videoLink: string) {
    this.pageFacade.openHowitWorksVideoPopup(videoLink);
  }
  
  getCourseLists(){

    let data = {
      page: this.page,
      perPage: this.perPage,
    }

    this.courseList.getListOfCourses(data).subscribe(response=> {
      console.log(response.data);
      this.courseListData = response.data;
      this.totalCourseCount = response.total_count;
    })
  }

  pageChange(event: any){

    this.page = event.page + 1;
    this.perPage = event.rows;
    this.getCourseLists();
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
