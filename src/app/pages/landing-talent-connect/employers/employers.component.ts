import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { Company } from 'src/app/@Models/company-connect.model';
import { ButtonModule } from 'primeng/button';
import { LandingTalentService } from '../landing-page.service';
import { PaginatorModule } from 'primeng/paginator';

@Component({
  selector: 'uni-employers',
  imports: [DialogModule, CommonModule, RouterModule, ButtonModule, PaginatorModule],
  templateUrl: './employers.component.html',
  styleUrl: './employers.component.scss'
})
export class EmployersComponent {
  companyConnectList: string[] = [];
  displayUnlockFilter: boolean = false;
  isShowEmpty: boolean = false;
  totalEmployers: number = 500;
  currentPage: number = 1;
  itemsPerPage: number = 9;
  first: number = 0;

  constructor(private landingTalentService: LandingTalentService) { }

  ngOnInit(): void {
    this.getStaticCardByType();
  }


  getStaticCardByType() {
    this.landingTalentService.getStaticCardsByType('company').subscribe({
      next: response => {
        this.companyConnectList = response.data;
        if (this.companyConnectList && this.companyConnectList.length < 0) {
          this.isShowEmpty = true;
        }
      },
      error: error => {
        this.isShowEmpty = true;
        console.error(error.error.message);
      }
    })
  }


  onPageChange(event: any) {
    this.displayUnlockFilter = true;
    this.currentPage = event.page + 1;
    this.itemsPerPage = event.rows;
  // this.loadTalentsData();
  }
}
