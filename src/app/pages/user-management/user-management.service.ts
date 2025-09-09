import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "@env/environment";

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {

  constructor(private httpClient: HttpClient) { }


  updateUserDetails(data: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.httpClient.post<any>(environment.ApiUrl + "/updateuserdetails", data, {
      headers: headers,
    });
  }

  CompareUserPassword(data: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.httpClient.post<any>(environment.ApiUrl + "/CompareUserPassword", data, {
      headers: headers,
    });
  }

  UpdateNewsLetter(data: number) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.httpClient.post<any>(environment.ApiUrl + "/UpdateNewsLetterNotification", data, {
      headers: headers,
    });
  }

  GetPaidSubscriptionDetails() {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.httpClient.post<any>(environment.ApiUrl + "/SubscriptionValidity", {
      headers: headers,
    });
  }

  GetUserPersonalInfo() {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.httpClient.post<any>(environment.ApiUrl + "/GetUserPersonalDetails", {
      headers: headers,
    });
  }

  updateUserData(data: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.httpClient.post<any>(environment.ApiUrl + "/profileedit", data, {
      headers: headers,
    });
  }
  newsLetterConsent(data: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.httpClient.post<any>(environment.ApiUrl + "/UpdateNewsLetterNotification", data, {
      headers: headers,
    });
  }
  promotionalEmailConsent(data: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.httpClient.post<any>(environment.ApiUrl + "/UpdatePromotionalEmailNotification", data, {
      headers: headers,
    });
  }
  productUpdateEmailConsent(data: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.httpClient.post<any>(environment.ApiUrl + "/UpdateProductUpdateNotification", data, {
      headers: headers,
    });
  }
  integrationPartActiveOrInactive() {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.httpClient.post<any>(environment.ApiUrl + "/getIntegratedEmail", {
      headers: headers,
    });
  }
  deactivateAccount() {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.httpClient.get<any>(environment.ApiUrl + "/deactivateAccount", {
      headers: headers,
    });
  }
}
