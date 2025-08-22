import { Component, inject, OnInit } from '@angular/core';
import { PaginatorModule } from "primeng/paginator";
import { TalentConnectService } from "../talent-connect.service";
import { FormsModule } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { CommonModule } from "@angular/common";
import { TagModule } from "primeng/tag";
import { CompanyFilterComponent } from "./company-filter/company-filter.component";
import { MessageService } from 'primeng/api';
import { PageFacadeService } from '../../page-facade.service';
import { ToastModule } from 'primeng/toast';
import { AuthService } from 'src/app/Auth/auth.service';
import { SocialShareService } from 'src/app/services/social-share.service';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'uni-company-connect',
    styleUrls: ['./company-connect.component.scss'],
    templateUrl: './company-connect.component.html',
    imports: [CommonModule, FormsModule, PaginatorModule, TagModule, CompanyFilterComponent,
        ToastModule, ButtonModule
    ],
    standalone: true
})
export class CompanyConnectComponent implements OnInit {
    displayModal: boolean = false;
    totalCount: number = 0;
    first: number = 0;
    page: number = 1;
    perPage: number = 12;
    companyDataList: any[] = [];
    totalJob: number = 0;
    totalVacancies: number = 0;
    companyObj: any;
    isSkeletonVisible: boolean = true;
    activeDropdownCompanyId: number | null = null;
    socialShareService = inject(SocialShareService);

    constructor(private talentConnectService: TalentConnectService,
        private router: Router, private messageService: MessageService, private pageFacade: PageFacadeService,
        private authService: AuthService,) {
    }

    ngOnInit() {
        this.listCompanyData();
    }

    toggleCompanyDropdown(companyId: number): void {
        this.activeDropdownCompanyId = this.activeDropdownCompanyId === companyId ? null : companyId;
      }
      
      private buildCompanyLink(company: any): string {
        return encodeURI(`${window.location.origin}/company/${company.uuid}`);
      }
      
      shareCompanyViaWhatsapp(company: any): void {
        const url = this.buildCompanyLink(company);
        window.open(`whatsapp://send?text=${url}`, "_blank");
      }
      
      shareCompanyViaMail(company: any): void {
        const url = this.buildCompanyLink(company);
        window.open(`mailto:?body=${url}`, "_blank");
      }
      
      shareCompanyViaFacebook(company: any): void {
        const url = this.buildCompanyLink(company);
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank");
      }
      
      shareCompanyViaTwitter(company: any): void {
        const url = this.buildCompanyLink(company);
        window.open(`https://twitter.com/intent/tweet?url=${url}`, "_blank");
      }
      
      shareCompanyViaInstagram(company: any): void {
        const url = this.buildCompanyLink(company);
        window.open(`https://www.instagram.com?url=${url}`, "_blank");
      }
      
      shareCompanyViaLinkedIn(company: any): void {
        const url = this.buildCompanyLink(company);
        window.open(`https://www.linkedin.com/shareArticle?url=${url}`, "_blank");
      }
      
      copyCompanyLink(company: any): void {
        console.log(company)
        const url = this.buildCompanyLink(company);
        navigator.clipboard.writeText(url);
        this.messageService.add({
          severity: "success",
          summary: "Copied",
          detail: "Company link copied successfully!",
        });
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
                console.log(err);
            }
        })
    }

    openVideoPopup() {
        this.pageFacade.openHowitWorksVideoPopup("company-connect");
    }

    routerToJobListingPageWithCompanyId(event: any, id: number) {
        event.stopPropagation();
        this.router.navigate(['/pages/talent-connect/easy-apply'], { queryParams: { company: id } });
    }

    applyFilter(event: any) {
        this.companyObj = event;
        this.listCompanyData(this.companyObj);

    }

    clearFilter() {
        this.companyObj = {};
        this.listCompanyData(this.companyObj);
    }

    pageChange(event: any) {
        this.page = event.page + 1;
        this.perPage = event.rows;
        this.listCompanyData(this.companyObj);
    }

    onClickCompany(id: number) {
        this.router.navigate(['/pages/talent-connect/company-connect', id]);
    }

    onClickShortListCompany(id: any, followStatus: number) {
        this.talentConnectService.followCompany(id, followStatus ? 0 : 1).subscribe({
            next: data => {
                this.listCompanyData();
            },
            error: err => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to shortlist company' });
                console.log(err.error.message);
            }
        });
    }
}
