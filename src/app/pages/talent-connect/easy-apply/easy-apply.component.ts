import { Component, inject, signal } from '@angular/core';
import { Form, FormBuilder, FormGroup } from '@angular/forms';
import { TalentConnectService } from '../talent-connect.service';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { PageFacadeService } from '../../page-facade.service';
import { Meta } from '@angular/platform-browser';
import { SocialShareService } from 'src/app/shared/social-share.service';

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
  salary_per_month: string;
  uuid: string;
  hiring_status: string;
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
  locations: any[] = [];
  workModes: any[] = [];
  employmentTypes: any[] = [];
  experienceLevels: any[] = [];
  totalJobs: number = 0;
  currencies: any[] = [];
  hiringStatuses: { id: string, name: string }[] = [{ id: 'Active', name: 'Actively Hiring' }, { id: 'Future_Hiring', name: 'Future Hiring' }];
  introductionVideoTypes: { id: string, name: string }[] = [{ id: 'Yes', name: 'Mandatory' }, { id: 'No', name: 'Not Mandatory' }];
  page: number = 1;
  pageSize: number = 8;
  displayModal: boolean = false;
  first: number = 0;
  filterForm: FormGroup = new FormGroup({});
  currencyOptions: any[] = [];
  applicantCurrencyCode = signal<string>('');
  applicantCurrencyValue = signal<number>(0);
  currencyList: any[] = [];
  isSkeletonVisible: boolean = true;
  hiringTypes: { id: number, name: string }[] = [{ id: 1, name: 'Company Hire' }, { id: 2, name: 'Co-Hire' }, { id: 3, name: 'Campus Hire' }];
  selectedCurrency: string = '';
  hiring_stages: string | Array<{ id: number; name: string }>;

  //Service
  socialShareService = inject(SocialShareService);
  meta = inject(Meta);

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private talentConnectService: TalentConnectService,
    private messageService: MessageService, private pageFacade: PageFacadeService) {

  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['company']) {
        this.getList({ company: params['company'] });
      } else {
        this.getList();
      }
    });
    this.initializeForm();
    this.getOptionsList();
    this.getCountries();


  }

  initializeForm() {
    this.filterForm = this.fb.group({
      keyword: [''],
      position: [''],
      worklocation: [null],
      work_mode: [null],
      employment_type: [null],
      currency: [],
      min_salary: [''],
      max_salary: [''],
      experienceLevel: [null],
      salary_currency: [null],
      hiringStatus: [null],
      intro: [null],
      hiring_type: [null]
    });
  }

  getCountries() {
    this.talentConnectService.getEasyApplyWorkLocationList().subscribe(data => {
      this.locations = [{ id: 0, work_location: "Any" }, ...data.worklocations];
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
        this.totalJobs = response.totaljobs;
        this.totalVacancies = response.totalvacancies;
        this.jobListings = response.jobs;
        this.jobListings = this.jobListings.map((data: JobListing) => ({
          ...data,
          salary_per_month: data.salary_per_month?.replace(/\/Month/i, '').trim()
        }));

        this.currencyList = response.jobs
          .filter((job: any) => job.salary_per_month) // optional: skip if salary is null/undefined
          .map((job: any) => ({
            id: job.id,
            salary_per_month: job.salary_per_month
          }));
        this.isSkeletonVisible = false;
        if (this.selectedCurrency) {
          this.onCurrencyExchange({ value: { currency_code: this.selectedCurrency } });
        }
      },
      error: error => {
        this.isSkeletonVisible = false;
        console.log(error);
      }
    });
  }

  getStatus(value: string) {
    return value?.replace(/\s+/g, ' ')?.trim()?.toLowerCase() === "future hiring";
  }

  getOptionsList() {
    this.talentConnectService.getJobListDropdown().subscribe(data => {
      this.experienceLevels = data.experiecelevel;
      this.workModes = data?.workmode;
      this.employmentTypes = data?.employmenttype;
      this.currencies = data?.currencycode;
    });
  }

  onPageChange(event: any) {
    this.page = event.first / this.pageSize + 1;
    this.pageSize = event.rows;
    this.first = event.first;
    this.getList(this.filterForm.value);
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

  openVideoPopup(videoLink: string) {
    this.pageFacade.openHowitWorksVideoPopup(videoLink)
  }

  onCurrencyExchange(event: any) {
    const convertTo = event.value.currency_code;
    this.selectedCurrency = convertTo;

    const endDate = new Date(); // today
    const formattedEnd = endDate.toISOString().split("T")[0]; // 'YYYY-MM-DD'

    // Collect unique currencies to convert **from**
    const uniqueCurrencies = [...new Set(
      this.currencyList.map((job: any) => {
        const match = job.salary_per_month.match(/^([A-Z]{3})\s([\d,.]+)/);
        return match ? match[1] : null;
      }).filter(Boolean)
    )];

    uniqueCurrencies.forEach((convertFrom: any) => {
      this.talentConnectService
        .getCurrencyConverter(convertFrom, convertTo, formattedEnd, formattedEnd)
        .subscribe({
          next: (data: any) => {
            this.jobListings = this.jobListings.map((job: any) => {
              const salaryStr = job?.salary_per_month || '';
              const match = salaryStr.match(/^([A-Z]{3})\s([\d,.]+)/);

              if (match) {
                const currencyCode = match[1]; // e.g., "INR"
                const amount = parseFloat(match[2].replace(/,/g, "")); // e.g., 30000.00
                const today = new Date().toISOString().slice(0, 10); // '2025-05-12'
                const ratesForToday = data.rates[today]; // { AED: 0.04157 }

                const currency = Object.keys(ratesForToday)[0]; // 'AED'
                const rate = ratesForToday[currency]; // 0.04157
                if (currencyCode === convertFrom) {
                  const convertedAmount = (rate * amount).toFixed(2);
                  return {
                    ...job,
                    salary_per_month: `${convertTo} ${convertedAmount}` // set at root
                  };
                }
              }
              // Return original job if no match or doesn't match convertFrom
              return job;
            });
          },
          error: (err) => console.error(`Error fetching rate for ${convertFrom} → ${convertTo}:`, err),
        });
    });
  }
  onClearCurrency(event: Event) {
    this.selectedCurrency = "";
    this.getList({});
  }

  showSocialSharingList(event: any, index: number) {
    event.stopPropagation();
    let socialShare: any = document.getElementById("socialSharingList-" + index);
    if (socialShare.style.display == "") {
      socialShare.style.display = "block";
    }
    else {
      socialShare.style.display = socialShare.style.display == "none" ? "block" : "none";
    }
  }

  shareQuestion(event: any, type: string, job: JobListing) {
    event.stopPropagation();
    const socialMedias: { [key: string]: string } = this.socialShareService.socialMediaList;
    const url = window.location.origin + '/job/' + job.uuid;
    const encodedUrl = encodeURIComponent(url);
    const title = encodeURIComponent('UNIPREP | ' + job?.position + ' | ' + job.company_name);

    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:title', content: title });
    let shareUrl = '';
    switch (type) {
      case 'Whatsapp':
        shareUrl = `${socialMedias[type]}${title}%0A${encodedUrl}`;
        break;
      case 'Mail':
        shareUrl = `${socialMedias[type]}${title}%0A${encodedUrl}`;
        break;
      case 'LinkedIn':
        shareUrl = `${socialMedias[type]}${encodedUrl}&title=${title}`;
        break;
      case 'Twitter':
        shareUrl = `${socialMedias[type]}${encodedUrl}&text=${title}`;
        break;
      case 'Facebook':
        shareUrl = `${socialMedias[type]}${encodedUrl}`;
        break;
      case 'Instagram':
        shareUrl = `${socialMedias[type]}${encodedUrl}`;
        break;
      default:
        shareUrl = `${socialMedias[type]}${encodedUrl}`;
    }
    window.open(shareUrl, '_blank');
  }

  copyLink(event: any, job: any) {
    event.stopPropagation();
    const textToCopy = encodeURI(window.location.origin + '/job/' + job.uuid);
    this.socialShareService.copyQuestion(textToCopy, 'Job Link copied successfully');
  }

}
