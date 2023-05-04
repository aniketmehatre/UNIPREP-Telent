import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SubscriptionComponent} from "./subscription.component";
import {SubscribtionbillingComponent} from '../subscribtionbilling/subscribtionbilling.component';

const routes: Routes = [
    {path: '', component: SubscriptionComponent},
    {path: 'billing', component: SubscribtionbillingComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SubscriptionRoutingModule {
}
