import { Component } from '@angular/core';
import {CommonModule} from "@angular/common";
import {ChipModule} from "primeng/chip";
import {TalentConnectModule} from "../talent-connect.module";
import {DropdownModule} from "primeng/dropdown";
import {DialogModule} from "primeng/dialog";
import {PaginatorModule, PaginatorState} from "primeng/paginator";
import {Select} from "primeng/select";
import {FormsModule} from "@angular/forms";
import {RouterLink} from "@angular/router";

interface DropdownOption {
  label: string;
  value: string;
}

@Component({
    imports: [
        CommonModule,
        ChipModule,
        TalentConnectModule,
        DialogModule,
        DropdownModule,
        PaginatorModule,
        Select,
        FormsModule,
        RouterLink
    ],
    selector: 'uni-company-connect',
    standalone: true,
    styleUrls: ['./company-connect.component.scss'],
    templateUrl: './company-connect.component.html'
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
      logo: '/uniprep-assets/image-available.png',
      vacancies: '20',
      industry: 'Ed tech',
      location: 'Chennai',
      workMode: 'Hybrid',
      department: 'IT'
    }
  ]
    pageSize: unknown;
    totalPitchDeckCount: unknown;

  constructor() {}

  openVideoPopup(link: string) {

  }

  applyFilter() {

  }

    clearFilter() {

    }

    pageChange($event: PaginatorState) {

    }
}
