import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {Store} from "@ngrx/store";
import {SubscriptionState} from "./reducer";
import {SubStoreService} from "./service";
import {of, switchMap} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {
    loadSubDetails, loadSubDetailsSuccess,
    loadSubscriptionPlans,
    loadSubscriptionPlansSuccess,
    placeorder,
    placeorderFailure,
    placeorderSuccess
} from "./actions";


@Injectable()
export class SubscriptionEffects {
    constructor(
        private actions$: Actions,
        private service: SubStoreService,
        private store: Store<SubscriptionState>
    ) {}
    subscriptionList$ = createEffect(() => this.actions$.pipe(
        ofType(loadSubscriptionPlans),
        switchMap((payload) => this.service.getSubscriptionList().pipe(
            map(response => loadSubscriptionPlansSuccess({subscriptions: response}))
        ))
    ));
    placeOrder$ = createEffect(() => this.actions$.pipe(
        ofType(placeorder),
        switchMap((payload) => this.service.placeOrder(payload.subscription.subscriptions).pipe(
            map(response => placeorderSuccess({data: response})),
            catchError(() => of(placeorderFailure()))
        ))
    ));
    loadSubDetails$ = createEffect(() => this.actions$.pipe(
        ofType(loadSubDetails),
        switchMap(() => this.service.subDetails().pipe(
            map(response => loadSubDetailsSuccess({data: response})),
        ))
    ));
}