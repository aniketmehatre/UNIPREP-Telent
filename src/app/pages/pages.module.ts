import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';
import { ThemeModule } from '@theme/theme.module';
import { StoreModule } from '@ngrx/store';
import { pagesFeatureKey } from './store/pages.selectors';
import { pagesReducer } from './store/pages.reducer';
import { ButtonComponent } from './button/button.component';
import { CardsComponent } from './cards/cards.component';
import { DocPreviewComponent } from "./sop/docpreview/docpreview.component";
import {TableModule} from "primeng/table";
import { SopSampleComponent } from './sop-sample/sop-sample.component';
import { HelpSupportComponent } from './help-support/help-support.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { EditprofileComponent } from './user-management/editprofile/editprofile.component';
import { SubcriptionManagerComponent } from './subcription-manager/subcription-manager.component';
@NgModule({
    declarations: [
        PagesComponent,
        ButtonComponent,
        CardsComponent,
        DocPreviewComponent,
        SopSampleComponent,
        HelpSupportComponent,
        UserManagementComponent,
        EditprofileComponent,
        SubcriptionManagerComponent,
    ],
    imports: [
        CommonModule,
        PagesRoutingModule,
        ThemeModule,
        StoreModule.forFeature(pagesFeatureKey, pagesReducer),
        TableModule,
    ]
})
export class PagesModule { }
