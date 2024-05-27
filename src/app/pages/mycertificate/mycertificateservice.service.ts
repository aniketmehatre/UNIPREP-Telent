import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MycertificateserviceService {

  constructor(private http: HttpClient) { }
  getUserCompletedCertificate(val: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/getusercompletedcertificates",val, {
        headers: headers,
    });
  }
  getCertificateInOtherCountry(val: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/getothercountrieswithcertificate",val, {
        headers: headers,
    });
  }
}
