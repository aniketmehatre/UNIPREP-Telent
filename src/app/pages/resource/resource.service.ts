import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "@env/environment";

@Injectable({
  providedIn: 'root'
})
export class ResourceService {

  constructor(private http: HttpClient,) {
  }

  getResources() {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/filterResource", {
        headers: headers,
    });
  }
}
