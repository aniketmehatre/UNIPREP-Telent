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

  constructor(private pageFacade: PageFacadeService, private router: Router, private service: FounderstoolService, private locationService: LocationService) { }
  countrylist: any[] = [];
  currentRoute: string = '';
  headertooltipname: any;
  isShowCountryData: boolean = true;
  countrydatas: any[] = [];
  modename: any;
  questuionanswerlist:any[]=[];
  ngOnInit(): void {
    this.locationService.dashboardLocationList().subscribe((res: any) => {
      this.countrylist = res
    })
    this.currentRoute = this.router.url;
    if (this.currentRoute.includes('startup-funding-hacks')) {
      this.headertooltipname = "Startup Funding Hacks"
      this.modename = "startup_funding_hacks";
    } else if (this.currentRoute.includes('founder-success-stories')) {
      this.headertooltipname = "Founder-Success-Stories"
      this.modename="founder_success_stories";
    } else if (this.currentRoute.includes('founder-failure-stories')) {
      this.modename="founder_failure_stories";
      this.headertooltipname = "Founder-Failure-Stories"
    } else if (this.currentRoute.includes('startup-success-stories')) {
      this.modename="startup_success_stories";
      this.headertooltipname = "Startup Success Stories"
    } else if (this.currentRoute.includes('startup-failure-stories')) {
      this.headertooltipname = "Startup Failure Stories"
      this.modename="startup_failure_stories";
    }
  }
  openVideoPopup(videoLink: string) {
    this.pageFacade.openHowitWorksVideoPopup(videoLink);
  }
  goBack() {
    if (this.isShowCountryData) {
      this.router.navigate(["/pages/founderstool/founderstoollist"])
    } else {
      this.isShowCountryData = true;
    }
  }
  showDatas(data: any) {
    // get all country ,question, answer api 
    var datas = {
      mode: this.modename,
      country:data.id
    }
    this.service.entrepreneurToolsSuccess(datas).subscribe((res: any) => {
      // this.countrylist = res
      this.isShowCountryData = false;
      this.questuionanswerlist=res.data
    })
    
  }
  showDataAnswer(data: any) {

  }
}
