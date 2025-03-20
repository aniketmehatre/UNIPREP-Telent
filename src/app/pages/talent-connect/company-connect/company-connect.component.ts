import {Component, OnInit} from '@angular/core';
import {Paginator, PaginatorState} from "primeng/paginator";
import {TalentConnectService} from "../talent-connect.service";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Dialog} from "primeng/dialog";
import {Select} from "primeng/select";
import {Tooltip} from "primeng/tooltip";
import {Router, RouterLink} from "@angular/router";
import {CommonModule, NgClass} from "@angular/common";
import {TagModule} from "primeng/tag";
import { forkJoin } from 'rxjs';

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
        Dialog,
        Select,
        Tooltip,
        RouterLink,
        NgClass,
        ReactiveFormsModule,
        Paginator,
        TagModule
    ],
    standalone: true
})
export class CompanyConnect1Component implements OnInit {
    displayModal: boolean = false;
    totalCount: number;
    first: number = 0;
    page: number = 1;
    perPage: number = 10;
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
                private router: Router) {
        this.companyForm = this.fb.group({
            companyname: [''],
            industrytype: [[]], // Array values
            companysize: [],
            hq: [],
            globalpresence: [[]], // Array values
            foundedyear: [],
            companytype: [],
        });
    }

    ngOnInit() {
        this.listCompanyData()
    }

    listCompanyData() {
        const requestData = {
            perpage: this.perPage,
            page: this.page,
            companyname: "Test",
            industrytype: [2, 1],  // Converted to an array for better structure
            companysize: 1,
            hq: 2,
            globalpresence: [1, 2, 3], // Converted to an array
            foundedyear: 2002,
            companytype: 1
        };
        const requestDataEmpty = {
            perpage: this.perPage,
            page: this.page,
        };
        this.talentConnectService.getTalentConnectCompanies(requestDataEmpty).subscribe({
            next: data => {
                this.companyDataList = data.companies;
                this.totalCount = data.totalcount;
                this.totalJob = data.totaljob;
                this.totalVacancies = data.totalvacancies
            },
            error: err => {
                console.log(err)
            }
        })
    }

    openVideoPopup(link: string) {

    }

    applyFilter() {
        console.log(this.companyForm.value)
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

            }
        })
    }

    onDialogOpen() {
        this.loadApiData();
    }

    loadApiData() {
        forkJoin({
            companyTypes: this.talentConnectService.getCompanyTypes(),
            industryTypes: this.talentConnectService.getIndustryTypes(),
            globalPresence: this.talentConnectService.globalPresence(),
            locations: this.talentConnectService.getCityWithFlag(),
            companySizes: this.talentConnectService.getCompanySizes()
        }).subscribe({
            next: (results) => {
                this.companyTypes = results.companyTypes;
                this.industryTypes = results.industryTypes;
                this.globalPresence = results.globalPresence;
                this.locations = results.locations;
                this.companySizes = results.companySizes.industries; // Adjusting for industry structure
            },
            error: (error) => {
                console.error("Error loading data:", error);
            }
        });
    }
}
