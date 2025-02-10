import {createAction, props} from "@ngrx/store";
import {PlaceOrderResponse, SubscriptionDetailResponse, SubscriptionPlanResponse} from "../../../@Models/subscription";
const key = '[SUBSCRIPTION]';

export const loadSubscriptionPlans = createAction(
    `${key} load subscription plans`
);

export const loadSubscriptionPlansSuccess = createAction(
    `${key} load subscription plans success`,
    props<{subscriptions: SubscriptionPlanResponse}>()
);

export const placeorder = createAction(
    `${key} placeorder`,
    props<{subscription: any}>()
);

export const placeorderSuccess = createAction(
    `${key} placeorder success`,
    props<{data: PlaceOrderResponse}>()
);

export const placeorderFailure = createAction(
    `${key} placeorder failure`
);

export const doneLoading = createAction(
    `${key} done loading`
);

export const loadSubDetails = createAction(
    `${key} loadSubDetails`
);

export const loadSubDetailsSuccess = createAction(
    `${key} loadSubDetails success`,
    props<{data: SubscriptionDetailResponse}>()
);