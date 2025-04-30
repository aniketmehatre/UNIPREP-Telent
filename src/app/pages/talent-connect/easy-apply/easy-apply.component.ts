import { Component } from '@angular/core';
import { Form, FormBuilder, FormGroup } from '@angular/forms';
import { TalentConnectService } from '../talent-connect.service';
import { MessageService } from 'primeng/api';

interface JobListing {
  id: number;
  company_logo: string;
  company_name: string;
  position: string;
  isVerified: boolean;
  matchedSkills: number;
  totalSkills: number;
  available_vacancies: number;
  worklocation: string;
  start_date: string;
  companySize: string;
  work_mode: string;
  employment_type: string;
  salary_offer: string;
  postedDate: string;
  total_applied: number;
  due_date: string;
  currency_code: string;
  isChecked: boolean;
}


@Component({
  selector: 'uni-easy-apply',
  templateUrl: './easy-apply.component.html',
  styleUrls: ['./easy-apply.component.scss'],
  standalone: false,
})
export class EasyApplyComponent {
  totalVacancies: string = '';
  jobListings: JobListing[] = [];
  industries: any[] = [];
  locations: any[] = [];
  workModes: any[] = [];
  employmentTypes: any[] = [];
  experienceLevels: any[] = [];
  totalJobs: number = 4;
  currencies: any[] = [];
  hiringStatuses: { id: string, name: string }[] = [{ id: 'Active', name: 'Actively Hiring' }, { id: 'InActive', name: 'Actively Not Hiring' }];
  introductionVideoTypes: { id: string, name: string }[] = [{ id: 'Yes', name: 'Mandatory' }, { id: 'No', name: 'Not Mandatory' }];
  page: number = 1;
  pageSize: number = 8;
  displayModal: boolean = false;
  first: number = 0;
  filterForm: FormGroup = new FormGroup({});
  constructor(private fb: FormBuilder, private talentConnectService: TalentConnectService, private messageService: MessageService) { }
  ngOnInit(): void {
    this.getList();
    this.initializeForm();
    this.getOptionsList();
    this.getCountries();
  }

  initializeForm() {
    this.filterForm = this.fb.group({
      keyword: [''],
      position: [''],
      industry: [null],
      worklocation: [null],
      work_mode: [null],
      employment_type: [null],
      currency: [],
      salary: [''],
      experienceLevel: [null],
      salary_currency: [null],
      hiringStatus: [null],
      intro: [null],
    });
  }

  getCountries() {
    this.talentConnectService.getEasyApplyWorkLocationList().subscribe(data => {
      this.locations = data.worklocations;
    });
  }

  getList(params?: any) {
    let data = {
      page: this.page,
      perPage: this.pageSize,
    }
    if (params) {
      data = { ...data, ...params }
    }
    this.talentConnectService.getJobList(data).subscribe({
      next: response => {
        if (!response.success) {
          this.messageService.add({
            severity: 'error',
            summary: 'Restricted',
            detail: response?.message
          });
        }
        this.jobListings = response.jobs;
        this.totalJobs = response.totaljobs;
        this.totalVacancies = response.totalvacancies;
      },
      error: error => {
        console.log(error);
      }
    });
  }

  getOptionsList() {
    this.talentConnectService.getJobListDropdown().subscribe(data => {
      this.industries = data?.industrytypes;
      this.experienceLevels = data.experiecelevel;
      this.workModes = data?.workmode;
      this.employmentTypes = data?.employmenttype;
      this.currencies = data?.currencycode;
      this.locations = data?.locations;
    });
  }

  onPageChange(event: any) {
    this.page = event.first / this.pageSize + 1;
    this.pageSize = event.rows;
    this.first = event.first;
    this.getList();
  }

  show(): void {
    this.displayModal = true;
  }

  applyFilter(): void {
    this.getList(this.filterForm.value);
    this.displayModal = false;
  }

  resetFilter(): void {
    this.getList({});
    this.displayModal = false;
    this.filterForm.reset();
  }

  openVideoPopup(id: string) {}
}
