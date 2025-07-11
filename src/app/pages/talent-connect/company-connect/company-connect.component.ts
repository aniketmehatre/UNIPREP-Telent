import { Component, inject, OnInit } from '@angular/core';
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
import { AuthService } from 'src/app/Auth/auth.service';
import { SocialShareService } from 'src/app/shared/social-share.service';

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
    socialShareService = inject(SocialShareService);

    constructor(private talentConnectService: TalentConnectService,
        private router: Router, private messageService: MessageService, private pageFacade: PageFacadeService, private authService: AuthService,) {
    }

    ngOnInit() {
        this.listCompanyData()
    }

    toggleShareDropdown(event: MouseEvent, companyId: number) {
        event.stopPropagation();
        this.activeDropdownCompanyId = this.activeDropdownCompanyId === companyId ? null : companyId;
    }

    generateCompanyLink(event: MouseEvent, company: any) {
        event.stopPropagation(); // Prevent card click behavior
      
        this.generateUUIDLink(company.id).subscribe({
          next: (res: any) => {
            const uuid = res?.uuid;
            const link = `${window.location.origin}/company/${uuid}`;
      
            this.socialShareService.copyQuestion(
              link,
              'Company Link copied successfully'
            );
      
            this.activeDropdownCompanyId = null;
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Could not generate link. Please try again.'
            });
          }
        });
      }

    generateUUIDLink(companyId: number) {
        return this.talentConnectService.generateUUIDLink(companyId);
    }

    listCompanyData(params?: any) {
        let requestData = {
            perpage: this.perPage,
            page: this.page,
            city_id: this.authService._user?.city_id,
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

    openVideoPopup() {
        this.pageFacade.openHowitWorksVideoPopup("company-connect")
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
