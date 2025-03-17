import { CommonModule } from '@angular/common';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { Button, ButtonModule } from 'primeng/button';
import { Chip, ChipModule } from 'primeng/chip';

@Component({
  selector: 'uni-company-detail',
  templateUrl: './company-detail.component.html',
  styleUrls: ['./company-detail.component.scss'],
  standalone: true,
  imports: [ChipModule, ButtonModule, CommonModule,]
})
export class CompanyDetailComponent implements OnInit {
  @Output() openChat = new EventEmitter<boolean>(true);
  @Input() showInfo: boolean = true;

  companyData = {
    name: 'UNIABROAD Technology Pvt. Ltd.',
    foundedYear: '2019',
    logo: 'assets/uniabroad-logo.png',
    headquartersLocation: 'Mysore, Karnataka',
    companyType: 'Startup',
    companySize: '10-49 Employees',
    sizeCategory: 'Small enterprises',
    globalPresence: ['India', 'United Kingdom'],
    industryType: 'Primary',
    officialWebsite: 'www.uniabroad.co.in',
    linkedInProfile: 'https://www.linkedin.com/company/example-corp/',
    about: [
      "We're a company dedicated to helping students achieve their dream of studying abroad. Our journey began in 2019, when our founders recognized the need for a reliable and comprehensive overseas education company. Since then, we've been working tirelessly to guide students in the process of applying to and studying at top universities around the world.",
      "We're proud of the work we've done so far, and we're excited to continue making a positive impact on the lives of students around the world."
    ].join('\n\n'),
    workLifeBalancePolicies: [
      'Flexible Work Arrangements',
      'Health Insurance',
      'Childcare Assistance',
      'Learning & Growth',
      'Remote Work Options'
    ],
    employeeBenefits: [
      'Professional Development',
      'Workplace Perks',
      'Employee Recognition & Rewards',
      'Flexible Work Arrangements'
    ],
    workLocation: 'On-Site',
    hiringStages: [
      'Application Submission',
      'Initial Screening',
      'Technical Interview',
      'HR Interview',
      'Final Decision'
    ],
    hiringTimeframe: '2-4 Weeks',
    interviewFormat: 'Online & In-Person'
  };

  ngOnInit() {

  }

}

