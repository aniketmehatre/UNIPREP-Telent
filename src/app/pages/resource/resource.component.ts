import { Component, OnInit } from '@angular/core';
import { ResourceService } from './resource.service';
import { FormBuilder, FormGroup } from '@angular/forms';
interface country {
  id: number,
  country: string,
  flag: string,
  status: number,
  created_at: string,
  updated_at: string
};
@Component({
  selector: 'uni-resource',
  templateUrl: './resource.component.html',
  styleUrls: ['./resource.component.scss']
})
export class ResourceComponent implements OnInit {
  filterform:FormGroup;
  newfile = "none";
  countries: country[] = [];

  constructor(private fb: FormBuilder,private resourceService: ResourceService) { 
    this.filterform = this.fb.group({
      coutryname: ['']
    });
  }

  resources:any=[];
  resourceslist:any=[];
  selectedCountryId: any;

  ngOnInit(): void {
    this.resourceService.GetCountryList().subscribe((response) => {
      this.countries = response;
    });
    let data={
      coutryname:this.filterform.value.coutryname
    }
    this.getResources(data)
  }
  getResources(data:any){
    this.resourceslist=[]
    this.resourceService.getResources(data).subscribe((response:any)=>{
      var resources= response.resources;
      resources.forEach((element:any) => {
         var resource = {
          title: element.title,
          link: element.link,
          resourcedescription:element.resourcedescription,
          coverimage:element.coverimage,
          countryFlag:element.countryFlag,
          country:element.countryName
         }
         this.resourceslist.push(resource);
      });
    });
  }
  
  filtersubmit(){
    let data={
      coutryname:this.filterform.value.coutryname
    }
    this.getResources(data)
  }
  closenewfilePopup() {
    this.newfile = "none";
  }
    // filterpop-up
    filterPopUp(){
      this.newfile = "block";   
    }
}
