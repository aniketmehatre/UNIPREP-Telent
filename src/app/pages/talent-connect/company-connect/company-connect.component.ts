import { Component } from '@angular/core';

interface DropdownOption {
  label: string;
  value: string;
}

@Component({
  selector: 'uni-company-connect',
  templateUrl: './company-connect.component.html',
  styleUrls: ['./company-connect.component.scss']
})
export class CompanyConnectComponent {
  displayModal: boolean = false;
  totalCount: number = 90;
  first: number = 0;
  page: number = 1;
  perPage: number = 10;
  industryTypes: DropdownOption[] = [];
  companySizes: DropdownOption[] = [];
  locations: DropdownOption[] = [];
  globalPresence: DropdownOption[] = [];
  foundedYears: DropdownOption[] = [];
  companyTypes: DropdownOption[] = [];
  companyDataList = [
   {
      name: 'UNIABROAD Pvt.Ltd',
      verified: true,
      shortlisted: false,
      openPositions: '05',
      headquarters: 'London, UK',
      yearFounded: '2019',
      companyType: 'MNC',
      companySize: '11-50',
      logo: 'assets/company-logo.png'
    }
  ]

  constructor() {}

  openVideoPopup(link: string) {

  }

  applyFilter() {

  }
}
