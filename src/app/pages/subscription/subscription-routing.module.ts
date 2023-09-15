import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SubscriptionComponent} from "./subscription.component";
import {BuyCreditsComponent} from "./buy-credits/buy-credits.component";
import { SubscriptionedDataComponent } from './subscriptioned-data/subscriptioned-data.component';
import { SubscriptionHistoryComponent } from './subscription-history/subscription-history.component';

const routes: Routes = [
    {path: '', component: SubscriptionComponent},
    {path: 'subscriptioned-data', component: SubscriptionedDataComponent},
    {path: 'buy-credit', component: BuyCreditsComponent},
    {path: 'subscription-history', component: SubscriptionHistoryComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SubscriptionRoutingModule {
}
