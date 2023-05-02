import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PagesRoutingModule} from './pages-routing.module';
import {PagesComponent} from './pages.component';
import {ThemeModule} from '@theme/theme.module';
import {StoreModule} from '@ngrx/store';
import {pagesFeatureKey} from './store/pages.selectors';
import {pagesReducer} from './store/pages.reducer';
import {ButtonComponent} from './button/button.component';
import {CardsComponent} from './cards/cards.component';
import {DocPreviewComponent} from "./sop/docpreview/docpreview.component";
import {TableModule} from "primeng/table";
import {SopSampleComponent} from './sop-sample/sop-sample.component';
import {HelpSupportComponent} from './help-support/help-support.component';
import {UserManagementComponent} from './user-management/user-management.component';
import {EditprofileComponent} from './user-management/editprofile/editprofile.component';
import {SubcriptionManagerComponent} from './subcription-manager/subcription-manager.component';
import {FooterStatusBoxComponent} from './footer-status-box/footer-status-box.component';
import {HeaderSearchComponent} from './header-search/header-search.component';
import {ButtonModule} from "primeng/button";
import {InputTextModule} from "primeng/inputtext";
import {RippleModule} from "primeng/ripple";
import {PreApplicationModule} from './pre-application/pre-application.module';
import {PostAdmissionModule} from "./post-admission/post-admission.module";
import { SubscribtionbillingComponent } from './subscribtionbilling/subscribtionbilling.component';
import {ReactiveFormsModule} from "@angular/forms";
import {DropdownModule} from "primeng/dropdown";
import {CalendarModule} from "primeng/calendar";
import {InputSwitchModule} from "primeng/inputswitch";
import {MultiSelectModule} from "primeng/multiselect";

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
        FooterStatusBoxComponent,
        HeaderSearchComponent,
    ],
    exports: [
        FooterStatusBoxComponent,
        HeaderSearchComponent
    ],
    imports: [
        CommonModule,
        PagesRoutingModule,
        ThemeModule,
        StoreModule.forFeature(pagesFeatureKey, pagesReducer),
        TableModule,
        ButtonModule,
        InputTextModule,
        RippleModule,
        PreApplicationModule,
        PostAdmissionModule,
        ReactiveFormsModule,
        DropdownModule,
        CalendarModule,
        InputSwitchModule,
        MultiSelectModule
    ]
})
export class PagesModule {
}
