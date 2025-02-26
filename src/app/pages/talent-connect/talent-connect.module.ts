import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TalentConnectComponent } from './talent-connect.component';
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
import { FormsModule } from '@angular/forms';
import { JobChatUiComponent } from './job-tracker/job-chat-ui/job-chat-ui.component';
import { JobListComponent } from './job-tracker/job-list/job-list.component';
import { JobDetailsComponent } from './job-tracker/job-details/job-details.component';




@NgModule({
  declarations: [
    TalentConnectComponent,
    JobTrackerComponent,
    JobChatUiComponent,
    JobListComponent,
    JobDetailsComponent
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
  ]
})
export class TalentConnectModule { }
