import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'uni-company-detail',
  templateUrl: './company-detail.component.html',
  styleUrls: ['./company-detail.component.scss']
})
export class CompanyDetailComponent {
  @Output() openChat: EventEmitter<boolean> = new EventEmitter<boolean>(true);
  @Input() showInfo: boolean = true;

  companyData = {
    name: 'UNIABROAD Technology Pvt. Ltd.',
    foundedYear: '2013',
    logo: 'assets/uniabroad-logo.png',
    quickInfo: {
      headquarters: 'Mysore, Karnataka',
      companyType: 'Startup',
      companySize: '0-50'
    },
    aboutOrganization: {
      industryType: 'Primary',
      companySize: '10-49 Employees',
      sizeNote: '(Small enterprises)',
      headquarters: 'India ,Mysore',
      globalPresence: 'India , United Kingdom',
      yearFounded: '2019',
      officialWebsite: 'www.uniabroad.co.in',
      linkedInProfile: 'https://www.linkedin.com/company/example-corp/'
    },
    companyInsights: {
      aboutCompany: [
        "We're a company dedicated to helping students achieve their dream of studying abroad. Our journey began in 2019, when our founders recognized the need for a reliable and comprehensive overseas education company. Since then, we've been working tirelessly to guide students in the process of applying to and studying at top universities around the world.",
        "We're proud of the work we've done so far, and we're excited to continue making a positive impact on the lives of students around the world."
      ],
      workLifeBalancePolicies: [
        'Flexible Work Arrangements',
        'Health Insurance',
        'Childcare Assistance',
        'Learning & Growth',
        'Flexible',
        'Remote Work Options'
      ],
      employeeBenefits: [
        'Professional Development',
        'Workplace Perks',
        'Employee Recognition & Rewards',
        'Flexible Work Arrangements'
      ],
      workLocation: 'On-Site'
    }
  };
}

