import {Billinginfo, OrderHistory, Subscription, SubscriptionPlan} from "../../../@Models/subscription";
import {createReducer, on} from "@ngrx/store";
import {
    doneLoading, loadSubDetailsSuccess,
    loadSubscriptionPlans,
    loadSubscriptionPlansSuccess,
    placeorder,
    placeorderFailure,
    placeorderSuccess
} from "./actions";

export interface SubscriptionState {
    plans: SubscriptionPlan[];
    loading: boolean;
    orderid: string;
    billinginfo:  Billinginfo | null;
    subscription: Subscription | null;
    orderHistory: OrderHistory[];
}
export const initialState: SubscriptionState = {
    plans: [],
    loading: false,
    orderid: '',
    billinginfo: null,
    subscription: null,
    orderHistory: []
}
export const subscriptionReducer = createReducer(
    initialState,
    on(loadSubscriptionPlans, (state) => ({...state, plans: []})),
    on(loadSubscriptionPlansSuccess, (state, payload) => ({...state, plans: payload.subscriptions.subscriptions})),
    on(placeorder, (state) => ({...state, loading: true, orderid: ''})),
    on(placeorderSuccess, (state, payload) => ({...state, orderid: payload.data.orderid})),
    on(placeorderFailure, (state, payload) => ({...state, loading: false, orderid: ''})),
    on(doneLoading, (state, payload) => ({...state, loading: false, orderid: ''})),
    on(loadSubDetailsSuccess, (state, payload) => ({...state, billinginfo: payload.data.billinginfo, subscription: payload.data.subscription, orderHistory: payload.data.orderHistory})),
);