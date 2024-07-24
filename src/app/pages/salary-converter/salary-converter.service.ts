import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/internal/Observable";

@Injectable({
  providedIn: 'root'
})
export class SalaryConverterService {

  private jsonUrl = 'uniprep-assets/currency.json';

  constructor(private http: HttpClient) {}

  // getPppRates(): Observable<any> {
  //   let from = "GBP",
  //       to = "EUR",
  //       value = "19999.95";
  //   const url = `https://openexchangerates.org/api/convert/${value}/${from}/${to}`;
  //   return this.http.get(url, { params: { app_id: '13097e8f1872443291186625c6cf4e73' } });
  // }

  convertSalary(from: any, to: any): Observable<any> {
    // const url = `https://openexchangerates.org/api/convert/${salary}/${fromPpp}/${toPpp}`;
    const api_key = 'cur_live_Y4B6OPBtmcaBdrXiCwbXAHrv6JIpvDq2MGrAZvWn'
    const url =
        `https://api.currencyapi.com/v3/latest?apikey=${api_key}&currencies=${to}&base_currency=${from}`;
    return this.http.get(url);
    // return (salary / fromPpp) * toPpp;
  }

  getCountries(): Observable<any[]> {
    return this.http.get<any[]>(this.jsonUrl);
  }
}
