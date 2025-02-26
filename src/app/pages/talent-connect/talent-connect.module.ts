import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TalentConnectComponent } from './talent-connect.component';
import { DialogModule } from 'primeng/dialog';
import { TalentConnectRoutingModule } from './talent-connect-routing.module';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';




@NgModule({
  declarations: [
    TalentConnectComponent
  ],
  imports: [
    CommonModule,
    DialogModule,
    TalentConnectRoutingModule,
    CardModule,
    ButtonModule,
    TagModule
  ]
})
export class TalentConnectModule { }
