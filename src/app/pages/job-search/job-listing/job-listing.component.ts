import {Component, OnInit} from '@angular/core';
import {JobSearchService} from "../job-search.service";
import {SalaryConverterService} from '../../job-tool/salary-converter/salary-converter.service';
import {FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DataService} from 'src/app/data.service';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {MessageService} from "primeng/api";
import {City} from "../../../@Models/cost-of-living";
import {filter} from "rxjs";
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from "@angular/common";
import { DialogModule } from "primeng/dialog";
@Component({
    selector: 'uni-job-listing',
    templateUrl: './job-listing.component.html',
    styleUrls: ['./job-listing.component.scss'],
    standalone: true,
    imports: [DropdownModule, FormsModule, ReactiveFormsModule, CommonModule, DialogModule],
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
    resultPerPage = 50
    countryCodes: any
    categoryList: any
    selectedCountry: any
    isShowNoResultFound: any
    filteredCity: any = [];
    jobTitle: any = [];
    filterJobTitle: any[] = [];
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
                private dataService: DataService, private router: Router, private toastr: MessageService,
                private activatedRoute: ActivatedRoute
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
                    countryCode: data.countryCode,
                    what_and: data.what_and,
                })
                this.filterForm.setValue({
                    what_and: data.what_and,
                    countryCode: data.countryCode,
                    category: '',
                    job_type: '',
                });
                this.onSubmit()
                this.fetchCategoryData()
            }
        });

        this.activatedRoute.params.subscribe((params: Params) => {
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
        });
    }

    limit: number = 10;

    ngOnInit(): void {
        this.getJobRoles();
        this.jobService.getCities().subscribe((res: City[]) => {
            // this.cities = res.filter(city => {
            //     return this.countryCodes.some((country: any) => country.name === city.country_name);
            // }).map(city => {
            //     const matchedCountry = this.countryCodes.find((country: any) => country.name === city.country_name);
            //     return {
            //         ...city,
            //         name: !city.city_name ? city.country_name : city.city_name,
            //         country_code: matchedCountry ? matchedCountry.code : null,
            //         flag: matchedCountry ? matchedCountry.flag : city.flag // Use the flag from countryCodes if matched, otherwise keep original
            //     };
            // });

            this.cities = res;
            let LocationsList: any[] = []; 
            this.cities.forEach((element: any, index: number) => {
                LocationsList[index] = {};
                // LocationsList[index]['city_name'] = element.city_name;
                LocationsList[index]['flag'] = element.flag;
                LocationsList[index]['country_name_code'] = element.country_name_code;
                if (element.city_name && element.country_name) {
                    LocationsList[index]['location_name'] = element.city_name + ", " + element.country_name;
                }else{
                    LocationsList[index]['location_name'] = element.country_name;
                }
            });
            this.cities = LocationsList;
            
        });
    }

    getJobRoles(){
        this.jobService.getJobRoles().subscribe(res =>{
          this.jobTitle = res;
        });
    }

    searchLocation(event: Event) :void{
        const input = event.target as HTMLInputElement;
        const query = input.value.toLowerCase();
        if(query && query.length > 3){
          const mockJobs = this.cities;
          this.filteredCity =  mockJobs.filter((city: any) => city.location_name.toLowerCase().includes(query));
        }else if(query.length < 1){
          this.filteredCity = [];
        }
    }

    setLocation(city: any) :void{
        // this.selectedFlag = city.flag;
        this.selectedCountryCode = city.country_name_code;
        this.filterForm.patchValue({
            countryCode: city.location_name
        });
        
        this.fG.patchValue({
            countryCode: city.location_name
        });

        this.filteredCity = [];
    }

    searchJob(event: Event): void {
        const input = event.target as HTMLInputElement;
        const query = input.value.toLowerCase().trim();
        if (query && query.length > 3) {
            const mockJobs = this.jobTitle;

            // Filter jobs that include the query
            this.filterJobTitle = mockJobs.filter((job: any) => job.jobrole.toLowerCase().includes(query));

            // Sort the filtered jobs to prioritize exact matches
            this.filterJobTitle.sort((a: any, b: any) => {
                const aJob = a.jobrole.toLowerCase();
                const bJob = b.jobrole.toLowerCase();

                if (aJob === query && bJob !== query) {
                    return -1; // a comes first
                } else if (aJob !== query && bJob === query) {
                    return 1; // b comes first
                } else if (aJob.startsWith(query) && !bJob.startsWith(query)) {
                    return -1; // a comes first if it starts with the query
                } else if (!aJob.startsWith(query) && bJob.startsWith(query)) {
                    return 1; // b comes first if it starts with the query
                } else {
                    return 0; // Keep original order for other cases
                }
            });
        } else if (query.length < 1) {
            this.filterJobTitle = [];
        }
    }
    
    setJobtitle(jobRole: string){
        this.filterForm.patchValue({
            what_and: jobRole
        });

        this.fG.patchValue({
            what_and: jobRole
        });
        this.filterJobTitle = [];
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
        console.log('111')
        this.filterForm.setValue({
            what_and: this.fG.value.what_and,
            countryCode: this.fG.value.countryCode,
            category: '',
            job_type: '',
        })
        this.whatAnd = this.fG.value.what_and
        // this.selectedFlag = this.fG.value.countryCode.flag
        let formData = {
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
        this.onFilterSubmit()
        // if (this.fG.value) {
        //     this.onSubmit()
        // } else {
        //     this.onFilterSubmit()
        // }
    }

    onClickClear() {
        this.filterForm.reset()
    }

    onFilterSubmit() {
        console.log('222')
        if (this.filterForm.valid) {
            let req = {
                location: this.selectedCountryCode,
                page: this.page,
                result_per_page: this.resultPerPage,
                what_and: this.filterForm.value.what_and,
                where: this.filterForm.value.countryCode,
                full_time: this.filterForm.value.job_type?.code == 'full_time' ? '1' : '',
                part_time: this.filterForm.value.job_type?.code == 'part_time' ? '1' : '',
                contract: this.filterForm.value.job_type?.code == 'contract' ? '1' : '',
                permanent: this.filterForm.value.job_type?.code == 'permanent' ? '1' : '',
            }

            //I can't change the selected flag while changing the country. so i filtered manually.If i change the selected flag it changed before I click the filter button.
            let filterCountryflag = this.countryCodes.find((country: any) => country.code.toLowerCase() == this.selectedCountryCode); 
            let formData = {
                country_name_code: this.selectedCountryCode,
                countryCode: this.filterForm.value.countryCode,
                flag: filterCountryflag.flag,
                what_and: this.filterForm.value.what_and,
            }
            this.whatAnd = this.filterForm.value.what_and;
            this.saveFilterData(formData)
            this.jobService.filter(req).subscribe(
                (data: any) => {
                    if(data.results.length == 0){
                        this.jobs = []
                        this.count = 0
                        this.isShowNoResultFound = true;
                    }else{
                        this.jobs = data.results
                        this.count = data.count
                        this.selectedFlag = filterCountryflag.flag;
                        this.isShowNoResultFound = false;
                    }
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
                    this.dataService.setJobGroupButtonHandled('job-tracker');
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
