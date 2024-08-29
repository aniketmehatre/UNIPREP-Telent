import { Component, OnInit } from '@angular/core';
import { PitchDeskService } from "./pitch-desk.service";
import { FormBuilder, FormGroup } from "@angular/forms";
import { AuthService } from 'src/app/Auth/auth.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DataService } from 'src/app/data.service';
import { PageFacadeService } from '../page-facade.service';
import { UserManagementService } from "../user-management/user-management.service";
import { LocationService } from 'src/app/location.service';

@Component({
  selector: 'uni-pitch-desk',
  templateUrl: './pitch-desk.component.html',
  styleUrls: ['./pitch-desk.component.scss']
})
export class PitchDeskComponent implements OnInit {
  pitchDeskList: any[] = [];
  page = 1;
  pageSize = 50;
  totalPitchDeckCount = 0;
  isFilterVisible: string = 'none';
  filterForm: FormGroup;
  countrySelectBox:any = [];
  fundingTypeSelectBox:any = [];
  sectorSelectBox:any = [];
  valueNearYouFilter:string ="";
  showDiv: boolean = true;
  restrict: boolean = false;
  planExpired!: boolean;
  currentPlan: string = "";
  selectAllCheckboxes: boolean = false;
  selectedCheckboxCount: number = 0;
  exportCreditCount: number = 0;
  exportDataIds:any = [];
  isPdfLoaded: boolean = false;
  favCount:number=0;
  PersonalInfo!: any;
  viewFavourites: boolean = false;
  ehitlabelIsShow:boolean=true;
  imagewhitlabeldomainname:any
  orgnamewhitlabel:any;
  orglogowhitelabel:any;
  constructor(private pitchDesk:PitchDeskService,  private userManagementService: UserManagementService, private fb: FormBuilder,private router: Router,private authService: AuthService, private toast: MessageService, private dataService: DataService, private pageFacade: PageFacadeService,private locationService: LocationService,) { 
    this.filterForm = this.fb.group({
      pitchdeck_name: [''],
      country: [''],
      funding_type: [''],
      sector: [''],
    });
  }

  ngOnInit(): void {
    this.locationService.getImage().subscribe(imageUrl => {
      this.orglogowhitelabel = imageUrl;
    });
    this.locationService.getOrgName().subscribe(orgname => {
      this.orgnamewhitlabel = orgname;
    });
    this.imagewhitlabeldomainname=window.location.hostname;
    if (this.imagewhitlabeldomainname === "dev-student.uniprep.ai" || this.imagewhitlabeldomainname === "uniprep.ai" || this.imagewhitlabeldomainname === "localhost") {
      this.ehitlabelIsShow=true;
    }else{
      this.ehitlabelIsShow=false;
    }
    this.getPitchDeskList();
    this.checkplanExpire();
    this.selectBoxValues();
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
    console.log( this.PersonalInfo.user_id);
    this.pitchDesk.bookmarkCourseData(courseId, this.PersonalInfo.user_id, isFav).subscribe((response) => {
      console.log(31);
      let pitchListData = this.pitchDeskList.find((item : any) => item.id == courseId);
      isFav == true ? pitchListData.favourite = 1 : pitchListData.favourite = null;
      this.toast.add({
        severity: "success",
        summary: "Success",
        detail: response.message,
      });
    });
  }
  viewFav() {
    //if (this.planExpired) {
   //   this.restrict = true;
   //   return;
   // }
    this.viewFavourites = !this.viewFavourites;
    this.getPitchDeskList();
  }
  getPitchDeskList(){
    let data = {
      pitchdeck_name: this.filterForm.value.pitchdeck_name ? this.filterForm.value.pitchdeck_name : '',
      country: this.filterForm.value.country ? this.filterForm.value.country : '',
      funding_type: this.filterForm.value.funding_type ? this.filterForm.value.funding_type : '',
      sector: this.filterForm.value.sector ? this.filterForm.value.sector : '',
      page: this.page,
      perpage: this.pageSize,
      planname:this.currentPlan?this.currentPlan:"",
      favourites: this.viewFavourites ? this.viewFavourites : "",
    }
    this.pitchDesk.getPitchDeskData(data).subscribe((responce)=>{
      this.totalPitchDeckCount = responce.total_count;
      this.pitchDeskList = responce.data;
      this.exportCreditCount = responce.credit_count ? responce.credit_count : 0;
    });
    this.isFilterVisible = 'none'
  }

  selectBoxValues(){
    this.pitchDesk.getSelectBoxValues().subscribe((responce)=>{
      
      this.countrySelectBox = responce.country;
      this.fundingTypeSelectBox = responce.funding_type;
      this.sectorSelectBox = responce.sectors;
    });
  }

  pageChange(event: any){
    if (this.planExpired) {
      this.restrict = true;
      return;
    }
    this.page = event.page + 1;
    this.pageSize = event.rows;
    this.getPitchDeskList();
  }

  filterBy(){
    if (this.planExpired) {
      this.restrict = true;
      return;
    }
    this.isFilterVisible = 'block';
  }

  clearFilter() {
    this.filterForm.reset();
    this.getPitchDeskList();
  }

  performSearch() {
    if (this.valueNearYouFilter == "") {
      this.getPitchDeskList();
      return;
    }
    var investorSearchData: any = [];
    this.pitchDeskList.filter(item => {
      if (item.pitchdeck_name?.toLowerCase().includes(this.valueNearYouFilter.toLowerCase())) {
        investorSearchData.push(item);
      };
    });
    this.pitchDeskList = [...investorSearchData];
  }

  closeGuidelines(){
    this.showDiv = !this.showDiv;
  }
  pdfURL: any
  isPdfDownloadOption: any
  showPdf(url: any){
    this.pdfURL = url;
    this.isPdfLoaded = true;

    if (!this.planExpired && this.exportCreditCount != 0) {
      this.isPdfDownloadOption = true;
    }else{
      this.isPdfDownloadOption = false
    }

    //window.open(url, "_blank");
  }
  
  download(): void {
    const parts = this.pdfURL.split('/');
    const lastPart = parts[parts.length - 1];
  
    // Wrap the asynchronous operation in a Promise
    new Promise<void>((resolve) => {
      this.pitchDesk.downloadPdf(this.pdfURL, lastPart);
      resolve(); // Resolve the Promise once the operation is complete
    }).then(() => {
      // After the PDF is downloaded, make the second API call
      if(this.exportCreditCount != 0){
        let data = {
          module_id: 6
        };
        this.pitchDesk.singleCreditReduce(data).subscribe(() => {
          // Both API calls completed successfully
          this.getPitchDeskList();
          if (!this.planExpired && this.exportCreditCount != 0) {
            this.isPdfDownloadOption = true;
          }else{
            this.isPdfDownloadOption = false
          }
        }, error => {
          // Handle errors from the second API call
          console.error('Error while downloading document:', error);
        });
      }
    }).catch(error => {
      // Handle errors from the first API call
      console.error('Error while reduce the credit:', error);
    });
  }

  goBack(){
    this.isPdfLoaded = false;
  }

  clearRestriction() {
    this.restrict = false;
  }
  
  upgradePlan(): void {
    this.router.navigate(["/pages/subscriptions"]);
  }

  checkplanExpire(): void {
    this.authService.getNewUserTimeLeft().subscribe((res) => {
      let data = res.time_left;
      let subscription_exists_status = res.subscription_details;
      this.currentPlan = subscription_exists_status.subscription_plan;
      if (data.plan === "expired" || data.plan === 'subscription_expired' ||
          subscription_exists_status.subscription_plan === 'free_trail' ||
          subscription_exists_status.subscription_plan === 'Student' ||
          subscription_exists_status.subscription_plan === 'Career') {
        this.planExpired = true;
        //this.restrict = true;
      } else {
        this.planExpired = false;
        //this.restrict = false;
      }
      this.getPitchDeskList();
    })
  }

  buyCredits(): void{
    if (this.planExpired) {
      this.restrict = true;
      return;
    }
    this.router.navigate(["/pages/export-credit"]);
  }

  onCheckboxChange(event: any){
    const isChecked = (event.target as HTMLInputElement).checked;
    this.selectedCheckboxCount = isChecked ? this.selectedCheckboxCount + 1 : this.selectedCheckboxCount - 1;

    if(isChecked == false){
      if(this.selectedCheckboxCount){
        this.selectAllCheckboxes = false;
      }
    }else{
      if(this.pitchDeskList.length == this.selectedCheckboxCount){
        this.selectAllCheckboxes = true;
      }
    }
  }

  selectAllCheckbox(){
    this.selectedCheckboxCount = 0;
    this.selectAllCheckboxes = !this.selectAllCheckboxes;
    if(this.selectAllCheckboxes){
      this.pitchDeskList.forEach(item=>{
        item.isChecked = 1;
        this.selectedCheckboxCount +=1;
      });
    }else{
      this.pitchDeskList.forEach(item=>{
        item.isChecked = 0;
      });
    }
  }

  exportData(){
    if (this.planExpired) {
      this.restrict = true;
      return;
    }else if(this.exportCreditCount != 0){
      this.exportDataIds = [];
      this.pitchDeskList.forEach(item=>{
        if(item.isChecked == 1){
          this.exportDataIds.push(item.id);
        }
      })
      if(this.exportDataIds.length == 0){
        this.toast.add({severity: "error",summary: "error",detail: "Select Some data for export!.",});
        return;
      }
      if (this.imagewhitlabeldomainname === "dev-student.uniprep.ai" || this.imagewhitlabeldomainname === "uniprep.ai" || this.imagewhitlabeldomainname === "localhost") {
        if(this.exportCreditCount < this.exportDataIds.length){
          this.toast.add({severity: "error",summary: "error",detail: "insufficient credits.Please Buy Some Credits.",});
          this.router.navigate(["/pages/export-credit"]);
          return;
        }
      }else{
        if(this.exportCreditCount < this.exportDataIds.length){
        this.toast.add({severity: "error",summary: "error",detail: "To download additional data beyond your free credits, please upgrade your plan.",});
        return;
      }
    }
      let data={
        module_id: 6,
        export_id: this.exportDataIds
      };
      this.pitchDesk.exportSelectedData(data).subscribe((response)=>{
        window.open(response.link, '_blank');
        this.selectAllCheckboxes = false;
        this.selectedCheckboxCount = 0;
        this.getPitchDeskList();
      })
    }else if(this.exportCreditCount == 0){
      this.toast.add({severity: "error",summary: "error",detail: "Please Buy Some Credits.",});
      this.router.navigate(["/pages/export-credit"]);
    }
    
  }

  openReport(){
    
    let data = {
      isVisible: true,
      reporttype:7,
      moduleId:7,
      report_mode: "other_module"
    };
    this.dataService.openReportWindow(data);
  }

  openVideoPopup(videoLink: string) {
    this.pageFacade.openHowitWorksVideoPopup(videoLink);
  }
}
