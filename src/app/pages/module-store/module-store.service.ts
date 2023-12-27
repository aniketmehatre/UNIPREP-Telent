import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "@env/environment";
import {ModuleList} from "../../@Models/module.model";
import {QuestionList} from "../../@Models/question-list.model";
import {ListQuiz} from "../../@Models/list-quiz.model";


@Injectable({providedIn: 'root'})
export class ModuleStoreService {
    constructor(private http: HttpClient) {
    }

    loadSubModules(params: {
        countryId: number,
        moduleId: number
        api_module_name: string
    }): Observable<any> {
        let request = {
            countryId: params.countryId,
            moduleId: params.moduleId
        }
        let body = new FormData();
        body.append('countryId', params.countryId.toString());
        body.append('moduleId', params.moduleId.toString());
        let apiName = 'SubmoduleListForStudents';
        return this.http.post<any>(environment.ApiUrl + `/${apiName}`, body);
    }

    loadSubModuleData(params: any) {
        let body = new FormData();
        body.append('countryId', params.countryId.toString());
        body.append('moduleId', params.moduleId.toString());
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.post<any>(environment.ApiUrl + "/GetSubModulesList",
            body, {
            headers: headers,
        });
    }

    loadQuestionList(
        params: {
            countryId: number,
            moduleId: number,
            submoduleId: number
        }
    ): Observable<QuestionList> {
        let request = {
            countryId: params.countryId,
            moduleId: params.moduleId,
            submoduleId: params.submoduleId
        }
        return this.http.post<QuestionList>(environment.ApiUrl + "/getmodulequestions", request);
    }

    loadQuizList(
        params: {
            countryId: number,
            moduleId: number,
            submoduleId: number
        }
    ): Observable<ListQuiz> {
        let request = {
            countryId: params.countryId,
            moduleId: params.moduleId,
            submoduleId: params.submoduleId
        }
        return this.http.post<ListQuiz>(environment.ApiUrl + "/quizquestions", request);
    }

    readQuestion(params: {
        countryId: number,
        questionId: number,
        moduleId: number,
        submoduleId: number
    }): Observable<any> {
        let data = {
            countryId: params.countryId,
            questionId: params.questionId,
            moduleId: params.moduleId,
            submoduleId: params.submoduleId
        }
        return this.http.post<any>(environment.ApiUrl + "/markread", data);
    }

    GetReviewedByOrgLogo(params: {
        question_id: number,
    }): Observable<any> {
        let data = {
            question_id: params.question_id,
        }
        return this.http.post<any>(environment.ApiUrl + "/GetReviewedByOrgLogo", data);
    }
}