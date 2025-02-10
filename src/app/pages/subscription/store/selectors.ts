import {createFeatureSelector, createSelector} from "@ngrx/store";
import {SubscriptionState} from "./reducer";

export const subscriptionFeatureKey = 'subscriptionFeatureKey';

export const selectSubscriptionState = createFeatureSelector<SubscriptionState>(
    subscriptionFeatureKey
);

export const selectPlans = createSelector(
    selectSubscriptionState,
    (state: SubscriptionState) => state.plans
);

export const selectLoading = createSelector(
    selectSubscriptionState,
    (state: SubscriptionState) => state.loading
);

export const selectOrderId = createSelector(
    selectSubscriptionState,
    (state: SubscriptionState) => state.orderid
);

export const selectBillingInfo = createSelector(
    selectSubscriptionState,
    (state: SubscriptionState) => state.billinginfo
);

export const selectSubscriptionDetail = createSelector(
    selectSubscriptionState,
    (state: SubscriptionState) => state.subscription
);

export const selectOrderHistory = createSelector(
    selectSubscriptionState,
    (state: SubscriptionState) => state.orderHistory
);