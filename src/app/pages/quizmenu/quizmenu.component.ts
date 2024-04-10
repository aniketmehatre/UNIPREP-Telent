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
  quizpercentagedata: any[] = []
  countryId: any;
  countryName!: string;
  universityId: any=null;
  universityquizbutton: boolean = true;
  constructor(private moduleListService: ModuleServiceService, private router: Router, private dataService: DataService,
    private locationService: LocationService,) { }

  ngOnInit(): void {
    this.countryId = Number(localStorage.getItem('countryId'));
    this.getFilterUniversityList(this.countryId)
    this.dataService.countryNameSource.subscribe((data) => {
      this.countryName = data;
    });
    this.checkquizquestionmodule()
  }
  startQuiz(moduleid: any) {
    if (moduleid == 1) {
      this.currentModuleSlug = "pre-admission"
    } else if (moduleid == 3) {
      this.currentModuleSlug = "post-admission"
    } else if (moduleid == 4) {
      this.currentModuleSlug = "career-hub"
    } else if (moduleid == 6) {
      this.currentModuleSlug = "life-at-country"
    }
    this.router.navigate([`/pages/modules/${this.currentModuleSlug}/quiz`]);
  }
  getFilterUniversityList(value: any) {
    this.locationService.getUniversity(value).subscribe((response) => {
      this.filterUniversityList = response;
    });
  }
  checkquizquestionmodule() {
    this.quizpercentagedata = []
    var data = {
      countryid: this.countryId
    }
    this.moduleListService.getQuizCompletion(data).subscribe((res) => {
      this.quizpercentagedata = res.modules.filter((obj: any) => obj.module_name !== "Travel And Tourism")
    })
  }
  startQuizUniversity() {
    this.currentModuleSlug="university"
    this.router.navigate([`/pages/modules/${this.currentModuleSlug}/quiz`]);
  }
  universityidcheck:[]=[]
  universityButtonVisible() {
    if (this.universityId != null) {
      this.universityquizbutton = false;
      localStorage.setItem('universityidforquiz', this.universityId)
    } else {
      this.universityquizbutton = true;
    }
  }
}
