import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { TalentConnectRoutingModule } from './talent-connect-routing.module';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { JobTrackerComponent } from './job-tracker/job-tracker.component';
import { AvatarModule } from 'primeng/avatar';
import { ChipModule } from 'primeng/chip';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { StepsModule } from 'primeng/steps';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { TooltipModule } from 'primeng/tooltip';
import { TabMenuModule } from 'primeng/tabmenu';
import { FormsModule } from '@angular/forms';
import { JobChatUiComponent } from './job-tracker/job-chat-ui/job-chat-ui.component';
import { JobListComponent } from './job-tracker/job-list/job-list.component';
import { JobDetailsComponent } from './job-tracker/job-details/job-details.component';
import { MainListComponent } from './main-list/main-list.component';
import {SharedModule} from "../../shared/shared.module";
import { ProfileViewComponent } from './my-profile/profile-view/profile-view.component';
import { CompanyTrackerComponent } from './company-tracker/company-tracker.component';
import { CompanyListsComponent } from './company-tracker/company-list/company-list.component';
import { CompanyDetailComponent } from './company-tracker/company-detail/company-detail.component';
import { DropdownModule } from 'primeng/dropdown';
import { CompanyConnectComponent } from './company-connect/company-connect.component';
import { PaginatorModule } from 'primeng/paginator';

@NgModule({
  declarations: [
    JobTrackerComponent,
    JobChatUiComponent,
    JobListComponent,
    JobDetailsComponent,
    MainListComponent,
    ProfileViewComponent,
    CompanyTrackerComponent,
    CompanyListsComponent,
    CompanyDetailComponent,
  ],
  imports: [
    CommonModule,
    DialogModule,
    TalentConnectRoutingModule,
    CardModule,
    ButtonModule,
    TagModule,
    TableModule,
    ButtonModule,
    CardModule,
    TabViewModule,
    InputTextModule,
    AvatarModule,
    ChipModule,
    TooltipModule,
    StepsModule,
    DialogModule,
    DividerModule,
    FormsModule,
    SharedModule,
    DialogModule,
    DropdownModule,
    PaginatorModule
  ],
  exports: [
    JobChatUiComponent
  ]
})
export class TalentConnectModule { }
