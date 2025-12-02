import { Component, inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { DialogModule } from "primeng/dialog";
import { TooltipModule } from "primeng/tooltip";
import { PaginatorModule } from "primeng/paginator";
import { LandingTalentService } from "../landing-page.service";
import { environment } from "@env/environment";
import { SocialShareService } from "src/app/services/social-share.service";
import { LocalStorageService } from "ngx-localstorage";
import { JobListing } from "src/app/@Models/employee-connect-job.model";
import { PopoverModule } from "primeng/popover";

@Component({
  selector: "uni-active-jobs",
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    TooltipModule,
    DialogModule,
    PaginatorModule,
    PopoverModule,
  ],
  templateUrl: "./active-jobs.component.html",
  styleUrl: "./active-jobs.component.scss",
})
export class ActiveJobsComponent implements OnInit {
  jobListings: any;
  displayUnlockFilter: boolean = false;
  currentPage: number = 1;
  isShowEmpty: boolean = false;
  itemsPerPage: number = 9;
  first: number = 0;
  totalJobs: number = 100;
  socialShareService = inject(SocialShareService);
  page: number = 1;
  pageSize: number = 12;
  totalVacancies: number = 0;
  constructor(
    private landingTalentService: LandingTalentService,
    private storage: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.getStaticCardByType();
  }

  getStaticCardByType() {
    let data: any = {
      page: this.page,
      perPage: this.pageSize,
    };
    // let params = { company: "company" };
    // if (params) {
    //   data = { ...data, ...params };
    // }
    this.landingTalentService.getJobShareList(data).subscribe({
      next: (response) => {
        this.totalJobs = response.totaljobs;
        this.totalVacancies = response.totalvacancies;
        this.jobListings = response.jobs;
          this.jobListings = this.jobListings.map((data: any) => ({
              ...data,
              salary_per_month: data.salary_per_month
                  ?.replace(/\/Month/i, "")
                  .trim(),
          }));
        if (this.jobListings && this.jobListings.length < 0) {
          this.isShowEmpty = true;
        }
      },
      error: (error) => {
        this.isShowEmpty = true;
        console.error(error.error.message);
      },
    });
  }

  onPageChange(event: any) {
    this.currentPage = event.page + 1;
    this.itemsPerPage = event.rows;
    this.displayUnlockFilter = true;
    // this.loadTalentsData();
  }

  getStatus(value: string) {
    return (
      value?.replace(/\s+/g, " ")?.trim()?.toLowerCase() === "future hiring"
    );
  }

  shareQuestion(event: any, type: string, job: JobListing) {
    event.stopPropagation();
    const socialMedias: { [key: string]: string } =
      this.socialShareService.socialMediaList;
    let url: any;
    let domainName = this.storage.get("domainname");
    if (domainName) {
      url = encodeURI(
        environment.jobDomain + `/view/${job.uuid}/${domainName}`
      );
    } else {
      url = encodeURI(environment.jobDomain + `/view/${job.uuid}`);
    }

    //const url = environment.jobDomain + '/view/' + job.uuid;
    //const encodedUrl = encodeURIComponent(url);
    const title = encodeURIComponent(
      "UNIPREP | " + job?.position + " | " + job.company_name
    );

    // this.meta.updateTag({ property: "og:url", content: url });
    // this.meta.updateTag({ property: "og:title", content: title });
    let shareUrl = "";
    switch (type) {
      case "Whatsapp":
        shareUrl = `${socialMedias[type]}${title}%0A${url}`;
        break;
      case "Mail":
        shareUrl = `${socialMedias[type]}${title}%0A${url}`;
        break;
      case "LinkedIn":
        shareUrl = `${socialMedias[type]}${url}&title=${title}`;
        break;
      case "Twitter":
        shareUrl = `${socialMedias[type]}${url}&text=${title}`;
        break;
      case "Facebook":
        shareUrl = `${socialMedias[type]}${url}`;
        break;
      case "Instagram":
        shareUrl = `${socialMedias[type]}${url}`;
        break;
      default:
        shareUrl = `${socialMedias[type]}${url}`;
    }
    window.open(shareUrl, "_blank");
  }

  copyLink(event: any, job: any) {
    event.stopPropagation();
    let textToCopy: any;
    let domainName = this.storage.get("domainname");
    if (domainName) {
      textToCopy = encodeURI(
        environment.jobDomain + `/view/${job.uuid}/${domainName}`
      );
    } else {
      textToCopy = encodeURI(environment.jobDomain + `/view/${job.uuid}`);
    }
    this.socialShareService.copyQuestion(
      textToCopy,
      "Job Link copied successfully"
    );
  }

  onClickJob() {
    this.displayUnlockFilter = true;
  }
}
