import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "@env/environment";
import {Observable} from "rxjs";
import {PlaceOrderResponse, SubscriptionDetailResponse} from "../../../@Models/subscription";


@Injectable({providedIn: 'root'})
export class SubStoreService {
    constructor(private http: HttpClient) { }
    // getSubscriptionList(){
    //     return this.http.get<any>(environment.ApiUrl+'/getsubscriptions');
    // }
    placeOrder(subscription: any): Observable<any>{
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.post<any>(environment.ApiUrl+'/placeorder', {subscription},{
            headers: headers,
        });
    }
    getSubscriptionList(): Observable<any>{
        return this.http.post<any>(environment.ApiUrl+'/getsubscriptions', {});
    }
    completePayment(orderid: string, paymentid: string){
        return this.http.post<any>(environment.ApiUrl+'/completepayment', {orderid, paymentid});
    }
    subDetails() {
        return this.http.get<SubscriptionDetailResponse>(environment.ApiUrl+'/subdetails');
    }
}