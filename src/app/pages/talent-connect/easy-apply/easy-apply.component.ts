import { Component, inject, signal } from "@angular/core";
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from "@angular/forms";
import { TalentConnectService } from "../talent-connect.service";
import { MessageService } from "primeng/api";
import { ActivatedRoute, Router } from "@angular/router";
import { PageFacadeService } from "../../page-facade.service";
import { Meta } from "@angular/platform-browser";
import { SocialShareService } from "src/app/services/social-share.service";
import { AuthService } from "src/app/Auth/auth.service";
import { LocationService } from "src/app/services/location.service";
import { MultiSelectChangeEvent } from "primeng/multiselect";
import { JobListing } from "src/app/@Models/employee-connect-job.model";
import { environment } from "@env/environment";
import { LocalStorageService } from "ngx-localstorage";
import { error } from "jquery";
import { forkJoin, of } from "rxjs";
import { catchError, map } from "rxjs/operators";

@Component({
  selector: "uni-easy-apply",
  templateUrl: "./easy-apply.component.html",
  styleUrls: ["./easy-apply.component.scss"],
  standalone: false,
})
export class EasyApplyComponent {
  totalVacancies: string = "0";
  jobListings: JobListing[] = [];
  originalJobListings: JobListing[] = []; // Store original data for currency conversion
  locations: any[] = [];
  workModes: any[] = [];
  employmentTypes: any[] = [];
  experienceLevels: any[] = [];
  totalJobs: number = 0;
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
  page: number = 1;
  pageSize: number = 8;
  displayModal: boolean = false;
  first: number = 0;
  filterForm: FormGroup = new FormGroup({});
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

  //Service
  socialShareService = inject(SocialShareService);
  meta = inject(Meta);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private talentConnectService: TalentConnectService,
    private messageService: MessageService,
    private pageFacade: PageFacadeService,
    private authService: AuthService,
    private storage: LocalStorageService,
    private locationService: LocationService,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params["company"]) {
        this.getList({ company: params["company"] });
      } else {
        this.getList();
      }
    });
    this.initializeForm();
    this.getOptionsList();
    this.getCountries();
    // this.storage.set('jobId', '')
    // this.storage.set('position', '')
  }

  initializeForm() {
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
    }, { validators: this.salaryRangeValidator });

    // Listen to changes in salary fields to update validation
    this.filterForm.get('min_salary')?.valueChanges.subscribe(() => {
      this.filterForm.updateValueAndValidity({ emitEvent: false });
    });
    this.filterForm.get('max_salary')?.valueChanges.subscribe(() => {
      this.filterForm.updateValueAndValidity({ emitEvent: false });
    });
  }

  private salaryRangeValidator(control: AbstractControl): ValidationErrors | null {
    const minSalary = control.get('min_salary')?.value;
    const maxSalary = control.get('max_salary')?.value;

    // Only validate if both values are provided and are numbers
    if (minSalary !== null && minSalary !== "" && maxSalary !== null && maxSalary !== "") {
      const min = parseFloat(minSalary);
      const max = parseFloat(maxSalary);

      if (!isNaN(min) && !isNaN(max) && min > max) {
        return { salaryRangeInvalid: true };
      }
    }

    return null;
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

  getList(params?: any) {
    let data: any = {
      page: this.page,
      perPage: this.pageSize,
      city_id: this.authService._user?.city_id,
    };
    if (params) {
      data = { ...data, ...params };
    }
    this.talentConnectService.getJobList(data).subscribe({
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

        // Store original job listings for currency conversion
        this.originalJobListings = JSON.parse(JSON.stringify(this.jobListings));

        this.currencyList = response.jobs
          .filter((job: any) => job.salary_per_month) // optional: skip if salary is null/undefined
          .map((job: any) => ({
            id: job.id,
            salary_per_month: job.salary_per_month,
          }));
        this.isSkeletonVisible = false;
        if (this.selectedCurrency) {
          this.onCurrencyExchange({
            value: { currency_code: this.selectedCurrency },
          });
        }
      },
      error: (error) => {
        this.isSkeletonVisible = false;
        console.log(error);
      },
    });
  }

  getStatus(value: string) {
    return (
      value?.replace(/\s+/g, " ")?.trim()?.toLowerCase() === "future hiring"
    );
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
    // Check if form has validation errors
    if (this.filterForm.errors?.['salaryRangeInvalid']) {
      this.messageService.add({
        severity: "error",
        summary: "Validation Error",
        detail: "Minimum salary cannot be greater than maximum salary",
      });
      return;
    }

    this.getList(this.filterForm.value);
    this.displayModal = false;
    this.isAppliedFilter = true;
  }

  shareJobs() {
    // Check if form has validation errors
    if (this.filterForm.errors?.['salaryRangeInvalid']) {
      this.messageService.add({
        severity: "error",
        summary: "Validation Error",
        detail: "Minimum salary cannot be greater than maximum salary",
      });
      return;
    }

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

  openVideoPopup() {
    this.pageFacade.openHowitWorksVideoPopup("easy-apply");
  }

  onCurrencyExchange(event: any) {
    const convertTo = event.value.currency_code;
    this.selectedCurrency = convertTo;

    // Always use original job listings for conversion
    if (this.originalJobListings.length === 0) {
      this.originalJobListings = JSON.parse(JSON.stringify(this.jobListings));
    }

    const endDate = new Date(); // today
    const formattedEnd = endDate.toISOString().split("T")[0]; // 'YYYY-MM-DD'

    // Collect unique currencies to convert **from** using original data
    const uniqueCurrencies = [
      ...new Set(
        this.originalJobListings
          .map((job: any) => {
            const salaryStr = job?.salary_per_month || "";
            const match = salaryStr.match(/^([A-Z]{3})\s([\d,.]+)/);
            return match ? match[1] : null;
          })
          .filter(Boolean),
      ),
    ].filter((currency) => currency !== convertTo); // Skip if same currency

    // Reset to original before converting
    this.jobListings = JSON.parse(JSON.stringify(this.originalJobListings));

    if (uniqueCurrencies.length === 0) {
      // No conversion needed (all jobs already in target currency)
      return;
    }

    // Create conversion requests for all unique currencies
    const conversionRequests = uniqueCurrencies.map((convertFrom: any) =>
      this.talentConnectService
        .getCurrencyConverter(
          convertFrom,
          convertTo,
          formattedEnd,
          formattedEnd,
        )
        .pipe(
          map((data: any) => ({ convertFrom, data })),
          catchError((err) => {
            console.error(
              `Error fetching rate for ${convertFrom} → ${convertTo}:`,
              err,
            );
            return of({ convertFrom, data: null });
          }),
        ),
    );

    // Wait for all conversions to complete
    forkJoin(conversionRequests).subscribe({
      next: (results) => {
        // Create a map of conversion rates
        const rateMap = new Map<string, number>();
        results.forEach((result) => {
          if (result.data?.rates) {
            const today = new Date().toISOString().slice(0, 10);
            const ratesForToday = result.data.rates[today];
            if (ratesForToday) {
              const rate = Object.values(ratesForToday)[0] as number;
              rateMap.set(result.convertFrom, rate);
            }
          }
        });

        // Apply conversions to all jobs
        this.jobListings = this.jobListings.map((job: any, index: number) => {
          const originalJob = this.originalJobListings[index];
          const salaryStr = originalJob?.salary_per_month || "";
          const match = salaryStr.match(/^([A-Z]{3})\s([\d,.]+)/);

          if (match) {
            const currencyCode = match[1];
            const amount = parseFloat(match[2].replace(/,/g, ""));

            // If same currency, no conversion needed
            if (currencyCode === convertTo) {
              return job;
            }

            // Get conversion rate
            const rate = rateMap.get(currencyCode);
            if (rate && !isNaN(amount)) {
              const convertedAmount = (rate * amount).toFixed(2);
              return {
                ...job,
                salary_per_month: `${convertTo} ${convertedAmount}`,
              };
            }
          }
          return job;
        });
      },
      error: (err) => {
        console.error("Error in currency conversion:", err);
      },
    });
  }

  onClearCurrency(event: Event) {
    this.selectedCurrency = "";
    // Reset to original job listings when currency is cleared
    if (this.originalJobListings.length > 0) {
      this.jobListings = JSON.parse(JSON.stringify(this.originalJobListings));
    } else {
      this.getList({});
    }
  }

  showSocialSharingList(event: any, index: number) {
    event.stopPropagation();
    let socialShare: any = document.getElementById(
      "socialSharingList-" + index,
    );
    if (socialShare.style.display == "") {
      socialShare.style.display = "block";
    } else {
      socialShare.style.display =
        socialShare.style.display == "none" ? "block" : "none";
    }
  }

  shareQuestion(event: any, type: string, job: JobListing) {
    event.stopPropagation();
    const socialMedias: { [key: string]: string } =
      this.socialShareService.socialMediaList;
    let url: any;
    let domainName = this.storage.get("domainname");
    if (domainName) {
      url = encodeURI(
        environment.jobDomain + `/view/${job.uuid}/${domainName}`,
      );
    } else {
      url = encodeURI(environment.jobDomain + `/view/${job.uuid}`);
    }

    //const url = environment.jobDomain + '/view/' + job.uuid;
    //const encodedUrl = encodeURIComponent(url);
    const title = encodeURIComponent(
      "UNIPREP | " + job?.position + " | " + job.company_name,
    );

    this.meta.updateTag({ property: "og:url", content: url });
    this.meta.updateTag({ property: "og:title", content: title });
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
        environment.jobDomain + `/view/${job.uuid}/${domainName}`,
      );
    } else {
      textToCopy = encodeURI(environment.jobDomain + `/view/${job.uuid}`);
    }
    this.socialShareService.copyQuestion(
      textToCopy,
      "Job Link copied successfully",
    );
  }

  onClickJobCard(job: JobListing, event?: Event) {
    if (job.premium_users === 1) {
      event?.preventDefault();
      this.router.navigate(['/pages/subscriptions']);
    } else {
      this.router.navigate(['/pages/talent-connect/easy-apply', job.id]);
    }
  }

  onChangeLocation(event: MultiSelectChangeEvent, type: string) {
    const countryCtrl = this.filterForm.get("country");
    const locationCtrl = this.filterForm.get("worklocation");

    // if (type === "location") {
    //   // If work location is selected, disable and clear country
    //   if (event?.value?.length > 0) {
    //     countryCtrl?.setValue(null, { emitEvent: false });
    //     countryCtrl?.disable({ emitEvent: false });
    //   } else {
    //     // If work location is cleared, enable country
    //     countryCtrl?.enable({ emitEvent: false });
    //   }
    // } else if (type === "country") {
    //   // If country is selected, disable and clear work location
    //   if (event?.value?.length > 0) {
    //     locationCtrl?.setValue(null, { emitEvent: false });
    //     locationCtrl?.disable({ emitEvent: false });
    //   } else {
    //     // If country is cleared, enable work location
    //     locationCtrl?.enable({ emitEvent: false });
    //   }
    // }
  }

  shareQuestionFromFilter(event: any, type: string) {
    event.stopPropagation();
    this.talentConnectService
      .postJobShareData(this.filterForm.value)
      .subscribe({
        next: (res: any) => {
          const socialMedias: { [key: string]: string } =
            this.socialShareService.socialMediaList;
          let url = "https://job.uniprep.ai/jobs/" + res.data;
          const encodedUrl = encodeURIComponent(url);
          const title = "";

          this.meta.updateTag({ property: "og:url", content: url });
          // this.meta.updateTag({ property: 'og:title', content: title });
          let shareUrl = "";
          switch (type) {
            case "Whatsapp":
              shareUrl = `${socialMedias[type]}${title}%0A${encodedUrl}`;
              break;
            case "Mail":
              shareUrl = `${socialMedias[type]}${title}%0A${encodedUrl}`;
              break;
            case "LinkedIn":
              shareUrl = `${socialMedias[type]}${encodedUrl}&title=${title}`;
              break;
            case "Twitter":
              shareUrl = `${socialMedias[type]}${encodedUrl}&text=${title}`;
              break;
            case "Facebook":
              shareUrl = `${socialMedias[type]}${encodedUrl}`;
              break;
            case "Instagram":
              shareUrl = `${socialMedias[type]}${encodedUrl}`;
              break;
            default:
              shareUrl = `${socialMedias[type]}${encodedUrl}`;
          }
          window.open(shareUrl, "_blank");

          navigator.clipboard
            .writeText(shareUrl)
            .then(() => {
              this.messageService.add({
                severity: "success",
                summary: "Copied",
                detail: shareUrl,
              });
            })
            .catch((err) => {
              console.error("Failed to copy!", err);
            });
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  copyLinkFromFilter(event: any) {
    event.stopPropagation();
    this.talentConnectService
      .postJobShareData(this.filterForm.value)
      .subscribe({
        next: (res: any) => {
          const textToCopy = encodeURI(
            "https://job.uniprep.ai" + "/jobs/" + res.data,
          );
          navigator.clipboard
            .writeText(textToCopy)
            .then(() => {
              this.messageService.add({
                severity: "success",
                summary: "Copied",
                detail: textToCopy,
              });
            })
            .catch((err) => {
              console.error("Failed to copy!", err);
            });
        },
        error: (err) => {
          console.log(err);
        },
      });

    // const textToCopy = encodeURI('https://job.uniprep.ai' + '/view/' + job.uuid + '/' + this.domainName);
    // this.socialShareService.copyQuestion(textToCopy, 'Job Link copied successfully');
    // const jsonData = JSON.stringify(this.filterForm.value, null, 2);
    // let ency = btoa(jsonData.toString());
    // let url = "https://job.uniprep.ai/jobs/" + ency;
    // navigator.clipboard
    //   .writeText(url)
    //   .then(() => {
    //     this.messageService.add({
    //       severity: "success",
    //       summary: "Copied",
    //       detail: url,
    //     });
    //   })
    //   .catch((err) => {
    //     console.error("Failed to copy!", err);
    //   });
  }
}
