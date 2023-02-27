import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubscriptionRoutingModule } from './subscription-routing.module';
import { SubscriptionComponent } from './subscription.component';
import {DropdownModule} from "primeng/dropdown";
import {InputMaskModule} from "primeng/inputmask";
import {InputTextModule} from "primeng/inputtext";
import {CheckboxModule} from "primeng/checkbox";
import {ToastModule} from 'primeng/toast';
import {MessageService} from "primeng/api";

@NgModule({
  declarations: [
    SubscriptionComponent
  ],
  imports: [
    CommonModule,
    SubscriptionRoutingModule,
    DropdownModule,
    InputMaskModule,
    InputTextModule,
    CheckboxModule,
    ToastModule
  ],
  providers: [MessageService]
})
export class SubscriptionModule { }
