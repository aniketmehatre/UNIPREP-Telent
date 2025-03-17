import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Dialog } from 'primeng/dialog';
import { CompanyDetailComponent } from './company-detail/company-detail.component';
import { JobChatUiComponent } from '../job-tracker/job-chat-ui/job-chat-ui.component';
import { CompanyListsComponent } from './company-list/company-list.component';
import { RouterLink } from '@angular/router';
import {TalentConnectService} from "../talent-connect.service";

@Component({
  selector: 'uni-company-tracker',
  templateUrl: './company-tracker.component.html',
  styleUrls: ['./company-tracker.component.scss'],
  standalone: true,
  imports: [CommonModule, Dialog, CompanyListsComponent, CompanyDetailComponent, JobChatUiComponent, RouterLink]
})
export class CompanyTracker1Component {
  isSkeletonVisible: boolean = false;
  ehitlabelIsShow: boolean = false;
  restrict: boolean = false;
  howItWorksVideoLink: string = '';
  selectedJobId: number | null = null;
  openVideoPopup(link: string) {

  }
  page: number = 1;
  perPage: number = 10;

  currentPage: number = 1;
  itemsPerPage: number = 10;

  steps = [
    { label: 'Initial Round' },
    { label: 'HR Round' },
    { label: 'Selected' }
  ];

  showChat: boolean = false;
  orgnamewhitlabel: string = '';

  constructor(private talentConnectService: TalentConnectService,) { }

  ngOnInit(): void {
  }


  toggleInfo(): void {
    this.showChat = !this.showChat;
  }

  onClickJobId(event: number) {
    this.showChat = false;
    this.selectedJobId = event;
  }

  upgradePlan() {

  }
}
