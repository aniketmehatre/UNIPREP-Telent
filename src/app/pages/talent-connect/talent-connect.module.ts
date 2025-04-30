import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DialogModule} from 'primeng/dialog';
import {TalentConnectRoutingModule} from './talent-connect-routing.module';
import {CardModule} from 'primeng/card';
import {ButtonModule} from 'primeng/button';
import {TagModule} from 'primeng/tag';
import {AvatarModule} from 'primeng/avatar';
import {ChipModule} from 'primeng/chip';
import {DividerModule} from 'primeng/divider';
import {InputTextModule} from 'primeng/inputtext';
import {StepsModule} from 'primeng/steps';
import {TableModule} from 'primeng/table';
import {TabViewModule} from 'primeng/tabview';
import {TooltipModule} from 'primeng/tooltip';
import {FormsModule} from '@angular/forms';
import {SharedModule} from "../../shared/shared.module";
import {DropdownModule} from 'primeng/dropdown';
import {PaginatorModule} from 'primeng/paginator';
import { MainListComponent } from './main-list/main-list.component';
import { DrawerModule } from 'primeng/drawer';
@NgModule({
  declarations: [
    MainListComponent,
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
    DrawerModule,
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
    PaginatorModule,
  ],
})
export class TalentConnectModule { }
