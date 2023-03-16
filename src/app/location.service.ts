import { ErrorHandler, Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import{LocationData} from './@Models/location.model'
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
    return this.http.get<LocationData>(environment.ApiUrl + "/programlevel", {
      headers: headers,
    });
  }
}
