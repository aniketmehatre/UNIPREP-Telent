import {Component} from '@angular/core';
import {CommonModule} from "@angular/common";
import {ChipModule} from "primeng/chip";
import {JobChatUiComponent} from "../../job-tracker/job-chat-ui/job-chat-ui.component";
import {ButtonModule} from 'primeng/button';
import {ActivatedRoute, RouterModule} from '@angular/router';
import {TalentConnectService} from "../../talent-connect.service";

@Component({
  selector: 'uni-company-view',
  templateUrl: './company-view.component.html',
  styleUrls: ['./company-view.component.scss'],
  standalone: true,
  imports: [
    ButtonModule,
    CommonModule,
    ChipModule,
    JobChatUiComponent,
    RouterModule
  ]
})
export class CompanyViewComponent {

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

  workLifeBalancePolicies = [
    'Flexible Work Arrangements',
    'Health Insurance',
    'Childcare Assistance',
    'Learning & Growth',
    'Flexible',
    'Remote Work Options'
  ];

  employeeBenefits = [
    'Professional Development',
    'Workplace Perks',
    'Employee Recognition & Rewards',
    'Flexible Work Arrangements'
  ];

  workLocation = 'On-Site';

  hiringStages = [
    'Onboarding & Orientation',
    'Interview Process',
    'Initial Screening & Phone Interview',
    'Resume Screening & Shortlisting'
  ];

  hiringTimeframe = '2-4 Weeks';
  interviewFormat = 'Traditional Interview Format';

  showChat: boolean = false;
  companyDetails: any;
  companyId: any

  constructor(private route: ActivatedRoute, private talentConnectService: TalentConnectService) {
  }

  ngOnInit(): void {
    this.companyId = this.route.snapshot.paramMap.get('id');
    this.getCompanyDetail(this.companyId)
  }


  followCompany(){
    this.talentConnectService.followCompany(this.companyId).subscribe(
        {
          next: result => {
            console.log(result);
          },
          error: err => {
            console.log(err)
          }
        }
    )
  }

  getCompanyDetail(id: any) {
    this.talentConnectService.getCompanyDetails(id).subscribe({
      next: data => {
        console.log(data)
        this.companyDetails = data[0]
      },
      error: err => {
        console.log(err)
      }
    })
  }



  openVideoPopup(id: string) {}
}
