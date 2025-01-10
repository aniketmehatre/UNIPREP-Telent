import { Component, OnInit } from '@angular/core';
import { PageFacadeService } from '../../page-facade.service';
import { Router } from '@angular/router';
import { LocationService } from 'src/app/location.service';
import { FounderstoolService } from '../founderstool.service';

@Component({
  selector: 'uni-component-stories',
  templateUrl: './component-stories.component.html',
  styleUrls: ['./component-stories.component.scss']
})
export class ComponentStoriesComponent implements OnInit {

  constructor(private pageFacade: PageFacadeService,private router:Router,private service: FounderstoolService,private locationService: LocationService) { }
 countrylist:any[]=[];
 currentRoute: string = '';
  ngOnInit(): void {
    this.locationService.dashboardLocationList().subscribe((res:any)=>{
      this.countrylist=res
    })
    this.currentRoute = this.router.url;
    console.log(this.currentRoute);
    
  }
  openVideoPopup(videoLink: string) {
    this.pageFacade.openHowitWorksVideoPopup(videoLink);
  }
  goBack(){
    this.router.navigate(["/pages/founderstool/founderstoollist"])
  }
}
