import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class FaqService {

  constructor(private http: HttpClient) { }

  // Getfaqlistwithcate(val:any): Observable<any> {
  //   const headers= new HttpHeaders()
  //   .set('Accept', "application/json")
  //   return this.http.post(environment.ApiUrl + "/faqbycategory",val, {
  //     headers: headers,
  // });
  // }
  Getfaqlist(): Observable<any> {
    const headers= new HttpHeaders()
    .set('Accept', "application/json")
    return this.http.get(environment.ApiUrl + "/faqcategories", {
      headers: headers,
  });
  }
  Getfaqlistwithcate(val: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/faqbycategory",val, {
        headers: headers,
    });
  }
}
