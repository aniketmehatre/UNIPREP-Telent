import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {Observable} from "rxjs/internal/Observable";
import {environment} from "@env/environment";

@Injectable({
  providedIn: 'root'
})
export class SalaryConverterService {

  private jsonUrl = 'uniprep-assets/currency.json';

  constructor(private http: HttpClient) {}


  getTaxData(req: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/getTax", req, {
      headers: headers,
    });
  }


  convertSalaryFrom(from: any): Observable<any> {
   const url = `https://purchasing-power-parity.p.rapidapi.com/price?usd_price=1&country=${from}&method=code`;
    const headers = new HttpHeaders({
      'x-rapidapi-key': '09dff7af89msh193627b79d4f967p12d174jsn905ad1176841',
      'x-rapidapi-host': 'purchasing-power-parity.p.rapidapi.com'
    });

    return this.http.get(url, { headers });
  }
  convertSalaryTo(to: any): Observable<any> {
    const url = `https://purchasing-power-parity.p.rapidapi.com/price?usd_price=1&country=${to}&method=code`;
    const headers = new HttpHeaders({
      'x-rapidapi-key': '09dff7af89msh193627b79d4f967p12d174jsn905ad1176841',
      'x-rapidapi-host': 'purchasing-power-parity.p.rapidapi.com'
    });

    return this.http.get(url, { headers });
  }

  getCountries(): Observable<any[]> {
    return this.http.get<any[]>(this.jsonUrl);
  }
}
