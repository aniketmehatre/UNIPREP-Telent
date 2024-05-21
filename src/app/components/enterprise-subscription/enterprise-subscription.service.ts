import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EnterpriseSubscriptionService {

  constructor(private http:HttpClient) { }
  
  
  getCollege(val: any):Observable<any> {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/getcollegenameusingorder", val, {
        headers: headers,
    });
}
placeOrder(val: any):Observable<any> {
  const headers = new HttpHeaders().set("Accept", "application/json");
  return this.http.post<any>(environment.ApiUrl + "/placeorderbyparnter", val, {
      headers: headers,
  });
}
paymentComplete(val: any):Observable<any> {
  const headers = new HttpHeaders().set("Accept", "application/json");
  return this.http.post<any>(environment.ApiUrl + "/completepaymentbypartner", val, {
      headers: headers,
  });
}


}
