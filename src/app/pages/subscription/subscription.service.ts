import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "@env/environment";
import { Store } from "@ngrx/store";
import { SubscriptionState } from "./store/reducer";
import {
  loadSubscriptionPlans,
  placeorder,
  doneLoading,
  loadSubDetails,
} from "./store/actions";
import {
  selectBillingInfo$,
  selectLoading$,
  selectOrderHistory$,
  selectOrderId$,
  selectPlans$,
  selectSubscriptionDetail$,
} from "./store/selectors";
import {
  PlaceOrderResponse,
  SubscriptionSuccess,
} from "../../@Models/subscription";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class SubscriptionService {
  constructor(
    private http: HttpClient,
    private store: Store<SubscriptionState>
  ) {}

  // getSubscriptionList() {
  //     localStorage.getItem("loginToken")
  //     const headers = new HttpHeaders()
  //         .set('Accept', "application/json")
  //         .set('Authorization', "Bearer" + " " + localStorage.getItem("loginToken"));
  //     return this.http.post<any>(environment.ApiUrl + '/getsubscriptions', {}, {'headers': headers});
  //
  // }

  getQuestionCredit() {
    localStorage.getItem("loginToken");
    const headers = new HttpHeaders()
      .set("Accept", "application/json")
      .set(
        "Authorization",
        "Bearer" + " " + localStorage.getItem("loginToken")
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
  //     localStorage.getItem("loginToken")
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
    return this.store.select(selectPlans$);
  }

  placeOrder(subscription: any) {
    this.store.dispatch(placeorder({ subscription }));
  }

  getOrderID() {
    return this.store.select(selectOrderId$);
  }

  getLoading() {
    return this.store.select(selectLoading$);
  }

  doneLoading() {
    return this.store.dispatch(doneLoading());
  }

  loadSubDetails() {
    return this.store.dispatch(loadSubDetails());
  }

  getBillingInfo() {
    return this.store.select(selectBillingInfo$);
  }

  getSubscriptionDetail() {
    return this.store.select(selectSubscriptionDetail$);
  }

  getOrderHistory() {
    return this.store.select(selectOrderHistory$);
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
    localStorage.getItem("loginToken");
    const headers = new HttpHeaders().set("Accept", "application/json");
    var bindingdata = {
      orderid: data?.orderid,
      paymentid: data.paymentid,
    };
    return this.http.post<SubscriptionSuccess>(
      environment.ApiUrl + "/paymentcomplete",
      bindingdata,
      { headers: headers }
    );
  }

  getSubscriptions(data: any) {
    localStorage.getItem("loginToken");
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(
      environment.ApiUrl + "/getsubscriptionlist",
      data,
      { headers: headers }
    );
  }


  getSubscriptionDetails(data: any) {
    localStorage.getItem("loginToken");
    let body = new FormData();
    body.append('country_id', data.country_id);
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(
        environment.ApiUrl + "/GetSubscriptionDetails",
        body,
        { headers: headers }
    );
  }

}
