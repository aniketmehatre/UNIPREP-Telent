import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from '@env/environment';
import {Observable} from 'rxjs';

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

    updateProfile(formData: any): Observable<any> {
        return this.http.post(`${environment.ApiUrl}/updatestudentprofile `, formData);
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


    getCompanyDetails(id: any) {
        const formData = new FormData();
        formData.append("id", id);
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.post<any>(
            environment.ApiUrl + "/getcompanydetails", formData,
            { headers: headers });
    }

    // getcompanytypes
    getCompanyTypes() {
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.get<any>(environment.ApiUrlEmployer + "/getcompanytypes", {headers: headers});
    }

    // getindustrytypes
    getIndustryTypes() {
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.get<any>(environment.ApiUrlEmployer + "/getindustrytypes", {headers: headers});
    }

    // getcompanysize
    getCompanySizes() {
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.get<any>(environment.ApiUrlEmployer + "/getcompanysize", {headers: headers});
    }

    // globalPresence
    globalPresence() {
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.post<any>(environment.ApiUrlEmployer + "/globalPresence", {},  {headers: headers});
    }

    // getcitywithflag
    getCityWithFlag() {
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.post<any>(environment.ApiUrlEmployer + "/getcitywithflag", {},  {headers: headers});
    }

    // follow company
    followCompany(companyId: any) {
        const formData = new FormData();
        formData.append("companyId", companyId);
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.post<any>(environment.ApiUrl + "/followcompany", formData,  {headers: headers});
    }

}
