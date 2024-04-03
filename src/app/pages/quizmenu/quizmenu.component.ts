import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModuleServiceService } from '../module-store/module-service.service';
import { LocationService } from 'src/app/location.service';
import { DataService } from 'src/app/data.service';

@Component({
  selector: 'uni-quizmenu',
  templateUrl: './quizmenu.component.html',
  styleUrls: ['./quizmenu.component.scss']
})
export class QuizmenuComponent implements OnInit {
  tooltip: any;
  currentModuleSlug: any;
  filterUniversityList: any[] = [];
  countryId: any;
  constructor(private router: Router,
    private locationService: LocationService,) { }

  ngOnInit(): void {
    this.countryId = Number(localStorage.getItem('countryId'));
    this.getFilterUniversityList(this.countryId)
  }
  startQuiz(modulename:any) {
    this.currentModuleSlug=modulename
    this.router.navigate([`/pages/modules/${this.currentModuleSlug}/quiz`]);
  }
  getFilterUniversityList(value: any) {
    this.locationService.getUniversity(value).subscribe((response) => {
      this.filterUniversityList = response;
      console.log(this.filterUniversityList);
      
    });
  }
}
