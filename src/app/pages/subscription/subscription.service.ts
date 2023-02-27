import { HttpClient, HttpHeaders,HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  constructor(private http: HttpClient) { }

  getSubscriptionList(){
    localStorage.getItem("loginToken")
    const headers= new HttpHeaders()
    .set('Accept', "application/json")
    .set('Authorization', "Bearer"+" "+localStorage.getItem("loginToken"));
    return this.http.get<any>(environment.ApiUrl+'/subscription',{'headers': headers});

  }
  GetOrderId(val:any){
    const headers= new HttpHeaders()
    .set('Accept', "application/json")
    var bindingdata={
        // userid: val?.userid,
        subscription:val.subscriptionid,
        amount:val.price
    }
    return this.http.post<any>(environment.ApiUrl+'/placeorder',bindingdata,{'headers': headers});
  }
  PaymentComplete(data:any){
    localStorage.getItem("loginToken")
    const headers= new HttpHeaders()
    .set('Accept', "application/json")
    var bindingdata={
      orderid: data?.orderid,
      paymentid:data.paymentid,
    }
    return this.http.post<any>(environment.ApiUrl+'/paymentcomplete',bindingdata,{'headers': headers});
  }
}