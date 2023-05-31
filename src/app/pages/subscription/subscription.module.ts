import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SubscriptionRoutingModule} from './subscription-routing.module';
import {SubscriptionComponent} from './subscription.component';
import {DropdownModule} from "primeng/dropdown";
import {InputMaskModule} from "primeng/inputmask";
import {InputTextModule} from "primeng/inputtext";
import {CheckboxModule} from "primeng/checkbox";
import {ToastModule} from 'primeng/toast';
import {MessageService} from "primeng/api";
import {SubscribtionbillingComponent} from '../subscribtionbilling/subscribtionbilling.component';
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

@NgModule({
    declarations: [
        SubscriptionComponent,
        SubscribtionbillingComponent,
        BuyCreditsComponent,
        SubscriptionBillingComponent,
        SubscriptionDataComponent,
        SubscriptionListComponent,
        SubscriptionSuccessComponent
    ],
    imports: [
        CommonModule,
        SubscriptionRoutingModule,
        DropdownModule,
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
    ],
    providers: [MessageService]
})
export class SubscriptionModule {
}
