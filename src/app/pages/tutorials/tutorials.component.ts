import { Component, OnInit } from '@angular/core';
import { TutorialsService } from './tutorials.service';

@Component({
  selector: 'uni-tutorials',
  templateUrl: './tutorials.component.html',
  styleUrls: ['./tutorials.component.scss']
})
export class TutorialsComponent implements OnInit {
  tutorials:any=[];
  tutoriallist:any=[];
  constructor(private resourceService: TutorialsService) { }

  ngOnInit(): void {
    this.resourceService.getResources().subscribe((response:any)=>{
      var tutorials= response.Tutorial;
      tutorials.forEach((element:any) => {
         var tutorial = {
          title: element.title,
          link: element.link,
          coverimage:element.coverimage,
          description:element.description
         }
         this.tutoriallist.push(tutorial);
      });
    });
  }

}
