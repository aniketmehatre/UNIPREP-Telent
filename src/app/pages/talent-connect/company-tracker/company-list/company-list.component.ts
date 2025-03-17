import { CommonModule } from '@angular/common';
import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { Dialog } from 'primeng/dialog';
import { PaginatorModule } from 'primeng/paginator';
import { TabsModule } from 'primeng/tabs';
import { TabView, TabViewModule } from 'primeng/tabview';
import {TalentConnectService} from "../../talent-connect.service";

@Component({
  selector: 'uni-company-list',
  standalone: true,
  imports: [
    TabsModule,
    TabViewModule,
    PaginatorModule,
    CommonModule],
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.scss']
})
export class CompanyListsComponent implements OnInit {
  @Output() emitId: EventEmitter<number> = new EventEmitter();
  activeIndex: number = 0;
  tabs = [
    { label: 'All Companies', active: true },
    { label: 'Shortlisted', active: false },
    { label: 'Sent', active: false },
    { label: 'Recieved', active: false }
  ];

  companyList: any = [
    {
      name: 'UNIABROAD Pvt. Ltd',
      location: 'Bangalore, India',
      code: '001',
      status: 'Sent',
      position:'Project Manager'
    },
    {
      name: 'UNIABROAD Pvt. Ltd',
      location: 'Bangalore, India',
      code: '001',
      status: 'Sent',
      position:'Project Manager'
    },
    {
      name: 'UNIABROAD Pvt. Ltd',
      location: 'Bangalore, India',
      code: '001',
      status: 'Sent',
      position:'Project Manager'
    },
    {
      name: 'UNIABROAD Pvt. Ltd',
      location: 'Bangalore, India',
      code: '001',
      status: 'Sent',
      position:'Project Manager'
    }
  ]

  page: number = 1;
  perPage: number = 10;

  constructor(private talentConnectService: TalentConnectService,) {
  }

  ngOnInit() {
    this.getCompanyTrackerList()
  }

  getCompanyTrackerList() {
    const requestData = {
      perpage: this.perPage,
      page: this.page,
      companyname: "Test",
      industrytype: [2, 1],  // Converted to an array for better structure
      companysize: 1,
      hq: 2,
      globalpresence: [1, 2, 3], // Converted to an array
      foundedyear: 2002,
      companytype: 1
    };
    const requestDataEmpty = {
      perpage: this.perPage,
      page: this.page,
    };
    this.talentConnectService.getCompanyTracker(requestDataEmpty).subscribe({
      next: data => {
        console.log(data)
        this.companyList = data.companies

      },
      error: err => {}
    })

  }

  onTabChange(event: any) {
    this.activeIndex = event.index;
    if (this.activeIndex == 0) {
      this.getCompanyTrackerList()
    } else if (this.activeIndex == 1) {
      this.shortListedList()
    } else if (this.activeIndex == 2) {
      this.sendMessageList()
    } else if (this.activeIndex == 3) {
      this.receivedMessageList()
    }
  }

  shortListedList() {
    const requestData = {
      perpage: this.perPage,
      page: this.page,
      companyname: "Test",
      industrytype: [2, 1],  // Converted to an array for better structure
      companysize: 1,
      hq: 2,
      globalpresence: [1, 2, 3], // Converted to an array
      foundedyear: 2002,
      companytype: 1
    };
    const requestDataEmpty = {
      perpage: this.perPage,
      page: this.page,
    };
    this.talentConnectService.getShortListedCompanyList(requestDataEmpty).subscribe({
      next: data => {
        console.log(data)
        this.companyList = data.companies
      },
      error: err => {}
    })
  }

  sendMessageList() {
    const requestData = {
      perpage: this.perPage,
      page: this.page,
      companyname: "Test",
      industrytype: [2, 1],  // Converted to an array for better structure
      companysize: 1,
      hq: 2,
      globalpresence: [1, 2, 3], // Converted to an array
      foundedyear: 2002,
      companytype: 1
    };
    const requestDataEmpty = {
      perpage: this.perPage,
      page: this.page,
    };
    this.talentConnectService.getSendMessageCompanyTracker(requestDataEmpty).subscribe({
      next: data => {
        console.log(data)
        this.companyList = data.companies
      },
      error: err => {}
    })
  }

  receivedMessageList() {
    const requestData = {
      perpage: this.perPage,
      page: this.page,
      companyname: "Test",
      industrytype: [2, 1],  // Converted to an array for better structure
      companysize: 1,
      hq: 2,
      globalpresence: [1, 2, 3], // Converted to an array
      foundedyear: 2002,
      companytype: 1
    };
    const requestDataEmpty = {
      perpage: this.perPage,
      page: this.page,
    };
    this.talentConnectService.getReceivedMessageCompanyTracker(requestDataEmpty).subscribe({
      next: data => {
        console.log(data)
        this.companyList = data.companies
      },
      error: err => {}
    })
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Sent': return 'bg-primary text-white';
      case 'Shortlisted': return 'bg-success text-white';
      case 'Recieved': return  'bg-secondary text-white';
      default: return 'bg-secondary text-white';
    }
  }

  onClickJobCard(id: number) {
    this.emitId.emit(id);
  }

  selectTab(tab: any) {
    this.tabs.forEach(t => (t.active = false));
    tab.active = true;
  }
}
