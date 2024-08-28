import { Component, OnInit } from '@angular/core';
import { PageFacadeService } from '../page-facade.service';
import { CourseListService } from './course-list.service';
import { FormBuilder, FormGroup } from "@angular/forms";
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Auth/auth.service';
import { UserManagementService } from "../user-management/user-management.service";

@Component({
  selector: 'uni-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss']
})
export class CourseListComponent implements OnInit {

  page: number = 1;
  perPage: number = 50;
  courseListData: any;
  totalCourseCount: number = 0;
  isFilterVisible: string = 'none';
  filterForm: FormGroup;
  selectAllCheckboxes = false;
  selectedCourses: number = 0;
  countryList: any = [];
  locationList: any = [];
  allLocations: any = [];
  courseNameList: any = [];
  subjectNameList: any = [];
  universityNameList: any = [];
  allUniversityList: any = [];
  durationList: any = [];
  monthList: any = [{ id: "January", name: "January" }, { id: "February", name: "February" }, { id: "March", name: "March" }, { id: "April", name: "April" }, { id: "May ", name: "May" }, { id: "June", name: "June" }, { id: "July", name: "July" }, { id: "August", name: "August" }, { id: "September", name: "September" }, { id: "October", name: "October" }, { id: "November", name: "November" }, { id: "December", name: "December" }];
  studyLevel: any = [{ id: "UG", value: "UG" }, { id: "PG", value: "PG" }];
  worldRank: any = [{ id: "100", value: "Top 100" }, { id: "200", value: "Top 200" }, { id: "500", value: "Top 500" }, { id: null, value: "All Range" }];
  campusList: any = [];
  guidelinesDiv: boolean = true;
  viewFavourites: boolean = false;
  buyCreditsCount: number = 0;
  exportDataIds: any = [];
  currentPlan: string = "";
  planExpired!: boolean;
  restrict: boolean = false;
  stayBackList:any = [];
  favCount:number=0;
  PersonalInfo!: any;
  ehitlabelIsShow:boolean=true;
  imagewhitlabeldomainname:any
  constructor(private pageFacade: PageFacadeService,  private userManagementService: UserManagementService, private courseList: CourseListService, private fb: FormBuilder, private toastr: MessageService, private router: Router, private authService: AuthService) {
    this.filterForm = this.fb.group({
      study_level: [''],
      college_name: [''],
      country: [''],
      campus: [''],
      subject: [''],
      duration: [''],
      intake_months: [''],
      stay_back: [''],
      world_rank: [''],
    });
  }

  ngOnInit(): void {
    this.imagewhitlabeldomainname=window.location.hostname;
    if (this.imagewhitlabeldomainname === "dev-student.uniprep.ai" || this.imagewhitlabeldomainname === "uniprep.ai" || this.imagewhitlabeldomainname === "localhost") {
      this.ehitlabelIsShow=true;
    }else{
      this.ehitlabelIsShow=false;
    }
    this.checkplanExpire();
    this.getCourseLists();
    this.getSelectBoxValues();
    this.GetPersonalProfileData();
  }
  GetPersonalProfileData() {
    this.userManagementService.GetUserPersonalInfo().subscribe(data => {
      this.PersonalInfo = data;
    });
  }
  bookmarkQuestion(courseId: any, isFav: any) {
    isFav = isFav != '1' ? true : false;
    this.favCount=isFav == true ? this.favCount+1 : this.favCount-1;
    // console.log(312);
    this.courseList.bookmarkCourseData(courseId, this.PersonalInfo.user_id, isFav).subscribe((response) => {
      // console.log(31);
      let courseListData = this.courseListData.find((item : any) => item.id == courseId);
      isFav == true ? courseListData.favourite = 1 : courseListData.favourite = null;
      this.toastr.add({
        severity: "success",
        summary: "Success",
        detail: response.message,
      });
    });
  }
  openVideoPopup(videoLink: string) {
    this.pageFacade.openHowitWorksVideoPopup(videoLink);
  }

  getSelectBoxValues() {
    this.courseList.loadDropdownValues().subscribe(res => {
      // console.log(res);
      this.countryList = res.country;
      this.allLocations = res.locations;
      this.allUniversityList = res.university_name;
      this.stayBackList = res.stay_back;
      this.universityNameList = this.allUniversityList;
      this.subjectNameList = res.subject;
      this.durationList = res.duration;
    });
  }

  countrySelect(){
    let selectedCountry = this.filterForm.value.country;
    this.locationList = this.allLocations.filter((item:any) =>{
      return selectedCountry === item.country_id;
    });

    this.universityNameList = this.allUniversityList.filter((item:any) =>{
      return selectedCountry === item.country_id;
    });
    // console.log(this.universityNameList);
  }

  locationSelect(){
    let selectedLocation = this.filterForm.value.campus;
    console.log(selectedLocation);
    this.universityNameList = this.allUniversityList.filter((item:any) =>{
      return selectedLocation === item.location_id;
    });
    // console.log(this.universityNameList);
  }

  getCourseLists() {
    let formValues = this.filterForm.value;
    let data = {
      study_level: formValues.study_level ? formValues.study_level : "",
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

    this.courseList.getListOfCourses(data).subscribe(response => {
      this.courseListData = response.data;
      this.totalCourseCount = response.total_count;
      this.buyCreditsCount = response.credit_count;
    })
  }

  submitFilter() {
    let formValues = this.filterForm.value;
    if (!formValues.course_name && !formValues.college_name && !formValues.country && !formValues.campus && !formValues.subject && !formValues.duration && !formValues.intake_months && !formValues.stay_back && !formValues.world_rank) {
      this.toastr.add({ severity: 'error', summary: 'Error', detail: 'Please make sure you have some filter!' });
      return;
    }
    this.getCourseLists();
    this.isFilterVisible = 'none';
  }

  pageChange(event: any) {
    if (this.planExpired) {
      this.restrict = true;
      return;
    }
    this.page = event.page + 1;
    this.perPage = event.rows;
    this.getCourseLists();
  }

  closeGuidelines() {
    this.guidelinesDiv = !this.guidelinesDiv;
  }

  exportData() {
    if (this.planExpired) {
      this.restrict = true;
      return;
    }

    if (this.buyCreditsCount == 0) {
      this.toastr.add({ severity: "error", summary: "error", detail: "Please Buy Some Credits.", });
      setTimeout(() => {
        this.router.navigate(["/pages/export-credit"]);
      }, 300);
    } else {
      this.exportDataIds = [];
      this.courseListData.forEach((item: any) => {
        if (item.isChecked == 1) {
          this.exportDataIds.push(item.id);
        }
      });
      if (this.exportDataIds.length == 0) {
        this.toastr.add({ severity: "error", summary: "error", detail: "Select Some data for export!.", });
        return;
      }
      if (this.buyCreditsCount < this.exportDataIds.length) {
        this.toastr.add({ severity: "error", summary: "error", detail: "insufficient credits.Please Buy Some Credits.", });
        setTimeout(() => {
          this.router.navigate(["/pages/export-credit"]);
        }, 300);
        return;
      }
      let data = {
        module_id: 4,
        export_id: this.exportDataIds
      };

      this.courseList.exportSelectedData(data).subscribe((response) => {
        window.open(response.link, '_blank');
        this.selectAllCheckboxes = false;
        this.selectedCourses = 0;
        this.getCourseLists();
      })
    }
  }

  filterBy() {
    if (this.planExpired) {
      this.restrict = true;
      return;
    }
    this.isFilterVisible = "block";
  }

  handleClick(event: Event) {
    if (this.planExpired) {
      this.restrict = true;
      event.preventDefault();  // Prevent the default action of the anchor tag
    }
  }

  buyCredits() {
    if (this.planExpired) {
      this.restrict = true;
      return;
    }
    this.router.navigate(["/pages/export-credit"]);
  }

  getHref(jobSiteURL: string): string {
    const url = jobSiteURL;
    return !url.startsWith('http://') && !url.startsWith('https://') ? 'http://' + url : url;
  }

  clearFilter() {
    this.filterForm.reset();
    this.universityNameList = [];
    this.locationList = [];
    this.getCourseLists();
    this.getSelectBoxValues();
    
  }

  selectAllCheckbox() {
    this.selectedCourses = 0;
    this.selectAllCheckboxes = !this.selectAllCheckboxes;
    if (this.selectAllCheckboxes) {
      this.courseListData.forEach((item: any) => {
        item.isChecked = 1;
        this.selectedCourses += 1;
      })
    } else {
      this.courseListData.forEach((item: any) => {
        item.isChecked = 0;
      });
    }
  }

  onCheckboxChange(event: any) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.selectedCourses = isChecked ? this.selectedCourses + 1 : this.selectedCourses - 1;

    if (isChecked == false) {
      if (this.selectedCourses) {
        this.selectAllCheckboxes = false;
      }
    } else {
      if (this.courseListData.length == this.selectedCourses) {
        this.selectAllCheckboxes = true;
      }
    }
  }

  viewFav() {
    if (this.planExpired) {
      this.restrict = true;
      return;
    }

    this.viewFavourites = !this.viewFavourites;
    this.getCourseLists();
  }

  checkplanExpire(): void {
    this.authService.getNewUserTimeLeft().subscribe((res) => {
      let data = res.time_left;
      let subscription_exists_status = res.subscription_details;
      this.currentPlan = subscription_exists_status.subscription_plan;
      if (data.plan === "expired" || data.plan === 'subscription_expired' || subscription_exists_status.subscription_plan === 'free_trail' || subscription_exists_status.subscription_plan === 'Student') {
        this.planExpired = true;
      } else {
        this.planExpired = false;
      }
    });
  }
}
