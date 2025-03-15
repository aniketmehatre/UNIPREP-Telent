import {Component, OnInit} from '@angular/core';
import {Paginator, PaginatorState} from "primeng/paginator";
import {TalentConnectService} from "../talent-connect.service";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Dialog} from "primeng/dialog";
import {Select} from "primeng/select";
import {PrimeTemplate} from "primeng/api";
import {Tooltip} from "primeng/tooltip";
import {Router, RouterLink} from "@angular/router";
import {CommonModule, NgClass} from "@angular/common";
import {TagModule} from "primeng/tag";

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
        PrimeTemplate,
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
    totalPitchDeckCount: number;
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
        this.getCompanyTypes()
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
                console.log(data)
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

    getCompanyTypes() {
        this.talentConnectService.getCompanyTypes().subscribe({
            next: data => {
                console.log(data)
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

    pageChange($event: PaginatorState) {

    }

    onClickCompany(id: number) {
        this.router.navigate(['/pages/talent-connect/company-connect', id]);
    }
}
