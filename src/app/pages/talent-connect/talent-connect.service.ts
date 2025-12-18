import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "@env/environment";
import {
  BehaviorSubject,
  catchError,
  Observable,
  shareReplay,
  tap,
  throwError,
} from "rxjs";
import { map } from "rxjs";
import { removeExtraResponse } from "../../@Supports/prompt";
import {
  EmployeeConnectProfile,
  EmployeeConnectProfileRes,
} from "src/app/@Models/employee-connect-profile";
import { Departments } from "src/app/@Models/user-profile.model";

@Injectable({
  providedIn: "root",
})
export class TalentConnectService {
  headers = new HttpHeaders().set("Accept", "application/json");
  apiUrlCurrencyConversion =
    "https://currency-conversion-and-exchange-rates.p.rapidapi.com/timeseries";
  currencyHeaders = new HttpHeaders({
    "x-rapidapi-host": "currency-conversion-and-exchange-rates.p.rapidapi.com",
    "x-rapidapi-key": "d08adbb963msh135bd172e57612cp19ee92jsna8b68088b175",
  });
  _employerProfileData!: EmployeeConnectProfile | null;
  employerProfileCompleted$ = new BehaviorSubject<boolean>(false);
  whyPremiumModal$ = new BehaviorSubject<boolean>(false);

  // API Cache Variables
  myProfileDropDownValuesDataCache$: Observable<any> | null = null;
  workLocationDataCache$: Observable<any> | null = null;
  easyAppyDropdownDataCache$: Observable<any> | null = null;

  constructor(private http: HttpClient) {}

  openModal() {
    this.whyPremiumModal$.next(true);
  }

  closeModal() {
    this.whyPremiumModal$.next(false);
  }

  //Profile Creation
  getMyProfileData(token?: string) {
    //  The token is not taken by the public route (login). that's why this header added for manually for after getMe Api call
    let headers = new HttpHeaders()
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${token}`);

    const request$ = this.http
      .get<EmployeeConnectProfileRes>(
        environment.ApiUrl + "/getstudentprofiles",
        { headers: token ? headers : this.headers }
      )
      .pipe(
        map((response) => {
          if (response?.data?.length > 0) {
            this._employerProfileData = response.data[0];
          }
          return response;
        }),
        catchError((error) => {
          this._employerProfileData = null;
          return throwError(() => error);
        })
      );
    return request$;
  }

  getAiSummaryByMode(mode: string, data: any) {
    return this.http.post<any>(environment.ApiUrl + `/yourprofileaigenerate`, {
      mode: mode,
      ...data,
    });
  }

  getMyProfileDropDownValues() {
    if (!this.myProfileDropDownValuesDataCache$) {
      this.myProfileDropDownValuesDataCache$ = this.http
        .get<any>(environment.ApiUrl + "/getyourprofiledropdownvalues", {
          headers: this.headers,
        })
        .pipe(shareReplay(1));
    }
    return this.myProfileDropDownValuesDataCache$;
  }

  profileCreationBasicInfo(formData: any) {
    return this.http.post<{ message: String; student_id: number }>(
      `${environment.ApiUrl}/studentprofile/basic`,
      formData
    );
  }

  profileCreationEducationInfo(formData: any) {
    return this.http.post(
      `${environment.ApiUrl}/studentprofile/education`,
      formData
    );
  }

  profileCreationExperienceInfo(formData: any) {
    return this.http.post(
      `${environment.ApiUrl}/studentprofile/experience`,
      formData
    );
  }

  profileCreationCareerInfo(formData: any) {
    return this.http.post(
      `${environment.ApiUrl}/studentprofile/career`,
      formData
    );
  }

  profileCreationCertificateInfo(formData: any) {
    return this.http.post(
      `${environment.ApiUrl}/studentprofile/certificate`,
      formData
    );
  }

  profileCreationLanguageInfo(formData: any) {
    return this.http.post(
      `${environment.ApiUrl}/studentprofile/language`,
      formData
    );
  }

  profileCreationNetworkInfo(formData: any) {
    return this.http.post(
      `${environment.ApiUrl}/studentprofile/network`,
      formData
    );
  }

  profileCreationReferenceInfo(formData: any) {
    return this.http.post(
      `${environment.ApiUrl}/studentprofile/reference`,
      formData
    );
  }

  getStudentProfilesUsingId(id: number) {
    return this.http.get<any>(
      `${environment.ApiUrl}/getstudentprofilesusingid?student_id=${id}`
    );
  }

  getCountries() {
    return this.http.post<any>(environment.ApiUrl + "/getcountryandcurrency", {
      headers: this.headers,
    });
  }

  getCityCountries(search?: string) {
    return this.http.get<any>(
      environment.ApiUrl + `/getworldcitiescountry?search=${search ?? ""}`
    );
  }

  getEasyApplyWorkLocationList() {
    if (!this.workLocationDataCache$) {
      this.workLocationDataCache$ = this.http
        .get<any>(environment.ApiUrl + "/employer/easyappyworklocations", {
          headers: this.headers,
        })
        .pipe(shareReplay(1));
    }
    return this.workLocationDataCache$;
  }

  //Easy-Apply
  getJobListDropdown() {
    if (!this.easyAppyDropdownDataCache$) {
      this.easyAppyDropdownDataCache$ = this.http
        .get<any>(environment.ApiUrl + "/employer/easyappydropdownlist", {
          headers: this.headers,
        })
        .pipe(shareReplay(1));
    }
    return this.easyAppyDropdownDataCache$;
  }

  getJobList(data: any) {
    return this.http.post<any>(environment.ApiUrl + "/getuserJobList", data, {
      headers: this.headers,
    });
  }

  getJobDetails(id: number) {
    return this.http.post<any>(
      environment.ApiUrl + "/showuserJobs",
      { id: id },
      { headers: this.headers }
    );
  }

  applyJob(id: number) {
    return this.http.post<any>(
      environment.ApiUrl + "/saveeasyapplyjob",
      { job_id: id },
      { headers: this.headers }
    );
  }

  getAppliedJobList(data: any) {
    return this.http.post<any>(environment.ApiUrl + "/getusertracklist", data, {
      headers: this.headers,
    });
  }

  getJobTrackerDetail(id: number) {
    return this.http.post<any>(
      environment.ApiUrl + "/showuserTrack",
      { id: id },
      { headers: this.headers }
    );
  }

  sendMessage(formData: FormData) {
    return this.http.post<any>(environment.ApiUrl + "/sendMessage", formData, {
      headers: this.headers,
    });
  }

  getMessage(data: { job_id: number }) {
    return this.http.post<any>(environment.ApiUrl + "/getMessage", data, {
      headers: this.headers,
    });
  }

  getDepartmentData() {
    return this.http.get<any>(environment.ApiUrl + "/getdepartments", {
      headers: this.headers,
    });
  }

  getJobAiSummary(data: any) {
    return this.http.post<any>(
      environment.ApiUrl + "/jobChatAiGenerate",
      data,
      { headers: this.headers }
    );
  }

  getUUID(jobId: any) {
    const formData = new FormData();
    formData.append("job_id", jobId);
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(
      `${environment.ApiUrlEmployer}/getJobShareLink`,
      formData,
      { headers: headers }
    );
  }

  getCompanyChatAiSummary(data: any) {
    return this.http.post<any>(environment.ApiUrl + "/airephrase", data, {
      headers: this.headers,
    });
  }

  followCompany(companyId: any, followStatus: number): Observable<any> {
    const formData = new FormData();
    formData.append("companyId", companyId);
    formData.append("follow_status", followStatus.toString());
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(
      environment.ApiUrl + "/shortlistcompany",
      formData,
      { headers: headers }
    );
  }

  getTalentConnectCompanies(formValues: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(
      environment.ApiUrl + "/gettalentconnectcompanies",
      formValues,
      { headers: headers }
    );
  }

  getCompanyDetails(id: any) {
    const formData = new FormData();
    formData.append("id", id);
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(
      environment.ApiUrl + "/getcompanydetails",
      formData,
      { headers: headers }
    );
  }

  getCompanyTypes() {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<any>(environment.ApiUrl + "/getcompanytypes", {
      headers: headers,
    });
  }

  getIndustryTypes() {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<any>(environment.ApiUrl + "/getindustrytypes", {
      headers: headers,
    });
  }

  getCompanySizes() {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<any>(environment.ApiUrl + "/getcompanysize", {
      headers: headers,
    });
  }

  globalPresence() {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(
      environment.ApiUrlEmployer + "/globalPresence",
      {},
      { headers: headers }
    );
  }

  getCityWithFlag() {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(
      environment.ApiUrlEmployer + "/getcitywithflag",
      {},
      { headers: headers }
    );
  }

  getCurrencies() {
    return this.http.get<any>(environment.ApiUrl + "/currenciesList", {
      headers: this.headers,
    });
  }

  getChatMessageForCompanyConnect(companyId: any) {
    const formData = new FormData();
    formData.append("companyid", companyId);
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(
      environment.ApiUrl + "/getchatmessages",
      formData,
      { headers: headers }
    );
  }

  // sendcompanyconnectusermessage
  sendCompanyConnectUserMessage(formDataValue: any) {
    const formData = new FormData();
    formData.append("company_id", formDataValue.company_id);
    formData.append("chat", formDataValue.chat);
    formData.append("attachment", formDataValue.attachment);
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(
      environment.ApiUrl + "/sendcompanyconnectusermessage",
      formData,
      { headers: headers }
    );
  }

  //getcompanytracker
  getCompanyTracker(formValues: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(
      environment.ApiUrl + "/getcompanytracker",
      formValues,
      { headers: headers }
    );
  }

  getShortListedCompanyList(formValues: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(
      environment.ApiUrl + "/getshortlistedcompanytracker",
      formValues,
      { headers: headers }
    );
  }

  getReceivedMessageCompanyTracker(formValues: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(
      environment.ApiUrl + "/getreceievedmessagecompanytracker",
      formValues,
      { headers: headers }
    );
  }

  getSendMessageCompanyTracker(formValues: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(
      environment.ApiUrl + "/getsendmessagecompanytracker",
      formValues,
      { headers: headers }
    );
  }

  getAiEvaluationSummary(formData: any) {
    return this.http
      .post<any>(environment.ApiUrl + "/getIntegratedRecom", formData, {
        headers: this.headers,
      })
      .pipe(
        map((res) => ({
          response: removeExtraResponse(res.response),
          profile_percent: res.profile_percent,
        })) // Process response before returning
      );
  }

  getCompanyConnectAiSummary(formData: any) {
    return this.http.post<any>(
      environment.ApiUrl + "/companyChatAiGenerate",
      formData,
      { headers: this.headers }
    );
  }

  getCurrencyConverter(
    base: string = "USD",
    symbols: string = "INR",
    start: string = "2025-05-11",
    end: string = "2025-05-12"
  ) {
    const url = `${this.apiUrlCurrencyConversion}?start_date=${start}&end_date=${end}&base=${base}&symbols=${symbols}`;
    return this.http.get(url, { headers: this.currencyHeaders });
  }

  markReadMessage(data: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/readMessage", data, {
      headers: headers,
    });
  }

  getDepartments() {
    return this.http.get<Departments[]>(environment.ApiUrl + `/getdepartments`);
  }

  generateUUIDLink(companyId: number): Observable<{ uuid: string }> {
    return this.http.post<{ uuid: string }>("/api/generate-link", {
      companyId,
    });
  }

  sendWatsappMess(data: { template_name: string }) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(
      environment.ApiUrl + "/sendWhatsappMessage",
      data,
      { headers: headers }
    );
  }

  // Docs Wallet API's Start
  getDocsFilter(tab: string) {
    return this.http.get<any>(environment.ApiUrl + `/getallfiles?tab=${tab}`);
  }

  getDocsUploadedFiles() {
    return this.http.get<any>(environment.ApiUrl + `/getuploadedfiles`);
  }

  uploadDocsWallet(formData: any) {
    return this.http.post(`${environment.ApiUrl}/uploaddoc`, formData);
  }

  favouriteDocsWalletFile(data: any) {
    return this.http.post<any>(`${environment.ApiUrl}/savefavourite`, data);
  }

  renameDocsWalletFile(data: any) {
    return this.http.post<any>(`${environment.ApiUrl}/renamefile`, data);
  }

  downloadDocsWalletFile(file_id: string): Observable<Blob> {
    return this.http.get(
      environment.ApiUrl + `/docdownload?file_id=${file_id}`,
      {
        responseType: "blob",
      } as const
    );
  }

  deleteDocsWalletFile(data: any) {
    return this.http.post(`${environment.ApiUrl}/deletedocfile`, data);
  }

  placeCareerCoachOrder(req: any) {
    return this.http.post<any>(
      `${environment.ApiUrl}/career-coach-place-order`,
      req
    );
  }

  placeCareerCoachOrderStripe(req: any) {
    return this.http.post<any>(
      `${environment.ApiUrl}/career-coach-stripe-order`,
      req
    );
  }

  completeCareerCoachPayment(req: any) {
    return this.http.post(
      `${environment.ApiUrl}/career-coach-complete-payment`,
      req
    );
  }

   completeCareerCoachPaymentStripe(req: any) {
    return this.http.post(
      `${environment.ApiUrl}/career-coach-stripe-payment`,
      req
    );
  }

  careerCoachhistories(data: any) {
    return this.http.post<any>(
      `${environment.ApiUrl}/career-coach-histories`,
      data
    );
  }
  supportDropdown(): Observable<any> {
    return this.http.get(environment.ApiUrl + `/career-coach-dropdowns`);
  }

  postJobShareData(req: any) {
    return this.http.post<any>(`${environment.ApiUrl}/job-share-url`, req);
  }

  getJobShareData(req: any) {
    return this.http.post<any>(`${environment.ApiUrl}/get-job-share-url`, req);
  }
    careerCoachCal(data: any,country: any) {
      return this.http.post<any>(
          `${environment.ApiUrl}/career-coach-cal-amount`,
          { data,country }
      );
  }

}
