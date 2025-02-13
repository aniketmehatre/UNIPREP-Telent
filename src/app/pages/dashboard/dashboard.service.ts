import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "@env/environment";
import { BehaviorSubject, Observable, of, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class DashboardService {
  private selectedCountrySubject = new BehaviorSubject<any>(null);
  selectedCountry$ = this.selectedCountrySubject.asObservable();

  constructor(private http: HttpClient) {
    // Initialize with stored country if available
    const storedCountryId = localStorage.getItem('selectedCountryId');
    if (storedCountryId) {
      this.getCountries().subscribe(countries => {
        const country = countries.find((c: any) => c.id.toString() === storedCountryId);
        if (country) {
          this.selectedCountrySubject.next(country);
        }
      });
    }
  }

  updateSelectedCountry(country: any) {
    this.selectedCountrySubject.next(country);
  }

  isinitialstart=false;
  getDashboardCounts() {
    const countryId = localStorage.getItem('countryId') || '0';
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const url = `${environment.ApiUrl}/getdashboardcount?country_id=${countryId}`;
    
    return this.http.get(url, { headers }).pipe(
        catchError(error => {
            console.error('Dashboard count API error:', error);
            if (error.status === 404) {
                return of({ status: 404, message: 'Resource not found' });
            }
            return throwError(() => error);
        })
    );
  }

  getReadProgression(val: any): Observable<any> {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(
      environment.ApiUrl + "/getreadprogression",
      val,
      { headers: headers }
    );
  }

  getQuizProgression(val: any): Observable<any> {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(
      environment.ApiUrl + "/getquizprogression",
      val,
      { headers: headers }
    );
  }

  getCountries() {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<any>(environment.ApiUrl + "/country", {
      headers: headers,
    });
  }

  searchKeyword(val: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/searchkeyword", val, {
      headers: headers,
    });
  }

  getModuleReadProgression(val: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(
      environment.ApiUrl + "/getmodulereadprogression",
      val,
      { headers: headers }
    );
  }

  // getModuleQuizProgression(val: any) {
  //   const headers = new HttpHeaders().set("Accept", "application/json");
  //   return this.http.post<any>(
  //     environment.ApiUrl + "/getmodulequizprogression",
  //     val,
  //     { headers: headers }
  //   );
  // }

  countryList() {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get(environment.ApiUrl + "/country", { headers: headers });
  }

  getTrustedPartners() {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post(
      environment.ApiUrl + "/GetTrusterPatners",
      {},
      { headers: headers }
    );
  }

  getUserSubscribtionCount() {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(
      environment.ApiUrl + "/gettimeleft",
      {},
      { headers: headers }
    );
  }

  getContineTrial(data: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(
      environment.ApiUrl + "/freetrailcontinue",
      data,
      {
        headers: headers,
      }
    );
  }

  public data$ = new BehaviorSubject<any>(null);
  timerData$ = this.data$.asObservable();

  updatedata(data: any) {
    this.data$.next(data);
  }
  checkModuleQuizCompletion(data: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/checkmodulequizcompletion", data, {
        headers: headers,
    });
}
checkModuleQuizProgressbar(data: any) {
  const headers = new HttpHeaders().set("Accept", "application/json");
  return this.http.post<any>(environment.ApiUrl + "/getquizcompletion", data, {
      headers: headers,
  });
}
}
