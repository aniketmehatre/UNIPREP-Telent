import { Component, ElementRef, Output, EventEmitter, OnInit, Input } from '@angular/core';
import { TabPanel, TabView, TabViewModule } from "primeng/tabview";
import { CommonModule, NgClass } from "@angular/common";
import { TalentConnectService } from '../../talent-connect.service';
import { Paginator, PaginatorModule } from 'primeng/paginator';
import { TabsModule } from 'primeng/tabs';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'uni-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.scss'],
  standalone: true,
  imports: [
    TabsModule,
    TabViewModule,
    PaginatorModule,
    CommonModule,
    SelectModule,
    MultiSelectModule,
    InputNumberModule,
    DialogModule,
    ReactiveFormsModule,
    ButtonModule
  ]
})
export class JobListComponent implements OnInit {
  @Output() emitId: EventEmitter<number> = new EventEmitter();
  @Input() displayModal: boolean = false;
  @Output() closeFilter: EventEmitter<boolean> = new EventEmitter<boolean>(true);

  activeIndex: number = 0;
  first: number = 0;
  page: number = 1;
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
  pageSize: number = 10;
  filterForm: FormGroup = new FormGroup({});
  totalPage: number = 0;

  tabs = [
    { label: 'All Jobs', active: true }
  ];

  constructor(private talentConnectService: TalentConnectService, private fb: FormBuilder) { }


  ngOnInit(): void {
    this.initializeForm();
    this.getAppliedJobList();
    this.getOptionsList();
  }

  onClickJobCard(id: number) {
    this.emitId.emit(id);
  }

  selectTab(tab: any) {
    console.log(this.tabs[tab].label);
    this.tabs.forEach(t => (t.active = false));
    this.tabs[tab].active = true;
    if (this.tabs[tab].label !== 'All Jobs') {
      this.filteredAppliedJob = this.appliedJobList.filter((item: any) => item.hiringstage == this.tabs[tab].label);
    } else {
      this.filteredAppliedJob = this.appliedJobList;
    }
    this.page = 1;
  }

  getAppliedJobList(params?: any) {
    const data = {
      page: this.page,
      perPage: this.pageSize,
      ...params
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
        this.totalPage = Math.ceil(response.totaljobs / this.pageSize);
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
    this.getAppliedJobList();
  }

  onBackClick() {
    if (this.page == 1) {
      return;
    }
    this.page = this.page - 1;
    this.getAppliedJobList();
  }

  initializeForm() {
    this.filterForm = this.fb.group({
      keyword: [''],
      position: [''],
      industry: [null],
      worklocation: [null],
      work_mode: [null],
      employment_type: [null],
      currency: ['INR'],
      salary: [''],
      experienceLevel: [null],
      status: ['']
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


  onPageChange(event: any) {
    this.page = event.first / this.pageSize + 1;
    this.pageSize = event.rows;
    this.first = event.first;
    this.getAppliedJobList();
  }

  applyFilter(): void {
    this.getAppliedJobList(this.filterForm.value);
    this.displayModal = false;
    this.closeFilter.emit(true);
    this.emitId.emit(NaN);
  }

  resetFilter(): void {
    this.getAppliedJobList();
    this.displayModal = false;
    this.closeFilter.emit(true);
  }

  getOptionsList() {
    this.talentConnectService.getEasyApplyWorkLocationList().subscribe(data => {
      this.locations = data.worklocations;
    });
    this.talentConnectService.getJobListDropdown().subscribe(data => {
      this.industries = data?.industrytypes;
      this.experienceLevels = data.experiecelevel;
      this.workModes = data?.workmode;
      this.employmentTypes = data?.employmenttype;
      this.currencies = data?.currencycode;
      // this.locations = data?.locations;
    });
  }


}
