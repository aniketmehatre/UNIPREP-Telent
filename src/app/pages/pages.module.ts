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
import {TableModule} from "primeng/table";
import {HelpSupportComponent} from './help-support/help-support.component';
import {UserManagementComponent} from './user-management/user-management.component';
import {EditprofileComponent} from './user-management/editprofile/editprofile.component';
import {FooterStatusBoxComponent} from './footer-status-box/footer-status-box.component';
import {HeaderSearchComponent} from './header-search/header-search.component';
import {ButtonModule} from "primeng/button";
import {InputTextModule} from "primeng/inputtext";
import {RippleModule} from "primeng/ripple";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DropdownModule} from "primeng/dropdown";
import {CalendarModule} from "primeng/calendar";
import {TabViewModule} from 'primeng/tabview';
import {InputSwitchModule} from "primeng/inputswitch";
import {MultiSelectModule} from "primeng/multiselect";
import { CarouselModule } from 'primeng/carousel';
import { DialogModule } from 'primeng/dialog';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { QuestionCreditComponent } from './question-credit/question-credit.component';
import {ProgressBarModule} from "primeng/progressbar";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {EffectsModule} from "@ngrx/effects";
import {ModuleStoreReducer} from "./module-store/module-store.reducer";
import {appFeatureKey} from "./module-store/module-store.selectors";
import {ModuleStoreEffects} from "./module-store/module-store.effects";
import { ChatComponent } from './chat/chat.component';
import { CardModule } from 'primeng/card';
import { EditorModule } from 'primeng/editor';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import {AccordionModule} from 'primeng/accordion';
@NgModule({
    declarations: [
        PagesComponent,
        ButtonComponent,
        CardsComponent,
        HelpSupportComponent,
        UserManagementComponent,
        EditprofileComponent,
        FooterStatusBoxComponent,
        HeaderSearchComponent,
        QuestionCreditComponent,
        ChatComponent
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
        StoreModule.forFeature(appFeatureKey, ModuleStoreReducer),
        EffectsModule.forFeature([ModuleStoreEffects]),
        TableModule,
        ButtonModule,
        InputTextModule,
        RippleModule,
        ReactiveFormsModule,
        DropdownModule,
        CalendarModule,
        TabViewModule,
        MultiSelectModule,
        CarouselModule,
        DialogModule,
        BreadcrumbModule,
        FormsModule,
        InputSwitchModule,
        ProgressBarModule,
        ConfirmDialogModule,
        CardModule,
        EditorModule,
        ConfirmPopupModule,
        ConfirmDialogModule,
        AccordionModule
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ],
})
export class PagesModule {
}
