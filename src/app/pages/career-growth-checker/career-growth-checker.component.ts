import { Component, OnInit } from '@angular/core';
import { CareerGrowthService } from './career-growth-checker.service';
import { Router } from '@angular/router';

interface JobRole {
  id: number;
  jobrole: string;
}

@Component({
  selector: 'uni-career-growth-checker',
  templateUrl: './career-growth-checker.component.html',
  styleUrls: ['./career-growth-checker.component.scss']
})

export class CareerGrowthCheckerComponent implements OnInit {

  constructor(private careerGrowthService:CareerGrowthService,private router: Router) { }

  options: JobRole[] = [];
  allOptions: JobRole[] = []; 
  hasfilteredoptions: boolean = false; 
  filteredOptions: JobRole[] = []; 
  searchTerm: string = ''; 
  fromCountry: any;
  countries: any[] = [];
  selectedCountryName: any;
  selectedCountryCode: any;
  isPPPCardVisible: boolean = false;
  taxData: any;
  selectedCurrencyCode: string = 'INR';
  showSearch:boolean = true;
  showResult: boolean = false;
  roleDetails:any = [];

  ngOnInit(): void {
    this.showSearch= true;
    this.showResult = false;
    var data = {
      role : ''
    };
    this.careerGrowthService.JobRoles(data).subscribe((res)=>{
      this.options = res; 
      this.allOptions = res; 
      this.filteredOptions = res;
    });
    this.careerGrowthService.getCountries().subscribe(data => {
      this.countries = data;
    });
  }

  selectOption(option:any) {
    this.searchTerm = option.jobrole; 
    this.filteredOptions = [];
    this.hasfilteredoptions = false;
  }

  filterOptions(searchTerm: string) {
    const term = searchTerm.trim().toLowerCase();
    this.filteredOptions = this.allOptions.filter(op =>
      op.jobrole.toLowerCase().includes(term)
    );
    if(this.filteredOptions.length > 0) {
      this.hasfilteredoptions = true;
    }
    else {
      this.hasfilteredoptions = false;
    }
  }

  onInputChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.filterOptions(inputElement.value);
  }

  onCountryChange(event: any){
    this.selectedCountryCode = event.value.countryCode
    this.selectedCurrencyCode = event.value.currencyCode
    this.selectedCountryName = event.value.countryName
    this.isPPPCardVisible = false
    this.taxData = []
  }

  search() {
    const jobTypeId = this.getJobTypeId(this.searchTerm);
    const countryName= this.fromCountry ? this.fromCountry.countryName : null;

    if (jobTypeId && countryName) {
      var data = {
        roleId : jobTypeId,
        country: countryName
      };
      this.careerGrowthService.GetProgressionDetails(data).subscribe((res)=>{
        if(res.progressionNames != null) {
          this.showSearch= false;
          this.showResult = true;
          this.roleDetails = res.progressionNames;
        }else {
          this.showSearch= true;
          this.showResult = false;
        }

      });
      
    } else {
      
    }


  }

  getJobTypeId(jobRole: string): number | null {
    const jobType = this.allOptions.find(option => option.jobrole.toLowerCase() === jobRole.toLowerCase());
    return jobType ? jobType.id : null;
  }



}
