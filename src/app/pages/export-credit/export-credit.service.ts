import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { environment } from "@env/environment";

@Injectable({
  providedIn: 'root'
})
export class ExportCreditService {

  constructor(private http: HttpClient) { }

  getModulesList() {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/BuyCreditModules" ,{
      headers: headers,
    });
  }
}
