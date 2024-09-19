import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class FounderstoolService {

  constructor(private http: HttpClient) { }
  getAcademy(val:any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/founderslist",val, {
        headers: headers,
    });
  }
  getFounderCategory() {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/getfoundercategory", {
        headers: headers,
    });
  }
  // investor training
  getAInvestorTraining() {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/listinvestorpitch", {
        headers: headers,
    });
  }
}
