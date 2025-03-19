import { CommonModule } from '@angular/common';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { Button, ButtonModule } from 'primeng/button';
import { Chip, ChipModule } from 'primeng/chip';
import {TalentConnectService} from "../../talent-connect.service";

@Component({
  selector: 'uni-company-detail',
  templateUrl: './company-detail.component.html',
  styleUrls: ['./company-detail.component.scss'],
  standalone: true,
  imports: [ChipModule, ButtonModule, CommonModule,]
})
export class CompanyDetailComponent implements OnInit {
  @Input() companyDetails!: any;
  @Output() openChat = new EventEmitter<boolean>(true);
  @Input() showInfo: boolean = true;

  constructor(private talentConnectService: TalentConnectService,) {
  }

  ngOnInit() {
    console.log(this.companyDetails);
    this.init()
  }


  perPage: number = 10
  page: number = 1
  companyData: any
  init(){
      const requestData = {
        perpage: this.perPage,
        page: this.page,
        companyname: "Test",
        industrytype: [2, 1],  // Converted to an array for better structure
        companysize: 1,
        hq: 2,
        globalpresence: [1, 2, 3], // Converted to an array
        foundedyear: 2002,
        companytype: 1
      };
      const requestDataEmpty = {
        perpage: this.perPage,
        page: this.page,

      };
    this.talentConnectService.getCompanyDetails(this.companyDetails).subscribe({
      next: data => {
        console.log(data[0])
        this.companyData = data[0]
        this.companyData.work_life_balance_policy = this.companyData.work_life_balance_policy.split(", ");
        this.companyData.hiring_process_stages = this.companyData.hiring_process_stages.split(", ");
        this.companyData.benefits = this.companyData.benefits.split(", ");
      },
      error: err => {
        console.log(err)
      }
    })
  }

}

