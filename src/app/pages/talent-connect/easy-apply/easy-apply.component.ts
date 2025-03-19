import { Component } from '@angular/core';
import { Form, FormBuilder, FormGroup } from '@angular/forms';
import { TalentConnectService } from '../talent-connect.service';

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
  page: number = 0;
  pageSize: number = 8;
  displayModal: boolean = false;
  filterForm: FormGroup = new FormGroup({});
  constructor(private fb: FormBuilder, private talentConnectService: TalentConnectService, private talenconnectService: TalentConnectService) { }
  ngOnInit(): void {
    this.getList();
    this.initializeForm();
    this.getOptionsList();
    this.getcurrencies();
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
      experienceLevel: [null]
    });
  }

  getcurrencies() {
    this.talenconnectService.getCurrencies().subscribe({
      next: (response: any) => {
        this.currencies = response;
      }
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
    });
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
    console.log('Resetting filters');
  }

  openVideoPopup(id: string) {}
}
