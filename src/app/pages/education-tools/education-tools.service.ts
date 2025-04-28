import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { ChatGPTResponse } from 'src/app/@Models/chat-gpt.model';
import { CountryInsightPayload, CountryInsightsResponse, QuestionListSuccess, QuestionsListPayLoad } from 'src/app/@Models/country-insights.model';
import { EducatiionsRec,CourseNavigator } from 'src/app/@Models/course-navigator.model';
import { CountryAndUniversity } from 'src/app/@Models/education-tools.model';
import { map } from 'rxjs';
import { removeExtraResponse } from '../prompt';

@Injectable({
  providedIn: 'root'
})
export class EducationToolsService {

  headers = new HttpHeaders().set("Accept", "application/json");

  constructor(
    private http: HttpClient
  ) { }

  getCurrentSpecializations() { // course navigator module service
    return this.http.get<{ id: number, specialization_name: string }[]>(environment.ApiUrl + "/getcurrentspecialization", {
      headers: this.headers,
    });
  }

  getcareerPlannerSpec(){
    return this.http.get<{ id: number, specialization_name: string }[]>(environment.ApiUrl + "/getCareerSpecialization", {
      headers: this.headers,
    });
  }

  getDegreeRecommadations(data: any) {
    return this.http.get<EducatiionsRec[]>(`${environment.ApiUrl}/getDegrees?spec_id=${data.spec_id}`, {
      headers: this.headers,
    });
  }

  getEduSavedRecommadations(data: any) {
    return this.http.post<any>(environment.ApiUrl + "/getEduSavedRecommadations", {
      headers: this.headers,
    });
  }

  getCountry() {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<any>(environment.ApiUrl + "/govtfundingCountry", {
      headers: headers,
    });
  }

  getPoliticiansListByCountry(data: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/getpoliticianslist", data, {
      headers: headers,
    });
  }

  getQuestionsListByPolitician(data: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/getpoliticianquestionlists", data, {
      headers: headers,
    });
  }

  getCountryInsightsList(req: CountryInsightPayload): Observable<CountryInsightsResponse> {
    let params = {
      page: req.page,
      perpage: req.perpage,
    };
    return this.http.post<CountryInsightsResponse>(environment.ApiUrl + `/getcountryinsightslists`, params)
  }

  getQuizQuestion(req: QuestionsListPayLoad): Observable<QuestionListSuccess> {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<QuestionListSuccess>(environment.ApiUrl + '/showcountryinsight', req, {
      headers: headers,
    });
  }
  
  // getCourseQandA(degree_id: number) {
  getCourseQandA(degreeId: number,courseId: number, questionId?: number) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    let params = new HttpParams().set('degree_id', degreeId).set('course_id', courseId);
    if (questionId) {
      params = params.set('question_id', questionId);
    }
    return this.http.get<CourseNavigator[]>(`${environment.ApiUrl}/getCourseQandA`, {
      headers, params
    });
  }

  addCNUserQuestions(data: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<{ message: string, status: boolean }>(environment.ApiUrl + "/addCNUserQuestions", data, {
      headers: headers,
    });
  }

  getCNUserSavedQuestions() {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<CourseNavigator[]>(`${environment.ApiUrl}/getCNUserSavedQuestions`, {
      headers: headers,
    });
  }

  getDropdownValues(){
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<CountryAndUniversity>(`${environment.ApiUrl}/getDropdownValues`, {
      headers: headers,
    });
  }

  saveResponse(data: any){
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(`${environment.ApiUrl}/saveResponse`, data ,{
      headers: headers
    });
  }

  getSavedRes(){
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<any>(`${environment.ApiUrl}/getBudgetPlannerSavedRes`, {
      headers: headers
    });
  }

  getCountryList() {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<any>(`${environment.ApiUrl}/countrydropdown`, {
      headers: headers
    });
  }

  getPoliticianCountryList() {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<any>(`${environment.ApiUrl}/politiciandropdownlist`, {
      headers: headers
    });
  }

  getUniverstityByCountry(country_id: string) {
    return this.http.post<any>(`${environment.ApiUrl}/getunviersity`, {
      country_id: country_id
    });
  }

  getPoliticianDropDownList(country_id: string) {
    return this.http.post<any>(`${environment.ApiUrl}/listsfordropdown`, {
      country: country_id
    });
  }

  // getCourseListBoxDropdown() {
  //   return this.http.post<any>(environment.ApiUrl + "/CourseListSelectBox", {
  //     headers: this.headers,
  //   });
  // }


  getCountries() {
    return this.http.post<any>(environment.ApiUrl + "/getcountryandcurrency", {
      headers: this.headers
    });
  }

  getCurrencies() {
    return this.http.get<any>(environment.ApiUrl + "/currenciesList", {
      headers: this.headers
    });
  }

  getChatgptRecommendations(data: any) {
    return this.http.post<{ response: string }>(environment.ApiUrl + "/getIntegratedRecom", data, {
      headers: this.headers,
    }).pipe(
      map(res => ({ response: removeExtraResponse(res.response) })) // Process response before returning
    );
  }

  getAnalysisList(type: string) {
    return this.http.get<ChatGPTResponse>(environment.ApiUrl + `/userSavedResponse?mode=${type}`, {
      headers: this.headers,
    });
  }

  resetRecommendation() {
    return this.http.post<any>(environment.ApiUrl + "/resetScholarRec", {
      headers: this.headers,
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

  unifinderCountries(){
    return this.http.get<any>(environment.ApiUrl + `/courseCountries`, {
      headers: this.headers,
    });
  }

  courseNameList(universityId: number){
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<any>(environment.ApiUrl + `/getCourseNameList?universityId=${universityId}`, {
        headers: headers,
    });
  }
}
