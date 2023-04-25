import { ErrorHandler, Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import{LocationData} from './@Models/location.model'
import {UniPrepModuleModel} from "./@Models/UniPrepModule.model";
@Injectable({
  providedIn: "root",
})
export class LocationService {
  constructor(private http: HttpClient) {}
 
  getLocation(){
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<LocationData>(environment.ApiUrl + "/location", {
      headers: headers,
    });
  }
  getProgramLevel(){
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<any>(environment.ApiUrl + "/programlevel", {
      headers: headers,
    });
  }
  getUniPerpModuleList(){
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/modulecountry", {countryId:2},{
      headers: headers,
    });
  }
  getReportOptionList(){
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<any>(environment.ApiUrl + "/reportoption",{
      headers: headers,
    });
  }

  getCountry(){
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<any>(environment.ApiUrl + "/country",{
      headers: headers,
    });
  }
}
