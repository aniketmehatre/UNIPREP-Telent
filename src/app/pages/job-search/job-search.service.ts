import {Injectable} from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import {Observable} from "rxjs/internal/Observable";
import {environment} from "@env/environment";
import {City} from "../../@Models/cost-of-living";
import { map } from 'rxjs';
import { removeExtraResponse } from '../../@Supports/prompt';
@Injectable({
    providedIn: 'root'
})
export class JobSearchService {
    private apiUrl = 'https://api.adzuna.com/v1/api/jobs';
    // private appId = '5be5ff77'; // Replace with your App ID
    private appId = '53dd2d27'; // Replace with your App ID
    // private appKey = '8c20f3e26f4df3630e037182b7b31f42'; // Replace with your App Key
    private appKey = 'e27fbcbe3d392dd2f84896a0dde45680'; // Replace with your App Key

    constructor(private http: HttpClient) {
    }

    searchJobs(query: any): Observable<any> {
        let params = new HttpParams()
            .set('app_id', this.appId)
            .set('app_key', this.appKey)
            .set('what_phrase', query.what_and)
            .set('where', query.where)
            .set('results_per_page', query.result_per_page)
        return this.http.get(`${this.apiUrl}/${query.location}/search/${query.page}`, {params});
    }

    filter(query: any): Observable<any> {
        let params = new HttpParams()
            .set('app_id', this.appId)
            .set('app_key', this.appKey);

        if (query.what_and) {
            params = params.set('what_phrase', query.what_and);
        }
        if (query.result_per_page) {
            params = params.set('results_per_page', query.result_per_page);
        }
        if (query.where) {
            params = params.set('where', query.where);
        }
        if (query.category) {
            params = params.set('category', '');
        }
        if (query.full_time) {
            params = params.set('full_time', query.full_time);
        }
        if (query.part_time) {
            params = params.set('part_time', query.part_time);
        }
        if (query.contract) {
            params = params.set('contract', query.contract);
        }
        if (query.permanent) {
            params = params.set('permanent', query.permanent);
        }

        return this.http.get(`${this.apiUrl}/${query.location}/search/${query.page}`, {params});
    }

    fetchCategory(query: any): Observable<any> {
        let params = new HttpParams()
            .set('app_id', this.appId)
            .set('app_key', this.appKey)
        return this.http.get(`${this.apiUrl}/${query.location}/categories`, {params});
    }

    addJobStatusList(values: any) {
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.post<any>(environment.ApiUrl + "/addjobtracker", values, {
            headers: headers,
        });
    }

    getJobTracker() {
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.post<any>(environment.ApiUrl + "/getjobtracker", {}, {
            headers: headers,
        });
    }

    updateJobStatusList(values: any) {
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.post<any>(environment.ApiUrl + "/updatejobtracker", values, {
            headers: headers,
        });
    }

    deletejobtracker(values: any) {
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.post<any>(environment.ApiUrl + "/deletejobtracker", values, {
            headers: headers,
        });
    }

    getCities() {
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.post<City[]>(environment.ApiUrl + "/getcitywithflag", {module: "job_portal"} ,{headers: headers});
    }

    getJobRoles() {
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.get<any>(environment.ApiUrl + "/getJobRolesList",{
        headers: headers,
        });
    }
    getCountryCurrency() {
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.post<any>(environment.ApiUrl + "/getcountryandcurrency",{
        headers: headers,
        });
    }
    getCountryCurrencyChatGptOutput(data:any) {
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.post<any>(environment.ApiUrl + "/getIntegratedRecom",data,{
            headers: headers,
        }).pipe(
            map(res => ({ response: removeExtraResponse(res.response) })) // Process response before returning
        );
    }

    getTripList(type:string) {
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.get<any>(environment.ApiUrl + `/userSavedResponse?mode=${type}`, {
          headers: headers,
        });
      }
      downloadRecommendation(data: any) {
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.post<{ url: string }>(environment.ApiUrl + "/downloadIntegratedRecom", data, {
          headers: headers,
        });
      }
}
