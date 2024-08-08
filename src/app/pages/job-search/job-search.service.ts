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


    private apiUrlCore = 'https://api.coresignal.com/v1/job-search';
    private apiKeyCore = 'eyJhbGciOiJFZERTQSIsImtpZCI6Ijk5NWRkYjhlLTQ3NmYtMGI0Yy1hMGNmLTk0MjBlNzNlYTVmMiJ9.eyJhdWQiOiJ1bmlhYnJvYWQuY28uaW4iLCJleHAiOjE3NTQ1MjEzNTQsImlhdCI6MTcyMjk2NDQwMiwiaXNzIjoiaHR0cHM6Ly9vcHMuY29yZXNpZ25hbC5jb206ODMwMC92MS9pZGVudGl0eS9vaWRjIiwibmFtZXNwYWNlIjoicm9vdCIsInByZWZlcnJlZF91c2VybmFtZSI6InVuaWFicm9hZC5jby5pbiIsInN1YiI6ImZhMGM0YzljLWMyMWMtZmZkZi1jMGI5LTQ4YWVkNWFmOWMxNiIsInVzZXJpbmZvIjp7InNjb3BlcyI6ImNkYXBpIn19.c4JsNhAuYmwn_UxiLuLkpZW5_EdLyMMkfqvb3WZsZeYICydRQcOs2awcb6EZrGrEcmZJtT1MEWNAPIduO3__DA';

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

    // core signal
    searchJobsCoreSignal(query: string, location?: string, page: number = 1, limit: number = 10): Observable<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKeyCore}`
        });

        const body = {
            query: query,
            filters: {
                // Add your filters here
            }
        };

        return this.http.post<any>(this.apiUrlCore, body, { headers });
    }
}
