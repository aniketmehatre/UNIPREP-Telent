import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { Company } from 'src/app/@Models/company-connect.model';
import { ButtonModule } from 'primeng/button';
import { landingServices } from '../landing-page.service';
import { PaginatorModule } from 'primeng/paginator';

@Component({
  selector: 'uni-employers',
  imports: [DialogModule, CommonModule, RouterModule, ButtonModule, PaginatorModule],
  templateUrl: './employers.component.html',
  styleUrl: './employers.component.scss'
})
export class EmployersComponent {
  companyConnectList: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  displayUnlockFilter: boolean = false;
  totalEmployers: number = 500;
  currentPage: number = 1;
  itemsPerPage: number = 9;
  first: number = 0;

  constructor(private landingPageService: landingServices) { }

  ngOnInit(): void {
  }


  onPageChange(event: any) {
    this.displayUnlockFilter = true;
    this.currentPage = event.page + 1;
    this.itemsPerPage = event.rows;
  // this.loadTalentsData();
  }
}
