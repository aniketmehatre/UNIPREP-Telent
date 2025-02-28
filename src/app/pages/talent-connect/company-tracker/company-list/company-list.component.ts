import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'uni-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.scss']
})
export class CompanyListComponent {
  @Output() emitId: EventEmitter<number> = new EventEmitter();
  activeIndex: number = 1;
  tabs = [
    { label: 'All Companies', active: true },
    { label: 'Shortlisted', active: false },
    { label: 'Sent', active: false },
    { label: 'Recieved', active: false }
  ];

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
