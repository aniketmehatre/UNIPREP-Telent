import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CompanyListsComponent } from './company-list/company-list.component';
import { PageFacadeService } from '../../page-facade.service';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'uni-company-tracker',
  templateUrl: './company-tracker.component.html',
  styleUrls: ['./company-tracker.component.scss'],
  standalone: true,
  imports: [CommonModule, CompanyListsComponent, ButtonModule]
})
export class CompanyTracker1Component {
  displayModal: boolean = false;
  companyTotalCount: number = 0;

  constructor(private pageFacade: PageFacadeService) {}

  openVideoPopup() {
    this.pageFacade.openHowitWorksVideoPopup("company-tracker");
  }

  getCompanyTotalCount(data: any) {
    this.companyTotalCount = data?.companyCount;
  }
}
