import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { environment } from "@env/environment";

@Injectable({
  providedIn: 'root'
})
export class PitchDeskService {

  constructor(private http: HttpClient) { }

  getPitchDeskData(){
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/PitchDeckList", {
      headers: headers,
    });
  }

  getSelectBoxValues(){
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<any>(environment.ApiUrl + "/PitchdeckSelectbox", {
      headers: headers,
    });
  }
}
