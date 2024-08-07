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


  constructor(private router: Router, private dataService: DataService,) {
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
