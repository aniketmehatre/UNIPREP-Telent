import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SubscriptionComponent} from "./subscription.component";
import {BuyCreditsComponent} from "./buy-credits/buy-credits.component";

const routes: Routes = [
    {path: '', component: SubscriptionComponent},
    {path: 'buy-credit', component: BuyCreditsComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SubscriptionRoutingModule {
}
