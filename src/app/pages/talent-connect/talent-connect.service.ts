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
            environment.ApiUrl + "/showuserTrack", { id: id },
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

    sendMessage(data: { job_id: number, chat: string }) {
        return this.http.post<any>(
            environment.ApiUrl + "/sendMessage", data,
            { headers: this.headers });
    }

    getMessage(data: { job_id: number }) {
        return this.http.post<any>(
            environment.ApiUrl + "/getMessage", data,
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



    // short list company
    shortListCompany(companyId: any): Observable<any> {
        const formData = new FormData();
        formData.append("companyId", companyId);
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.post<any>(environment.ApiUrl + "/shortlistcompany", formData,  {headers: headers});
    }

    // company connect
    getTalentConnectCompanies(formValues: any) {
        const formData = new FormData();
        formData.append("perpage", formValues.perpage);
        formData.append("page", formValues.page);
        // formData.append("companyname", formValues.companyname);
        // formData.append("industrytype", formValues.industrytype);
        // formData.append("companysize", formValues.companysize);
        // formData.append("hq", formValues.hq);
        // formData.append("globalpresence", formValues.globalpresence);
        // formData.append("foundedyear", formValues.foundedyear);
        // formData.append("companytype", formValues.companytype);
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

    getCurrencies() {
        return this.http.get<any>(environment.ApiUrl + "/currenciesList", {
            headers: this.headers
        });
    }

    // get chat message
    getChatMessageForCompanyConnect(companyId: any) {
        const formData = new FormData();
        formData.append("companyid", companyId);
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.post<any>(environment.ApiUrl + "/getchatmessages", formData,  {headers: headers});
    }

    // sendcompanyconnectusermessage
    sendCompanyConnectUserMessage(formDataValue: any) {
        const formData = new FormData();
        formData.append("company_id", formDataValue.company_id);
        formData.append("chat", formDataValue.chat);
        formData.append("attachment", formDataValue.attachment);
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.post<any>(environment.ApiUrl + "/sendcompanyconnectusermessage", formData,  {headers: headers});
    }


    //getcompanytracker
    getCompanyTracker(formValues: any) {
        const formData = new FormData();
        formData.append("perpage", formValues.perpage);
        formData.append("page", formValues.page);
        // formData.append("companyname", formValues.companyname);
        // formData.append("industrytype", formValues.industrytype);
        // formData.append("companysize", formValues.companysize);
        // formData.append("hq", formValues.hq);
        // formData.append("globalpresence", formValues.globalpresence);
        // formData.append("foundedyear", formValues.foundedyear);
        // formData.append("companytype", formValues.companytype);
        // formData.append("status", "1");
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.post<any>(environment.ApiUrl + "/getcompanytracker", formData,  {headers: headers});
    }

    getShortListedCompanyList(formValues: any) {
        const formData = new FormData();
        formData.append("perpage", formValues.perpage);
        formData.append("page", formValues.page);
        // formData.append("companyname", formValues.companyname);
        // formData.append("industrytype", formValues.industrytype);
        // formData.append("companysize", formValues.companysize);
        // formData.append("hq", formValues.hq);
        // formData.append("globalpresence", formValues.globalpresence);
        // formData.append("foundedyear", formValues.foundedyear);
        // formData.append("companytype", formValues.companytype);
        // formData.append("status", "1");
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.post<any>(environment.ApiUrl + "/getshortlistedcompanytracker", formData,  {headers: headers});
    }

    getReceivedMessageCompanyTracker(formValues: any) {
        const formData = new FormData();
        formData.append("perpage", formValues.perpage);
        formData.append("page", formValues.page);
        // formData.append("companyname", formValues.companyname);
        // formData.append("industrytype", formValues.industrytype);
        // formData.append("companysize", formValues.companysize);
        // formData.append("hq", formValues.hq);
        // formData.append("globalpresence", formValues.globalpresence);
        // formData.append("foundedyear", formValues.foundedyear);
        // formData.append("companytype", formValues.companytype);
        // formData.append("status", "1");
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.post<any>(environment.ApiUrl + "/getreceievedmessagecompanytracker", formData,  {headers: headers});
    }


    getSendMessageCompanyTracker(formValues: any) {
        const formData = new FormData();
        formData.append("perpage", formValues.perpage);
        formData.append("page", formValues.page);
        // formData.append("companyname", formValues.companyname);
        // formData.append("industrytype", formValues.industrytype);
        // formData.append("companysize", formValues.companysize);
        // formData.append("hq", formValues.hq);
        // formData.append("globalpresence", formValues.globalpresence);
        // formData.append("foundedyear", formValues.foundedyear);
        // formData.append("companytype", formValues.companytype);
        // formData.append("status", "1");
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.post<any>(environment.ApiUrl + "/getsendmessagecompanytracker", formData,  {headers: headers});
    }
}
