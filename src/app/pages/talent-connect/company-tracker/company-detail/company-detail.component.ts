import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { TalentConnectService } from "../../talent-connect.service";
import { ChatComponent } from '../../company-connect/chat/chat.component';
import { Company } from 'src/app/@Models/company-connect.model';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'uni-company-detail',
  templateUrl: './company-detail.component.html',
  styleUrls: ['./company-detail.component.scss'],
  standalone: true,
  imports: [ChipModule, ButtonModule, CommonModule, ChatComponent, SkeletonModule]
})
export class CompanyDetailComponent implements OnInit, OnChanges {

  @Input() companyId!: any;
  @Output() openChat = new EventEmitter<boolean>(true);
  @Input() showInfo: boolean = true;
  showChat: boolean = false;
  @Output() studentIdRelay = new EventEmitter<number>();
  companyInfo = {
    name: 'UNIABROAD Technology Pvt. Ltd.',
    founded: 2019,
    headquartersLocation: 'Mysore, Karnataka',
    companyType: 'Startup',
    companySize: '10-49 Employees',
    sizeCategory: 'Small enterprises',
    industryType: 'Primary',
    globalPresence: ['India', 'United Kingdom'],
    websiteUrl: 'www.uniabroad.co.in',
    linkedInProfile: 'https://www.linkedin.com/company/example-corp/',
    logo: 'assets/uniabroad-logo.png',
    about: 'We\'re a company dedicated to helping students achieve their dream of studying abroad. Our journey began in 2019, when our founders recognized the need for a reliable and comprehensive overseas education company. Since then, we\'ve been working tirelessly to guide students in the process of applying to and studying at top universities around the world.\nWe\'re proud of the work we\'ve done so far, and we\'re excited to continue making a positive impact on the lives of students around the world.'
  };
  companyDetails!: Company;
  isSkeletonVisible: boolean = false;

  constructor(private talentConnectService: TalentConnectService) {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes) {
      this.init();
    }
  }

  init() {
    this.talentConnectService.getCompanyDetails(this.companyId).subscribe({
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

  followCompany(followStatus:number) {
    this.talentConnectService.followCompany(this.companyId, followStatus ? 0 : 1).subscribe({
      next: response => {
        if (response.success) {
          this.companyDetails.followed =  followStatus ? 0 : 1;
        }
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

