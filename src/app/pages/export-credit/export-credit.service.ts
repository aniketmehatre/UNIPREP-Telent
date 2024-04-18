import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { environment } from "@env/environment";

@Injectable({
  providedIn: 'root'
})
export class ExportCreditService {

  constructor(private http: HttpClient) { }

  getModulesList(data: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/BuyCreditModules" ,{ data },{
      headers: headers,
    });
  }

  placeOrder(data:any){
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/BuyCreditPlaceOrder" , {data : data} ,{
      headers: headers,
    });
  }

  completePayment(data: any){
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/BuyCreditCompleteOrder" ,data,{
      headers: headers,
    });
  }

}
