import { CommonModule } from '@angular/common';
import {Component, EventEmitter, Output} from '@angular/core';
import { Dialog } from 'primeng/dialog';
import { CompanyDetailComponent } from './company-detail/company-detail.component';
import { CompanyListsComponent } from './company-list/company-list.component';
import { RouterLink } from '@angular/router';
import {TalentConnectService} from "../talent-connect.service";
import {ChatComponent} from "./chat/chat.component";

@Component({
  selector: 'uni-company-tracker',
  templateUrl: './company-tracker.component.html',
  styleUrls: ['./company-tracker.component.scss'],
  standalone: true,
  imports: [CommonModule, Dialog, CompanyListsComponent, CompanyDetailComponent, RouterLink, ChatComponent, ChatComponent]
})
export class CompanyTracker1Component {
  @Output() companyTrackerEmit: EventEmitter<number> = new EventEmitter();
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
  companyData: any
  onClickJobId(event: any) {
    this.companyData = event;
    this.showChat = false;
    this.selectedJobId = event.id;
  }

  upgradePlan() {

  }
}
