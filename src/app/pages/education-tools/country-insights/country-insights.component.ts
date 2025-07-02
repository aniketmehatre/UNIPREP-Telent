import { Component, OnInit } from '@angular/core';
import { EducationToolsService } from '../education-tools.service';
import { CountryInsight } from 'src/app/@Models/country-insights.model';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CarouselModule } from 'primeng/carousel';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { CardModule } from 'primeng/card';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { StorageService } from "../../../storage.service";
import { Paginator, PaginatorModule } from 'primeng/paginator';
import { AuthService } from 'src/app/Auth/auth.service';
import { PageFacadeService } from '../../page-facade.service';
@Component({
  selector: 'uni-country-insights',
  templateUrl: './country-insights.component.html',
  styleUrls: ['./country-insights.component.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CarouselModule, ButtonModule, CommonModule, RouterModule, DialogModule, MultiSelectModule, SelectModule, CardModule, InputGroupModule, InputTextModule, PaginatorModule, InputGroupAddonModule]
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
  constructor(private educationtoolService: EducationToolsService, private router: Router,
    private storage: StorageService, private authService: AuthService, private pageFacade: PageFacadeService) { }

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
    if (this.authService.isInvalidSubscription('education_tools')) {
      this.authService.hasUserSubscription$.next(true);
      return;
    }
    this.storage.set('country_insights_country_name', countryname);
    this.router.navigate(['/pages/education-tools/country-insights', id, countryId]);
  }

  paginate(event: any) {
    if (this.authService.isInvalidSubscription('education_tools')) {
      this.authService.hasUserSubscription$.next(true);
      return;
    }
    this.data.page = event.page + 1;
    this.data.pageSize = event.rows;
    this.getList();
  }

  openVideoPopup(){
    this.pageFacade.openHowitWorksVideoPopup("country-insights");
  }
}
