import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SubscriptionComponent} from "./subscription.component";
import {BuyCreditsComponent} from "./buy-credits/buy-credits.component";
import { SubscriptionHistoryComponent } from './subscription-history/subscription-history.component';
import { UpgradeSubscriptionComponent } from './upgrade-subscription/upgrade-subscription.component';

const routes: Routes = [
    {path: '', component: SubscriptionComponent},
    {path: 'subscription-history', component: SubscriptionHistoryComponent},
    {path: 'upgrade-subscription', component: UpgradeSubscriptionComponent},
    // {path: 'buy-credit', component: BuyCreditsComponent},
    {path: '', redirectTo: '', pathMatch: 'full'}

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SubscriptionRoutingModule {
}
