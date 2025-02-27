import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { PageFacadeService } from '../../page-facade.service';
import { DomSanitizer } from '@angular/platform-browser';
import { FounderstoolService } from '../founderstool.service';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { PaginatorModule } from 'primeng/paginator';
import {StorageService} from "../../../storage.service";
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
@Component({
    selector: 'uni-wealthleaderslist',
    templateUrl: './wealthleaderslist.component.html',
    styleUrls: ['./wealthleaderslist.component.scss'],
    standalone: true,
    imports: [SelectModule, CommonModule, RouterModule, FormsModule, ReactiveFormsModule, DialogModule, PaginatorModule, InputGroupModule, InputGroupAddonModule, InputTextModule],
})
export class WealthleaderslistComponent implements OnInit {
  valueNearYouFilter: string = '';
  filterForm:FormGroup
  wealthleaderlist:any[]=[];
  countries:any=[];
  newfile = "none";
  perpage: number = 50;
  pageno: number = 1;
  totalcount: number = 0;
  constructor(private router:Router,private pageFacade: PageFacadeService,private service: FounderstoolService,
              private storage: StorageService, private sanitizer: DomSanitizer,
    private fb: FormBuilder,
  ) {
    this.filterForm = this.fb.group({
      country: [''],
    });
   }

  ngOnInit(): void {
    this.getWealthLeaders();
    this.service.getCountry().subscribe((res:any)=>{
      this.countries=res
    })
  }
  goBack(){
    this.router.navigate(['/pages/education-tools']);
  }
  openVideoPopup(videoLink: string) {
    this.pageFacade.openHowitWorksVideoPopup(videoLink);
  }
  performSearch(){
    this.getWealthLeaders();
  }
  getWealthLeaders(){
    var data={
      page:this.pageno,
      perPage:this.perpage,
      country:this.filterForm.value.country,
      search:this.valueNearYouFilter
    }
    this.service.wealthLeadersList(data).subscribe((res)=>{
      this.wealthleaderlist=res.data;
      this.totalcount = res.total_count
      this.newfile = "none";
    })
  }
  filterPopUp(){
    this.newfile = "block";
  }
  resetFilter(){
    this.filterForm.reset();
    this.getWealthLeaders();
  }
  filtersubmit(){
    this.getWealthLeaders();
  }
  closenewfilePopup() {
    this.newfile = "none";
  }
  paginate(event: any) {
    this.pageno = event.page + 1;
    this.perpage = event.rows;
    this.getWealthLeaders();
  }
  viewReadAns(id:any,name:any){
    this.storage.set("wealthleadersname",name)
    this.router.navigate(['/pages/education-tools/wealthleaderreadanswer',id]);
  }
}
