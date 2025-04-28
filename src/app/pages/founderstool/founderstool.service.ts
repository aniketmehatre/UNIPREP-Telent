import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { ChatGPTResponse } from 'src/app/@Models/chat-gpt.model';
import { map } from 'rxjs';
import { removeExtraResponse } from '../prompt';

@Injectable({
  providedIn: 'root'
})
export class FounderstoolService {
  headers = new HttpHeaders().set("Accept", "application/json")

  constructor(private http: HttpClient) { }
  getAcademy(val: any) {
    return this.http.post<any>(environment.ApiUrl + "/founderslist", val, {
      headers: this.headers,
    });
  }

  getFounderCategory() {
    return this.http.post<any>(environment.ApiUrl + "/getfoundercategory", {
      headers: this.headers,
    });
  }

  // investor training
  getAInvestorTraining() {
    return this.http.post<any>(environment.ApiUrl + "/listinvestorpitch", {
      headers: this.headers,
    });
  }

  // startup glossary
  getStartUpGlossary(val: any) {
    return this.http.post<any>(environment.ApiUrl + "/liststartupglossary", val, {
      headers: this.headers,
    });
  }

  // entrprenuerskill
  getEntreprenuerTest(val: any) {
    return this.http.post<any>(environment.ApiUrl + "/getentrepreneurtestlist", val, {
      headers: this.headers,
    });
  }

  // quiz 
  GetQuestionsCount(data: any) {
    return this.http.post<any>(environment.ApiUrl + "/getrandomquizlh", data, {
      headers: this.headers,
    });
  }

  submitQuiz(data: any) {
    return this.http.post<any>(environment.ApiUrl + "/submitquizanswers", data, {
      headers: this.headers,
    });
  }

  ReviewQuiz(data: any) {
    return this.http.post<any>(environment.ApiUrl + "/reviewquiz", data, {
      headers: this.headers,
    });
  }

  quizCount(data: any) {
    return this.http.post<any>(environment.ApiUrl + "/getrandomquizlh", data, {
      headers: this.headers,
    });
  }

  checkModuleQuizCompletion(data: any) {
    return this.http.post<any>(environment.ApiUrl + "/checkmodulequizcompletion", data, {
      headers: this.headers,
    });
  }

  // wealth leaders
  wealthLeadersList(data: any) {
    return this.http.post<any>(environment.ApiUrl + "/getwealthleaderlist", data, {
      headers: this.headers,
    });
  }

  getCountry() {
    return this.http.get<any>(environment.ApiUrl + "/getwealthleadercountrylist", {
      headers: this.headers,
    });
  }

  wealthLeadersListquizAns(data: any) {
    return this.http.post<any>(environment.ApiUrl + "/getwealthleaderqa", data, {
      headers: this.headers,
    });
  }

  wealthLeadersquestion(data: any) {

    return this.http.post<any>(environment.ApiUrl + "/getwealthleaderquestion", data, {
      headers: this.headers,
    });
  }

  wealthLeadersans(data: any) {
    return this.http.post<any>(environment.ApiUrl + "/getwealthleaderanswer", data, {
      headers: this.headers,
    });
  }

  getFundList(val: any) {
    return this.http.post<any>(environment.ApiUrl + "/getgovernmentfundlist", val, {
      headers: this.headers,
    });
  }

  getFundType() {
    return this.http.get<any>(environment.ApiUrl + "/govtfundingtypes ", { headers: this.headers });
  }

  addFavFundData(Fund_id: any, user_id: any, fav: any) {
    let params = {
      govtfund_id: Fund_id,
      user_id: user_id,
      updateFavourite: fav
    }

    return this.http.post<any>(environment.ApiUrl + "/addGovtFundFavourite", params, {
      headers: this.headers,
    });
  }

  exportSelectedData(data: any) {
    return this.http.post<any>(environment.ApiUrl + "/exportgovernmentfunding  ", data, {
      headers: this.headers,
    });
  }

  getFundStateByCountry(countryId: number) {
    let params = new HttpParams();
    return this.http.post<any>(environment.ApiUrl + "/govtfundingRegions", {
      headers: this.headers,
      country_id: countryId
    });
  }

  getFundCountries() {
    return this.http.get<any>(environment.ApiUrl + "/govtfundingCountry", {
      headers: this.headers
    });
  }

  getCurrencyAndCountries() {
    return this.http.post<any>(environment.ApiUrl + "/getcountryandcurrency", {
      headers: this.headers
    });
  }

  getCurrenciesList() {
    return this.http.get<any>(environment.ApiUrl + "/currenciesList", {
      headers: this.headers
    });
  }

  storeRecommendation(data: any) {
    return this.http.post<any>(environment.ApiUrl + "/storeFundRec", data, {
      headers: this.headers,
    });
  }

  getRecommendations() {
    return this.http.get<any>(environment.ApiUrl + "/getFundingRec", {
      headers: this.headers,
    });
  }

  resetRecommendation() {
    return this.http.post<any>(environment.ApiUrl + "/resetScholarRec", {
      headers: this.headers,
    });
  }

  resetFundRecommendation() {
    return this.http.post<any>(environment.ApiUrl + "/resetFundRec", {
      headers: this.headers,
    });
  }

  getChatgptRecommendations(data: any) {
    return this.http.post<{ response: string }>(environment.ApiUrl + "/getIntegratedRecom", data, {
      headers: this.headers,
    }).pipe(
      map(res => ({ response: removeExtraResponse(res.response) })) // Process response before returning
    );
  }

  getCountriesList() {
    return this.http.post<any>(environment.ApiUrl + "/AllCountries", {
      headers: this.headers,
    });
  }

  getmarketingAnaylsisOptionsList() {
    return this.http.get<any>(environment.ApiUrl + "/getmarketanalysislists", {
      headers: this.headers,
    });
  }

  getLocationList() {
    return this.http.get<any>(environment.ApiUrl + "/location", {
      headers: this.headers,
    });
  }

  getAllLocationList() {
    return this.http.get<any>(environment.ApiUrl + "/getallLocations", {
      headers: this.headers,
    });
  }

  getStartUpRiskAssesmentOptionsList() {
    return this.http.get<any>(environment.ApiUrl + "/getstartupriskslists", {
      headers: this.headers,
    });
  }

  getAnalysisList(type: string) {
    return this.http.get<ChatGPTResponse>(environment.ApiUrl + `/userSavedResponse?mode=${type}`, {
      headers: this.headers,
    });
  }
  entrepreneurToolsSuccess(data: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/EntrepreneurtoolsList", data, {
        headers: headers,
    });
  }

  downloadRecommendation(data: any) {
    return this.http.post<{ url: string }>(environment.ApiUrl + "/downloadIntegratedRecom", data, {
      headers: this.headers,
    });
  }

  downloadFile(url: string): Observable<Blob> {
    const headers = new HttpHeaders();
    return this.http.get(url, { responseType: 'blob', headers: headers });
  }
}
