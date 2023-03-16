import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "@env/environment";

@Injectable({
  providedIn: 'root'
})
export class HelpServiceService {

  constructor(private http: HttpClient,) { }


  getHelpSupportCategoryList() {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<any>(environment.ApiUrl + "/helpsupportcategory", {
      headers: headers,
    });
  }
}
