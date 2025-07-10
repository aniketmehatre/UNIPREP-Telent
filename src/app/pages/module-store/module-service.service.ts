import { Injectable } from '@angular/core';
import { Store } from "@ngrx/store";
import { environment } from '@env/environment';
import { emptyQuestionList, loadQuestionList, loadQuizList, loadSubModules, readQuestion } from './module-store.actions';
import { ModuleStoreState } from "./module-store.reducer";
import { readQuestion$, selectQuestionList$, selectQuizList$, selectSubModule$ } from './module-store.selectors';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Meta } from '@angular/platform-browser';
import { SubmitRecommendation, SubmitStreamResponse } from 'src/app/@Models/academic-tools.model';

@Injectable({
  providedIn: 'root'
})
export class ModuleServiceService {
  private getSubmodulesSpecialization = new BehaviorSubject<string | null>(null);
  public getSubmodulesSpecialization$: Observable<string | null> = this.getSubmodulesSpecialization.asObservable();
  constructor(
    private store: Store<ModuleStoreState>,
    private http: HttpClient,
    // private meta:Meta
  ) {
  }

  loadSubModules(data: any) {
    this.store.dispatch(loadSubModules({ countryId: data.countryId, moduleId: data.moduleId, api_module_name: data.api_module_name }));
  }

  subModuleList$() {
    return this.store.select(selectSubModule$);
  }

  loadQuestionList(data: any) {
    this.store.dispatch(loadQuestionList({
      countryId: data.countryId,
      moduleId: data.moduleId,
      submoduleId: data.submoduleId,
      page: data.page,
      perpage: data.perpage,
    }));
  }

  emptyQuestionList$() {
    this.store.dispatch(emptyQuestionList());
  }

  questionList$() {
    return this.store.select(selectQuestionList$);
  }

  quizList(data: any) {
    this.store.dispatch(loadQuizList({
      countryId: data.countryId,
      moduleId: data.moduleId,
      submoduleId: data.submoduleId
    }));
  }
  quizList$() {
    return this.store.select(selectQuizList$);
  }

  readQuestion(data: any) {
    this.store.dispatch(readQuestion({
      countryId: data.countryId,
      questionId: data.questionId,
      moduleId: data.moduleId,
      submoduleId: data.submoduleId
    }));
  }
  readQuestionMessage$() {
    return this.store.select(readQuestion$);
  }

  getReviewOrgLogo(data: any): Observable<any> {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + '/GetReviewedByOrgLogo', data, {
      headers: headers,
    });
  }

  getModuleQuestionList(data: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/getmodulequestions", data, {
      headers: headers,
    });
  }
  getPreModuleQuestionList(data: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/StudentsSubmoduleQuestions", data, {
      headers: headers,
    });
  }


  studentsSubmoduleQuestions(data: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/StudentsSubmoduleQuestions", data, {
      headers: headers,
    });
  }

  studentFullQuestionData(data: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/StudentsSubmoduleQuestions", data, {
      headers: headers,
    });
  }
  checkModuleQuizCompletion(data: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/checkmodulequizcompletion", data, {
      headers: headers,
    });
  }

  getSubmodulesAndSpecialization() {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get(environment.ApiUrl + "/getSubmodulesAndSpecialization", { headers }) 
    .pipe(
      tap((response:any) => {
        this.getSubmodulesSpecialization.next(response);
      })
    );
  }
  TransferSubmoduleAndSpecializationForGlobalSearch(): Observable<string | null> {
    return this.getSubmodulesSpecialization$
  } 
  quizCount(data: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/quizquestions", data, {
      headers: headers,
    });
  }
  submitQuiz(data: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/submitquizanswers", data, {
      headers: headers,
    });
  }
  ReviewQuiz(data: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/reviewquiz", data, {
      headers: headers,
    });
  }
  getQuizCompletion(data: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/getquizcompletion", data, {
      headers: headers,
    });
  }
  getUniversity(data: any) {
    // let params = new HttpParams();
    // params = params.append("country_id", countryId);
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/getuniversitybycountry", data, { headers: headers, });
  }
  getUserCompletedCertificate(val: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/getusercompletedcertificates", val, {
      headers: headers,
    });
  }

  getSubjectList() {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<any>(environment.ApiUrl + `/getlearninghublists?category_flag=1`, { headers: headers, });
  }
  getSpecializationLists(data: any) {
    let params = new HttpParams();
    // params = params.append("category_flag", data.category_flag);
    params = params.append("category_id", data.category_id);
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.get<any>(environment.ApiUrl + `/getlearninghublists?`, { headers: headers, params: params });
  }
  learninghubquiz(data: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/getrandomquizlh", data, {
      headers: headers,
    });
  }
  submitQuizLearningHubQuiz(data: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/submitquizanswers", data, {
      headers: headers,
    });
  }
  ReviewQuizLearningHub(data: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/reviewquiz", data, {
      headers: headers,
    });
  }
  getLanguageist() {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/getlanguages", { headers: headers, });
  }
  getLanguageistType(data: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/getlanguagetype", data, { headers: headers, });
  }
  languageghubquiz(data: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/getlanguagehubquiz", data, {
      headers: headers,
    });
  }

  submitLanguageghubquiz(data: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/submitlanguagequiz", data, {
      headers: headers,
    });
  }

  ReviewQuizLanguageHub(data: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/reviewlanguagehubquiz", data, {
      headers: headers,
    });
  }

  checklanguageQuizCompletion(data: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/languagehubquizcompletion", data, {
      headers: headers,
    });
  }

  getSkillMasteryLists(data: any) {
    let params = new HttpParams();
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/getuniversitybycountry", data, { headers: headers });
  }

  getQuizQuestionList(data: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/getacademicquiz", data, {
      headers: headers,
    });
  }
  submitAcademicQuiz(data: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/saveacademicquizanswers", data, {
      headers: headers,
    });
  }

  submitAcademicStreamQuiz(data: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<SubmitStreamResponse>(environment.ApiUrl + "/savestreamquizanswers", data, {
      headers: headers,
    });
  }

  submitAcademicRecommendationQuiz(data: any) {
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<SubmitRecommendation>(environment.ApiUrl + "/saverecommendationquizanswers", data, {
      headers: headers,
    });
  }

  reviewAcademicQuiz(data: any) {
     
    const headers = new HttpHeaders().set("Accept", "application/json");
    return this.http.post<any>(environment.ApiUrl + "/reviewacademicquiz", data, {
      headers: headers,
    });
  }
}
