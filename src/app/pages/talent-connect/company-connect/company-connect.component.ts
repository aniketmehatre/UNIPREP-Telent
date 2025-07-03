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
import { ToastModule } from 'primeng/toast';
import { StorageService } from 'src/app/storage.service';

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
        CompanyFilterComponent,
        ToastModule
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
    activeDropdownCompanyId: number | null = null;


    currentLocationDetails: any;

    constructor(private talentConnectService: TalentConnectService,
        private router: Router, private messageService: MessageService, private pageFacade: PageFacadeService, private storage: StorageService,) {
    }

    ngOnInit() {
        this.currentLocationDetails = this.storage.get("currentCountryByGEOLocation");
        this.listCompanyData()
    }

    toggleShareDropdown(event: MouseEvent, companyId: number) {
        event.stopPropagation();
        this.activeDropdownCompanyId = this.activeDropdownCompanyId === companyId ? null : companyId;
    }

    generateCompanyLink(company: any) {

        /*
        this.generateUUIDLink(company.id).subscribe((res) => {
            const uuid = res.uuid;
            const link = `${window.location.origin}/pages/job/${uuid}`;
            const message = `Check out this job at ${company.company_name}:\n${link}`;

            navigator.clipboard.writeText(message).then(() => {
            alert("Link copied to clipboard:\n\n" + message);
            });
        });
        */

        const uuid = 'abc123-fake-uuid';
        const link = `${window.location.origin}/pages/job/${uuid}`;
        const message = `Check out this job at ${company.company_name}:\n${link}`;

        navigator.clipboard.writeText(message).then(() => {
            this.messageService.add({
                severity: 'success',
                summary: 'Link Copied!',
                detail: message,
                life: 5000
            });
        });

        this.activeDropdownCompanyId = null;
    }

    generateUUIDLink(companyId: number) {
        return this.talentConnectService.generateUUIDLink(companyId);
    }

    listCompanyData(params?: any) {
        let requestData = {
            perpage: this.perPage,
            page: this.page,
            ...params
        };
        if (this.currentLocationDetails) {
            requestData = {
                ...requestData,
                country: this.currentLocationDetails?.country,
                state: this.currentLocationDetails?.state,
                city: this.currentLocationDetails?.county
            }
        }
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
