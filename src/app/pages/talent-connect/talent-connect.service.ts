import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TalentConnectService {
    constructor(private http: HttpClient) { }

    getJobListDropdown() {
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.get<any>(
            environment.ApiUrl + "/easyappydropdownlist",
            { headers: headers });
    }

    getJobLocationList() {
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.get<any>(
            environment.ApiUrl + "/easyappyworklocations",
            { headers: headers });
    }

    getJobList(data: any) {
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.post<any>(
            environment.ApiUrl + "/getuserJobList",
            data,
            { headers: headers }
        );
    }

    getJobDetails(id: number) {
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.post<any>(
            environment.ApiUrl + "/showuserJobs", { id: id },
            { headers: headers });
    }

    applyJob(id: number) {
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.post<any>(
            environment.ApiUrl + "/appliedjobs", { job_id: id },
            { headers: headers });
    }

    getAppliedJobList(data: any) {
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.post<any>(
            environment.ApiUrl + "/getusertracklist", data,
            { headers: headers });
    }

    getJobTrackerDetail(id: number) {
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.post<any>(
            environment.ApiUrl + "/showuserTrack", { apply_id: id },
            { headers: headers });
    }


    // company connect

    getTalentConnectCompanies(formValues: any) {
        const formData = new FormData();
        formData.append("perpage", "100");
        formData.append("page", "1");
        formData.append("companyname", "Test");
        formData.append("industrytype", "2,1");
        formData.append("companysize", "1");
        formData.append("hq", "2");
        formData.append("globalpresence", "1,2,3");
        formData.append("foundedyear", "2002");
        formData.append("companytype", "1");
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.post<any>(
            environment.ApiUrl + "/gettalentconnectcompanies", formData,
            { headers: headers });
    }


    getCompanyDetails(formValues: any) {
        const formData = new FormData();
        formData.append("perpage", "100");
        formData.append("page", "1");
        formData.append("companyname", "Test");
        formData.append("industrytype", "2,1");
        formData.append("companysize", "1");
        formData.append("hq", "2");
        formData.append("globalpresence", "1,2,3");
        formData.append("foundedyear", "2002");
        formData.append("companytype", "1");
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.post<any>(
            environment.ApiUrl + "/getcompaenydetails", formData,
            { headers: headers });
    }

}
