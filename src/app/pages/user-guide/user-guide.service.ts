import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class UserGuideService {

  constructor(
    private http:HttpClient
  ) { }

  getUserGuide(){
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<any>(environment.ApiUrl + "/getuserguidelinks", {
        headers: headers,
    });
  }
}
