import { Component, OnInit } from '@angular/core';
import { CareerGrowthService } from './career-growth-checker.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from "@angular/forms";

interface JobRole {
  id: number;
  jobrole: string;
}

interface JobDetail {
  id: number;
  job_role_id: number;
  country: number;
  roles_resp: string; 
  skills: string;
  experience: string;
  salary: string;
  india_salary: string;
  status: number;
  created_at: string;
  updated_at: string | null;
  jobrole: string;
  slug: string;
  forCG: number;
  rolesArray?: string[];
  skillsArray?: string[];
}

interface Country {
  id: number;
  country: string;
  alt_name: string | null;
  country_code: string;
  country_flag: string;
  scholarship_visibility: number;
  status: number;
  created_at: string;
  updated_at: string;
}

@Component({
  selector: 'uni-career-growth-checker',
  templateUrl: './career-growth-checker.component.html',
  styleUrls: ['./career-growth-checker.component.scss']
})

export class CareerGrowthCheckerComponent implements OnInit {

  constructor(private careerGrowthService:CareerGrowthService,private router: Router,private fb: FormBuilder,) { }

  options: JobRole[] = [];
  jobDetails: JobDetail[] = []; 
  allOptions: JobRole[] = []; 
  countries: Country[] = [];
  hasfilteredoptions: boolean = false; 
  filteredOptions: JobRole[] = []; 
  searchTerm: string = ''; 
  fromCountry: any;
  showSearch:boolean = true;
  showResult: boolean = false;
  roleDetails:any = [];
  selectedCountryId: string | null = null; 
  checkForm: FormGroup;
  selectedJobId: string | null = null; 
  currentrole: string | null = null;
  invalidClass: boolean = false;
  invalidClassCountry: boolean = false;


  ngOnInit(): void {
    this.checkForm = this.fb.group({
      jobSearch: [''],
      country: [''] 
  });
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
      const desiredCountries = ['India', 'United States', 'United Kingdom', 'China', 'Norway', 'Germany', 'France', 'Singapore', 'Switzerland', 'United Arab Emirates', 'Spain', 'Ireland', 'Australia', 'New Zealand', 'Canada', 'Netherlands', 'Austria', 'Belgium', 'Czech Republic', 'Denmark', 'Estonia', 'Finland', 'Hungary', 'Italy', 'Latvia', 'Lithuania', 'Malta', 'Poland', 'Portugal', 'Sweden', 'Japan'];
      const countriesList: Country[] = data.countries_list;

      this.countries = countriesList.filter(country => 
        desiredCountries.includes(country.country)
      );
    });
  }

  selectOption(option: any) {
    this.checkForm.get('jobSearch')?.setValue(option.jobrole); 
    this.selectedJobId = option.id; 
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

  search() {
    const jobSearchValue = this.checkForm.value.jobSearch;

    const isValidJobRole = this.filteredOptions.some(option => option.jobrole === jobSearchValue);

    if (!isValidJobRole) {
      this.invalidClass = true;
      return;
    }else {
      this.invalidClass = false;
    }

    const countryId = this.checkForm.get('country')?.value;
    this.currentrole = this.checkForm.get('jobSearch')?.value;
    if (countryId) {
      var data = {
        roleId : this.selectedJobId,
        country: countryId
      };
      this.invalidClassCountry = false;
      this.careerGrowthService.GetProgressionDetails(data).subscribe((res)=>{
        if(res.progressionNames != null) {
          this.showSearch= false;
          this.showResult = true;
          this.roleDetails = res.progressionNames;
          this.jobDetails = res.details;
          for (const group of this.jobDetails) {
            const detail: JobDetail = group;
            const parsedRolesResp = group.roles_resp.split(',').map(item => item.trim());
            detail.rolesArray = parsedRolesResp; 
            const parsedSkills = detail.skills.split(',').map(item => item.trim());
            detail.skillsArray = parsedSkills; 
          }
        }else {
          this.showSearch= true;
          this.showResult = false;
        }

      });
      
    } else {
      this.invalidClassCountry = true;
      return;
    }

  }

  getJobTypeId(jobRole: string): number | null {
    const jobType = this.allOptions.find(option => option.jobrole.toLowerCase() === jobRole.toLowerCase());
    return jobType ? jobType.id : null;
  }



}
