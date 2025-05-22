import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "@env/environment";
import { BehaviorSubject, Observable, of, throwError, timer } from "rxjs";
import { catchError, timeout, tap, map, shareReplay, retryWhen, delay, take, finalize } from "rxjs/operators";
import {StorageService} from "../../storage.service";

@Injectable({
  providedIn: "root",
})
export class DashboardService {
  private selectedCountrySubject = new BehaviorSubject<any>(null);
  selectedCountry$ = this.selectedCountrySubject.asObservable();

  private dashboardCountCache: { [key: string]: any } = {};
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache
  private readonly API_TIMEOUT = 10000; // 10 seconds timeout
  private activeRequest$: Observable<any> | null = null;

  constructor(private http: HttpClient, private storage: StorageService) {
    // Initialize with stored country if available
    const storedCountryId = this.storage.get('selectedCountryId');
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

  isinitialstart = false;

  getDashboardCounts(): Observable<any> {
    const countryId = this.storage.get('countryId') || '0';
    const cacheKey = `dashboard_count_${countryId}`;
    
    // Check cache first
    const cachedData = this.dashboardCountCache[cacheKey];
    if (cachedData && (Date.now() - cachedData.timestamp) < this.CACHE_DURATION) {
      return of(cachedData.data);
    }

    // Return active request if it exists
    if (this.activeRequest$) {
      return this.activeRequest$;
    }

    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Cache-Control', 'no-cache')
      .set('Pragma', 'no-cache');

    const url = `${environment.ApiUrl}/getdashboardcount?country_id=${countryId}`;
    
    this.activeRequest$ = this.http.get(url, { headers }).pipe(
      timeout(this.API_TIMEOUT),
      retryWhen(errors => 
        errors.pipe(
          tap(error => {
            if (error.name === 'TimeoutError') {
              console.warn('Request timed out, retrying...');
            }
          }),
          delay(1000),
          take(3)
        )
      ),
      map(response => {
        if (!response) {
          throw new Error('Empty response received');
        }
        return response;
      }),
      tap(response => {
        // Cache successful responses
        this.dashboardCountCache[cacheKey] = {
          data: response,
          timestamp: Date.now()
        };
      }),
      catchError(error => {
        console.error('Dashboard count API error:', error);
        
        // Return cached data if available
        if (cachedData) {
          console.log('Returning cached data due to error');
          return of(cachedData.data);
        }
        
        if (error.name === 'TimeoutError') {
          return throwError(() => new Error('Request timed out after multiple retries'));
        }
        
        return throwError(() => error);
      }),
      // Share the same response with multiple subscribers
      shareReplay({ bufferSize: 1, refCount: true }),
      finalize(() => {
        this.activeRequest$ = null;
      })
    );

    return this.activeRequest$;
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
getUserTracking(){
  const headers = new HttpHeaders().set("Accept", "application/json");
  return this.http.post<any>(environment.ApiUrl + "/getdashboardmonthlyusage", {
      headers: headers,
  });
}
sentEmailForInviteUniPrep(data:any){
  const headers = new HttpHeaders().set("Accept", "application/json");
  return this.http.post<any>(environment.ApiUrl + "/sendDashboardemail",data, {
      headers: headers,
  });
}
profileCompletion(){
  const headers = new HttpHeaders().set("Accept", "application/json");
  return this.http.get<any>(environment.ApiUrl + "/getpercentagecompletion", {
      headers: headers,
  });
}
RecentJobApplication(){
  const headers = new HttpHeaders().set("Accept", "application/json");
  return this.http.get<any>(environment.ApiUrl + "/getdashboardapplyjob", {
      headers: headers,
  });
}
RecentCompanies(){
  const headers = new HttpHeaders().set("Accept", "application/json");
  return this.http.get<any>(environment.ApiUrl + "/getdashboardcompanieslist", {
      headers: headers,
  });
}
}
