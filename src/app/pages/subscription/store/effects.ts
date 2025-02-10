import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {Store} from "@ngrx/store";
import {SubscriptionState} from "./reducer";
import {SubStoreService} from "./service";
import {of} from "rxjs";
import {catchError, map, switchMap} from "rxjs/operators";
import {
    loadSubDetails, 
    loadSubDetailsSuccess,
    loadSubscriptionPlans,
    loadSubscriptionPlansSuccess,
    placeorder,
    placeorderFailure,
    placeorderSuccess
} from "./actions";

@Injectable()
export class SubscriptionEffects {
    constructor(
        private readonly actions$: Actions,
        private readonly service: SubStoreService,
        private readonly store: Store<SubscriptionState>
    ) {}

    subscriptionList$ = createEffect(() => 
        this.actions$.pipe(
            ofType(loadSubscriptionPlans),
            switchMap(() => 
                this.service.getSubscriptionList().pipe(
                    map(response => loadSubscriptionPlansSuccess({subscriptions: response})),
                    catchError((error) => {
                        console.error('Error loading subscription plans:', error);
                        return of(placeorderFailure());
                    })
                )
            )
        )
    );

    placeOrder$ = createEffect(() => 
        this.actions$.pipe(
            ofType(placeorder),
            switchMap(({subscription}) => 
                this.service.placeOrder(subscription).pipe(
                    map(response => placeorderSuccess({data: response})),
                    catchError((error) => {
                        console.error('Error placing order:', error);
                        return of(placeorderFailure());
                    })
                )
            )
        )
    );

    loadSubDetails$ = createEffect(() => 
        this.actions$.pipe(
            ofType(loadSubDetails),
            switchMap(() => 
                this.service.subDetails().pipe(
                    map(response => loadSubDetailsSuccess({data: response})),
                    catchError((error) => {
                        console.error('Error loading subscription details:', error);
                        return of(placeorderFailure());
                    })
                )
            )
        )
    );
}