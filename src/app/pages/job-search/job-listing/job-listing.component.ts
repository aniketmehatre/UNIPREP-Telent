import { Component, OnInit } from '@angular/core';
import { JobSearchService } from "../job-search.service";
import { SalaryConverterService } from '../../job-tool/salary-converter/salary-converter.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DataService } from 'src/app/data.service';

@Component({
  selector: 'uni-job-listing',
  templateUrl: './job-listing.component.html',
  styleUrls: ['./job-listing.component.scss']
})
export class JobListingComponent implements OnInit {
  jobs: any[] = [];
  fG: FormGroup;
  query: string = 'developer';
  location: string = 'in'; // Default location
  numbers: number[] = Array(20).fill(0).map((x, i) => i + 1);
  fromCountry: string = 'India'
  isDetailedPageClicked: boolean = false
  selectedCountryCode: any
  count: any
  singleData: any
  page = 1
  resultPerPage = 20
  countryCodes: any
  categoryList: any
  jobTypeList: any[] = [{
    code: 'full_time', name: 'Full time'
  },{
    code: 'part_time', name: 'Part time'
  },{
    code: 'contract', name: 'Contract'
  },
  {
    code: 'permanent', name: 'Permanent'
  }]
  vvv = {
    "title": "Product Manager",
    "adref": "eyJhbGciOiJIUzI1NiJ9.eyJpIjoiNDU1ODkwNTYxMCIsInMiOiJxSDVMazFKUzd4R0xfdVJaemJVeTZ3In0.8R8Q6ZxJ540aWkUo3ZxtROdc3zCEiLcPthfo7gwK1f8",
    "location": {
        "__CLASS__": "Adzuna::API::Response::Location",
        "display_name": "Chennai, Tamil Nadu",
        "area": [
            "India",
            "Tamil Nadu",
            "Chennai"
        ]
    },
    "latitude": 13.06041,
    "description": "We are looking for a Product Manager for a Seed Funded Sales Enablement Platform. Job Profile: Responsible for defining and executing the product roadmap, working closely with cross-functional teams to ensure the product meets customer needs, and driving business growth through innovation and continuous improvement. Prioritize and manage the sprint backlogs. Organize and facilitate Sprint planning workshops, sprint retrospectives/ demo sessions, Conduct stand-ups, Publish Sprint burn-down chart…",
    "longitude": 80.24963,
    "salary_is_predicted": "0",
    "redirect_url": "https://www.adzuna.in/details/4558905610?utm_medium=api&utm_source=5be5ff77",
    "created": "2024-02-06T04:51:47Z",
    "company": {
        "display_name": "NetSysCon Consulting",
        "__CLASS__": "Adzuna::API::Response::Company"
    },
    "__CLASS__": "Adzuna::API::Response::Job",
    "category": {
        "tag": "it-jobs",
        "__CLASS__": "Adzuna::API::Response::Category",
        "label": "IT Jobs"
    },
    "id": "4558905610"
};

  constructor(private jobService: JobSearchService, private sConvert: SalaryConverterService,
    private dataService: DataService
  ) {
    this.countryCodes = [
      { "name": "Austria", "code": "at" },
      { "name": "Australia", "code": "au" },
      { "name": "Belgium", "code": "be" },
      { "name": "Brazil", "code": "br" },
      { "name": "Canada", "code": "ca" },
      { "name": "Switzerland", "code": "ch" },
      { "name": "Germany", "code": "de" },
      { "name": "Spain", "code": "es" },
      { "name": "France", "code": "fr" },
      { "name": "United Kingdom", "code": "gb" },
      { "name": "India", "code": "in" },
      { "name": "Italy", "code": "it" },
      { "name": "Mexico", "code": "mx" },
      { "name": "Netherlands", "code": "nl" },
      { "name": "New Zealand", "code": "nz" },
      { "name": "Poland", "code": "pl" },
      { "name": "Singapore", "code": "sg" },
      { "name": "United States", "code": "us" },
      { "name": "South Africa", "code": "za" }
  ]
      this.fG = new FormGroup({
        countryCode: new FormControl('', Validators.required),
        location: new FormControl(''),
        title: new FormControl(''),
        company: new FormControl('')
      });
    this.dataService.currentData.subscribe(data => {
      this.selectedCountryCode = data.countryCode.code
      this.fG.setValue({
        countryCode: this.selectedCountryCode,
        title: data.title,
        location: data.location,
        company: data.company 
      }); 
      console.log(this.fG.value); 
      this.onSubmit();
    });
  }

  ngOnInit(): void {
    this.singleData = this.vvv
    //this.searchJobsAdzuna()
  }

 

  onCountryChange(event: any) {
    this.selectedCountryCode = event.value.code
    
  }
  onCountryChangeFilter(event: any){
    this.selectedCountryCode = event.value.code
    this.fetchCategoryData();
  }

  fetchCategoryData(){
    let req = {
      location: this.selectedCountryCode,
    }
    this.jobService.fetchCategory(req).subscribe(
      (data: any) => {
        this.categoryList = data.results;
        console.log(this.jobs)
      },
      (error) => {
        console.error('Error fetching job listings:', error);
      }
    );
  }

  onClickSearch() {
    console.log(this.fG.value.countryCode.code)
  }

  onSubmit() {
    let req = {
      location: this.selectedCountryCode,
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
        console.log(this.jobs)
      },
      (error) => {
        console.error('Error fetching job listings:', error);
      }
    );
  }

  onClickDetails(job: any){
    this.singleData = job
    this.isDetailedPageClicked = true
  }

  paginate(event: any){

  }

  onClickClear(){}

}
