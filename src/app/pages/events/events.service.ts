import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  constructor(private http: HttpClient,) { }
  getupcommingevent(val: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/UpcomingEvent",val, {
        headers: headers,
    });
  }
  postevets(val: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/PastEvent",val, {
        headers: headers,
    });
  }

  registered(data:any):Observable<any>{
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl+'/RegisterEvent',data, {
        headers: headers,
    });
  }
}
