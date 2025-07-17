import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "@env/environment";
import { Store } from "@ngrx/store";
import { SubscriptionState } from "./store/reducer";
import {BehaviorSubject} from "rxjs";
import {
  loadSubscriptionPlans,
  placeorder,
  doneLoading,
  loadSubDetails,
} from "./store/actions";
import {
  selectBillingInfo,
  selectLoading,
  selectOrderHistory,
  selectOrderId,
  selectPlans,
  selectSubscriptionDetail
} from "./store/selectors";
import {
  PlaceOrderResponse,
  SubscriptionSuccess,
  SubscriptionTopup,
} from "../../@Models/subscription";
import { Observable } from "rxjs";
import { PaymentIntent } from "@stripe/stripe-js";
import {StorageService} from "../../services/storage.service";

@Injectable({
  providedIn: "root",
})
export class SubscriptionService {
  constructor(
    private http: HttpClient,
    private store: Store<SubscriptionState>,
    private storage: StorageService
  ) { }

  // getSubscriptionList() {
  //     this.storage.get("loginToken")
  //     const headers = new HttpHeaders()
  //         .set('Accept', "application/json")
  //         .set('Authorization', "Bearer" + " " + this.storage.get("loginToken"));
  //     return this.http.post<any>(environment.ApiUrl + '/getsubscriptions', {}, {'headers': headers});
  //
  // }
 
  usedCoupon = new BehaviorSubject('');
  getQuestionCredit() {
    this.storage.get("loginToken");
    const headers = new HttpHeaders()
      .set("Accept", "application/json")
      .set(
        "Authorization",
        "Bearer" + " " + this.storage.get("loginToken")
      );
    return this.http.post<any>(
      environment.ApiUrl + "/getquestioncredits",
      {},
      { headers: headers }
    );
  }

  // GetOrderId(val: any) {
  //     const headers = new HttpHeaders()
  //         .set('Accept', "application/json")
  //     var bindingdata = {
  //         // userid: val?.userid,
  //         subscription: val.subscriptionid,
  //         amount: val.price
  //     }
  //     return this.http.post<any>(environment.ApiUrl + '/placeorder', bindingdata, {'headers': headers});
  // }

  // PaymentComplete(data: any) {
  //     this.storage.get("loginToken")
  //     const headers = new HttpHeaders()
  //         .set('Accept', "application/json")
  //     var bindingdata = {
  //         orderid: data?.orderid,
  //         paymentid: data.paymentid,
  //     }
  //     return this.http.post<any>(environment.ApiUrl + '/paymentcomplete', bindingdata, {'headers': headers});
  // }

  placeSubscriptionOrder(subscription: any): Observable<any> {
    return this.http.post<any>(
      environment.ApiUrl + "/placeorder",
      subscription
    );
  }

  placeTopupSubscriptionOrder(subscription: any): Observable<any> {
    return this.http.post<any>(
      environment.ApiUrl + "/topupplaceorder",
      subscription
    );
  }

  placeQuestionCreditOrder(subscription: any): Observable<any> {
    return this.http.post<any>(
      environment.ApiUrl + "/qcplaceorder",
      subscription
    );
  }
  loadSubscriptionList() {
    this.store.dispatch(loadSubscriptionPlans());
  }

  getSubscriptionList() {
    return this.store.select(selectPlans);
  }

  placeOrder(subscription: any) {
    this.store.dispatch(placeorder({ subscription }));
  }

  getOrderID() {
    return this.store.select(selectOrderId);
  }

  getLoading() {
    return this.store.select(selectLoading);
  }

  doneLoading() {
    return this.store.dispatch(doneLoading());
  }

  loadSubDetails() {
    return this.store.dispatch(loadSubDetails());
  }

  getBillingInfo() {
    return this.store.select(selectBillingInfo);
  }

  getSubscriptionDetail() {
    return this.store.select(selectSubscriptionDetail);
  }

  getOrderHistory() {
    return this.store.select(selectOrderHistory);
  }

  GetOrderId(val: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    var bindingdata = {
      // userid: val?.userid,
      subscription: val.subscriptionid,
      amount: val.price,
    };
    return this.http.post<any>(
      environment.ApiUrl + "/placeorder",
      bindingdata,
      { headers: headers }
    );
  }

  PaymentComplete(data: any) {
    this.storage.get("loginToken");
    const headers = new HttpHeaders().set("Accept", "application/json");
    var bindingdata = {
      order_id: data?.orderid,
      payment_reference_id: data.paymentid,
    };
    return this.http.post<SubscriptionSuccess>(
      environment.ApiUrl + "/completepayment",
      bindingdata,
      { headers: headers }
    );
  }

  topupPaymentComplete(data: any) {
    this.storage.get("loginToken");
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<SubscriptionSuccess>(
      environment.ApiUrl + "/topupcompletepayment",
      data,
      { headers: headers }
    );
  }

  getSubscriptions(data: any) {
    this.storage.get("loginToken");
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(
      environment.ApiUrl + "/getsubscriptionlist",
      data,
      { headers: headers }
    );
  }


  getSubscriptionDetails(data: any) {
    this.storage.get("loginToken");
    let body = new FormData();
    body.append('country_id', data.country_id);
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(
      environment.ApiUrl + "/GetSubscriptionDetails",
      body,
      { headers: headers }
    );
  }

  getSubscriptionTopups() {
    this.storage.get("loginToken");
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<SubscriptionTopup>(
      environment.ApiUrl + "/gettopuplist",
      {},
      { headers: headers }
    );
  }

  applyCoupon(data: any) {
    this.storage.get("loginToken");
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(
      environment.ApiUrl + "/applycoupondiscount",
      data,
      { headers: headers }
    );
  }

  getSubscriptionHistory() {
    this.storage.get("loginToken");
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<any>(
      environment.ApiUrl + "/getsubscriptionhistory",
      { headers: headers }
    );
  }

  getExistingSubscription() {
    this.storage.get("loginToken");
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<SubscriptionTopup>(
      environment.ApiUrl + "/getexistingsubscription",
      { headers: headers }
    );
  }

  downloadInvoice(data: any) {
    this.storage.get("loginToken");
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(
      environment.ApiUrl + "/downloadinvoiceforstudent",
      data,
      { headers: headers },
    );
  }

  getExtendedToken() {
    const headers = new HttpHeaders().set("Accept", "application/json");
    const data={
      token:''
    };
    return this.http.post<any>(environment.ApiUrl + "/tokenexpireremainingtime",data,{ headers: headers });
  }
  createPaymentIntent(data: any): Observable<PaymentIntent> {
    return this.http.post<PaymentIntent>(
      `${environment.ApiUrl}/placeorderstripe`,
       data 
    );
  }
}
