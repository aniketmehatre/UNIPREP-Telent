import {Injectable} from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {environment} from "@env/environment";
import {Observable, throwError} from "rxjs";
import {PlaceOrderResponse, SubscriptionDetailResponse} from "../../../@Models/subscription";
import { tap, catchError } from 'rxjs/operators';
import { NGX_LOCAL_STORAGE_CONFIG } from "ngx-localstorage";
import {StorageService} from "../../../services/storage.service";

const ngxLocalstorageConfiguration = NGX_LOCAL_STORAGE_CONFIG as unknown as { prefix: string, delimiter: string };

@Injectable({providedIn: 'root'})
export class SubStoreService {
    constructor(private http: HttpClient, private storage: StorageService) { }
    // getSubscriptionList(){
    //     return this.http.get<any>(environment.ApiUrl+'/getsubscriptions');
    // }
    placeOrder(subscription: any): Observable<any>{
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.post<any>(environment.ApiUrl+'/placeorder', {subscription},{
            headers: headers,
        });
    }
    getSubscriptionList(): Observable<any> {
        console.log('SubStoreService: Making API call to get subscription list');
        const tokenKey = `${ngxLocalstorageConfiguration.prefix}${ngxLocalstorageConfiguration.delimiter}${environment.tokenKey}`;
        const token = this.storage.get(tokenKey);
        console.log('SubStoreService: Token exists:', !!token);
        
        if (!token) {
            console.error('SubStoreService: No token found');
            return throwError(() => new Error('No authentication token available'));
        }
        
        const headers = new HttpHeaders()
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token);
            
        return this.http.post<any>(
            environment.ApiUrl + '/getsubscriptions', 
            {}, 
            { headers: headers }
        ).pipe(
            tap(response => console.log('SubStoreService: Received response:', response)),
            catchError(error => {
                console.error('SubStoreService: Error fetching subscriptions:', error);
                throw error;
            })
        );
    }
    completePayment(orderid: string, paymentid: string){
        return this.http.post<any>(environment.ApiUrl+'/completepayment', {orderid, paymentid});
    }
    subDetails() {
        return this.http.get<SubscriptionDetailResponse>(environment.ApiUrl+'/subdetails');
    }

    getRecommedationList() {
        //return this.http.get(environment.ApiUrl + '/getrecommendplans');
        return this.http.get<any>(environment.ApiUrl+'/getrecommendplans');
    }
    
    storeUserRecommends(userRecommendations:any){
        return this.http.post<any>(environment.ApiUrl+'/storeuserrecommends', {user_recommend : userRecommendations});
    }

    checkRecommendationExist(){
        return this.http.get<any>(environment.ApiUrl+'/CheckExistRecommendation');
    }

    recommendationReset(){
        return this.http.get<any>(environment.ApiUrl+'/ResetRecommendation');
    }
}