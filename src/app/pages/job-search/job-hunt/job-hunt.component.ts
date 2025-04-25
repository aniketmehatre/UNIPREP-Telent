import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Params, Router } from "@angular/router";
import { DataService } from 'src/app/data.service';
import { MessageService } from "primeng/api";
import { City } from "../../../@Models/cost-of-living";
import { JobSearchService } from "../job-search.service";
import { AuthService } from "src/app/Auth/auth.service";
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { StorageService } from "../../../storage.service";
@Component({
  selector: 'uni-job-hunt',
  templateUrl: './job-hunt.component.html',
  styleUrls: ['./job-hunt.component.scss'],
  standalone: true,
  imports: [CommonModule, DialogModule, FormsModule, ReactiveFormsModule],
})
export class JobHuntComponent implements OnInit {
  fG: FormGroup;
  countryCodes: any
  cities: City[] = [];
  jobTitle: any = [];
  filterJobTitle: any[] = [];
  filteredCity: any = [];
  formFields: any = [];

  constructor(private router: Router, private authService: AuthService, private dataService: DataService, private toastr: MessageService,
    private jobService: JobSearchService, private storage: StorageService) {
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
  planExpired: boolean = false;

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
      let LocationsList: any[] = [];
      this.cities.forEach((element: any, index: number) => {
        LocationsList[index] = {};
        // LocationsList[index]['city_name'] = element.city_name;
        LocationsList[index]['flag'] = element.flag;
        LocationsList[index]['country_name_code'] = element.country_name_code;
        if (element.city_name && element.country_name) {
          LocationsList[index]['location_name'] = element.city_name + ", " + element.country_name;
        } else {
          LocationsList[index]['location_name'] = element.country_name;
        }
      });
      this.cities = LocationsList;
    });
    this.getJobRoles();
    this.checkplanExpire();
  }

  getJobRoles() {
    this.jobService.getJobRoles().subscribe(res => {
      this.jobTitle = res;
    })
  }

  resetSearch() {
    this.fG.reset()
    this.resetFilterData()
  }

  onSubmit() {
    if (this.planExpired) {
      this.authService.hasUserSubscription$.next(true);
      return;
    }
    if (this.fG.valid) {
      this.dataService.changeData(this.formFields)
      this.saveFilterData(this.formFields)
      this.router.navigateByUrl(`/pages/job-portal/job-listing`);
    } else {
      this.toastr.add({ severity: 'error', summary: 'Error', detail: "Fill required Filed" });
    }
  }

  saveFilterData(formData: any): void {
    const filterData = JSON.stringify(formData);
    this.storage.set('filterFormData', filterData);
  }

  resetFilterData(): void {
    this.storage.set('filterFormData', '');
  }

  searchLocation(event: Event): void {
    const input = event.target as HTMLInputElement;
    const query = input.value.toLowerCase();
    if (query && query.length > 3) {
      const mockJobs = this.cities;
      this.filteredCity = mockJobs.filter((city: any) => city.location_name.toLowerCase().includes(query));
    } else if (query.length < 1) {
      this.filteredCity = [];
    }
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

  setJobtitle(jobRole: string) {
    this.fG.patchValue({
      what_and: jobRole
    });
    this.filterJobTitle = [];
  }

  setLocation(city: any) {
    let formData = {
      // country_name: city.city_name,
      country_name_code: city.country_name_code,
      countryCode: city.location_name,
      flag: city.flag,
      what_and: this.fG.value.what_and,
    }

    this.formFields = formData;
    this.fG.patchValue({
      countryCode: city.location_name
    });

    this.filteredCity = [];
  }
  checkplanExpire(): void {
    if (this.authService._userSubscrition.time_left.plan === "expired" ||
      this.authService._userSubscrition.time_left.plan === "subscription_expired" ||
      this.authService._userSubscrition.subscription_details.subscription_plan === "Student") {
      this.planExpired = true;
    }
    else {
      this.planExpired = false;
    }
  }

}
