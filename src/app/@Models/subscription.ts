export interface SubscriptionPlan {
    id: number;
    subscription: string;
    price: string;
    discount_type: string;
    discount: string;
    validity: string;
    addln_country_discount: string;
    status: string;
    created_at: string;
    updated_at: string;

    // checks: number;
    // price: string;
    // duration: string;
    // mprice: string;
    // discount: string;
    // description: string;
    // url: string;
    // status: number;
    // created_at: null;
    // updated_at: Date | null;
    // deleted_at: null;
}

export interface SubscriptionPlanResponse {
    success: boolean;
    subscriptions: SubscriptionPlan[];
}

export interface PlaceOrderResponse {
    orderid: string;
}
export interface PlaceCustomOrderResponse {
    orderid: string;
}

export interface SubscriptionDetailResponse {
    billinginfo: Billinginfo;
    subscription: Subscription;
    orderHistory: OrderHistory[];
}

export interface Billinginfo {
    name: string;
    mobile: string;
    email: string;
    country: string;
    location: string;
}
export interface customsopSubscriptionplans {

    id: number;
    subscription: string;
    price: any;
    discount_type: string;
    discount: any;
    validity: string;
    addln_country_discount: string;
    status: string;
    created_at: string;
    updated_at: string;
    // "id": number,
    // "name": string,
    // "checks": number,
    // "price": string,
    // "duration": string,
    // "mprice": string,
    // "discount": string,
    // "description": string,
    // "url": string,
    // "status": number,
    // "created_at": null,
    // "updated_at": null,
    // "deleted_at": null,
    // "type":string
}
export interface OrderHistory {
    subscriptionName: string;
    refrence: string;
    created_at: Date;
    amount: string;
    payment: number;
    id: number;
    date: string;
    orderId: number;
}

export interface Subscription {
    name: string;
    checks: number;
    price: string;
    desc: string[];
    checksLeft: number;
}


export interface SubscriptionSuccess {
    refrenceid: string;
    orderid: string;
    orderdate: string;
    subtotal: string;
    total: string;
    subscriptionname: string;
    subscriptionamount: string;
}

export interface SubscriptionTopup {
    success: boolean;
    topups: Topup[];
}

export interface Topup {
    id: number;
    name: string;
    validity: number;
    price: string;
    discount: string;
    discountPercentage: number;
    countries: string;
    topuptype: number;
    status: number;
    created_at: any;
    updated_at: any;
    countryNames: string;
}


export interface SubscriptionResponse {
    enterprise_subscription_plan: string
    enterprise_subscription_link: string
    success: boolean
    subscription_details: SubscriptionDetails
    time_left: TimeLeft
}

export interface SubscriptionDetails {
    subscription_id: number
    subscription_plan: string
}

export interface TimeLeft {
    years: number
    months: number
    days: number
    hours: number
    minutes: number
    seconds: number
    plan: string
}