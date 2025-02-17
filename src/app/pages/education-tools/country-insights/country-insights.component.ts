import { Component, OnInit } from '@angular/core';
import { EducationToolsService } from '../education-tools.service';
import { CountryInsight } from 'src/app/@Models/country-insights.model';
import { Router } from '@angular/router';

@Component({
  selector: 'uni-country-insights',
  templateUrl: './country-insights.component.html',
  styleUrls: ['./country-insights.component.scss']
})
export class CountryInsightsComponent implements OnInit {
  first = 0;
  page = 1;
  pageSize = 25;
  countryInsightsList: CountryInsight[] = [];
  countryInsightsCount: number = 0;
  isSkeletonVisible: boolean = false;
  data: any = {
    page: this.page,
    perpage: this.pageSize,
  };
  constructor(private educationtoolService: EducationToolsService, private router: Router) { }

  ngOnInit(): void {
    this.getList();
  }

  getList() { 
    this.isSkeletonVisible = true;
    this.educationtoolService.getCountryInsightsList(this.data).subscribe((response) => {
      this.isSkeletonVisible = false;
      this.countryInsightsList = response.data;
      this.countryInsightsCount = response.count;
    });
  }

  onClickSubModule(countryId: string, id: string, countryname: string) {
    console.log(id);
    localStorage.setItem('country_name', countryname);
    localStorage.setItem('country_insights_country', countryId);
    this.router.navigate(['/pages/education-tools/country-insights', id]);
  }

}
