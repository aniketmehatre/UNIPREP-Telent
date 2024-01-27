import { Component, OnInit } from '@angular/core';
import { ResourceService } from './resource.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/Auth/auth.service';
import { Router } from '@angular/router';
interface country {
  id: number,
  country: string,
  flag: string,
  status: number,
  created_at: string,
  updated_at: string
};
@Component({
  selector: 'uni-resource',
  templateUrl: './resource.component.html',
  styleUrls: ['./resource.component.scss']
})
export class ResourceComponent implements OnInit {
  filterform: FormGroup;
  newfile = "none";
  countries: country[] = [];
  planExpired!: boolean;

  constructor(private fb: FormBuilder, private resourceService: ResourceService, private toast: MessageService, private authService: AuthService,
  private router:Router) {
    this.filterform = this.fb.group({
      coutryname: ['']
    });
  }

  resources: any = [];
  resourceslist: any = [];
  selectedCountryId: any;

  ngOnInit(): void {
    this.resourceService.GetCountryList().subscribe((response) => {
      this.countries = response;
    });
    let data = {
      coutryname: this.filterform.value.coutryname
    }
    this.getResources(data);
    this.checkplanExpire();
  }
  getResources(data: any) {
    this.resourceService.getResources(data).subscribe((response: any) => {
      var resources = response.resources;
      // resources.forEach((element:any) => {
      //    var resource = {
      //     title: element.title,
      //     link: element.link,
      //     resourcedescription:element.resourcedescription,
      //     coverimage:element.coverimage,
      //     countryFlag:element.countryFlag,
      //     country:element.countryName
      //    }
      //    this.resourceslist.push(resource); 
      //    console.log(this.resourceslist);

      // });
      this.resourceslist = []
      this.resourceslist = response.resources
    });
  }
  getCountryName(flag: string): string {
    const countryNames = this.resourceslist.map((resource: { countryName: string; }) => resource.countryName.split(',')).flat();
    const flags = this.resourceslist.map((resource: { countryFlag: string; }) => resource.countryFlag.split(',')).flat();

    const flagIndex = flags.findIndex((f: string) => f.trim() === flag.trim());
    return flagIndex !== -1 ? countryNames[flagIndex].trim() : '';
  }
  filtersubmit() {
    const formData = this.filterform.value;

    if (!formData.coutryname == null) {
      this.toast.add({ severity: 'error', summary: 'Error', detail: 'Please make sure you have some filter!' });
      return;
    }
    let data = {
      coutryname: this.filterform.value.coutryname
    }
    this.newfile = "none";
    this.getResources(data)
  }
  closenewfilePopup() {
    this.newfile = "none";
  }
  // filterpop-up
  filterPopUp() {
    this.newfile = "block";
  }
  onLocationSelect(event: any) {
    // Clear the array and add the newly selected city
    if (event!.value.includes(0)) {
      this.filterform.get('coutryname')!.setValue([0]);
    }
  }
  checkplanExpire(): void {
    this.authService.getNewUserTimeLeft().subscribe((res) => {
      let data = res.time_left;
      let subscription_exists_status = res.subscription_details;
      if (data.plan === "expired" || subscription_exists_status === 'free_trail') {
        this.planExpired = true;
      } else {
        this.planExpired = false;
      }
    })
  }
  upgradePlan(): void {
    this.router.navigate(["/pages/subscriptions"]);
  }
}
