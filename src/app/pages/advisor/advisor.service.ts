import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
@Injectable({
  providedIn: 'root'
})
export class AdvisorService {

  constructor(private http: HttpClient) { }


  getAnswer(data: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/advisor", data ,{
      headers: headers,
    });
  }
}
