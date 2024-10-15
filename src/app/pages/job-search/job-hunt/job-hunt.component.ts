import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from "@angular/router";
import {DataService} from 'src/app/data.service';
import {MessageService} from "primeng/api";
import {City} from "../../../@Models/cost-of-living";
import {JobSearchService} from "../job-search.service";

@Component({
  selector: 'uni-job-hunt',
  templateUrl: './job-hunt.component.html',
  styleUrls: ['./job-hunt.component.scss']
})
export class JobHuntComponent implements OnInit {
  fG: FormGroup;
  countryCodes: any
  cities: City[] = [];
  jobTitle: any = [];
  filterJobTitle: any[] = [];
  filteredCity: any = [];
  filteredLocations: any = [];

  constructor(private router: Router, private dataService: DataService, private toastr: MessageService,
              private jobService: JobSearchService) {
    this.countryCodes = [
      { "name": "Austria", "code": "at", "flag": "https://flagcdn.com/at.svg" },
      { "name": "Australia", "code": "au", "flag": "https://flagcdn.com/au.svg" },
      { "name": "Belgium", "code": "be", "flag": "https://flagcdn.com/be.svg" },
      { "name": "Brazil", "code": "br", "flag": "https://flagcdn.com/br.svg" },
      { "name": "Canada", "code": "ca", "flag": "https://flagcdn.com/ca.svg" },
      { "name": "Switzerland", "code": "ch", "flag": "https://flagcdn.com/ch.svg" },
      { "name": "Germany", "code": "de", "flag": "https://flagcdn.com/de.svg" },
      { "name": "Spain", "code": "es", "flag": "https://flagcdn.com/es.svg" },
      { "name": "France", "code": "fr", "flag": "https://flagcdn.com/fr.svg" },
      { "name": "United Kingdom", "code": "gb", "flag": "https://flagcdn.com/gb.svg" },
      { "name": "India", "code": "in", "flag": "https://flagcdn.com/in.svg" },
      { "name": "Italy", "code": "it", "flag": "https://flagcdn.com/it.svg" },
      { "name": "Mexico", "code": "mx", "flag": "https://flagcdn.com/mx.svg" },
      { "name": "Netherlands", "code": "nl", "flag": "https://flagcdn.com/nl.svg" },
      { "name": "New Zealand", "code": "nz", "flag": "https://flagcdn.com/nz.svg" },
      { "name": "Poland", "code": "pl", "flag": "https://flagcdn.com/pl.svg" },
      { "name": "Singapore", "code": "sg", "flag": "https://flagcdn.com/sg.svg" },
      { "name": "United States", "code": "us", "flag": "https://flagcdn.com/us.svg" },
      { "name": "South Africa", "code": "za", "flag": "https://flagcdn.com/za.svg" }
    ];

    this.fG = new FormGroup({
      countryCode: new FormControl('', Validators.required),
      what_and: new FormControl(''),
    });
  }

  ngOnInit(): void {
    // this.jobService.getCities().subscribe((res: City[]) => {
      
    //   this.cities = res;
    //   let LocationsList: any = [];
    //   this.cities.forEach((element:any, index: number) => {
    //     if(element.city_name){
    //       LocationsList[index]['location_name'] = element.city_name + " , "+ element.country_name;
    //     }
    //   });
      // this.cities = res.filter(city => {
      //   return this.countryCodes.some((country: any) => country.name === city.country_name);
      // }).map(city => {
      //   const matchedCountry = this.countryCodes.find((country: any) => country.name === city.country_name);
      //   return {
      //     ...city,
      //     name: !city.city_name ? city.country_name : city.city_name,
      //     country_code: matchedCountry ? matchedCountry.code : null,
      //     flag: matchedCountry ? matchedCountry.flag : city.flag // Use the flag from countryCodes if matched, otherwise keep original
      //   };
      // });
    // });

    this.jobService.getCities().subscribe((res: City[]) => {
      this.cities = res;
      let LocationsList: any[] = [];  // Initialize LocationsList as an array
      this.cities.forEach((element: any, index: number) => {
        if (element.city_name && element.country_name) {
          LocationsList[index] = {};
          LocationsList[index]['location_name'] = element.city_name + ", " + element.country_name;
          LocationsList[index]['flag'] = element.flag;
        }
      });
      this.cities = LocationsList;
    });
    this.getJobRoles();
  }

  getJobRoles(){
    this.jobService.getJobRoles().subscribe(res =>{
      this.jobTitle = res;
    })
  }

  resetSearch() {
    this.fG.reset()
    this.resetFilterData()
  }

  onSubmit() {
    if (this.fG.valid) {
      this.dataService.changeData(this.fG.value)
      this.saveFilterData(this.fG.value)
      this.router.navigateByUrl(`/pages/job-portal/job-listing`);
    }else{
      this.toastr.add({severity:'error', summary: 'Error', detail: "Fill required Filed"});
    }
  }

  saveFilterData(formData: any): void {
    const filterData = JSON.stringify(formData);
    localStorage.setItem('filterFormData', filterData);
  }

  resetFilterData(): void {
    localStorage.setItem('filterFormData', '');
  }

  searchLocation(event: Event) :void{
    const input = event.target as HTMLInputElement;
    const query = input.value;
    if(query && query.length > 3){
      const mockJobs = this.cities;
      this.filteredCity =  mockJobs.filter((city: any) => city.location_name.toLowerCase().includes(query));
    }else if(query.length < 1){
      this.filteredCity = [];
    }
  }

  searchJob(event: Event) :void{
    const input = event.target as HTMLInputElement;
    const query = input.value;
    if(query && query.length > 3){
      const mockJobs = this.jobTitle;
      this.filterJobTitle =  mockJobs.filter((job: any) => job.jobrole.toLowerCase().includes(query));
    }else if(query.length < 1){
      this.filterJobTitle = [];
    }
  }

  setJobtitle(jobRole: string){
    this.fG.patchValue({
      what_and: jobRole
    });
    this.filterJobTitle = [];
  }

  setLocation(city: string){
    this.fG.patchValue({
      countryCode: city
    });
    this.filteredCity = [];
  }
}
