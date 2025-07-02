import { Component, OnInit } from '@angular/core';
import { PaginatorModule } from "primeng/paginator";
import { TalentConnectService } from "../talent-connect.service";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { CommonModule } from "@angular/common";
import { TagModule } from "primeng/tag";
import { CompanyFilterComponent } from "./company-filter/company-filter.component";
import { MessageService } from 'primeng/api';
import { PageFacadeService } from '../../page-facade.service';

interface DropdownOption {
    label: string;
    value: string;
}
@Component({
    selector: 'uni-company-connect',
    styleUrls: ['./company-connect.component.scss'],
    templateUrl: './company-connect.component.html',
    imports: [
        CommonModule,
        FormsModule,
        RouterLink,
        ReactiveFormsModule,
        PaginatorModule,
        TagModule,
        CompanyFilterComponent
    ],
    standalone: true
})
export class CompanyConnect1Component implements OnInit {
    displayModal: boolean = false;
    totalCount: number = 0;
    first: number = 0;
    page: number = 1;
    perPage: number = 12;
    industryTypes: DropdownOption[] = [];
    companySizes: DropdownOption[] = [];
    locations: DropdownOption[] = [];
    globalPresence: DropdownOption[] = [];
    foundedYears: DropdownOption[] = [];
    companyTypes: DropdownOption[] = [];
    companyDataList = []
    totalJob: number = 0;
    totalVacancies: number = 0;
    companyObj: any
    isSkeletonVisible: boolean = true;
    
    constructor(private talentConnectService: TalentConnectService,
        private router: Router, private messageService: MessageService, private pageFacade: PageFacadeService) {
    }

    ngOnInit() {
        this.listCompanyData()
    }

    listCompanyData(params?: any) {
        const requestData = {
            perpage: this.perPage,
            page: this.page,
            ...params
        };

        this.talentConnectService.getTalentConnectCompanies(requestData).subscribe({
            next: data => {
                this.companyDataList = data.companies;
                this.totalCount = data.totalcount;
                this.totalJob = data.totaljob;
                this.totalVacancies = data.totalvacancies;
                this.displayModal = false;
                this.isSkeletonVisible = false;
            },
            error: err => {
                this.isSkeletonVisible = false;
                console.log(err)
            }
        })
    }

    openVideoPopup(videoLink: string) {
        this.pageFacade.openHowitWorksVideoPopup(videoLink)
    }

    routerToJobListingPageWithCompanyId(event: any, id: number) {
        event.stopPropagation();
        this.router.navigate(['/pages/talent-connect/easy-apply'], { queryParams: { company: id } });
    }

    applyFilter(event: any) {
        this.companyObj = event;
        this.listCompanyData(this.companyObj)

    }

    clearFilter() {
        this.companyObj = {};
        this.listCompanyData(this.companyObj)

    }

    pageChange(event: any) {
        this.page = event.page + 1
        this.perPage = event.rows
        this.listCompanyData(this.companyObj)
    }

    onClickCompany(id: number) {
        this.router.navigate(['/pages/talent-connect/company-connect', id]);
    }

    onClickShortListCompany(id: any, followStatus: number) {
        this.talentConnectService.followCompany(id, followStatus ? 0 : 1).subscribe({
            next: data => {
                this.listCompanyData()
            },
            error: err => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to shortlist company' });
                console.log(err.error.message);
            }
        })
    }
}
