import { Component, Output, EventEmitter, OnInit, Input } from '@angular/core';
import { TabViewModule } from "primeng/tabview";
import { CommonModule } from "@angular/common";
import { TalentConnectService } from '../../talent-connect.service';
import { PaginatorModule } from 'primeng/paginator';
import { TabsModule } from 'primeng/tabs';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { MultiSelectChangeEvent, MultiSelectModule } from 'primeng/multiselect';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { LocationService } from 'src/app/services/location.service';
import { Router } from '@angular/router';

@Component({
  selector: 'uni-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.scss'],
  standalone: true,
  imports: [TabsModule, TabViewModule, PaginatorModule, CommonModule, SelectModule, MultiSelectModule, InputNumberModule,
    DialogModule, ReactiveFormsModule, ButtonModule
  ]
})
export class JobListComponent implements OnInit {
  @Input() displayModal: boolean = false;
  @Output() emitId: EventEmitter<number> = new EventEmitter();
  @Output() closeFilter: EventEmitter<boolean> = new EventEmitter<boolean>(true);
  @Output() onJobTotalCount: EventEmitter<any> = new EventEmitter<any>();

  activeIndex: number = 0;
  first: number = 0;
  page: number = 1;
  pageSize: number = 10;
  totalPage: number = 0;
  jobDetails: any;
  appliedJobList!: any;
  filteredAppliedJob!: any;
  totalAppliedJobs: number = 0;
  industries: any[] = [];
  locations: any[] = [];
  workModes: any[] = [];
  employmentTypes: any[] = [];
  experienceLevels: any[] = [];
  currencies: any[] = [];
  countries: any[] = [];
  jobStatusList: any[] = [];
  tabs = [{ label: 'All Jobs', active: true }];
  hiringStatuses: { id: string, name: string }[] = [{ id: 'Active', name: 'Actively Hiring' }, { id: 'Future_Hiring', name: 'Future Hiring' }];
  hiringTypes: { id: number, name: string }[] = [{ id: 1, name: 'Company Hire' }, { id: 2, name: 'Co-Hire' }, { id: 3, name: 'Campus Hire' }];
  filterForm: FormGroup = new FormGroup({});
  isAppliedFilter: boolean = false;

  constructor(private talentConnectService: TalentConnectService, private fb: FormBuilder,
    private locationService: LocationService, private router: Router) {

  }

  ngOnInit(): void {
    this.initializeForm();
    this.getAppliedJobList();
    this.getOptionsList();
  }

  onClickJobCard(id: number) {
    this.router.navigate(['/pages/talent-connect/job-tracker', id])
  }

  selectTab(tab: any) {
    this.tabs.forEach(t => (t.active = false));
    this.tabs[tab].active = true;
    if (this.tabs[tab].label !== 'All Jobs') {
      this.filteredAppliedJob = this.appliedJobList.filter((item: any) => item.stage == this.tabs[tab].label);
    } else {
      this.filteredAppliedJob = this.appliedJobList;
    }
    this.page = 1;
  }

  getAppliedJobList(params?: any) {
    let isAppliedFilter = false;
    let data = {
      page: this.page,
      perPage: this.pageSize,
    }
    if (params) {
      isAppliedFilter = true;
      data = { ...data, ...params };
    }
    this.talentConnectService.getAppliedJobList(data).subscribe({
      next: response => {
        this.appliedJobList = response.jobs;
        this.filteredAppliedJob = response.jobs;
        this.totalAppliedJobs = response.totaljobs;
        this.tabs = [
          { label: 'All Jobs', active: true },
          ...response.hiringStages.map((item: any) => ({
            id: item.id,
            label: item.hiringstage,
            active: false
          }))
        ];
        this.jobStatusList = response.hiringStages;
        this.totalPage = Math.ceil(response.totaljobs / this.pageSize);
        this.onJobTotalCount.emit({
          appliedFilter: isAppliedFilter,
          jobCount: response.totaljobs
        });
        this.isAppliedFilter = isAppliedFilter;
      },
      error: error => {
        console.log(error);
      }
    });
  }


  onNextClick() {
    if (this.page >= this.totalPage) {
      return;
    }
    this.page = this.page + 1;
    this.getAppliedJobList(this.filterForm.value);
  }

  onBackClick() {
    if (this.page == 1) {
      return;
    }
    this.page = this.page - 1;
    this.getAppliedJobList(this.filterForm.value);
  }

  initializeForm() {
    this.filterForm = this.fb.group({
      keyword: [''],
      position: [''],
      industry: [null],
      country: [null],
      worklocation: [null],
      work_mode: [null],
      employment_type: [null],
      currency: [null],
      min_salary: [''],
      max_salary: [''],
      experienceLevel: [null],
      status: [null],
      hiringStatus: [null],
      hiring_type: [null]
    });
  }

  getJobTrackDetails(id: number) {
    this.talentConnectService.getJobDetails(id).subscribe({
      next: response => {
        this.jobDetails = response.job[0];
      },
      error: error => {
        console.log(error);
      }
    });
  }

  applyFilter(): void {
    const formData = this.filterForm.value;
    if (this.activeIndex !== 0) {
      formData.status = null;
    }
    this.getAppliedJobList(formData);
    this.displayModal = false;
    this.closeFilter.emit(true);
    this.emitId.emit(NaN);
    this.jobDetails = {};
  }

  resetFilter(): void {
    this.getAppliedJobList();
    this.displayModal = false;
    this.closeFilter.emit(true);
    this.jobDetails = {};
    this.filterForm.reset();
  }

  getOptionsList() {
    this.locationService.getHomeCountry(2).subscribe({
      next: res => {
        this.countries = res;
      }
    });
    this.talentConnectService.getEasyApplyWorkLocationList().subscribe(data => {
      this.locations = data.worklocations;
    });
    this.talentConnectService.getJobListDropdown().subscribe(data => {
      this.industries = data?.industrytypes;
      this.experienceLevels = data.experiecelevel;
      this.workModes = data?.workmode;
      this.employmentTypes = data?.employmenttype;
      this.currencies = data?.currencycode;
    });
  }

  onChangeLocation(event: MultiSelectChangeEvent, type: string) {
    if (type == 'location') {
      const contryCtrl = this.filterForm.get('country');
      event?.value?.length > 0 ? contryCtrl?.disable() : contryCtrl?.enable();
    }
    else {
      const locationCtrl = this.filterForm.get('worklocation');
      event?.value?.length > 0 ? locationCtrl?.disable() : locationCtrl?.enable();
    }
  }

}
