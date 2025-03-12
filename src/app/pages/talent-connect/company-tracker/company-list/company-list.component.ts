import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { Dialog } from 'primeng/dialog';
import { PaginatorModule } from 'primeng/paginator';
import { TabsModule } from 'primeng/tabs';
import { TabView, TabViewModule } from 'primeng/tabview';

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
export class CompanyListsComponent {
  @Output() emitId: EventEmitter<number> = new EventEmitter();
  activeIndex: number = 1;
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
