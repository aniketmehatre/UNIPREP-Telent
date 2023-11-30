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
  ngOnInit(): void {
    this.resourceService.getResources().subscribe((response:any)=>{
      var resources= response.resources;
      resources.forEach((element:any) => {
         var resource = {
          title: element.title,
          link: element.link,
          resourcedescription:element.resourcedescription
         }
         this.resourceslist.push(resource);
      });
    });
  }

}
