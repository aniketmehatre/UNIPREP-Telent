import { Component, OnInit } from '@angular/core';
import { ResourceService } from './resource.service';

@Component({
  selector: 'uni-resource',
  templateUrl: './resource.component.html',
  styleUrls: ['./resource.component.scss']
})
export class ResourceComponent implements OnInit {

  constructor(private resourceService: ResourceService) { }

  resources:any=[];
  resourceslist:any=[];
  selectedCountryId: any;
  ngOnInit(): void {
    this.selectedCountryId = localStorage.getItem('countryId');
    let data={
      coutryname:this.selectedCountryId
    }
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
}
