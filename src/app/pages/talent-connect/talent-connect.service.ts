import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs';
import { removeExtraResponse } from '../prompt';
import { EmployeeConnectProfileRes } from 'src/app/@Models/employee-connect-profile';
import { Departments } from 'src/app/@Models/user-profile.model';

@Injectable({
    providedIn: 'root'
})
export class TalentConnectService {
    headers = new HttpHeaders().set("Accept", "application/json");
    apiUrlCurrencyConversion = 'https://currency-conversion-and-exchange-rates.p.rapidapi.com/timeseries';
    currencyHeaders = new HttpHeaders({
        'x-rapidapi-host': 'currency-conversion-and-exchange-rates.p.rapidapi.com',
        'x-rapidapi-key': 'd08adbb963msh135bd172e57612cp19ee92jsna8b68088b175'
    });

    constructor(private http: HttpClient) { }


    getCountries() {
        return this.http.post<any>(environment.ApiUrl + "/getcountryandcurrency", {
            headers: this.headers
        });
    }

    getCityCountries(search?: string) {
        return this.http.get<any>(environment.ApiUrl + `/getworldcitiescountry?search=${search ?? ''}`);
    }

    getAiSummaryByMode(mode: string, data: any) {
        return this.http.post<any>(environment.ApiUrl + `/yourprofileaigenerate`, { mode: mode, ...data });
    }

    getEasyApplyWorkLocationList() {
        return this.http.get<any>(environment.ApiUrl + "/employer/easyappyworklocations", {
            headers: this.headers
        });
    }

    //Easy-Apply
    getJobListDropdown() {
        return this.http.get<any>(
            environment.ApiUrl + "/employer/easyappydropdownlist",
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

    sendMessage(formData: FormData) {
        return this.http.post<any>(
            environment.ApiUrl + "/sendMessage", formData,
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
        return this.http.get<EmployeeConnectProfileRes>(
            environment.ApiUrl + "/getstudentprofiles",
            { headers: this.headers });
    }

    getDepartmentData() {
        return this.http.get<any>(
            environment.ApiUrl + "/getdepartments",
            { headers: this.headers });
    }

    submitProfile(formData: any): Observable<any> {
        return this.http.post(`${environment.ApiUrl}/createstudentprofile`, formData);
    }

    updateProfile(formData: any): Observable<any> {
        return this.http.post(`${environment.ApiUrl}/updatestudentprofile`, formData);
    }

    getJobAiSummary(data: any) {
        return this.http.post<any>(
            environment.ApiUrl + "/jobChatAiGenerate", data,
            { headers: this.headers });
    }

    getCompanyChatAiSummary(data: any) {
        return this.http.post<any>(
            environment.ApiUrl + "/airephrase", data,
            { headers: this.headers });
    }



    // short list company
    shortListCompany(companyId: any): Observable<any> {
        const formData = new FormData();
        formData.append("companyId", companyId);
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.post<any>(environment.ApiUrl + "/shortlistcompany", formData, { headers: headers });
    }

    // company connect
    getTalentConnectCompanies(formValues: any) {
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.post<any>(
            environment.ApiUrl + "/gettalentconnectcompanies", formValues,
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
        return this.http.get<any>(environment.ApiUrl + "/getcompanytypes", { headers: headers });
    }

    // getindustrytypes
    getIndustryTypes() {
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.get<any>(environment.ApiUrl + "/getindustrytypes", { headers: headers });
    }

    // getcompanysize
    getCompanySizes() {
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.get<any>(environment.ApiUrl + "/getcompanysize", { headers: headers });
    }

    // globalPresence
    globalPresence() {
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.post<any>(environment.ApiUrlEmployer + "/globalPresence", {}, { headers: headers });
    }

    // getcitywithflag
    getCityWithFlag() {
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.post<any>(environment.ApiUrlEmployer + "/getcitywithflag", {}, { headers: headers });
    }

    // follow company
    followCompany(companyId: any) {
        const formData = new FormData();
        formData.append("companyId", companyId);
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.post<any>(environment.ApiUrl + "/followcompany", formData, { headers: headers });
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
        return this.http.post<any>(environment.ApiUrl + "/getchatmessages", formData, { headers: headers });
    }

    // sendcompanyconnectusermessage
    sendCompanyConnectUserMessage(formDataValue: any) {
        const formData = new FormData();
        formData.append("company_id", formDataValue.company_id);
        formData.append("chat", formDataValue.chat);
        formData.append("attachment", formDataValue.attachment);
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.post<any>(environment.ApiUrl + "/sendcompanyconnectusermessage", formData, { headers: headers });
    }


    //getcompanytracker
    getCompanyTracker(formValues: any) {
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.post<any>(environment.ApiUrl + "/getcompanytracker", formValues, { headers: headers });
    }

    getShortListedCompanyList(formValues: any) {
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.post<any>(environment.ApiUrl + "/getshortlistedcompanytracker", formValues, { headers: headers });
    }

    getReceivedMessageCompanyTracker(formValues: any) {
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.post<any>(environment.ApiUrl + "/getreceievedmessagecompanytracker", formValues, { headers: headers });
    }


    getSendMessageCompanyTracker(formValues: any) {
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.post<any>(environment.ApiUrl + "/getsendmessagecompanytracker", formValues, { headers: headers });
    }

    getStudentProfilesUsingId(id: string) {
        let params = new HttpParams()
            .set('student_id', id);
        return this.http.get<any>(
            environment.ApiUrl + "/getstudentprofilesusingid", { params },);
    }

    getAiEvaluationSummary(formData: any) {
        return this.http.post<any>(environment.ApiUrl + "/getIntegratedRecom", formData, { headers: this.headers }).pipe(
            map(res => ({ response: removeExtraResponse(res.response), profile_percent: res.profile_percent })) // Process response before returning
        );
    }

    getCompanyConnectAiSummary(formData: any) {
        return this.http.post<any>(
            environment.ApiUrl + "/companyChatAiGenerate", formData,
            { headers: this.headers });
    }

    getCurrencyConverter(base: string = 'USD', symbols: string = 'INR', start: string = '2025-05-11', end: string = '2025-05-12') {
        const url = `${this.apiUrlCurrencyConversion}?start_date=${start}&end_date=${end}&base=${base}&symbols=${symbols}`;
        return this.http.get(url, { headers: this.currencyHeaders });
    }

    markReadMessage(data: any) {
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.post<any>(environment.ApiUrl + "/readMessage", data, { headers: headers });
    }

    getDepartments() {
        return this.http.get<Departments[]>(environment.ApiUrl + `/getdepartments`);
    }
}
