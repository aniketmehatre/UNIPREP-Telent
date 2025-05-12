import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { Company } from 'src/app/@Models/company-connect.model';
import { landingServices } from '../landing-page.service';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'uni-employers',
  imports: [DialogModule, CommonModule, RouterModule, ButtonModule],
  templateUrl: './employers.component.html',
  styleUrl: './employers.component.scss'
})
export class EmployersComponent {
  companyConnectList: Company[] = [];
  displayUnlockFilter: boolean = false;
  totalTalents: number = 0;
  currentPage: number = 1;
  itemsPerPage: number = 9;
  totalPages: number = 0;

  constructor(private landingPageService: landingServices) { }

  ngOnInit(): void {
    this.loadJobsData();
    this.totalPages = Math.ceil(this.companyConnectList.length / this.itemsPerPage);
  }

  loadJobsData(): void {
    this.landingPageService.getCompanyConnectList({ page: this.currentPage, perpage: this.itemsPerPage }).subscribe(
      (response) => {
        this.companyConnectList = response.companies;
        this.totalTalents = response.totalcount;
        this.totalPages = Math.ceil(this.totalTalents / this.itemsPerPage);
      },
      (error) => {
        console.error('Error fetching activeJobs:', error);
      });
  }


  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadJobsData();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.changePage(this.currentPage - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.changePage(this.currentPage + 1);
    }
  }
}
