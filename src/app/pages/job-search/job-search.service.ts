import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs/internal/Observable";
import {environment} from "@env/environment";

@Injectable({
    providedIn: 'root'
})
export class JobSearchService {
    private apiUrl = 'https://api.adzuna.com/v1/api/jobs';
    private appId = '5be5ff77'; // Replace with your App ID
    private appKey = '8c20f3e26f4df3630e037182b7b31f42'; // Replace with your App Key

    constructor(private http: HttpClient) {
    }

    searchJobs(query: any): Observable<any> {
        let params: any
        if(query.company){
            params = new HttpParams()
                .set('app_id', this.appId)
                .set('app_key', this.appKey)
                .set('what', query.what)
                .set('where', query.where)
                .set('results_per_page', query.result_per_page)
        }else{
            params = new HttpParams()
                .set('app_id', this.appId)
                .set('app_key', this.appKey)
                .set('what', query.what)
                .set('where', query.where)
                .set('results_per_page', query.result_per_page)
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
}
