import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { PaginatorModule } from 'primeng/paginator';
import { TabsModule } from 'primeng/tabs';
import { TalentConnectService } from "../../talent-connect.service";
import { CompanyFilterComponent } from '../../company-connect/company-filter/company-filter.component';
import { Company } from 'src/app/@Models/company-connect.model';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { AuthService } from 'src/app/Auth/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'uni-company-list',
  standalone: true,
  imports: [TabsModule,  PaginatorModule, CommonModule, CompanyFilterComponent
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
    { value:0, label: 'All Companies', active: true },
    { value:1, label: 'Following', active: false },
    { value:2, label: 'Sent', active: false },
    { value:3, label: 'Recieved', active: false }
  ];
  activeTabValue = 0;
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
  isSkeletonVisible: boolean = true;
  isAppliedFilter: boolean = false;

  constructor(private talentConnectService: TalentConnectService, private courcelist: AuthService, private router: Router) {
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
    this.isSkeletonVisible = true;
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
        this.isAppliedFilter = isAppliedFilter;
        this.isSkeletonVisible = false;
      },
      error: err => { 
        this.isSkeletonVisible = false;
      }
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
    this.isSkeletonVisible = true;
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
        this.isAppliedFilter = isAppliedFilter;
        this.isSkeletonVisible = false;
      },
      error: err => { 
        this.isSkeletonVisible = false;
      }
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
    this.isSkeletonVisible = true;
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
        this.isAppliedFilter = isAppliedFilter;
        this.isSkeletonVisible = false;
      },
      error: err => { 
        this.isSkeletonVisible = false;
      }
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
    this.isSkeletonVisible = true;
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
        this.isAppliedFilter = isAppliedFilter;
        this.isSkeletonVisible = false;
      },
      error: err => { 
        this.isSkeletonVisible = false;
      }
    });
  }

  applyFilter(params: any = {}) {
    this.companyObj = params;
  
    if (this.activeIndex === 0) {
      this.getCompanyTrackerList(params);
    } else if (this.activeIndex === 1) {
      this.shortListedList(params);
    } else if (this.activeIndex === 2) {
      this.sendMessageList(params);
    } else if (this.activeIndex === 3) {
      this.receivedMessageList(params);
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
  
    // Always pass an empty object if no filter is applied yet
    this.applyFilter(this.companyObj || {});
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
    // this.companyId = id;
    // this.companyTrackerEmit.emit(id);
     this.router.navigate(['/pages/talent-connect/company-tracker', id]);
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
