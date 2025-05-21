import { CommonModule } from '@angular/common';
import { Component, EventEmitter, input, Input, OnInit, Output, SimpleChanges } from '@angular/core';
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
  imports: [
    TabsModule,
    TabViewModule,
    PaginatorModule,
    CommonModule,
    CompanyFilterComponent
  ],
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.scss']
})
export class CompanyListsComponent implements OnInit {
  @Output() companyTrackerEmit: EventEmitter<number> = new EventEmitter();
  @Input() displayModal: boolean = false;
  @Output() triggerCloseFilter: EventEmitter<boolean> = new EventEmitter();
  @Input() incomingStudentId!: number;
  @Input() incomingStudentIdLive!: number;
  activeIndex: number = 0;
  tabs = [
    { label: 'All Companies', active: true },
    { label: 'Shortlisted', active: false },
    { label: 'Sent', active: false },
    { label: 'Recieved', active: false }
  ];

  companyList: Company[] = [];
  page: number = 1;
  perPage: number = 10;
  companyCount: number = 0;
  totalPage: number = 0;
  companyId: any;
  private echo!: Echo<any>;
  studentId: any;
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
    const requestData = {
      page: this.page,
      perpage: this.perPage,
      ...params
    };
    this.talentConnectService.getCompanyTracker(requestData).subscribe({
      next: data => {
        this.companyList = data.companies;
        this.companyCount = data.count;
        this.totalPage = Math.ceil(data.count / this.perPage);
        this.triggerCloseFilter.emit();
      },
      error: err => { }
    });

  }

  shortListedList(params?: any) {
    const requestData = {
      page: this.page,
      perpage: this.perPage,
      ...params
    };
    this.talentConnectService.getShortListedCompanyList(requestData).subscribe({
      next: data => {
        this.companyList = data.companies;
        this.companyCount = data.count;
        this.totalPage = Math.ceil(data.count / this.perPage);
        this.triggerCloseFilter.emit();
      },
      error: err => { }
    });
  }

  sendMessageList(params?: any) {
    const requestData = {
      page: this.page,
      perpage: this.perPage,
      ...params
    };
    this.talentConnectService.getSendMessageCompanyTracker(requestData).subscribe({
      next: data => {
        this.companyList = data.companies;
        this.companyCount = data.count;
        this.totalPage = Math.ceil(data.count / this.perPage);
        this.triggerCloseFilter.emit();
      },
      error: err => { }
    });
  }

  receivedMessageList(params?: any) {
    const requestData = {
      page: this.page,
      perpage: this.perPage,
      ...params
    };
    this.talentConnectService.getReceivedMessageCompanyTracker(requestData).subscribe({
      next: data => {
        this.companyList = data.companies;
        this.companyCount = data.count;
        this.totalPage = Math.ceil(data.count / this.perPage);
        this.triggerCloseFilter.emit();
      },
      error: err => { }
    });
  }

  applyFilter(event: any) {
    if (this.activeIndex == 0) {
      this.getCompanyTrackerList(event);
    } else if (this.activeIndex == 1) {
      this.shortListedList(event);
    } else if (this.activeIndex == 2) {
      this.sendMessageList(event);
    } else if (this.activeIndex == 3) {
      this.receivedMessageList(event);
    }
  }

  onNextClick() {
    if (this.page >= this.totalPage) {
      return;
    }
    this.page = this.page + 1;
    this.applyFilter({});
  }

  onBackClick() {
    if (this.page == 1) {
      return;
    }
    this.page = this.page - 1;
    this.applyFilter({});
  }

  onTabChange(event: any) {
    this.page = 1;
    this.activeIndex = event.index;
    this.applyFilter({});
  }

  getStatusClass(status: string): string {
    const statusClassMap: { [key: string]: string } = {
      Sent: 'bg-primary text-white',
      Shortlisted: 'bg-success text-white',
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
            notification_count: count==1?0:count
          };
        }
        return item;
      });
    }
  }

}
