import { Component, OnInit } from '@angular/core';
import { PageFacadeService } from '../page-facade.service';
import { CourseListService } from './course-list.service';
import { FormBuilder, FormGroup } from "@angular/forms";

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
  isFilterVisible: string = 'none';
  filterForm: FormGroup;
  selectAllCheckboxes = false;
  selectedCourses: number = 0;

  constructor(private pageFacade: PageFacadeService, private courseList: CourseListService, private fb: FormBuilder,) { 
    this.filterForm = this.fb.group({

    })
  }

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
    this.isFilterVisible = "block";
  }

  clearFilter(){

  }

  selectAllCheckbox(){
    this.selectedCourses = 0;
    this.selectAllCheckboxes = !this.selectAllCheckboxes;
    if(this.selectAllCheckboxes){
      this.courseListData.forEach((item:any)=>{
        item.isChecked = 1;
        this.selectedCourses += 1;
      })
    }else{
      this.courseListData.forEach((item:any)=>{
        item.isChecked = 0;
      });
    }
  }

  onCheckboxChange(event: any){
    const isChecked = (event.target as HTMLInputElement).checked;
    this.selectedCourses = isChecked ? this.selectedCourses + 1 : this.selectedCourses - 1;

    if(isChecked == false){
      if(this.selectedCourses){
        this.selectAllCheckboxes = false;
      }
    }else{
      if(this.courseListData.length == this.selectedCourses){
        this.selectAllCheckboxes = true;
      }
    }
  }
}
