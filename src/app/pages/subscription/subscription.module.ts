import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SubscriptionRoutingModule} from './subscription-routing.module';
import {SubscriptionComponent} from './subscription.component';

import {InputMaskModule} from "primeng/inputmask";
import {InputTextModule} from "primeng/inputtext";
import {CheckboxModule} from "primeng/checkbox";
import {ToastModule} from 'primeng/toast';
import { BuyCreditsComponent } from './buy-credits/buy-credits.component';
import { SubscriptionBillingComponent } from './subscription-billing/subscription-billing.component';
import { SubscriptionDataComponent } from './subscription-data/subscription-data.component';
import { SubscriptionListComponent } from './subscription-list/subscription-list.component';
import { SubscriptionSuccessComponent } from './subscription-success/subscription-success.component';
import {TableModule} from "primeng/table";
import {StoreModule} from "@ngrx/store";
import {EffectsModule} from "@ngrx/effects";
import {subscriptionFeatureKey} from "./store/selectors";
import {SubscriptionEffects} from "./store/effects";
import {subscriptionReducer} from "./store/reducer";
import {ButtonModule} from "primeng/button";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MultiSelectModule} from "primeng/multiselect";
import { DialogModule } from 'primeng/dialog';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ChipModule } from 'primeng/chip';
import { SubscriptionHistoryComponent } from './subscription-history/subscription-history.component';
import { CardModule } from 'primeng/card';
import { TabViewModule } from 'primeng/tabview';
import { UpgradeSubscriptionComponent } from './upgrade-subscription/upgrade-subscription.component';
import { SplitButtonModule } from 'primeng/splitbutton';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { NgxStripeModule } from 'ngx-stripe';
import { environment } from '@env/environment';
import { RouterModule } from '@angular/router';
import { CollegeSubscriptionDataComponent } from './clg-subscription-data/clg-subscription-data.component';
@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        SubscriptionRoutingModule,
        BuyCreditsComponent,
        SubscriptionBillingComponent,
        SubscriptionDataComponent,
        CollegeSubscriptionDataComponent,
        SubscriptionListComponent,
        SubscriptionSuccessComponent,
        SubscriptionHistoryComponent,
        UpgradeSubscriptionComponent,
        SubscriptionComponent,
        InputMaskModule,
        InputTextModule,
        CheckboxModule,
        StoreModule.forFeature(subscriptionFeatureKey, subscriptionReducer),
        EffectsModule.forFeature([SubscriptionEffects]),
        ToastModule,
        TableModule,
        ButtonModule,
        ReactiveFormsModule,
        MultiSelectModule,
        FormsModule,
        DialogModule,
        BreadcrumbModule,
        ChipModule,
        CardModule,
        TabViewModule,
        SplitButtonModule,
        TooltipModule ,
        ConfirmDialogModule,    
        NgxStripeModule.forRoot(environment.domain != "api.uniprep.ai"?'pk_live_51RatH904tgKnorO6oeJ6OkKBH8HS1XetBEv1piIezO2hwW2jqhABXJakopLKvBymyuOxgsztPXljh0TD2SK2xFyq00zEp7B1Dn':'pk_test_51RatH904tgKnorO6qAStN7DYjc0QvdazlEapxUmPKDqmnZAtBpl9FvfmrszVJakrk3SP6lcX7TYVY2BqTesxkW3k00e3SHimNK'),
    ],
     providers: [ConfirmationService,MessageService ],
})
export class SubscriptionModule {
}
