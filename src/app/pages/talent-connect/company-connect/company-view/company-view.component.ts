import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from "@angular/common";
import { ChipModule } from "primeng/chip";
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TalentConnectService } from "../../talent-connect.service";
import { CompanyChatComponent } from "../company-chat/company-chat.component";
import { SkeletonModule } from 'primeng/skeleton';
import { DrawerModule } from 'primeng/drawer';
import { PageFacadeService } from 'src/app/pages/page-facade.service';

@Component({
  selector: 'uni-company-view',
  templateUrl: './company-view.component.html',
  styleUrls: ['./company-view.component.scss'],
  standalone: true,
  imports: [ButtonModule, CommonModule, ChipModule, RouterModule, CompanyChatComponent, SkeletonModule, DrawerModule
  ]
})
export class CompanyViewComponent implements OnInit {

  showChat: boolean = true;
  companyDetails: any;
  companyId: any
  isSkeletonVisible: boolean = true;
  @Input() showInfo: boolean = true;
  visible: boolean = false;

  constructor(private route: ActivatedRoute, private talentConnectService: TalentConnectService, private pageFacade: PageFacadeService) {
  }

  ngOnInit(): void {
    this.companyId = this.route.snapshot.paramMap.get('id');
    this.getCompanyDetail(this.companyId)
  }

  getCompanyDetail(id: any) {
    this.talentConnectService.getCompanyDetails(id).subscribe({
      next: data => {
        this.companyDetails = data[0];
        this.isSkeletonVisible = false;
      },
      error: err => {
        this.isSkeletonVisible = false;
        console.log(err);
      }
    });
  }

  followCompany(followStatus: number) {
    this.talentConnectService.followCompany(this.companyId, followStatus ? 0 : 1).subscribe({
      next: response => {
        this.companyDetails.shortlisted = followStatus ? 0 : 1;
      },
      error: err => {
        console.log(err)
      }
    });
  }

  openVideoPopup() {
    this.pageFacade.openHowitWorksVideoPopup("company-connect");
  }

  openUrl(url: string) {
    if (url && !url.startsWith('http')) {
      url = 'https://' + url;
    }
    window.open(url, '_blank');
  }
}
