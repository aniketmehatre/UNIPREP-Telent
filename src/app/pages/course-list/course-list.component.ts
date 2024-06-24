import { Component, OnInit } from '@angular/core';
import { PageFacadeService } from '../page-facade.service';
import { CourseListService } from './course-list.service';
import { FormBuilder, FormGroup } from "@angular/forms";
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

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
  countryList:any = [];
  locationList:any = [];
  courseNameList:any = [];
  subjectNameList:any = [];
  universityNameList:any = [];
  monthList:any = [{id:"Jan",name: "January"},{id:"Feb",name: "February"},{id:"Mar",name: "March"},{id:"Apr",name: "April"},{id:"May ",name: "May"},{id:"Jun",name: "June"},{id:"Jul",name: "July"},{id:"Aug",name: "August"},{id:"Sep",name: "September"},{id:"Oct",name: "October"},{id:"Nov",name: "November"},{id:"Dec",name: "December"}];
  campusList:any = [];
  guidelinesDiv: boolean = true;
  viewFavourites: boolean = false;
  buyCreditsCount: number = 0;
  exportDataIds:any = [];

  constructor(private pageFacade: PageFacadeService, private courseList: CourseListService, private fb: FormBuilder,private toastr: MessageService, private router: Router) { 
    this.filterForm = this.fb.group({
      course_name:[''],
      college_name:[''],
      country:[''],
      campus:[''],
      subject:[''],
      duration:[''],
      intake_months:[''],
      stay_back:[''],
      world_rank:[''],
    });
  }

  ngOnInit(): void {
    this.getCourseLists();
    this.getSelectBoxValues();
  }

  openVideoPopup(videoLink: string) {
    this.pageFacade.openHowitWorksVideoPopup(videoLink);
  }
  
  getSelectBoxValues(){
    this.courseList.loadDropdownValues().subscribe(res =>{
      this.countryList = res.country;
      this.campusList = res.locations;
      this.courseNameList = res.course_name;
      this.subjectNameList = res.subject_name;
      this.universityNameList = res.university_name;
    });
  }

  getCourseLists(){
    let formValues = this.filterForm.value;
    let data = {
      course_name: formValues.course_name ? formValues.course_name : "",
      college_name: formValues.college_name ? formValues.college_name : "",
      country: formValues.country ? formValues.country : "",
      campus: formValues.campus ? formValues.campus : "",
      subject: formValues.subject ? formValues.subject : "",
      duration: formValues.duration ? formValues.duration : "",
      intake_months: formValues.intake_months ? formValues.intake_months : "",
      stay_back: formValues.stay_back ? formValues.stay_back : "",
      world_rank: formValues.world_rank ? formValues.world_rank : "",
      favourites: this.viewFavourites ? this.viewFavourites : "",
      page: this.page,
      perPage: this.perPage,
    }

    this.courseList.getListOfCourses(data).subscribe(response=> {
      this.courseListData = response.data;
      this.totalCourseCount = response.total_count;
      this.buyCreditsCount = response.credit_count;
    })
  }
  
  submitFilter(){
    let formValues = this.filterForm.value;
    if (!formValues.course_name  && !formValues.college_name  && !formValues.country && !formValues.campus && !formValues.subject && !formValues.duration && !formValues.intake_months && !formValues.stay_back  && !formValues.world_rank ) {
      this.toastr.add({ severity: 'error', summary: 'Error', detail: 'Please make sure you have some filter!' });
      return;
    }
    this.getCourseLists();
    this.isFilterVisible = 'none';
  }

  pageChange(event: any){

    this.page = event.page + 1;
    this.perPage = event.rows;
    this.getCourseLists();
  }

  closeGuidelines(){
    this.guidelinesDiv = !this.guidelinesDiv;
  }

  exportData(){
    if(this.buyCreditsCount == 0){
      this.toastr.add({severity: "error",summary: "error",detail: "Please Buy Some Credits.",});
      setTimeout(() => {
        this.router.navigate(["/pages/export-credit"]);
      }, 300);
    }else{
      this.exportDataIds = [];
      this.courseListData.forEach((item:any)=>{
        if(item.isChecked == 1){
          this.exportDataIds.push(item.id);
        }
      });
      if(this.exportDataIds.length == 0){
        this.toastr.add({severity: "error",summary: "error",detail: "Select Some data for export!.",});
        return;
      }
      if(this.buyCreditsCount < this.exportDataIds.length){
        this.toastr.add({severity: "error",summary: "error",detail: "insufficient credits.Please Buy Some Credits.",});
        setTimeout(() => {
          this.router.navigate(["/pages/export-credit"]);
        }, 300);
        return;
      }
      let data={
        module_id: 4,
        export_id: this.exportDataIds
      };

      this.courseList.exportSelectedData(data).subscribe((response)=>{
        window.open(response.link, '_blank');
        this.selectAllCheckboxes = false;
        this.selectedCourses = 0;
        this.getCourseLists();
      })
    }
  }

  filterBy(){
    this.isFilterVisible = "block";
  }

  clearFilter(){
    this.filterForm.reset();
    this.getCourseLists();
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

  countryOnchange(){
    let country = this.filterForm.value.country;

    let campusList:any = this.campusList.filter((item:any)=> item.country_id == country);
    this.locationList = campusList;
  }

  viewFav(){
    this.viewFavourites = !this.viewFavourites;
    this.getCourseLists();
  }
}
