import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { PaginatorModule } from 'primeng/paginator';
import { TabsModule } from 'primeng/tabs';
import { TabViewModule } from 'primeng/tabview';
import { TalentConnectService } from "../../talent-connect.service";
import { CompanyFilterComponent } from '../../company-connect/company-filter/company-filter.component';
import { Company } from 'src/app/@Models/company-connect.model';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { AuthService } from 'src/app/Auth/auth.service';
@Component({
  selector: 'uni-company-list',
  standalone: true,
  imports: [TabsModule, TabViewModule, PaginatorModule, CommonModule, CompanyFilterComponent
  ],
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.scss']
})
export class CompanyListsComponent implements OnInit {
  @Input() displayModal: boolean = false;
  @Input() incomingStudentId!: number;
  @Input() incomingStudentIdLive!: number;
  @Output() companyTrackerEmit: EventEmitter<number> = new EventEmitter();
  @Output() triggerCloseFilter: EventEmitter<boolean> = new EventEmitter();
  @Output() onCompanyTotalCount: EventEmitter<any> = new EventEmitter<any>();

  tabs = [
    { label: 'All Companies', active: true },
    { label: 'Following', active: false },
    { label: 'Sent', active: false },
    { label: 'Recieved', active: false }
  ];
  activeIndex: number = 0;
  companyList: Company[] = [];
  page: number = 1;
  perPage: number = 10;
  companyCount: number = 0;
  totalPage: number = 0;
  companyId: any;
  private echo!: Echo<any>;
  studentId: any;
  companyObj: any;

  constructor(private talentConnectService: TalentConnectService, private courcelist: AuthService,) {
  }

  ngOnInit() {
    this.getCompanyTrackerList()
    this.courcelist.getMe().subscribe((res: any) => {
      this.studentId = res.employee_user_id
      window.Pusher = Pusher;
      this.echo = new Echo({
        broadcaster: 'pusher',
        key: '5b1022406406fbdcc0f9',
        cluster: 'ap2',
        forceTLS: true,
      });
      this.echo.channel(`company-connect-employer-chat-${this.studentId}`)
        .listen('CompanyConnectMessageSentEmployer', (event: any) => {
          if (event) {
            this.companyList = this.companyList.map((item: any) => {
              if (item.id === event.company_id) {
                return {
                  ...item,
                  notification_count: item.notification_count + 1
                };
              }
              return item;
            });

          }
        });
    })
  }

  getCompanyTrackerList(params?: any) {
    let isAppliedFilter = false;
    let data = {
      page: this.page,
      perpage: this.perPage,
    };
    if (params && Object.keys(params)?.length !== 0) {
      isAppliedFilter = true;
      data = { ...data, ...params };
    }
    this.talentConnectService.getCompanyTracker(data).subscribe({
      next: data => {
        this.companyList = data.companies;
        this.companyCount = data.count;
        this.totalPage = Math.ceil(data.count / this.perPage);
        this.triggerCloseFilter.emit(true);
        this.onCompanyTotalCount.emit({
          appliedFilter: isAppliedFilter,
          companyCount: data.count
        });
      },
      error: err => { }
    });

  }

  shortListedList(params?: any) {
    let isAppliedFilter = false;
    let data = {
      page: this.page,
      perpage: this.perPage,
    };
    if (params && Object.keys(params)?.length !== 0) {
      isAppliedFilter = true;
      data = { ...data, ...params };
    }
    this.talentConnectService.getShortListedCompanyList(data).subscribe({
      next: data => {
        this.companyList = data.companies;
        this.companyCount = data.count;
        this.totalPage = Math.ceil(data.count / this.perPage);
        this.triggerCloseFilter.emit(true);
        this.onCompanyTotalCount.emit({
          appliedFilter: isAppliedFilter,
          companyCount: data.count
        });
      },
      error: err => { }
    });
  }

  sendMessageList(params?: any) {
    let isAppliedFilter = false;
    let data = {
      page: this.page,
      perpage: this.perPage,
    };
    if (params && Object.keys(params)?.length !== 0) {
      isAppliedFilter = true;
      data = { ...data, ...params };
    }
    this.talentConnectService.getSendMessageCompanyTracker(data).subscribe({
      next: data => {
        this.companyList = data.companies;
        this.companyCount = data.count;
        this.totalPage = Math.ceil(data.count / this.perPage);
        this.triggerCloseFilter.emit(true);
        this.onCompanyTotalCount.emit({
          appliedFilter: isAppliedFilter,
          companyCount: data.count
        });
      },
      error: err => { }
    });
  }

  receivedMessageList(params?: any) {
    let isAppliedFilter = false;
    let data = {
      page: this.page,
      perpage: this.perPage,
    };
    if (params && Object.keys(params)?.length !== 0) {
      isAppliedFilter = true;
      data = { ...data, ...params };
    }
    this.talentConnectService.getReceivedMessageCompanyTracker(data).subscribe({
      next: data => {
        this.companyList = data.companies;
        this.companyCount = data.count;
        this.totalPage = Math.ceil(data.count / this.perPage);
        this.triggerCloseFilter.emit(true);
        this.onCompanyTotalCount.emit({
          appliedFilter: isAppliedFilter,
          companyCount: data.count
        });
      },
      error: err => { }
    });
  }

  applyFilter(event: any) {
    this.companyObj = event;
    this.onClickJobCard(0);
    if (this.activeIndex == 0) {
      this.getCompanyTrackerList(this.companyObj);
    } else if (this.activeIndex == 1) {
      this.shortListedList(this.companyObj);
    } else if (this.activeIndex == 2) {
      this.sendMessageList(this.companyObj);
    } else if (this.activeIndex == 3) {
      this.receivedMessageList(this.companyObj);
    }
  }

  onNextClick() {
    if (this.page >= this.totalPage) {
      return;
    }
    this.page = this.page + 1;
    this.applyFilter(this.companyObj);
  }

  onBackClick() {
    if (this.page == 1) {
      return;
    }
    this.page = this.page - 1;
    this.applyFilter(this.companyObj);
  }

  onTabChange(event: any) {
    this.page = 1;
    this.activeIndex = event.index;
    this.applyFilter(this.companyObj);
  }

  getStatusClass(status: string): string {
    const statusClassMap: { [key: string]: string } = {
      Sent: 'bg-primary text-white',
      Following: 'bg-success text-white',
      Received: 'bg-secondary text-white',
    };
    return statusClassMap[status] || 'bg-secondary text-white';
  }

  onClickJobCard(id: number) {
    this.companyId = id;
    this.companyTrackerEmit.emit(id);
  }
  
  ngOnChanges(changes: SimpleChanges) {
    if (changes['incomingStudentId'] && changes['incomingStudentId'].currentValue) {
      const count = changes['incomingStudentId'].currentValue;
      console.log(count);

      this.companyList = this.companyList.map((item: any) => {
        if (item.id === this.companyId.id && item.notification_count >= 1) {
          return {
            ...item,
            notification_count: count == 1 ? 0 : count
          };
        }
        return item;
      });
    }
  }

}
