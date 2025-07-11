import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { TalentConnectService } from "../../talent-connect.service";
import { Company } from 'src/app/@Models/company-connect.model';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'uni-company-detail',
  templateUrl: './company-detail.component.html',
  styleUrls: ['./company-detail.component.scss'],
  standalone: true,
  imports: [ChipModule, ButtonModule, CommonModule, SkeletonModule]
})
export class CompanyDetailComponent implements OnInit {

  @Input() companyId!: any;
  @Output() openChat = new EventEmitter<boolean>(true);
  @Output() closeInfo: EventEmitter<boolean> = new EventEmitter<boolean>(true);
  @Input() showInfo: boolean = true;
  @Input() showChat: boolean = false;
  @Output() studentIdRelay = new EventEmitter<number>();
  @Input() companyDetails!: Company;
  isSkeletonVisible: boolean = false;

  constructor(private talentConnectService: TalentConnectService) {
  }

  ngOnInit() {

  }

  followCompany(followStatus: number) {
    this.talentConnectService.followCompany(this.companyId, followStatus ? 0 : 1).subscribe({
      next: response => {
        this.companyDetails.shortlisted = followStatus ? 0 : 1;
      },
      error: err => {
        console.log(err);
      }
    });
  }

  onStudentIdFromChat(id: number) {
    this.studentIdRelay.emit(id); // Bubble it up to parent
  }

  openUrl(url: string) {
    if (url && !url.startsWith('http')) {
      url = 'https://' + url;
    }
    window.open(url, '_blank');
  }
}

