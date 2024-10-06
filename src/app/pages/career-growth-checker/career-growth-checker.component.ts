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
  country_salary_min: string;
  country_salary_max: string;
  ind_salary_min: string;
  ind_salary_max: string;
  ind_salary: string;
  status: number;
  created_at: string;
  updated_at: string | null;
  jobrole: string;
  slug: string;
  forCG: number;
  rolesArray?: string[];
  skillsArray?: string[];
}

@Component({
  selector: 'uni-career-growth-checker',
  templateUrl: './career-growth-checker.component.html',
  styleUrls: ['./career-growth-checker.component.scss']
})

export class CareerGrowthCheckerComponent implements OnInit {

  constructor(private careerGrowthService:CareerGrowthService,private router: Router,private fb: FormBuilder,) { }

  options: JobRole[] = [];
  jobDetails: JobDetail[][] = []; 
  allOptions: JobRole[] = []; 
  hasfilteredoptions: boolean = false; 
  filteredOptions: JobRole[] = []; 
  searchTerm: string = ''; 
  fromCountry: any;
  countries: any[] = [];
  showSearch:boolean = true;
  showResult: boolean = false;
  roleDetails:any = [];
  selectedCountryId: string | null = null; 
  checkForm: FormGroup;
  selectedJobId: string | null = null; 
  currentrole: string | null = null;

currencySymbols: { [key: string]: string } = {
  'United States': '$',
  'India': '₹',
};


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
      this.countries = data.countries_list;
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
    const countryId = this.checkForm.get('country')?.value;
    this.currentrole = this.checkForm.get('jobSearch')?.value;
    if (this.selectedJobId && countryId) {
      var data = {
        roleId : this.selectedJobId,
        country: countryId
      };
      this.careerGrowthService.GetProgressionDetails(data).subscribe((res)=>{
        if(res.progressionNames != null) {
          this.showSearch= false;
          this.showResult = true;
          this.roleDetails = res.progressionNames;
          this.jobDetails = res.details;
          for (const group of this.jobDetails) {
            for (const detail of group) {
            const parsedRolesResp = detail.roles_resp.split(',').map(item => item.trim());
            detail.rolesArray = parsedRolesResp; 
            const parsedSkills = detail.skills.split(',').map(item => item.trim());
            detail.skillsArray = parsedSkills; 
            }
        }
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
