import {Component, OnInit} from '@angular/core';
import {JobSearchService} from "../job-search.service";
import {SalaryConverterService} from '../../job-tool/salary-converter/salary-converter.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {DataService} from 'src/app/data.service';
import {Router} from "@angular/router";
import {MessageService} from "primeng/api";

@Component({
    selector: 'uni-job-listing',
    templateUrl: './job-listing.component.html',
    styleUrls: ['./job-listing.component.scss']
})
export class JobListingComponent implements OnInit {
    jobs: any[] = [];
    fG: FormGroup;
    filterForm: FormGroup;
    query: string = 'developer';
    location: string = ''; // Default location
    numbers: number[] = Array(20).fill(0).map((x, i) => i + 1);
    fromCountry: any
    selectedFlag: any
    isDetailedPageClicked: boolean = false
    selectedCountryCode: any
    selectedCountryCodeFilter: any
    count: any
    singleData: any
    page = 1
    resultPerPage = 20
    countryCodes: any
    categoryList: any
    selectedCountry: any
    jobTypeList: any[] = [{
        code: 'full_time', name: 'Full time'
    }, {
        code: 'part_time', name: 'Part time'
    }, {
        code: 'contract', name: 'Contract'
    },
        {
            code: 'permanent', name: 'Permanent'
        }]

    distanceList: any[] = [
        {"code": "5km", "name": "5 km"},
        {"code": "10km", "name": "10 km"},
        {"code": "30km", "name": "30 km"},
        {"code": "50km", "name": "50 km"}
    ]


    constructor(private jobService: JobSearchService, private sConvert: SalaryConverterService,
                private dataService: DataService, private router: Router, private toastr: MessageService
    ) {
        this.countryCodes = [
            {"name": "Austria", "code": "at", "flag": "https://flagcdn.com/at.svg"},
            {"name": "Australia", "code": "au", "flag": "https://flagcdn.com/au.svg"},
            {"name": "Belgium", "code": "be", "flag": "https://flagcdn.com/be.svg"},
            {"name": "Brazil", "code": "br", "flag": "https://flagcdn.com/br.svg"},
            {"name": "Canada", "code": "ca", "flag": "https://flagcdn.com/ca.svg"},
            {"name": "Switzerland", "code": "ch", "flag": "https://flagcdn.com/ch.svg"},
            {"name": "Germany", "code": "de", "flag": "https://flagcdn.com/de.svg"},
            {"name": "Spain", "code": "es", "flag": "https://flagcdn.com/es.svg"},
            {"name": "France", "code": "fr", "flag": "https://flagcdn.com/fr.svg"},
            {"name": "United Kingdom", "code": "gb", "flag": "https://flagcdn.com/gb.svg"},
            {"name": "India", "code": "in", "flag": "https://flagcdn.com/in.svg"},
            {"name": "Italy", "code": "it", "flag": "https://flagcdn.com/it.svg"},
            {"name": "Mexico", "code": "mx", "flag": "https://flagcdn.com/mx.svg"},
            {"name": "Netherlands", "code": "nl", "flag": "https://flagcdn.com/nl.svg"},
            {"name": "New Zealand", "code": "nz", "flag": "https://flagcdn.com/nz.svg"},
            {"name": "Poland", "code": "pl", "flag": "https://flagcdn.com/pl.svg"},
            {"name": "Singapore", "code": "sg", "flag": "https://flagcdn.com/sg.svg"},
            {"name": "United States", "code": "us", "flag": "https://flagcdn.com/us.svg"},
            {"name": "South Africa", "code": "za", "flag": "https://flagcdn.com/za.svg"}
        ];
        this.fG = new FormGroup({
            countryCode: new FormControl('', Validators.required),
            location: new FormControl(''),
            title: new FormControl(''),
            company: new FormControl('')
        });
        this.filterForm = new FormGroup({
            countryCode: new FormControl('', Validators.required),
            category: new FormControl(''),
            location: new FormControl(''),
            distance: new FormControl(''),
            job_type: new FormControl(''),
            salary_min: new FormControl(''),
            salary_max: new FormControl(''),
            company: new FormControl(''),
            max_days_old: new FormControl('')
        });
        this.dataService.currentData.subscribe(data => {
            console.log(data);
            this.selectedCountryCode = data.countryCode.code
            this.fG.setValue({
                countryCode: data.countryCode.code,
                title: data.title,
                location: data.location,
                company: data.company
            });
            this.selectedCountry = this.countryCodes.find((country: any) => country.code.toLowerCase() == data.countryCode.code);
            this.onSubmit();
        });
    }

    limit: number = 10;
    totalResults: number = 0;

    ngOnInit(): void {
        //this.searchJobsAdzuna()
        //   this.jobService.searchJobsCoreSignal(this.query, this.location, this.page, this.resultPerPage).subscribe(
        //       (response: any) => {
        //         this.jobs = response.results;
        //         console.log(response.results)
        //       },
        //       (error: any) => {
        //         console.error('Error fetching job data:', error);
        //       }
        //   );
    }

    onCountryChange(event: any) {
        this.selectedCountryCode = event.value.code
        this.selectedFlag = event.value.flag
    }

    onCountryChangeFilter(event: any) {
        this.selectedCountryCodeFilter = event.value.code
        this.fetchCategoryData()
        this.selectedFlag = event.value.flag
    }

    fetchCategoryData() {
        let req = {
            location: this.selectedCountryCodeFilter,
        }
        this.jobService.fetchCategory(req).subscribe(
            (data: any) => {
                this.categoryList = data.results;
            },
            (error) => {
                console.error('Error fetching job listings:', error);
            }
        );
    }

    onSubmit() {
        this.filterForm.reset()
        if (this.fG.valid) {
            let req = {
                location: this.fG.value.countryCode.code,
                page: this.page,
                result_per_page: this.resultPerPage,
                what: this.fG.value.title,
                where: this.fG.value.location,
                company: this.fG.value.company
            }
            this.jobService.searchJobs(req).subscribe(
                (data: any) => {
                    this.jobs = data.results;
                    this.count = data.count
                },
                (error) => {
                    console.error('Error fetching job listings:', error);
                }
            );
        } else {
            this.toastr.add({severity: 'error', summary: 'Error', detail: "Fill required Filed"});
        }
    }

    onClickDetails(job: any) {
        this.singleData = job
        this.isDetailedPageClicked = true
    }

    paginate(event: any) {
        this.page = event.page + 1;
        this.resultPerPage = event.rows;
        if (this.fG.value) {
            this.onSubmit()
        } else {
            this.onFilterSubmit()
        }
    }

    onClickClear() {
        this.filterForm.reset()
    }

    onFilterSubmit() {
        this.fG.reset();
        if (this.filterForm.valid) {
            let req = {
                location: this.filterForm.value.countryCode.code,
                page: this.page,
                result_per_page: this.resultPerPage,
                where: this.filterForm.value.location,
                category: this.filterForm.value.category.tag,
                full_time: this.filterForm.value.job_type.code == 'full_time' ? 1 : '',
                part_time: this.filterForm.value.job_type.code == 'part_time' ? 1 : '',
                contract: this.filterForm.value.job_type.code == 'contract' ? 1 : '',
                permanent: this.filterForm.value.job_type.code == 'permanent' ? 1 : '',
                distance: this.filterForm.value.distance.code,
                salary_min: this.filterForm.value.salary_min,
                salary_max: this.filterForm.value.salary_max,
                company: this.filterForm.value.company,
                max_days_old: this.filterForm.value.max_days_old
            }
            this.jobService.searchJobs(req).subscribe(
                (data: any) => {
                    this.jobs = data.results
                    this.count = data.count
                },
                (error) => {
                    console.error('Error fetching job listings:', error);
                }
            );
        } else {
            this.toastr.add({severity: 'error', summary: 'Error', detail: "Fill required Filed"});
        }

    }

    onClickApply(job: any, type: any) {
        const jobDetails = {
            company_name: job.company.display_name,
            company_url: '',
            job_title: job.title,
            job_url: job.redirect_url,
            list_date: job.created,
            location: job.location.display_name,
            price: job.salary_is_predicted,
            work_type: job.contract_type,
            experience: '',
            time: job.created,
            type: type,
            country_flag: this.selectedFlag
        };
        this.jobService.addJobStatusList(jobDetails).subscribe(
            (data: any) => {
                if (type === 'apply') {
                    window.open(job.redirect_url, '_blank');
                } else {
                    this.router.navigateByUrl(`/pages/job-portal/job-tracker`);
                }
            },
            (error) => {
                console.error('not able to apply:', error);
            }
        );
    }

    goBack(){
        this.isDetailedPageClicked = false
    }

}
