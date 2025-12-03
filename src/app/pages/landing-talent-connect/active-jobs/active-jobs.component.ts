import { Component, inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { DialogModule } from "primeng/dialog";
import { TooltipModule } from "primeng/tooltip";
import { PaginatorModule } from "primeng/paginator";
import { LandingTalentService } from "../landing-page.service";
import { environment } from "@env/environment";
import { SocialShareService } from "src/app/services/social-share.service";
import { LocalStorageService } from "ngx-localstorage";
import { JobListing } from "src/app/@Models/employee-connect-job.model";
import { PopoverModule } from "primeng/popover";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { SelectModule } from "primeng/select";
import { MultiSelectModule } from "primeng/multiselect";
import { InputNumberModule } from "primeng/inputnumber";
import { InputTextModule } from "primeng/inputtext";
import { TalentConnectService } from "../../talent-connect/talent-connect.service";
import { MessageService } from "primeng/api";
import { AuthService } from "src/app/Auth/auth.service";
import { LocationService } from "src/app/services/location.service";

@Component({
  selector: "uni-active-jobs",
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    TooltipModule,
    DialogModule,
    PaginatorModule,
    PopoverModule,
    SelectModule,
    MultiSelectModule,
    InputTextModule,
    InputNumberModule,
    ReactiveFormsModule,
    PopoverModule,
    DialogModule,
    PaginatorModule,
    DialogModule,
    InputTextModule,
    MultiSelectModule,
    ButtonModule,
    ReactiveFormsModule,
    SelectModule,
    InputNumberModule,
    TooltipModule,
  ],
  templateUrl: "./active-jobs.component.html",
  styleUrl: "./active-jobs.component.scss",
})
export class ActiveJobsComponent implements OnInit {
  filterForm: FormGroup = new FormGroup({});
  jobListings: any;
  displayUnlockFilter: boolean = false;
  currentPage: number = 1;
  isShowEmpty: boolean = false;
  itemsPerPage: number = 9;
  first: number = 0;
  totalJobs: number = 100;
  socialShareService = inject(SocialShareService);
  page: number = 1;
  pageSize: number = 12;
  totalVacancies: number = 0;

  locations: any[] = [];
  workModes: any[] = [];
  employmentTypes: any[] = [];
  experienceLevels: any[] = [];
  currencies: any[] = [];
  hiringStatuses: { id: string; name: string }[] = [
    { id: "Active", name: "Actively Hiring" },
    { id: "Future_Hiring", name: "Future Hiring" },
  ];
  introductionVideoTypes: { id: string; name: string }[] = [
    { id: "Yes", name: "Mandatory" },
    { id: "No", name: "Not Mandatory" },
  ];
  jobTypes: { id: string; name: string }[] = [
    { id: "Standard", name: "Standard" },
    { id: "Premium", name: "Premium" },
  ];

  displayModal: boolean = false;
  currencyList: any[] = [];
  isSkeletonVisible: boolean = true;
  hiringTypes: { id: number; name: string }[] = [
    { id: 1, name: "Company Hire" },
    { id: 2, name: "Co-Hire" },
    { id: 3, name: "Campus Hire" },
  ];
  selectedCurrency: string = "";
  countries: any[] = [];
  industries: any[] = [];
  isAppliedFilter: boolean = false;

  constructor(
    private landingTalentService: LandingTalentService,
    private storage: LocalStorageService,
    private fb: FormBuilder,
    private talentConnectService: TalentConnectService,
    private messageService: MessageService,
    private authService: AuthService,
    private locationService: LocationService
  ) {
    this.filterForm = this.fb.group({
      keyword: [""],
      position: [""],
      industry: [null],
      country: [null],
      worklocation: [null],
      work_mode: [null],
      employment_type: [null],
      currency: [],
      min_salary: [""],
      max_salary: [""],
      experienceLevel: [null],
      salary_currency: [null],
      hiringStatus: [null],
      intro: [null],
      job_type: [null],
      hiring_type: [null],
    });
  }

  ngOnInit(): void {
    this.getStaticCardByType();
    this.getOptionsList();
    this.getCountries();
  }

  getCountries() {
    this.locationService.getHomeCountry(2).subscribe({
      next: (res) => {
        this.countries = res;
      },
    });
    this.talentConnectService.getEasyApplyWorkLocationList().subscribe({
      next: (res) => {
        this.locations = res.worklocations;
      },
    });
  }

  getStaticCardByType() {
    let data: any = {
      page: this.page,
      perPage: this.pageSize,
    };
    // let params = { company: "company" };
    // if (params) {
    //   data = { ...data, ...params };
    // }
    this.landingTalentService.getJobShareList(data).subscribe({
      next: (response) => {
        this.totalJobs = response.totaljobs;
        this.totalVacancies = response.totalvacancies;
        this.jobListings = response.jobs;
        this.jobListings = this.jobListings.map((data: any) => ({
          ...data,
          salary_per_month: data.salary_per_month
            ?.replace(/\/Month/i, "")
            .trim(),
        }));
        if (this.jobListings && this.jobListings.length < 0) {
          this.isShowEmpty = true;
        }
      },
      error: (error) => {
        this.isShowEmpty = true;
        console.error(error.error.message);
      },
    });
  }

  onPageChange(event: any) {
    this.currentPage = event.page + 1;
    this.itemsPerPage = event.rows;
    this.displayUnlockFilter = true;
    // this.loadTalentsData();
  }

  getStatus(value: string) {
    return (
      value?.replace(/\s+/g, " ")?.trim()?.toLowerCase() === "future hiring"
    );
  }

  shareQuestion(event: any, type: string, job: JobListing) {
    event.stopPropagation();
    const socialMedias: { [key: string]: string } =
      this.socialShareService.socialMediaList;
    let url: any;
    let domainName = this.storage.get("domainname");
    if (domainName) {
      url = encodeURI(
        environment.jobDomain + `/view/${job.uuid}/${domainName}`
      );
    } else {
      url = encodeURI(environment.jobDomain + `/view/${job.uuid}`);
    }

    //const url = environment.jobDomain + '/view/' + job.uuid;
    //const encodedUrl = encodeURIComponent(url);
    const title = encodeURIComponent(
      "UNIPREP | " + job?.position + " | " + job.company_name
    );

    // this.meta.updateTag({ property: "og:url", content: url });
    // this.meta.updateTag({ property: "og:title", content: title });
    let shareUrl = "";
    switch (type) {
      case "Whatsapp":
        shareUrl = `${socialMedias[type]}${title}%0A${url}`;
        break;
      case "Mail":
        shareUrl = `${socialMedias[type]}${title}%0A${url}`;
        break;
      case "LinkedIn":
        shareUrl = `${socialMedias[type]}${url}&title=${title}`;
        break;
      case "Twitter":
        shareUrl = `${socialMedias[type]}${url}&text=${title}`;
        break;
      case "Facebook":
        shareUrl = `${socialMedias[type]}${url}`;
        break;
      case "Instagram":
        shareUrl = `${socialMedias[type]}${url}`;
        break;
      default:
        shareUrl = `${socialMedias[type]}${url}`;
    }
    window.open(shareUrl, "_blank");
  }

  copyLink(event: any, job: any) {
    event.stopPropagation();
    let textToCopy: any;
    let domainName = this.storage.get("domainname");
    if (domainName) {
      textToCopy = encodeURI(
        environment.jobDomain + `/view/${job.uuid}/${domainName}`
      );
    } else {
      textToCopy = encodeURI(environment.jobDomain + `/view/${job.uuid}`);
    }
    this.socialShareService.copyQuestion(
      textToCopy,
      "Job Link copied successfully"
    );
  }

  onClickJob() {
    this.displayUnlockFilter = true;
  }

  applyFilter(): void {
    this.getList(this.filterForm.value);
    this.displayModal = false;
    this.isAppliedFilter = true;
  }

  resetFilter(): void {
    this.getList({});
    this.displayModal = false;
    this.filterForm.reset();
    this.isAppliedFilter = false;
  }

  getOptionsList() {
    this.talentConnectService.getJobListDropdown().subscribe((data) => {
      this.experienceLevels = data.experiecelevel;
      this.workModes = data?.workmode;
      this.employmentTypes = data?.employmenttype;
      this.currencies = data?.currencycode;
      this.industries = data?.industrytypes;
    });
  }

  getList(params?: any) {
    let data: any = {
      page: this.page,
      perPage: this.pageSize,
      city_id: this.authService._user?.city_id,
    };
    if (params) {
      data = { ...data, ...params };
    }
    this.landingTalentService.getJobShareList(data).subscribe({
      next: (response) => {
        if (!response.success) {
          this.messageService.add({
            severity: "error",
            summary: "Restricted",
            detail: response?.message,
          });
        }
        this.totalJobs = response.totaljobs;
        this.totalVacancies = response.totalvacancies;
        this.jobListings = response.jobs;
        this.jobListings = this.jobListings.map((data: JobListing) => ({
          ...data,
          salary_per_month: data.salary_per_month
            ?.replace(/\/Month/i, "")
            .trim(),
        }));

        this.currencyList = response.jobs
          .filter((job: any) => job.salary_per_month) // optional: skip if salary is null/undefined
          .map((job: any) => ({
            id: job.id,
            salary_per_month: job.salary_per_month,
          }));
        this.isSkeletonVisible = false;
        if (this.selectedCurrency) {
          // this.onCurrencyExchange({
          //   value: { currency_code: this.selectedCurrency },
          // });
        }
      },
      error: (error) => {
        this.isSkeletonVisible = false;
        console.log(error);
      },
    });
  }

  onChangeLocation(event: any, type: string) {
    if (type == "location") {
      const contryCtrl = this.filterForm.get("country");
      event?.value?.length > 0 ? contryCtrl?.disable() : contryCtrl?.enable();
    } else {
      const locationCtrl = this.filterForm.get("worklocation");
      event?.value?.length > 0
        ? locationCtrl?.disable()
        : locationCtrl?.enable();
    }
  }
}
