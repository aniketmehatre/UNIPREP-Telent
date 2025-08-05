import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  headers = new HttpHeaders().set("Accept", "application/json");

  constructor(
    private http: HttpClient
  ) { }

  getInterestedMenus() {
    return this.http.post<{data:{id:number,name:string}[]}>(environment.ApiUrl + "/getinterestdropdown", {
      headers: this.headers,
    });
  }
}
