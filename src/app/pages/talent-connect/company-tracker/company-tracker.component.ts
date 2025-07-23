import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { CompanyListsComponent } from './company-list/company-list.component';
import { RouterLink } from '@angular/router';
import { TalentConnectService } from "../talent-connect.service";
import { PageFacadeService } from '../../page-facade.service';
import { DrawerModule } from 'primeng/drawer';
import { Company } from 'src/app/@Models/company-connect.model';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'uni-company-tracker',
  templateUrl: './company-tracker.component.html',
  styleUrls: ['./company-tracker.component.scss'],
  standalone: true,
  imports: [CommonModule, DialogModule, CompanyListsComponent, RouterLink, DrawerModule, ButtonModule]
})
export class CompanyTracker1Component {
  @Output() companyTrackerEmit: EventEmitter<number> = new EventEmitter();
  @Output() triggerApplyFilter: EventEmitter<any> = new EventEmitter();

  isSkeletonVisible: boolean = false;
  selectedCompanyId: number | null = null;
  displayModal: boolean = false;
  studentIdForList: any;
  page: number = 1;
  perPage: number = 10;
  steps = [
    { label: 'Initial Round' },
    { label: 'HR Round' },
    { label: 'Selected' }
  ];
  showChat: boolean = false;
  visiblechat: boolean = false;
  visible: boolean = false;
  showInfo: boolean = false;
  companyDetails!: Company;
  companyTotalCount: number = 0;
  isAppliedFilter: boolean = false;

  constructor(private talentConnectService: TalentConnectService, private pageFacade: PageFacadeService) {

  }

  ngOnInit(): void {
  }

  toggleInfo(): void {
    this.showInfo = !this.showInfo;
  }

  onClickJobId(event: any) {
    if (event) {
      this.selectedCompanyId = event.id;
      this.getCompanyDetails();
    } else {
      this.showChat = false;
      this.showInfo = false;
    }
  }

  getCompanyDetails() {
    this.talentConnectService.getCompanyDetails(this.selectedCompanyId).subscribe({
      next: data => {
        this.companyDetails = data[0];
        this.isSkeletonVisible = false;
        this.showInfo = true;
      },
      error: err => {
        this.isSkeletonVisible = false;
        console.log(err);
      }
    });
  }

  onStudentIdRelay(id: number) {
    this.studentIdForList = id;
  }

  openVideoPopup() {
    this.pageFacade.openHowitWorksVideoPopup("company-tracker");
  }

  getCompanyTotalCount(data: any) {
    this.companyTotalCount = data?.companyCount;
    this.isAppliedFilter = data?.appliedFilter;
  }
}
