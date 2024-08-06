import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from "@angular/router";
import { DataService } from 'src/app/data.service';

@Component({
  selector: 'uni-job-hunt',
  templateUrl: './job-hunt.component.html',
  styleUrls: ['./job-hunt.component.scss']
})
export class JobHuntComponent implements OnInit {
  fG: FormGroup;
  countryCodes: any


  constructor(private router: Router, private dataService: DataService) {
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
  }

  ngOnInit(): void {

  }

  onSubmit() {
    this.dataService.changeData(this.fG.value)
    this.router.navigateByUrl(`/pages/job-portal/job-listing`);
  }

}
