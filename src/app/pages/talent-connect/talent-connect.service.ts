import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TalentConnectService {
    headers = new HttpHeaders().set("Accept", "application/json");

    constructor(private http: HttpClient) { }

    //Easy-Apply
    getJobListDropdown() {
        return this.http.get<any>(
            environment.ApiUrl + "/easyappydropdownlist",
            { headers: this.headers });
    }

    getJobLocationList() {
        return this.http.get<any>(
            environment.ApiUrl + "/easyappyworklocations",
            { headers: this.headers });
    }

    getJobList(data: any) {
        return this.http.post<any>(
            environment.ApiUrl + "/getuserJobList",
            data,
            { headers: this.headers }
        );
    }

    getJobDetails(id: number) {
        return this.http.post<any>(
            environment.ApiUrl + "/showuserJobs", { id: id },
            { headers: this.headers });
    }

    applyJob(id: number) {
        return this.http.post<any>(
            environment.ApiUrl + "/saveeasyapplyjob", { job_id: id },
            { headers: this.headers });
    }

    getAppliedJobList(data: any) {
        return this.http.post<any>(
            environment.ApiUrl + "/getusertracklist", data,
            { headers: this.headers });
    }

    getJobTrackerDetail(id: number) {
        return this.http.post<any>(
            environment.ApiUrl + "/showuserTrack", { id: id },
            { headers: this.headers });
    }

    //My Profile
    getMyProfileDropDownValues() {
        return this.http.get<any>(
            environment.ApiUrl + "/getyourprofiledropdownvalues",
            { headers: this.headers });
    }

    getMyProfileData() {
        return this.http.get<any>(
            environment.ApiUrl + "/getstudentprofiles",
            { headers: this.headers });
    }

    submitProfile(formData: any): Observable<any> {
        return this.http.post(`${environment.ApiUrl}/createstudentprofile `, formData);
    }

}
