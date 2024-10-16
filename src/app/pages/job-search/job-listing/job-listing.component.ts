import {Component, OnInit} from '@angular/core';
import {JobSearchService} from "../job-search.service";
import {SalaryConverterService} from '../../job-tool/salary-converter/salary-converter.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {DataService} from 'src/app/data.service';
import {Router} from "@angular/router";
import {MessageService} from "primeng/api";
import {City} from "../../../@Models/cost-of-living";
import {filter} from "rxjs";

@Component({
    selector: 'uni-job-listing',
    templateUrl: './job-listing.component.html',
    styleUrls: ['./job-listing.component.scss']
})
export class JobListingComponent implements OnInit {
    jobs: any[] = [];
    cities: City[] = [];
    fG: FormGroup;
    filterForm: FormGroup;
    query: string = 'developer';
    location: string = ''; // Default location
    fromCountry: any
    selectedFlag: any
    isDetailedPageClicked: boolean = false
    selectedCountryCode: any
    selectedCountryCodeFilter: any
    count: any
    whatAnd: any
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
            what_and: new FormControl(''),
        });
        this.filterForm = new FormGroup({
            what_and: new FormControl(''),
            countryCode: new FormControl('', Validators.required),
            category: new FormControl(''),
            job_type: new FormControl(''),
        });
        this.dataService.currentData.subscribe(data => {
            if (typeof data === 'object' && !Array.isArray(data) && data !== null && Object.keys(data).length === 0) {
            } else {
                this.selectedCountryCode = data.country_name_code
                this.selectedFlag = data.flag
                this.fG.setValue({
                    countryCode: data.country_name,
                    what_and: data.what_and,
                })
                this.filterForm.setValue({
                    what_and: data.what_and,
                    countryCode: data.country_name,
                    category: '',
                    job_type: '',
                });
                this.onSubmit()
                this.fetchCategoryData()
            }
        });
        const filterData = this.getFilterData()
        if (filterData) {
            this.selectedCountryCode = filterData.country_name_code
            this.selectedFlag = filterData.flag
            this.fG.setValue({
                countryCode: filterData.countryCode,
                what_and: filterData.what_and,
            })
            this.whatAnd = filterData.what_and
            this.filterForm.setValue({
                what_and: filterData.what_and,
                countryCode: filterData.countryCode,
                category: '',
                job_type: '',
            });
            this.onSubmit()
            this.fetchCategoryData()
        }
    }

    limit: number = 10;

    ngOnInit(): void {
        this.jobService.getCities().subscribe((res: City[]) => {
            this.cities = res.filter(city => {
                return this.countryCodes.some((country: any) => country.name === city.country_name);
            }).map(city => {
                const matchedCountry = this.countryCodes.find((country: any) => country.name === city.country_name);
                return {
                    ...city,
                    name: !city.city_name ? city.country_name : city.city_name,
                    country_code: matchedCountry ? matchedCountry.code : null,
                    flag: matchedCountry ? matchedCountry.flag : city.flag // Use the flag from countryCodes if matched, otherwise keep original
                };
            });
            
        });
    }

    resetSearch() {
        this.fG.reset()
        this.filterForm.reset()
        this.resetFilterData()
        this.jobs = []
        this.router.navigateByUrl(`/pages/job-portal/job-search`);
    }

    fetchCategoryData() {
        let req = {
            location: this.selectedCountryCode,
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
        this.filterForm.setValue({
            what_and: this.fG.value.what_and,
            countryCode: this.fG.value.countryCode,
            category: '',
            job_type: '',
        })
        this.whatAnd = this.fG.value.what_and
        // this.selectedFlag = this.fG.value.countryCode.flag
        let formData = {
            country_name: this.fG.value.countryCode,
            country_name_code: this.selectedCountryCode,
            countryCode: this.fG.value.countryCode,
            flag: this.selectedFlag,
            what_and: this.fG.value.what_and,
          }
        this.saveFilterData(formData);
        // this.fromCountry = this.countryCodes.find((country: any) => country.code.toLowerCase() == this.fG.value.countryCode.code);
        // if (this.fG.value.countryCode.code) {
        //     this.selectedCountryCodeFilter = this.fG.value.countryCode.code
            this.fetchCategoryData()
        // }
        if (this.fG.valid) {
            let req = {
                location: this.selectedCountryCode,
                page: this.page,
                result_per_page: this.resultPerPage,
                what_and: this.fG.value.what_and,
                where: this.fG.value.countryCode,
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
        if (this.filterForm.valid) {
            this.saveFilterData(this.filterForm.value)
            let req = {
                location: this.filterForm.value.countryCode,
                page: this.page,
                result_per_page: this.resultPerPage,
                what_and: this.filterForm.value.what_and,
                where: this.filterForm.value.country_name,
                full_time: this.filterForm.value.job_type?.code == 'full_time' ? '1' : '',
                part_time: this.filterForm.value.job_type?.code == 'part_time' ? '1' : '',
                contract: this.filterForm.value.job_type?.code == 'contract' ? '1' : '',
                permanent: this.filterForm.value.job_type?.code == 'permanent' ? '1' : '',
            }
            this.selectedFlag = this.filterForm.value.countryCode.flag
            this.jobService.filter(req).subscribe(
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
            price: '',
            work_type: job.contract_type,
            experience: '',
            time: job.created,
            type: type,
            country_flag: this.selectedFlag,
            description: job.description,
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

    goBack() {
        this.isDetailedPageClicked = false
    }

    getFilterData(): any {
        const storedData = localStorage.getItem('filterFormData');
        if (storedData) {
            return JSON.parse(storedData);
        }
        return null;
    }

    saveFilterData(formData: any): void {
        const filterData = JSON.stringify(formData);
        localStorage.setItem('filterFormData', filterData);
    }


    resetFilterData(): void {
        localStorage.setItem('filterFormData', '');
    }

}
