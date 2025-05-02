import {Component, OnInit} from '@angular/core';
import { PaginatorModule } from "primeng/paginator";
import {TalentConnectService} from "../talent-connect.service";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Dialog} from "primeng/dialog";
import {Select} from "primeng/select";
import {Tooltip} from "primeng/tooltip";
import {Router, RouterLink} from "@angular/router";
import {CommonModule, NgClass} from "@angular/common";
import {TagModule} from "primeng/tag";
import { forkJoin } from 'rxjs';
import { CompanyFilterComponent } from "./company-filter/company-filter.component";
import { MessageService } from 'primeng/api';

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
        Tooltip,
        RouterLink,
        NgClass,
        ReactiveFormsModule,
        PaginatorModule,
        TagModule,
        CompanyFilterComponent
    ],
    standalone: true
})
export class CompanyConnect1Component implements OnInit {
    displayModal: boolean = false;
    totalCount: number;
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
    totalJob: number;
    totalVacancies: number;
    companyForm: FormGroup;


    constructor(private talentConnectService: TalentConnectService, private fb: FormBuilder,
        private router: Router, private messageService: MessageService) {
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
            },
            error: err => {
                console.log(err)
            }
        })
    }

    openVideoPopup(link: string) {

    }

    applyFilter() {
        console.log(this.companyForm.value);
    }

    clearFilter() {

    }

    pageChange(event: any) {
        this.page = event.page + 1
        this.perPage = event.rows
        this.listCompanyData()
    }

    onClickCompany(id: number) {
        this.router.navigate(['/pages/talent-connect/company-connect', id]);
    }

    onClickShortListCompany(id: any) {
        this.talentConnectService.shortListCompany(id).subscribe({
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
